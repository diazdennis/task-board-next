'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateBoardInput } from '@/types/board';
import { validateForm } from '@/lib/validation';
import { VALIDATION_RULES } from '@/lib/constants';
import { useTranslation } from '@/hooks/useTranslation';

interface CreateBoardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (board: CreateBoardInput) => Promise<void>;
}

export function CreateBoardForm({
  isOpen,
  onClose,
  onSuccess,
}: CreateBoardFormProps) {
  const { t: tCommon } = useTranslation('common');
  const { t: tBoards } = useTranslation('boards');
  const { t: tForms } = useTranslation('forms');
  
  const [formData, setFormData] = useState<CreateBoardInput>({
    name: '',
    description: '',
    color: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate color separately since it's optional but must be valid if provided
    const colorValue = formData.color?.trim() || '';
    const isColorValid = colorValue === '' || /^#[0-9A-Fa-f]{6}$/.test(colorValue);
    
    const validationErrors = validateForm(formData as unknown as Record<string, unknown>, {
      name: {
        required: true,
        minLength: VALIDATION_RULES.BOARD_NAME.minLength,
        maxLength: VALIDATION_RULES.BOARD_NAME.maxLength,
        message: tForms('validation.boardNameRequired'),
      },
      description: {
        required: false,
        maxLength: 1000,
        message: tForms('validation.descriptionMaxLength', { max: '1000' }),
      },
    });

    // Add color error if invalid
    if (!isColorValid) {
      validationErrors.color = tForms('validation.colorInvalid');
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSuccess(formData);
      setFormData({ name: '', description: '', color: '' });
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateBoardInput, value: string) => {
    setFormData((prev: CreateBoardInput) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tBoards('create.title')} size="lg">
      <form onSubmit={handleSubmit}>
        <Input
          label={tCommon('labels.boardName')}
          value={formData.name}
          onChange={(value) => handleChange('name', value)}
          error={errors.name}
          required
          placeholder={tCommon('placeholders.enterBoardName')}
        />
        <div className="mt-4">
          <Input
            label={tCommon('labels.description')}
            type="text"
            value={formData.description || ''}
            onChange={(value) => handleChange('description', value)}
            error={errors.description}
            placeholder={tCommon('placeholders.enterBoardDescription')}
          />
        </div>
        <div className="mt-4">
          <Input
            label={tCommon('labels.color')}
            type="text"
            value={formData.color || ''}
            onChange={(value) => handleChange('color', value)}
            error={errors.color}
            placeholder={tCommon('placeholders.colorHex')}
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
            {tCommon('buttons.createBoard')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

