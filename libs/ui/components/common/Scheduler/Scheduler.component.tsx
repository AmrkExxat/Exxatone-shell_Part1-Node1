/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useRef } from 'react';

import { ScheduleComponent } from '@syncfusion/ej2-react-schedule';
import { isNullOrUndefined, registerLicense } from '@syncfusion/ej2-base';

import { Spinner } from '../Spinner';
import { type SchedulerTypes } from './types';

const Scheduler: React.FC<SchedulerTypes> = (props: SchedulerTypes) => {
  const {
    id,
    licenseKey,
    loading,
    cssClass,
    width,
    height,
    currentView,
    editorTemplate,
    eventSettings,
    actionBegin,
    actionComplete,
    eventRendered,
    popupOpen,
    cellClick,
    cellDoubleClick,
    resourceHeaderTemplate,
    children,
    renderCell,
    setSchedulerRef,
  } = props;

  registerLicense(licenseKey);

  const schedulerRef = useRef<ScheduleComponent>(null);

  const onActionComplete = (args: any) => {
    actionComplete?.(args);

    if (
      setSchedulerRef !== undefined &&
      setSchedulerRef != null &&
      schedulerRef?.current !== null
    ) {
      setSchedulerRef?.(schedulerRef);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {loading || isNullOrUndefined(eventSettings) ? (
        <div className="flex h-full w-full items-center justify-center">
          <Spinner id="loading_spinner" size="lg" className="" />
        </div>
      ) : (
        <ScheduleComponent
          id={id}
          ref={schedulerRef}
          cssClass={cssClass}
          width={width ?? '100%'}
          height={height}
          currentView={currentView}
          editorTemplate={editorTemplate}
          actionBegin={actionBegin}
          actionComplete={onActionComplete}
          eventSettings={eventSettings}
          eventRendered={eventRendered}
          cellClick={cellClick}
          renderCell={renderCell}
          cellDoubleClick={cellDoubleClick}
          resourceHeaderTemplate={resourceHeaderTemplate}
          popupOpen={popupOpen}
        >
          {children}
        </ScheduleComponent>
      )}
    </div>
  );
};

export default Scheduler;
