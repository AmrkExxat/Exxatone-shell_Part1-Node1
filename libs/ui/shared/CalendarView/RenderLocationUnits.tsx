import { faHospital } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Tooltip } from '../../components/common';

function RenderLocationUnits({ locationUnits }: { locationUnits: any }) {
  return (
    <div className="flex flex-row items-start justify-start gap-2">
      <FontAwesomeIcon className="mt-1 h-4 w-4" icon={faHospital} />
      <span className="font-semibold">Unit / Department:</span>
      <Tooltip
        ariaLabel={'unitsOrDepartment'}
        triggerElement={() => {
          return (
            <>
              <div className="mt-[2px] flex flex-row items-start justify-start gap-2 text-sm">
                {locationUnits.length === 1 ? (
                  <span>{locationUnits[0]?.name}</span>
                ) : (
                  <>
                    <span>{locationUnits[0]?.name}</span>
                    <span className="font-semibold">+ {locationUnits.length - 1}</span>
                  </>
                )}
              </div>
            </>
          );
        }}
        tooltip={() => {
          return (
            <div className="w-full p-2 text-sm whitespace-break-spaces text-[#5D5D5D]">
              {locationUnits?.length > 0 && (
                <span>
                  {locationUnits.map(
                    (unit: any, idx: number) =>
                      `${unit.name}${idx !== locationUnits.length - 1 ? ',' : ''}`
                  )}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}

export default RenderLocationUnits;
