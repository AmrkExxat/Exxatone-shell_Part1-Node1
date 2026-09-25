import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';

const MENU_CONTENT_BASE =
  'z-50 min-w-[200px] rounded-xl border border-gray-200 bg-card shadow-lg focus:outline-none';
const MENU_ITEM_BASE =
  'relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 h-12 text-sm outline-none ring-0';
const MENU_ITEM_FOCUS_RING = 'focus:ring-2 focus:ring-primary focus:ring-offset-2';
const MENU_ITEM_STATES =
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-gray-100';
const MENU_LABEL_BASE = 'px-3 py-2 text-xs font-semibold text-gray-500';
const MENU_SEPARATOR_BASE = 'h-px bg-gray-200';
const MENU_SUB_TRIGGER_BASE =
  'outline-none ring-0 relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm data-[state=open]:bg-gray-100 data-[highlighted]:bg-gray-100';
const MENU_SUB_CONTENT_BASE =
  'z-50 min-w-[180px] rounded-xl border border-gray-200 bg-card p-1 shadow-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white';

const DEFAULT_SUBMENU_INDICATOR = '>';

type MenuItemVariant = 'default' | 'danger';

interface MenuBaseItem {
  id: string;
  disabled?: boolean;
  testId?: string;
}

export interface MenuActionItem extends MenuBaseItem {
  type?: 'item';
  label: React.ReactNode;
  ariaLabel?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  keepOpenOnSelect?: boolean;
  variant?: MenuItemVariant;
  className?: string;
}

export interface MenuSubmenuItem extends MenuBaseItem {
  type: 'submenu';
  label: React.ReactNode;
  ariaLabel?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  items: MenuItem[];
  className?: string;
  contentTestId?: string;
}

export interface MenuSeparatorItem extends MenuBaseItem {
  type: 'separator';
}

