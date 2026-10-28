import type { BulkEmailRecipient, HeaderFooterLayoutId } from './bulkEmail';

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
  /** Bulk Email audience label (e.g. School Contact). */
  audience?: string;
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
  groupId: 'automated' as EmailTemplateGroupId,
  categoryId: 'messages',
  eventId: 'message-from-schools-students-ci',
};

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
): EmailTemplateRecord[] {
  return templates
    .filter(
      (t) =>
        t.groupId === groupId && t.categoryId === categoryId && t.eventId === eventId,
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
  fields: {
    firstName: 'Renee',
    lastName: 'Blackwell',
    recipientName: 'Dr. Renee Blackwell',
    email: 'renee.blackwell@bowiestate.edu',
    studentName: 'Jordan Lee',
    startDate: 'April 1, 2026',
    hospitalName: 'MedStar Health',
    preceptorName: 'Dr. Sam Chen',
    preceptorEmail: 'sam.chen@medstar.net',
    loginUrl: 'https://app.exxat.com/login',
    onboardingStatus: 'Complete',
  },
};

/** Shared sample record so preview values stay consistent across events. */
export const EMAIL_PREVIEW_DISPLAY_NAME = 'MedStar Health Clinical Education';

export const PREVIEW_SAMPLES: Record<string, string> = {
  siteName: 'Bedlam-Hospital',
  schoolName: 'Eastwood State University',
  recipientName: 'Maya Chen',
  firstName: 'Maya',
  studentName: 'Jordan Lee',
  messageText: 'Could we move the start date by a week?',
  messageUrl: 'https://one.exxat.com/messages',
  approvedSlotCount: '2',
  rotationName: 'Fall 2026 Rotation',
  reviewUrl: 'https://one.exxat.com/requests/3558157000',
  assignedScheduleRef: 'MS-ICU-2026-014',
  studentRosterRef: 'Eastwood State · Fall 2026',
  startDate: 'April 1, 2026',
  senderName: 'Jordan Lee',
  messagePreview: 'Could we move the start date by a week?',
  messagesLink: 'https://one.exxat.com/messages',
  hospitalName: 'Bedlam-Hospital',
  loginUrl: 'https://app.exxat.com/login',
  onboardingStatus: 'In progress',
  availabilityName: 'Fall 2026 Rotation',
  locationName: 'Bedlam-Hospital · ICU',
  rotationDates: 'April 1, 2026 – July 30, 2026',
  slotsApproved: '2',
  preceptorName: 'Dr. Sam Chen',
  preceptorEmail: 'sam.chen@bedlam.example',
};

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
