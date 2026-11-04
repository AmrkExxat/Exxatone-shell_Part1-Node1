/** Who a letter or attachment is written for. Email Templates, Attachment Templates, and the composer share this list. */
export type EmailAudienceId =
  | 'student'
  | 'preceptor'
  | 'clinical-instructor'
  | 'school-faculty'
  | 'school-contact'
  | 'partner-contact'
  | 'site-personnel'
  | 'candidate';

export const EMAIL_AUDIENCES: { id: EmailAudienceId; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'preceptor', label: 'Preceptor' },
  { id: 'clinical-instructor', label: 'Clinical Instructor' },
  { id: 'school-faculty', label: 'School Faculty' },
  { id: 'school-contact', label: 'School Contact' },
  { id: 'partner-contact', label: 'Partner Contact' },
  { id: 'site-personnel', label: 'Site Personnel' },
  { id: 'candidate', label: 'Candidate' },
];

/** Composer "Select who to send to" choices that have a matching audience. */
export const COMPOSER_ROLE_AUDIENCE = {
  student: 'student',
  instructor: 'clinical-instructor',
  preceptor: 'preceptor',
  faculty: 'school-faculty',
} as const satisfies Record<string, EmailAudienceId>;

export function audienceLabel(id: string): string {
  return EMAIL_AUDIENCES.find((item) => item.id === id)?.label ?? id;
}

/** Automated letters are filed under the person who receives them. */
export const AUTOMATED_EVENT_AUDIENCE: Record<string, EmailAudienceId> = {
  'message-from-schools-students-ci': 'site-personnel',
  'new-slot-request': 'site-personnel',
  'school-updates-slot-request': 'site-personnel',
  'school-revokes-slot-request': 'site-personnel',
  'slot-request-approved-by-site': 'school-contact',
  'slot-request-rejected-by-site': 'school-contact',
  'slots-assigned-directly': 'school-contact',
  'school-updates-schedule': 'site-personnel',
  'school-cancels-schedule': 'site-personnel',
  'school-confirms-student-schedule': 'site-personnel',
  'school-replaces-student': 'site-personnel',
  'verified-as-employee': 'site-personnel',
  'direct-schedule': 'school-contact',
  'confirmed-schedules-30-days': 'site-personnel',
  'student-onboarding-requirement': 'site-personnel',
  'student-ongoing-offboarding': 'site-personnel',
  'ci-onboarding-requirement': 'site-personnel',
  'school-submits-onboarding': 'site-personnel',
  'weekly-request-schedule-digest': 'site-personnel',
};
