import moment from 'moment';
import Link from 'next/link';
import { JSX, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/pro-solid-svg-icons';
import { RenderGridCurriculum, Tooltip, WeekView } from '../../components/common';
import { getRotationAndCourseDetails, PreceptorCell, ShiftCell } from './SchedulesColumns';

interface SchedulesDetailsCardPropsType {
  organization: 'school' | 'site';
  organizationId: string;
  slotRequest: any;
  schedule: any;
  isGroup: boolean;
  disciplineData: any[];
  specializationData: any[];
  RenderProgram: ({
    program,
    id,
    simpleView,
    classWrapper,
  }: {
    program: any[];
    id?: string;
    simpleView?: boolean;
    classWrapper?: string;
  }) => JSX.Element;
}

const SchedulesDetailsCard = (props: SchedulesDetailsCardPropsType): ReactNode => {
  const {
    organization,
    organizationId,
    schedule,
    slotRequest,
    isGroup,
    disciplineData,
    specializationData,
    RenderProgram,
  } = props;

  return (
    <div className="bg-card rounded-md border p-0">
      <div className="flex min-h-11 items-center justify-between border-b px-4 py-2">
        <span
          className="text-md leading-none font-semibold text-[#262626]"
          role="heading"
          aria-level={2}
        >
          Schedule Details
        </span>
        <div className="flex h-6 flex-row items-center justify-center gap-2 rounded-full bg-[#EBEEF3] px-2 py-1 text-[11px]">
          <FontAwesomeIcon className="h-3 w-3 text-[#9C27B0]" icon={isGroup ? faUsers : faUser} />
          <span>{isGroup ? 'Group' : 'Individual'}</span>
        </div>
      </div>
      <div className="bg-card flex flex-col gap-4 rounded-md p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <div className="flex w-full flex-row items-start justify-start">
            <div className="flex flex-col items-start justify-start">
              {schedule?.groupId && schedule?.groupName ? (
                <span className="text-primary text-sm">{schedule?.groupName}</span>
              ) : (
                <>
                  {organization === 'site' ? (
                    <Link
                      target="_blank"
                      className="link-text text-sm"
                      aria-label={`${schedule?.availabilities?.[0]?.name} Opens in New Tab `}
                      key={schedule?.availabilities?.[0]?.id}
                      href={{
                        pathname: `/${organizationId}/internships/${schedule?.availabilities?.[0]?.id}/school-request/${slotRequest?.id}`,
                      }}
                    >
                      <span>{schedule?.availabilities?.[0]?.name}</span>
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold">
                      {schedule?.availabilities?.[0]?.name}
                    </span>
                  )}
                </>
              )}

              {slotRequest?.displayId && (
                <span className="text-xs text-gray-500">
                  (Request ID: {slotRequest?.displayId})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 text-sm">
          {organization === 'site' ? (
            <div className="col-span-3 flex flex-col items-start justify-start">
              <span className="text-[#99A1AF]">School</span>
              <div className="line-clamp-1 w-full wrap-break-word">
                <Tooltip
                  triggerElement={() => {
                    return <> {schedule?.schools?.[0]?.name}</>;
                  }}
                  tooltip={() => {
                    return <div className="p-2 text-sm">{schedule?.schools?.[0]?.name}</div>;
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="col-span-3 flex flex-col items-start justify-start">
              <span className="text-[#99A1AF]">Site</span>
              <div className="line-clamp-1 w-full wrap-break-word">
                <Tooltip
                  triggerElement={() => {
                    return <> {schedule?.sites?.[0]?.name}</>;
                  }}
                  tooltip={() => {
                    return <div className="p-2 text-sm">{schedule?.sites?.[0]?.name}</div>;
                  }}
                />
              </div>
            </div>
          )}

          {isGroup && (
            <div className="col-span-3 flex flex-col items-start justify-start">
              <span className="text-[#99A1AF]">Availability</span>
              <div className="line-clamp-1 w-full text-sm wrap-break-word">
                {schedule?.availabilities?.[0]?.name ? (
                  <>
                    {(() => {
                      const triggerElement = () => {
                        return (
                          <>
                            {organization === 'site' ? (
                              <Link
                                target="_blank"
                                className="link-text text-sm"
                                aria-label={`${schedule?.availabilities?.[0]?.name} Opens in New Tab `}
                                key={schedule?.availabilities?.[0]?.id}
                                href={{
                                  pathname: `/${organizationId}/internships/${schedule?.availabilities?.[0]?.id}/school-request/${slotRequest?.id}`,
                                }}
                              >
                                <span>{schedule?.availabilities?.[0]?.name}</span>
                              </Link>
                            ) : (
                              <>{schedule?.availabilities?.[0]?.name}</>
                            )}
                          </>
                        );
                      };

                      const tooltip = () => {
                        return (
                          <div className="p-2 text-sm">{schedule?.availabilities?.[0]?.name}</div>
                        );
                      };

                      return <Tooltip triggerElement={triggerElement} tooltip={tooltip} />;
                    })()}
                  </>
                ) : (
                  'NA'
                )}
              </div>
            </div>
          )}

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Location</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {schedule?.locations?.[0]?.name ? (
                <Tooltip
                  triggerElement={() => {
                    return <> {schedule?.locations?.[0]?.name}</>;
                  }}
                  tooltip={() => {
                    return <div className="p-2 text-sm">{schedule?.locations?.[0]?.name}</div>;
                  }}
                />
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Duration</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {schedule?.startDate
                ? moment(schedule?.startDate)?.format('MMM DD, YYYY')
                : 'Not specified'}{' '}
              -{' '}
              {schedule?.endDate
                ? moment(schedule?.endDate)?.format('MMM DD, YYYY')
                : 'Not specified'}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Discipline & Specialization</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {schedule?.curriculum?.length > 0 ? (
                <RenderGridCurriculum
                  disciplines={disciplineData ?? []}
                  specializations={specializationData ?? []}
                  curriculum={schedule?.curriculum ?? []}
                />
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Program Type</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {schedule?.programs?.length > 0 ? (
                <RenderProgram
                  program={schedule?.programs ?? []}
                  simpleView={true}
                  classWrapper="mb-0"
                />
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Shift</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              <ShiftCell
                item={{
                  ...schedule,
                  availability: schedule?.availabilities?.[0],
                }}
              />
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Days of the week</span>
            <div className="mt-1">
              <WeekView daysInWeek={schedule?.daysInWeek} />
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Rotation Details</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {(() => {
                const { rotationDetailsLabel } = getRotationAndCourseDetails(schedule);

                if (rotationDetailsLabel?.length > 0) {
                  return (
                    <Tooltip
                      triggerElement={() => {
                        return <>{rotationDetailsLabel ?? '-'}</>;
                      }}
                      tooltip={() => {
                        return <div className="p-2 text-sm">{rotationDetailsLabel ?? '-'}</div>;
                      }}
                    />
                  );
                } else {
                  return '-';
                }
              })()}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Course Details</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {(() => {
                const { courseDetailsLabel } = getRotationAndCourseDetails(schedule);

                if (courseDetailsLabel?.length > 0) {
                  return (
                    <Tooltip
                      triggerElement={() => {
                        return <>{courseDetailsLabel ?? '-'}</>;
                      }}
                      tooltip={() => {
                        return <div className="p-2 text-sm">{courseDetailsLabel ?? '-'}</div>;
                      }}
                    />
                  );
                } else {
                  return '-';
                }
              })()}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">No. of hours to be completed</span>
            <div className="line-clamp-1 w-full wrap-break-word">
              {(schedule?.numberOfHours ?? schedule?.ext?.numberOfHours)
                ? `${schedule?.numberOfHours ?? schedule?.ext?.numberOfHours} hours`
                : '-'}
            </div>
          </div>

          <div className="col-span-3 flex flex-col items-start justify-start">
            <span className="text-[#99A1AF]">Preceptor</span>
            {schedule?.preceptors?.length > 0 ? (
              <PreceptorCell item={schedule} from={'card'} />
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulesDetailsCard;
