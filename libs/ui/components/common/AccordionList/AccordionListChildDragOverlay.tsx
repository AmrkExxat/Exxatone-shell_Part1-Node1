import React from 'react';
import classNames from 'classnames';

export interface AccordionListChildDragOverlayProps {
  children: React.ReactNode;
  className?: string;
}

export default function AccordionListChildDragOverlay({
  children,
  className,
}: AccordionListChildDragOverlayProps): React.JSX.Element {
  return (
    <div
      className={classNames(
        'accordion-list-child-drag-overlay bg-card flex cursor-grabbing items-center rounded border px-3 py-2 shadow-lg ring-1 ring-black/10',
        className
      )}
    >
      {children}
    </div>
  );
}
