import type { EmailTemplateRecord } from '../../config/emailTemplates';
import { EMAIL_TEMPLATE_GROUPS, SCHEDULE_EVENT_KIND } from '../../config/emailTemplates';
import { COMPOSER_ROLE_AUDIENCE } from '../../config/emailAudiences';
import type { ComposerRole } from './types';

export type TemplateKind = 'individual' | 'group' | 'mixed';

export interface ComposerTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
  /** The letter Email Templates marks as the default for this audience. */
  isDefault?: boolean;
  /** Schedules event, used to filter the expanded template list. */
  eventLabel?: string;
  /** Files that come with the template; applying it attaches them. */
  attachments?: { name: string; size: number }[];
}

export const WRITE_YOUR_OWN_ID = 'blank';

export const BLANK_BODY = '<p><br></p>';

/** Merge tags a user can insert; resolved per recipient from the page's placement rows. */
export const MERGE_TAGS = [
  '@Recipient first name',
  '@Student name',
  '@Preceptor name',
  '@Clinical instructor name',
  '@Faculty name',
  '@Group name',
  '@Group size',
  '@Shift',
  '@School',
  '@Discipline',
  '@Location',
  '@Dates',
  '@Schedule table',
];

const blank: ComposerTemplate = { id: WRITE_YOUR_OWN_ID, label: 'Write your own', subject: '', body: BLANK_BODY };

const TOKEN_TAG: Record<string, string> = {
  firstName: '@Recipient first name',
  recipientName: '@Recipient first name',
  preceptorName: '@Preceptor name',
  preceptorFirstName: '@Preceptor name',
  studentName: '@Student name',
  scheduleTable: '@Schedule table',
  groupSummaryTable: '@Schedule table',
  hospitalName: '@Location',
  siteName: '@Location',
  startDate: '@Dates',
};

function applyTokens(value: string): string {
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, token: string) => TOKEN_TAG[token] ?? match);
}

function toComposerBody(body: string): string {
  const mapped = applyTokens(body);
  if (/<[a-z][\s\S]*>/i.test(mapped)) return mapped;
  return mapped
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${part.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function matchesKind(eventId: string, kind: TemplateKind): boolean {
  const eventKind = SCHEDULE_EVENT_KIND[eventId];
  if (!eventKind) return false;
  if (eventKind === 'both' || kind === 'mixed') return true;
  return eventKind === kind;
}

function eventLabel(categoryId: string, eventId: string): string {
  for (const group of EMAIL_TEMPLATE_GROUPS) {
    const category = group.categories.find((item) => item.id === categoryId);
    const event = category?.events.find((item) => item.id === eventId);
    if (event) return event.label;
  }
  return eventId;
}

function toComposerTemplate(template: EmailTemplateRecord): ComposerTemplate {
  return {
    id: template.id,
    label: template.name,
    subject: applyTokens(template.subject),
    body: toComposerBody(template.body),
    isDefault: Boolean(template.composerDefault),
    eventLabel: eventLabel(template.categoryId, template.eventId),
    attachments: template.attachments?.map((file) => ({ name: file.name, size: file.size })),
  };
}

/** Schedules letters for the selected audience, read from Email Templates. Blank Email stays local. */
export function templatesFor(
  templates: EmailTemplateRecord[],
  kind: TemplateKind = 'individual',
): Record<ComposerRole, ComposerTemplate[]> {
  const forRole = (role: ComposerRole): ComposerTemplate[] => {
    const audienceId = COMPOSER_ROLE_AUDIENCE[role];
    const letters = templates
      .filter(
        (template) =>
          template.groupId === 'bulk' &&
          template.categoryId === 'schedules' &&
          template.audienceId === audienceId &&
          matchesKind(template.eventId, kind),
      )
      .sort((a, b) => {
        if (Boolean(a.composerDefault) !== Boolean(b.composerDefault)) return a.composerDefault ? -1 : 1;
        if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map(toComposerTemplate);
    return [...letters, blank];
  };
  return {
    student: forRole('student'),
    instructor: forRole('instructor'),
    preceptor: forRole('preceptor'),
    faculty: forRole('faculty'),
  };
}
