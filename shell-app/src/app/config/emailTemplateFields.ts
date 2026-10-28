export type MergeField = { label: string; token: string };

const MESSAGE_FIELDS: MergeField[] = [
  { label: 'First name', token: 'firstName' },
  { label: 'Sender name', token: 'senderName' },
  { label: 'Message preview', token: 'messagePreview' },
];

const MESSAGE_LINKS: MergeField[] = [{ label: 'Messages', token: 'messagesLink' }];

const COMMON_FIELDS: MergeField[] = [
  { label: 'First name', token: 'firstName' },
  { label: 'Recipient name', token: 'recipientName' },
  { label: 'Site name', token: 'siteName' },
  { label: 'School name', token: 'schoolName' },
  { label: 'Student name', token: 'studentName' },
  { label: 'Sender name', token: 'senderName' },
  { label: 'Start date', token: 'startDate' },
  { label: 'Rotation', token: 'rotationName' },
];

const COMMON_LINKS: MergeField[] = [
  { label: 'Review request', token: 'reviewUrl' },
  { label: 'Login', token: 'loginUrl' },
];

export function mergeFieldsForEvent(eventId: string): MergeField[] {
  if (eventId === 'message-from-schools-students-ci') return MESSAGE_FIELDS;
  return COMMON_FIELDS;
}

export function linksForEvent(eventId: string): MergeField[] {
  if (eventId === 'message-from-schools-students-ci') return MESSAGE_LINKS;
  return COMMON_LINKS;
}
