/* eslint-disable @typescript-eslint/consistent-type-definitions */
import moment, { type Moment } from 'moment';

type TagsPropType = {
  dateCondition?: {
    type: 'same day' | 'before or after';
    days?: number;
    direction?: 'before' | 'after';
  };
  phase?: 'start' | 'middle' | 'end';
};

const getApplicableDate = (props: TagsPropType, schedule: any): Moment | null => {
  const { startDate, endDate } = schedule;

  const phase = props?.phase;

  const dateCondition = props?.dateCondition;

  const start = moment(startDate);

  const end = moment(endDate);

  if (!start.isValid() || !end.isValid()) return null;

  let baseDate: moment.Moment;

  switch (phase) {
    case 'start':
      baseDate = start;
      break;
    case 'end':
      baseDate = end;
      break;
    case 'middle':
      baseDate = moment(start?.valueOf() + (end?.valueOf() - start?.valueOf()) / 2);
      break;
    default:
      return null;
  }

  let finalDate: moment.Moment;

  if (dateCondition?.type === 'same day') {
    finalDate = baseDate?.clone();
  } else if (
    dateCondition?.type === 'before or after' &&
    typeof dateCondition?.days === 'number' &&
    dateCondition?.direction !== undefined &&
    dateCondition?.direction?.length > 0
  ) {
    finalDate =
      dateCondition?.direction === 'before'
        ? baseDate?.clone().subtract(dateCondition?.days, 'days')
        : baseDate?.clone().add(dateCondition?.days, 'days');
  }

  return finalDate;
};

export const isPublishableActivity = (props: TagsPropType, schedule: any): boolean => {
  const applicableDate = getApplicableDate(props, schedule);

  if (applicableDate !== null) {
    return applicableDate.isSameOrBefore(moment(), 'day');
  } else {
    return false;
  }
};

export const getActivityDueDate = (props: TagsPropType, schedule: any): Moment | null => {
  return getApplicableDate(props, schedule);
};
