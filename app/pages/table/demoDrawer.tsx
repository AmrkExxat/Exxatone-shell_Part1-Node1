import React, { useState } from 'react';
import { Drawer, Tabs, ToggleSwitch } from '../../../libs/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCheck,
  faGear,
  faMailboxFlagUp,
  faMessages,
  faUserTag,
} from '@fortawesome/pro-light-svg-icons';
import { IYLOGO, PTLOGO } from '../../../assets';

type DrawerFunctions = {
  handleDrawer: (drawerStateData?: any) => void;
};

const initialState = {
  open: false,
  name: '',
  position: '',
};

export const DemoDrawer = React.forwardRef((_props, ref: any) => {
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
        title: 'Notifications',
        onClose: () => handleDrawer(initialState),
      }}
      actionButtons={
        <div className="flex w-full flex-row items-center justify-between gap-3">
          {/* Mark All Read tick and Text*/}
          <div className="flex flex-shrink-0 items-center space-x-2">
            <FontAwesomeIcon icon={faCheck} className="text-primary h-5 w-5" aria-hidden="true" />
            <span className="text-primary text-sm font-semibold">Mark All Read</span>
          </div>
          <div className="mx-3 h-6 border-l border-gray-200"></div>
          <div className="flex flex-shrink-0 items-center space-x-2">
            <span className="text-sm">Unread Only</span>
            <ToggleSwitch />
          </div>
          <div className="mx-3 h-6 border-l border-gray-200"></div>

          {/* Settings' icon   */}
          <div className="flex flex-shrink-0 items-center space-x-2">
            <FontAwesomeIcon icon={faGear} className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      }
    >
      <div className="p-4">Demo Drawer...</div>
    </Drawer>
  );
});
