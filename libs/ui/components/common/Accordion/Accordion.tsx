import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { AccordionTypes } from './Accordion.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { Button } from '../Buttons';

const INTERACTIVE_HEADER_SELECTOR =
  'button, input, textarea, select, option, a, label, [role="button"], [contenteditable="true"]';

const shouldIgnoreHeaderToggle = (
  event: React.MouseEvent | React.KeyboardEvent,
  headerRoot: EventTarget | null
) => {
  const target = event.target;

  if (!(target instanceof HTMLElement) || !(headerRoot instanceof HTMLElement)) {
    return false;
  }

  const interactiveElement = target.closest(INTERACTIVE_HEADER_SELECTOR);

  if (!interactiveElement) {
    return false;
  }

  return interactiveElement !== headerRoot;
};

export default function Accordion({
  header,
  children,
  className = '',
  disabled = false,
  showToggleIcon = true,
  id,
  expanded = false,
  onToggle = () => {},
  startingButton = false,
  contentClass = '',
  accordionWrapperClass = '',
  iconSize = 'h-4 w-4',
  treeIcon = false,
  toggleOnCount = null,
  keepMounted = false,
  headerPrefix,
  isHeaderButton = true,
  preventHeaderToggleOnInteractiveClick = false,
  syncExpanded = false,
  ...props
}: AccordionTypes): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(expanded);
  const previousOpened = useRef<boolean>(expanded);
  const wasSyncExpandedRef = useRef(false);

  useEffect(() => {
    if (keepMounted || syncExpanded) {
      setIsOpen(expanded);
      wasSyncExpandedRef.current = syncExpanded;
      return;
    }

    if (wasSyncExpandedRef.current) {
      setIsOpen(expanded);
      wasSyncExpandedRef.current = false;
    }
  }, [expanded, keepMounted, syncExpanded]);

  useEffect(() => {
    if (typeof toggleOnCount === 'number') {
      if (toggleOnCount) {
        if (toggleOnCount === 1) {
          previousOpened.current = isOpen;
        }
        if (!isOpen) {
          setIsOpen(true);
        }
      } else {
        setIsOpen(previousOpened.current);
      }
    }
  }, [toggleOnCount]);

  const toggleAccordion = (event: React.MouseEvent | React.KeyboardEvent) => {
    setIsOpen(!isOpen);
    onToggle({ event, isExpanded: !isOpen });
  };

  const handleHeaderClick = (event: React.MouseEvent<HTMLElement>) => {
    if (
      disabled ||
      (preventHeaderToggleOnInteractiveClick &&
        shouldIgnoreHeaderToggle(event, event.currentTarget))
    ) {
      return;
    }

    toggleAccordion(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      preventHeaderToggleOnInteractiveClick &&
      shouldIgnoreHeaderToggle(event, event.currentTarget)
    ) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleAccordion(event);
    }
  };

  const headerButtonClassName = classNames(
    'accordion-header focus-indicator disabled:text-disabled disabled:bg-disabled font-semibold disabled:pointer-events-none disabled:cursor-not-allowed flex items-center justify-between',
    headerPrefix
      ? 'min-w-0 flex-1 rounded-none bg-transparent px-0 py-0 hover:bg-transparent'
      : 'w-full',
    !headerPrefix && (isOpen ? 'rounded-t-lg rounded-b-none' : 'rounded-lg'),
    className
  );

  const headerChevron = (position: 'start' | 'end') => {
    const isStart = position === 'start';
    const showAtPosition = isStart ? startingButton : !startingButton;

    if (!showToggleIcon || !showAtPosition) {
      return null;
    }

    if (isHeaderButton) {
      return (
        <FontAwesomeIcon
          aria-hidden="true"
          className={classNames(
            iconSize,
            'transition-transform',
            isStart ? 'mr-2' : 'ml-4',
            isOpen && (treeIcon ? 'rotate-90' : 'rotate-180')
          )}
          icon={treeIcon ? faChevronRight : faChevronDown}
        />
      );
    } else {
      return (
        <Button
          id="accordion_header_button"
          testid="accordion_header_button"
          aria-label="Toggle Accordion"
          className={`hover:bg-hover flex h-5 w-5 flex-col items-center justify-center rounded-md text-black ${isStart ? 'mr-2' : 'ml-4'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (disabled) {
              return;
            }
            toggleAccordion(e);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              if (disabled) {
                return;
              }
              toggleAccordion(e);
            }
          }}
          variant="basic"
        >
          <FontAwesomeIcon
            aria-hidden="true"
            className={classNames(
              iconSize,
              'transition-transform',
              isOpen && (treeIcon ? 'rotate-90' : 'rotate-180')
            )}
            icon={treeIcon ? faChevronRight : faChevronDown}
          />
        </Button>
      );
    }
  };

  const headerButton = isHeaderButton ? (
    <button
      type="button"
      id={id}
      {...props}
      disabled={disabled}
      aria-disabled={disabled}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${id}`}
      className={headerButtonClassName}
      onClick={handleHeaderClick}
      onKeyDown={handleKeyDown}
    >
      {headerChevron('start')}
      <div className="flex min-w-0 flex-1 items-center">{header}</div>
      {headerChevron('end')}
    </button>
  ) : (
    <div
      id={id}
      {...props}
      className={headerButtonClassName}
      aria-controls={`accordion-content-${id}`}
      aria-expanded={isOpen}
      aria-disabled={disabled}
      onClick={handleHeaderClick}
      onKeyDown={(e) => {
        if (disabled) {
          return;
        }
        handleKeyDown(e);
      }}
    >
      {headerChevron('start')}
      <div className="flex min-w-0 flex-1 items-center">{header}</div>
      {headerChevron('end')}
    </div>
  );

  return (
    <div className={`accordion ${accordionWrapperClass}`}>
      {headerPrefix ? (
        <div
          className={classNames(
            'accordion-header-row bg-card hover:bg-hover flex w-full items-center gap-2 px-4 py-2',
            !isOpen ? 'rounded-lg' : 'rounded-t-lg rounded-b-none'
          )}
        >
          <div
            className="accordion-header-prefix flex shrink-0 items-center"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {headerPrefix}
          </div>
          {headerButton}
        </div>
      ) : (
        headerButton
      )}
      {(isOpen || keepMounted) && (
        <div
          id={`accordion-content-${id}`}
          role="region"
          className={classNames(`accordion-content ${contentClass}`, { hidden: !isOpen })}
        >
          {children}
        </div>
      )}
    </div>
  );
}
