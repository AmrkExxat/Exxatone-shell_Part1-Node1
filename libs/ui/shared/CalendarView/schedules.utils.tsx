/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { faThumbsDown, faThumbsUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const schedulesStatusMap: Record<
  string,
  {
    background: string;
    border: { resource: string; card: string };
    forground: string;
    title: string;
    legendColor?: string;
  }
> = {
  Completed: {
    background: '#F0FFE6',
    border: { resource: '#3DA709', card: '#C1FB9B' },
    forground: '#245512',
    title: 'Completed',
    legendColor: '#51A727',
  },
  Ongoing: {
    background: '#F8F3FF',
    border: { resource: '#E6D6FE', card: '#E6D6FE' },
    forground: '#4C1D95',
    title: 'Ongoing',
    legendColor: '#AD7AFC',
  },
  Upcoming: {
    background: '#F5F7FA',
    border: { resource: '#D2D9E5', card: '#D2D9E5' },
    forground: '#2F3A4B',
    title: 'Upcoming Schedule',
    legendColor: '#8F95A1',
  },
};

export const schedulesCompliantStatusMap: Record<
  string,
  { title: { card: string; banner: string }; icon: any; background: string; forground: string }
> = {
  Compliant: {
    title: {
      card: 'Compliant',
      banner: 'Compliant Status',
    },
    background: '#DFFDCA',
    forground: '#2C6B11',
    icon: (
      <FontAwesomeIcon
        icon={faThumbsUp}
        aria-label="compliant"
        className="h-3 w-3 text-[#2F7F0C]"
      />
    ),
  },
  'Non-Compliant': {
    title: {
      card: 'Non-Compliant',
      banner: 'Non-Compliant Status',
    },
    background: '#FEE2E2',
    forground: '#BB1E1F',
    icon: (
      <FontAwesomeIcon
        icon={faThumbsDown}
        aria-label="non compliant"
        className="h-3 w-3 text-[#BB1E1F]"
      />
    ),
  },
};

export const getIndividualScheduleWithViewStatus = (schedule: any): any => {
  schedule['scheduleStatus'] = schedule?.caas
    ? schedule?.caas?.compliant
      ? 'Compliant'
      : 'Non-Compliant'
    : 'NA';

  const currentDate = new Date();

  const scheduleStartDate = new Date(schedule?.startDate);

  const scheduleEndDate = new Date(schedule?.endDate);

  if (currentDate >= scheduleStartDate && currentDate <= scheduleEndDate) {
    schedule['scheduleViewStatus'] = 'Ongoing';
  } else if (currentDate < scheduleStartDate) {
    schedule['scheduleViewStatus'] = 'Upcoming';
  } else if (currentDate > scheduleEndDate) {
    schedule['scheduleViewStatus'] = 'Completed';
  }

  return schedule;
};

export const getGroupScheduleWithViewStatus = (schedule: any): any => {
  schedule['scheduleStatus'] =
    schedule?.caasStatus === 'Compliant'
      ? 'Compliant'
      : schedule?.caasStatus === 'Non-Compliant'
        ? 'Non-Compliant'
        : 'NA';

  schedule['id'] = schedule?.groupId;

  const currentDate = new Date();

  const scheduleStartDate = new Date(schedule?.assignments?.[0]?.startDate);

  const scheduleEndDate = new Date(schedule?.assignments?.[0]?.endDate);

  if (currentDate >= scheduleStartDate && currentDate <= scheduleEndDate) {
    schedule['scheduleViewStatus'] = 'Ongoing';
  } else if (currentDate < scheduleStartDate) {
    schedule['scheduleViewStatus'] = 'Upcoming';
  } else if (currentDate > scheduleEndDate) {
    schedule['scheduleViewStatus'] = 'Completed';
  }

  return schedule;
};
