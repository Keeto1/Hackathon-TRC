import { Message, Conversation, MoodEntry, CrisisAlert } from './types';
import { generateUUID } from './uuid';

// Mock database using localStorage
const CONVERSATIONS_KEY = 'campus_ai_buddy_conversations';
const MESSAGES_KEY = 'campus_ai_buddy_messages';
const MOOD_ENTRIES_KEY = 'campus_ai_buddy_mood_entries';
const CRISIS_ALERTS_KEY = 'campus_ai_buddy_crisis_alerts';

// Conversations
export function getConversations(userId: string): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const all = conversations ? JSON.parse(conversations) : {};
    return Object.values(all).filter((c: any) => c.userId === userId) as Conversation[];
  } catch {
    return [];
  }
}

export function getConversation(conversationId: string): Conversation | null {
  if (typeof window === 'undefined') return null;
  try {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const all = conversations ? JSON.parse(conversations) : {};
    return all[conversationId] || null;
  } catch {
    return null;
  }
}

export function createConversation(userId: string, title: string = 'New Conversation'): Conversation {
  const conversation: Conversation = {
    id: generateUUID(),
    userId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const all = conversations ? JSON.parse(conversations) : {};
    all[conversation.id] = conversation;
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
  }

  return conversation;
}

export function updateConversation(conversationId: string, title: string): Conversation | null {
  if (typeof window === 'undefined') return null;
  try {
    const conversations = localStorage.getItem(CONVERSATIONS_KEY);
    const all = conversations ? JSON.parse(conversations) : {};
    if (all[conversationId]) {
      all[conversationId].title = title;
      all[conversationId].updatedAt = new Date().toISOString();
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
      return all[conversationId];
    }
  } catch {
    return null;
  }
  return null;
}

// Messages
export function getMessages(conversationId: string): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const messages = localStorage.getItem(MESSAGES_KEY);
    const all = messages ? JSON.parse(messages) : {};
    return Object.values(all).filter((m: any) => m.conversationId === conversationId) as Message[];
  } catch {
    return [];
  }
}

export function addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Message {
  const message: Message = {
    id: generateUUID(),
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const messages = localStorage.getItem(MESSAGES_KEY);
    const all = messages ? JSON.parse(messages) : {};
    all[message.id] = message;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  }

  return message;
}

// Mood Entries
export function getMoodEntries(userId: string, conversationId?: string): MoodEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const entries = localStorage.getItem(MOOD_ENTRIES_KEY);
    const all = entries ? JSON.parse(entries) : {};
    let filtered = Object.values(all).filter((e: any) => e.userId === userId) as MoodEntry[];
    if (conversationId) {
      filtered = filtered.filter((e) => e.conversationId === conversationId);
    }
    return filtered;
  } catch {
    return [];
  }
}

export function addMoodEntry(userId: string, conversationId: string, mood: MoodEntry['mood'], intensity: number, notes?: string): MoodEntry {
  const entry: MoodEntry = {
    id: generateUUID(),
    conversationId,
    userId,
    mood,
    intensity,
    notes,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const entries = localStorage.getItem(MOOD_ENTRIES_KEY);
    const all = entries ? JSON.parse(entries) : {};
    all[entry.id] = entry;
    localStorage.setItem(MOOD_ENTRIES_KEY, JSON.stringify(all));
  }

  return entry;
}

// Crisis Alerts
export function getCrisisAlerts(conversationId: string): CrisisAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const alerts = localStorage.getItem(CRISIS_ALERTS_KEY);
    const all = alerts ? JSON.parse(alerts) : {};
    return Object.values(all).filter((a: any) => a.conversationId === conversationId) as CrisisAlert[];
  } catch {
    return [];
  }
}

export function addCrisisAlert(userId: string, conversationId: string, triggerKeywords: string[], severity: 'low' | 'medium' | 'high'): CrisisAlert {
  const alert: CrisisAlert = {
    id: generateUUID(),
    conversationId,
    userId,
    triggerKeywords,
    severity,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const alerts = localStorage.getItem(CRISIS_ALERTS_KEY);
    const all = alerts ? JSON.parse(alerts) : {};
    all[alert.id] = alert;
    localStorage.setItem(CRISIS_ALERTS_KEY, JSON.stringify(all));
  }

  return alert;
}

// Crisis detection
const CRISIS_KEYWORDS = [
  'suicide', 'suicidal', 'kill myself', 'end my life', 'can\'t take it', 'want to die',
  'self harm', 'hurt myself', 'harm myself', 'overdose', 'take my life', 'no point',
];

export function detectCrisis(message: string): { isCrisis: boolean; keywords: string[]; severity: 'low' | 'medium' | 'high' } {
  const lowerMessage = message.toLowerCase();
  const foundKeywords = CRISIS_KEYWORDS.filter(keyword => lowerMessage.includes(keyword));

  if (foundKeywords.length === 0) {
    return { isCrisis: false, keywords: [], severity: 'low' };
  }

  const severity = foundKeywords.length >= 2 ? 'high' : 'medium';
  return { isCrisis: true, keywords: foundKeywords, severity };
}
