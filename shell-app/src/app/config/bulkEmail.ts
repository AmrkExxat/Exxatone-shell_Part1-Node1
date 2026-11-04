import { audienceLabel } from './emailAudiences';
import type { ScheduleRecord } from './schedules';
import { contactsForSchool, schoolByName, staffForLocation } from '../data/prototype/directory';
import {
  PROTOTYPE_EMAIL_TEMPLATE_SEEDS,
  prototypeEmailTemplateSeed,
} from '../data/prototype/emailTemplateSeeds';
import {
  PROTOTYPE_GLOBAL_SAMPLE_TOKENS,
  prototypePreviewSamples,
} from '../data/prototype/previewSamples';
import { prototypeSite } from '../data/prototype/site';

export type BulkEmailPersonaId =
  | 'students'
  | 'preceptors'
  | 'sitePersonnel'
  | 'schools'
  | 'facultyCi';

export type BulkEmailPersonaDef = {
  id: BulkEmailPersonaId;
  label: string;
  description: string;
};

export const BULK_EMAIL_PERSONAS: BulkEmailPersonaDef[] = [
  {
    id: 'students',
    label: 'Students',
    description: 'The students on the selected schedules',
  },
  {
    id: 'preceptors',
    label: 'Preceptors',
    description: 'Preceptors at the selected locations',
  },
  {
    id: 'sitePersonnel',
    label: 'Site Personnel',
    description: 'Site staff at the selected locations',
  },
  {
    id: 'schools',
    label: 'Schools',
    description: 'School contacts for the students’ schools',
  },
  {
    id: 'facultyCi',
    label: 'Placement Faculty / CI',
    description: 'Faculty and clinical instructors at those schools',
  },
];

/** Fields available on a recipient's own record, used to resolve merge tokens. */
export type RecipientFieldKey =
  | 'firstName'
  | 'lastName'
  | 'recipientName'
  | 'email'
  | 'studentName'
  | 'startDate'
  | 'onboardingStatus'
  | 'preceptorName'
  | 'preceptorEmail'
  | 'hospitalName'
  | 'loginUrl';

/** One schedule line a recipient is emailed about. Group schedules list one line per student. */
export type BulkEmailScheduleLine = {
  scheduleId: string;
  studentName: string;
  rotation: string;
};

export type BulkEmailRecipient = {
  id: string;
  name: string;
  email: string;
  personaId: BulkEmailPersonaId;
  roleLabel: string;
  details: string[];
  schedules: BulkEmailScheduleLine[];
  fields: Partial<Record<RecipientFieldKey, string>>;
};

/** Per person is the default: one email listing all of that person's schedules. */
export type BulkEmailSendMode = 'perPerson' | 'perSchedule';

/** Sender-side merge fields — not tied to any individual recipient. */
export const MOCK_SENDER = {
  senderName: prototypeSite.senderName,
  senderOrganization: prototypeSite.clinicalEducationName,
  hospitalName: prototypeSite.hospitalName,
  loginUrl: prototypeSite.loginUrl,
};

