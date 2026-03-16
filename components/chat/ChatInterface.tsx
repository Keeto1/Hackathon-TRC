'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import MessageBubble from './MessageBubble';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading?: boolean;
  conversationTitle?: string;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  conversationTitle = 'Chat',
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || localLoading || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setLocalLoading(true);

    try {
      await onSendMessage(userMessage);
    } finally {
      setLocalLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card">
        <h2 className="text-lg font-semibold text-foreground">{conversationTitle}</h2>
        <p className="text-xs text-muted-foreground">AI Buddy is here to listen and support you</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">💙</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Start your conversation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Share what&apos;s on your mind and I&apos;ll listen and support you
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {localLoading && (
          <div className="flex justify-start">
            <div className="bg-card text-card-foreground border border-border rounded-lg rounded-bl-none px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Share how you're feeling..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={localLoading || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!input.trim() || localLoading || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
