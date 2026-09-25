'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusTrap } from 'focus-trap-react';

import { BottomSheetProps } from './types';
import { classNames } from '../../common/Form/components/TreeSelect/utils';

const BottomSheet = ({
  isOpen,
  onClose,
  children,
  className = 'h-1/2 w-1/2',
  zIndex = 'z-50',
  ariaLabelledBy,
}: BottomSheetProps) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isFocusTrapActive, setIsFocusTrapActive] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const checkForNestedDialogs = () => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      setIsFocusTrapActive(dialogs.length <= 1);
    };

    const observer = new MutationObserver(checkForNestedDialogs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      previousFocusRef.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        if (sheetRef.current) {
          const focusableElements = sheetRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length) {
            (focusableElements[0] as HTMLElement).focus();
          } else {
            sheetRef.current.setAttribute('tabindex', '-1');
            sheetRef.current.focus();
          }
        }
      }, 100);
    } else {
      document.body.style.overflow = 'auto';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && isOpen && sheetRef.current) {
        const focusableElements = Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el?.offsetParent !== null);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 ${zIndex} flex items-end justify-center`}>
          {/* Background Overlay */}
          <motion.div
            className="absolute inset-0 bg-[#0009]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className={classNames('bg-card relative rounded-t-2xl shadow-lg', className)}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
          >
            <FocusTrap
              paused={!isFocusTrapActive}
              focusTrapOptions={{
                onDeactivate: onClose,
                clickOutsideDeactivates: true,
                allowOutsideClick: true,
                escapeDeactivates: false,
                fallbackFocus: () => sheetRef.current || document.body,
              }}
            >
              {children}
            </FocusTrap>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
