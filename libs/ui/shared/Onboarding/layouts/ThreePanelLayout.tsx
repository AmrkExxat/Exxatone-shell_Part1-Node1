'use client';

import { type ReactNode } from 'react';
import { useOnboardingSlice } from '../store/store';

interface ThreePanelLayoutProps {
  sidebarSlot: ReactNode;
  formSlot: ReactNode;
  personSelectorSlot?: ReactNode;
  topBarSlot?: ReactNode;
}

const ThreePanelLayout = ({
  sidebarSlot,
  formSlot,
  personSelectorSlot,
  topBarSlot,
}: ThreePanelLayoutProps) => {
  const isFormExpanded = useOnboardingSlice(
    (s) => s.isFormExpanded,
    (a, b) => a === b
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {topBarSlot != null && (
        <div className="bg-card border-b border-gray-300">
          <div className="flex h-full items-center justify-between pr-2">{topBarSlot}</div>
        </div>
      )}

      <div
        className="flex gap-0 overflow-hidden bg-gray-50"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        {!isFormExpanded && personSelectorSlot != null && (
          <div className="bg-card flex w-60 flex-shrink-0 flex-col overflow-hidden border-r border-gray-200 lg:w-[16rem]">
            {personSelectorSlot}
          </div>
        )}

        {!isFormExpanded && (
          <div className="bg-card flex w-60 flex-shrink-0 flex-col overflow-hidden border-r border-gray-200 lg:w-[22rem]">
            {sidebarSlot}
          </div>
        )}

        <div className="bg-card flex flex-1 flex-col overflow-hidden">{formSlot}</div>
      </div>
    </div>
  );
};

export { ThreePanelLayout };
