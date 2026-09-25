'use client';

import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BottomSheet } from '@ui/components';
import React, { useState } from 'react';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col p-4">
      <div className="p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Open Bottom Sheet
        </button>

        <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col p-4">
            <div className="flex flex-row items-center justify-end">
              <button
                id="closeButton"
                type="button"
                className="icon-btn"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <span className="sr-only">Close Bottom Panel</span>
                <FontAwesomeIcon icon={faXmark} className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
