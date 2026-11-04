import { CalendarClock, ClipboardCheck, Handshake, ListChecks, MessageSquareText, type LucideIcon } from 'lucide-react';
import { ROLE_LABEL, type ComposerRole } from './types';

/** Same shape as Leo's contextual chips: short label for the UI, full prompt for the model. */
export interface LeoSuggestion {
  id: string;
  label: string;
  prompt: string;
  Icon: LucideIcon;
}

export interface LeoDraft {
  subject: string;
  /** HTML, using the composer's merge tags. */
  body: string;
}

const s = (id: string, label: string, prompt: string, Icon: LucideIcon): LeoSuggestion => ({ id, label, prompt, Icon });

/** Up to four chips, chosen from the recipient role (Leo caps its empty state at four). */
export function suggestionsFor(role: ComposerRole): LeoSuggestion[] {
  switch (role) {
    case 'student':
      return [
        s('welcome', 'Welcome and first day', 'Welcome the student and explain what to bring and when to arrive on the first day', Handshake),
        s('forms', 'Remind about forms', 'Remind the student to finish their onboarding forms before they can start', ClipboardCheck),
        s('schedule', 'Share placement details', 'Share the placement details and dates as a table', CalendarClock),
        s('reply', 'Ask for a reply', 'Ask the student to confirm they received this and reply by Friday', MessageSquareText),
      ];
    case 'faculty':
      return [
        s('update', 'Progress update', 'Send a short progress update on the students at our site, with their placement details', ListChecks),
        s('attendance', 'Attendance note', 'Let faculty know attendance is on track and mention who to contact with concerns', ClipboardCheck),
        s('schedule', 'Share placement details', 'Share the placement details and dates as a table', CalendarClock),
        s('reply', 'Ask for a reply', 'Ask the faculty member to confirm and reply by Friday', MessageSquareText),
      ];
    case 'instructor':
      return [
        s('logistics', 'Group logistics', 'Share the logistics for the clinical group, including badges, shift and arrival time, with the roster as a table', CalendarClock),
        s('roster', 'Confirm the roster', 'Ask the clinical instructor to confirm the final roster and shift by Friday', ListChecks),
        s('schedule', 'Share placement details', 'Share the group placement details and dates as a table', ClipboardCheck),
        s('reply', 'Ask for a reply', 'Ask the clinical instructor to confirm and reply by Friday', MessageSquareText),
      ];
    default:
      return [
        s('feedback', 'Request feedback', 'Ask the preceptor to submit the ICE feedback sheet for their student', ClipboardCheck),
        s('overdue', 'Overdue reminder', 'Remind the preceptor that the feedback sheet is overdue and takes about five minutes', ListChecks),
        s('thanks', 'Thank them', 'Thank the preceptor for mentoring the student', Handshake),
        s('schedule', 'Share placement details', 'Share the student placement details and dates as a table', CalendarClock),
      ];
  }
}

type Intent = 'welcome' | 'reminder' | 'update' | 'summary' | 'thanks' | 'feedback' | 'general';

/** Rough intent from the prompt, the way Leo's classifyQuery shapes its thinking labels. */
export function classify(prompt: string): Intent {
  const t = prompt.toLowerCase();
  if (/thank|appreciat/.test(t)) return 'thanks';
  if (/overdue|remind|still missing|forms|deadline/.test(t)) return 'reminder';
  if (/feedback|evaluation|ice\b/.test(t)) return 'feedback';
  if (/table|details|schedule|dates|placement/.test(t)) return 'summary';
  if (/progress|update|attendance|status/.test(t)) return 'update';
  if (/welcome|first day|orientation|arrive|bring/.test(t)) return 'welcome';
  return 'general';
}

export const THINKING_LABEL: Record<Intent, string[]> = {
  welcome: ['Reading the placement details…', 'Drafting a welcome…', 'Checking merge tags…'],
  reminder: ['Checking what is outstanding…', 'Drafting a reminder…', 'Checking merge tags…'],
  update: ['Reading the selected schedules…', 'Drafting an update…', 'Checking merge tags…'],
  summary: ['Reading the selected schedules…', 'Building the placement table…', 'Checking merge tags…'],
  thanks: ['Reading who mentors whom…', 'Drafting a thank-you…', 'Checking merge tags…'],
  feedback: ['Reading the feedback requirements…', 'Drafting the request…', 'Checking merge tags…'],
  general: ['Reading your request…', 'Drafting the email…', 'Checking merge tags…'],
};

const SIGN = '<p>The Clinical Placements Office</p>';
const para = (t: string) => `<p>${t}</p>`;
const sentence = (t: string) => {
  const x = t.trim().replace(/^[a-z]/, (c) => c.toUpperCase());
  return /[.!?]$/.test(x) ? x : x + '.';
};

/** Offline stand-in for Leo's model call: shapes a draft from the prompt, role and merge tags. */
export function generateDraft(prompt: string, role: ComposerRole, brand: string): LeoDraft {
  const intent = classify(prompt);
  const hi = para('Hi @Recipient first name,');

  switch (intent) {
    case 'welcome':
      return {
        subject: `Welcome to ${brand}`,
        body: hi + para('We are glad to host you at @Location. Your placement runs @Dates.') + para('Please arrive 15 minutes before your first shift and bring photo ID. Your preceptor, @Preceptor name, will meet you at the front desk.') + SIGN,
      };
    case 'reminder':
      if (role === 'instructor' || role === 'faculty')
        return {
          subject: 'Please confirm for @Group name',
          body: hi + para('A quick reminder to confirm the roster and shift for your group by Friday, so we can finish unit assignments.') + para('@Schedule table') + SIGN,
        };
      return role === 'student'
        ? {
            subject: 'Action needed: finish your onboarding forms',
            body: hi + para('We are still missing your onboarding forms for your @Discipline placement. You cannot start your shifts until they are complete.') + para('It takes about ten minutes, and we are happy to help if you get stuck.') + SIGN,
          }
        : {
            subject: 'Reminder: feedback for @Student name is due',
            body: hi + para('Your feedback sheet for @Student name is overdue. It takes about five minutes.') + para('@Schedule table') + SIGN,
          };
    case 'feedback':
      return {
        subject: 'ICE Feedback Sheet for @Student name',
        body: hi + para('Thank you for mentoring @Student name. Please submit the ICE feedback sheet within a week of the last rotation date.') + para('@Schedule table') + SIGN,
      };
    case 'thanks':
      return {
        subject: 'Thank you for mentoring @Student name',
        body: hi + para('Thank you for the time and care you have given @Student name this term. Mentors like you make these placements work.') + para('If there is anything we can do to support you, just reply to this email.') + SIGN,
      };
    case 'summary':
      return {
        subject: `Placement details at ${brand}`,
        body: hi + para(`Here are the placement details for ${ROLE_LABEL[role] === 'Students' ? 'your placement' : 'your students'}:`) + para('@Schedule table') + para('Reply to this email if anything looks wrong.') + SIGN,
      };
    case 'update':
      return {
        subject: 'Placement update for your students',
        body: hi + para('A short update on your students at our site: orientation is complete and attendance is on track.') + para('@Schedule table') + para('Please contact us if you have any concerns.') + SIGN,
      };
    default:
      return {
        subject: `A note from ${brand}`,
        body: hi + para(sentence(prompt)) + para('Please reply to this email if you have questions.') + SIGN,
      };
  }
}
