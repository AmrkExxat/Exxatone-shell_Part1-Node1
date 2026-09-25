import React, { useEffect, useId, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';

interface NonPortalModalProps {
  isOpen: boolean;
  dialogRef?: React.RefObject<HTMLDivElement>;
  labelledBy?: string;
  onClose?: () => void;
  title?: string;
  message?: string;
  closeButtonId?: string;
  disableCloseButton?: boolean;
  showHeader?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  containerClassName?: string;
  backdropClassName?: string;
  children: React.ReactNode;
}

type NonPortalModalSize = NonPortalModalProps['size'];

const sizeClassMap: Record<Exclude<NonPortalModalSize, undefined>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const NonPortalModal = ({
  isOpen,
  dialogRef,
  labelledBy,
  onClose,
  title,
  message,
  closeButtonId,
  disableCloseButton = false,
  showHeader = true,
  size = 'lg',
  containerClassName = 'absolute inset-0 z-50 flex items-center justify-center rounded-t-xl p-4',
  backdropClassName = 'absolute inset-0 rounded-t-2xl bg-black/50',
  children,
}: NonPortalModalProps) => {
  const modalId = useId();
  const internalDialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const resolvedDialogRef = dialogRef ?? internalDialogRef;
  const resolvedLabelledBy = labelledBy ?? `common-modal-title-${modalId}`;
  const resolvedDescribedBy = message ? `common-modal-desc-${modalId}` : undefined;
  const resolvedCloseButtonId = closeButtonId ?? `common-modal-close-button-${modalId}`;

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    } else {
      previouslyFocusedElement.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || disableCloseButton) return;

    const timer = window.setTimeout(() => {
      document.getElementById(resolvedCloseButtonId)?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen, resolvedCloseButtonId, disableCloseButton]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose && !disableCloseButton) {
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, disableCloseButton]);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = resolvedDialogRef.current;
    if (!dialog) return;

    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      e.preventDefault();
      e.stopPropagation();

      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);

      if (e.shiftKey) {
        const prev = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1;
        focusable[prev]?.focus();
      } else {
        const next = currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1;
        focusable[next]?.focus();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, resolvedDialogRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={resolvedDialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? resolvedLabelledBy : undefined}
      aria-describedby={resolvedDescribedBy}
      className={containerClassName}
    >
      <div
        className={backdropClassName}
        aria-hidden="true"
        onClick={onClose && !disableCloseButton ? onClose : undefined}
      />
      <div
        className={`relative flex w-full ${sizeClassMap[size]} bg-card flex-col gap-6 rounded-lg p-8`}
      >
        {showHeader && (
          <div className="flex w-full items-start pr-9">
            <div>
              {title ? (
                <div id={resolvedLabelledBy} className="text-start text-lg font-semibold">
                  {title}
                </div>
              ) : null}
              {message ? (
                <div id={resolvedDescribedBy} className="text-start text-sm text-gray-600">
                  {message}
                </div>
              ) : null}
            </div>
            <button
              id={resolvedCloseButtonId}
              type="button"
              onClick={onClose ? onClose : undefined}
              className="focus-visible:ring-primary absolute top-0 right-0 m-4 inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              aria-label="Close dialog"
              disabled={disableCloseButton}
              tabIndex={0}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="h-4 w-4 text-gray-600"
                aria-hidden="true"
                focusable={false}
              />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default NonPortalModal;
export type { NonPortalModalProps };
