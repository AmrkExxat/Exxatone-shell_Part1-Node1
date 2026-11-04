import type { BulkEmailRecipient, HeaderFooterLayoutId } from './bulkEmail';
import { audienceLabel, type EmailAudienceId } from './emailAudiences';
import { prototypePreviewSamples } from '../data/prototype/previewSamples';
import { prototypeSite } from '../data/prototype/site';

export type EmailTemplateGroupId = 'automated' | 'bulk';

export type EmailTemplateKind = 'standard' | 'customized';

export type EmailTemplateHistoryType = 'created' | 'edited' | 'set_default' | 'cloned';

export type EmailTemplateHistoryEntry = {
  id: string;
  type: EmailTemplateHistoryType;
  actor: string;
  at: string;
  /** For `cloned` — source template name. */
  detail?: string;
};

export type EmailTemplateRecord = {
  id: string;
  groupId: EmailTemplateGroupId;
  categoryId: string;
  eventId: string;
  name: string;
  kind: EmailTemplateKind;
  isDefault: boolean;
  /** Who this letter is for. Parent of Automated notifications and Bulk Email. */
  audienceId: EmailAudienceId;
  /** Opens first in the composer for this audience and schedule kind. */
  composerDefault?: boolean;
  subject: string;
  body: string;
  headerFooterLayout?: HeaderFooterLayoutId;
  attachments?: { id: string; name: string; size: number }[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  history: EmailTemplateHistoryEntry[];
};

export type EmailTemplateEvent = {
  id: string;
  label: string;
};

export type EmailTemplateCategory = {
  id: string;
  label: string;
  events: EmailTemplateEvent[];
};

export type EmailTemplateGroup = {
  id: EmailTemplateGroupId;
  label: string;
  categories: EmailTemplateCategory[];
};

export const EMAIL_TEMPLATE_GROUPS: EmailTemplateGroup[] = [
  {
    id: 'automated',
    label: 'Automated notifications',
    categories: [
      {
        id: 'messages',
        label: 'Messages',
        events: [
          {
            id: 'message-from-schools-students-ci',
            label: 'Message from schools, students, or clinical instructors',
          },
        ],
      },
      {
        id: 'slot-request',
        label: 'Slot Request',
        events: [
          { id: 'new-slot-request', label: 'New slot request from a school' },
          { id: 'school-updates-slot-request', label: 'School updates a slot request' },
          { id: 'school-revokes-slot-request', label: 'School revokes a slot request' },
          { id: 'slot-request-approved-by-site', label: 'Slot Request Approved by Site' },
          { id: 'slot-request-rejected-by-site', label: 'Slot Request Rejected by Site' },
          {
            id: 'slots-assigned-directly',
            label: 'Slots Assigned Directly by Site to School (no prior request)',
          },
        ],
      },
      {
        id: 'schedule-management',
        label: 'Schedule Management',
        events: [
          { id: 'school-updates-schedule', label: 'School updates the schedule details' },
          { id: 'school-cancels-schedule', label: 'School cancels a schedule' },
          { id: 'school-confirms-student-schedule', label: 'School confirms a student schedule' },
          {
            id: 'school-replaces-student',
            label: 'School replaces or removes student from schedule',
          },
          {
            id: 'verified-as-employee',
            label: 'Student or Clinical Instructor verified as employee',
          },
          { id: 'direct-schedule', label: 'Direct Schedule' },
          {
            id: 'confirmed-schedules-30-days',
            label: 'Assigned confirmed schedules starting within 30 days',
          },
        ],
      },
      {
        id: 'onboarding-ooo',
        label: 'Onboarding, Ongoing and Offboarding',
        events: [
          {
            id: 'student-onboarding-requirement',
            label: 'Student submits first or last onboarding requirement',
          },
          {
            id: 'student-ongoing-offboarding',
            label: 'Student submits first or last ongoing/offboarding activity',
          },
          {
            id: 'ci-onboarding-requirement',
            label: 'Clinical instructor submits first or last onboarding requirement',
          },
          {
            id: 'school-submits-onboarding',
            label: 'School submits onboarding requirements',
          },
        ],
      },
      {
        id: 'digest-notifications',
        label: 'Digest Notifications',
        events: [
          {
            id: 'weekly-request-schedule-digest',
            label: 'Weekly Request and Schedule Management Digest',
          },
        ],
      },
    ],
  },
  {
    id: 'bulk',
    label: 'Bulk Email',
    categories: [
      {
        id: 'slot-requests',
        label: 'Slot Requests',
        events: [
          { id: 'approval', label: 'Approval' },
          { id: 'rejection', label: 'Rejection' },
          { id: 'information-request', label: 'Information Request' },
        ],
      },
      {
        id: 'schedules',
        label: 'Schedules',
        events: [
          { id: 'confirmation', label: 'Confirmation' },
          { id: 'change-notification', label: 'Change Notification' },
          { id: 'reminder', label: 'Reminder' },
          { id: 'schedule-published', label: 'Schedule Published' },
          { id: 'group-clinical-orientation', label: 'Group clinical orientation' },
          { id: 'group-placement-preceptor', label: 'Group schedule briefing' },
          { id: 'group-placement-site', label: 'Group placement — location coordinator' },
          { id: 'group-onboarding-ci', label: 'Group onboarding — clinical instructor' },
          { id: 'ci-logistics', label: 'Clinical instructor logistics' },
          { id: 'ci-roster', label: 'Roster and shift confirmation' },
          { id: 'group-faculty-update', label: 'Group placement update' },
          { id: 'group-first-day', label: 'First day' },
          { id: 'group-uniform', label: 'Uniform and ID' },
          { id: 'group-parking', label: 'Parking and arrival' },
          { id: 'group-absence', label: 'Absence reporting' },
          { id: 'group-evaluation', label: 'Group evaluation' },
          { id: 'group-thanks', label: 'Thank you' },
          { id: 'group-ci-welcome', label: 'Welcome your group' },
          { id: 'group-ci-midpoint', label: 'Midpoint check-in' },
          { id: 'group-ci-incident', label: 'Incident reporting' },
          { id: 'group-ci-complete', label: 'Group completion' },
          { id: 'group-preceptor-intro', label: 'Meet your group' },
          { id: 'group-preceptor-skills', label: 'Skills to expect' },
          { id: 'group-preceptor-safety', label: 'Unit safety' },
          { id: 'group-preceptor-change', label: 'Schedule change' },
          { id: 'group-preceptor-eval', label: 'Student evaluation' },
          { id: 'group-preceptor-thanks', label: 'Thank you' },
          { id: 'group-faculty-roster', label: 'Roster shared' },
          { id: 'group-faculty-start', label: 'Groups starting' },
          { id: 'group-faculty-attendance', label: 'Attendance' },
          { id: 'group-faculty-concern', label: 'Concern to review' },
          { id: 'group-faculty-complete', label: 'Groups completed' },
          { id: 'group-faculty-eval', label: 'Evaluation window' },
          { id: 'ice-feedback', label: 'ICE feedback' },
          { id: 'ice-overdue', label: 'ICE feedback overdue' },
        ],
      },
      {
        id: 'onboarding',
        label: 'Onboarding',
        events: [
          { id: 'welcome', label: 'Welcome' },
          { id: 'reminder', label: 'Reminder' },
          { id: 'compliance-cleared', label: 'Compliance Cleared' },
        ],
      },
      {
        id: 'jobs',
        label: 'Jobs',
        events: [
          { id: 'application-received', label: 'Application Received' },
          { id: 'interview', label: 'Interview' },
          { id: 'offer', label: 'Offer' },
        ],
      },
      {
        id: 'general',
        label: 'General',
        events: [
          { id: 'announcement', label: 'Announcement' },
          { id: 'staff-communication', label: 'Staff Communication' },
          { id: 'availability', label: 'Availability' },
          { id: 'placement-update', label: 'Placement Update' },
        ],
      },
    ],
  },
];

export const DEFAULT_EMAIL_TEMPLATE_SELECTION = {
  audienceId: 'student' as EmailAudienceId,
  groupId: 'bulk' as EmailTemplateGroupId,
  categoryId: 'onboarding',
  eventId: 'welcome',
};

/** Which schedules letters the composer offers for a group selection, an individual selection, or both. */
export const SCHEDULE_EVENT_KIND: Record<string, 'group' | 'individual' | 'both'> = {
  confirmation: 'individual',
  'change-notification': 'individual',
  reminder: 'individual',
  'schedule-published': 'individual',
  'ice-feedback': 'individual',
  'ice-overdue': 'individual',
  'group-clinical-orientation': 'group',
  'group-placement-preceptor': 'group',
  'group-placement-site': 'group',
  'group-onboarding-ci': 'group',
  'group-faculty-update': 'group',
  'group-first-day': 'group',
  'group-uniform': 'group',
  'group-parking': 'group',
  'group-absence': 'group',
  'group-evaluation': 'group',
  'group-thanks': 'group',
  'group-ci-welcome': 'group',
  'group-ci-midpoint': 'group',
  'group-ci-incident': 'group',
  'group-ci-complete': 'group',
  'group-preceptor-intro': 'group',
  'group-preceptor-skills': 'group',
  'group-preceptor-safety': 'group',
  'group-preceptor-change': 'group',
  'group-preceptor-eval': 'group',
  'group-preceptor-thanks': 'group',
  'group-faculty-roster': 'group',
  'group-faculty-start': 'group',
  'group-faculty-attendance': 'group',
  'group-faculty-concern': 'group',
  'group-faculty-complete': 'group',
  'group-faculty-eval': 'group',
  'ci-logistics': 'both',
  'ci-roster': 'both',
};

export function categoryChain(audienceId: string, groupId: string, categoryId: string, eventId: string): string {
  const selection = findEventSelection(groupId, categoryId, eventId);
  const audience = audienceLabel(audienceId);
  if (!selection) return audience;
  return [audience, selection.group.label, selection.category.label, selection.event.label].join(' \\ ');
}

export function eventKey(
  groupId: string,
  categoryId: string,
  eventId: string,
): string {
  return `${groupId}:${categoryId}:${eventId}`;
}

export function findEventSelection(
  groupId: string,
  categoryId: string,
  eventId: string,
): { group: EmailTemplateGroup; category: EmailTemplateCategory; event: EmailTemplateEvent } | null {
  const group = EMAIL_TEMPLATE_GROUPS.find((g) => g.id === groupId);
  if (!group) return null;
  const category = group.categories.find((c) => c.id === categoryId);
  if (!category) return null;
  const event = category.events.find((e) => e.id === eventId);
  if (!event) return null;
  return { group, category, event };
}

export { SEED_EMAIL_TEMPLATES } from './emailTemplateCatalog';

export function templatesForEvent(
  templates: EmailTemplateRecord[],
  groupId: string,
  categoryId: string,
  eventId: string,
  audienceId?: string,
): EmailTemplateRecord[] {
  return templates
    .filter(
      (t) =>
        t.groupId === groupId &&
        t.categoryId === categoryId &&
        t.eventId === eventId &&
        (!audienceId || t.audienceId === audienceId),
    )
    .sort((a, b) => {
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function templateCountForEvent(
  templates: EmailTemplateRecord[],
  groupId: string,
  categoryId: string,
  eventId: string,
): number {
  return templatesForEvent(templates, groupId, categoryId, eventId).length;
}

export function formatTemplateTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function historyTypeLabel(type: EmailTemplateHistoryType): string {
  switch (type) {
    case 'created':
      return 'Created';
    case 'edited':
      return 'Edited';
    case 'set_default':
      return 'Set as default';
    case 'cloned':
      return 'Cloned';
    default:
      return type;
  }
}

export function canEditTemplate(template: EmailTemplateRecord): boolean {
  return template.kind === 'customized';
}

export function canDeleteTemplate(
  template: EmailTemplateRecord,
  siblings: EmailTemplateRecord[],
): boolean {
  if (template.kind === 'standard') return false;
  if (template.isDefault && siblings.length > 1) return false;
  return true;
}

export function deleteBlockedReason(
  template: EmailTemplateRecord,
  siblings: EmailTemplateRecord[],
): string | null {
  if (template.kind === 'standard') {
    return 'Standard templates cannot be deleted.';
  }
  if (template.isDefault && siblings.length > 1) {
    return 'Set another template as default before deleting this one.';
  }
  return null;
}

/** Sample recipient for Bulk Email template preview (merge engine). */
export const BULK_TEMPLATE_PREVIEW_RECIPIENT: BulkEmailRecipient = {
  id: 'preview-recipient',
  name: 'Dr. Renee Blackwell',
  email: 'renee.blackwell@bowiestate.edu',
  personaId: 'schools',
  roleLabel: 'School Contact',
  details: ['Bowie State University'],
  schedules: [],
  fields: {
    firstName: 'Renee',
    lastName: 'Blackwell',
    recipientName: 'Dr. Renee Blackwell',
    email: 'renee.blackwell@bowiestate.edu',
    studentName: prototypePreviewSamples.studentName,
    startDate: prototypePreviewSamples.startDate,
    hospitalName: prototypeSite.hospitalName,
    preceptorName: prototypePreviewSamples.preceptorName,
    preceptorEmail: prototypePreviewSamples.preceptorEmail,
    loginUrl: prototypeSite.loginUrl,
    onboardingStatus: prototypePreviewSamples.onboardingStatus,
  },
};

/** Shared sample record so preview values stay consistent across events. */
export const EMAIL_PREVIEW_DISPLAY_NAME = prototypeSite.clinicalEducationName;

export const PREVIEW_SAMPLES: Record<string, string> = prototypePreviewSamples;

export function resolvePreviewToken(
  _groupId: EmailTemplateGroupId,
  token: string,
  recipient: BulkEmailRecipient,
  resolveBulk: (r: BulkEmailRecipient, t: string) => { status: string; value?: string },
): string | null {
  if (PREVIEW_SAMPLES[token]) return PREVIEW_SAMPLES[token];
  const res = resolveBulk(recipient, token);
  if (res.status === 'resolved' && res.value) return res.value;
  return null;
}
