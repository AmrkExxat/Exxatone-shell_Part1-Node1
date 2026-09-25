import moment from 'moment';
import { TimelineSettingsModel } from '@syncfusion/ej2-react-gantt';

export const getYearDates = (year: number) => {
  const firstDay = new Date(year, 0, 1); // January 1st
  const lastDay = new Date(year, 11, 31); // December 31st

  return {
    firstDate: moment(firstDay).format('YYYY-MM-DD'),
    lastDate: moment(lastDay).format('YYYY-MM-DD'),
  };
};

export const getMonthDates = (year: number, monthIndex: number) => {
  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0); // 0th day of next month = last day of current month

  return {
    firstDate: moment(startDate).format('YYYY-MM-DD'),
    lastDate: moment(endDate).format('YYYY-MM-DD'),
  };
};

export const monthTimelineSetting: TimelineSettingsModel = {
  timelineViewMode: 'Month',
  timelineUnitSize: 250,
  topTier: {
    unit: 'Month',
    format: 'MMM, yyyy',
  },
  bottomTier: {
    unit: 'None',
  },
};

export const dayTimelineSetting: TimelineSettingsModel = {
  timelineViewMode: 'Day',
  timelineUnitSize: 152,
  topTier: {
    unit: 'Day',
    format: 'MMM, dd yyyy',
  },
  bottomTier: {
    unit: 'None',
  },
};

export const hourTimelineSetting: TimelineSettingsModel = {
  timelineViewMode: 'Hour',
  timelineUnitSize: 83,
  topTier: {
    unit: 'Hour',
    format: 'hh a',
  },
  bottomTier: {
    unit: 'None',
  },
};

export const timelineSettingMap: Record<string, TimelineSettingsModel> = {
  Month: monthTimelineSetting,
  Week: dayTimelineSetting,
  Day: hourTimelineSetting,
};
