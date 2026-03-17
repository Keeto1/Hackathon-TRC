'use client';

import { Conversation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Menu, X, Trash2 } from 'lucide-react';
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
          {onDeleteConversation && activeConversationId && (
            <button
              onClick={() => {
                if (window.confirm('Delete this conversation?')) {
                  onDeleteConversation(activeConversationId);
                }
              }}
              className="p-1 rounded hover:bg-destructive/20 text-destructive"
              title="Delete current chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button onClick={onClose} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button onClick={onNewConversation} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {conversations.length === 0 ? (
          <p className="text-sm text-sidebar-foreground/60 p-3">No conversations yet</p>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                onSelectConversation(conversation.id);
                onClose?.();
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate ${
                activeConversationId === conversation.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50'
              }`}
              title={conversation.title}
            >
              {conversation.title}
            </button>
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
