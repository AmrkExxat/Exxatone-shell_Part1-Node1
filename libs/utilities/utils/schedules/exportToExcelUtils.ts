import moment from 'moment';
import { isEmpty } from 'lodash';
import { GetSchedulesExportReport, ORGANIZATIONS } from '../../../models/schedules';
import { getRotationAndCourseDetails } from '../../../ui';

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const fullDay = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

export const getMonthName = (monthNumber: number): string => monthNames[monthNumber - 1];

export const getDepartmentUnitNames = (locations: any[], paths: any) => {
  if (paths) {
    const levels: string[] = [];
    locations.map(({ id }) => {
      paths?.[id]?.length ? paths[id].map((p: any) => levels.push(p.name)) : [];
    });
    return levels;
  } else {
    return [];
  }
};

export const hasAnyTime = async (schedule: any) => {
  if (!schedule || typeof schedule !== 'object') return false;

  const values = Object.values(schedule);
  if (values.length === 0) return false;

  return values.some((item: any) => item && (item.start != null || item.end != null));
};

export const buildShiftString = (
  avbShifts: Array<{ name: string; duration?: string }> = [],
  isShiftPresent: boolean,
  shiftTimings: Record<string, any> = {}
) => {
  const isShiftTimingPresent = !isEmpty(shiftTimings) && hasAnyTime(shiftTimings);

  if (!avbShifts?.length) return '';

  const includeDuration = !isShiftTimingPresent;

  const shiftList = avbShifts
    .map((shift) =>
      includeDuration && shift.duration ? `${shift.name}(${shift.duration})` : shift.name
    )
    .join(', ');

  if (!isShiftTimingPresent) {
    return shiftList;
  }

  if (isShiftTimingPresent) {
    return isShiftPresent ? `[Custom Shift Timings] ${shiftList}` : `[Custom Shift Timings]`;
  }

  return '';
};

export const getShiftTimingString = (time: any, tz: any) => {
  return `${time?.start ? moment.utc(time?.start).tz(tz).format('HH:mm') : 'Not specified'} - ${time?.end ? moment.utc(time?.end).tz(tz).format('HH:mm') : 'Not specified'}`;
};

export const buildDaysOfWeekString = (
  daysInWeek: string[] = [],
  shiftTimings: Record<string, any> = {},
  fullDay: Record<string, string> = {},
  tz?: any
) => {
  if (!daysInWeek?.length) return '';

  return daysInWeek
    .map((day) => {
      const timing = !isEmpty(shiftTimings) && shiftTimings?.[day] ? shiftTimings[day] : {};

      const start = timing?.start ? moment?.utc(timing.start)?.tz(tz).format('HH:mm') : null;

      const end = timing?.end ? moment?.utc(timing.end)?.tz(tz)?.format('HH:mm') : null;

      return start && end ? `${fullDay[day]} (${start} - ${end})` : fullDay[day];
    })
    .join(', ');
};

export const getProgramNames = (programs: any, programsList: any, allDisciplines: any[] = []) => {
  if (!programs?.length) return '';
  const programById = new Map<string, any>((programsList ?? []).map((p: any) => [p?.id, p]));
  const hydrateProgramLookup = (nodes: any[] = [], disciplineId?: string) => {
    nodes.forEach((node: any) => {
      if (!node?.id) return;
      if (!programById.has(node.id)) {
        programById.set(node.id, {
          id: node.id,
          name: node?.name ?? node?.label ?? node?.value ?? node?.id,
          disciplineId: node?.disciplineId ?? disciplineId,
        });
      }
      const childNodes = node?.children ?? node?.programs ?? node?.subPrograms ?? [];
      const normalizedChildNodes = (childNodes ?? []).filter(
        (child: any) => typeof child === 'object' && child !== null
      );
      if (normalizedChildNodes.length) {
        hydrateProgramLookup(normalizedChildNodes, node?.disciplineId ?? disciplineId);
      }
    });
  };
  hydrateProgramLookup(programsList ?? []);

  const disciplineById = new Map<string, string>(
    (allDisciplines ?? []).map((d: any) => [d?.id, d?.label ?? d?.name ?? ''])
  );

  return programs
    .map((p: any) => {
      const baseProgram = programById.get(p?.programId);
      const programName = baseProgram?.name ?? p?.programName ?? 'Not specified';
      const disciplineName = disciplineById.get(baseProgram?.disciplineId) ?? '';
      const programWithDiscipline = disciplineName
        ? `${programName} (${disciplineName})`
        : `${programName}`;

      const subNames = p?.subPrograms
        ?.map((sid: any) => {
          if (typeof sid === 'string') {
            return programById.get(sid)?.name ?? 'Not specified';
          }
          return sid?.name ?? sid?.label ?? sid?.programName ?? 'Not specified';
        })
        .filter(Boolean);

      return programWithDiscipline + (subNames?.length ? ` [${subNames?.join(', ')}]` : '');
    })
    .filter(Boolean)
    .join(', ');
};