export interface MenuLabelItem extends MenuBaseItem {
  type: 'label';
  label: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

export type MenuItem = MenuActionItem | MenuSubmenuItem | MenuSeparatorItem | MenuLabelItem;

export interface MenuProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Root>,
  'children'
> {
  /**
   * Element that acts as the trigger. If not a single element, it will be wrapped in a button.
   */
  children: React.ReactNode;
  /**
   * List of menu items to render, supports nested submenus.
   */
  items: MenuItem[];
  /**
   * Called when an actionable menu item is selected.
   */
  onSelect?: (item: MenuActionItem) => void;
  /**
   * Additional props for the trigger element.
   */
  triggerProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenu.Trigger>,
    'asChild' | 'children'
  >;
  /**
   * Additional props for the menu content.
   */
  contentProps?: Omit<React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>, 'children'>;
  /**
   * Additional props for submenu content.
   */
  subContentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DropdownMenu.SubContent>,
    'children'
  >;
  contentClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  separatorClassName?: string;
  subTriggerClassName?: string;
  subContentClassName?: string;
  triggerClassName?: string;
  triggerTestId?: string;
  contentTestId?: string;
  submenuIndicator?: React.ReactNode;
  /**
   * When true, menu can be controlled by hover on the trigger instead of click.
   * Clicking the trigger in this mode does not open/close the menu and instead invokes onTriggerClick.
   * Keyboard open is still supported with Enter/Space and ArrowDown/ArrowUp from the trigger.
   * When the panel closes (including Escape), focus returns to the inner trigger control because
   * the Radix trigger host is a focus wrapper.
   */
  openOnFocus?: boolean;
  /**
   * Delay in ms before the menu opens after hover when openOnFocus is true. Default: 2000.
   */
  focusOpenDuration?: number;
  /**
   * Called when the trigger is clicked while openOnFocus is true (menu open/close is not toggled).
   */
  onTriggerClick?: () => void;
  /**
   * Controls whether menu content is rendered in a Radix portal.
   * Default: true.
   */
  portal?: boolean;
}

const getVariantClasses = (variant: MenuItemVariant) => {
  if (variant === 'danger') {
    return 'text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-700';
  }
  return 'text-gray-900';
};

const getIconClass = (variant: MenuItemVariant) => {
  return variant === 'danger' ? 'text-red-500' : 'text-gray-500';
};

const getShortcutClass = (variant: MenuItemVariant) => {
  return variant === 'danger' ? 'text-red-400' : 'text-gray-400';
};

const renderRightContent = (
  shortcut: React.ReactNode,
  shortcutClassName: string,
  indicator?: React.ReactNode
) => {
  if (!shortcut && !indicator) {
    return null;
  }

  return (
    <span className="ml-auto flex items-center gap-2">
      {shortcut && <span className={shortcutClassName}>{shortcut}</span>}
      {indicator && <span className="text-gray-400">{indicator}</span>}
    </span>
  );
};

const renderItemContent = (
  label: React.ReactNode,
  icon: React.ReactNode,
  iconClassName: string,
  rightContent: React.ReactNode,
  ariaLabel?: string
) => {
  if (!icon && !rightContent) {
    return label;
  }

  return (
    <>
      {icon && <span className={twMerge('h-4 w-4', iconClassName)}>{icon}</span>}
      <span className="flex-1" {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}>
        {label}
      </span>
      {rightContent}
    </>
  );
};

/**
 * Menu component built with Radix Dropdown Menu primitives.
 * Provides data-driven items with support for nested submenus.
 */
const FOCUS_OPEN_DURATION_DEFAULT = 1000;

export function Menu({
  children,
  items,
  onSelect,
  triggerProps,
  contentProps,
  subContentProps,
  contentClassName,
  itemClassName,
  labelClassName,
  separatorClassName,
  subTriggerClassName,
  subContentClassName,
  triggerClassName,
  triggerTestId,
  contentTestId,
  submenuIndicator,
  openOnFocus = false,
  focusOpenDuration = FOCUS_OPEN_DURATION_DEFAULT,
  onTriggerClick,
  portal = true,
  ...props
}: Readonly<MenuProps>): React.ReactElement {
  const {
    open: controlledOpen,
    defaultOpen,
    onOpenChange: rootOnOpenChange,
    ...restRootProps
  } = props;
  const {
    className: triggerPropsClassName,
    onFocus: triggerPropsOnFocus,
    onBlur: triggerPropsOnBlur,
    onClick: triggerPropsOnClick,
    onMouseEnter: triggerPropsOnMouseEnter,
    onMouseLeave: triggerPropsOnMouseLeave,
    onKeyDown: triggerPropsOnKeyDown,
    ...restTriggerProps
  } = triggerProps ?? {};
  const {
    className: contentPropsClassName,
    sideOffset = 8,
    align = 'start',
    onCloseAutoFocus: contentPropsOnCloseAutoFocus,
    onKeyDown: contentPropsOnKeyDown,
    ...restContentProps
  } = contentProps ?? {};
  const {
    className: subContentPropsClassName,
    sideOffset: subSideOffset = 8,
    ...restSubContentProps
  } = subContentProps ?? {};

  const [open, setOpen] = React.useState(false);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [isKeyboardNav, setIsKeyboardNav] = React.useState(false);
  const focusTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactionLockedRef = React.useRef(false);
  const skipTriggerRefocusOnCloseRef = React.useRef(false);
  const triggerElementRef = React.useRef<HTMLElement | null>(null);
  const menuContentRef = React.useRef<HTMLDivElement | null>(null);
  const openOnFocusTriggerWrapperRef = React.useRef<HTMLDivElement | null>(null);

  const isControlledByFocus = openOnFocus;
  const isRootControlled = controlledOpen !== undefined;
  const resolvedOpen = isControlledByFocus
    ? open
    : isRootControlled
      ? controlledOpen
      : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlledByFocus) {
        return;
      }
      if (next) {
        return;
      }
      setOpen(false);
    },
    [isControlledByFocus]
  );

  const setMenuOpen = React.useCallback(
    (next: boolean) => {
      if (isControlledByFocus) {
        setOpen(next);
        return;
      }
      if (!isRootControlled) {
        setUncontrolledOpen(next);
      }
      rootOnOpenChange?.(next);
    },
    [isControlledByFocus, isRootControlled, rootOnOpenChange]
  );

  const handleRootOpenChange = React.useCallback(
    (next: boolean) => {
      if (isControlledByFocus) {
        handleOpenChange(next);
        return;
      }
      if (!isRootControlled) {
        setUncontrolledOpen(next);
      }
      rootOnOpenChange?.(next);
    },
    [handleOpenChange, isControlledByFocus, isRootControlled, rootOnOpenChange]
  );

  const cancelScheduledOpen = React.useCallback(() => {
    if (focusTimerRef.current) {
      clearTimeout(focusTimerRef.current);
      focusTimerRef.current = null;
    }
  }, []);

  const focusMenuItemAtEdge = React.useCallback((edge: 'first' | 'last') => {
    const root = menuContentRef.current;
    if (!root) return false;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])')
    );
    if (items.length === 0) return false;
    (edge === 'first' ? items[0] : items[items.length - 1])?.focus();
    return true;
  }, []);

  const scheduleOpen = React.useCallback(() => {
    if (!openOnFocus || interactionLockedRef.current) return;
    cancelScheduledOpen();
    if (focusOpenDuration <= 0) {
      setOpen(true);
      return;
    }
    focusTimerRef.current = setTimeout(() => {
      focusTimerRef.current = null;
      setOpen(true);
    }, focusOpenDuration);
  }, [openOnFocus, focusOpenDuration, cancelScheduledOpen]);

  const handleTriggerFocus = React.useCallback(
    (event: React.FocusEvent<Element>) => {
      triggerPropsOnFocus?.(event as React.FocusEvent<HTMLButtonElement>);
    },
    [triggerPropsOnFocus]
  );

  const handleTriggerBlur = React.useCallback(
    (event: React.FocusEvent<Element>) => {
      triggerPropsOnBlur?.(event as React.FocusEvent<HTMLButtonElement>);
      cancelScheduledOpen();
      window.setTimeout(() => {
        const active = document.activeElement;
        if (active instanceof Node && menuContentRef.current?.contains(active)) {
          return;
        }
        interactionLockedRef.current = false;
        setOpen(false);
      }, 0);
    },
    [triggerPropsOnBlur, cancelScheduledOpen]
  );

  const handleTriggerHover = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      triggerPropsOnMouseEnter?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
      scheduleOpen();
    },
    [triggerPropsOnMouseEnter, scheduleOpen]
  );

  const handleTriggerLeave = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      triggerPropsOnMouseLeave?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
      cancelScheduledOpen();
      interactionLockedRef.current = false;
    },
    [triggerPropsOnMouseLeave, cancelScheduledOpen]
  );

  const focusOpenOnFocusInnerTrigger = React.useCallback(() => {
    const wrap = openOnFocusTriggerWrapperRef.current;
    if (!wrap) return;
    const btn =
      wrap.querySelector<HTMLElement>('button:not([disabled])') ??
      wrap.querySelector<HTMLElement>('a[href]:not([aria-disabled="true"])');
    if (btn) {
      btn.focus();
      return;
    }
    const prev = wrap.getAttribute('tabindex');
    wrap.setAttribute('tabindex', '-1');
    wrap.focus();
    if (prev == null) wrap.removeAttribute('tabindex');
    else wrap.setAttribute('tabindex', prev);
  }, []);

  const handleOpenOnFocusCloseAutoFocus = React.useCallback(
    (event: Event) => {
      if (skipTriggerRefocusOnCloseRef.current) {
        skipTriggerRefocusOnCloseRef.current = false;
        event.preventDefault();
        return;
      }
      if (!openOnFocus) return;
      if (event.defaultPrevented) return;
      cancelScheduledOpen();
      interactionLockedRef.current = true;
      event.preventDefault();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          focusOpenOnFocusInnerTrigger();
        });
      });
    },
    [openOnFocus, cancelScheduledOpen, focusOpenOnFocusInnerTrigger]
  );

  const handleContentKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      contentPropsOnKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key !== 'Tab') return;
      event.preventDefault();

      const triggerElement = triggerElementRef.current;
      const allFocusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) =>
          !element.hasAttribute('disabled') &&
          element.getAttribute('aria-hidden') !== 'true' &&
          element.tabIndex >= 0 &&
          element.offsetParent !== null
      );
      const triggerIndex = triggerElement ? allFocusable.indexOf(triggerElement) : -1;
      const nextIndex =
        triggerIndex >= 0 ? (event.shiftKey ? triggerIndex - 1 : triggerIndex + 1) : -1;
      const nextFocusable = nextIndex >= 0 ? allFocusable[nextIndex] : null;

      skipTriggerRefocusOnCloseRef.current = true;
      setMenuOpen(false);
      window.requestAnimationFrame(() => {
        nextFocusable?.focus();
      });
    },
    [contentPropsOnKeyDown, setMenuOpen]
  );

  React.useEffect(() => {
    return () => {
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    const onKeyDown = () => setIsKeyboardNav(true);
    const onPointer = () => setIsKeyboardNav(false);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('pointermove', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('pointermove', onPointer, true);
    };
  }, []);

  const menuItemFocusRingClass = isKeyboardNav ? MENU_ITEM_FOCUS_RING : '';

  React.useLayoutEffect(() => {
    if (!open || !openOnFocus) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const wrap = openOnFocusTriggerWrapperRef.current;
        if (!wrap?.contains(document.activeElement)) return;
        focusMenuItemAtEdge('first');
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, openOnFocus, focusMenuItemAtEdge]);

  React.useEffect(() => {
    if (openOnFocus) return;
    if (!resolvedOpen) return;
    const timer = setTimeout(() => {
      focusMenuItemAtEdge('first');
    }, 0);
    return () => clearTimeout(timer);
  }, [resolvedOpen, openOnFocus, focusMenuItemAtEdge]);

  const triggerClasses = twMerge(triggerPropsClassName, triggerClassName);
  const triggerChild =
    React.isValidElement(children) && children.type !== React.Fragment ? (
      React.cloneElement(children as React.ReactElement<any>, {
        ...((children as React.ReactElement<any>).props ?? {}),
        className: twMerge((children as React.ReactElement<any>).props?.className, triggerClasses),
        ...(triggerTestId ? { 'data-testid': triggerTestId } : {}),
        ...(openOnFocus
          ? {
              onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
                (children as React.ReactElement<any>).props?.onKeyDown?.(e);
                triggerPropsOnKeyDown?.(e);
                triggerElementRef.current = e.currentTarget;
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  cancelScheduledOpen();
                  const edge = e.key === 'ArrowDown' ? 'first' : 'last';
                  if (!open) {
                    setOpen(true);
                    window.setTimeout(() => {
                      focusMenuItemAtEdge(edge);
                    }, 0);
                  } else {
                    focusMenuItemAtEdge(edge);
                  }
                  return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  cancelScheduledOpen();
                  interactionLockedRef.current = false;
                  setOpen(true);
                  window.setTimeout(() => {
                    focusMenuItemAtEdge('first');
                  }, 0);
                }
              },
              onClick: (e: React.MouseEvent) => {
                (children as React.ReactElement<any>).props?.onClick?.(e);
                triggerPropsOnClick?.(e as React.MouseEvent<HTMLButtonElement>);
                triggerElementRef.current = e.currentTarget as HTMLElement;
                interactionLockedRef.current = true;
                cancelScheduledOpen();
                setOpen(false);
                onTriggerClick?.();
              },
            }
          : {}),
      })
    ) : (
      <button
        type="button"
        className={triggerClasses}
        data-testid={triggerTestId}
        {...(openOnFocus
          ? {
              onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
                triggerPropsOnKeyDown?.(e);
                triggerElementRef.current = e.currentTarget;
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  cancelScheduledOpen();
                  const edge = e.key === 'ArrowDown' ? 'first' : 'last';
                  if (!open) {
                    setOpen(true);
                    window.setTimeout(() => {
                      focusMenuItemAtEdge(edge);
                    }, 0);
                  } else {
                    focusMenuItemAtEdge(edge);
                  }
                  return;
                }
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  cancelScheduledOpen();
                  interactionLockedRef.current = false;
                  setOpen(true);
                  window.setTimeout(() => {
                    focusMenuItemAtEdge('first');
                  }, 0);
                }
              },
              onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                triggerElementRef.current = e.currentTarget;
                interactionLockedRef.current = true;
                cancelScheduledOpen();
                setOpen(false);
                triggerPropsOnClick?.(e);
                onTriggerClick?.();
              },
            }
          : {})}
      >
        {children}
      </button>
    );

  const renderItems = (menuItems: MenuItem[]): React.ReactNode =>
    menuItems.map((item) => {
      const type = item.type ?? 'item';

      if (type === 'separator') {
        return (
          <DropdownMenu.Separator
            key={item.id}
            className={twMerge(MENU_SEPARATOR_BASE, separatorClassName)}
            data-testid={item.testId}
          />
        );
      }

      if (type === 'label') {
        const labelItem = item as MenuLabelItem;
        return (
          <DropdownMenu.Label
            key={labelItem.id}
            className={twMerge(MENU_LABEL_BASE, labelClassName, labelItem.className)}
            data-testid={labelItem.testId}
            {...(labelItem?.ariaLabel ? { 'aria-label': labelItem?.ariaLabel } : {})}
          >
            {labelItem.label}
          </DropdownMenu.Label>
        );
      }

      if (type === 'submenu') {
        const subItem = item as MenuSubmenuItem;
        const rightContent = renderRightContent(
          subItem.shortcut,
          getShortcutClass('default'),
          submenuIndicator ?? DEFAULT_SUBMENU_INDICATOR
        );
        const content = renderItemContent(
          subItem.label,
          subItem.icon,
          getIconClass('default'),
          rightContent,
          subItem.ariaLabel
        );

        return (
          <DropdownMenu.Sub key={subItem.id}>
            <DropdownMenu.SubTrigger
              className={twMerge(
                MENU_SUB_TRIGGER_BASE,
                MENU_ITEM_STATES,
                menuItemFocusRingClass,
                subTriggerClassName,
                subItem.className
              )}
              data-testid={subItem.testId}
              disabled={subItem.disabled}
              id={subItem.id}
              onClick={() => {
                setTimeout(() => {
                  const subContent = document.querySelector(
                    `[data-testid="${subItem.contentTestId}"]`
                  ) as HTMLElement;
                  if (subContent) {
                    const items = Array.from(
                      subContent.querySelectorAll<HTMLElement>(
                        '[role="menuitem"]:not([data-disabled])'
                      )
                    );
                    if (items.length > 0) {
                      items[0].focus();
                    }
                  }
                }, 0);
              }}
            >
              {content}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent
              className={twMerge(
                MENU_SUB_CONTENT_BASE,
                subContentClassName,
                subContentPropsClassName
              )}
              sideOffset={subSideOffset}
              collisionPadding={{ top: 16, bottom: 16, left: 16, right: 16 }}
              data-testid={subItem.contentTestId}
              ref={(el) => {
                if (el) {
                  const viewportWidth = window.innerWidth;
                  const wrapper = el.closest('[data-radix-popper-content-wrapper]');

                  if (viewportWidth <= 280) {
                    if (wrapper && wrapper instanceof HTMLElement) {
                      wrapper.style.setProperty(
                        'transform',
                        `translate(-${viewportWidth / 2 + 50}px, 16px)`,
                        'important'
                      );
                    }
                    el.style.setProperty('max-height', 'calc(100vh - 100px)', 'important');
                    el.style.setProperty('overflow-y', 'auto', 'important');
                    el.style.setProperty('width', `${viewportWidth - 32}px`, 'important');
                  } else if (viewportWidth <= 340) {
                    if (wrapper && wrapper instanceof HTMLElement) {
                      wrapper.style.setProperty(
                        'transform',
                        'translate(-100px, 16px)',
                        'important'
                      );
                    }
                    el.style.setProperty('max-height', 'calc(100vh - 130px)', 'important');
                    el.style.setProperty('overflow-y', 'auto', 'important');
                  } else if (viewportWidth <= 480) {
                    el.style.setProperty('max-height', 'calc(100vh - 100px)', 'important');
                    el.style.setProperty('overflow-y', 'auto', 'important');
                  } else if (viewportWidth <= 640) {
                    el.style.setProperty('max-height', 'calc(100vh - 80px)', 'important');
                    el.style.setProperty('overflow-y', 'auto', 'important');
                  }
                }
              }}
              {...restSubContentProps}
            >
              {renderItems(subItem.items)}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        );
      }

      const actionItem = item as MenuActionItem;
      const variant = actionItem.variant ?? 'default';
      const rightContent = renderRightContent(actionItem.shortcut, getShortcutClass(variant));
      const content = renderItemContent(
        actionItem.label,
        actionItem.icon,
        getIconClass(variant),
        rightContent,
        actionItem?.ariaLabel
      );

      return (
        <DropdownMenu.Item
          key={actionItem.id}
          className={twMerge(
            MENU_ITEM_BASE,
            MENU_ITEM_STATES,
            menuItemFocusRingClass,
            getVariantClasses(variant),
            itemClassName,
            actionItem.className
          )}
          data-testid={actionItem.testId}
          disabled={actionItem.disabled}
          onSelect={(event) => {
            if (actionItem.keepOpenOnSelect) {
              event.preventDefault();
            }
            onSelect?.(actionItem);
          }}
          id={actionItem.id}
        >
          {content}
        </DropdownMenu.Item>
      );
    });

  const rootProps = { ...restRootProps, open: resolvedOpen, onOpenChange: handleRootOpenChange };

  const triggerNode = openOnFocus ? (
    <div
      ref={openOnFocusTriggerWrapperRef}
      onFocusCapture={handleTriggerFocus}
      onBlurCapture={handleTriggerBlur}
      onMouseEnter={handleTriggerHover}
      onMouseLeave={handleTriggerLeave}
      style={{ display: 'inline-block' }}
    >
      {triggerChild}
    </div>
  ) : (
    triggerChild
  );

  const handleContentMouseLeave = React.useCallback(() => {
    setOpen(false);
  }, []);

  const contentNode = (
    <DropdownMenu.Content
      className={twMerge(MENU_CONTENT_BASE, contentClassName, contentPropsClassName)}
      sideOffset={sideOffset}
      align={align}
      data-testid={contentTestId}
      onMouseLeave={handleContentMouseLeave}
      {...restContentProps}
      onKeyDown={handleContentKeyDown}
      onCloseAutoFocus={(event) => {
        contentPropsOnCloseAutoFocus?.(event);
        handleOpenOnFocusCloseAutoFocus(event);
      }}
      ref={menuContentRef}
    >
      {renderItems(items)}
    </DropdownMenu.Content>
  );

  return (
    <DropdownMenu.Root {...rootProps}>
      <DropdownMenu.Trigger
        asChild
        {...restTriggerProps}
        onPointerDownCapture={(event) => {
          const target = event.target as HTMLElement | null;
          const triggerHost =
            target?.closest<HTMLElement>('button, [role="button"], a[href], [tabindex]') ?? null;
          triggerElementRef.current = triggerHost;
        }}
        onKeyDownCapture={(event) => {
          const target = event.target as HTMLElement | null;
          const triggerHost =
            target?.closest<HTMLElement>('button, [role="button"], a[href], [tabindex]') ?? null;
          triggerElementRef.current = triggerHost;
        }}
      >
        {triggerNode}
      </DropdownMenu.Trigger>
      {portal ? <DropdownMenu.Portal>{contentNode}</DropdownMenu.Portal> : contentNode}
    </DropdownMenu.Root>
  );
}

export default Menu;
