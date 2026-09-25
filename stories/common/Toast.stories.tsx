import type { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { Button, ToastList, type ToastPositionType, type ToastProps } from '../../libs/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-light-svg-icons';
import { ThemeDecorator } from '../ThemeDecorator';

const successMsgs = ['Success! Task completed.'];

const failureMsgs = ['Error! Something went wrong.'];

const warningMsgs = ['Warning! Proceed with caution.'];

const infoMsgs = ['Info! Proceed with caution.'];

const randomMsg = (msgs: string[]) => msgs[Math.floor(Math.random() * msgs.length)];

const meta = {
  title: 'Common/Toast',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const Success: Story = {
  render: () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPositionType>('top-right');

    const showToast = (message: string, type: 'success', position: ToastPositionType) => {
      setPosition(position);
      const toast: ToastProps = {
        id: Date.now()?.toString(),
        message,
        type,
        duration: 3,
      };
      setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const onClose = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const onClick = (id: string) => {
      console.log(`Clicked Toast: ${id}`);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-4">
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(successMsgs), 'success', 'top-right')}
          >
            Top-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(successMsgs), 'success', 'top-left')}
          >
            Top-Left
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(successMsgs), 'success', 'bottom-right')}
          >
            Bottom-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(successMsgs), 'success', 'bottom-left')}
          >
            Bottom-Left
          </Button>
        </div>
        <ToastList data={toasts} position={position} onClose={onClose} onClick={onClick} />
      </div>
    );
  },
};

export const Error: Story = {
  render: () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPositionType>('top-right');

    const showToast = (message: string, type: 'error', position: ToastPositionType) => {
      setPosition(position);
      const toast: ToastProps = {
        id: Date.now()?.toString(),
        message,
        type,
        duration: 3,
      };
      setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const onClose = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const onClick = (id: string) => {
      console.log(`Clicked Toast: ${id}`);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-4">
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(failureMsgs), 'error', 'top-right')}
          >
            Top-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(failureMsgs), 'error', 'top-left')}
          >
            Top-Left
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(failureMsgs), 'error', 'bottom-right')}
          >
            Bottom-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(failureMsgs), 'error', 'bottom-left')}
          >
            Bottom-Left
          </Button>
        </div>
        <ToastList data={toasts} position={position} onClose={onClose} onClick={onClick} />
      </div>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPositionType>('top-right');

    const showToast = (message: string, type: 'warning', position: ToastPositionType) => {
      setPosition(position);
      const toast: ToastProps = {
        id: Date.now()?.toString(),
        message,
        type,
        duration: 3,
      };
      setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const onClose = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const onClick = (id: string) => {
      console.log(`Clicked Toast: ${id}`);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-4">
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(warningMsgs), 'warning', 'top-right')}
          >
            Top-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(warningMsgs), 'warning', 'top-left')}
          >
            Top-Left
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(warningMsgs), 'warning', 'bottom-right')}
          >
            Bottom-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(warningMsgs), 'warning', 'bottom-left')}
          >
            Bottom-Left
          </Button>
        </div>
        <ToastList data={toasts} position={position} onClose={onClose} onClick={onClick} />
      </div>
    );
  },
};

export const Info: Story = {
  render: () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPositionType>('top-right');

    const showToast = (message: string, type: 'info', position: ToastPositionType) => {
      setPosition(position);
      const toast: ToastProps = {
        id: Date.now()?.toString(),
        message,
        type,
        duration: 3,
      };
      setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const onClose = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const onClick = (id: string) => {
      console.log(`Clicked Toast: ${id}`);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-4">
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(infoMsgs), 'info', 'top-right')}
          >
            Top-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(infoMsgs), 'info', 'top-left')}
          >
            Top-Left
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(infoMsgs), 'info', 'bottom-right')}
          >
            Bottom-Right
          </Button>
          <Button
            variant="stroked"
            onClick={() => showToast(randomMsg(infoMsgs), 'info', 'bottom-left')}
          >
            Bottom-Left
          </Button>
        </div>
        <ToastList data={toasts} position={position} onClose={onClose} onClick={onClick} />
      </div>
    );
  },
};

export const CustomToast: Story = {
  render: () => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);
    const [position, setPosition] = useState<ToastPositionType>('top-right');

    const showCustomToast = (
      message: string,
      type: 'info' | 'success' | 'warning' | 'error' | 'custom',
      position: ToastPositionType
    ) => {
      setPosition(position);
      const toast: ToastProps = {
        id: Date.now()?.toString(),
        message,
        type,
        duration: 3,
        customIcon: <FontAwesomeIcon icon={faBell} className="text-blue-500" />,
        className: 'bg-blue-400 text-primary',
        autoClose: true,
      };
      setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const onClose = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const onClick = (id: string) => {
      console.log(`Clicked Toast: ${id}`);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row gap-4">
          <Button
            variant="stroked"
            onClick={() =>
              showCustomToast(
                'This is a custom toast message with a custom icon.',
                'custom',
                'top-right'
              )
            }
          >
            Show Custom Toast
          </Button>
        </div>
        <ToastList data={toasts} position={position} onClose={onClose} onClick={onClick} />
      </div>
    );
  },
};
