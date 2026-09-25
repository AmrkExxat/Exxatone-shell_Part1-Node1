'use client';

import { memo, type ReactNode } from 'react';

interface OnePanelLayoutProps {
  /** The single content panel — typically just the FormPane */
  children: ReactNode;
  /** Optional top bar — tabs, actions */
  topBarSlot?: ReactNode;
}

const OnePanelLayout = memo(({ children, topBarSlot }: OnePanelLayoutProps) => (
  <div className="flex h-full w-full flex-col overflow-hidden">
    {topBarSlot && (
      <div className="bg-card flex flex-shrink-0 items-center justify-between border-b border-gray-300 pr-2">
        {topBarSlot}
      </div>
    )}
    <div className="bg-card flex flex-1 flex-col overflow-hidden">{children}</div>
  </div>
));
OnePanelLayout.displayName = 'OnePanelLayout';

export { OnePanelLayout };
