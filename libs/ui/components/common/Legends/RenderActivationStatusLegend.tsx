import { faCircle, faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Tooltip } from '../Tooltip';

function RenderActivationStatusLegend({
  addText = false,
  active = false,
}: {
  addText?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex flex-row items-center">
      <Tooltip
        triggerElement={() => {
          return (
            <>
              <FontAwesomeIcon
                className={`h-3 w-3 ${active ? 'invisible' : 'text-[#FFC107]'}`}
                icon={!active ? faExclamationTriangle : faCircle}
              />
              {addText && (
                <span className="ms-2">{active ? 'Active Users' : 'Inactive Users'}</span>
              )}
            </>
          );
        }}
        tooltip={() =>
          active ? null : (
            <div className="w-full p-2 whitespace-break-spaces">
              Awaiting first login from student
            </div>
          )
        }
      />
    </div>
  );
}

export default RenderActivationStatusLegend;
