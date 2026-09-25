import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
  ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';

export interface HorizontalScrollProps {
  /** Content to render: a single ReactNode for one row, or an array of ReactNode for multiple rows (each item is one row). */
  children?: ReactNode | ReactNode[];
  /** Optional className for the outer wrapper */
  className?: string;
  /** Optional className for the scrollable content container(s) */
  contentClassName?: string;
  /** Number of pixels to scroll when clicking chevrons (default: 320) */
  scrollAmount?: number;
  /** Optional section title shown above the scroller */
  title?: string;
  /** Heading level for the title element (default: 'h2') */
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Optional className for the title */
  titleClassName?: string;
  /** Optional subtitle shown below the title */
  subtitle?: string;
  /** Optional className for the subtitle (p) */
  subtitleClassName?: string;
  /** "View all" control rendered by the consumer (e.g. a button or link). When provided, viewAllLabel and onViewAllClick are ignored. */
  viewAllButton?: ReactNode;
  /** Optional label for the default "View all" button (defaults to "View all"; used only when viewAllButton is not provided) */
  viewAllLabel?: string;
  /** Click handler for the default "View all" button (used only when viewAllButton is not provided) */
  onViewAllClick?: () => void;
  /** Accessible label for the scroll region (falls back to title when omitted) */
  ariaLabel?: string;
  /** Optional aria-label for the previous button */
  previousBtnAriaLabel?: string;
  /** Optional aria-label for the next button */
  nextBtnAriaLabel?: string;
}

const HORIZONTAL_SCROLL_ROW_ATTR = 'data-horizontal-scroll-row';

function getScrollItemElements(scrollRoot: HTMLElement): HTMLElement[] {
  const rows = scrollRoot.querySelectorAll<HTMLElement>(`[${HORIZONTAL_SCROLL_ROW_ATTR}]`);
  if (rows.length > 0) {
    return Array.from(rows).flatMap((row) => Array.from(row.children)) as HTMLElement[];
  }
  return Array.from(scrollRoot.children) as HTMLElement[];
}

const scrollContainerCls = (contentClassName?: string, hideScrollbar?: boolean) =>
  twMerge(
    'flex w-full min-w-0 gap-3 overflow-x-auto overflow-y-hidden',
    hideScrollbar
      ? 'no-scrollbar'
      : 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent',
    'pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-2',
    contentClassName
  );

function useScrollItemTabOrder(scrollRoot: HTMLElement | null) {
  useLayoutEffect(() => {
    if (!scrollRoot) return undefined;
    const root = scrollRoot;

    let io: IntersectionObserver | undefined;
    let lastObserved: HTMLElement[] = [];

    const clearInertFrom = (items: readonly HTMLElement[]) => {
      for (const el of items) {
        el.inert = false;
      }
    };

    const applyEntries = (entries: readonly IntersectionObserverEntry[], rootEl: HTMLElement) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const visible = entry.isIntersecting;
        if (!visible) {
          const active = document.activeElement;
          if (active instanceof HTMLElement && el.contains(active)) {
            rootEl.focus();
          }
        }
        el.inert = !visible;
      }
    };

    let raf = 0;
    const sync = () => {
      io?.disconnect();
      clearInertFrom(lastObserved);

      io = new IntersectionObserver((entries) => applyEntries(entries, root), {
        root,
        threshold: 0,
      });

      lastObserved = getScrollItemElements(root);
      for (const item of lastObserved) {
        io.observe(item);
      }
      applyEntries(io.takeRecords(), root);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    sync();

    const mo = new MutationObserver(() => {
      scheduleSync();
    });
    mo.observe(root, { childList: true, subtree: true });

    const onResize = () => {
      scheduleSync();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mo.disconnect();
      io?.disconnect();
      clearInertFrom(lastObserved);
    };
  }, [scrollRoot]);
}

