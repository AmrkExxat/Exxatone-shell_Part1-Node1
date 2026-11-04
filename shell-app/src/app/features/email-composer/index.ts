// Public surface of the email feature. Pages import only from here (plus an adapter).
export { ComposerProvider, useEmailComposer } from './ComposerProvider';
export { EmailActions } from './EmailActions';
export { buildPeopleContext, type PersonInput } from './adapters/people';
export { buildScheduleContext } from './adapters/schedules';
export type { ComposerContext, ComposerRecipient, ComposerRole, ComposerHistoryItem, PlacementRow } from './types';
