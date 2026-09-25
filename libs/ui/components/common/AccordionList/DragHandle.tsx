import React from 'react';
import classNames from 'classnames';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/pro-solid-svg-icons';

interface DragHandleProps {
  disabled?: boolean;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  variant?: 'button' | 'inline';
  className?: string;
  visualOnly?: boolean;
}

export default function DragHandle({
  disabled = false,
  attributes,
  listeners,
  variant = 'button',
  className,
  visualOnly = false,
}: DragHandleProps): React.JSX.Element {
  const dragProps = visualOnly || disabled ? {} : { ...attributes, ...listeners };
  const baseClassName = classNames(
    'focus-indicator flex flex-shrink-0 items-center justify-center text-gray-400',
    disabled
      ? 'cursor-default opacity-50'
      : 'cursor-grab hover:text-gray-600 active:cursor-grabbing',
    variant === 'button' ? 'h-8 w-8' : 'h-4 w-4',
    className
  );

  const stopPropagation = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  if (variant === 'inline') {
    return (
      <span
        className={baseClassName}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={disabled ? 'Reorder disabled' : 'Drag to reorder'}
        aria-disabled={disabled}
        {...dragProps}
        onClick={stopPropagation}
        onKeyDown={stopPropagation}
      >
        <FontAwesomeIcon icon={faGripVertical} className="text-base" />
      </span>
    );
  }

  return (
    <button
      type="button"
      className={baseClassName}
      aria-label={disabled ? 'Reorder disabled' : 'Drag to reorder'}
      disabled={disabled}
      tabIndex={-1}
      {...dragProps}
    >
      <FontAwesomeIcon icon={faGripVertical} className="text-base" />
    </button>
  );
}
