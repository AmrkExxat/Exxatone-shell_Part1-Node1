/* eslint-disable @typescript-eslint/ban-types */

import { type ReactNode } from 'react';

import {
  GridLine,
  SplitterSettingsModel,
  TaskFieldsModel,
  TimelineSettingsModel,
  ZoomTimelineSettings,
} from '@syncfusion/ej2-react-gantt';
import { EmitType } from '@syncfusion/ej2-base';

export interface GanttSchedulerTypes {
  id?: string;
  licenseKey: string;
  className?: string;
  height: string;
  width?: string;
  loading: boolean;
  dataSource: any;
  rowHeight?: number;
  dateFormat?: string;
  tooltipSettings?: any;
  projectStartDate: string | Date | undefined;
  projectEndDate: string | Date | undefined;
  taskFields?: TaskFieldsModel | undefined;
  allowSelection?: boolean;
  actionComplete?: EmitType<any>;
  splitterSettings?: SplitterSettingsModel | undefined;
  gridLines?: GridLine | undefined;
  taskbarTemplate?: string | Function;
  timelineSettings?: TimelineSettingsModel | undefined;
  zoomingLevels?: ZoomTimelineSettings[];
  children?: ReactNode;
}

export type CalendarViewMode = 'Month' | 'Week' | 'Day';

export type ResourceViewMode = 'Detailed' | 'Compact';
