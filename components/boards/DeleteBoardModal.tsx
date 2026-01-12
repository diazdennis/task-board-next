'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  boardName: string;
  taskCount: number;
}

export function DeleteBoardModal({
  isOpen,
  onClose,
  onConfirm,
  boardName,
  taskCount,
}: DeleteBoardModalProps) {
  const { t: tCommon } = useTranslation('common');
  const { t: tBoards } = useTranslation('boards');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={tBoards('delete.title')}>
      <div className="p-6">
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {tBoards('delete.confirm', { name: boardName })}
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 font-medium mb-1">
              {tBoards('delete.warning')}
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {tBoards('delete.message', { count: taskCount, plural: taskCount !== 1 ? 's' : '' })}
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {tBoards('delete.description')}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            {tCommon('buttons.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            {isDeleting ? tCommon('buttons.delete') + '...' : tCommon('buttons.deleteBoard')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

