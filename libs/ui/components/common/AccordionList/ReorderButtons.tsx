import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/pro-solid-svg-icons';

interface ReorderButtonProps {
  id: string;
  direction: 'up' | 'down';
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

const ReorderButton = ({
  id,
  direction,
  disabled = false,
  onClick,
  className,
}: ReorderButtonProps): React.JSX.Element => {
  const isUp = direction === 'up';

  return (
    <button
      type="button"
      id={id}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={classNames(
        'focus-indicator flex h-6 w-6 items-center justify-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
      aria-label={isUp ? 'Move up' : 'Move down'}
    >
      <FontAwesomeIcon icon={isUp ? faArrowUp : faArrowDown} className="h-4 w-4" />
    </button>
  );
};

interface ReorderButtonsProps {
  idPrefix: string;
  isFirst: boolean;
  isLast: boolean;
  disabled?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function ReorderButtons({
  idPrefix,
  isFirst,
  isLast,
  disabled = false,
  onMoveUp,
  onMoveDown,
}: ReorderButtonsProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <ReorderButton
        id={`${idPrefix}_move_up`}
        direction="up"
        disabled={disabled || isFirst}
        onClick={onMoveUp}
      />
      <ReorderButton
        id={`${idPrefix}_move_down`}
        direction="down"
        disabled={disabled || isLast}
        onClick={onMoveDown}
      />
    </div>
  );
}

export { ReorderButton };
