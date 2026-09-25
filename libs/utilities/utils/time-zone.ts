import moment from 'moment-timezone';

export const formatDateWithZone = (dateString: string): string => {
  const m = moment.parseZone(dateString);

  const offset = m.format('Z');

  const zoneName = moment.tz.names().find((tz) => moment.tz(dateString, tz).format('Z') === offset);

  return zoneName
    ? moment.tz(dateString, zoneName).format('MMMM DD, YYYY [at] hh:mm A z')
    : m.format(`MMMM DD, YYYY [at] hh:mm A [${offset}]`);
};
