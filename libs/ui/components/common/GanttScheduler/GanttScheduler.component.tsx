/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { forwardRef } from 'react';
import { GanttComponent } from '@syncfusion/ej2-react-gantt';
import { isNullOrUndefined, registerLicense } from '@syncfusion/ej2-base';

import { Spinner } from '../Spinner';
import { type GanttSchedulerTypes } from './types';

const GanttScheduler = forwardRef<GanttComponent, GanttSchedulerTypes>((props, ref) => {
  const {
    id,
    licenseKey,
    height,
    className,
    loading,
    dataSource,
    dateFormat,
    tooltipSettings,
    projectStartDate,
    projectEndDate,
    taskFields,
    allowSelection,
    splitterSettings,
    gridLines,
    rowHeight,
    actionComplete,
    taskbarTemplate,
    timelineSettings,
    zoomingLevels,
    children,
  } = props;

  registerLicense(licenseKey);

  const today = new Date();

  const eventMarkers = [
    {
      day: today,
      label: '',
    },
  ];

  const onActionComplete = (args: any) => {
    actionComplete?.(args);
  };

  return (
    <div className="flex h-full flex-col">
      {loading || isNullOrUndefined(dataSource) || dataSource?.length === 0 ? (
        <div
          className="flex h-full w-full items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="Loading search results"
        >
          <Spinner id="loading_spinner" size="lg" className="" />
        </div>
      ) : (
        <GanttComponent
          id={id}
          ref={ref}
          className={className}
          dataSource={dataSource}
          dateFormat={dateFormat}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
          tooltipSettings={tooltipSettings}
          taskFields={taskFields}
          allowSelection={allowSelection}
          height={height}
          rowHeight={rowHeight}
          splitterSettings={splitterSettings}
          gridLines={gridLines}
          actionComplete={onActionComplete}
          taskbarTemplate={taskbarTemplate}
          timelineSettings={timelineSettings}
          zoomingLevels={zoomingLevels}
          eventMarkers={eventMarkers}
          allowKeyboard={false}
        >
          {children}
        </GanttComponent>
      )}
    </div>
  );
});

GanttScheduler.displayName = 'GanttScheduler';

export default GanttScheduler;
