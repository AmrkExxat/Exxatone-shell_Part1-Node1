import React from 'react';
import { ReactNode } from 'react';

export default function MarginWidthWrapper({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col md:ml-60">{children}</div>;
}
