import moment from 'moment';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import {
  faAddressCard,
  faCircle,
  faExclamationTriangle,
  faSchool,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { RefObject, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  SchedulesPageDataBaseType,
  GridActionType,
  LearnersProfileLinkQuery,
  ORGANIZATIONS,
} from '../../../models';
import { NotificationFunction } from '../../components/common/Notifications/Notifications';
import { faHospitals, faInfoCircle, faUser, faUsers } from '@fortawesome/pro-light-svg-icons';
import {
  Button,
  PersonListCell,
  RenderGridCurriculum,
  StatusBadge,
  Tooltip,
} from '../../components';

const hasAnyTime = (schedule: any): boolean => {
  if (!schedule || typeof schedule !== 'object') return false;

  const values = Object.values(schedule);
  if (values.length === 0) return false;

  return values.some((item: any) => item && (item.start != null || item.end != null));
};

export const getRotationAndCourseDetails = (asg: any) => {
  let rotationDetailsLabel = '';
  let courseDetailsLabel = '';

  const rotationDetailsInExt = asg?.ext?.rotationDetails;
  const courseDetailsInExt = asg?.ext?.courseDetails;

  if (rotationDetailsInExt) {
    rotationDetailsLabel = rotationDetailsInExt.label;
  }
  if (courseDetailsInExt) {
    courseDetailsLabel = courseDetailsInExt.label;
  }

  return {
    rotationDetailsLabel,
    courseDetailsLabel,
  };
};

const buildLearnersProfileHref = (
  organizationId: string | null,
  oneProfileId: string,
  query?: LearnersProfileLinkQuery
): string => {
  const path = `/${organizationId}/learners-profile/${encodeURIComponent(String(oneProfileId))}`;

  if (!query) return path;

  const q = new URLSearchParams();

  if (typeof query?.firstName === 'string' && query?.firstName?.trim())
    q.set('firstName', query?.firstName?.trim());

  if (typeof query?.lastName === 'string' && query?.lastName?.trim())
    q.set('lastName', query?.lastName?.trim());

  if (typeof query?.email === 'string' && query?.email?.trim())
    q.set('email', query?.email?.trim());

  if (typeof query?.name === 'string' && query?.name?.trim()) q.set('name', query?.name?.trim());

  const qs = q.toString();

  return qs ? `${path}?${qs}` : path;
};

const DAY_META: Record<string, { full: string; order: number }> = {
  sunday: { full: 'Sunday', order: 0 },
  sun: { full: 'Sunday', order: 0 },
  monday: { full: 'Monday', order: 1 },
  mon: { full: 'Monday', order: 1 },
  tuesday: { full: 'Tuesday', order: 2 },
  tue: { full: 'Tuesday', order: 2 },
  wednesday: { full: 'Wednesday', order: 3 },
  wed: { full: 'Wednesday', order: 3 },
  thursday: { full: 'Thursday', order: 4 },
  thu: { full: 'Thursday', order: 4 },
  friday: { full: 'Friday', order: 5 },
  fri: { full: 'Friday', order: 5 },
  saturday: { full: 'Saturday', order: 6 },
  sat: { full: 'Saturday', order: 6 },
};

const toDayOrder = (name: string): number => DAY_META[name?.toLowerCase()]?.order ?? 99;

const toDayFullName = (name: string): string => DAY_META[name?.toLowerCase()]?.full ?? name;

const renderDaysOfTheWeek = (days: any[]) => {
  if (!days?.length) return null;

  const sorted = [...days].sort((a, b) => toDayOrder(a?.name) - toDayOrder(b?.name));

  const first = sorted[0];

  return (
    <div className="flex flex-row flex-wrap items-center gap-1">
      <span className="text-sm">
        {toDayFullName(first?.name)}
        {first?.start && first?.end && (
          <span className="text-sm text-gray-500">{` (${first.start} - ${first.end})`}</span>
        )}
      </span>

      {sorted.length > 1 && (
        <Tooltip
          triggerElement={() => (
            <div className="text-primary flex items-center gap-1 text-sm font-medium">
              +{sorted.length - 1}
            </div>
          )}
          tooltip={() => (
            <div className="p-2 whitespace-break-spaces">
              {sorted.slice(1).map((day, index) => (
                <div
                  key={`day_${index}`}
                  className="mb-1 flex flex-row items-center justify-start gap-2 text-sm"
                >
                  <span>{toDayFullName(day?.name)}</span>
                  {day?.start && day?.end && (
                    <span className="text-sm text-gray-500">{`(${day.start} - ${day.end})`}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        />
      )}
    </div>
  );
};

const renderShift = (avbShifts: any[], showDuration: boolean = true) => {
  return (
    <div className="mr-2 flex flex-row flex-wrap items-start gap-1">
      <div className="flex flex-col gap-1 text-sm">
        <span>{avbShifts?.[0]?.name}</span>

        {showDuration && (
          <span className="text-xs text-gray-600">{`(${avbShifts?.[0]?.duration})`}</span>
        )}
      </div>

      {avbShifts?.length > 1 && (
        <Tooltip
          triggerElement={() => (
            <div className="text-primary flex items-center gap-1 text-sm font-medium">
              +{avbShifts.length - 1}
            </div>
          )}
          tooltip={() => (
            <div className="p-2 whitespace-break-spaces">
              {avbShifts.slice(1).map((shift, index) => (
                <div
                  key={`shift_${index}`}
                  className="mb-1 flex flex-row items-center justify-start gap-2 text-sm"
                >
                  <span className="text-sm">{shift?.name}</span>
                  {showDuration && (
                    <span className="text-xs text-gray-500">{`(${shift?.duration})`}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        />
      )}
    </div>
  );
};

const customShiftTimingBadge = () => {
  return (
    <div className="flex w-fit justify-center rounded-md bg-gray-200 p-1.5 py-0.5 text-xs text-[#333]">
      Custom Shift Timings
    </div>
  );
};

const buildFullAddress = (address: any): string => {
  const parts: string[] = [];

  const lines: string[] = address?.lines ?? [];

  const filtered = lines.filter((l: string) => l.trim() !== '');

  if (filtered.length > 0) parts.push(filtered.join(', '));

  if (address?.city?.trim()) parts.push(address.city);

  if (address?.state?.trim()) parts.push(address.state);

  if (address?.zip?.trim()) parts.push(address.zip);
  return parts.join(', ');
};

export const CancelledStatusBadge = (props: any): React.ReactNode => {
  const { item, onGridAction, showReason = true } = props;

  const reason = item?.cancellationReason?.[0]?.label ?? '';
  const email = item?.updatedBy ?? '';
  const date = item?.updatedAt ?? '';
  const status = item?.status?.toLowerCase();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-start gap-2">
        <StatusBadge
          {...(onGridAction && {
            onClick: () => {
              onGridAction('edit', item);
            },
          })}
          label="Canceled"
          variant="canceled"
        />
        {showReason && (
          <Tooltip
            triggerElement={() => (
              <FontAwesomeIcon className="h-3.5 w-3.5 text-gray-500" icon={faInfoCircle} />
            )}
            tooltip={() => (
              <div className="flex w-full min-w-75 flex-col gap-1 p-2 text-sm whitespace-break-spaces">
                <div>
                  <span className="font-medium">Reason:</span>
                  <span className="text-gray-500"> {reason ? reason : 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium">Canceled by:</span>{' '}
                  <span className="text-gray-500"> {email ? email : 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium">Canceled on:</span>{' '}
                  <span className="text-gray-500">
                    {date
                      ? moment.utc(date).local().format('MMM DD, YYYY HH:mm') +
                        ' ' +
                        `(${moment.utc(date).format('MMM DD, YYYY HH:mm')} UTC)`
                      : 'Not specified'}
                  </span>
                </div>
              </div>
            )}
            tabIndex={0}
            ariaLabel={`Reason for cancellation`}
            id={`cancel-reason-tooltip-${item?.id}`}
          />
        )}
      </div>
      {showReason && (
        <div className="flex items-center gap-0.5 truncate text-[10px]">
          <FontAwesomeIcon
            icon={status === 'revoked' ? faSchool : faHospitals}
            className="mb-0.5 h-3 w-3 pr-0.5 text-gray-500"
          />
          <div className="font-medium text-gray-600">
            {status === 'revoked' ? 'School:' : 'Site:'}
          </div>
          <div className="truncate text-gray-500">{reason ? reason : 'Not Specified'}</div>
        </div>
      )}
    </div>
  );
};

const PathBreadcrumb = ({ pathData, locationId }: { pathData: any[]; locationId: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setIsOverflowing(ref.current.scrollWidth > ref.current.clientWidth);
    }
  }, []);

  const pathNodes = pathData.map((path: any, i: number) => (
    <span key={i}>
      {path.name}
      {i !== pathData.length - 1 && <span className="px-1">{'>'}</span>}
    </span>
  ));

  return (
    <Tooltip
      id={`path-tooltip-${locationId}`}
      ariaLabel="Location path"
      triggerElement={() => (
        <div className="max-w-62.5 truncate text-xs text-gray-400" ref={ref}>
          <span>{'('}</span>
          {pathNodes}
          <span>{')'}</span>
        </div>
      )}
      tooltip={() =>
        isOverflowing ? (
          <div className="w-full p-2 text-sm whitespace-break-spaces text-[#5D5D5D]">
            {pathNodes}
          </div>
        ) : null
      }
    />
  );
};

export const EmptyCell = () => {
  return <span className="text-sm text-gray-500">-</span>;
};

export const LocationCell = ({
  location,
  pageData,
  href = '#',
}: {
  location: any;
  pageData: SchedulesPageDataBaseType;
  href?: any;
}) => {
  const nameRef = useRef<HTMLDivElement>(null);

  const [isNameOverflowing, setIsNameOverflowing] = useState(false);

  const fullAddress = buildFullAddress(location.addresses?.[0] ?? {});

  useEffect(() => {
    if (nameRef.current) {
      setIsNameOverflowing(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
  }, []);

  const getLocation = (name: string, id: string, actual: boolean = false) => {
    return (
      <>
        {pageData?.organization === ORGANIZATIONS.SITE && !pageData?.isLocationPreceptor ? (
          <Link
            href={href}
            className="focus-visible:outline-primary block max-w-full min-w-0 focus-visible:outline focus-visible:-outline-offset-2"
          >
            <span
              className={`block max-w-full min-w-0 truncate text-sm ${actual ? 'text-primary hover:underline' : 'text-gray-500'}`}
            >
              {name}
            </span>
          </Link>
        ) : (
          <span className="block max-w-full min-w-0 truncate text-sm text-gray-500">{name}</span>
        )}
      </>
    );
  };

  const pathData: any[] | undefined = location?.paths?.[0];

  const locationNameElement = (
    <div className="flex w-full min-w-0 items-center overflow-hidden">
      <div ref={nameRef} className="w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {getLocation(location.name, location.id, true)}
      </div>
    </div>
  );

  return (
    <div className="flex min-w-0 flex-col items-start gap-2 overflow-hidden" key={location.id}>
      {fullAddress?.length > 0 ? (
        <Tooltip
          id={`location-tooltip-${location.id}`}
          ariaLabel="Location name and address"
          triggerElement={() => locationNameElement}
          tooltip={() => (
            <div className="w-full p-2 text-sm whitespace-break-spaces text-[#5D5D5D]">
              {isNameOverflowing && <div className="mb-2 font-medium">{location.name}</div>}
              Address: {fullAddress}
            </div>
          )}
        />
      ) : (
        locationNameElement
      )}
      {pathData && pathData.length > 0 && (
        <PathBreadcrumb pathData={pathData} locationId={location.id} />
      )}
    </div>
  );
};

export const AssigneeCell = ({
  item,
  pageData,
  notificationRef,
  onGridAction,
}: {
  item: any;
  pageData: SchedulesPageDataBaseType;
  notificationRef: RefObject<NotificationFunction>;
  onGridAction: (type: GridActionType, props: any) => void;
}) => {
  const assignee = item?.assignee ?? {};

  if (isEmpty(item?.assignee)) {
    return (
      <Button
        variant="stroked"
        size="sm"
        aria-label={`Schedule student ${item?.availability?.name || ''}`}
        id={`assignments_schedule_student_${item?.availability?.name || ''}_btn`}
        testid="assignments_schedule_student_btn"
        className="px-2 py-0.5"
        onClick={() => onGridAction('edit', item)}
        disabled={
          item?.deleted ||
          item?.status?.toLowerCase() === 'cancelled' ||
          item?.status?.toLowerCase() === 'revoked' ||
          pageData?.userRole === 'read-only'
        }
      >
        Schedule Student
      </Button>
    );
  }

  const markedForHireList = assignee?.markedForHire ?? [];

  const totalFlaggedForHireCount = markedForHireList.filter(
    (entry: any) => entry?.flag === true
  ).length;

  const userHasFlaggedForHire = markedForHireList.some((entry: any) => entry?.flag === true);

  const flaggedForHireCount = userHasFlaggedForHire ? totalFlaggedForHireCount : 0;

  const firstName = typeof assignee?.firstName === 'string' ? assignee?.firstName : '';

  const lastName = typeof assignee?.lastName === 'string' ? assignee?.lastName : '';

  const profileHref =
    assignee?.oneProfileId && pageData?.organization === ORGANIZATIONS.SITE
      ? buildLearnersProfileHref(pageData?.organizationId, assignee?.oneProfileId, {
          firstName,
          lastName,
          email: assignee?.userEmail,
        })
      : undefined;

  const emp: any = {
    tags: item?.tags,
    empExempt: item?.policy?.empExempt ?? item?.empExempt,
  };

  const activeStudent = assignee?.usrViewedAt?.length > 0 ? true : false;

  return (
    <div className="flex flex-row items-start justify-start gap-2">
      {pageData?.organization === ORGANIZATIONS.SITE && (emp?.empExempt as boolean) && (
        <div className="flex shrink-0 flex-row items-center">
          <Tooltip
            id="assignee-emp-exempt-tooltip"
            ariaLabel="Employee exemption info"
            triggerElement={() => {
              return (
                <>
                  <FontAwesomeIcon className={`text-primary-500 h-4 w-4`} icon={faAddressCard} />
                </>
              );
            }}
            tooltip={() => (
              <div className="w-full p-2 whitespace-break-spaces">
                Declared as employee - Verified on{' '}
                {moment(emp?.tags?.verifiedOn)?.format('MM/DD/YYYY [at] HH:mm:ss')} as{' '}
                {emp?.tags?.empEmail}
              </div>
            )}
          />
        </div>
      )}

      {!activeStudent && (
        <div className="flex flex-row items-center">
          <Tooltip
            triggerElement={() => {
              return (
                <>
                  <FontAwesomeIcon
                    className={`h-3.5 w-3.5 text-[#FFC107]`}
                    icon={!activeStudent ? faExclamationTriangle : faCircle}
                  />
                </>
              );
            }}
            tooltip={() => (
              <div className="w-full p-2 whitespace-break-spaces">
                Awaiting first login from student
              </div>
            )}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <PersonListCell
          items={[
            {
              firstName,
              lastName,
              email: assignee.userEmail,
              profileHref,
            },
          ]}
          role="Student"
          notificationRef={notificationRef}
        />

        {typeof flaggedForHireCount === 'number' && flaggedForHireCount > 0 && (
          <span
            className="inline-flex w-fit shrink-0 items-center gap-1 rounded-md border border-purple-200 bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-700"
            aria-label={`Flagged for Hire (${flaggedForHireCount})`}
          >
            <FontAwesomeIcon icon={faStar} className="h-3 w-3 shrink-0" aria-hidden />
            Flagged for Hire {`(${flaggedForHireCount})`}
          </span>
        )}
      </div>
    </div>
  );
};

export const ShiftCell = ({ item }: { item: any }) => {
  const rawShifts: any[] = item?.shifts ?? [];

  const shiftTimings: Record<string, any> = item?.ext?.shiftTimings ?? {};

  const isShiftTimingPresent =
    item?.tags?.direct === true ? hasAnyTime(shiftTimings) : !isEmpty(shiftTimings);

  let avbShifts = rawShifts;

  let isShiftPresent = rawShifts.length > 0;

  if (!isShiftPresent && !isShiftTimingPresent && item?.availability?.shifts?.length) {
    avbShifts = item.availability.shifts;

    isShiftPresent = true;
  }

  if (isShiftPresent && !isShiftTimingPresent) {
    return renderShift(avbShifts, true);
  }

  if (isShiftTimingPresent) {
    return (
      <div className="flex flex-col gap-1">
        {isShiftPresent && renderShift(avbShifts, false)}

        {customShiftTimingBadge()}
      </div>
    );
  }

  return <EmptyCell />;
};

export const ScheduleStatusCell = ({
  item,
  onGridAction,
}: {
  item: any;
  onGridAction: (type: GridActionType, props: any) => void;
}) => {
  if (['cancelled', 'revoked'].includes(item?.status?.toLowerCase())) {
    return <CancelledStatusBadge item={item} onGridAction={onGridAction} />;
  }

  const hasAssignee = !isEmpty(item?.assignee);
  const isConfirmed = item?.policy?.stdCanViewAssignment ?? item?.stdCanViewAssignment;

  const variant = !hasAssignee ? 'na' : isConfirmed ? 'confirmed' : 'not-confirmed';
  const label = !hasAssignee ? 'To be Scheduled' : isConfirmed ? 'Confirmed' : 'Not Confirmed';

  return (
    <div className="flex flex-col items-start justify-start gap-1">
      <StatusBadge variant={variant} label={label} onClick={() => onGridAction('edit', item)} />
      {item?.confirmPendingDuration !== undefined &&
        item?.confirmPendingDuration !== null &&
        (!hasAssignee || !isConfirmed) && (
          <div className="flex flex-row gap-1 text-[10px]">
            <span className="text-gray-500">Pending since {item?.confirmPendingDuration} days</span>
          </div>
        )}
    </div>
  );
};

export const ActivityStatusCell = ({
  item,
  activityType = 'caas',
  href = '#',
}: {
  item: any;
  activityType: 'caas' | 'onb' | 'ofb';
  href?: any;
}) => {
  if (
    !item?.[activityType] ||
    !item?.[activityType]?.groups ||
    item?.[activityType]?.groups?.length === 0
  ) {
    return <StatusBadge variant="na" label="Not Applicable" />;
  }

  if ((item?.policy?.empExempt || item?.empExempt) && !item?.[activityType]?.groups) {
    return (
      <Tooltip
        triggerElement={() => {
          return <StatusBadge variant="compliant" label="Compliant" />;
        }}
        tooltip={() => {
          return (
            <div className="w-full p-2 text-xs whitespace-break-spaces">
              {`Due to student's employment status, student is considered compliant and no additional requirements are needed`}
            </div>
          );
        }}
      />
    );
  }

  const status = item?.status?.toLowerCase();

  const activityStarted = item?.[activityType]?.groups?.some((x: any) => x?.started);

  const statusVariant = item?.[activityType]?.compliant
    ? 'compliant'
    : activityStarted
      ? 'action-needed'
      : 'not-started';

  const statusLabel = item?.[activityType]?.compliant
    ? 'Compliant'
    : activityStarted
      ? 'Some Action Needed'
      : 'Not Started';

  if (item?.deleted || ['cancelled', 'revoked'].includes(status)) {
    return <StatusBadge variant={statusVariant} label={statusLabel} />;
  }

  const schoolRequirements: any[] =
    item?.caas?.groups?.filter((x: any) =>
      x?.reqmntOf?.some((r: string) => r?.toLowerCase()?.includes('school'))
    ) ?? [];

  const isSchoolRequirementCompleted: boolean =
    schoolRequirements.length > 0 && schoolRequirements.every((x: any) => x?.compliant);

  return (
    <div className="flex flex-col items-start justify-start gap-1.5">
      <StatusBadge variant={statusVariant} label={statusLabel} href={href} />
      {activityType === 'caas' && (
        <>
          {schoolRequirements?.length > 0 && (
            <div className="flex flex-row gap-1 text-[10px]">
              <span className="text-gray-500">School Requirements:</span>
              {isSchoolRequirementCompleted ? (
                <span className="font-medium text-green-700">Completed</span>
              ) : (
                <span className="font-medium text-orange-700">Pending</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const ScheduleIdCell = ({
  item,
  onGridAction,
}: {
  item: any;
  onGridAction: (type: GridActionType, props: any) => void;
}) => {
  return (
    <div className="flex flex-col items-start justify-start text-left">
      <div className="flex flex-row items-center justify-start gap-1 text-sm">
        <FontAwesomeIcon
          className="h-3 w-3 text-purple-500"
          icon={item?.groupPlacement ? faUsers : faUser}
        />
        <span>{item?.displayId}</span>
      </div>
      {item?.groupName && (
        <div className="flex min-w-0 flex-row items-center justify-start">
          <Tooltip
            triggerElement={() => (
              <button
                className="text-primary block truncate text-left text-sm hover:underline"
                role="button"
                aria-label={`View details for ${item?.groupName}`}
                onClick={() => onGridAction('group-edit', item)}
              >
                {item?.groupName}
              </button>
            )}
            tooltip={() => <span className="p-3 text-sm">{item?.groupName}</span>}
          />
        </div>
      )}
    </div>
  );
};

export const AvailabilityCell = ({
  item,
  pageData,
  href = '#',
  hideLabel = false,
}: {
  item: any;
  pageData: SchedulesPageDataBaseType;
  href?: any;
  hideLabel?: boolean;
}) => {
  if (item?.availability?.name === undefined || item?.availability?.name === null) {
    return <span className="text-sm">NA</span>;
  }

  const availabilityName =
    typeof item?.availability?.name === 'string' ? item.availability.name : 'NA';

  const displayId =
    typeof (item?.slotRequest?.displayId ?? item?.displayId) === 'object'
      ? ''
      : (item?.slotRequest?.displayId ?? item?.displayId);

  return (
    <div className="flex flex-col text-sm">
      <div className="flex flex-row gap-1.5">
        {pageData?.organization === ORGANIZATIONS.SITE &&
        !item?.deleted &&
        (!item?.status || item?.status === 'Active') &&
        !pageData?.isLocationPreceptor ? (
          <Link
            className="text-primary truncate text-sm wrap-break-word hover:underline"
            href={href}
          >
            {availabilityName}
          </Link>
        ) : (
          <>
            <span className="truncate text-sm wrap-break-word">{availabilityName}</span>
            {item?.deleted && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                Deleted
              </span>
            )}
          </>
        )}
      </div>
      {displayId && (
        <span className="text-xs text-gray-500">
          <span>Request ID:</span>
          {displayId}
        </span>
      )}
    </div>
  );
};

export const ScheduleDurationCell = ({ item }: { item: any }) => {
  if (isEmpty(item?.startDate) || isEmpty(item?.endDate)) {
    return <EmptyCell />;
  }

  return (
    <div className="flex flex-col text-sm">
      <span>
        {moment?.utc(item?.startDate).format('MMM DD, YYYY')} -{' '}
        {moment?.utc(item?.endDate).format('MMM DD, YYYY')}
      </span>
    </div>
  );
};

export const CurriculumCell = ({
  item,
  pageData,
}: {
  item: any;
  pageData: SchedulesPageDataBaseType;
}) => {
  if (isEmpty(item?.curriculum)) {
    return <EmptyCell />;
  }

  return (
    <RenderGridCurriculum
      disciplines={pageData?.disciplinesData ?? []}
      specializations={pageData?.specializationsData ?? []}
      curriculum={item?.curriculum ?? []}
    />
  );
};

export const DaysofWeekCell = ({ item }: { item: any }) => {
  if (!item?.daysInWeek?.length) return <EmptyCell />;

  const shiftTimings = item?.ext?.shiftTimings ?? {};

  const days = item.daysInWeek.map((day: string) => {
    const timing = shiftTimings[day];

    return {
      name: day,
      start: timing?.start ? moment(timing.start).format('HH:mm') : null,
      end: timing?.end ? moment(timing.end).format('HH:mm') : null,
    };
  });

  return renderDaysOfTheWeek(days);
};

export const PreceptorCell = ({
  item,
  notificationRef,
  from,
}: {
  item: any;
  notificationRef?: RefObject<NotificationFunction>;
  from?: string;
}) => {
  if (item?.preceptors?.length > 0) {
    return (
      <PersonListCell
        items={item?.preceptors}
        role="Preceptor"
        notificationRef={notificationRef}
        from={from}
      />
    );
  } else {
    return <EmptyCell />;
  }
};

export const ClinicalInstructorCell = ({
  item,
  notificationRef,
}: {
  item: any;
  notificationRef: RefObject<NotificationFunction>;
}) => {
  if (item?.faculties?.length > 0) {
    return (
      <PersonListCell
        items={item?.faculties}
        role="Clinical Instructor"
        notificationRef={notificationRef}
      />
    );
  } else {
    return <span className="text-sm text-gray-500">N/A</span>;
  }
};

export const RotationAndCourseDetailsCell = ({ item }: { item: any }) => {
  const { rotationDetailsLabel, courseDetailsLabel } = getRotationAndCourseDetails(item);

  if (!rotationDetailsLabel && !courseDetailsLabel) return <EmptyCell />;

  return (
    <div className="flex min-w-0 flex-col gap-1">
      {rotationDetailsLabel && (
        <Tooltip
          triggerElement={() => (
            <span className="block max-w-full truncate text-sm">{rotationDetailsLabel}</span>
          )}
          tooltip={() => <span className="p-3 text-sm">{rotationDetailsLabel}</span>}
        />
      )}

      {courseDetailsLabel && (
        <Tooltip
          triggerElement={() => (
            <span className="block max-w-full truncate text-xs text-gray-500">
              {courseDetailsLabel}
            </span>
          )}
          tooltip={() => <span className="p-3 text-sm">{courseDetailsLabel}</span>}
        />
      )}
    </div>
  );
};
