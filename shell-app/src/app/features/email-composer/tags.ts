import { MERGE_TAGS } from './templates';

/**
 * Merge tags are plain text (`@Student name`) in stored subjects and bodies. In the editors they
 * are drawn as coloured chips, always from this one place, so a tag looks the same whether it
 * was picked from the @ list, inserted from the toolbar, typed out in full, or came in with a
 * template or a Leo draft.
 */
const RECIPIENT = 'bg-[#dbeafe] text-[#1e40af]';
const STUDENT = 'bg-[#d1fae5] text-[#065f46]';
const PRECEPTOR = 'bg-[#ede9fe] text-[#5b21b6]';
const INSTRUCTOR = 'bg-[#ffedd5] text-[#9a3412]';
const FACULTY = 'bg-[#fce7f3] text-[#9d174d]';
const GROUP = 'bg-[#ccfbf1] text-[#115e59]';
const PLACEMENT = 'bg-[#fef3c7] text-[#92400e]';
const TABLE = 'bg-[#e2e8f0] text-[#334155]';

export const TAG_STYLE: Record<string, string> = {
  '@Recipient first name': RECIPIENT,
  '@Student name': STUDENT,
  '@Preceptor name': PRECEPTOR,
  '@Clinical instructor name': INSTRUCTOR,
  '@Faculty name': FACULTY,
  '@Group name': GROUP,
  '@Group size': GROUP,
  '@School': PLACEMENT,
  '@Discipline': PLACEMENT,
  '@Location': PLACEMENT,
  '@Dates': PLACEMENT,
  '@Shift': PLACEMENT,
  '@Schedule table': TABLE,
};

export interface TagInfo {
  /** One line, shown in lists and as the chip's hover text. */
  short: string;
  /** What the tag becomes and where the value comes from. */
  long: string;
  /** When the tag only has a value for some schedules. */
  scope?: string;
}

export const TAG_INFO: Record<string, TagInfo> = {
  '@Recipient first name': {
    short: 'First name of whoever gets the email',
    long: 'Each recipient sees their own first name, so one email can greet everyone personally.',
  },
  '@Student name': {
    short: 'The student the email is about',
    long: 'For a student, their own name. For preceptors, clinical instructors and faculty, the student or students they are connected to (a group schedule shows the group and its size).',
  },
  '@Preceptor name': {
    short: 'The site preceptor supervising the placement',
    long: 'The staff member at your site who supervises the student. If there are several, they are listed together.',
  },
  '@Clinical instructor name': {
    short: 'The school instructor leading the group',
    long: 'The school-employed clinical instructor who leads a group rotation on your site.',
    scope: 'Group schedules only. Individual schedules have no clinical instructor.',
  },
  '@Faculty name': {
    short: 'The school faculty member for the placement',
    long: 'The faculty contact at the student’s school, taken from the schedule.',
  },
  '@Group name': {
    short: 'Name of the student group',
    long: 'The cohort name shown on the schedule, for example “Westbrook BSN Fall 2026 - ICU Cohort A”.',
    scope: 'Group schedules only.',
  },
  '@Group size': {
    short: 'How many students are in the group',
    long: 'The number of students in the group. With several groups it adds them up.',
    scope: 'Group schedules only.',
  },
  '@School': { short: 'The student’s school', long: 'The school the student or group comes from, taken from the schedule.' },
  '@Discipline': { short: 'Discipline of the placement', long: 'The discipline on the schedule, such as Nursing or Physical Therapy.' },
  '@Location': { short: 'Unit where the placement happens', long: 'The location or unit on the schedule. If there are several, they are listed together.' },
  '@Dates': { short: 'Placement start and end dates', long: 'The schedule’s dates, written like “Jul 24, 2026 - Oct 08, 2026”.' },
  '@Shift': { short: 'Shift name and hours', long: 'The shift or shifts on the schedule with their hours, for example “Day shift (07:00 - 19:30)”.' },
  '@Schedule table': {
    short: 'A table of each placement',
    long: 'A table with one row per placement. Group schedules list the group, student count, location, shift and dates. Individual schedules list the student, school, discipline, location and dates. Someone on several placements gets all their rows in one email.',
  },
};

const CHIP = 'mtag mx-px inline-block whitespace-nowrap rounded px-1 text-[0.92em] font-medium';
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Longest first, so "@Group name" is never read as a shorter tag. */
export const TAGS_BY_LENGTH = [...MERGE_TAGS].sort((a, b) => b.length - a.length);
const RE = new RegExp('(' + TAGS_BY_LENGTH.map(reEsc).join('|') + ')', 'g');

export const chipHtml = (tag: string) =>
  `<span class="${CHIP} ${TAG_STYLE[tag] ?? TABLE}" data-tag="${tag}" contenteditable="false" role="button" tabindex="0" title="${esc(TAG_INFO[tag]?.short ?? tag)}" aria-label="${tag}, merge tag. ${esc(TAG_INFO[tag]?.short ?? '')}. Press Enter for details.">${tag}</span>`;

export function makeChip(tag: string): HTMLElement {
  const t = document.createElement('template');
  t.innerHTML = chipHtml(tag);
  return t.content.firstElementChild as HTMLElement;
}

/** Stored HTML → editor HTML. */
export const decorateHtml = (html: string) => html.replace(RE, (m) => chipHtml(m));
/** Stored plain text → editor HTML (escaped). */
export const decoratePlain = (text: string) => esc(text).replace(RE, (m) => chipHtml(m));

function plainClone(el: HTMLElement) {
  const c = el.cloneNode(true) as HTMLElement;
  c.querySelectorAll('[data-tag]').forEach((s) => s.replaceWith(document.createTextNode(s.getAttribute('data-tag')!)));
  return c;
}
/** Editor DOM → stored HTML. */
export const serializeHtml = (el: HTMLElement) => plainClone(el).innerHTML;
/** Editor DOM → stored plain text. */
export const serializePlain = (el: HTMLElement) => (plainClone(el).textContent ?? '').replace(/ /g, ' ');

/** Put a chip (and a trailing space) where `range` is, and leave the caret after it. */
export function insertChip(range: Range, tag: string) {
  range.deleteContents();
  const chip = makeChip(tag);
  range.insertNode(chip);
  const space = document.createTextNode(' ');
  chip.after(space);
  const sel = window.getSelection();
  const caret = document.createRange();
  caret.setStart(space, 1);
  caret.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(caret);
}
