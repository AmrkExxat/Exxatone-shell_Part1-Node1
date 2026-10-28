import type { ScheduleRecord } from './schedules';

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

export type BulkEmailRecipient = {
  id: string;
  name: string;
  email: string;
  personaId: BulkEmailPersonaId;
  roleLabel: string;
  details: string[];
  fields: Partial<Record<RecipientFieldKey, string>>;
};

/** Sender-side merge fields — not tied to any individual recipient. */
export const MOCK_SENDER = {
  senderName: 'Kierra Mango',
  senderOrganization: 'MedStar Health Clinical Education',
  hospitalName: 'MedStar Health',
  loginUrl: 'https://app.exxat.com/login',
};

function slugifyEmail(name: string, domain: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('.');
  return `${slug}@${domain}`;
}

function domainForSchool(schoolName: string): string {
  const slug = schoolName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('');
  const isAcademic = /university|college|school/i.test(schoolName);
  return `${slug}.${isAcademic ? 'edu' : 'org'}`;
}

function uniqueBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

/** Builds mock recipients for one persona from the selected schedule rows. */
export function deriveBulkEmailRecipients(
  rows: ScheduleRecord[],
  personaId: BulkEmailPersonaId,
): BulkEmailRecipient[] {
  if (rows.length === 0) return [];

  switch (personaId) {
    case 'students': {
      const unique = uniqueBy(rows, (r) => r.primaryName);
      return unique.map((row, i) => {
        const domain = domainForSchool(row.schoolName);
        const email = slugifyEmail(row.primaryName, domain);
        return {
          id: `student-${i}-${row.primaryName}`,
          name: row.primaryName,
          email,
          personaId,
          roleLabel: row.kind === 'group' ? 'Group' : 'Student',
          details: [row.schoolName],
          fields: {
            firstName: row.primaryName.split(' ')[0],
            lastName: row.primaryName.split(' ').slice(1).join(' '),
            recipientName: row.primaryName,
            email,
            studentName: row.primaryName,
            startDate: row.availability,
            onboardingStatus: row.onboardingStatus,
            preceptorName: row.preceptor,
            preceptorEmail: slugifyEmail(row.preceptor, domainForSchool(row.schoolName)),
          },
        };
      });
    }
    case 'preceptors': {
      const unique = uniqueBy(rows, (r) => r.preceptor);
      return unique.map((row, i) => {
        const domain = domainForSchool(row.schoolName);
        const email = slugifyEmail(row.preceptor, domain);
        return {
          id: `preceptor-${i}-${row.preceptor}`,
          name: row.preceptor,
          email,
          personaId,
          roleLabel: 'Preceptor',
          details: [`${row.schoolName} – ${row.discipline}`],
          fields: {
            firstName: row.preceptor.split(' ')[0],
            lastName: row.preceptor.split(' ').slice(1).join(' '),
            recipientName: row.preceptor,
            email,
          },
        };
      });
    }
    case 'sitePersonnel': {
      const schools = uniqueBy(rows, (r) => r.schoolName);
      return schools.map((row, i) => {
        const domain = domainForSchool(row.schoolName);
        const name = `Site Coordinator – ${row.location}`;
        const email = slugifyEmail(`site.coordinator.${i}`, domain);
        return {
          id: `site-${i}-${row.schoolName}`,
          name,
          email,
          personaId,
          roleLabel: 'Site Personnel',
          details: [row.location],
          fields: {
            firstName: 'Site',
            lastName: 'Coordinator',
            recipientName: name,
            email,
          },
        };
      });
    }
    case 'schools': {
      const schools = uniqueBy(rows, (r) => r.schoolName);
      return schools.map((row, i) => {
        const domain = domainForSchool(row.schoolName);
        const name = `${row.schoolName} Clinical Placement Office`;
        const email = slugifyEmail(`placements.${i}`, domain);
        return {
          id: `school-${i}-${row.schoolName}`,
          name,
          email,
          personaId,
          roleLabel: 'School',
          details: [row.schoolName],
          fields: {
            firstName: 'Clinical',
            lastName: 'Placement Office',
            recipientName: name,
            email,
          },
        };
      });
    }
    case 'facultyCi': {
      const unique = uniqueBy(rows, (r) => r.clinicalInstructor);
      return unique.map((row, i) => {
        const domain = domainForSchool(row.schoolName);
        const email = slugifyEmail(row.clinicalInstructor, domain);
        return {
          id: `faculty-${i}-${row.clinicalInstructor}`,
          name: row.clinicalInstructor,
          email,
          personaId,
          roleLabel: 'Placement Faculty / CI',
          details: [row.schoolName],
          fields: {
            firstName: row.clinicalInstructor.split(' ')[0],
            lastName: row.clinicalInstructor.split(' ').slice(1).join(' '),
            recipientName: row.clinicalInstructor,
            email,
          },
        };
      });
    }
    default:
      return [];
  }
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
  if (token in SENDER_TOKEN_MAP) {
    return { status: 'resolved', value: MOCK_SENDER[SENDER_TOKEN_MAP[token]] };
  }
  if (BASE_RECIPIENT_TOKENS.has(token)) {
    const value = recipient.fields[token as RecipientFieldKey] ?? recipient[token as 'name' | 'email'];
    return value ? { status: 'resolved', value: String(value) } : { status: 'missing' };
  }
  const value = recipient.fields[token as RecipientFieldKey];
  return value ? { status: 'resolved', value } : { status: 'missing' };
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

export const BULK_EMAIL_TEMPLATES: BulkEmailTemplate[] = [
  {
    id: 'schedule-confirmed',
    label: 'Schedule Confirmed',
    category: 'Schedules',
    roleTag: 'Student',
    subject: 'Your clinical schedule has been confirmed',
    body: `Dear {{firstName}},\n\nYour clinical rotation at {{hospitalName}} has been confirmed, starting {{startDate}}.\n\nYour preceptor is {{preceptorName}} ({{preceptorEmail}}).\n\nBest regards,\n{{senderName}}`,
  },
  {
    id: 'schedule-updated',
    label: 'Schedule Updated',
    category: 'Schedules',
    roleTag: 'Student',
    subject: 'Your clinical schedule has been updated',
    body: `Dear {{firstName}},\n\nYour clinical rotation details at {{hospitalName}} have changed. Please review your updated start date: {{startDate}}.\n\nQuestions? Contact {{preceptorName}} at {{preceptorEmail}}.\n\nBest regards,\n{{senderName}}`,
  },
  {
    id: 'rotation-starting-soon',
    label: 'Rotation Starting Soon',
    category: 'Schedules',
    roleTag: 'Student',
    subject: 'Reminder: your clinical rotation begins {{daysUntilStart}} days from now',
    body: `Dear {{recipientName}},\nThis is a friendly reminder that your clinical rotation at {{hospitalName}} begins on {{startDate}} — just {{daysUntilStart}} days away.\nBefore you arrive, please make sure you have:\nCompleted all onboarding checklist items in Exxat One\nUploaded required documents (immunization records, background check, etc.)\nReviewed the orientation materials provided\nConfirmed your schedule with your school coordinator\nYour onboarding completion status: {{onboardingStatus}}\nQuestions? Contact {{preceptorName}} at {{preceptorEmail}}.\nBest regards,\n{{senderName}}`,
  },
  {
    id: 'welcome-onboarding',
    label: 'Welcome to Onboarding',
    category: 'Onboarding',
    roleTag: 'Student',
    subject: 'Welcome to your onboarding checklist',
    body: `Hi {{firstName}},\n\nWelcome! Please complete your onboarding checklist before {{startDate}}.\n\nLog in here: {{loginUrl}}\n\nThanks,\n{{senderName}}`,
  },
  {
    id: 'incomplete-documents',
    label: 'Incomplete Documents Reminder',
    category: 'Onboarding',
    roleTag: 'Student',
    subject: 'Action needed: incomplete onboarding documents',
    body: `Hi {{firstName}},\n\nYour onboarding status is currently {{onboardingStatus}}. A few documents are still missing — please log in to Exxat One ({{loginUrl}}) to finish before {{startDate}}.\n\nThanks,\n{{senderName}}`,
  },
  {
    id: 'onboarding-complete',
    label: 'Onboarding Complete – Cleared to Start',
    category: 'Onboarding',
    roleTag: 'Student',
    subject: 'You’re cleared to start your rotation',
    body: `Hi {{firstName}},\n\nGreat news — your onboarding is complete and you’re cleared to begin at {{hospitalName}} on {{startDate}}.\n\nSee you soon,\n{{senderName}}`,
  },
  {
    id: 'request-availability',
    label: 'Request Availability',
    category: 'General',
    roleTag: 'Preceptor',
    subject: 'Please confirm your availability',
    body: `Hi {{firstName}},\n\nCould you confirm your availability for upcoming student placements at {{hospitalName}}?\n\nThanks,\n{{senderName}}`,
  },
  {
    id: 'schedule-published-preceptor',
    label: 'Schedule Published — Preceptor Assignment',
    category: 'General',
    roleTag: 'Preceptor',
    subject: 'New student assignment published',
    body: `Hi {{firstName}},\n\nA new student schedule has been published for your review at {{hospitalName}}.\n\nLog in to review: {{loginUrl}}\n\nThanks,\n{{senderName}}`,
  },
];

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
