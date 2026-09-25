/* eslint-disable react/display-name */
import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeDecorator } from '../ThemeDecorator';
import { Button, Drawer } from '../../libs/ui';
const meta = {
  title: 'Layout/Drawer',
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

export const SmallSized: Story = {
  render: () => {
    const drawerRef = useRef<DrawerFunctions>();

    const initialState = {
      open: false,
      name: '',
      position: '',
    };

    const drawerData = {
      open: true,
      name: 'Harvey',
      position: 'MD',
    };

    const onOpenDrawer = () => {
      drawerRef.current?.handleDrawer(drawerData);
    };

    const SmallSizedDrawer = React.forwardRef((_props, ref: any) => {
      const [state, setState] = useState<any>(initialState);

      const handleDrawer = (drawerStateData: any) => {
        setState(drawerStateData);
      };

      React.useImperativeHandle(ref, (): DrawerFunctions => {
        return {
          handleDrawer,
        };
      });

      return (
        <Drawer
          drawerOpen={state.open}
          size="small"
          drawer={{
            title: 'Small Sized Drawer',
            onClose: () => handleDrawer(initialState),
          }}
          actionButtons={
            <div className="flex flex-row gap-2">
              <Button color="warn" variant="stroked">
                Delete
              </Button>
              <Button>Save</Button>
            </div>
          }
        >
          <div className="flex flex-col">
            <div className="mx-4 my-3 mb-4 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col items-start justify-center">
                  <span className="text-sm font-semibold">Name</span>
                  <span className="text-sm font-semibold">{state?.name}</span>
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span>Position</span>
                  <span className="text-sm font-semibold">{state?.position}</span>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      );
    });

    return (
      <>
        <div className="flex flex-row items-center justify-center">
          <Button color="primary" onClick={onOpenDrawer}>
            Open Drawer
          </Button>
        </div>
        <SmallSizedDrawer ref={drawerRef} />
      </>
    );
  },
};
