export interface DatePartsType {
  day: number;
  month: number;
  year: number;
  hours: number;
  minutes: number;
}

export const getSchedulerHeight = (minusHeight: number): string => {
  return `${window?.innerHeight - minusHeight}px`;
};

export const getDateParts = (dateString: string): DatePartsType => {
  const date = new Date(dateString);

  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
  };
};
