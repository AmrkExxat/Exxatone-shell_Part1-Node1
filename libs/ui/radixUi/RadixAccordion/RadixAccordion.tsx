import React, { useRef, useEffect } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown } from '@fortawesome/pro-light-svg-icons';
import { twMerge } from 'tailwind-merge';

export interface RadixAccordionProps {
  /** Content for the trigger/header */
  title: React.ReactNode;
  /** Content displayed when accordion is expanded */
  children: React.ReactNode;
  /** Optional subtitle shown when collapsed */
  /** Unique value for the accordion item */
  value?: string;
  /** Default expanded state */
  defaultOpen?: boolean;
  /** Controlled expanded state */
  open?: boolean;
  /** Callback when expanded state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether accordion can be fully collapsed */
  collapsible?: boolean;
  /** Width of the accordion container */
  width?: string | number;
  /** Max width of the accordion container */
  maxWidth?: string | number;
  /** Min width of the accordion container */
  minWidth?: string | number;
  /** Height of the accordion container */
  height?: string | number;
  /** Max height of the accordion container */
  maxHeight?: string | number;
  /** Min height of the accordion container */
  minHeight?: string | number;
  /** Additional inline styles for the wrapper */
  style?: React.CSSProperties;
  /** Additional class name for the wrapper */
  className?: string;
  /** Additional class name for the accordion root */
  rootClassName?: string;
  /** Additional class name for the accordion item */
  itemClassName?: string;
  /** Disable the accordion */
  disabled?: boolean;
  /** Subtitle shown when expanded */
  subtitle?: React.ReactNode;
  /** Additional class name for the trigger */
  triggerClassName?: string;
  /** Additional class name for the content */
  contentClassName?: string;
  /** Additional class name for the content body */
  contentBodyClassName?: string;
  /** When true, removes the trigger from tab order (use when accordion cannot be toggled) */
  disableTriggerFocus?: boolean;
}

/**
 * RadixAccordion - A flexible, customizable single accordion component built on Radix UI
 */
const RadixAccordion: React.FC<RadixAccordionProps> = ({
  title,
  children,
  value = 'item',
  defaultOpen = false,
  open,
  onOpenChange,
  collapsible = true,
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  style,
  className = '',
  rootClassName = '',
  itemClassName = '',
  disabled = false,
  subtitle,
  triggerClassName,
  contentClassName,
  contentBodyClassName,
  disableTriggerFocus = false,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const shouldDisableFocus = disabled || disableTriggerFocus || (!collapsible && open);

  useEffect(() => {
    if (triggerRef.current) {
      triggerRef.current.tabIndex = shouldDisableFocus ? -1 : 0;
    }
  }, [shouldDisableFocus]);

  const wrapperStyle: React.CSSProperties = {
    width: width ?? '480px',
    maxWidth,
    minWidth,
    height,
    maxHeight,
    minHeight,
    ...style,
  };

  // Handle controlled/uncontrolled state
  const accordionValue = open !== undefined ? (open ? value : '') : undefined;
  const defaultAccordionValue = defaultOpen ? value : undefined;

  const handleValueChange = (newValue: string) => {
    if (onOpenChange) {
      onOpenChange(newValue === value);
    }
  };

  const handleRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      triggerRef.current?.click();
    }
  };

  return (
    <div
      className={twMerge('radix-import-accordion-wrapper font-sans', className)}
      style={wrapperStyle}
    >
      <Accordion.Root
        type="single"
        collapsible={collapsible}
        disabled={disabled}
        value={accordionValue}
        defaultValue={defaultAccordionValue}
        onValueChange={handleValueChange}
        className={twMerge('radix-import-accordion overflow-hidden rounded-xl', rootClassName)}
      >
        <Accordion.Item
          value={value}
          className={twMerge(
            'radix-import-accordion-item focus-within:outline-primary overflow-hidden rounded-2xl transition-[border-width,border-color] duration-300 ease-out outline-none focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 data-[state=closed]:border data-[state=closed]:border-[#c6c6ca] data-[state=open]:border-2 data-[state=open]:border-[#8C8C92]',
            itemClassName
          )}
        >
          <Accordion.Header className="radix-import-accordion-header flex">
            <Accordion.Trigger
              ref={triggerRef}
              className={twMerge(
                'radix-import-accordion-trigger group hover:bg-card data-[state=open]:bg-card flex flex-1 cursor-pointer items-center justify-between border-none bg-slate-50 px-5 py-2 text-left shadow-none transition-colors duration-200 ease-out outline-none',
                triggerClassName
              )}
            >
              <div className="radix-import-accordion-title flex w-full flex-col gap-1">
                <div className="flex w-full items-center justify-between gap-2">
                  {title && (
                    <span className="radix-import-accordion-title-text w-full">{title}</span>
                  )}
                  <span>
                    <FontAwesomeIcon
                      icon={faCircleChevronDown}
                      className="h-4 w-4 shrink-0 text-black transition-transform duration-300 ease-out group-data-[state=closed]:-rotate-90 group-data-[state=open]:rotate-0"
                    />
                  </span>
                </div>

                {subtitle && <span>{subtitle}</span>}
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            role="presentation"
            className={twMerge(
              'radix-import-accordion-content data-[state=closed]:animate-accordionSlideUp data-[state=open]:animate-accordionSlideDown bg-card overflow-hidden',
              contentClassName
            )}
          >
            <div
              className={twMerge(
                'radix-import-accordion-body flex flex-col gap-5',
                contentBodyClassName
              )}
            >
              {children}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};

export default RadixAccordion;
