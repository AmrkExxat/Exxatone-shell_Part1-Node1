/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import moment from 'moment';
import classNames from 'classnames';
import { faUsers } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faLocationDot } from '@fortawesome/pro-light-svg-icons';
import { schedulesCompliantStatusMap, schedulesStatusMap } from '../../CalendarView';

const LeftColumnGroupTemplate = ({ args }: { args: any }): JSX.Element => {
  const resource = args?.taskData;

  const statusViewStyle = schedulesStatusMap[resource?.scheduleViewStatus];

  const statusStyle = schedulesCompliantStatusMap[resource?.scheduleStatus];

  const availabilityName = resource?.availabilities?.[0]?.name;

  return (
    <div
      style={{ borderColor: statusViewStyle?.border?.resource }}
      className={classNames(
        `flex h-full flex-col items-start justify-center gap-2 border-l-4 px-2 text-xs break-words whitespace-break-spaces`
      )}
    >
      <div className="flex flex-row items-center gap-2 self-end">
        <div className="flex h-6 w-6 flex-col items-center justify-center rounded-full bg-[#F8EBDC]">
          <FontAwesomeIcon aria-label="group" className="h-3 w-3 text-[#D1753E]" icon={faUsers} />
        </div>
        {['Compliant', 'Non-Compliant']?.includes(resource?.scheduleStatus) && (
          <div
            className={classNames(
              'flex h-6 w-6 flex-col items-center justify-center rounded-full',
              resource?.scheduleStatus === 'Compliant' ? 'bg-[#DFFDCA]' : 'bg-[#FEE2E2]'
            )}
          >
            {statusStyle?.icon}
          </div>
        )}
      </div>
      <span className="font-semibold">{availabilityName}</span>

      {resource?.locations?.length > 0 && (
        <div className="flex flex-row items-start justify-start gap-2 text-xs">
          <FontAwesomeIcon icon={faLocationDot} className="h-3 w-3" />
          <span className="line-clamp-2 break-words whitespace-break-spaces">
            {resource?.locations?.[0]?.name}
          </span>
        </div>
      )}
      <div className="flex flex-row items-start justify-start gap-2 text-xs">
        <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" />
        <span className="text-xs break-words whitespace-break-spaces">
          {moment
            ?.utc(resource?.startDate ?? resource?.assignments?.[0]?.startDate)
            ?.format('MMM DD, YYYY')}{' '}
          -{' '}
          {moment
            ?.utc(resource?.endDate ?? resource?.assignments?.[0]?.endDate)
            ?.format('MMM DD, YYYY')}
        </span>
      </div>
    </div>
  );
};

export default LeftColumnGroupTemplate;
