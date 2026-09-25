'use client';

import type { ReactNode } from 'react';
import { useState, useEffect, useRef, KeyboardEvent, Children } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';
import { TabsProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-light-svg-icons';

const Tabs = ({
  tabs,
  activeIndex = 0,
  onTabChange,
  className = '',
  disabled = false,
  height = '40px',
  type = 'primary',
  position = 'center',
  id = 'tabs',
  useScrollButtons = true,
  bottomBorderReq = true,
  variant = 'primary',
  iconOnly = false,
  bottomBorderClass,
  children,
  tabGapClassName,
  activeTabClassName,
  inactiveTabClassName,
  tertiaryActiveTextClassName,
  tertiaryInactiveTextClassName,
  tertiaryActiveUnderlineClassName,
  tertiaryInactiveUnderlineClassName,
  contentClassName,
}: TabsProps) => {
  const pathname = usePathname();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  // Check if scroll buttons should be shown
  const checkScrollButtons = () => {
    if (!scrollContainerRef.current || !useScrollButtons) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding errors
  };

  // Scroll left or right
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200; // Adjust scroll amount as needed
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll =
      direction === 'left'
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, tabs.length);

    // Initial check for scroll buttons
    checkScrollButtons();

    // Add scroll event listener
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && useScrollButtons) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }

    return () => {
      if (scrollContainer && useScrollButtons) {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      }
    };
  }, [tabs, useScrollButtons]);

  const getVariantClasses = (isSelected: boolean) => {
    if (!isSelected) return '';

    switch (variant) {
      case 'primary':
        return 'bg-primary text-white focus-visible:outline-white font-medium text-sm';
      case 'info':
        return 'bg-slate-300 text-black';
      case 'custom':
        return activeTabClassName || 'bg-primary text-white focus-visible:outline-white';
      default:
        return 'bg-primary text-white focus-visible:outline-white';
    }
  };

  const getTabClasses = (
    isSelected: boolean,
    isFocused: boolean,
    index: number,
    tabClassName: string
  ) => {
    const baseClasses = classNames({
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-5px]': true,
      'focus-visible:outline-primary': !isSelected,
      'flex-1': position === 'center',
      [tabClassName]: !!tabClassName,
    });

    if (type === 'secondary') {
      return classNames(
        baseClasses,
        'text-sm font-medium px-4 text-center border-b-2 transition-colors',
        isSelected
          ? 'text-primary border border-primary rounded'
          : 'text-gray-700 border-transparent',
        isFocused && !isSelected ? 'border-gray-300' : ''
      );
    }
    if (type === 'tertiary') {
      const activeTextClass =
        tertiaryActiveTextClassName && tertiaryActiveTextClassName.trim().length > 0
          ? tertiaryActiveTextClassName
          : 'text-primary';
      const inactiveTextClass =
        tertiaryInactiveTextClassName && tertiaryInactiveTextClassName.trim().length > 0
          ? tertiaryInactiveTextClassName
          : 'text-gray-700';
      const activeUnderlineClass =
        tertiaryActiveUnderlineClassName && tertiaryActiveUnderlineClassName.trim().length > 0
          ? tertiaryActiveUnderlineClassName
          : 'border-primary';
      const inactiveUnderlineClass =
        tertiaryInactiveUnderlineClassName && tertiaryInactiveUnderlineClassName.trim().length > 0
          ? tertiaryInactiveUnderlineClassName
          : (bottomBorderClass ?? 'border-[#D2D9E5]');

      return classNames(
        // For tertiary type, we already have position-specific classes
        position === 'center' ? 'flex-1' : variant === 'custom' ? '' : 'px-2',
        baseClasses,
        `flex flex-col items-center justify-center text-sm font-medium text-center ${bottomBorderReq ? 'border-b' : ''} transition-colors`,
        variant !== 'custom' ? 'py-3 px-4' : '',
        isSelected
          ? classNames(activeTextClass, activeUnderlineClass, 'border-b-2 font-semibold')
          : classNames(inactiveTextClass, bottomBorderReq ? inactiveUnderlineClass : ''),
        isFocused && !isSelected ? 'border-gray-400' : ''
      );
    }
    if (type === 'switcher') {
      const isCustomVariant = variant === 'custom';
      const hasGap = !!tabGapClassName;
      const paddingClass = hasGap ? '' : 'px-4';

      return classNames(
        baseClasses,
        'flex flex-col items-center justify-center  transition-colors',
        paddingClass,
        isSelected
          ? isCustomVariant
            ? activeTabClassName || getVariantClasses(isSelected)
            : getVariantClasses(isSelected)
          : isCustomVariant
            ? inactiveTabClassName || 'bg-card text-gray-700 hover:text-gray-500'
            : 'bg-card text-gray-700 hover:text-gray-500 border border-[#D2D9E5 font-medium  text-sm ',
        isFocused && !isSelected ? 'bg-gray-100' : '',
        hasGap ? 'rounded-md' : '',
        !hasGap && index === 0 ? 'rounded-l-lg' : '',
        !hasGap && index === tabs.length - 1 ? 'rounded-r-lg' : ''
      );
    }

    const hasGap = !!tabGapClassName;

    return classNames(
      baseClasses,
      'flex flex-col items-center justify-center text-sm font-medium',
      variant === 'custom' ? '' : 'px-6',
      isSelected
        ? `${getVariantClasses(isSelected)} rounded-lg`
        : 'bg-card text-gray-700 hover:text-gray-500',
      isFocused && !isSelected ? 'bg-gray-100' : '',
      hasGap ? 'rounded-md' : '',
      !hasGap && index === 0 ? 'rounded-l-lg' : '',
      !hasGap && index === tabs.length - 1 ? 'rounded-r-lg' : ''
    );
  };

  const iconClasses = (isSelected: boolean) =>
    classNames(
      'h-5 w-5',
      type === 'secondary'
        ? isSelected
          ? 'text-primary'
          : variant === 'custom'
            ? inactiveTabClassName
            : 'text-gray-500'
        : isSelected && type !== 'tertiary'
          ? 'text-white'
          : type === 'tertiary'
            ? isSelected
              ? 'text-black'
              : 'text-gray-700'
            : 'text-gray-700'
    );

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const tabCount = tabs.length;
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (index + 1) % tabCount;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (index - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabCount - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!tabs[index].href) {
          onTabChange?.(index, tabs[index].query);
        } else {
          return;
        }
        break;
      default:
        return;
    }
    tabRefs.current[newIndex]?.focus();
  };

  const scrollButtonClasses =
    'absolute top-0 bottom-0 flex items-center justify-center w-8 bg-card focus-indicator';

  const childArray = Children.toArray(children);

  const getTabPanelContent = (index: number, isSelected: boolean): ReactNode => {
    if (childArray.length === 0) return null;
    if (childArray.length === tabs.length) return childArray[index];
    if (childArray.length === 1) return isSelected ? childArray[0] : null;
    return isSelected ? children : null;
  };

  const getTabId = (tab: (typeof tabs)[number], index: number) =>
    `${typeof tab?.title === 'string' ? tab.title.replace(/\s+/g, '_') : tab.title}-tab-${index}`;

  return (
    <div className={classNames('relative', { 'opacity-70': disabled })}>
      {/* Left scroll button */}
      {useScrollButtons && showLeftButton && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className={classNames(scrollButtonClasses, 'left-0')}
          aria-label="Scroll tabs left"
          disabled={disabled}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-default h-4 w-4" />
        </button>
      )}

      {/* Tabs container with hidden scrollbar */}
      <div
        ref={scrollContainerRef}
        className={classNames('scrollbar-hide flex w-full overflow-x-auto', className, {
          'pointer-events-none cursor-wait': disabled,
          'px-8': useScrollButtons && (showLeftButton || showRightButton),
        })}
        onScroll={useScrollButtons ? checkScrollButtons : undefined}
      >
        <nav
          className={classNames(
            'flex',
            position === 'center' ? 'w-full' : 'w-auto',
            tabGapClassName
          )}
          role="tablist"
        >
          {tabs.map((tab, index) => {
            const isSelected = tab.href
              ? pathname === tab.href || pathname?.includes(tab.href)
              : index === activeIndex;
            const isFocused = focusedIndex === index;

            const tabId = getTabId(tab, index);
            const panelId = `${id}-panel-${index}`;

            const tertiaryContentClassName = isSelected ? activeTabClassName : inactiveTabClassName;

            const content = (
              <div
                className={classNames(
                  'flex items-center',
                  position === 'center' ? 'w-full justify-center' : 'justify-start',
                  variant === 'custom' && contentClassName && contentClassName.trim().length > 0
                    ? contentClassName
                    : 'space-x-2',
                  type === 'tertiary' &&
                    variant === 'custom' &&
                    tertiaryContentClassName &&
                    tertiaryContentClassName.trim().length > 0
                    ? tertiaryContentClassName
                    : ''
                )}
              >
                {tab.icon && (
                  <span className={iconClasses(isSelected)} aria-hidden="true">
                    {tab.icon}
                  </span>
                )}
                {!iconOnly && (
                  <div className="text-center whitespace-nowrap">
                    <span>{tab.title}</span>
                    {tab.subtext && type === 'primary' && (
                      <div className="text-xs">{tab.subtext}</div>
                    )}
                  </div>
                )}

                {/* Badge logic: show 'badge of totalCount' if both are present and totalCount > 0, else totalCount if > 0, else badge */}
                {tab && ((tab.totalCount ?? 0) > 0 || (tab.badge ?? -1) >= 0) && (
                  <span className="flex h-6 min-w-fit items-center justify-center rounded-full bg-[#E4E1E6] px-2 text-xs whitespace-nowrap text-[#262626]">
                    {(tab.badge ?? -1) >= 0 && (tab.totalCount ?? 0) > 0
                      ? `${tab.badge} of ${tab.totalCount}`
                      : (tab.totalCount ?? 0) > 0
                        ? tab.totalCount
                        : (tab.badge ?? '')}
                  </span>
                )}
              </div>
            );

            if (tab.href) {
              return (
                <Link
                  href={tab.href}
                  key={`tab_${index}`}
                  id={tabId}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  aria-selected={isSelected}
                  aria-controls={panelId}
                  tabIndex={isSelected ? 0 : -1}
                  role="tab"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => {
                    e?.currentTarget?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'nearest',
                    });
                    setFocusedIndex(index);
                  }}
                  onBlur={() => setFocusedIndex(null)}
                  className={getTabClasses(isSelected, isFocused, index, tab.tabClassName ?? '')}
                  style={{ minHeight: height }}
                >
                  {content}
                </Link>
              );
            } else {
              return (
                <button
                  key={`tab_${index}`}
                  id={tabId}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  disabled={disabled}
                  onClick={() => onTabChange?.(index, tab.query)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => {
                    e?.currentTarget?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'nearest',
                    });
                    setFocusedIndex(index);
                  }}
                  onBlur={() => setFocusedIndex(null)}
                  className={getTabClasses(isSelected, isFocused, index, tab.tabClassName ?? '')}
                  style={{ minHeight: height }}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={panelId}
                  tabIndex={isSelected ? 0 : -1}
                >
                  {content}
                </button>
              );
            }
          })}
        </nav>
      </div>

      {tabs.map((tab, index) => {
        const isSelected = tab.href
          ? pathname === tab.href || pathname?.includes(tab.href)
          : index === activeIndex;
        const tabId = getTabId(tab, index);
        const panelId = `${id}-panel-${index}`;

        return (
          <div
            key={`${id}-tabpanel-${index}`}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isSelected}
            tabIndex={childArray.length > 0 ? (isSelected ? 0 : -1) : (null as any)}
          >
            {getTabPanelContent(index, isSelected)}
          </div>
        );
      })}

      {/* Right scroll button */}
      {useScrollButtons && showRightButton && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className={classNames(scrollButtonClasses, 'right-0')}
          aria-label="Scroll tabs right"
          disabled={disabled}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-default h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Tabs;