const ChevronButton: React.FC<{
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
  ariaLabel: string;
  controlsId: string;
}> = ({ direction, disabled, onClick, ariaLabel, controlsId }) => (
  <button
    type="button"
    tabIndex={0}
    onClick={() => {
      if (disabled) return;
      onClick();
    }}
    aria-label={ariaLabel}
    aria-controls={controlsId}
    aria-disabled={disabled}
    className={twMerge(
      'bg-card flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-black shadow-sm',
      'focus-visible:ring-primary transition-colors duration-150 hover:bg-gray-50 focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      disabled && 'hover:bg-card cursor-not-allowed opacity-80'
    )}
  >
    <FontAwesomeIcon
      icon={direction === 'left' ? faChevronLeft : faChevronRight}
      className="h-3 w-3"
      aria-hidden="true"
    />
  </button>
);

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  className,
  contentClassName,
  scrollAmount = 320,
  title,
  titleLevel = 'h2',
  titleClassName,
  subtitle,
  subtitleClassName,
  viewAllButton,
  viewAllLabel,
  onViewAllClick,
  ariaLabel,
  previousBtnAriaLabel,
  nextBtnAriaLabel,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollRootForTabOrder, setScrollRootForTabOrder] = useState<HTMLDivElement | null>(null);

  const setScrollContainerRef = useCallback((el: HTMLDivElement | null) => {
    scrollContainerRef.current = el;
    setScrollRootForTabOrder(el);
  }, []);

  useScrollItemTabOrder(scrollRootForTabOrder);

  const regionId = useId();
  const titleId = `${regionId}-title`;
  const subtitleId = `${regionId}-subtitle`;
  const scrollAreaId = `${regionId}-scroll-area`;
  const keyboardHelpId = `${regionId}-keyboard-help`;

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isMultiRow = Array.isArray(children) && children.length > 0;
  const sections = isMultiRow ? (children as ReactNode[]) : null;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMultiRow, isMultiRow ? (children as ReactNode[]).length : 0]);

  const handleScrollBy = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const delta = direction === 'left' ? -scrollAmount : scrollAmount;
    container.scrollBy({
      left: delta,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const showViewAll = Boolean(viewAllButton ?? onViewAllClick);
  const viewAllLabelDisplay = viewAllLabel ?? 'View all';

  const handleContainerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;
    if (event.target !== event.currentTarget) return;

    switch (event.key) {
      case 'ArrowLeft':
        if (!canScrollLeft) return;
        event.preventDefault();
        handleScrollBy('left');
        break;
      case 'ArrowRight':
        if (!canScrollRight) return;
        event.preventDefault();
        handleScrollBy('right');
        break;
      case 'PageUp':
        if (!canScrollLeft) return;
        event.preventDefault();
        handleScrollBy('left');
        break;
      case 'PageDown':
        if (!canScrollRight) return;
        event.preventDefault();
        handleScrollBy('right');
        break;
      case 'Home':
        event.preventDefault();
        scrollContainerRef.current?.scrollTo({
          left: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
        break;
      case 'End':
        event.preventDefault();
        const el = scrollContainerRef.current;
        if (el)
          el.scrollTo({
            left: el.scrollWidth - el.clientWidth,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
        break;
      default:
        break;
    }
  };

  const scrollRegionLabel = ariaLabel || title || 'Horizontal scroll list';
  const scrollAreaAriaLabel = `${scrollRegionLabel} content`;
  const TitleTag = titleLevel;

  const header = (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      {(title || subtitle) && (
        <div className="min-w-0 flex-1 flex-col sm:min-w-0">
          {title && (
            <TitleTag
              id={titleId}
              className={twMerge('text-sm font-semibold text-gray-900 md:truncate', titleClassName)}
            >
              {title}
            </TitleTag>
          )}
          {subtitle && (
            <p
              id={subtitleId}
              className={twMerge('mt-0.5 text-xs text-gray-500 md:truncate', subtitleClassName)}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:ml-auto sm:gap-3">
        <div className="hidden gap-2 sm:flex">
          <ChevronButton
            direction="left"
            disabled={!canScrollLeft}
            onClick={() => handleScrollBy('left')}
            ariaLabel={previousBtnAriaLabel ?? `Scroll ${scrollRegionLabel} left`}
            controlsId={scrollAreaId}
          />
          <ChevronButton
            direction="right"
            disabled={!canScrollRight}
            onClick={() => handleScrollBy('right')}
            ariaLabel={nextBtnAriaLabel ?? `Scroll ${scrollRegionLabel} right`}
            controlsId={scrollAreaId}
          />
        </div>
        {showViewAll &&
          (viewAllButton ?? (
            <button
              type="button"
              onClick={onViewAllClick}
              aria-label={viewAllLabelDisplay}
              tabIndex={0}
              className="text-primary focus-visible:ring-primary text-xs font-medium hover:underline focus-visible:ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {viewAllLabelDisplay}
            </button>
          ))}
      </div>
    </div>
  );

  if (isMultiRow && sections) {
    return (
      <div
        id={regionId}
        className={twMerge('flex w-full min-w-0 flex-col gap-3', className)}
        role="region"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? subtitleId : undefined}
        aria-label={!title ? scrollRegionLabel : undefined}
      >
        {header}

        <div
          ref={setScrollContainerRef}
          id={scrollAreaId}
          tabIndex={-1}
          className={twMerge(
            scrollContainerCls(contentClassName),
            'focus-visible:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
          )}
          role="group"
          aria-describedby={keyboardHelpId}
          aria-orientation="horizontal"
          onKeyDown={handleContainerKeyDown}
        >
          <div className="inline-flex w-max min-w-full flex-col gap-6">
            {sections.map((sectionChildren, rowIndex) => (
              <div key={rowIndex} className="flex gap-3" data-horizontal-scroll-row="">
                {sectionChildren}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={regionId}
      className={twMerge('flex w-full min-w-0 flex-col gap-3', className)}
      role="region"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
      aria-label={!title ? scrollRegionLabel : undefined}
    >
      {header}

      <div
        ref={setScrollContainerRef}
        id={scrollAreaId}
        tabIndex={-1}
        className={twMerge(
          scrollContainerCls(contentClassName),
          'focus-visible:outline-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
        )}
        role="group"
        aria-describedby={keyboardHelpId}
        aria-orientation="horizontal"
        onKeyDown={handleContainerKeyDown}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;
