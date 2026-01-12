import React from 'react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
        className
      )}
    >
      <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
    </div>
  );
}


