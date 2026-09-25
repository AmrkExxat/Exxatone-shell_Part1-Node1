'use client';

import type { RequirementFormPlaceholderProps } from './pane.types';

/** Empty and loading states for FormPane. No store access. */
export const RequirementFormPlaceholder = ({
  variant,
  message,
  subMessage,
  children,
}: RequirementFormPlaceholderProps) => {
  if (children) {
    return <>{children}</>;
  }

  if (variant === 'loading') {
    return (
      <div className="flex h-full w-full flex-col gap-4 p-6" role="status" aria-label="Loading">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
        <div className="h-20 w-full animate-pulse rounded bg-gray-200" />
        <span className="sr-only">Loading requirement…</span>
      </div>
    );
  }

  return (
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
        <p className="text-sm font-medium">{message ?? 'Select a requirement'}</p>
        {(subMessage ?? true) && (
          <p className="mt-1 text-xs">
            {subMessage ?? 'Choose a requirement from the list to view details'}
          </p>
        )}
      </div>
    </div>
  );
};
