'use client';

import { useState, useEffect } from 'react';
import type { CommentSectionProps } from './pane.types';

/** Modal for status-change confirmation. Parent owns open state and confirm handler. */
export const CommentSection = ({
  isOpen,
  onClose,
  onConfirm,
  warningText,
  confirmLabel = 'Update Now',
  cancelLabel = 'Cancel',
  commentRequired = false,
}: CommentSectionProps) => {
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setComment('');
      setCommentError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmDisabled = commentRequired && !comment.trim();

  const handleConfirm = () => {
    if (isConfirmDisabled) {
      setCommentError('Comment is required.');
      return;
    }
    onConfirm(comment);
    setComment('');
    setCommentError('');
  };

  const handleCancel = () => {
    setComment('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-section-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" onClick={handleCancel} />

      <div className="bg-card relative z-10 w-full max-w-md rounded-lg p-6 shadow-xl">
        {warningText && (
          <p
            id="comment-section-title"
            className="mb-4 rounded bg-amber-50 px-3 py-2 text-sm text-amber-800"
          >
            {warningText}
          </p>
        )}

        <div className="mb-4">
          <label
            htmlFor="onboarding-comment"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Comment
            {commentRequired && <span className="ml-1 text-red-600">*</span>}
          </label>
          <textarea
            id="onboarding-comment"
            rows={4}
            placeholder="Add reason"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (commentError) setCommentError('');
            }}
            className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            aria-invalid={commentError ? true : undefined}
            aria-describedby={commentError ? 'onboarding-comment-error' : undefined}
          />
          {commentError && (
            <p id="onboarding-comment-error" className="mt-1 text-sm text-red-600" role="alert">
              {commentError}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="focus:ring-primary bg-card rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:outline-none"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            aria-disabled={isConfirmDisabled}
            className="bg-primary hover:bg-primary/90 focus:ring-primary disabled:hover:bg-primary rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
