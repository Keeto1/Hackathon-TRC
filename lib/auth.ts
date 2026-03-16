// Mock auth utilities - can be replaced with real Supabase auth later
import { generateUUID, simpleHash } from './uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock user storage (in real app, this would be Supabase)
const USERS_KEY = 'campus_ai_buddy_users';
const CURRENT_USER_KEY = 'campus_ai_buddy_current_user';
const SESSIONS_KEY = 'campus_ai_buddy_sessions';

export function getStoredUsers(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch {
    return {};
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function hashPassword(password: string): string {
  return simpleHash(password);
}

export async function signup(email: string, password: string, name: string): Promise<{ user: User; error: string | null }> {
  const users = getStoredUsers();

  if (users[email]) {
    return { user: null as any, error: 'Email already exists' };
  }

  if (!email || !password || !name) {
    return { user: null as any, error: 'All fields are required' };
  }

  const user: User = {
    id: generateUUID(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  users[email] = { ...user, passwordHash: hashPassword(password) };
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  setCurrentUser(user);
  return { user, error: null };
}

export async function login(email: string, password: string): Promise<{ user: User; error: string | null }> {
  const users = getStoredUsers();
  const userRecord = users[email];

  if (!userRecord || userRecord.passwordHash !== hashPassword(password)) {
    return { user: null as any, error: 'Invalid email or password' };
  }

  const { passwordHash, ...user } = userRecord;
  setCurrentUser(user);
  return { user, error: null };
}

export function logout() {
  setCurrentUser(null);
}
