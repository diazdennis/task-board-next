'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ title, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        className
      )}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {actions}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