export const getDisciplineLabels = (curriculum: any[], allDisciplines?: any[]) => {
  if (!curriculum?.length || !allDisciplines?.length) return '';

  const disciplines = curriculum
    ?.reduce((acc, c) => {
      const discipline = allDisciplines?.find((item: any) => item?.id === c.disciplineId);
      if (discipline && !acc.some((d: any) => d.id === discipline.id)) {
        acc.push({ id: discipline?.id, name: discipline?.name ?? discipline?.label });
      }
      return acc;
    }, [])
    .map((d: any) => d.name);

  return disciplines.length ? disciplines.join(', ') : '';
};

export const getSpecialisationLabels = (curriculum: any[], allSpecializations?: any[]) => {
  if (!curriculum?.length || !allSpecializations?.length) return '';

  const specializationIds = curriculum.map((item) => item.specializationId).filter(Boolean);
  if (!specializationIds.length) return '';

  const specData = allSpecializations?.filter((item) => specializationIds.includes(item?.id));

  if (!specData) return '';

  return specData.map((spec) => spec.name).join(', ');
};

export const getLocationNames = (locations: any, paths?: any) => {
  if (paths) {
    return locations
      .map(({ name, id }: { name: string; id: string }) => {
        return (
          name + (paths?.[id]?.length ? ` (${paths[id].map((p: any) => p.name).join(' > ')})` : '')
        );
      })
      .join(' | ');
  } else {
    return locations.map(({ name }: { name: string }) => name).join(' | ');
  }
};

export const getCancellationReason = (asg: any, type: any) => {
  let cancelledReason = '';
  if (asg?.status === 'Revoked' || asg?.status === 'Cancelled') {
    const by = asg?.status === 'Revoked' ? 'School' : 'Site';
    if (type === 'by') return by;
    const reason = asg?.cancellationReason?.[0]?.label
      ? asg?.cancellationReason?.[0]?.label
      : 'Not Specified';
    const note = asg?.notes?.[0] ? ` (${asg.notes[0]})` : '';
    if (type === 'reason') return reason + note;
    const deedBy = asg?.updatedBy ? `Canceled by: ${asg.updatedBy}` : '';
    const deedAt = asg?.updatedAt ? `Canceled On: ${asg.updatedAt}` : '';
    if (type === 'audit') return deedBy + (deedBy && deedAt ? ' | ' : '') + deedAt;
  }
  return cancelledReason;
};

