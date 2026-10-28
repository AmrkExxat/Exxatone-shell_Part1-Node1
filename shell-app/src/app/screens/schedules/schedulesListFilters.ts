import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Building2,
  CalendarClock,
  ListChecks,
  ListTodo,
  Map,
  MapPin,
  Users,
} from 'lucide-react';
import type { ScheduleListKind } from '../../config/schedules';

export type ScheduleFilterFacetId =
  | 'scheduleType'
  | 'schools'
  | 'discipline'
  | 'dates'
  | 'locations'
  | 'locationGroups'
  | 'scheduleStatus'
  | 'onboardingStatus'
  | 'groupOnboardingStatus';

export type ScheduleFilterFacetDef = {
  id: ScheduleFilterFacetId;
  label: string;
  icon: LucideIcon;
};

export const SCHEDULE_FILTER_FACETS: Record<ScheduleFilterFacetId, ScheduleFilterFacetDef> = {
  scheduleType: { id: 'scheduleType', label: 'Schedule Type', icon: Users },
  schools: { id: 'schools', label: 'Schools', icon: Building2 },
  discipline: { id: 'discipline', label: 'Discipline / Specialization', icon: BookOpen },
  dates: { id: 'dates', label: 'Start & End Date', icon: CalendarClock },
  locations: { id: 'locations', label: 'Locations', icon: MapPin },
  locationGroups: { id: 'locationGroups', label: 'Location Groups', icon: Map },
  scheduleStatus: { id: 'scheduleStatus', label: 'Schedule Status', icon: ListChecks },
  onboardingStatus: { id: 'onboardingStatus', label: 'Onboarding Status', icon: ListTodo },
  groupOnboardingStatus: {
    id: 'groupOnboardingStatus',
    label: 'Group Onboarding Status',
    icon: ListTodo,
  },
};

export type SchedulesListFilterConfig = {
  searchScopeLabel: string;
  searchPlaceholder: string;
  /** Always on the first line, beside the search combo. */
  inlineIds: ScheduleFilterFacetId[];
  /** Collapsed behind "+N more"; revealed on a second line when expanded. */
  overflowIds: ScheduleFilterFacetId[];
};

export const schedulesListFilterConfig: Record<ScheduleListKind, SchedulesListFilterConfig> = {
  group: {
    searchScopeLabel: 'Availability…',
    searchPlaceholder: 'Search by Availability N…',
    inlineIds: ['schools', 'discipline', 'dates', 'locationGroups'],
    overflowIds: ['groupOnboardingStatus'],
  },
  all: {
    searchScopeLabel: 'Schedule ID',
    searchPlaceholder: 'Search by Schedule ID',
    inlineIds: ['scheduleType', 'discipline', 'schools', 'dates', 'locations'],
    overflowIds: ['scheduleStatus', 'onboardingStatus'],
  },
  individual: {
    searchScopeLabel: 'Schedule ID',
    searchPlaceholder: 'Search by Schedule ID',
    inlineIds: ['discipline', 'schools', 'dates', 'locations'],
    overflowIds: ['scheduleStatus', 'onboardingStatus'],
  },
};
