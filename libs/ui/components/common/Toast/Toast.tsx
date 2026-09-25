import classNames from 'classnames';
import React, { useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCircleExclamation,
  faHexagonExclamation,
  faTriangleExclamation,
  faXmarkCircle,
} from '@fortawesome/pro-solid-svg-icons';
import { ToastProps } from './types';

const iconMap: any = {
  success: <FontAwesomeIcon icon={faCheckCircle} className="text-[#3DA709]" />,
  error: <FontAwesomeIcon icon={faHexagonExclamation} className="text-[#ED4647]" />,
  warning: <FontAwesomeIcon icon={faTriangleExclamation} className="text-[#FFC107]" />,
  info: <FontAwesomeIcon icon={faCircleExclamation} className="text-[#7789ED]" />,
};

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  onClick,
  showIcon = true,
  showClose = true,
  autoClose = true,
  duration = 2,
  customIcon,
  ...props
}) => {
  const toastIcon = useMemo(() => customIcon || (type ? iconMap[type] : null), [type]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === closeButtonRef.current) {
      onClose && onClose();
    }
  };

  return (
    <div
      id={props.id}
      className={classNames(
        `toast bg-card relative cursor-pointer rounded-md p-4 shadow-lg ${type !== 'custom' ? `toast_${type}` : ''}`,
        props.className
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onClick={(e) => {
        e.preventDefault();
        onClick && onClick(props.id);
      }}
    >
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-row items-center justify-start gap-3">
          {showIcon && toastIcon}
          <span>{message}</span>
        </div>
        {showClose && (
          <div className="flex items-start justify-end">
            <button
              ref={closeButtonRef}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose && onClose();
              }}
              onKeyDown={handleKeyDown}
              className="hover:bg-hover cursor-pointer rounded-full p-1 text-xs"
              aria-label={`close ${type} notification.`}
            >
              <FontAwesomeIcon icon={faXmarkCircle} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
