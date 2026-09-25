import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { type TooltipProps } from './Tooltip.types';

const TOOLTIP_MARGIN = 8;

const Tooltip = ({
  triggerElement,
  tooltip,
  truncate = false,
  position = 'bottom',
  delay = 0,
  tabIndex = -1,
  ariaLabel,
  id,
  triggerWrapperClass = '',
}: TooltipProps): React.JSX.Element => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [elBounding, setElBounding] = useState<DOMRect | null | undefined>(null);
  const [isTruncate, setIsTruncate] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [fadeClass, setFadeClass] = useState('opacity-0');
  const [calculatedPosition, setCalculatedPosition] = useState(position);
  const [isMounted, setIsMounted] = useState(false);
  const delayTimeout = useRef<NodeJS.Timeout | null>(null);

  // document.body is only available once mounted in the browser.
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const handleResize = () => {
      const anchorElWidth = triggerRef.current?.offsetWidth;
      const truncatedElWidth = (
        triggerRef.current?.querySelector('.truncate-content') as HTMLElement
      )?.offsetWidth;

      if (
        anchorElWidth !== undefined &&
        truncatedElWidth !== undefined &&
        truncatedElWidth > anchorElWidth
      ) {
        setIsTruncate(true);
      } else {
        setIsTruncate(false);
      }
    };

    if (truncate) {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [truncate]);

  const handleMouseEnter = useCallback(() => {
    const bounding = triggerRef.current?.getBoundingClientRect();
    setElBounding(bounding);

    if (bounding) {
      const { innerWidth, innerHeight } = window;
      let finalPosition = position;

      switch (position) {
        case 'bottom':
          if (bounding.bottom + 125 > innerHeight) finalPosition = 'top';
          break;
        case 'top':
          if (bounding.top - 125 < 0) finalPosition = 'bottom';
          break;
        case 'right':
          if (bounding.right + 125 > innerWidth) finalPosition = 'left';
          break;
        case 'left':
          if (bounding.left - 125 < 0) finalPosition = 'right';
          break;
      }

      setCalculatedPosition(finalPosition);
    }

    if (delay > 0) {
      delayTimeout.current = setTimeout(() => {
        setFadeClass('opacity-100');
        setShowTooltip(true);
      }, delay);
    } else {
      setFadeClass('opacity-100');
      setShowTooltip(true);
    }
  }, [position, delay]);

  const handleMouseLeave = useCallback(() => {
    if (delayTimeout.current) {
      clearTimeout(delayTimeout.current);
      delayTimeout.current = null;
    }
    setFadeClass('opacity-0');
    setTimeout(() => setShowTooltip(false), 300);
  }, []);

  const closeTooltip = useCallback(() => {
    if (delayTimeout.current) {
      clearTimeout(delayTimeout.current);
      delayTimeout.current = null;
    }
    setFadeClass('opacity-0');
    setTimeout(() => setShowTooltip(false), 300);
  }, []);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showTooltip) {
        closeTooltip();
      }
    },
    [closeTooltip, showTooltip]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && showTooltip) {
        closeTooltip();
      }
    },
    [closeTooltip, showTooltip]
  );

  const shouldRenderTooltip = (): boolean => {
    return !truncate || isTruncate;
  };

  useEffect(() => {
    if (showTooltip && tooltipRef?.current) {
      const firstFocusableElement = tooltipRef?.current?.querySelector(
        "button, [tabindex]:not([tabindex='-1'])"
      );
      if (firstFocusableElement) {
        (firstFocusableElement as HTMLElement)?.focus();
      }
    }
  }, [showTooltip]);

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showTooltip, handleEscapeKey]);

  useEffect(() => {
    if (showTooltip && tooltipRef.current && elBounding) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const { innerWidth, innerHeight } = window;

      let top = 0;
      let left = 0;

      switch (calculatedPosition) {
        case 'bottom':
          top = elBounding.bottom + 5;
          left = elBounding.left;
          break;
        case 'top':
          top = elBounding.top - 5 - tooltipRect.height;
          left = elBounding.left;
          break;
        case 'right':
          top = elBounding.top;
          left = elBounding.right + 5;
          break;
        case 'left':
          top = elBounding.top;
          left = elBounding.left - 5 - tooltipRect.width;
          break;
      }

      if (left < TOOLTIP_MARGIN) {
        left = TOOLTIP_MARGIN;
      } else if (left + tooltipRect.width > innerWidth - TOOLTIP_MARGIN) {
        left = innerWidth - tooltipRect.width - TOOLTIP_MARGIN;
      }

      if (top < TOOLTIP_MARGIN) {
        top = TOOLTIP_MARGIN;
      } else if (top + tooltipRect.height > innerHeight - TOOLTIP_MARGIN) {
        top = innerHeight - tooltipRect.height - TOOLTIP_MARGIN;
      }

      tooltipRef.current.style.top = `${top}px`;
      tooltipRef.current.style.left = `${left}px`;
    }
  }, [showTooltip, elBounding, calculatedPosition]);

  const renderTooltip = useCallback(() => {
    if (showTooltip && elBounding) {
      let top = 0;
      let left = 0;

      switch (calculatedPosition) {
        case 'bottom':
          top = elBounding.bottom + 5;
          left = elBounding.left;
          break;
        case 'top':
          top = elBounding.top - 5 - (tooltipRef.current?.offsetHeight || 0);
          left = elBounding.left;
          break;
        case 'right':
          top = elBounding.top;
          left = elBounding.right + 5;
          break;
        case 'left':
          top = elBounding.top;
          left = elBounding.left - 5 - (tooltipRef.current?.offsetWidth || 0);
          break;
      }

      return (
        <div
          tabIndex={0}
          ref={tooltipRef}
          className={`ui_tooltip bg-card fixed z-[9999] max-w-[450px] rounded-md border p-0 text-sm break-words shadow-lg transition-opacity duration-300 ${fadeClass}`}
          style={{ top, left }}
          id="tooltip-content"
          onKeyDown={handleKeyDown}
        >
          {tooltip && tooltip()}
        </div>
      );
    }
    return null;
  }, [elBounding, showTooltip, tooltip, calculatedPosition, fadeClass, handleKeyDown]);

  return (
    <div
      tabIndex={tabIndex == 0 && shouldRenderTooltip() ? 0 : -1}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={triggerRef}
      className={`focus-indicator cursor-pointer ${triggerWrapperClass}`}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      id={id}
    >
      {triggerElement?.()}
      {isMounted &&
        shouldRenderTooltip() &&
        ReactDOM.createPortal(renderTooltip(), document.body)}
    </div>
  );
};

export default Tooltip;
