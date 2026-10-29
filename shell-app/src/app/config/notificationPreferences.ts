import { EMAIL_TEMPLATE_GROUPS } from './emailTemplates';

export type NotificationChannels = { inApp: boolean; email: boolean };

export type NotificationRecipient = {
  id: string;
  name: string;
  email: string;
  kind: 'site-admin' | 'external';
  selected: boolean;
  /** Person has turned off every notification. They cannot be selected. */
  blocked: boolean;
};

export type NotificationPrefs = {
  locks: Record<string, boolean>;
  channels: Record<string, NotificationChannels>;
  recipients: NotificationRecipient[];
};

const EVENT_DESCRIPTIONS: Record<string, string> = {
  'message-from-schools-students-ci':
    'When a school, student, or clinical instructor sends you a message.',
  'new-slot-request': 'When a school submits a new slot request.',
  'school-updates-slot-request': 'When dates, counts, or other request details change.',
  'school-revokes-slot-request': 'When a school withdraws a slot request.',
  'slot-request-approved-by-site': 'When your site approves a slot request.',
  'slot-request-rejected-by-site': 'When your site declines a slot request.',
  'slots-assigned-directly': 'When your site assigns slots to a school without a prior request.',
  'school-updates-schedule': 'When location, dates, or other schedule details change.',
  'school-cancels-schedule': 'When a confirmed schedule is cancelled.',
  'school-confirms-student-schedule': 'When a student schedule is confirmed.',
  'school-replaces-student': 'When a school replaces or removes a student from a schedule.',
  'verified-as-employee': 'When a student or clinical instructor is verified as an employee.',
  'direct-schedule': 'When a schedule is created directly, without a slot request.',
  'confirmed-schedules-30-days': 'When a confirmed schedule starts within the next 30 days.',
  'student-onboarding-requirement':
    'When a student submits a first or last onboarding requirement.',
  'student-ongoing-offboarding':
    'When a student submits a first or last ongoing or offboarding activity.',
  'ci-onboarding-requirement': 'When a clinical instructor submits an onboarding requirement.',
  'school-submits-onboarding': 'When a school submits an onboarding requirement.',
  'weekly-request-schedule-digest':
    'A weekly summary of open requests and upcoming schedules.',
};

/** Messages cannot be unlocked. Digest starts locked, with in-app off and email on. */
const SEEDED_LOCKS = new Set(['messages', 'digest-notifications']);

export function notificationCategories() {
  const automated = EMAIL_TEMPLATE_GROUPS.find((group) => group.id === 'automated');
  return (automated?.categories ?? []).map((category) => ({
    id: category.id,
    label: category.label,
    permanentLock: category.id === 'messages',
    events: category.events.map((event) => ({
      id: event.id,
      label: event.label,
      description: EVENT_DESCRIPTIONS[event.id] ?? event.label,
    })),
  }));
}

export function createDefaultNotificationPrefs(): NotificationPrefs {
  const locks: Record<string, boolean> = {};
  const channels: Record<string, NotificationChannels> = {};
  for (const category of notificationCategories()) {
    locks[category.id] = SEEDED_LOCKS.has(category.id);
    for (const event of category.events) {
      channels[event.id] =
        category.id === 'digest-notifications'
          ? { inApp: false, email: true }
          : { inApp: true, email: true };
    }
  }
  return {
    locks,
    channels,
    recipients: [
      {
        id: 'rec-compliance',
        name: 'compliance@bedlam-hospital.org',
        email: 'compliance@bedlam-hospital.org',
        kind: 'external',
        selected: true,
        blocked: false,
      },
      {
        id: 'rec-abcd',
        name: 'abcd test',
        email: 'abcdtest@mailinator.com',
        kind: 'site-admin',
        selected: true,
        blocked: false,
      },
      {
        id: 'rec-blocked',
        name: 'All Notification Blocked',
        email: 'allnotificationandemaildisabled@exxat.testinator.com',
        kind: 'site-admin',
        selected: false,
        blocked: true,
      },
      {
        id: 'rec-maya',
        name: 'Maya Chen',
        email: 'maya.chen@mailinator.com',
        kind: 'site-admin',
        selected: true,
        blocked: false,
      },
      {
        id: 'rec-luis',
        name: 'Luis Ortega',
        email: 'luis.ortega@mailinator.com',
        kind: 'site-admin',
        selected: true,
        blocked: false,
      },
    ],
  };
}

export function recipientSummary(recipients: NotificationRecipient[]): string {
  const selected = recipients.filter((person) => person.selected && !person.blocked);
  const admins = selected.filter((person) => person.kind === 'site-admin').length;
  const external = selected.filter((person) => person.kind === 'external').length;
  const adminLabel = admins === 1 ? '1 site admin' : `${admins} site admins`;
  const externalLabel = external === 1 ? '1 external' : `${external} external`;
  return `${adminLabel}, ${externalLabel}`;
}
