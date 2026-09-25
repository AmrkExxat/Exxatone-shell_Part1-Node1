import { RefObject } from 'react';

export enum ORGANIZATIONS {
  SITE = 'site',
  SCHOOL = 'school',
}

export enum PERSONA {
  SCHOOL = 'school',
  FACULTY = 'faculty',
}

export interface SchedulesPageDataBaseType {
  organization: ORGANIZATIONS | null;
  organizationId: string | null;
  loading: boolean;
  loaded: boolean;
  userRole?: string | null;
  isLocationPreceptor?: boolean;
  persona?: PERSONA;
  cancelReason?: any;
  disciplinesData?: any[];
  specializationsData?: any[];
  programsData?: any[];
  programFilterList?: any[];
  shiftData?: any[];
  programOptionsByDiscipline?: any[];
}

interface SchedulesExportBaseType {
  pageData: SchedulesPageDataBaseType;
  scheduleType: 'all' | 'group' | 'individual';
  filters: any;
  searchText?: string;
  searchType?: string;
  urlFilter?: string;
}
export interface SchedulesExportToExcelType extends SchedulesExportBaseType {
  notificationRef: RefObject<any>;
}

export interface ExportSchedulesReportType extends SchedulesExportBaseType {
  clientTimeZone: string;
}

export interface GetSchedulesExportReport {
  pageData: SchedulesPageDataBaseType;
  data: any[];
  locationPaths?: any;
  clientTimeZone: string;
}
