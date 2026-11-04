import type { ComposerContext, ComposerRecipient, ComposerRole, PlacementRow } from '../types';
import { sampleHistory, siteSender } from './shared';

export interface PersonInput {
  role: ComposerRole;
  name: string;
  email: string;
  /** What the merge tags (@Dates, @Location, ...) should say for this person. Optional. */
  placement?: Partial<PlacementRow>;
  lastEmailed?: string;
}

const EMPTY: PlacementRow = { student: '', preceptor: '', faculty: '', school: '', discipline: '', location: '', dates: '', shift: '' };

/**
 * Generic page adapter for pages that are just a list of people (Students, Preceptors, Faculty,
 * Onboarding ...). Pass the selected people and a label for the page; get a composer context.
 * Pages with richer data (like Schedules) write their own adapter and follow the same shape.
 */
export function buildPeopleContext(opts: { source: string; people: PersonInput[]; siteName: string; subtitle?: string; kind?: ComposerContext['kind'] }): ComposerContext {
  const recipients: ComposerRecipient[] = opts.people.map((p, i) => ({
    id: `${p.role}:${p.email || i}`,
    role: p.role,
    name: p.name,
    email: p.email,
    rows: [{ ...EMPTY, ...p.placement }],
    lastEmailed: p.lastEmailed,
  }));
  const n = (role: ComposerRole) => recipients.filter((r) => r.role === role).length;
  const plural = (k: number, one: string, many: string) => `${k} ${k === 1 ? one : many}`;
  return {
    source: opts.source,
    kind: opts.kind ?? 'individual',
    subtitle: opts.subtitle ?? `${opts.source} · ${plural(recipients.length, 'person', 'people')}`,
    recipients,
    history: sampleHistory({ plural, n, siteName: opts.siteName, grouped: false }),
    sender: siteSender(opts.siteName),
  };
}
