'use client';

import { useMemo } from 'react';
import commonEn from '@/locales/en/common.json';
import boardsEn from '@/locales/en/boards.json';
import tasksEn from '@/locales/en/tasks.json';
import formsEn from '@/locales/en/forms.json';
import errorsEn from '@/locales/en/errors.json';

type TranslationKey = string;
type TranslationValues = Record<string, string | number>;

const translations = {
  common: commonEn,
  boards: boardsEn,
  tasks: tasksEn,
  forms: formsEn,
  errors: errorsEn,
};

function interpolate(template: string, values: TranslationValues): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

export function useTranslation(namespace?: keyof typeof translations) {
  const t = useMemo(() => {
    return (key: TranslationKey, values?: TranslationValues): string => {
      const keys = key.split('.');
      let value: unknown = translations;

      if (namespace) {
        value = translations[namespace];
      }

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      if (typeof value === 'string') {
        return values ? interpolate(value, values) : value;
      }

      return key;
    };
  }, [namespace]);

  return { t };
}


