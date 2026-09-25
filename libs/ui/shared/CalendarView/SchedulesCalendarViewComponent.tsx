'use client';

import {
  Inject,
  ResourceDirective,
  ResourcesDirective,
  TimelineViews,
  TimelineYear,
  ToolbarItemDirective,
  ToolbarItemsDirective,
  ViewDirective,
  ViewsDirective,
} from '@syncfusion/ej2-react-schedule';
import { type SchedulesCalendarViewProps } from './types';
import { Scheduler } from '../../components/common';

export const SchedulesCalendarViewComponent = (props: SchedulesCalendarViewProps): JSX.Element => {
  return (
    <Scheduler
      licenseKey={process?.env?.SYNC_FUSION_KEY as string}
      id={props?.id}
      cssClass="schedule-cell-dimension"
      currentView="TimelineYear"
      height={props?.height}
      setSchedulerRef={props?.setSchedulerRef}
      loading={props?.loading}
      editorTemplate={props?.editorTemplate}
      resourceHeaderTemplate={props?.resourceHeaderTemplate}
      eventSettings={props?.eventSettings}
      eventRendered={props?.eventRendered}
      popupOpen={props?.popupOpen}
    >
      <ResourcesDirective>
        <ResourceDirective
          field="resourceId"
          name="Schedules"
          allowMultiple={true}
          dataSource={props?.schedulesData}
          idField="id"
        />
      </ResourcesDirective>
      <ViewsDirective>
        <ViewDirective
          option="TimelineYear"
          allowVirtualScrolling={true}
          timeScale={true}
          orientation="Vertical"
          eventTemplate={props?.eventTemplate}
          readonly={true}
          group={{
            resources: ['Schedules'],
          }}
        />
      </ViewsDirective>
      <Inject services={[TimelineViews, TimelineYear]} />
      <ToolbarItemsDirective>
        <ToolbarItemDirective name="DateRangeText" align="Left"></ToolbarItemDirective>
        <ToolbarItemDirective name="Previous" align="Right"></ToolbarItemDirective>
        <ToolbarItemDirective name="Next" align="Right"></ToolbarItemDirective>
      </ToolbarItemsDirective>
    </Scheduler>
  );
};

export default SchedulesCalendarViewComponent;
