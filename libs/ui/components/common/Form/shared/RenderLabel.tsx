import React from 'react';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import Tooltip from '../../Tooltip/Tooltip';
import { Button } from '../../Buttons';

export default function RenderLabel({
  label,
  id,
  required = false,
  disabled = false,
  enableLabelClass = false,
  infoMsg,
  infoMsgTypeString = true,
  infoIconClass = 'text-default h-3 w-3',
}: {
  label?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  enableLabelClass?: boolean;
  infoMsg?: string;
  infoMsgTypeString?: boolean;
  infoIconClass?: string;
}): JSX.Element | undefined {
  if (label !== undefined && label?.length > 0) {
    return (
      <label
        htmlFor={id}
        className={classNames(
          'text-default ml-[3px] flex flex-row text-sm leading-6 font-semibold',
          disabled && !enableLabelClass && 'text-[#B0B0B0]'
        )}
      >
        {label}
        {required && (
          <span
            className={classNames(
              'ml-[2px] text-sm leading-6 text-red-600',
              disabled && !enableLabelClass && 'text-[#B0B0B0]'
            )}
          >
            *
          </span>
        )}
        {infoMsg && (
          <Tooltip
            triggerElement={() => (
              <Button
                size="sm"
                aria-label="info"
                variant="basic"
                className="h-3 w-3"
                id="info_icon"
                testid="info_icon"
                aria-describedby={`info_${label?.replace(/\s+/g, '_')}`}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={faCircleInfo} className={infoIconClass} />
              </Button>
            )}
            tooltip={() => (
              <>
                {infoMsgTypeString ? (
                  <div className="p-2" id={`info_${label?.replace(/\s+/g, '_')}`}>
                    {infoMsg}
                  </div>
                ) : (
                  <>{infoMsg}</>
                )}
              </>
            )}
            tabIndex={0}
          />
        )}
      </label>
    );
  }
}
