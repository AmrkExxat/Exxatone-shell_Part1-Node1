/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StatusList } from './StatusList';
import { type StatusPropsType } from './Status.types';

const RenderResponseStatus: React.FC<StatusPropsType> = ({
  label = '',
  showIcon = false,
  iconSize = 'h-5 w-5',
  labelClass = '',
}) => {
  const processedLabel = useMemo(() => label.trim().toLowerCase(), [label]);

  const status = StatusList[processedLabel];

  if (status === undefined || status === null) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: status?.bgColor,
      }}
      className={`flex flex-row items-center justify-start gap-2 rounded-full ${showIcon && status?.icon ? 'p-1 pr-2' : 'p-2'} py-1 text-sm`}
    >
      {showIcon && status?.icon !== null && status?.icon !== undefined ? (
        <FontAwesomeIcon
          icon={status.icon}
          style={{ color: status?.iconColor }}
          className={iconSize}
        />
      ) : (
        <div
          style={{
            backgroundColor: status?.fgColor,
          }}
          className="h-2 w-2 rounded-full"
        />
      )}
      <div
        style={{ color: status?.fgColor }}
        className={`flex flex-row items-center ${status?.labelClass ?? ''} ${labelClass}`}
      >
        {status?.label}
      </div>
    </div>
  );
};

export default RenderResponseStatus;
