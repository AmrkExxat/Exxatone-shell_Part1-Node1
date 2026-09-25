'use client';

import { Slide, toast, ToastContainer, type ToastContentProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationBanner from './NotificationBanner/NotificationBanner';
import {
  forwardRef,
  JSX,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { type NotificationProps } from './notification.type';
import { bindStackHoverContainer, STACK_CONTAINER_CLASS } from './autoCloseCoordinator';

export interface NotificationToastHandler {
  notify: (notifcationProps: NotificationProps) => void;
}

interface NotificationToastComponentProps {
  id?: string;
  /** Default auto-close for all toasts (ms). Overridable per notify(). Default 5000. Pass false to disable. */
  defaultAutoCloseMs?: number | false;
  /** Pause auto-close while hovering a toast. Default true. Overridable per notify(). */
  pauseOnHover?: boolean;
}

export type { NotificationToastComponentProps };

const DEFAULT_AUTO_CLOSE_MS = 5000;
const DISMISS_CHECK_MS = 400;

function isToastActive(toastId: string, containerId: string): boolean {
  return toast.isActive(toastId, containerId);
}

function getToastElement(toastId: string): HTMLElement | null {
  return document.getElementById(toastId);
}

function removeToastDom(toastId: string): void {
  getToastElement(toastId)?.remove();
}

function clearStaleToast(toastId: string, containerId: string): void {
  const el = getToastElement(toastId);
  const active = isToastActive(toastId, containerId);

  if (el && !active) {
    removeToastDom(toastId);
    return;
  }

  if (active && !el) {
    toast.dismiss({ id: toastId, containerId });
  }
}

/** Retry dismiss and remove any ghost DOM left after react-toastify marks a toast inactive. */
function scheduleDismissCleanup(containerId: string, toastId: string): void {
  window.setTimeout(() => {
    if (isToastActive(toastId, containerId)) {
      toast.dismiss({ id: toastId, containerId });
    }

    window.setTimeout(() => {
      const elAfter = getToastElement(toastId);
      if (elAfter && !isToastActive(toastId, containerId)) {
        removeToastDom(toastId);
      }
    }, DISMISS_CHECK_MS);
  }, DISMISS_CHECK_MS);
}

function dismissToast(
  containerId: string,
  toastId: string,
  reason: string,
  closeToast?: ToastContentProps['closeToast']
): void {
  const el = getToastElement(toastId);
  const activeBefore = isToastActive(toastId, containerId);

  // Ghost toast — inactive in react-toastify but still visible
  if (el && !activeBefore) {
    removeToastDom(toastId);
    return;
  }

  // autoClose + force-retry: use toast.dismiss directly (closeToast stalls on batch close)
  const useDirectDismiss = reason === 'autoClose-timer' || reason === 'close-button-force';

  if (useDirectDismiss || typeof closeToast !== 'function') {
    toast.dismiss({ id: toastId, containerId });
  } else {
    closeToast();
  }

  scheduleDismissCleanup(containerId, toastId);
}

// Portaled to document.body — built-in autoClose/pauseOnHover disabled; we handle both ourselves.
const ToastContainerPortal = memo(function ToastContainerPortal({
  containerId,
}: {
  containerId: string;
}) {
  return createPortal(
    <ToastContainer
      containerId={containerId}
      className={`${STACK_CONTAINER_CLASS} ${STACK_CONTAINER_CLASS}--${containerId}`}
      position="top-right"
      stacked
      autoClose={false}
      limit={5}
      hideProgressBar
      closeOnClick={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      transition={Slide}
      style={{ zIndex: 100000, top: '16px', right: '16px' }}
    />,
    document.body
  );
});

const NotificationToast = forwardRef<NotificationToastHandler, NotificationToastComponentProps>(
  function (
    { id = 'notify-1', defaultAutoCloseMs, pauseOnHover: pauseOnHoverDefault = true },
    ref
  ): JSX.Element | null {
    const containerId = id;
    const resolvedDefaultAutoCloseMs = defaultAutoCloseMs ?? DEFAULT_AUTO_CLOSE_MS;

    const notify = useCallback(
      ({
        heading,
        imageLogo,
        siteName,
        subHeading,
        type,
        subType,
        onClick,
        closeOnClick = true,
        messageId,
        autoCloseMs,
        pauseOnHover,
      }: NotificationProps): undefined => {
        const toastId = messageId ?? `${containerId}-${Date.now()}`;
        const autoClose =
          autoCloseMs === false ? false : (autoCloseMs ?? resolvedDefaultAutoCloseMs);
        const pauseHover = pauseOnHover ?? pauseOnHoverDefault;

        clearStaleToast(toastId, containerId);

        if (messageId && isToastActive(toastId, containerId) && getToastElement(toastId)) {
          return;
        }

        toast(
          ({ closeToast }) => (
            <NotificationBanner
              type={type}
              imageLogo={imageLogo}
              heading={heading}
              subHeading={subHeading}
              siteName={siteName}
              subType={subType}
              onClick={onClick}
              closeOnClick={closeOnClick}
              toastId={toastId}
              containerId={containerId}
              autoCloseMs={autoClose}
              pauseOnHover={pauseHover}
              closeToast={closeToast}
              onDismiss={(source) => {
                dismissToast(containerId, toastId, source, closeToast);
              }}
            />
          ),
          {
            toastId,
            className: 'custom-notification-banner',
            closeButton: false,
            draggable: false,
            autoClose: false,
            hideProgressBar: true,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            containerId,
          }
        );
      },
      [containerId, pauseOnHoverDefault, resolvedDefaultAutoCloseMs]
    );

    useImperativeHandle(ref, () => ({ notify }), [notify]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    // Pause all toast timers while the pointer is anywhere over the expanded/collapsed stack.
    useEffect(() => {
      if (!mounted) return;
      return bindStackHoverContainer(containerId, pauseOnHoverDefault);
    }, [containerId, mounted, pauseOnHoverDefault]);

    if (!mounted) {
      return null;
    }

    return <ToastContainerPortal containerId={containerId} />;
  }
);

NotificationToast.displayName = 'NotificationToast';

export default memo(NotificationToast);
