/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { type StatusPropsType } from './types';

import {
  ScheduleStatusList,
  RequestStatusList,
  AvailabilityStatusList,
  ScheduleStatus,
  RequestStatus,
  AvailabilityStatus,
  HelpStatusList,
  HelpStatus,
  WishlistStatusList,
  WishlistStatus,
} from './constant';
import classNames from 'classnames';

const Status: React.FC<StatusPropsType> = ({
  label = '',
  showIcon = false,
  showDot = false,
  type,
  id,
}) => {
  const processedLabel = useMemo(() => label.trim().toLowerCase(), [label]);

  const status = useMemo(() => {
    switch (type) {
      case 'request':
        return RequestStatusList[processedLabel as RequestStatus];
      case 'schedule':
      case 'requirement':
        return ScheduleStatusList[processedLabel as ScheduleStatus];
      case 'availability':
      case 'internship':
        return AvailabilityStatusList[processedLabel as AvailabilityStatus];
      case 'helpcenter':
        return HelpStatusList[processedLabel as HelpStatus];
      case 'wishlist':
        return WishlistStatusList[processedLabel as WishlistStatus];
      default:
        return undefined;
    }
  }, [processedLabel, type]);

  if (!status) {
    return null;
  }

  return (
    <div
      id={id}
      style={{ backgroundColor: status.bgColor }}
      className={classNames('flex flex-row items-center gap-2 text-sm', {
        'justify-start rounded-full p-2 py-1':
          type === 'schedule' || type === 'requirement' || type === 'wishlist',
        'justify-center rounded px-2.5 py-0.5 font-medium': type === 'request',
        'w-[9rem] justify-center rounded-sm p-2 py-1':
          type === 'availability' || type === 'internship' || type === 'helpcenter',
      })}
    >
      {showIcon && status.icon ? (
        <FontAwesomeIcon
          icon={status.icon}
          style={{ color: status.iconColor }}
          className="h-5 w-5"
        />
      ) : (
        showDot && (
          <div style={{ backgroundColor: status.fgColor }} className="h-2 w-2 rounded-full" />
        )
      )}
      <div style={{ color: status.fgColor }} className="flex flex-row items-center">
        {status.label}
      </div>
    </div>
  );
};

export default Status;
