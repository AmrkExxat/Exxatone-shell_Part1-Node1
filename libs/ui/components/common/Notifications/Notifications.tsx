import React, { ReactNode, useState } from 'react';
import { ToastList } from '../Toast';

interface NotificationProps {
  show: boolean;
  message: string;
  description?: string;
  colorCode?: string;
  customIcon?: ReactNode;
  className?: string;
}

const initialState = {
  id: null,
  message: '',
  type: 'success',
};
export interface NotificationFunction {
  handleNotification: (data: NotificationProps) => void;
}

const Notifications = React.forwardRef((props: {}, ref: any) => {
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastData, setToastData] = useState<any>(initialState);

  const handleNotification = (data: NotificationProps) => {
    setToastData(() => {
      return {
        id: `toast_${data.colorCode ?? 'success'}`,
        message: data.message,
        type: data.colorCode ?? 'success',
        ...(data?.customIcon && { customIcon: data.customIcon }),
        ...(data?.className && { className: data.className }),
      };
    });
    setIsShowToast(data.show);
    setTimeout(() => {
      setToastData(initialState);
      setIsShowToast(false);
    }, 2000);
  };

  React.useImperativeHandle(ref, (): NotificationFunction => {
    return {
      handleNotification,
    };
  });

  const onClose = () => {
    //
  };

  const onClick = () => {
    //
  };

  return (
    <>
      {isShowToast && (
        <ToastList
          data={[toastData]}
          position="top-right"
          onClose={onClose}
          onClick={onClick}
          classWrapper={props?.classWrapper ?? ''}
        />
      )}
    </>
  );
});
export default Notifications;
