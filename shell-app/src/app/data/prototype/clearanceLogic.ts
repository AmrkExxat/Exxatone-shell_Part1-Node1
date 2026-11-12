import { clearanceChecklist, type ClearanceChecklistItem } from './clearanceChecklist';
import type {
  ClearanceEntry,
  OnboardingStatus,
  PrototypeScheduleRecord,
  SchedulePerson,
} from './scheduleRecords';

type ClearanceRuntime = { items: ClearanceChecklistItem[]; trackingEnabled: boolean };

let runtime: ClearanceRuntime = { items: clearanceChecklist, trackingEnabled: true };

/** The provider binds the saved checklist before its children render. */
export function bindClearanceRuntime(next: ClearanceRuntime) {
  runtime = next;
}

export type ClearanceIconState = 'complete' | 'pending' | 'na';

const ONBOARDING_RANK: Record<OnboardingStatus, number> = {
  'Not Compliant': 0,
  'Some Action Needed': 1,
  'Not Started': 2,
  Compliant: 3,
  'Not Applicable': 4,
};

export function studentsOf(schedule: PrototypeScheduleRecord) {
  return schedule.people.filter((person) => person.role === 'student');
}

export function displayName(schedule: PrototypeScheduleRecord) {
  if (schedule.kind === 'group') return schedule.title || schedule.scheduleId;
  return schedule.people[0]?.name ?? schedule.scheduleId;
}

function conditionValues(item: ClearanceChecklistItem, field: ClearanceChecklistItem['conditions'][number]['field']) {
  return item.conditions.find((condition) => condition.field === field)?.values ?? [];
}

function personFits(item: ClearanceChecklistItem, person: SchedulePerson) {
  const persona = conditionValues(item, 'persona');
  const personaName = person.role === 'ci' ? 'Clinical instructor' : 'Student';
  if (persona.length && !persona.includes(personaName)) return false;
  const employee = conditionValues(item, 'emp');
  if (employee.length && !employee.includes(person.employeeStatus)) return false;
  return true;
}

function fieldsMatch(item: ClearanceChecklistItem, schedule: PrototypeScheduleRecord) {
  const experience = conditionValues(item, 'exp');
  const kind = schedule.kind === 'group' ? 'Group' : 'Individual';
  if (experience.length && !experience.includes(kind)) return false;
  const locations = conditionValues(item, 'loc');
  if (locations.length && !locations.includes(schedule.location)) return false;
  const disciplines = conditionValues(item, 'disc');
  if (disciplines.length && !disciplines.includes(schedule.discipline)) return false;
  const programs = conditionValues(item, 'prog');
  if (programs.length && !programs.includes(schedule.programType)) return false;
  return true;
}

export function scheduleMatches(item: ClearanceChecklistItem, schedule: PrototypeScheduleRecord) {
  return item.active && fieldsMatch(item, schedule);
}

export function itemApplies(item: ClearanceChecklistItem, schedule: PrototypeScheduleRecord) {
  return scheduleMatches(item, schedule);
}

/** People on this schedule who would be checked for the item. Ignores the active flag. */
export function matchedPeople(item: ClearanceChecklistItem, schedule: PrototypeScheduleRecord) {
  if (!fieldsMatch(item, schedule)) return [];
  const people =
    schedule.kind === 'group'
      ? schedule.people.filter((person) => person.role === 'student' || person.role === 'ci')
      : schedule.people.slice(0, 1);
  return people.filter((person) => personFits(item, person));
}

/** Checklist items checked once for the whole group. */
export function groupItems(schedule: PrototypeScheduleRecord) {
  if (schedule.kind !== 'group') return [];
  const members = schedule.people.filter((person) => person.role === 'student' || person.role === 'ci');
  return runtime.items.filter(
    (item) => scheduleMatches(item, schedule) && members.some((person) => personFits(item, person)),
  );
}

export function groupItemSections(schedule: PrototypeScheduleRecord): {
  flat?: ClearanceChecklistItem[];
  students?: ClearanceChecklistItem[];
  instructors?: ClearanceChecklistItem[];
} {
  const items = groupItems(schedule);
  const personas = items.map((item) => conditionValues(item, 'persona'));
  const sectioned = items.length > 0 && personas.every((values) => values.length === 1);
  if (!sectioned) return { flat: items };
  return {
    students: items.filter((item) => conditionValues(item, 'persona')[0] === 'Student'),
    instructors: items.filter((item) => conditionValues(item, 'persona')[0] === 'Clinical instructor'),
  };
}

