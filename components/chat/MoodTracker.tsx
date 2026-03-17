'use client';

import { useState } from 'react';
import { MoodEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';

type MoodLevel = 'excellent' | 'good' | 'okay' | 'struggling' | 'critical';

interface MoodTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mood: MoodLevel, intensity: number, notes?: string) => void;
  isLoading?: boolean;
}

const moods: { value: MoodLevel; label: string; emoji: string; color: string }[] = [
  { value: 'excellent', label: 'Excellent', emoji: '😄', color: 'bg-green-100 border-green-300' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'bg-blue-100 border-blue-300' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-100 border-yellow-300' },
  { value: 'struggling', label: 'Struggling', emoji: '😟', color: 'bg-orange-100 border-orange-300' },
  { value: 'critical', label: 'Critical', emoji: '😢', color: 'bg-red-100 border-red-300' },
];

export default function MoodTracker({ isOpen, onClose, onSubmit, isLoading = false }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<MoodLevel>('okay');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit(selectedMood, intensity, notes);
    setSelectedMood('okay');
    setIntensity(5);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full sm:max-w-md p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>How are you feeling?</DialogTitle>
          <DialogDescription>
            Track your mood to help Buddy provide better support
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mood Selection */}
          <FieldGroup>
            <FieldLabel>Current Mood</FieldLabel>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-3 sm:p-2 rounded-lg border-2 transition-all w-full ${
                    selectedMood === mood.value
                      ? `${mood.color} border-opacity-100 scale-105`
                      : 'border-border hover:border-primary'
                  }`}
                  title={mood.label}
                >
                  <div className="text-2xl">{mood.emoji}</div>
                  <p className="text-xs font-medium mt-1">{mood.label}</p>
                </button>
              ))}
            </div>
          </FieldGroup>

          {/* Intensity Slider */}
          <FieldGroup>
            <FieldLabel>Intensity: {intensity}/10</FieldLabel>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              disabled={isLoading}
              className="w-full cursor-pointer"
            />
          </FieldGroup>

          {/* Notes */}
          <FieldGroup>
            <Field>
              <FieldLabel>Additional Notes (Optional)</FieldLabel>
              <Textarea
                placeholder="What's triggering this feeling? Any thoughts?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
                className="resize-none"
                rows={3}
              />
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Mood'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
