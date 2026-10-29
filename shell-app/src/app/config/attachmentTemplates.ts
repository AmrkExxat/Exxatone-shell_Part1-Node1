export type AttachmentAudienceId =
  | 'student'
  | 'school-contact'
  | 'partner-contact'
  | 'staff-personnel'
  | 'candidate'
  | 'preceptor'
  | 'placement-faculty-ci';

export type AttachmentTemplate = {
  id: string;
  name: string;
  audienceId: AttachmentAudienceId;
  body: string;
  createdAt: string;
};

export const ATTACHMENT_AUDIENCES: { id: AttachmentAudienceId; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'school-contact', label: 'School Contact' },
  { id: 'partner-contact', label: 'Partner Contact' },
  { id: 'staff-personnel', label: 'Staff-Personnel' },
  { id: 'candidate', label: 'Candidate' },
  { id: 'preceptor', label: 'Preceptor' },
  { id: 'placement-faculty-ci', label: 'Placement Faculty/CI' },
];

export const ATTACHMENT_FIELD_GROUPS: {
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
    label: 'Sender & Organization',
    fields: [
      { label: 'Sender Name', token: 'senderName' },
      { label: 'Sender Organization', token: 'senderOrganization' },
      { label: 'Site / Hospital Name', token: 'hospitalName' },
      { label: 'Login URL', token: 'loginUrl' },
      { label: 'Portal URL', token: 'portalUrl' },
      { label: "Today's Date", token: 'today' },
    ],
  },
  {
    label: 'Student',
    fields: [
      { label: 'Student Name', token: 'studentName' },
      { label: 'School', token: 'school' },
      { label: 'Program', token: 'program' },
      { label: 'Cohort', token: 'cohort' },
      { label: 'Onboarding Status', token: 'onboardingStatus' },
      { label: 'Onboarding Deadline', token: 'onboardingDeadline' },
      { label: 'Days Until Onboarding Deadline', token: 'daysUntilDeadline' },
    ],
  },
  {
    label: 'Schedule',
    fields: [
      { label: 'Schedule ID', token: 'scheduleId' },
      { label: 'Schedule Status', token: 'scheduleStatus' },
      { label: 'Cancellation Reason', token: 'cancellationReason' },
      { label: 'Rotation Name', token: 'rotationName' },
      { label: 'Schedule Start Date', token: 'startDate' },
      { label: 'Schedule End Date', token: 'endDate' },
      { label: 'Schedule Date Range', token: 'scheduleDateRange' },
      { label: 'Days Until Start', token: 'daysUntilStart' },
      { label: 'Shift', token: 'shift' },
      { label: 'Days of Week', token: 'daysOfWeek' },
      { label: 'Discipline / Specialization', token: 'disciplineSpecialization' },
      { label: 'Preceptor Name', token: 'preceptorName' },
      { label: 'Preceptor Email', token: 'preceptorEmail' },
      { label: 'Clinical Instructor', token: 'clinicalInstructorName' },
    ],
  },
  {
    label: 'Location',
    fields: [
      { label: 'Location Name', token: 'locationName' },
      { label: 'Location Address', token: 'locationAddress' },
      { label: 'Location Phone', token: 'locationPhone' },
      { label: 'Department / Unit', token: 'locationDepartment' },
      { label: 'Location Coordinators', token: 'locationCoordinators' },
      { label: 'Primary Coordinator Email', token: 'locationCoordinatorEmail' },
      { label: 'Site Name', token: 'siteName' },
    ],
  },
  {
    label: 'School / Partner',
    fields: [{ label: 'School Name', token: 'schoolName' }],
  },
  {
    label: 'Candidate & Job',
    fields: [{ label: 'Jobs Portal URL', token: 'jobsPortalUrl' }],
  },
  {
    label: 'Links',
    fields: [
      { label: 'Schedule detail', token: 'scheduleDetailLink' },
      { label: 'Request detail', token: 'requestDetailLink' },
      { label: 'Placement detail', token: 'placementDetailLink' },
      { label: 'Requirement detail', token: 'requirementDetailLink' },
      { label: 'Exxat One home', token: 'exxatOneHomeLink' },
    ],
  },
];

export const ATTACHMENT_FIELD_COUNT = ATTACHMENT_FIELD_GROUPS.reduce(
  (total, group) => total + group.fields.length,
  0,
);

export function allowedAttachmentTokens(): Set<string> {
  const tokens = new Set<string>();
  for (const group of ATTACHMENT_FIELD_GROUPS) {
    for (const field of group.fields) tokens.add(field.token);
  }
  return tokens;
}

export const ATTACHMENT_SAMPLES: Record<string, string> = {
  studentName: 'Maya Chen',
  hospitalName: 'Bedlam-Hospital',
  rotationName: 'Fall 2026 Rotation',
  preceptorName: 'Jordan Lee',
  school: 'Eastwood State University',
  schoolName: 'Eastwood State University',
  siteName: 'Bedlam-Hospital',
  recipientName: 'Dr. Renee Blackwell',
  senderName: 'Jordan Lee',
};

export const SEED_ATTACHMENT_TEMPLATES: AttachmentTemplate[] = [
  {
    id: 'att-thank-you',
    name: 'Clinical Rotation Thank-You Letter',
    audienceId: 'student',
    createdAt: '2026-08-12',
    body: `Dear {{studentName}},

On behalf of {{hospitalName}}, thank you for completing your clinical rotation, {{rotationName}}, under the supervision of {{preceptorName}}. Your dedication throughout this placement reflects well on you and on {{school}}. We wish you continued success in your program.

Warm regards,
{{hospitalName}} Clinical Education`,
  },
  {
    id: 'att-partnership',
    name: 'School Partnership Appreciation Letter',
    audienceId: 'school-contact',
    createdAt: '2026-08-14',
    body: `Dear {{recipientName}},

Thank you for partnering with {{siteName}} this term. Students from {{schoolName}} have been a credit to the placement. Please share our thanks with your faculty.

Warm regards,
{{senderName}}`,
  },
  {
    id: 'att-preceptor',
    name: 'Preceptor Appreciation Certificate',
    audienceId: 'preceptor',
    createdAt: '2026-09-02',
    body: `{{preceptorName}},

This certificate recognizes your supervision of {{studentName}} during {{rotationName}}. Thank you for the time and teaching you gave this term.`,
  },
];

export function audienceLabel(id: AttachmentAudienceId): string {
  return ATTACHMENT_AUDIENCES.find((item) => item.id === id)?.label ?? id;
}

export function tokensInBody(body: string): string[] {
  const found = body.matchAll(/\{\{(\w+)\}\}/g);
  return [...new Set([...found].map((match) => match[1]))];
}

export function unknownTokens(body: string): string[] {
  const allowed = allowedAttachmentTokens();
  return tokensInBody(body).filter((token) => !allowed.has(token));
}
