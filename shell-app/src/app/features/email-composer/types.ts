/**
 * Email composer contract.
 *
 * Any page opens the composer by handing it a `ComposerContext` (who can be emailed, what
 * each person is attached to, and who is sending). The composer owns the UI; pages only
 * write a small adapter that maps their rows to `ComposerRecipient`s — see adapters/.
 */

export type ComposerRole = 'student' | 'instructor' | 'preceptor' | 'faculty';

export const COMPOSER_ROLES: ComposerRole[] = ['student', 'instructor', 'preceptor', 'faculty'];

export const ROLE_LABEL: Record<ComposerRole, string> = {
  student: 'Students',
  instructor: 'Clinical instructors',
  preceptor: 'Preceptors',
  faculty: 'School faculty',
};

/** One placement a recipient is on. Drives merge fields and the @Schedule table. */
export interface PlacementRow {
  student: string;
  preceptor: string;
  faculty: string;
  school: string;
  discipline: string;
  location: string;
  /** Pre-formatted, e.g. "Jan 12 – Mar 6, 2027" */
  dates: string;
  /** e.g. "Day shift (07:00 - 19:30)". */
  shift: string;
  /** Group schedules only: the cohort's name, its size and its school clinical instructor. */
  group?: string;
  groupSize?: number;
  clinicalInstructor?: string;
  /** Schedule number, e.g. "6428003". */
  scheduleId?: string;
  /** Rotation name, e.g. "Emergency Nursing Clinical". */
  rotation?: string;
  /** Students on this schedule. Group rows list the cohort; individual rows list the one student. */
  students?: string[];
}

export interface ComposerRecipient {
  id: string;
  role: ComposerRole;
  name: string;
  email: string;
  /** Placements this person is on; a recipient with several gets one email listing them. */
  rows: PlacementRow[];
  /** e.g. "Emailed Oct 28" — lets the user skip people who already got this email. */
  lastEmailed?: string;
}

export interface ComposerBrand {
  name: string;
  unit: string;
  address: string;
  contact: string;
}

/** A file on the email, either added by the user or brought in by a template. */
export interface Attachment {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  fromTemplate?: boolean;
}

export interface ComposerHistoryItem {
  id: string;
  role: ComposerRole;
  subject: string;
  /** HTML body as it was sent. */
  body: string;
  /** Pre-formatted, e.g. "Oct 28, 2026 · 9:00 AM" */
  sentAt: string;
  sentBy: string;
  /** Who it went to, e.g. "12 students". */
  audience: string;
  status: 'Sent' | 'Scheduled' | 'Failed';
  note?: string;
}

export interface ComposerContext {
  /** Page the composer was opened from, e.g. "Schedules". */
  source: string;
  /**
   * What the handed-over rows are. Group schedules are cohorts (many students, a clinical
   * instructor); individual ones are one student with a preceptor. It picks the templates.
   */
  kind?: 'individual' | 'group' | 'mixed';
  /** What was handed over, e.g. "6 schedules selected". */
  subtitle?: string;
  recipients: ComposerRecipient[];
  /** Earlier emails relevant to this page's recipients, newest first. */
  history?: ComposerHistoryItem[];
  /** Opens the composer with this message already in place (e.g. from the history drawer). */
  prefill?: { role: ComposerRole; subject: string; body: string };
  sender: {
    name: string;
    /** Address the email is sent from. */
    email: string;
    replyTo: string;
    /** Address the "Send me a copy" option uses. */
    me: string;
    brand: ComposerBrand;
  };
}

export const emailProblem = (p: Pick<ComposerRecipient, 'email'>): '' | 'No email address' | 'Invalid email' =>
  !p.email.trim() ? 'No email address' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()) ? '' : 'Invalid email';

/** Group schedule row with no students on the roster yet — not emailable on its own. */
export function isEmptyGroupScheduleRow(row: PlacementRow): boolean {
  return Boolean(row.group) && (row.students?.length ?? 0) === 0;
}

/** Recipient exists only on empty group schedule(s), e.g. preceptor assigned before roster is filled. */
export function isEmptyRosterRecipient(p: ComposerRecipient): boolean {
  return p.rows.length > 0 && p.rows.every(isEmptyGroupScheduleRow);
}

export function sendableScheduleRows(rows: PlacementRow[]): PlacementRow[] {
  return rows.filter((row) => !isEmptyGroupScheduleRow(row));
}

export type AttentionKind = 'missing-email' | 'no-students' | 'multi' | 'already';

/** Why a recipient may need a look before the email goes out. */
export function attentionOf(person: ComposerRecipient): AttentionKind[] {
  const kinds: AttentionKind[] = [];
  if (emailProblem(person)) kinds.push('missing-email');
  if (person.rows.some(isEmptyGroupScheduleRow)) kinds.push('no-students');
  if (sendableScheduleRows(person.rows).length > 1) kinds.push('multi');
  if (person.lastEmailed) kinds.push('already');
  return kinds;
}
