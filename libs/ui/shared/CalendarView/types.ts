/* eslint-disable @typescript-eslint/ban-types */
import { type RefObject } from 'react';
import {
  type View,
  type EventSettingsModel,
  type EventRenderedArgs,
  type PopupOpenEventArgs,
  type ScheduleComponent,
  type CellClickEventArgs,
  type ActionEventArgs,
} from '@syncfusion/ej2-react-schedule';
import { type EmitType } from '@syncfusion/ej2-base';

export interface SchedulesCalendarViewProps {
  id?: string;
  height: string;
  setSchedulerRef?: (ref: RefObject<ScheduleComponent>) => void;
  width?: string;
  loading: boolean;
  schedulesData: any[];
  eventSettings: EventSettingsModel;
  currentView?: View;
  eventTemplate?: string | Function | any;
  editorTemplate?: string | Function | any;
  resourceHeaderTemplate?: string | Function;
  cellClick?: EmitType<CellClickEventArgs>;
  cellDoubleClick?: EmitType<CellClickEventArgs>;
  eventRendered?: EmitType<EventRenderedArgs>;
  actionBegin?: EmitType<ActionEventArgs>;
  actionComplete?: EmitType<ActionEventArgs>;
  popupOpen?: EmitType<PopupOpenEventArgs>;
}
