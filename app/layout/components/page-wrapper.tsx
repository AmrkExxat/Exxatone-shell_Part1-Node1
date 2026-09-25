import React from 'react';
import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="bg-container flex flex-grow flex-col space-y-2 px-4 pt-2 pb-4">{children}</div>
  );
}