export const getSchedulesExportReport = async (props: GetSchedulesExportReport) => {
  const rows =
    props?.data?.map((schedule: any) => {
      const assignee = schedule?.assignee;

      const hasAssignee = !isEmpty(assignee);

      const isConfirmed = schedule?.policy?.stdCanViewAssignment ?? schedule?.stdCanViewAssignment;

      const isCancelled = ['cancelled', 'revoked'].includes(schedule?.status?.toLowerCase());

      const scheduleStatus = isCancelled
        ? 'Canceled'
        : !hasAssignee
          ? 'To be Scheduled'
          : isConfirmed
            ? 'Confirmed'
            : 'Not Confirmed';

      const byDefaultCompliant =
        (schedule?.policy?.empExempt || schedule?.empExempt) && !schedule?.caas?.group;

      const isNACAAS =
        !schedule?.caas || !schedule?.caas?.groups || schedule?.caas?.groups?.length === 0;

      const isCAASStarted = schedule?.caas?.groups?.some((x: any) => x?.started);

      const onBoardingStatus = byDefaultCompliant
        ? 'Compliant'
        : isNACAAS
          ? 'Not Applicable'
          : schedule?.caas?.compliant
            ? 'Compliant'
            : isCAASStarted
              ? 'Some Action Needed'
              : 'Not Started';

      const locationName = !isEmpty(schedule?.location) ? schedule?.location?.name : '--';

      const ext = schedule?.ext;

      const departmentLevel = !isEmpty(schedule?.location)
        ? getDepartmentUnitNames([schedule?.location], props?.locationPaths)
        : [];

      let avbShifts = schedule?.shifts ?? [];

      const shiftTimings = ext?.shiftTimings;

      let shiftString = '';

      if (
        !schedule?.shifts?.length &&
        (!shiftTimings || !Object.keys(shiftTimings)?.length) &&
        schedule?.availability?.shifts?.length
      ) {
        avbShifts = schedule?.availability?.shifts;

        shiftString = buildShiftString(avbShifts, true, {});
      } else {
        let isShiftPresent = avbShifts?.length > 0 ? true : false;

        if (avbShifts?.length === 0) {
          if (shiftTimings && Object.keys(shiftTimings).length > 0) {
            const stt: any[] = [];
            Object.keys(shiftTimings).map((s) => {
              const timings: any = shiftTimings[s];

              stt.push({
                duration: timings ? getShiftTimingString(timings, props?.clientTimeZone) : '',
                name: s,
              });
            });
            avbShifts = stt;
          }
        }
        shiftString = buildShiftString(avbShifts, isShiftPresent, shiftTimings);
      }

      const daysOfWeekString = buildDaysOfWeekString(
        schedule?.daysInWeek,
        shiftTimings,
        fullDay,
        props?.clientTimeZone
      );

      const gradMonth = schedule?.graduation?.date?.month;

      const { rotationDetailsLabel, courseDetailsLabel } = getRotationAndCourseDetails(schedule);

      if (!schedule?.cancellationReason?.[0]?.label && schedule?.cancellationReasonId) {
        schedule.cancellationReason = [
          {
            id: schedule?.cancellationReasonId,
            label: props.pageData?.cancelReason?.[schedule?.cancellationReasonId],
          },
        ];
      }

      const row: any = {
        'Group Name': schedule?.groupName ?? '',
        'Schedule ID': schedule?.displayId ?? '',
        'Availability Name': schedule?.availability?.name ?? '',
        'Student Details': `${assignee?.firstName ?? ''} ${assignee?.lastName ?? ''}`.trim(),
        'Preceptor Name':
          schedule?.preceptors?.map((prec: any) => prec?.userEmail).join(', ') ?? '',
        'Preceptor Email Address':
          schedule?.preceptors?.map((prec: any) => prec?.userEmail).join(', ') ?? '',
        'School Name': schedule?.oneSchool?.name ?? '',
        'Site Name': schedule?.tenant?.name ?? '',
        'Schedule Duration': `${schedule?.startDate ? moment.utc(schedule?.startDate).format('MMM DD, YYYY') : ''} - ${schedule?.endDate ? moment.utc(schedule?.endDate).format('MMM DD, YYYY') : ''}`,
        'Schedule Status': scheduleStatus ?? '',
        'Onboarding Status': onBoardingStatus ?? '',
        'Student Email Address': assignee?.userEmail ?? '',
        'Location (With Hierarchy)': schedule?.location
          ? getLocationNames([schedule?.location], props?.locationPaths)
          : '',
        'Department/Unit (Level 1)':
          departmentLevel?.length > 0 ? departmentLevel?.[0] : locationName,
        'Department/Unit (Level 2)':
          departmentLevel?.length > 1
            ? departmentLevel?.[1]
            : departmentLevel?.length === 1
              ? locationName
              : '--',
        'Department/Unit (Level 3)': departmentLevel?.length >= 2 ? locationName : '--',
        Discipline: getDisciplineLabels(schedule?.curriculum, props?.pageData?.disciplinesData),
        Specialization: getSpecialisationLabels(
          schedule?.curriculum,
          props?.pageData?.specializationsData
        ),
        'Days of week': daysOfWeekString ?? '',
        'Number of Hours': ext?.numberOfHours ?? '',
        'Rotation Number': ext?.rotationNumbers?.map((r) => r).join(', ') ?? '',
        Semester: ext?.semesters?.map((r) => r).join(', ') ?? '',
        'Graduation Year': schedule?.graduation?.date?.year ?? '',
        'Graduation Month': gradMonth ? getMonthName(Number(gradMonth)) : '',
        Shifts: shiftString ?? '',
        'Program Type': getProgramNames(
          schedule?.programs,
          props?.pageData?.programsData,
          props?.pageData?.disciplinesData
        ),
        'Rotation Details': rotationDetailsLabel ?? '',
        'Course Details': courseDetailsLabel ?? '',
        'Confirmation Pending Duration (Days)':
          !isConfirmed || !hasAssignee ? schedule?.confirmPendingDuration : 'N/A',
        'PRISM Process Status':
          schedule?.prismSync?.status?.toLowerCase() === 'processed'
            ? 'Added to Prism'
            : 'To Be Added',
        'Canceled By': getCancellationReason(schedule, 'by') ?? '',
        'Cancelation Reason': getCancellationReason(schedule, 'reason') ?? '',
        'Cancelation Audit': getCancellationReason(schedule, 'audit') ?? '',
      };

      if (props?.pageData?.organization === ORGANIZATIONS.SITE) {
        delete row?.['Site Name'];

        delete row?.['PRISM Process Status'];

        delete row?.['Confirmation Pending Duration (Days)'];
      }

      if (props?.pageData?.organization === ORGANIZATIONS.SCHOOL) {
        delete row?.['School Name'];
      }

      return row;
    }) ?? [];

  return rows;
};
