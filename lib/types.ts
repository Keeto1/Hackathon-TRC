export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodEntry {
  id: string;
  conversationId: string;
  userId: string;
  mood: 'excellent' | 'good' | 'okay' | 'struggling' | 'critical';
  intensity: number; // 1-10
  notes?: string;
  createdAt: string;
}

export interface CrisisAlert {
  id: string;
  conversationId: string;
  userId: string;
  triggerKeywords: string[];
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
