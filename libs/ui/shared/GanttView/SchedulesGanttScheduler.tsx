/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/ban-types */

import {
  ColumnDirective,
  ColumnsDirective,
  DayMarkers,
  type GanttComponent,
  Inject,
  type TimelineSettingsModel,
  VirtualScroll,
  ZoomTimelineSettings,
} from '@syncfusion/ej2-react-gantt';
import { forwardRef } from 'react';
import classNames from 'classnames';
import { GanttScheduler, ResourceViewMode } from '../../components/common/GanttScheduler';

const editingTaskFileds = {
  id: 'id',
  startDate: 'start',
  endDate: 'end',
};

const defaultTimilineSettings: TimelineSettingsModel = {
  timelineViewMode: 'Month',
  timelineUnitSize: 280,
  topTier: {
    unit: 'Month',
    format: 'MMM, yyyy',
  },
  bottomTier: {
    unit: 'None',
  },
};

interface SchedulesGanttSchedulerTypes {
  id: string;
  loading: boolean;
  dataSource: any;
  height: string;
  projectStartDate: string | Date | undefined;
  projectEndDate: string | Date | undefined;
  taskBarTemplate: string | Function;
  leftColumnTemplate: string | Function;
  timelineSettings: TimelineSettingsModel;
  zoomingLevels?: ZoomTimelineSettings[];
  resourceView: ResourceViewMode;
  headerTemplate?: any;
  headerText?: any;
  licenseKey: string;
}

const SchedulesGanttScheduler = forwardRef<GanttComponent, SchedulesGanttSchedulerTypes>(
  (
    {
      id,
      loading,
      height,
      dataSource,
      projectStartDate,
      projectEndDate,
      taskBarTemplate,
      leftColumnTemplate,
      zoomingLevels = [defaultTimilineSettings],
      timelineSettings = defaultTimilineSettings,
      resourceView = 'Detailed',
      licenseKey,
      headerText = ' ',
      headerTemplate,
    },
    ref
  ) => {
    return (
      <div
        className={classNames(
          'h-full w-full',
          resourceView === 'Detailed' ? 'detailed-view-gantt-chart' : 'compact-view-gantt-chart'
        )}
      >
        <GanttScheduler
          id={id}
          ref={ref}
          loading={loading}
          licenseKey={licenseKey}
          dateFormat="MMM dd, yyyy"
          dataSource={dataSource}
          tooltipSettings={{ showTooltip: false }}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
          taskFields={editingTaskFileds}
          allowSelection={false}
          height={height}
          rowHeight={resourceView === 'Detailed' ? 175 : 105}
          splitterSettings={{ columnIndex: 1, position: '200px' }}
          gridLines="Vertical"
          zoomingLevels={zoomingLevels}
          taskbarTemplate={taskBarTemplate}
          timelineSettings={timelineSettings}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="id"
              allowEditing={false}
              headerText={headerText}
              headerTemplate={headerTemplate}
              allowReordering={false}
              allowSorting={false}
              allowFiltering={false}
              allowResizing={false}
              width="200"
              template={leftColumnTemplate}
            ></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[VirtualScroll, DayMarkers]} />
        </GanttScheduler>
      </div>
    );
  }
);

SchedulesGanttScheduler.displayName = 'SchedulesGanttScheduler';

export default SchedulesGanttScheduler;
