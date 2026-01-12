'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CreateTaskInput } from '@/types/task';
import { TaskStatus, TaskPriority } from '@/types/common';
import { validateForm } from '@/lib/validation';
import { VALIDATION_RULES, TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';

interface CreateTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: CreateTaskInput) => Promise<void>;
  boardId: string;
}

export function CreateTaskForm({
  isOpen,
  onClose,
  onSuccess,
  boardId,
}: CreateTaskFormProps) {
  const { t: tCommon } = useTranslation('common');
  const { t: tTasks } = useTranslation('tasks');
  const { t: tForms } = useTranslation('forms');
  
  const [formData, setFormData] = useState<CreateTaskInput>({
    boardId,
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(formData as unknown as Record<string, unknown>, {
      title: {
        required: true,
        minLength: VALIDATION_RULES.TASK_TITLE.minLength,
        maxLength: VALIDATION_RULES.TASK_TITLE.maxLength,
        message: tForms('validation.taskTitleRequired'),
      },
      description: {
        required: false,
        maxLength: VALIDATION_RULES.DESCRIPTION.maxLength,
        message: tForms('validation.descriptionMaxLength', { max: '2000' }),
      },
      status: {
        required: true,
        enum: TASK_STATUSES,
        message: tForms('validation.required', { field: tCommon('labels.status') }),
      },
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess(formData);
      setFormData({
        boardId,
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateTaskInput, value: string) => {
    setFormData((prev: CreateTaskInput) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tTasks('create.title')} size="lg">
      <form onSubmit={handleSubmit}>
        <Input
          label={tCommon('labels.taskTitle')}
          value={formData.title}
          onChange={(value) => handleChange('title', value)}
          error={errors.title}
          required
          placeholder={tCommon('placeholders.enterTaskTitle')}
        />
        <div className="mt-4">
          <Input
            label={tCommon('labels.description')}
            type="text"
            value={formData.description || ''}
            onChange={(value) => handleChange('description', value)}
            error={errors.description}
            placeholder={tCommon('placeholders.enterTaskDescription')}
          />
        </div>
        <div className="mt-4">
          <Select
            label={tCommon('labels.status')}
            value={formData.status || 'TODO'}
            onChange={(value) => handleChange('status', value as TaskStatus)}
            error={errors.status}
            options={TASK_STATUSES.map((status) => {
              const statusKey = status === 'IN_PROGRESS' ? 'inProgress' : status.toLowerCase();
              return {
                value: status,
                label: tTasks(`status.${statusKey}`),
              };
            })}
          />
        </div>
        <div className="mt-4">
          <Select
            label={tCommon('labels.priority')}
            value={formData.priority || 'MEDIUM'}
            onChange={(value) => handleChange('priority', value as TaskPriority)}
            options={TASK_PRIORITIES.map((priority) => ({
              value: priority,
              label: tTasks(`priority.${priority.toLowerCase()}`),
            }))}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {tCommon('buttons.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {tCommon('buttons.createTask')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

