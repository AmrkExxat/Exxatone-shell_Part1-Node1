import * as React from 'react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

export interface BoxCardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  disabled?: boolean;
}

const BoxCard = React.forwardRef<HTMLDivElement, BoxCardProps>(
  ({ className, active, disabled, children, onClick, ...props }, ref) => {
    const isClickable = Boolean(onClick) && !disabled;

    return (
      <div
        ref={ref}
        className={twMerge(
          classNames(
            'h-fit w-full p-1 transition-all duration-300',
            active ? 'border-[1.5px] border-[#E31C79] bg-[#FFF2F8]' : 'border border-gray-300',
            isClickable && 'cursor-pointer',
            disabled && 'pointer-events-none opacity-60'
          ),
          className
        )}
        onClick={isClickable ? onClick : undefined}
        aria-disabled={disabled ? true : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BoxCard.displayName = 'BoxCard';

export default BoxCard;
