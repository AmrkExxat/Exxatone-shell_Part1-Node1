import React from 'react';
import classNames from 'classnames';

import { ReorderButton } from './ReorderButtons';
import { ReorderButtonPosition } from './AccordionList.types';

interface AccordionListControlsProps {
  dragHandle?: React.ReactNode;
  showReorderButtons?: boolean;
  reorderButtonPosition?: ReorderButtonPosition;
  idPrefix: string;
  isFirst: boolean;
  isLast: boolean;
  disabled?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  className?: string;
  insideHeader?: boolean;
}

export default function AccordionListControls({
  dragHandle,
  showReorderButtons = false,
  reorderButtonPosition = 'beside-handle',
  idPrefix,
  isFirst,
  isLast,
  disabled = false,
  onMoveUp,
  onMoveDown,
  className,
  insideHeader = false,
}: AccordionListControlsProps): React.JSX.Element | null {
  if (!dragHandle && !showReorderButtons) {
    return null;
  }

  const alignmentClass = insideHeader ? 'items-center' : 'items-center';

  const upButton = showReorderButtons ? (
    <ReorderButton
      id={`${idPrefix}_move_up`}
      direction="up"
      disabled={disabled || isFirst}
      onClick={onMoveUp}
    />
  ) : null;

  const downButton = showReorderButtons ? (
    <ReorderButton
      id={`${idPrefix}_move_down`}
      direction="down"
      disabled={disabled || isLast}
      onClick={onMoveDown}
    />
  ) : null;

  const stackedReorderButtons = showReorderButtons ? (
    <div className="flex flex-col gap-1">
      {upButton}
      {downButton}
    </div>
  ) : null;

  if (reorderButtonPosition === 'around-handle') {
    return (
      <div className={classNames('flex justify-center gap-1', alignmentClass, className)}>
        {downButton}
        {dragHandle}
        {upButton}
      </div>
    );
  }

  if (reorderButtonPosition === 'stacked-handle') {
    return (
      <div className={classNames('flex w-6 flex-col items-center', className)}>
        {upButton}
        <div className="accordion-list-control-slot flex justify-center">{dragHandle}</div>
        {downButton}
      </div>
    );
  }

  return (
    <div className={classNames('flex gap-1', alignmentClass, className)}>
      {dragHandle}
      {stackedReorderButtons}
    </div>
  );
}
