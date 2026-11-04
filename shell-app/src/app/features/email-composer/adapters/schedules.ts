import type { ScheduleRecord } from '../../../config/schedules';
import { schoolByName } from '../../../data/prototype/directory';
import { prototypeSite } from '../../../data/prototype/site';
import type { ComposerContext, ComposerRecipient, PlacementRow } from '../types';
import { sampleHistory, siteSender } from './shared';

function personEmail(name: string, domain: string): string {
  const slug = name
    .replace(/,.*$/, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('.');
  return `${slug}@${domain}`;
}

function isNamed(value: string): boolean {
  return !['', '—', 'Pending', 'Multiple'].includes(value.trim());
}

function studentEmail(name: string, schoolName: string, fallback?: string): string {
  if (name === 'Destiny Robinson') return '';
  if (fallback && fallback.includes('@')) return fallback;
  return personEmail(name, schoolByName(schoolName)?.website ?? 'bedlamhospital.org');
}

/**
 * Page adapter: this prototype's schedule rows → composer context.
 * Group rows are Nursing cohorts. Individual rows are Physical Therapy students.
 */
export function buildScheduleContext(rows: ScheduleRecord[], siteName: string): ComposerContext {
  const placementFor = (row: ScheduleRecord, studentLabel: string): PlacementRow => ({
    student: studentLabel,
    preceptor: isNamed(row.preceptor) ? row.preceptor : '',
    faculty: schoolByName(row.schoolName)?.contacts[0]?.name ?? '',
    school: row.schoolName,
    discipline: row.discipline,
    location: row.location,
    dates: row.durationLabel,
    shift: [row.shift ? `${row.shift} shift` : '', row.daysOfWeek].filter(Boolean).join(' · '),
    scheduleId: row.scheduleId,
    rotation: row.availability,
    students: row.kind === 'group' ? row.memberNames ?? [] : [studentLabel],
    ...(row.kind === 'group'
      ? {
          group: row.primaryName,
          groupSize: row.memberNames?.length ?? 0,
          clinicalInstructor: isNamed(row.clinicalInstructor) ? row.clinicalInstructor : undefined,
        }
      : {
          clinicalInstructor: isNamed(row.clinicalInstructor) ? row.clinicalInstructor : undefined,
        }),
  });

  const aboutLabel = (row: ScheduleRecord) =>
    row.kind === 'group'
      ? `${row.primaryName}`
      : row.primaryName;

  const people = new Map<string, ComposerRecipient>();
  const add = (
    role: ComposerRecipient['role'],
    person: { name: string; email: string },
    placement: PlacementRow,
  ) => {
    if (!person.name.trim()) return;
    const key = `${role}:${person.email || person.name}`;
    const existing = people.get(key);
    if (existing) existing.rows.push(placement);
    else people.set(key, { id: key, role, name: person.name, email: person.email, rows: [placement] });
  };

  rows.forEach((row) => {
    const domain = schoolByName(row.schoolName)?.website ?? 'bedlamhospital.org';
    if (row.kind === 'group') {
      (row.memberNames ?? []).forEach((name) =>
        add('student', { name, email: studentEmail(name, row.schoolName) }, placementFor(row, name)),
      );
    } else {
      add(
        'student',
        { name: row.primaryName, email: studentEmail(row.primaryName, row.schoolName, row.primarySubline) },
        placementFor(row, row.primaryName),
      );
    }
    const about = placementFor(row, aboutLabel(row));
    if (isNamed(row.preceptor)) {
      add('preceptor', { name: row.preceptor, email: personEmail(row.preceptor, 'bedlamhospital.org') }, about);
    }
    if (isNamed(row.clinicalInstructor)) {
      add('instructor', { name: row.clinicalInstructor, email: personEmail(row.clinicalInstructor, domain) }, about);
    }
    const faculty = schoolByName(row.schoolName)?.contacts[0];
    if (faculty) add('faculty', { name: faculty.name, email: faculty.email }, about);
  });

  const list = [...people.values()];
  const n = (role: ComposerRecipient['role']) => list.filter((person) => person.role === role).length;
  const plural = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
  const groups = rows.filter((row) => row.kind === 'group');
  const individuals = rows.length - groups.length;
  const kind: ComposerContext['kind'] = groups.length && individuals ? 'mixed' : groups.length ? 'group' : 'individual';
  const subtitle =
    kind === 'group'
      ? `${plural(groups.length, 'group schedule', 'group schedules')} · ${plural(n('student'), 'student', 'students')}`
      : kind === 'individual'
        ? `${plural(rows.length, 'individual schedule', 'individual schedules')}`
        : `${plural(groups.length, 'group', 'groups')} and ${plural(individuals, 'individual schedule', 'individual schedules')}`;

  return {
    history: sampleHistory({ plural, n, siteName: siteName || prototypeSite.name, grouped: groups.length > 0 }),
    source: 'Schedules',
    kind,
    subtitle,
    recipients: list,
    sender: siteSender(siteName || prototypeSite.name),
  };
}
