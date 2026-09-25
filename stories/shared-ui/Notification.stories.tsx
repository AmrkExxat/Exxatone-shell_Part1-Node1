/* eslint-disable react/display-name */
import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeDecorator } from '../ThemeDecorator';
import {
  Button,
  NotificationDrawer,
  NotificationDrawerFunctions,
  NotificationDrawerStateType,
  NotificationItemType,
  PaginationFilters,
} from '../../libs/ui';

import { PTLOGO, IYLOGO } from '../../assets';

const meta = {
  title: 'Shared UI/Notification',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

const messages: NotificationItemType[] = [
  {
    id: 0,
    type: 'MESSAGE',
    title:
      'Arcadia University Michael Scott messaged you on Tuscaloosa - Legacy Park PT-H1 2025 internship',
    sendBy: '<<Sender Name>>',
    date: new Date('2025-06-30T07:53:00Z'),
    description:
      'Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025.',
    isRead: false,
    primaryImage: <PTLOGO width={56} height={56} />,
  },
  ...Array(5)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      type: 'MESSAGE',
      title:
        'Arcadia University Michael Scott messaged you on Tuscaloosa - Legacy Park PT-H1 2025 internship',
      sendBy: '<<Sender Name>>',
      date: new Date(`2025-06-${index + 19}T10:00:00Z`),
      description:
        'Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025. Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025.',
      isRead: false,
      primaryImage: <PTLOGO width={56} height={56} />,
    })),
  ...Array(5)
    .fill(0)
    .map((_, index) => ({
      id: index + 6,
      type: 'MESSAGE',
      title:
        'Arcadia University Michael Scott messaged you on Tuscaloosa - Legacy Park PT-H1 2025 internship',
      sendBy: '<<Sender Name>>',
      date: new Date(`2025-06-${index + 19}T11:00:00Z`),
      description:
        'Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025.',
      isRead: true,
      primaryImage: <PTLOGO width={56} height={56} />,
    })),
];

const updates = [
  {
    id: 0,
    type: 'UPDATE',
    title:
      'Arcadia University Michael Scott message you on Tuscaloosa - Legacy Park PT-H1 2025 internship',
    sendBy: '<<Sender Name>>',
    date: new Date('2025-06-01T09:00:00Z'),
    description:
      'Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025.',
    isRead: false,
    primaryImage: <IYLOGO width={46} height={46} className="relative" />,
  },
  ...Array(5)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      type: 'UPDATE',
      title:
        'Arcadia University Michael Scott message you on Tuscaloosa - Legacy Park PT-H1 2025 internship',
      sendBy: '<<Sender Name>>',
      date: new Date(`2025-06-0${index + 2}T10:00:00Z`),
      description:
        'Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025. Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025',
      isRead: false,
      primaryImage: <IYLOGO width={46} height={46} className="relative" />,
    })),
  ...Array(5)
    .fill(0)
    .map((_, index) => ({
      id: index + 6,
      type: 'UPDATE',
      title:
        'Arcadia University Michael Scott message you on Tuscaloosa - Legacy Park PT-H1 2025 internship',
      sendBy: '<<Sender Name>>',
      date: new Date(`2025-06-${index + 7}T11:00:00Z`),
      description:
        'Hello, We are confirming our availability to accommodate your request for May 11, 2025 to July 10, 2025.',
      isRead: true,
      primaryImage: <IYLOGO width={46} height={46} className="relative" />,
    })),
];

export const Notification: Story = {
  render: () => {
    const drawerRef = useRef<NotificationDrawerFunctions>();
    const [toggleAllRead, setToggleAllRead] = useState<boolean>(false);

    const initialDrawerData: NotificationDrawerStateType = {
      open: true,
      loading: true,
    };

    const onOpenDrawer = () => {
      drawerRef.current?.handleDrawer(initialDrawerData);
    };

    const onMarkAllRead = (data?: any) => {
      const drawerData: NotificationDrawerStateType = {
        open: true,
        loading: false,
        toggleAllRead: !toggleAllRead,
      };
      drawerRef.current?.handleDrawer(drawerData);
      setToggleAllRead(!toggleAllRead);
    };

    const onSettingClick = (data?: any) => {
      console.log('setting');
    };

    const onMessageClick = (data?: any) => {
      console.log(data);
    };

    const onMessageMarkAsReadClick = (data?: any) => {
      console.log(data);
    };

    const fetchPaginatedData = async (
      page: number,
      filter: PaginationFilters,
      pageSize: number
    ): Promise<{ totalCount: number; data: NotificationItemType[] }> => {
      const skip = (page - 1) * pageSize;
      const unRead = (unReadOnly: boolean, arr: NotificationItemType[]) => {
        if (unReadOnly) arr = arr.filter((x) => !x.isRead);
        return arr;
      };
      return new Promise((resolve) => {
        setTimeout(() => {
          const paginatedUpdates = unRead(filter.unRead, updates).slice(skip, skip + pageSize);
          const paginatedMessages = unRead(filter.unRead, messages).slice(skip, skip + pageSize);
          if (filter?.type?.toLowerCase() === 'message')
            resolve({
              totalCount: unRead(filter.unRead, messages).length,
              data: paginatedMessages,
            });
          else if (filter?.type?.toLowerCase() === 'update')
            resolve({ totalCount: unRead(filter.unRead, updates).length, data: paginatedUpdates });
          else
            resolve({
              totalCount:
                unRead(filter.unRead, messages)?.length + unRead(filter.unRead, updates)?.length,
              data: [...unRead(filter.unRead, updates), ...unRead(filter.unRead, messages)].slice(
                skip,
                skip + pageSize
              ),
            });
        }, 1000);
      });
    };

    return (
      <>
        <div className="flex flex-row items-center justify-center">
          <Button
            variant="stroked"
            color="primary"
            id="open-drawer-btn"
            testid="open-drawer-btn"
            onClick={onOpenDrawer}
          >
            Open Notification Drawer
          </Button>
        </div>
        <NotificationDrawer
          ref={drawerRef}
          pageSize={7}
          onMarkAllRead={onMarkAllRead}
          onSettingClick={onSettingClick}
          showSettingsIcon={true}
          onMessageClick={onMessageClick}
          onMessageMarkAsReadClick={onMessageMarkAsReadClick}
          fetchPaginatedData={async (page: number, filter: PaginationFilters, pageSize: number) =>
            fetchPaginatedData(page, filter, pageSize)
          }
        />
      </>
    );
  },
};