export function applicableItems(schedule: PrototypeScheduleRecord) {
  return runtime.items.filter((item) => scheduleMatches(item, schedule));
}

export function personItems(schedule: PrototypeScheduleRecord, person: SchedulePerson) {
  if (schedule.kind === 'group') return [];
  return runtime.items.filter((item) => item.active && fieldsMatch(item, schedule) && personFits(item, person));
}

function isDone(entry: ClearanceEntry | undefined) {
  return entry?.status === 'Completed';
}

export function memberClearance(schedule: PrototypeScheduleRecord, person: SchedulePerson) {
  const items = personItems(schedule, person);
  const done = items.filter((item) => isDone(person.clearance[item.id])).length;
  return {
    done,
    total: items.length,
    complete: items.length > 0 && done === items.length,
    na: items.length === 0,
  };
}

export function clearancePeople(schedule: PrototypeScheduleRecord) {
  const people =
    schedule.kind === 'group'
      ? schedule.people.filter((person) => person.role === 'student' || person.role === 'ci')
      : schedule.people.slice(0, 1);
  return people.filter((person) => personItems(schedule, person).length > 0);
}

export function scheduleClearance(schedule: PrototypeScheduleRecord): {
  state: ClearanceIconState;
  done: number;
  total: number;
  members: boolean;
  gDone: number;
  gTotal: number;
} {
  if (!runtime.trackingEnabled || schedule.scheduleStatus !== 'Confirmed') {
    return { state: 'na', done: 0, total: 0, members: false, gDone: 0, gTotal: 0 };
  }
  if (schedule.kind === 'group') {
    const items = groupItems(schedule);
    if (!items.length) {
      return { state: 'na', done: 0, total: 0, members: false, gDone: 0, gTotal: 0 };
    }
    const done = items.filter((item) => isDone(schedule.groupClearance[item.id])).length;
    return {
      state: done === items.length ? 'complete' : 'pending',
      done,
      total: items.length,
      members: false,
      gDone: done,
      gTotal: items.length,
    };
  }
  const member = memberClearance(schedule, schedule.people[0]);
  if (member.na) return { state: 'na', done: 0, total: 0, members: false, gDone: 0, gTotal: 0 };
  return {
    state: member.complete ? 'complete' : 'pending',
    done: member.done,
    total: member.total,
    members: false,
    gDone: 0,
    gTotal: 0,
  };
}

export function memberIconState(
  schedule: PrototypeScheduleRecord,
  person: SchedulePerson,
): ClearanceIconState {
  if (!runtime.trackingEnabled) return 'na';
  if (schedule.kind === 'group') return 'na';
  if (schedule.scheduleStatus !== 'Confirmed') return 'na';
  const member = memberClearance(schedule, person);
  if (member.na) return 'na';
  return member.complete ? 'complete' : 'pending';
}

export function groupOnboardingStatus(schedule: PrototypeScheduleRecord): OnboardingStatus {
  if (schedule.kind === 'individual') return schedule.people[0].onboardingStatus;
  return [...schedule.people].sort(
    (a, b) => ONBOARDING_RANK[a.onboardingStatus] - ONBOARDING_RANK[b.onboardingStatus],
  )[0].onboardingStatus;
}

export function clearanceLabel(state: ClearanceIconState) {
  if (state === 'complete') return 'Cleared';
  if (state === 'pending') return 'Pending';
  return 'Not applicable';
}

/** Icon state as it would be with a different saved checklist. Restores the live checklist afterward. */
export function clearanceIconFor(
  schedule: PrototypeScheduleRecord,
  items: ClearanceChecklistItem[],
  trackingEnabled: boolean,
): ClearanceIconState {
  const previous = runtime;
  runtime = { items, trackingEnabled };
  const state =
    schedule.kind === 'group'
      ? scheduleClearance(schedule).state
      : schedule.people[0]
        ? memberIconState(schedule, schedule.people[0])
        : 'na';
  runtime = previous;
  return state;
}

export function clearanceTip(
  state: ClearanceIconState,
  target: { role?: 'student' | 'ci'; isGroup?: boolean },
) {
  const done = state === 'complete';
  if (target.role === 'ci') return done ? 'Clinical Instructor is cleared' : 'Clinical Instructor Clearance Pending';
  if (target.isGroup) return done ? 'Group is cleared' : 'Group Clearance Pending';
  return done ? 'Student is cleared' : 'Student Clearance Pending';
}
