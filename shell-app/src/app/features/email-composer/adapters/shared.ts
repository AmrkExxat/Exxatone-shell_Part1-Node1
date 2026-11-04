import { prototypeSite } from '../../../data/prototype/site';
import type { ComposerContext, ComposerHistoryItem, ComposerRecipient } from '../types';

/** Sender block every site-side page shares: the site's placements inbox, coordinator and brand. */
export function siteSender(siteName: string): ComposerContext['sender'] {
  const name = siteName || prototypeSite.name;
  return {
    name: prototypeSite.clinicalEducationName,
    email: prototypeSite.replyTo,
    replyTo: prototypeSite.senderName,
    me: prototypeSite.senderEmail,
    brand: {
      name,
      unit: 'Clinical Placements Office',
      address: prototypeSite.addressLines.join(', '),
      contact: `${prototypeSite.replyTo} · ${prototypeSite.phone}`,
    },
  };
}

interface HistoryArgs {
  plural: (k: number, one: string, many: string) => string;
  n: (role: ComposerRecipient['role']) => number;
  siteName: string;
  grouped: boolean;
}

/** Placeholder sent/scheduled/failed emails until a page has a real history API. */
export function sampleHistory({ plural, n, siteName, grouped }: HistoryArgs): ComposerHistoryItem[] {
  const sender = prototypeSite.senderName;
  return [
    {
      id: 'h1',
      role: 'student',
      subject: 'Action needed: finish your onboarding forms',
      body: '<p>Hi,</p><p>We are still missing your onboarding forms. You cannot start your shifts until they are complete.</p><p>The Clinical Placements Office</p>',
      sentAt: 'Nov 3, 2026 · 9:00 AM',
      sentBy: sender,
      audience: plural(n('student'), 'student', 'students'),
      status: 'Scheduled',
    },
    ...(grouped
      ? [
          {
            id: 'h2',
            role: 'instructor' as const,
            subject: 'Logistics for your clinical group',
            body: '<p>Hi,</p><p>Badges are ready at the front desk. Please bring the signed roster on the first day.</p><p>The Clinical Placements Office</p>',
            sentAt: 'Oct 30, 2026 · 2:15 PM',
            sentBy: sender,
            audience: plural(n('instructor'), 'clinical instructor', 'clinical instructors'),
            status: 'Sent' as const,
          },
        ]
      : [
          {
            id: 'h2',
            role: 'preceptor' as const,
            subject: 'Reminder: feedback is due',
            body: '<p>Hi,</p><p>Your ICE feedback sheet is overdue. It takes about five minutes.</p><p>The Clinical Placements Office</p>',
            sentAt: 'Oct 30, 2026 · 2:15 PM',
            sentBy: sender,
            audience: plural(n('preceptor'), 'preceptor', 'preceptors'),
            status: 'Failed' as const,
            note: '1 bounced: no email address on file',
          },
        ]),
    {
      id: 'h3',
      role: 'student',
      subject: `Welcome to ${siteName}`,
      body: '<p>Hi,</p><p>We are glad to host you. Please arrive 15 minutes before your first shift and bring photo ID.</p><p>The Clinical Placements Office</p>',
      sentAt: 'Oct 28, 2026 · 9:00 AM',
      sentBy: sender,
      audience: plural(n('student'), 'student', 'students'),
      status: 'Sent',
    },
    {
      id: 'h4',
      role: 'faculty',
      subject: grouped ? 'Update on your groups' : 'Placement update for your students',
      body: '<p>Hi,</p><p>A short update: orientation is complete and attendance is on track.</p><p>The Clinical Placements Office</p>',
      sentAt: 'Oct 21, 2026 · 11:30 AM',
      sentBy: sender,
      audience: plural(n('faculty'), 'faculty member', 'faculty members'),
      status: 'Sent',
    },
    {
      id: 'h5',
      role: 'preceptor',
      subject: grouped ? 'Clinical group on your unit' : 'ICE Feedback Sheet for your student',
      body: '<p>Hi,</p><p>Thank you for mentoring. Please contact us with any scheduling concerns.</p><p>The Clinical Placements Office</p>',
      sentAt: 'Oct 14, 2026 · 10:00 AM',
      sentBy: sender,
      audience: plural(n('preceptor'), 'preceptor', 'preceptors'),
      status: 'Sent',
    },
  ];
}
