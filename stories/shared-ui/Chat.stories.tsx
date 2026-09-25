/* eslint-disable react/display-name */
import React, { ReactNode, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { PTLOGO, IYLOGO } from '../../assets';

import { CHATITEMS } from '../../seeds';

import { ThemeDecorator } from '../ThemeDecorator';
import {
  Button,
  MinifiedChat as MinifiedChatComponent,
  TabbedChat as TabbedChatComponent,
  Chat as ChatComponent,
  ChatItemType,
  Drawer,
} from '../../libs/ui';

const meta = {
  title: 'Shared UI/Chat',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

interface DrawerFunctions {
  handleDrawer: (drawerStateData?: any) => void;
}

const initialState = {
  open: false,
};

const drawerData = {
  open: true,
};

const ChatDrawer = React.forwardRef((_props, ref: any) => {
  const [chatItems, setChatItems] = useState<ChatItemType[]>(CHATITEMS);

  const [state, setState] = useState<any>(initialState);

  const handleOnSend = (data: any) => {
    setChatItems((prevChatItems) => [
      ...prevChatItems,
      {
        message: data?.message,
        sentBy: '2 Month',
        participant: {
          isCurrentUser: true,
          firstName: 'Harvey',
          lastName: 'Specter',
          avatar: <PTLOGO />,
        },
      },
      {
        message: 'Reply from',
        sentBy: '2 Month',
        participant: {
          isCurrentUser: false,
          firstName: 'Mike',
          lastName: 'Ross',
          avatar: <IYLOGO />,
        },
      },
    ]);
  };

  const handleDrawer = (drawerStateData: any) => {
    setState(drawerStateData);
  };

  React.useImperativeHandle(ref, (): DrawerFunctions => {
    return {
      handleDrawer,
    };
  });

  const DrawerTitle = (): ReactNode => {
    return (
      <div className="flex flex-row justify-center gap-2">
        <PTLOGO height={40} width={40} />

        <div className="flex flex-col items-start justify-start gap-1">
          <span className="line-clamp-1 text-sm font-semibold">
            University of St Augustine for Health Sciences-Dallas, Texas-DPT
          </span>
          <span className="text-secondary text-xs">Alexandria, VA - 2025</span>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      drawerOpen={state.open}
      size="small"
      drawer={{
        title: <DrawerTitle />,
        onClose: () => handleDrawer(initialState),
      }}
    >
      <div className="flex flex-col">
        <ChatComponent
          handleOnSend={handleOnSend}
          chatItems={chatItems}
          containerHeight="h-[calc(100vh_-_145px)]"
        />
      </div>
    </Drawer>
  );
});

export const Chat: Story = {
  render: () => {
    const drawerRef = useRef<DrawerFunctions>();

    const onOpenDrawer = () => {
      drawerRef.current?.handleDrawer(drawerData);
    };

    return (
      <>
        <div className="flex flex-row items-center justify-center">
          <Button
            variant="stroked"
            color="primary"
            id="drawerBtn"
            testid="drawerBtn"
            onClick={onOpenDrawer}
          >
            Open Drawer
          </Button>
        </div>
        <ChatDrawer ref={drawerRef} />
      </>
    );
  },
};

export const Minified: Story = {
  render: () => {
    const [chatItems, setChatItems] = useState<ChatItemType[]>(CHATITEMS);

    const drawerRef = useRef<DrawerFunctions>();

    const handleOnSend = (data: any) => {
      setChatItems((prevChatItems) => [
        ...prevChatItems,
        {
          message: data?.message,
          sentBy: '2 Month',
          participant: {
            isCurrentUser: true,
            firstName: 'Harvey',
            lastName: 'Specter',
            avatar: <PTLOGO />,
          },
        },
        {
          message: 'Reply from',
          sentBy: '2 Month',
          participant: {
            isCurrentUser: false,
            firstName: 'Mike',
            lastName: 'Ross',
            avatar: <IYLOGO />,
          },
        },
      ]);
    };

    const onShowMoreClick = () => {
      drawerRef.current?.handleDrawer(drawerData);
    };

    return (
      <div className="flex flex-col">
        <MinifiedChatComponent
          chatItems={chatItems}
          handleOnSend={handleOnSend}
          onShowMoreClick={onShowMoreClick}
        />
        <ChatDrawer ref={drawerRef} />
      </div>
    );
  },
};

export const Tabbed: Story = {
  render: () => {
    const drawerRef = useRef<DrawerFunctions>();

    const onOpenDrawer = () => {
      drawerRef.current?.handleDrawer(drawerData);
    };

    const ChatDrawer = React.forwardRef((_props, ref: any) => {
      const [chatItems, setChatItems] = useState<ChatItemType[]>(CHATITEMS);

      const [state, setState] = useState<any>(initialState);

      const handleOnSend = (data: any) => {
        setChatItems((prevChatItems) => [
          ...prevChatItems,
          {
            message: data?.message,
            sentBy: '2 Month',
            participant: {
              isCurrentUser: true,
              firstName: 'Harvey',
              lastName: 'Specter',
              avatar: <PTLOGO />,
            },
          },
          {
            message: 'Reply from',
            sentBy: '2 Month',
            participant: {
              isCurrentUser: false,
              firstName: 'Mike',
              lastName: 'Ross',
              avatar: <IYLOGO />,
            },
          },
        ]);
      };

      const handleDrawer = (drawerStateData: any) => {
        setState(drawerStateData);
      };

      React.useImperativeHandle(ref, (): DrawerFunctions => {
        return {
          handleDrawer,
        };
      });

      const DrawerTitle = (): ReactNode => {
        return (
          <div className="flex flex-row justify-center gap-2">
            <PTLOGO height={40} width={40} />

            <div className="flex flex-col items-start justify-start gap-1">
              <span className="line-clamp-1 text-sm font-semibold">
                University of St Augustine for Health Sciences-Dallas, Texas-DPT
              </span>
              <span className="text-secondary text-xs">Alexandria, VA - 2025</span>
            </div>
          </div>
        );
      };

      return (
        <Drawer
          drawerOpen={state.open}
          size="small"
          drawer={{
            title: <DrawerTitle />,
            onClose: () => handleDrawer(initialState),
          }}
        >
          <div className="flex flex-col">
            <TabbedChatComponent
              handleOnSend={handleOnSend}
              containerHeight="h-[calc(100vh_-_190px)]"
              tabs={[
                {
                  id: 'site',
                  title: 'Site',
                  chatItems: chatItems,
                },
                {
                  id: 'school',
                  title: 'School',
                  chatItems: chatItems,
                },
                {
                  id: 'student',
                  title: 'Student',
                  chatItems: chatItems,
                },
              ]}
            />
          </div>
        </Drawer>
      );
    });

    return (
      <>
        <div className="flex flex-row items-center justify-center">
          <Button
            variant="stroked"
            color="primary"
            id="drawerBtn"
            testid="drawerBtn"
            onClick={onOpenDrawer}
          >
            Open Drawer
          </Button>
        </div>
        <ChatDrawer ref={drawerRef} />
      </>
    );
  },
};
