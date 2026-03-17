"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout as logoutUser } from '@/lib/auth';
import { User } from '@/lib/auth';
import { Conversation, Message } from '@/lib/types';
import { getConversations, createConversation, getMessages, addMessage, updateConversation, detectCrisis, addMoodEntry, addCrisisAlert } from '@/lib/db';
import { getAIResponse } from '@/lib/ai';
import ChatInterface from '@/components/chat/ChatInterface';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import MoodTracker from '@/components/chat/MoodTracker';
import CrisisAlert from '@/components/chat/CrisisAlert';
import { Button } from '@/components/ui/button';
import { Menu, Settings } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [crisisAlertData, setCrisisAlertData] = useState<{ severity: 'low' | 'medium' | 'high'; keywords: string[] }>({
    severity: 'low',
    keywords: [],
  });

  function handleDeleteConversation(id: string) {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        const conversations = localStorage.getItem('campus_ai_buddy_conversations');
        if (conversations) {
          const all = JSON.parse(conversations);
          delete all[id];
          localStorage.setItem('campus_ai_buddy_conversations', JSON.stringify(all));
        }
        // Also remove messages for this conversation
        const messages = localStorage.getItem('campus_ai_buddy_messages');
        if (messages) {
          const allMsgs = JSON.parse(messages);
          Object.keys(allMsgs).forEach((mid) => {
            if (allMsgs[mid].conversationId === id) delete allMsgs[mid];
          });
          localStorage.setItem('campus_ai_buddy_messages', JSON.stringify(allMsgs));
        }
      }
      // If the deleted conversation was active, switch to another
      setActiveConversation((prevActive) => {
        if (!prevActive || prevActive.id !== id) return prevActive;
        if (updated.length > 0) {
          setMessages(getMessages(updated[0].id));
          return updated[0];
        } else {
          setMessages([]);
          return null;
        }
      });
      return updated;
    });
  }

  // Check auth and load initial data
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    setUser(currentUser);
    const userConversations = getConversations(currentUser.id);
    setConversations(userConversations);

    // Load or create initial conversation
    if (userConversations.length > 0) {
      setActiveConversation(userConversations[0]);
      setMessages(getMessages(userConversations[0].id));
    } else {
      const newConv = createConversation(currentUser.id);
      setConversations([newConv]);
      setActiveConversation(newConv);
    }
  }, [router]);

  function getFallbackTitle(prompt: string) {
    const trimmed = prompt.trim().replace(/\s+/g, ' ');
    const words = trimmed.split(' ').filter(Boolean);
    return words.length > 0 ? words.slice(0, 6).join(' ') : 'New Conversation';
  }

  async function handleSendMessage(content: string) {
    if (!user || !activeConversation) return;

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    // Add user message and include it in the context sent to the AI
    const userMessage = addMessage(activeConversation.id, 'user', trimmedContent);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // If this is a brand new conversation (default title), attempt to rename it using Deepseek
    const isDefaultTitle = activeConversation.title === 'New Conversation';
    if (isDefaultTitle) {
      try {
        const resp = await fetch('/api/deepseek', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: trimmedContent }),
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data?.title) {
            const updated = updateConversation(activeConversation.id, data.title);
            if (updated) {
              setActiveConversation(updated);
              setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            }
          }
        } else {
          console.warn('Deepseek rename failed', resp.status, resp.statusText);
          // Keep the default title or fallback to a short prompt snippet.
          const fallbackTitle = getFallbackTitle(trimmedContent);
          updateConversation(activeConversation.id, fallbackTitle);
          setActiveConversation((prev) => (prev ? { ...prev, title: fallbackTitle } : prev));
          setConversations((prev) => prev.map((c) => (c.id === activeConversation.id ? { ...c, title: fallbackTitle } : c)));
        }
      } catch (error) {
        console.warn('Could not rename conversation:', error);
        const fallbackTitle = getFallbackTitle(trimmedContent);
        updateConversation(activeConversation.id, fallbackTitle);
        setActiveConversation((prev) => (prev ? { ...prev, title: fallbackTitle } : prev));
        setConversations((prev) => prev.map((c) => (c.id === activeConversation.id ? { ...c, title: fallbackTitle } : c)));
      }
    }

    // Check for crisis keywords
    const { isCrisis, keywords, severity } = detectCrisis(content);
    if (isCrisis) {
      addCrisisAlert(user.id, activeConversation.id, keywords, severity);
      setCrisisAlertData({ severity, keywords });
      setShowCrisisAlert(true);
    }

    setLoading(true);

    try {
      const response = await getAIResponse(updatedMessages);

      if (response.error) {
        console.error('AI Error:', response.error);
        // Show error message in chat
        const errorMessage = addMessage(
          activeConversation.id,
          'assistant',
          "I apologize, but I had trouble responding. Please try again."
        );
        setMessages((prev) => [...prev, errorMessage]);
      } else if (typeof response.content === 'string' && response.content.trim().length > 0) {
        // Split longer AI replies into multiple chunks so it feels more natural.
        const splitIntoChunks = (text: string, maxChunks = 3) => {
          const parts = text
            .match(/[^.!?]+[.!?]*\s*/g)
            ?.map((p) => p.trim())
            .filter(Boolean) ?? [text.trim()];

          if (parts.length <= maxChunks) return parts;
          const chunkSize = Math.ceil(parts.length / maxChunks);
          const chunks: string[] = [];
          for (let i = 0; i < maxChunks; i++) {
            const slice = parts.slice(i * chunkSize, (i + 1) * chunkSize);
            if (slice.length) chunks.push(slice.join(' ').trim());
          }
          return chunks;
        };

        const chunks = splitIntoChunks(response.content, 3);
        for (let i = 0; i < chunks.length; i++) {
          const aiMessage = addMessage(activeConversation.id, 'assistant', chunks[i]);
          setMessages((prev) => [...prev, aiMessage]);

          // Add a small pause between chunks so it feels more “typing”.
          if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  function handleNewConversation() {
    if (!user) return;
    const newConv = createConversation(user.id);
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv);
    setMessages([]);
    setSidebarOpen(false);
  }

  function handleSelectConversation(id: string) {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConversation(conv);
      setMessages(getMessages(id));
    }
  }

  function handleLogout() {
    logoutUser();
    router.push('/auth');
  }

  function handleMoodSubmit(mood: string, intensity: number, notes?: string) {
    if (!user || !activeConversation) return;
    addMoodEntry(user.id, activeConversation.id, mood as any, intensity, notes);
    setShowMoodTracker(false);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <h1 className="font-bold text-lg">Campus AI Buddy</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className="md:w-64 md:border-r md:border-border">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onLogout={handleLogout}
          onDeleteConversation={handleDeleteConversation}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeConversation ? (
          <>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={loading}
              conversationTitle={activeConversation.title}
            />

            {/* Actions Bar */}
            <div className="border-t border-border p-4 bg-card flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setShowMoodTracker(true)}>
                Log Mood
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/chat/settings')}
                className="ml-auto"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <MoodTracker isOpen={showMoodTracker} onClose={() => setShowMoodTracker(false)} onSubmit={handleMoodSubmit} />
      <CrisisAlert
        isOpen={showCrisisAlert}
        onClose={() => setShowCrisisAlert(false)}
        severity={crisisAlertData.severity}
        keywords={crisisAlertData.keywords}
      />
    </div>
  );
}
