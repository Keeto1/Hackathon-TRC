'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border border-border rounded-bl-none'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            className="text-sm leading-relaxed prose prose-invert wrap-break-word"
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline" />
              ),
              code: ({ node, inline, className, children, ...props }) => (
                <code
                  className={`rounded px-1 py-0.5 font-mono text-xs bg-muted ${
                    inline ? 'inline' : 'block whitespace-pre-wrap'
                  } ${className ?? ''}`}
                  {...props}
                >
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        <p className={`text-xs mt-1 ${isUser ? 'opacity-70' : 'text-muted-foreground'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
