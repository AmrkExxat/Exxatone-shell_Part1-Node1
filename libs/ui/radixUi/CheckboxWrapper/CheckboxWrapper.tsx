import * as React from 'react';
import { createContext, useContext } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { twMerge } from 'tailwind-merge';

const CheckIcon: React.FC<{ className?: string; strokeWidth?: number }> = ({
  className = '',
  strokeWidth = 3,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* -------------------------------- Types -------------------------------- */

export type BadgePosition =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'left-center'
  | 'right-center';

export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl';

interface CheckboxCardContextValue {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface CheckboxCardProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export interface CheckboxRootProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Checkbox.Root>,
  'checked' | 'onCheckedChange'
> {
  id?: string;
}

export interface CheckboxTriggerProps {
  children: React.ReactNode;
  className?: string;
  excludeSelector?: string;
}

export interface CheckboxBadgeProps {
  /** Custom render function for unchecked state */
  renderUnchecked?: () => React.ReactNode;
  /** Custom render function for checked state */
  renderChecked?: () => React.ReactNode;
  /** Custom element for unchecked state */
  uncheckedContent?: React.ReactNode;
  /** Custom element for checked state */
  checkedContent?: React.ReactNode;
  /** Badge position relative to parent */
  position?: BadgePosition;
  /** Additional classes for unchecked state */
  uncheckedClassName?: string;
  /** Additional classes for checked state */
  checkedClassName?: string;
  /** Additional CSS classes */
  className?: string;
  /** Badge size variant */
  size?: BadgeSize;
  /** Whether to animate state transitions */
  animate?: boolean;
}

/** Props for the CheckboxCard.Content component */
export interface CheckboxContentProps {
  /** Child components */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/* -------------------------------- Context -------------------------------- */

const CheckboxCardContext = createContext<CheckboxCardContextValue | null>(null);

/**
 * Hook to access checkbox card context
 * @throws Error if used outside CheckboxCard
 */
const useCheckboxCardContext = (): CheckboxCardContextValue => {
  const context = useContext(CheckboxCardContext);
  if (!context) {
    throw new Error('CheckboxCard compound components must be used within a CheckboxCard');
  }
  return context;
};

/* -------------------------------- Components -------------------------------- */

/**
 * CheckboxCard - Main wrapper component for checkbox cards
 *
 * Provides context for child components and manages checkbox state.
 * Uses composition pattern for maximum flexibility.
 *
 * @example
 * ```tsx
 * <CheckboxCard checked={isChecked} onCheckedChange={setIsChecked}>
 *   <CheckboxCard.Root id="my-checkbox" />
 *   <CheckboxCard.Badge
 *     position="top-center"
 *     renderUnchecked={() => <span>1</span>}
 *     renderChecked={() => <CheckIcon className="w-5 h-5 text-white" />}
 *   />
 *   <CheckboxCard.Trigger>
 *     <CheckboxCard.Content>Your content here</CheckboxCard.Content>
 *   </CheckboxCard.Trigger>
 * </CheckboxCard>
 * ```
 */
export function CheckboxCard({
  checked,
  onCheckedChange,
  children,
  className = '',
  testId = 'checkbox-card',
}: CheckboxCardProps): React.ReactElement {
  const contextValue = React.useMemo(
    () => ({
      checked,
      onCheckedChange,
    }),
    [checked, onCheckedChange]
  );

  return (
    <CheckboxCardContext.Provider value={contextValue}>
      <div className={twMerge('relative', className)} data-testid={testId}>
        {children}
      </div>
    </CheckboxCardContext.Provider>
  );
}

/**
 * CheckboxCard.Root - Hidden native checkbox for accessibility
 *
 * Renders a screen-reader accessible checkbox using Radix UI primitives.
 */
CheckboxCard.Root = function CheckboxRoot({ id, ...props }: CheckboxRootProps): React.ReactElement {
  const { checked, onCheckedChange } = useCheckboxCardContext();

  return (
    <Checkbox.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="sr-only"
      {...props}
    />
  );
};

/**
 * CheckboxCard.Trigger - Clickable area that toggles checkbox
 *
 * Wraps content that should trigger checkbox toggle on click.
 * Use `data-no-checkbox` attribute on elements that should not trigger toggle.
 */
CheckboxCard.Trigger = function CheckboxTrigger({
  children,
  className = '',
  excludeSelector = '[data-no-checkbox]',
}: CheckboxTriggerProps): React.ReactElement {
  const { checked, onCheckedChange } = useCheckboxCardContext();

  const handleClick = (e: React.MouseEvent<HTMLLabelElement>): void => {
    const target = e.target as HTMLElement;
    if (target.closest(excludeSelector)) {
      return;
    }
    onCheckedChange?.(!checked);
  };

  return (
    <label onClick={handleClick} className={twMerge('block w-full cursor-pointer', className)}>
      {children}
    </label>
  );
};

/**
 * CheckboxCard.Badge - Flexible badge that switches between checked/unchecked states
 *
 * Supports multiple configuration methods:
 * 1. Custom render functions for complete control
 * 2. Custom React elements for each state
 */
CheckboxCard.Badge = function CheckboxBadge({
  renderUnchecked,
  renderChecked,
  uncheckedContent,
  checkedContent,
  position = 'top-center',
  uncheckedClassName = '',
  checkedClassName = '',
  className = '',
  size = 'md',
  animate = true,
}: CheckboxBadgeProps): React.ReactElement {
  const { checked } = useCheckboxCardContext();

  const positionClasses: Record<BadgePosition, string> = {
    'top-center': 'top-3 left-1/2 -translate-x-1/2',
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-center': 'bottom-3 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'left-center': 'left-3 top-1/2 -translate-y-1/2',
    'right-center': 'right-3 top-1/2 -translate-y-1/2',
  };

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const iconSizeClasses: Record<BadgeSize, string> = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const animationClass = animate ? 'transition-all duration-300 ease-in-out' : '';

  // Default unchecked content (empty badge)
  const defaultUncheckedContent = (
    <div
      className={twMerge(
        sizeClasses[size],
        'bg-card flex items-center justify-center rounded-full border-2 border-gray-300 font-bold text-gray-700',
        animationClass,
        uncheckedClassName
      )}
      key="unchecked"
    ></div>
  );

  // Default checked content (checkmark)
  const defaultCheckedContent = (
    <div
      className={twMerge(
        sizeClasses[size],
        'flex items-center justify-center rounded-full bg-green-500',
        animationClass,
        checkedClassName
      )}
      key="checked"
    >
      <CheckIcon className={`${iconSizeClasses[size]} text-white`} strokeWidth={3} />
    </div>
  );

  // Determine what to render based on priority:
  // 1. Custom render functions (highest priority)
  // 2. Custom content elements
  // 3. Default content
  let contentToRender: React.ReactNode;

  if (checked) {
    if (renderChecked) {
      contentToRender = renderChecked();
    } else if (checkedContent) {
      contentToRender = checkedContent;
    } else {
      contentToRender = defaultCheckedContent;
    }
  } else {
    if (renderUnchecked) {
      contentToRender = renderUnchecked();
    } else if (uncheckedContent) {
      contentToRender = uncheckedContent;
    } else {
      contentToRender = defaultUncheckedContent;
    }
  }

  return (
    <div
      className={twMerge('pointer-events-none absolute z-10', positionClasses[position], className)}
    >
      {animate ? (
        <div
          className="animate-in fade-in zoom-in scale-100 transform duration-200"
          key={checked ? 'checked' : 'unchecked'}
        >
          {contentToRender}
        </div>
      ) : (
        contentToRender
      )}
    </div>
  );
};

/**
 * CheckboxCard.Content - Wrapper for card content
 *
 * Simple wrapper component for organizing card content.
 */
CheckboxCard.Content = function CheckboxContent({
  children,
  className = '',
}: CheckboxContentProps): React.ReactElement {
  return <div className={className}>{children}</div>;
};

export { CheckIcon };
export default CheckboxCard;
