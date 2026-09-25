import React from 'react';
import classNames from 'classnames';

export interface AccordionListAccordionDragOverlayProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function AccordionListAccordionDragOverlay({
  children,
  className,
  style,
}: AccordionListAccordionDragOverlayProps): React.JSX.Element {
  return (
    <div
      className={classNames(
        'accordion-list-accordion-drag-overlay box-border cursor-grabbing',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
