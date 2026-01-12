'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/hooks/useTranslation';

export type SortField = 'title' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t: tTasks } = useTranslation('tasks');

  const sortOptions = [
    { value: 'title-asc', label: tTasks('sort.titleAZ') || 'Title (A-Z)' },
    { value: 'title-desc', label: tTasks('sort.titleZA') || 'Title (Z-A)' },
  ];

  const currentValue = `${value.field}-${value.order}`;

  const handleChange = (newValue: string) => {
    const [field, order] = newValue.split('-') as [SortField, SortOrder];
    onChange({ field, order });
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {tTasks('sort.label') || 'Sort by'}:
      </label>
      <Select
        value={currentValue}
        onChange={handleChange}
        options={sortOptions}
        className="min-w-[160px]"
      />
    </div>
  );
}
