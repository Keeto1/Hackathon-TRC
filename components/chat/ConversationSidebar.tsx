'use client';

import { Conversation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Menu, X, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onLogout: () => void;
  onDeleteConversation?: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onShowMoodTracker?: () => void;
  onShowSettings?: () => void;
  onShowMoodTrends?: () => void;
}

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onLogout,
  onDeleteConversation,
  isOpen = true,
  onClose,
  onShowMoodTracker = () => {},
  onShowSettings = () => {},
  onShowMoodTrends = () => {},
}: ConversationSidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-sidebar text-sidebar-foreground w-64 border-r border-sidebar-border flex flex-col transition-transform duration-300 z-40 md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between gap-2">
        <h1 className="font-bold text-lg">AI Buddy</h1>
        <div className="flex items-center gap-1">
          {/* Settings and Mood buttons on mobile */}
          <button
            onClick={onShowMoodTracker}
            className="md:hidden p-1 rounded hover:bg-accent"
            title="Log Mood"
          >
            <span role="img" aria-label="mood">😊</span>
          </button>
          <button
            onClick={onShowSettings}
            className="md:hidden p-1 rounded hover:bg-accent"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* New Chat Button and Settings/Mood on desktop */}
      <div className="p-4 flex flex-col gap-2">
        <Button onClick={onNewConversation} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        <Button onClick={onShowMoodTracker} className="w-full gap-2 hidden md:flex" variant="outline" size="sm">
          <span role="img" aria-label="mood">😊</span>
          Log Mood
        </Button>
        <Button onClick={onShowSettings} className="w-full gap-2 hidden md:flex" variant="outline" size="sm">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
        <Button onClick={onShowMoodTrends} className="w-full gap-2 hidden md:flex" variant="outline" size="sm">
          📈
          Mood Trends
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {conversations.length === 0 ? (
          <p className="text-sm text-sidebar-foreground/60 p-3">No conversations yet</p>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center group w-full px-3 py-2 rounded-lg transition-colors text-sm truncate cursor-pointer ${
                activeConversationId === conversation.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              }`}
              title={conversation.title}
              onClick={() => {
                onSelectConversation(conversation.id);
                onClose?.();
              }}
            >
              <span className="flex-1 truncate">{conversation.title}</span>
              {onDeleteConversation && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="ml-2 p-1 rounded hover:bg-destructive/20 text-destructive opacity-70 group-hover:opacity-100"
                  title="Delete this chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Logout Button */}
      <div className="border-t border-sidebar-border p-4">
        <Button variant="outline" onClick={onLogout} className="w-full gap-2" size="sm">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
