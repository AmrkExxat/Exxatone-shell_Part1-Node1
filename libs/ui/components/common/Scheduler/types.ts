/* eslint-disable @typescript-eslint/ban-types */

import { type RefObject, type ReactNode } from 'react';
import {
  type View,
  type EventSettingsModel,
  type EventRenderedArgs,
  type PopupOpenEventArgs,
  type ScheduleComponent,
  type CellClickEventArgs,
  type ActionEventArgs,
  RenderCellEventArgs,
} from '@syncfusion/ej2-react-schedule';
import { type EmitType } from '@syncfusion/ej2-base';

export interface SchedulerTypes {
  id?: string;
  licenseKey: string;
  cssClass?: string;
  height: string;
  setSchedulerRef?: (ref: RefObject<ScheduleComponent>) => void;
  width?: string;
  loading: boolean;
  eventSettings: EventSettingsModel;
  currentView?: View;
  editorTemplate?: string | Function;
  resourceHeaderTemplate?: string | Function;
  cellClick?: EmitType<CellClickEventArgs>;
  cellDoubleClick?: EmitType<CellClickEventArgs>;
  eventRendered?: EmitType<EventRenderedArgs>;
  actionBegin?: EmitType<ActionEventArgs>;
  actionComplete?: EmitType<ActionEventArgs>;
  popupOpen?: EmitType<PopupOpenEventArgs>;
  renderCell?: EmitType<RenderCellEventArgs>;
  children?: ReactNode;
}
