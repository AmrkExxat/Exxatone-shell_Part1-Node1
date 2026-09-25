/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCalendar, faLocationDot } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import moment from 'moment';
import { schedulesCompliantStatusMap, schedulesStatusMap } from '../../CalendarView';

const LeftColumnIndividualTemplate = ({
  args,
  handleOnEdit,
}: {
  args: any;
  handleOnEdit: (data: any) => void;
}): JSX.Element => {
  const resource = args?.taskData;

  const statusViewStyle = schedulesStatusMap[resource?.scheduleViewStatus];

  const statusStyle = schedulesCompliantStatusMap[resource?.scheduleStatus];

  const isStudentAdded = resource?.assignees?.length > 0;

  const studentName =
    resource?.assignees?.[0]?.firstName + ' ' + resource?.assignees?.[0]?.lastName;

  const _availabilityName = resource?.availabilities?.[0]?.name ?? resource?.availabilityName;

  return (
    <div
      style={{ borderColor: statusViewStyle?.border?.resource }}
      className={classNames(
        `flex h-full flex-col items-start justify-center gap-2 border-l-4 px-2 text-xs break-words whitespace-break-spaces`
      )}
    >
      <div className="flex flex-row items-center gap-2 self-end">
        <div className="flex h-6 w-6 flex-col items-center justify-center rounded-full bg-[#F8EBDC]">
          <FontAwesomeIcon
            aria-label="individual"
            className="h-3 w-3 text-[#D1753E]"
            icon={faUser}
          />
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

      <span className="line-clamp-1 text-xs font-semibold">{_availabilityName}</span>

      <span className="font-semibold">
        {isStudentAdded ? studentName : 'Student To Be Assigned'}
      </span>

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
          {moment?.utc(resource?.startDate)?.format('MMM DD, YYYY')} -{' '}
          {moment?.utc(resource?.endDate)?.format('MMM DD, YYYY')}
        </span>
      </div>
    </div>
  );
};

export default LeftColumnIndividualTemplate;
