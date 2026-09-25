'use client';

import classNames from 'classnames';
import { schedulesCompliantStatusMap, schedulesStatusMap } from './schedules.utils';

const CalendarViewBottomBanner = (): JSX.Element => {
  return (
    <div role="region" aria-label="Schedule legend">
      <div
        className={classNames(
          'bg-card absolute right-0 bottom-0 z-[49] flex h-10 w-full flex-row items-center justify-end gap-4 border-t px-4 shadow-md md:z-[9999]'
        )}
        role="list"
      >
        {Object.entries(schedulesStatusMap)?.map(([key, value]) => {
          return (
            <div
              className={classNames('flex flex-row items-center justify-start gap-2 border-r pr-4')}
              key={key}
              role="listitem"
            >
              <div
                style={{
                  backgroundColor: schedulesStatusMap[key]?.background,
                  border: `1px solid ${schedulesStatusMap[key]?.legendColor}`,
                }}
                className={classNames('h-[17px] w-[17px]')}
                aria-hidden="true"
              ></div>
              <span className="text-[8px] md:text-sm">{schedulesStatusMap[key].title}</span>
            </div>
          );
        })}
        {Object.entries(schedulesCompliantStatusMap)?.map(([key, value], index: number) => {
          return (
            <div
              className={classNames(
                'flex flex-row items-center justify-start gap-2',
                index !== Object?.entries(schedulesCompliantStatusMap)?.length - 1
                  ? 'border-r pr-4'
                  : ''
              )}
              key={key}
              role="listitem"
            >
              {schedulesCompliantStatusMap[key].icon}
              <span className="text-[8px] md:text-sm">
                {schedulesCompliantStatusMap[key]?.title?.banner}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarViewBottomBanner;
