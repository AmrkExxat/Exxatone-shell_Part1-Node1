import type { ComposerRecipient, PlacementRow } from './types';

const TAG_RE =
  /@(Recipient first name|Student name|Preceptor name|Clinical instructor name|Faculty name|Group name|Group size|Shift|School|Discipline|Location|Dates|Schedule table)/g;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** "Abbott, Grace" (roster style) and "James Hicks, RN" (with credentials) both read naturally in prose. */
const stripCredentials = (n: string) => n.replace(/(,\s*[A-Z][A-Za-z]{1,4})+$/, (m) => (/^(,\s*[A-Z]{2,5})+$/.test(m) ? '' : m));
export const displayName = (n: string) => {
  const c = stripCredentials(n);
  const [last, first] = c.split(/,\s*/);
  return first ? `${first} ${last}` : c;
};
export const firstName = (n: string) => displayName(n).replace(/^(Dr\.|Prof\.)\s*/, '').split(' ')[0];

const unique = (xs: string[]) => [...new Set(xs.filter(Boolean))];
const joinList = (xs: string[]) => {
  const u = unique(xs);
  return u.length <= 1 ? u[0] ?? '' : u.slice(0, -1).join(', ') + ' and ' + u[u.length - 1];
};

function scheduleTable(rows: PlacementRow[]) {
  const th = 'style="text-align:left;padding:6px 8px;border:1px solid var(--border);background:var(--muted);font-weight:500"';
  const td = 'style="padding:6px 8px;border:1px solid var(--border)"';
  // Group schedules list the cohort; individual ones list the student.
  const group = rows.some((r) => r.group);
  const head = group ? ['Group', 'Students', 'Location', 'Shift', 'Dates'] : ['Student', 'School', 'Discipline', 'Location', 'Dates'];
  const cells = (r: PlacementRow) => (group ? [r.group ?? r.student, String(r.groupSize ?? 1), r.location, r.shift, r.dates] : [r.student, r.school, r.discipline, r.location, r.dates]);
  return (
    `<table style="border-collapse:collapse;width:100%;font-size:13px"><thead><tr>` +
    head.map((h) => `<th ${th}>${h}</th>`).join('') +
    `</tr></thead><tbody>` +
    rows.map((r) => `<tr>${cells(r).map((c) => `<td ${td}>${esc(c)}</td>`).join('')}</tr>`).join('') +
    `</tbody></table>`
  );
}

/** Replace every merge tag with this recipient's real values. */
export function resolveFor(p: ComposerRecipient, html: string): string {
  const rows = p.rows;
  return html.replace(TAG_RE, (_m, tag: string) => {
    switch (tag) {
      case 'Recipient first name':
        return esc(firstName(p.name));
      case 'Student name':
        return esc(joinList(rows.map((r) => displayName(r.student))));
      case 'Preceptor name':
        return esc(joinList(rows.map((r) => r.preceptor)));
      case 'Faculty name':
        return esc(joinList(rows.map((r) => r.faculty)));
      case 'Clinical instructor name':
        return esc(joinList(rows.map((r) => r.clinicalInstructor ?? '')) || 'your clinical instructor');
      case 'Group name':
        return esc(joinList(rows.map((r) => r.group ?? '')) || 'your group');
      case 'Group size':
        return esc(String(rows.reduce((a, r) => a + (r.groupSize ?? 0), 0) || ''));
      case 'Shift':
        return esc(joinList(rows.map((r) => r.shift)));
      case 'School':
        return esc(joinList(rows.map((r) => r.school)));
      case 'Discipline':
        return esc(joinList(rows.map((r) => r.discipline)));
      case 'Location':
        return esc(joinList(rows.map((r) => r.location)));
      case 'Dates':
        return esc(joinList(rows.map((r) => r.dates)));
      case 'Schedule table':
        return scheduleTable(rows);
      default:
        return _m;
    }
  });
}

export const resolveSubjectFor = (p: ComposerRecipient, subject: string) =>
  resolveFor(p, subject).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
