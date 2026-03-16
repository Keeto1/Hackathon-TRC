'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getLanguage, t, Language } from '@/lib/i18n';
import { getCrisisResources } from '@/lib/crisisResources';

interface CrisisAlertProps {
  isOpen: boolean;
  onClose: () => void;
  severity: 'low' | 'medium' | 'high';
  keywords?: string[];
}

export default function CrisisAlert({ isOpen, onClose, severity, keywords = [] }: CrisisAlertProps) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    setLanguage(getLanguage());
  }, []);

  const resources = getCrisisResources(language);
  const getSeverityStyles = () => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-red-50 dark:bg-red-950',
          border: 'border-red-300 dark:border-red-700',
          text: 'text-red-900 dark:text-red-100',
          icon: 'text-red-600 dark:text-red-400',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'medium':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950',
          border: 'border-orange-300 dark:border-orange-700',
          text: 'text-orange-900 dark:text-orange-100',
          icon: 'text-orange-600 dark:text-orange-400',
          button: 'bg-orange-600 hover:bg-orange-700',
        };
      default:
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950',
          border: 'border-yellow-300 dark:border-yellow-700',
          text: 'text-yellow-900 dark:text-yellow-100',
          icon: 'text-yellow-600 dark:text-yellow-400',
          button: 'bg-yellow-600 hover:bg-yellow-700',
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md border-2 ${styles.border} ${styles.bg}`}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-5 h-5 ${styles.icon}`} />
            <DialogTitle className={styles.text}>
              {severity === 'high' ? t(language, 'supportAvailable') : t(language, 'weCarAboutYou')}
            </DialogTitle>
          </div>
          <DialogDescription className={styles.text}>
            {severity === 'high'
              ? t(language, 'crisisDistress')
              : t(language, 'concerningWords')}
          </DialogDescription>
        </DialogHeader>

        <div className={`space-y-4 ${styles.text}`}>
          {keywords.length > 0 && (
            <div>
              <p className="font-semibold text-sm mb-2">{t(language, 'keywordsDetected')}</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      severity === 'high'
                        ? 'bg-red-200 dark:bg-red-700'
                        : severity === 'medium'
                          ? 'bg-orange-200 dark:bg-orange-700'
                          : 'bg-yellow-200 dark:bg-yellow-700'
                    }`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={`p-3 rounded-lg ${severity === 'high' ? 'bg-red-100 dark:bg-red-900' : 'bg-opacity-50'}`}>
            <p className="text-sm">
              {severity === 'high'
                ? t(language, 'emergencyMessage')
                : t(language, 'needHelp')}
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold">{t(language, 'resources')}</p>
            <div className="space-y-2">
              {resources.primary.map((resource, idx) => (
                <div key={idx} className="flex flex-col gap-1 opacity-90">
                  {resource.number && (
                    <p>
                      <strong>{resource.name}:</strong> {resource.number}
                    </p>
                  )}
                  {!resource.number && resource.url && (
                    <p>
                      <strong>{resource.name}:</strong>{' '}
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                        {resource.url}
                      </a>
                    </p>
                  )}
                  {!resource.number && !resource.url && (
                    <p>
                      <strong>{resource.name}</strong>: {resource.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className={`${styles.button} text-white`}>
            {t(language, 'acknowledge')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
