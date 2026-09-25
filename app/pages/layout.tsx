import React from 'react';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className="bg-container flex flex-grow flex-col space-y-2">{children}</div>;
}
