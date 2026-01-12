'use client';

import React from 'react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme} size="sm">
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}


