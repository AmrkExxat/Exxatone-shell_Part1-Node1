import moment from 'moment';
import { faCalendarRange, IconDefinition } from '@fortawesome/pro-light-svg-icons';

export interface AllSchedulesFilterQuery {
  filters: any;
  urlFilter: string;
  searchText: string;
  searchType: string;
}

export enum AllSchedulesSearchAttribute {
  DisplayId = 'DisplayId',
  RequestId = 'requestId',
  GroupName = 'Group',
  StudentName = 'Student',
  FacultyName = 'Faculty',
  PreceptorName = 'Preceptor',
  AvailabilityName = '',
  LocationName = 'Location',
}

export const schedulesFieldKeyObj: any = {
  col_assignee: 'assignee.firstName',
  col_schedule_duration: 'startDate',
  col_availability: 'availability.name',
  col_preceptor: 'preceptors.firstName',
  col_clinical_instructor: 'faculties.firstName',
};

// Base search attributes common to all projects. Projects may extend this with
// additional entries (e.g. Location for Rubix, Sites for Network).
export const baseFilterSearchAttributes = [
  { id: 'DisplayId', label: 'Schedule ID' },
  { id: 'requestId', label: 'Request ID' },
  { id: 'Group', label: 'Group Name' },
  { id: 'Student', label: 'Student Name' },
  { id: 'Faculty', label: 'Clinical Instructor' },
  { id: 'Preceptor', label: 'Preceptor Name' },
  { id: '', label: 'Availability Name' },
];

export const scheduleStatusOptions = [
  { id: 'Cancelled', value: 'Cancelled', label: 'Canceled' },
  { id: 'Confirmed', value: 'Confirmed', label: 'Confirmed' },
  { id: 'Not Confirmed', value: 'Un-Confirmed', label: 'Not Confirmed' },
  { id: 'To Be Scheduled', value: 'Un-Scheduled', label: 'To Be Scheduled' },
];

export const getCustomDateRangeFilter = (
  filterState: any,
  id: string = 'startIn',
  label: string = 'Starting in',
  icon: IconDefinition = faCalendarRange,
  minDateReq: boolean = true,
  disableId: string | null = null
) => {
  const _filter: any = {
    id,
    type: 'customDateRangePicker',
    label,
    options: [
      { id: 'next_30_days', label: 'Next 30 days', value: 'next_30_days' },
      { id: 'next_60_days', label: 'Next 60 days', value: 'next_60_days' },
      { id: 'next_90_days', label: 'Next 90 days', value: 'next_90_days' },
      { id: 'custom_range', label: 'Custom Date Range', value: 'custom_range' },
    ],
    defaultValue: filterState?.[id] ?? {},
    icon,
    hidden: true,
    extraFilter: true,
  };

  if (minDateReq) {
    _filter.minDate = moment()?.add('1', 'days')?.toDate();
  }

  if (disableId) {
    _filter.disableId = disableId;
  }

  return _filter;
};

export const fetchOptionsForOnBoardingStatus = async (_query: any) => {
  return {
    data: [
      {
        id: 'Compliant',
        value: 'Compliant',
        label: 'Compliant',
        hasChildren: false,
      },
      {
        id: 'Non-Compliant',
        value: 'Non-Compliant',
        label: 'Non-Compliant',
        hasChildren: true,
        children: [
          {
            id: 'Some Action Needed',
            value: 'Some Action Needed',
            label: 'Some Action Needed',
            hasChildren: false,
            children: [],
          },
          {
            id: 'Not Started',
            value: 'Not Started',
            label: 'Not Started',
            hasChildren: false,
            children: [],
          },
        ],
      },
      {
        id: 'NA',
        value: 'NA',
        label: 'Not Applicable',
        hasChildren: false,
        children: [],
      },
    ],
    totalCount: 3,
  };
};

export const fetchHasSchoolRequirementOptions = async (_query: any) => {
  return {
    data: [
      {
        id: 'yes',
        value: 'yes',
        label: 'Yes',
        hasChildren: true,
        children: [
          {
            id: 'Non-Compliant',
            value: 'Non-Compliant',
            label: 'Pending',
            hasChildren: false,
            children: [],
          },
          {
            id: 'Compliant',
            value: 'Compliant',
            label: 'Completed',
            hasChildren: false,
            children: [],
          },
        ],
      },
    ],
    totalCount: 1,
  };
};

export const buildProgramsFilter = (
  programsType: any[],
  programLookup: any[]
): Array<{ programId: string; subPrograms?: string[] }> => {
  const groupedPrograms = new Map<string, { subPrograms: Set<string> }>();

  const ensureParent = (programId: string) => {
    if (!groupedPrograms.has(programId)) {
      groupedPrograms.set(programId, { subPrograms: new Set<string>() });
    }
  };

  for (const p of programsType) {
    const selectionValue = typeof p === 'string' ? p : (p?.id ?? p?.value ?? p?.programId ?? null);
    if (!selectionValue) continue;

    const parentOption = programLookup.find(
      (option: any) => option.id === selectionValue || option.value === selectionValue
    );

    if (parentOption) {
      const selectedChildren = Array.isArray(p?.children) ? p.children : [];

      for (const parentId of parentOption?.ids ?? []) {
        ensureParent(parentId);
        const parentEntry = groupedPrograms.get(parentId)!;

        for (const childSelection of selectedChildren) {
          const childValue =
            typeof childSelection === 'string'
              ? childSelection
              : (childSelection?.id ?? childSelection?.value ?? childSelection?.programId ?? null);
          if (!childValue) continue;

          const matchedChild = (parentOption?.children ?? []).find(
            (child: any) => child.id === childValue || child.value === childValue
          );
          for (const childId of matchedChild?.ids ?? [childValue]) {
            parentEntry.subPrograms.add(childId);
          }
        }
      }
      continue;
    }

    let matchedParent: any = null;
    let matchedChild: any = null;

    for (const rootOption of programLookup) {
      const childOption = (rootOption?.children ?? []).find(
        (child: any) => child.id === selectionValue || child.value === selectionValue
      );
      if (childOption) {
        matchedParent = rootOption;
        matchedChild = childOption;
        break;
      }
    }

    if (matchedParent && matchedChild) {
      for (const parentId of matchedParent?.ids ?? []) {
        ensureParent(parentId);
        const parentEntry = groupedPrograms.get(parentId)!;
        for (const childId of matchedChild?.ids ?? []) {
          parentEntry.subPrograms.add(childId);
        }
      }
      continue;
    }

    ensureParent(selectionValue);
  }

  return Array.from(groupedPrograms.entries()).map(([programId, groupData]) => ({
    programId,
    ...(groupData.subPrograms.size > 0 ? { subPrograms: Array.from(groupData.subPrograms) } : {}),
  }));
};

export const mapOnboardingStatus = (statusValue: string): string => {
  if (statusValue === 'Some Action Needed') return 'Started';
  if (statusValue === 'Not Started') return 'Not-Started';
  return statusValue;
};

export const getCurriculumFilters = (
  curriculum: any[] = []
): { disciplines: string[]; specializations: string[] } => {
  const { disciplines, specializations } = curriculum.reduce(
    (acc, item) => {
      if (item?.id) {
        acc.disciplines.add(item.id);
      }

      item?.children?.forEach((child: any) => {
        if (child?.id) {
          acc.specializations.add(child.id);
        }
      });

      return acc;
    },
    {
      disciplines: new Set<string>(),
      specializations: new Set<string>(),
    }
  );

  return {
    disciplines: [...disciplines],
    specializations: [...specializations],
  };
};
