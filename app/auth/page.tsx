'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already logged in
    if (getCurrentUser()) {
      router.push('/chat');
    }
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Campus AI Buddy</h1>
          <p className="text-muted-foreground">Your supportive companion for mental wellness</p>
        </div>

        {isLogin ? (
          <LoginForm 
            onSuccess={() => router.push('/chat')}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm 
            onSuccess={() => router.push('/chat')}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
