import * as React from 'react';
import { createContext, useContext } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { twMerge } from 'tailwind-merge';

const RadioIcon: React.FC<{ className?: string; strokeWidth?: number }> = ({
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
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
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

interface RadioCardGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

interface RadioCardContextValue {
  itemValue: string;
  isChecked: boolean;
}

export interface RadioCardGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  name?: string;
  testId?: string;
}

export interface RadioCardProps {
  /** The value of this radio option */
  value: string;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export interface RadioRootProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroup.Root>,
  'value' | 'onValueChange'
> {
  id?: string;
}

export interface RadioItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroup.Item>,
  'value'
> {
  value: string;
  id?: string;
}

export interface RadioTriggerProps {
  children: React.ReactNode;
  className?: string;
  excludeSelector?: string;
}

export interface RadioBadgeProps {
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

/** Props for the RadioCard.Content component */
export interface RadioContentProps {
  /** Child components */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/* -------------------------------- Context -------------------------------- */

const RadioCardGroupContext = createContext<RadioCardGroupContextValue | null>(null);
const RadioCardContext = createContext<RadioCardContextValue | null>(null);

/**
 * Hook to access radio card group context
 * @throws Error if used outside RadioCardGroup
 */
const useRadioCardGroupContext = (): RadioCardGroupContextValue => {
  const context = useContext(RadioCardGroupContext);
  if (!context) {
    throw new Error('RadioCard must be used within a RadioCardGroup');
  }
  return context;
};

/**
 * Hook to access radio card context
 * @throws Error if used outside RadioCard
 */
const useRadioCardContext = (): RadioCardContextValue => {
  const context = useContext(RadioCardContext);
  if (!context) {
    throw new Error('RadioCard compound components must be used within a RadioCard');
  }
  return context;
};

/* -------------------------------- Components -------------------------------- */

/**
 * RadioCardGroup - Main wrapper component for radio card groups
 *
 * Manages the selected value for a group of radio cards.
 * All RadioCard components must be children of RadioCardGroup.
 *
 * @example
 * ```tsx
 * <RadioCardGroup value={selectedValue} onValueChange={setSelectedValue}>
 *   <RadioCard value="option1">
 *     <RadioCard.Item id="option1" />
 *     <RadioCard.Badge position="top-center" />
 *     <RadioCard.Trigger>
 *       <RadioCard.Content>Option 1</RadioCard.Content>
 *     </RadioCard.Trigger>
 *   </RadioCard>
 *   <RadioCard value="option2">
 *     <RadioCard.Item id="option2" />
 *     <RadioCard.Badge position="top-center" />
 *     <RadioCard.Trigger>
 *       <RadioCard.Content>Option 2</RadioCard.Content>
 *     </RadioCard.Trigger>
 *   </RadioCard>
 * </RadioCardGroup>
 * ```
 */
export function RadioCardGroup({
  value,
  onValueChange,
  children,
  className = '',
  name = 'radio-group',
  testId = 'radio-card-group',
}: RadioCardGroupProps): React.ReactElement {
  const contextValue = React.useMemo(
    () => ({
      value,
      onValueChange,
      name,
    }),
    [value, onValueChange, name]
  );

  return (
    <RadioCardGroupContext.Provider value={contextValue}>
      <RadioGroup.Root
        value={value}
        onValueChange={onValueChange}
        className={className}
        data-testid={testId}
        tabIndex={-1}
      >
        {children}
      </RadioGroup.Root>
    </RadioCardGroupContext.Provider>
  );
}

/**
 * RadioCard - Individual radio card component
 *
 * Represents a single radio option within a RadioCardGroup.
 * Provides context for child components to know if this card is selected.
 *
 * @example
 * ```tsx
 * <RadioCard value="option1">
 *   <RadioCard.Item id="option1" />
 *   <RadioCard.Badge position="top-center" />
 *   <RadioCard.Trigger>
 *     <RadioCard.Content>Your content here</RadioCard.Content>
 *   </RadioCard.Trigger>
 * </RadioCard>
 * ```
 */
export function RadioCard({
  value: itemValue,
  children,
  className = '',
  testId = 'radio-card',
}: RadioCardProps): React.ReactElement {
  const { value: selectedValue } = useRadioCardGroupContext();
  const isChecked = selectedValue === itemValue;

  const contextValue = React.useMemo(
    () => ({
      itemValue,
      isChecked,
    }),
    [itemValue, isChecked]
  );

  return (
    <RadioCardContext.Provider value={contextValue}>
      <div className={twMerge('relative', className)} data-testid={testId}>
        {children}
      </div>
    </RadioCardContext.Provider>
  );
}

/**
 * RadioCard.Item - Individual radio item
 *
 * Renders a screen-reader accessible radio button using Radix UI primitives.
 * Must be used within a RadioCard component.
 * If value prop is not provided, uses the RadioCard's value.
 */
RadioCard.Item = function RadioItem({
  value: propValue,
  id,
  ...props
}: RadioItemProps): React.ReactElement {
  const { itemValue } = useRadioCardContext();
  const { name } = useRadioCardGroupContext();

  return (
    <RadioGroup.Item
      id={id}
      value={propValue || itemValue}
      name={name}
      className="sr-only"
      {...props}
    />
  );
};

/**
 * RadioCard.Trigger - Clickable area that selects the radio option
 *
 * Wraps content that should trigger radio selection on click.
 * Use `data-no-radio` attribute on elements that should not trigger selection.
 */
RadioCard.Trigger = function RadioTrigger({
  children,
  className = '',
  excludeSelector = '[data-no-radio]',
}: RadioTriggerProps): React.ReactElement {
  const { itemValue } = useRadioCardContext();
  const { onValueChange } = useRadioCardGroupContext();

  const handleClick = (e: React.MouseEvent<HTMLLabelElement>): void => {
    const target = e.target as HTMLElement;
    if (target.closest(excludeSelector)) {
      return;
    }
    onValueChange?.(itemValue);
  };

  return (
    <label onClick={handleClick} className={twMerge('block w-full cursor-pointer', className)}>
      {children}
    </label>
  );
};

/**
 * RadioCard.Badge - Flexible badge that switches between checked/unchecked states
 *
 * Supports multiple configuration methods:
 * 1. Custom render functions for complete control
 * 2. Custom React elements for each state
 */
RadioCard.Badge = function RadioBadge({
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
}: RadioBadgeProps): React.ReactElement {
  const { isChecked } = useRadioCardContext();

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

  // Default checked content (radio icon)
  const defaultCheckedContent = (
    <div
      className={twMerge(
        sizeClasses[size],
        'flex items-center justify-center rounded-full bg-blue-500',
        animationClass,
        checkedClassName
      )}
      key="checked"
    >
      <RadioIcon className={`${iconSizeClasses[size]} text-white`} strokeWidth={3} />
    </div>
  );

  // Determine what to render based on priority:
  // 1. Custom render functions (highest priority)
  // 2. Custom content elements
  // 3. Default content
  let contentToRender: React.ReactNode;

  if (isChecked) {
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
          key={isChecked ? 'checked' : 'unchecked'}
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
 * RadioCard.Content - Wrapper for card content
 *
 * Simple wrapper component for organizing card content.
 */
RadioCard.Content = function RadioContent({
  children,
  className = '',
}: RadioContentProps): React.ReactElement {
  return <div className={className}>{children}</div>;
};

export { RadioIcon };
export default RadioCardGroup;
