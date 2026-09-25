import moment from 'moment';

export const getCurrentMonthDates = (): { firstDate: string; lastDate: string } => {
  const now = new Date();

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    firstDate: moment(firstDay)?.format('YYYY-MM-DD'),
    lastDate: moment(lastDay)?.format('YYYY-MM-DD'),
  };
};

export const getCurrentYearDates = (): { firstDate: string; lastDate: string } => {
  const now = new Date();

  const firstDay = new Date(now.getFullYear(), 0, 1);

  const lastDay = new Date(now.getFullYear(), 11, 31);

  return {
    firstDate: moment(firstDay)?.format('YYYY-MM-DD'),
    lastDate: moment(lastDay)?.format('YYYY-MM-DD'),
  };
};
