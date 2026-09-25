import React, { useEffect, useRef, useState } from 'react';

import Toast from './Toast';
import { ToastListProps, ToastProps } from './types';

const ToastList: React.FC<ToastListProps> = ({
  data,
  position,
  onClose,
  onClick,
  classWrapper = '',
}) => {
  const [toastData, setToastData] = useState<ToastProps[]>(data);

  const listRef = useRef<HTMLDivElement>(null);

  const handleScrolling = (el: HTMLDivElement | null) => {
    if (!el) return;
    const isTopPosition = position.includes('top');
    el.scrollTo({
      top: isTopPosition ? el.scrollHeight : 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleScrolling(listRef.current);
    const sortedData = position.includes('bottom') ? [...data].reverse() : [...data];
    setToastData(sortedData);
  }, [position, data]);

  const onToastClose = (id: any) => {
    setToastData((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    onClose(id);
  };

  return (
    <>
      {toastData.length > 0 && (
        <div
          className={`toast-list toast-list--${position} ${classWrapper}`}
          aria-live="assertive"
          ref={listRef}
        >
          {toastData.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              autoClose={toast?.autoClose}
              duration={toast?.duration}
              message={toast.message}
              className={toast?.className}
              type={toast.type}
              customIcon={toast?.customIcon}
              onClose={() => onToastClose(toast.id)}
              onClick={() => onClick(toast.id)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ToastList;
