'use client';

import { MoodEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodHistoryProps {
  entries: MoodEntry[];
}

const moodColors: Record<MoodEntry['mood'], { bg: string; text: string; emoji: string }> = {
  excellent: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-900 dark:text-green-100', emoji: '😄' },
  good: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-900 dark:text-blue-100', emoji: '🙂' },
  okay: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-900 dark:text-yellow-100', emoji: '😐' },
  struggling: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-900 dark:text-orange-100', emoji: '😟' },
  critical: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-900 dark:text-red-100', emoji: '😢' },
};

export default function MoodHistory({ entries }: MoodHistoryProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood History</CardTitle>
          <CardDescription>No mood entries yet. Start tracking your feelings!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const last7Days = sortedEntries.slice(0, 7);
  const moodStats = {
    average: (
      last7Days.reduce((sum, e) => sum + e.intensity, 0) / last7Days.length
    ).toFixed(1),
    trend: calculateTrend(last7Days),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood History</CardTitle>
        <CardDescription>Your recent mood entries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Average Intensity</p>
            <p className="text-2xl font-bold">{moodStats.average}/10</p>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Trend</p>
            <p className="text-2xl font-bold">{moodStats.trend}</p>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-2">
          {last7Days.map((entry) => {
            const moodColor = moodColors[entry.mood];
            return (
              <div
                key={entry.id}
                className={`p-3 rounded-lg ${moodColor.bg} ${moodColor.text} border border-opacity-20`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{moodColor.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm capitalize">{entry.mood}</p>
                      <p className="text-xs opacity-75">
                        Intensity: {entry.intensity}/10
                      </p>
                    </div>
                  </div>
                  <p className="text-xs opacity-75">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {entry.notes && <p className="text-xs mt-2 opacity-90">{entry.notes}</p>}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function calculateTrend(entries: MoodEntry[]): string {
  if (entries.length < 2) return '→';

  const firstHalf = entries.slice(0, Math.ceil(entries.length / 2));
  const secondHalf = entries.slice(Math.ceil(entries.length / 2));

  const firstAvg = firstHalf.reduce((sum, e) => sum + e.intensity, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, e) => sum + e.intensity, 0) / secondHalf.length;

  if (secondAvg > firstAvg + 1) return '📈 Improving';
  if (secondAvg < firstAvg - 1) return '📉 Declining';
  return '→ Stable';
}