function slugifyEmail(name: string, domain: string): string {
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

type Contact = { name: string; email: string };

function schoolDomain(schoolName: string): string {
  return schoolByName(schoolName)?.website ?? 'bedlamhospital.org';
}

const PERSONA_ROLE_LABEL: Record<BulkEmailPersonaId, string> = {
  students: 'Student',
  preceptors: 'Preceptor',
  sitePersonnel: 'Site Personnel',
  schools: 'School',
  facultyCi: 'Placement Faculty / CI',
};

function isNamedPerson(value: string): boolean {
  return !['', '—', 'Pending', 'Multiple'].includes(value.trim());
}

function scheduleStudents(row: ScheduleRecord): string[] {
  if (row.memberNames && row.memberNames.length > 0) return row.memberNames;
  return [row.primaryName];
}

function scheduleLines(row: ScheduleRecord, students = scheduleStudents(row)): BulkEmailScheduleLine[] {
  return students.map((studentName) => ({
    scheduleId: row.scheduleId,
    studentName,
    rotation: row.availability,
  }));
}

function contactsForRow(
  row: ScheduleRecord,
  personaId: BulkEmailPersonaId,
): { contact: Contact; lines: BulkEmailScheduleLine[]; detail: string }[] {
  const domain = schoolDomain(row.schoolName);
  switch (personaId) {
    case 'students':
      return scheduleStudents(row).map((name) => ({
        contact: { name, email: slugifyEmail(name, domain) },
        lines: scheduleLines(row, [name]),
        detail: row.schoolName,
      }));
    case 'preceptors':
      return isNamedPerson(row.preceptor)
        ? [
            {
              contact: { name: row.preceptor, email: slugifyEmail(row.preceptor, 'bedlamhospital.org') },
              lines: scheduleLines(row),
              detail: row.location,
            },
          ]
        : [];
    case 'sitePersonnel': {
      const staff = staffForLocation(row.location) ?? {
        name: 'Site Coordinator',
        email: 'clinical.placements@bedlamhospital.org',
      };
      return [{ contact: staff, lines: scheduleLines(row), detail: row.location }];
    }
    case 'schools': {
      const contacts = contactsForSchool(row.schoolName).length
        ? contactsForSchool(row.schoolName)
        : [
        { name: `${row.schoolName} Placement Office`, email: `placements@${domain}` },
      ];
      return contacts.map((contact) => ({
        contact,
        lines: scheduleLines(row),
        detail: row.schoolName,
      }));
    }
    case 'facultyCi':
      return isNamedPerson(row.clinicalInstructor)
        ? [
            {
              contact: {
                name: row.clinicalInstructor,
                email: slugifyEmail(row.clinicalInstructor, domain),
              },
              lines: scheduleLines(row),
              detail: row.schoolName,
            },
          ]
        : [];
    default:
      return [];
  }
}

/** Builds mock recipients for one persona. One person on several schedules is one recipient. */
export function deriveBulkEmailRecipients(
  rows: ScheduleRecord[],
  personaId: BulkEmailPersonaId,
): BulkEmailRecipient[] {
  const byKey = new Map<string, BulkEmailRecipient>();
  for (const row of rows) {
    for (const { contact, lines, detail } of contactsForRow(row, personaId)) {
      const key = `${contact.email.toLowerCase()}|${contact.name.toLowerCase()}`;
      const existing = byKey.get(key);
      if (existing) {
        for (const line of lines) {
          const seen = existing.schedules.some(
            (s) => s.scheduleId === line.scheduleId && s.studentName === line.studentName,
          );
          if (!seen) existing.schedules.push(line);
        }
        if (!existing.details.includes(detail)) existing.details.push(detail);
        continue;
      }
      const [firstName, ...rest] = contact.name.split(' ');
      byKey.set(key, {
        id: `${personaId}-${byKey.size}-${contact.email}`,
        name: contact.name,
        email: contact.email,
        personaId,
        roleLabel: PERSONA_ROLE_LABEL[personaId],
        details: [detail],
        schedules: [...lines],
        fields: {
          firstName,
          lastName: rest.join(' '),
          recipientName: contact.name,
          email: contact.email,
          studentName: lines[0]?.studentName,
          startDate: row.availability,
          onboardingStatus: row.onboardingStatus,
          ...(isNamedPerson(row.preceptor)
            ? {
                preceptorName: row.preceptor,
                preceptorEmail: slugifyEmail(row.preceptor, 'bedlamhospital.org'),
              }
            : {}),
        },
      });
    }
  }
  return [...byKey.values()];
}

export function recipientScheduleCount(recipient: BulkEmailRecipient): number {
  return new Set(recipient.schedules.map((s) => s.scheduleId)).size;
}

export function bulkEmailCount(recipients: BulkEmailRecipient[], mode: BulkEmailSendMode): number {
  if (mode === 'perPerson') return recipients.length;
  return recipients.reduce((sum, r) => sum + Math.max(1, recipientScheduleCount(r)), 0);
}

export type RecipientConflict = {
  kind: 'sharedName' | 'sharedEmail';
  value: string;
  recipientIds: string[];
};

/** Same name with different emails, or one email used by different names. */
export function findRecipientConflicts(recipients: BulkEmailRecipient[]): RecipientConflict[] {
  const byName = new Map<string, BulkEmailRecipient[]>();
  const byEmail = new Map<string, BulkEmailRecipient[]>();
  for (const r of recipients) {
    const name = r.name.trim().toLowerCase();
    const email = r.email.trim().toLowerCase();
    byName.set(name, [...(byName.get(name) ?? []), r]);
    byEmail.set(email, [...(byEmail.get(email) ?? []), r]);
  }
  const conflicts: RecipientConflict[] = [];
  for (const group of byName.values()) {
    if (new Set(group.map((r) => r.email.toLowerCase())).size > 1) {
      conflicts.push({ kind: 'sharedName', value: group[0].name, recipientIds: group.map((r) => r.id) });
    }
  }
  for (const group of byEmail.values()) {
    if (new Set(group.map((r) => r.name.toLowerCase())).size > 1) {
      conflicts.push({ kind: 'sharedEmail', value: group[0].email, recipientIds: group.map((r) => r.id) });
    }
  }
  return conflicts;
}

/** Tokens that exist on the sender/org side, resolvable for every recipient. */
const SENDER_TOKEN_MAP: Record<string, keyof typeof MOCK_SENDER> = {
  senderName: 'senderName',
  senderOrganization: 'senderOrganization',
  hospitalName: 'hospitalName',
  loginUrl: 'loginUrl',
};

/** Tokens resolved straight from the recipient object, not the role-specific fields map. */
const BASE_RECIPIENT_TOKENS = new Set(['firstName', 'lastName', 'recipientName', 'email']);

export type TokenResolution =
  | { status: 'resolved'; value: string }
  | { status: 'missing' };

export function resolveMergeToken(
  recipient: BulkEmailRecipient,
  token: string,
): TokenResolution {
  if (token === 'scheduleTable' || token === 'groupSummaryTable') {
    return { status: 'resolved', value: token };
  }
  if (token === 'schoolName') {
    const schools =
      recipient.personaId === 'facultyCi' || recipient.personaId === 'schools'
        ? [...new Set(recipient.details.map((detail) => detail.trim()).filter(Boolean))]
        : [];
    const value = schools.join(', ');
    return value ? { status: 'resolved', value } : { status: 'missing' };
  }
  if (token === 'preceptorFirstName') {
    const value = recipient.fields.firstName ?? '';
    return value ? { status: 'resolved', value } : { status: 'missing' };
  }
  if (token === 'siteName') {
    return { status: 'resolved', value: MOCK_SENDER.hospitalName };
  }
  if (token in SENDER_TOKEN_MAP) {
    return { status: 'resolved', value: MOCK_SENDER[SENDER_TOKEN_MAP[token]] };
  }
  if (BASE_RECIPIENT_TOKENS.has(token)) {
    const value = recipient.fields[token as RecipientFieldKey] ?? recipient[token as 'name' | 'email'];
    return value ? { status: 'resolved', value: String(value) } : { status: 'missing' };
  }
  const value = recipient.fields[token as RecipientFieldKey];
  if (value) return { status: 'resolved', value };
  if (PROTOTYPE_GLOBAL_SAMPLE_TOKENS.has(token) && prototypePreviewSamples[token]) {
    return { status: 'resolved', value: prototypePreviewSamples[token] };
  }
  return { status: 'missing' };
}

export function extractMergeTokens(text: string): string[] {
  const matches = text.matchAll(/\{\{(\w+)\}\}/g);
  return [...new Set([...matches].map((m) => m[1]))];
}

export const MERGE_FIELD_GROUPS: {
  label: string;
  fields: { label: string; token: string }[];
}[] = [
  {
    label: 'Recipient',
    fields: [
      { label: 'First Name', token: 'firstName' },
      { label: 'Last Name', token: 'lastName' },
      { label: 'Full Name', token: 'recipientName' },
      { label: 'Email', token: 'email' },
    ],
  },
  {
    label: 'Schedule',
    fields: [
      { label: 'Start Date', token: 'startDate' },
      { label: 'Days Until Start', token: 'daysUntilStart' },
      { label: 'Onboarding Status', token: 'onboardingStatus' },
      { label: 'Preceptor Name', token: 'preceptorName' },
      { label: 'Preceptor Email', token: 'preceptorEmail' },
    ],
  },
  {
    label: 'Sender & Organization',
    fields: [
      { label: 'Sender Name', token: 'senderName' },
      { label: 'Sender Organization', token: 'senderOrganization' },
      { label: 'Site / Hospital Name', token: 'hospitalName' },
      { label: 'Login URL', token: 'loginUrl' },
    ],
  },
];

export type BulkEmailTemplate = {
  id: string;
  label: string;
  category: 'Schedules' | 'Onboarding' | 'General';
  roleTag: string;
  subject: string;
  body: string;
};

function bulkTemplateFromSeed(
  id: string,
  category: BulkEmailTemplate['category'],
  roleTag: string,
): BulkEmailTemplate {
  const item = prototypeEmailTemplateSeed(id);
  return {
    id: item.id,
    label: item.name,
    category,
    roleTag,
    subject: item.subject,
    body: item.body,
  };
}

/** One email per preceptor, with every assigned group placement in a table. */
export const PRECEPTOR_GROUP_TEMPLATE: BulkEmailTemplate = bulkTemplateFromSeed(
  'preceptor-group-placement',
  'Schedules',
  'Preceptor',
);

const SITE_GROUP_TEMPLATE: BulkEmailTemplate = bulkTemplateFromSeed(
  'site-group-placement',
  'Schedules',
  'Site Personnel',
);

const CI_GROUP_TEMPLATE: BulkEmailTemplate = bulkTemplateFromSeed(
  'ci-group-onboarding',
  'Schedules',
  'Clinical Instructor',
);

export type GroupedLetterField = { label: string; token: string };

export type GroupedLetter = {
  personaId: BulkEmailPersonaId;
  template: BulkEmailTemplate;
  fields: { label: string; fields: GroupedLetterField[] }[];
};

const recipientNameFields: GroupedLetterField[] = [
  { label: 'First Name', token: 'firstName' },
  { label: 'Last Name', token: 'lastName' },
];
const hospitalField: GroupedLetterField[] = [{ label: 'Site / Hospital Name', token: 'hospitalName' }];
const summaryField: GroupedLetterField[] = [
  { label: 'Group Schedules Summary Table', token: 'groupSummaryTable' },
];

function groupedLetter(
  personaId: BulkEmailPersonaId,
  template: BulkEmailTemplate,
  fields: GroupedLetter['fields'],
): GroupedLetter {
  return { personaId, template, fields };
}

/** Merge fields follow the letter. Each letter is offered for one persona. */
export const GROUPED_LETTERS: GroupedLetter[] = [
  groupedLetter('preceptors', PRECEPTOR_GROUP_TEMPLATE, [
    { label: 'Recipient', fields: [{ label: 'Preceptor First Name', token: 'preceptorFirstName' }] },
    { label: 'Sender & Organization', fields: hospitalField },
    { label: 'Schedule', fields: [{ label: 'Schedule Table (with status)', token: 'scheduleTable' }] },
  ]),
  groupedLetter('sitePersonnel', SITE_GROUP_TEMPLATE, [
    { label: 'Recipient', fields: recipientNameFields },
    { label: 'Sender & Organization', fields: hospitalField },
    { label: 'Group placement', fields: summaryField },
  ]),
  groupedLetter('facultyCi', CI_GROUP_TEMPLATE, [
    { label: 'Recipient', fields: recipientNameFields },
    { label: 'Sender & Organization', fields: hospitalField },
    { label: 'School / Partner', fields: [{ label: 'School Name', token: 'schoolName' }] },
    { label: 'Group placement', fields: summaryField },
  ]),
];

export function groupedLetterFor(
  personaId: BulkEmailPersonaId | null,
  sendMode: BulkEmailSendMode,
  rows: ScheduleRecord[],
): GroupedLetter | null {
  if (sendMode !== 'perPerson' || rows.length === 0 || rows.some((row) => row.kind !== 'group')) {
    return null;
  }
  return GROUPED_LETTERS.find((letter) => letter.personaId === personaId) ?? null;
}

export function isGroupedTemplateId(id: string | null): boolean {
  if (!id) return false;
  return GROUPED_LETTERS.some((letter) => letter.template.id === id);
}

const EXTRA_TOKEN_LABELS: Record<string, string> = {
  preceptorFirstName: 'Preceptor First Name',
  scheduleTable: 'Schedule Table (with status)',
  groupSummaryTable: 'Group Schedules Summary Table',
  schoolName: 'School Name',
};

export function mergeTokenLabel(token: string): string {
  if (token in EXTRA_TOKEN_LABELS) return EXTRA_TOKEN_LABELS[token];
  for (const group of MERGE_FIELD_GROUPS) {
    const field = group.fields.find((item) => item.token === token);
    if (field) return field.label;
  }
  return token;
}

export type ScheduleTableRow = {
  schedule: string;
  scheduleStatus: string;
  onboardingStatus: string;
  location: string;
  availability: string;
  experienceType: string;
  discipline: string;
  dates: string;
  preceptor: string;
  detailsUrl: string;
};

export const SCHEDULE_TABLE_COLUMNS: { key: keyof ScheduleTableRow; label: string }[] = [
  { key: 'schedule', label: 'Schedule' },
  { key: 'scheduleStatus', label: 'Schedule Status' },
  { key: 'onboardingStatus', label: 'Onboarding Status' },
  { key: 'location', label: 'Location' },
  { key: 'availability', label: 'Availability' },
  { key: 'experienceType', label: 'Experience Type' },
  { key: 'discipline', label: 'Discipline & Specialization' },
  { key: 'dates', label: 'Dates' },
  { key: 'preceptor', label: 'Preceptor' },
  { key: 'detailsUrl', label: 'Details' },
];

/** One row per student on the schedules assigned to this recipient. */
export function scheduleTableRows(
  recipient: BulkEmailRecipient,
  rows: ScheduleRecord[],
): ScheduleTableRow[] {
  const byScheduleId = new Map(rows.map((row) => [row.scheduleId, row]));
  return recipient.schedules.map((line) => {
    const row = byScheduleId.get(line.scheduleId);
    return {
      schedule: [line.scheduleId, line.studentName, row?.schoolName].filter(Boolean).join(' · '),
      scheduleStatus: row?.scheduleStatus ?? '—',
      onboardingStatus: row?.onboardingStatus ?? '—',
      location: row?.location ?? '—',
      availability: row?.availability ?? line.rotation,
      experienceType: row?.kind === 'individual' ? 'Individual' : 'Group',
      discipline: row?.discipline ?? '—',
      dates: row?.durationLabel ?? '—',
      preceptor: row && isNamedPerson(row.preceptor) ? row.preceptor : recipient.name,
      detailsUrl: `https://one.exxat.com/${line.scheduleId}`,
    };
  });
}

export type GroupSummaryRow = {
  group: string;
  slotDetails: string;
  members: string;
  overallStatus: string;
  onboardingOverall: string;
  location: string;
  duration: string;
  detailsUrl: string;
};

export const GROUP_SUMMARY_COLUMNS: { key: keyof GroupSummaryRow; label: string }[] = [
  { key: 'group', label: 'Group' },
  { key: 'slotDetails', label: 'Slot Details' },
  { key: 'members', label: 'Group Members' },
  { key: 'overallStatus', label: 'Overall Status' },
  { key: 'onboardingOverall', label: 'Onboarding Overall' },
  { key: 'location', label: 'Location' },
  { key: 'duration', label: 'Duration' },
  { key: 'detailsUrl', label: 'Details' },
];

/** One row per group schedule, with that schedule’s students listed in the row. */
export function groupSummaryRows(
  recipient: BulkEmailRecipient,
  rows: ScheduleRecord[],
): GroupSummaryRow[] {
  const byScheduleId = new Map(rows.map((row) => [row.scheduleId, row]));
  const seen = new Set<string>();
  const summary: GroupSummaryRow[] = [];
  for (const line of recipient.schedules) {
    if (seen.has(line.scheduleId)) continue;
    seen.add(line.scheduleId);
    const row = byScheduleId.get(line.scheduleId);
    const members = recipient.schedules
      .filter((item) => item.scheduleId === line.scheduleId)
      .map((item) => item.studentName);
    const count = members.length;
    const compliant = row?.onboardingStatus === 'Compliant' ? count : 0;
    const instructor =
      row && isNamedPerson(row.clinicalInstructor) ? `, CI: ${row.clinicalInstructor}` : '';
    const shift = row?.shift ? `${row.shift} Shift` : '';
    const days = row?.daysOfWeek ? `(${row.daysOfWeek})` : '';
    summary.push({
      group: row ? `${row.availability} · ${row.schoolName} · ${row.primaryName}` : line.scheduleId,
      slotDetails: `${count} filled, 0 pending${instructor}`,
      members: members.join(', ') || '—',
      overallStatus: row?.scheduleStatus ?? '—',
      onboardingOverall: row
        ? `${compliant} of ${count} compliant (${row.schoolName} requirements)`
        : '—',
      location: row?.location ?? '—',
      duration: row
        ? [row.durationLabel, [shift, days].filter(Boolean).join(' ')].filter(Boolean).join(', ')
        : '—',
      detailsUrl: `https://one.exxat.com/schedules/group/${line.scheduleId}`,
    });
  }
  return summary;
}

const COMPOSE_CATEGORY: Record<string, BulkEmailTemplate['category']> = {
  schedules: 'Schedules',
  onboarding: 'Onboarding',
};

/** Same bulk letters as Email Templates. Grouped letters are included once. */
export const BULK_EMAIL_TEMPLATES: BulkEmailTemplate[] = PROTOTYPE_EMAIL_TEMPLATE_SEEDS.filter(
  (item) => item.groupId === 'bulk',
).map((item) => ({
  id: item.id,
  label: item.name,
  category: COMPOSE_CATEGORY[item.categoryId] ?? 'General',
  roleTag: item.audienceId ? audienceLabel(item.audienceId) : 'Student',
  subject: item.subject,
  body: item.body,
}));

export type HeaderFooterLayoutId =
  | 'none'
  | 'siteHeader'
  | 'exxatFooter'
  | 'siteHeaderExxatFooter'
  | 'shareProfileSiteHeaderExxatFooter';

export type EmailHeaderLogo = 'site' | 'shareProfileSite' | null;

export type HeaderFooterLayout = {
  id: HeaderFooterLayoutId;
  label: string;
  header: EmailHeaderLogo;
  exxatFooter: boolean;
};

export const HEADER_FOOTER_LAYOUTS: HeaderFooterLayout[] = [
  { id: 'none', label: 'No logos on header and footer', header: null, exxatFooter: false },
  { id: 'siteHeader', label: 'Site logo on the header', header: 'site', exxatFooter: false },
  { id: 'exxatFooter', label: 'Exxat logo on the footer', header: null, exxatFooter: true },
  {
    id: 'siteHeaderExxatFooter',
    label: 'Site logo on the header and Exxat logo on the footer',
    header: 'site',
    exxatFooter: true,
  },
  {
    id: 'shareProfileSiteHeaderExxatFooter',
    label: 'Share Profile Site logo on the header and Exxat logo on the footer',
    header: 'shareProfileSite',
    exxatFooter: true,
  },
];

export function getHeaderFooterLayout(id: HeaderFooterLayoutId): HeaderFooterLayout {
  return HEADER_FOOTER_LAYOUTS.find((l) => l.id === id) ?? HEADER_FOOTER_LAYOUTS[0];
}
