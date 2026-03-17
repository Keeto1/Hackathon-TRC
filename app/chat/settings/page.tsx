'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { ArrowLeft } from 'lucide-react';
import { getLanguage, setLanguage, t, Language } from '@/lib/i18n';
import { getCrisisResources } from '@/lib/crisisResources';

export default function SettingsPage() {
      // ...existing code...
      // Import InstallPWAButton
      const InstallPWAButton = require('@/components/ui/InstallPWAButton').default;
    // Export chats handler
    const handleExportChats = () => {
      const conversations = localStorage.getItem('campus_ai_buddy_conversations');
      const messages = localStorage.getItem('campus_ai_buddy_messages');
      const moods = localStorage.getItem('campus_ai_buddy_mood_entries');
      const crisis = localStorage.getItem('campus_ai_buddy_crisis_alerts');
      const data = {
        conversations: conversations ? JSON.parse(conversations) : {},
        messages: messages ? JSON.parse(messages) : {},
        moods: moods ? JSON.parse(moods) : {},
        crisis: crisis ? JSON.parse(crisis) : {},
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'campus-ai-buddy-chats.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Import chats handler
    const handleImportChats = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.conversations) localStorage.setItem('campus_ai_buddy_conversations', JSON.stringify(data.conversations));
          if (data.messages) localStorage.setItem('campus_ai_buddy_messages', JSON.stringify(data.messages));
          if (data.moods) localStorage.setItem('campus_ai_buddy_mood_entries', JSON.stringify(data.moods));
          if (data.crisis) localStorage.setItem('campus_ai_buddy_crisis_alerts', JSON.stringify(data.crisis));
          alert('Chats imported successfully!');
        } catch {
          alert('Failed to import chats. Invalid file format.');
        }
      };
      reader.readAsText(file);
    };
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState<Language>('en');
  const resources = getCrisisResources(language);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/auth');
      return;
    }
    setUser(currentUser);

    // Load theme preference
    const savedTheme = localStorage.getItem('campus_ai_buddy_theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }

    // Load language preference
    const savedLanguage = getLanguage();
    setLanguageState(savedLanguage);
  }, [router]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('campus_ai_buddy_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setLanguage(newLanguage);
    window.location.reload(); // Reload to apply language changes across the app
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 sticky top-0 bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/chat')}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                  {user.name}
                </div>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <div className="px-3 py-2 bg-muted rounded-md text-foreground text-sm">
                  {user.email}
                </div>
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Member Since</FieldLabel>
                <div className="px-3 py-2 bg-muted rounded-md text-foreground text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldGroup>
              <FieldLabel>Theme</FieldLabel>
              <div className="flex gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('light')}
                  className="flex-1"
                >
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => handleThemeChange('dark')}
                  className="flex-1"
                >
                  Dark
                </Button>
              </div>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>{t(language, 'language')}</FieldLabel>
              <div className="flex gap-2">
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('en')}
                  className="flex-1"
                >
                  English
                </Button>
                <Button
                  variant={language === 'fr' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('fr')}
                  className="flex-1"
                >
                  Français
                </Button>
                <Button
                  variant={language === 'ar' ? 'default' : 'outline'}
                  onClick={() => handleLanguageChange('ar')}
                  className="flex-1"
                >
                  العربية
                </Button>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* About Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t(language, 'appName')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>{t(language, 'appName')}</strong> is your compassionate mental wellness companion,
              providing support and resources when you need them most.
            </p>
            <p>
              {t(language, 'complementNotReplace')}
            </p>
            <p className="pt-2">
              <strong>{t(language, 'versionLabel')}</strong> 1.0.0
            </p>
          </CardContent>
        </Card>

        {/* Resources Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t(language, 'crisisResources')}</CardTitle>
            <CardDescription>{t(language, 'getHelpWhenNeeded')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>{t(language, 'emergencyMessage')}</p>
            <div className="space-y-3">
              <div>
                <p className="font-semibold mb-2 text-xs uppercase tracking-wide">Primary Resources:</p>
                <ul className="space-y-2 ml-2">
                  {resources.primary.map((resource, idx) => (
                    <li key={idx} className="text-muted-foreground">
                      {resource.number && (
                        <>
                          <strong>{resource.name}:</strong> {resource.number}
                        </>
                      )}
                      {!resource.number && resource.url && (
                        <>
                          <strong>{resource.name}:</strong>{' '}
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {resource.url}
                          </a>
                        </>
                      )}
                      {!resource.number && !resource.url && (
                        <>
                          <strong>{resource.name}:</strong> {resource.description}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => router.push('/chat')}
          className="w-full mb-2"
        >
          Back to Chat
        </Button>

        {/* Install App Button for Phone */}
        <InstallPWAButton />

        {/* Export/Import Chats */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={handleExportChats}>
            Export Chats
          </Button>
          <label className="flex-1">
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleImportChats}
            />
            <Button variant="outline" className="w-full" asChild>
              <span>Import Chats</span>
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
