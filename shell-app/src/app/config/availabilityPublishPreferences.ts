/** Create Availability — step 5 (Figma publish preference flow; not full PRD yet). */

export type PublishAudience = 'public' | 'all-partners' | 'school-partners' | 'tiered-partners';

export type PublishWhen = 'now' | 'scheduled' | 'do-not-publish';

export interface TierPublishDates {
  publishOn: string | null;
  dueOn: string | null;
}

export interface PublishPreferenceRow {
  id: string;
  audience: PublishAudience | null;
  tierCategoryIds: string[];
  schoolPartnerIds: string[];
  publishWhen: PublishWhen | null;
  /** Card-level publish on (non–tiered partners + Scheduled). */
  publishOn: string | null;
  dueDate: string | null;
  /** Per-tier dates when audience is tiered partners and Publish When is Scheduled. */
  tierPublishDatesByCategoryId: Record<string, TierPublishDates>;
}

export const PUBLISH_AUDIENCE_OPTIONS: { id: PublishAudience; label: string }[] = [
  { id: 'public', label: 'Public' },
  { id: 'all-partners', label: 'All Partners' },
  { id: 'school-partners', label: 'School Partners' },
  { id: 'tiered-partners', label: 'Tiered Partners' },
];

/** Prototype school list for School Partners audience (Figma ref). */
export const PUBLISH_SCHOOL_PARTNER_OPTIONS = [
  { id: 'bowie-state', label: 'Bowie State University' },
  { id: 'eastwood-state', label: 'Eastwood State University' },
  { id: 'exxat-qa-pt', label: 'Exxat-QA-PT' },
  { id: 'cedar-valley', label: 'Cedar Valley College' },
  { id: 'harbor-point', label: 'Harbor Point University' },
  { id: 'northgate', label: 'Northgate Institute' },
] as const;

export const DEFAULT_SCHOOL_PARTNER_IDS: string[] = ['bowie-state', 'eastwood-state', 'exxat-qa-pt'];

export function schoolPartnerLabel(schoolId: string): string {
  return PUBLISH_SCHOOL_PARTNER_OPTIONS.find((s) => s.id === schoolId)?.label ?? schoolId;
}

export function schoolPartnersSummary(schoolIds: string[]): string {
  return schoolIds.map((id) => schoolPartnerLabel(id)).join(', ');
}

export const PUBLISH_WHEN_OPTIONS: { id: PublishWhen; label: string }[] = [
  { id: 'now', label: 'Now' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'do-not-publish', label: 'Do Not Publish' },
];

export const DEFAULT_SCHEDULED_PUBLISH_ON = 'Oct 01, 2026';

export const PUBLISH_ON_SCHEDULE_TOOLTIP = 'Will be published at 12:00 AM CDT';

/** Tier labels shown under Tiered Partners (prototype-safe demo names). */
export const PUBLISH_TIER_CATEGORY_OPTIONS = [
  { id: 'dzfgxgc', label: 'dzfgxgc' },
  { id: 'gold', label: 'gold' },
  { id: 'demo-tier-a', label: 'Demo Tier A' },
  { id: 'international-demo-1', label: 'International Partner (Demo 1)' },
  { id: 'international-demo-2', label: 'International Partner (Demo 2)' },
  { id: 'silver', label: 'Silver' },
  { id: 'tier-1', label: 'Tier 1' },
  { id: 'tier-2', label: 'Tier 2' },
] as const;

export function allTierCategoryIds(): string[] {
  return PUBLISH_TIER_CATEGORY_OPTIONS.map((tier) => tier.id);
}

export function createEmptyPublishPreference(): PublishPreferenceRow {
  return {
    id: `pp-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())}`,
    audience: null,
    tierCategoryIds: [],
    schoolPartnerIds: [],
    publishWhen: null,
    publishOn: null,
    dueDate: null,
    tierPublishDatesByCategoryId: {},
  };
}

export function tierCategoryLabel(tierId: string): string {
  return PUBLISH_TIER_CATEGORY_OPTIONS.find((t) => t.id === tierId)?.label ?? tierId;
}

