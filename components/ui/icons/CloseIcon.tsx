import React from 'react';
import { cn } from '@/lib/utils';

interface CloseIconProps {
  className?: string;
  size?: number;
}

export function CloseIcon({ className, size = 24 }: CloseIconProps) {
  return (
    <svg
      className={cn('fill-none', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

