import { AUTOMATED_EVENT_AUDIENCE, type EmailAudienceId } from './emailAudiences';
import type { EmailTemplateRecord } from './emailTemplates';
import {
  PROTOTYPE_EMAIL_TEMPLATE_SEEDS,
  type PrototypeEmailTemplateSeed,
} from '../data/prototype/emailTemplateSeeds';

type Seed = PrototypeEmailTemplateSeed;

function audienceFor(item: Seed): EmailAudienceId {
  if (item.audienceId) return item.audienceId;
  const automated = AUTOMATED_EVENT_AUDIENCE[item.eventId];
  if (automated) return automated;
  throw new Error(`Email template ${item.id} has no audience`);
}

function seed(item: Seed): EmailTemplateRecord {
  const at = item.lastUpdatedAt ?? '2026-04-08T11:20:00';
  const actor = item.lastUpdatedBy ?? 'Exxat One';
  return {
    id: item.id,
    groupId: item.groupId,
    categoryId: item.categoryId,
    eventId: item.eventId,
    name: item.name,
    kind: item.kind ?? 'standard',
    isDefault: item.isDefault ?? true,
    audienceId: audienceFor(item),
    composerDefault: item.composerDefault,
    subject: item.subject,
    body: item.body,
    attachments: item.attachments,
    lastUpdatedBy: actor,
    lastUpdatedAt: at,
    history: [{ id: `${item.id}-created`, type: 'created', actor, at }],
  };
}

export const SEED_EMAIL_TEMPLATES: EmailTemplateRecord[] = PROTOTYPE_EMAIL_TEMPLATE_SEEDS.map(seed);