export function ensureTierPublishDates(
  tierCategoryIds: string[],
  existing: Record<string, TierPublishDates>,
): Record<string, TierPublishDates> {
  const next: Record<string, TierPublishDates> = {};
  for (const id of tierCategoryIds) {
    next[id] = existing[id] ?? {
      publishOn: DEFAULT_SCHEDULED_PUBLISH_ON,
      dueOn: null,
    };
  }
  return next;
}

export function isPublishPreferenceValid(row: PublishPreferenceRow): boolean {
  if (!row.audience) return false;
  if (row.audience === 'tiered-partners' && row.tierCategoryIds.length === 0) return false;
  if (row.audience === 'school-partners' && row.schoolPartnerIds.length === 0) return false;
  if (!row.publishWhen) return false;
  if (row.publishWhen === 'scheduled') {
    if (row.audience === 'tiered-partners') {
      return row.tierCategoryIds.every((id) => Boolean(row.tierPublishDatesByCategoryId[id]?.publishOn));
    }
    if (row.audience === 'school-partners') {
      return row.schoolPartnerIds.every((id) => Boolean(row.tierPublishDatesByCategoryId[id]?.publishOn));
    }
    return Boolean(row.publishOn);
  }
  return true;
}

export function areAllPublishPreferencesValid(rows: PublishPreferenceRow[]): boolean {
  return rows.length > 0 && rows.every(isPublishPreferenceValid);
}

export function publishPreferenceSummary(row: PublishPreferenceRow): string {
  if (!row.audience) return 'Please select an option';
  const base = PUBLISH_AUDIENCE_OPTIONS.find((o) => o.id === row.audience)?.label ?? '';
  if (row.audience === 'tiered-partners' && row.tierCategoryIds.length > 0) {
    return `${base} (${row.tierCategoryIds.length} selected)`;
  }
  return base;
}

export function publishWhenSummary(row: PublishPreferenceRow): string {
  if (!row.publishWhen) return 'Please select an option';
  return PUBLISH_WHEN_OPTIONS.find((o) => o.id === row.publishWhen)?.label ?? '';
}

export function showsPublishWhen(row: PublishPreferenceRow): boolean {
  return Boolean(row.audience) && isAudienceComplete(row);
}

function isAudienceComplete(row: PublishPreferenceRow): boolean {
  if (!row.audience) return false;
  if (row.audience === 'tiered-partners') return row.tierCategoryIds.length > 0;
  if (row.audience === 'school-partners') return row.schoolPartnerIds.length > 0;
  return true;
}

export function showsDueDate(row: PublishPreferenceRow): boolean {
  if (!showsPublishWhen(row) || !row.publishWhen) return false;
  if (row.publishWhen === 'do-not-publish') return false;
  if (row.audience === 'tiered-partners' && row.publishWhen === 'scheduled') return false;
  if (row.audience === 'school-partners' && row.publishWhen === 'scheduled') return false;
  return true;
}

export function showsPublishOn(row: PublishPreferenceRow): boolean {
  return (
    row.publishWhen === 'scheduled' &&
    row.audience !== 'tiered-partners' &&
    row.audience !== 'school-partners'
  );
}

export function showsTierScheduledDates(row: PublishPreferenceRow): boolean {
  return (
    row.audience === 'tiered-partners' &&
    row.publishWhen === 'scheduled' &&
    row.tierCategoryIds.length > 0
  );
}

export function showsSchoolScheduledDates(row: PublishPreferenceRow): boolean {
  return (
    row.audience === 'school-partners' &&
    row.publishWhen === 'scheduled' &&
    row.schoolPartnerIds.length > 0
  );
}

export function hasPublishPreferenceContent(row: PublishPreferenceRow): boolean {
  return (
    Boolean(row.audience) ||
    row.tierCategoryIds.length > 0 ||
    row.schoolPartnerIds.length > 0 ||
    Boolean(row.publishWhen) ||
    Boolean(row.publishOn) ||
    Boolean(row.dueDate) ||
    Object.keys(row.tierPublishDatesByCategoryId ?? {}).length > 0
  );
}

/** Single card with no selections: Remove disabled; otherwise remove or reset is allowed. */
export function isPublishPreferenceRemoveEnabled(
  row: PublishPreferenceRow,
  preferenceCount: number,
): boolean {
  if (preferenceCount > 1) return true;
  return hasPublishPreferenceContent(row);
}
