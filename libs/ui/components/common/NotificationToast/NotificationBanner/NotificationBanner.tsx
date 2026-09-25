import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type NotificationProps } from '../notification.type';

import {
  faCheckDouble,
  faCircleX,
  faGraduationCap,
  faSync,
  faUserMinus,
  faUserPlus,
  faUserTag,
  faXmark,
} from '@fortawesome/pro-light-svg-icons';
import { faMailboxFlagUp, faMessages } from '@fortawesome/pro-duotone-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ToastContentProps } from 'react-toastify';
import { registerAutoClose } from '../autoCloseCoordinator';

export interface NotificationBannerProps extends NotificationProps {
  containerId?: string;
  toastId?: string;
  autoCloseMs?: number | false;
  closeToast?: ToastContentProps['closeToast'];
  onDismiss?: (source: string) => void;
}

export default function NotificationBanner({
  type,
  closeToast,
  onDismiss,
  containerId = 'notify-1',
  toastId,
  autoCloseMs = 5000,
  pauseOnHover = true,
  heading,
  subHeading,
  imageLogo,
  siteName,
  subType,
  isRead,
  isReadReceptEnabled,
  onMarkToggle = () => {},
  onClick = () => {},
  index = 0,
  closeOnClick = false,
}: NotificationBannerProps) {
  const isClosingRef = useRef(false);
  const onDismissRef = useRef(onDismiss);
  const closeToastRef = useRef(closeToast);
  const autoCloseTimerRef = useRef<number | null>(null);
  const remainingMsRef = useRef(typeof autoCloseMs === 'number' ? autoCloseMs : 0);
  const deadlineRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const [progressPaused, setProgressPaused] = useState(false);
  onDismissRef.current = onDismiss;
  closeToastRef.current = closeToast;

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(
    (source: string) => {
      if (isClosingRef.current && source !== 'close-button') {
        return;
      }
      // closeToast can stall when multiple toasts dismiss in a batch — force a direct dismiss retry
      if (source === 'close-button' && isClosingRef.current) {
        onDismissRef.current?.('close-button-force');
        return;
      }
      isClosingRef.current = true;
      clearAutoCloseTimer();
      if (onDismissRef.current) {
        onDismissRef.current(source);
      } else if (typeof closeToastRef.current === 'function') {
        closeToastRef.current();
      }
    },
    [clearAutoCloseTimer, toastId]
  );

  const armAutoCloseTimer = useCallback(
    (delayMs: number) => {
      if (autoCloseMs === false || isClosingRef.current) return;
      clearAutoCloseTimer();
      remainingMsRef.current = delayMs;
      deadlineRef.current = Date.now() + delayMs;
      autoCloseTimerRef.current = window.setTimeout(() => {
        handleClose('autoClose-timer');
      }, delayMs);
    },
    [autoCloseMs, clearAutoCloseTimer, handleClose]
  );

  const pauseAutoClose = useCallback(() => {
    if (!pauseOnHover || autoCloseMs === false || isPausedRef.current || isClosingRef.current)
      return;
    isPausedRef.current = true;
    setProgressPaused(true);
    if (deadlineRef.current !== null) {
      remainingMsRef.current = Math.max(0, deadlineRef.current - Date.now());
    }
    clearAutoCloseTimer();
  }, [autoCloseMs, clearAutoCloseTimer, pauseOnHover]);

  const resumeAutoClose = useCallback(() => {
    if (!pauseOnHover || autoCloseMs === false || !isPausedRef.current || isClosingRef.current)
      return;
    isPausedRef.current = false;
    setProgressPaused(false);
    armAutoCloseTimer(remainingMsRef.current);
  }, [armAutoCloseTimer, autoCloseMs, pauseOnHover]);

  // Custom auto-close timer + progress bar (react-toastify built-in disabled on container)
  useEffect(() => {
    if (autoCloseMs === false) return;
    isPausedRef.current = false;
    setProgressPaused(false);
    armAutoCloseTimer(autoCloseMs);
    return clearAutoCloseTimer;
  }, [armAutoCloseTimer, autoCloseMs, clearAutoCloseTimer, toastId]);

  // Register pause/resume with the stack container hover coordinator
  useEffect(() => {
    if (!pauseOnHover || autoCloseMs === false || !toastId) return;
    return registerAutoClose(containerId, toastId, {
      pause: pauseAutoClose,
      resume: resumeAutoClose,
    });
  }, [autoCloseMs, containerId, pauseAutoClose, pauseOnHover, resumeAutoClose, toastId]);

  const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick(index);
    if (closeOnClick) {
      e.stopPropagation();
      handleClose('banner-click');
    }
  };

  return (
    <div className="notification-banner-shell relative h-full min-h-[140px] w-full">
      <div
        className="bg-card relative flex h-full flex-col overflow-hidden rounded-[13px] pt-3"
        style={{ outlineOffset: '-5px', paddingBottom: autoCloseMs !== false ? '5px' : undefined }}
        onClick={handleBannerClick}
      >
        {/* Close button — absolutely positioned top-right */}
        {isReadReceptEnabled === undefined && (
          <button
            type="button"
            aria-label="Close notification"
            className="absolute top-2 right-2 z-20 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose('close-button');
            }}
          >
            <FontAwesomeIcon icon={faCircleX as any} width="24px" aria-hidden="true" />
          </button>
        )}

        <div className="relative flex flex-1 flex-col">
          {/* Header row */}
          <div className="flex w-full items-center pr-10 pl-4">
            {type === 'Message' && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMessages as any} className="message-icon" />
                <div className="text-[10px] font-thin">MESSAGE</div>
              </div>
            )}
            {type === 'Update' && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMailboxFlagUp as any} className="update-icon" />
                <div className="text-[10px] font-thin">UPDATE</div>
              </div>
            )}
            {isRead !== undefined && isReadReceptEnabled !== undefined && (
              <div className="ml-auto">
                <button
                  className="focus:ring-primary rounded text-[12px] text-blue-500 hover:underline focus:ring"
                  onClick={(e) => {
                    onMarkToggle(!isRead);
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                  }}
                  aria-label={`${!isRead ? 'Mark as read' : 'Mark as unread'} ${heading}`}
                >
                  {!isRead ? 'Mark as read' : 'Mark as unread'}
                </button>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="mt-2 box-border grid min-h-[56px] w-full grid-cols-8 pl-3">
            <div className="col-span-2">
              <div className="flex h-full items-center justify-center">
                {imageLogo === null && (
                  <svg
                    aria-hidden="true"
                    className="fill-primary-600 h-8 w-8 animate-spin text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                )}
                {imageLogo != null && subType === undefined && (
                  <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-1 border-gray-200">
                    <img
                      className="h-auto w-full object-scale-down pt-1"
                      src={`data:image/png;base64,${imageLogo}`}
                      alt={siteName || 'Site Logo'}
                    />
                  </div>
                )}
                {imageLogo != null && subType !== undefined && (
                  <div className="relative flex items-center justify-center">
                    {/* schedule canceled */}
                    {subType === 'Schedule Canceled' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-700">
                        <FontAwesomeIcon icon={faUserTag} className="text-white" />
                      </div>
                    )}
                    {/* Student assigned */}
                    {subType === 'Student Assigned' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                        <FontAwesomeIcon icon={faUserPlus} className="text-white" />
                      </div>
                    )}
                    {/* schedule updated */}
                    {subType === 'Schedule Updated' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-orange-400">
                        <FontAwesomeIcon icon={faSync} className="text-white" />
                      </div>
                    )}
                    {/* student assigned deleted */}
                    {subType === 'Student Removed' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-700">
                        <FontAwesomeIcon icon={faUserMinus} className="text-white" />
                      </div>
                    )}
                    {/* request changed */}
                    {subType === 'Request Updated' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-orange-400">
                        <FontAwesomeIcon icon={faGraduationCap} className="text-white" />
                      </div>
                    )}
                    {/* slot approved */}
                    {subType === 'Slot Approved' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-green-600">
                        <FontAwesomeIcon icon={faCheckDouble} className="text-white" />
                      </div>
                    )}
                    {/* slot declined */}
                    {subType === 'Slot Declined' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-red-700">
                        <FontAwesomeIcon icon={faXmark} className="text-white" />
                      </div>
                    )}
                    {/* slot requested */}
                    {subType === 'Slot Requested' && (
                      <div className="absolute top-[-7px] right-[-20px] z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                        <FontAwesomeIcon icon={faUserTag} className="text-white" />
                      </div>
                    )}
                    <div className="relative bottom-[-10px] left-[1px] z-20 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-1 border-gray-200 shadow-sm">
                      <img
                        className="h-full w-full object-scale-down pt-1"
                        src={`data:image/png;base64,${imageLogo}`}
                        alt={siteName || 'Site Logo'}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-6 ml-3 flex-row">
              <div className="box-border flex justify-between" role="heading" aria-level={3}>
                <div
                  className="focus-visible:outline-primary text-base font-bold text-[#262626] focus-visible:outline focus-visible:outline-2"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onClick(index);
                      if (closeOnClick) handleClose('keyboard-enter');
                    }
                  }}
                  role="link"
                >
                  {heading}
                </div>
                <div>
                  {isRead !== undefined && isReadReceptEnabled === true && !isRead && (
                    <span className="inline-block h-[8px] w-[8px] rounded-full bg-blue-500"></span>
                  )}
                </div>
              </div>
              <div className="subheading-ellipsis text-sm font-light">{subHeading}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-close progress bar — pinned to shell bottom via CSS */}
      {autoCloseMs !== false && (
        <div className="notification-toast-progress" aria-hidden="true">
          <div
            className="notification-toast-progress-bar"
            style={{
              animationDuration: `${autoCloseMs}ms`,
              animationPlayState: progressPaused ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </div>
  );
}
