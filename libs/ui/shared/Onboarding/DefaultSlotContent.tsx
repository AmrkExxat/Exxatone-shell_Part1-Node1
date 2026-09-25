'use client';

import { memo } from 'react';
import type { RequirementItemSlotProps } from './types';

export const DefaultRequirementItemSlot = memo(
  ({ requirement, isSelected, onClick }: RequirementItemSlotProps) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-current={isSelected ? 'true' : 'false'}
      className={[
        'focus-visible:outline-primary w-full border-t border-l-4 px-2 py-1 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-8px]',
        isSelected
          ? 'border-l-primary-500 cursor-pointer border-gray-50 bg-blue-50 shadow-sm'
          : 'bg-card cursor-pointer border-gray-50 border-l-white hover:border-gray-100 hover:bg-gray-100',
      ].join(' ')}
    >
      <span className="text-sm font-medium text-gray-900" role="heading" aria-level={5}>
        <span className="font-semibold">{requirement.name}</span>
        {requirement.required && <span className="ml-1 text-red-600">*</span>}
      </span>
      {requirement.descriptions?.[0] && (
        <div className="mt-1 text-xs text-gray-600">{requirement.descriptions[0]}</div>
      )}
    </div>
  )
);
DefaultRequirementItemSlot.displayName = 'DefaultRequirementItemSlot';

export const DefaultEmptyState = memo(() => (
  <div className="flex h-full items-center justify-center text-gray-500">
    <div className="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-sm font-medium">Select a requirement</p>
      <p className="mt-1 text-xs">Choose a requirement from the list to view details</p>
    </div>
  </div>
));
DefaultEmptyState.displayName = 'DefaultEmptyState';
