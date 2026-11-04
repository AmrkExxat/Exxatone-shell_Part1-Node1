import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Inbox,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import { EMAIL_AUDIENCES, type EmailAudienceId } from '../../../config/emailAudiences';
import {
  EMAIL_TEMPLATE_GROUPS,
  type EmailTemplateGroupId,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import { cn } from '../../../components/ui/utils';
import { et } from './emailTemplatesTokens';

type Props = {
  templates: EmailTemplateRecord[];
  audienceId: string;
  groupId: string;
  categoryId: string;
  eventId: string;
  onSelect: (audienceId: string, groupId: string, categoryId: string, eventId: string) => void;
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  messages: Mail,
  'slot-request': Inbox,
  'slot-requests': Inbox,
  'schedule-management': CalendarDays,
  schedules: CalendarDays,
  'onboarding-ooo': ClipboardList,
  onboarding: ClipboardList,
  'digest-notifications': Bell,
  jobs: Briefcase,
  general: Mail,
};

type TreeEvent = { id: string; label: string; count: number };
type TreeCategory = { id: string; label: string; events: TreeEvent[] };
type TreeGroup = { id: EmailTemplateGroupId; label: string; categories: TreeCategory[] };
type TreeAudience = { id: EmailAudienceId; label: string; count: number; groups: TreeGroup[] };

function CategoryIcon({ categoryId }: { categoryId: string }) {
  const Icon = CATEGORY_ICONS[categoryId] ?? Mail;
  return <Icon className="size-4 shrink-0 text-[#616161]" strokeWidth={1.75} aria-hidden />;
}

function buildTree(templates: EmailTemplateRecord[]): TreeAudience[] {
  return EMAIL_AUDIENCES.flatMap((audience) => {
    const mine = templates.filter((item) => item.audienceId === audience.id);
    if (!mine.length) return [];
    const groups = EMAIL_TEMPLATE_GROUPS.flatMap((group) => {
      const categories = group.categories.flatMap((category) => {
        const events = category.events.flatMap((event) => {
          const count = mine.filter(
            (item) => item.groupId === group.id && item.categoryId === category.id && item.eventId === event.id,
          ).length;
          return count ? [{ id: event.id, label: event.label, count }] : [];
        });
        return events.length ? [{ id: category.id, label: category.label, events }] : [];
      });
      return categories.length ? [{ id: group.id, label: group.label, categories }] : [];
    });
    return groups.length ? [{ id: audience.id, label: audience.label, count: mine.length, groups }] : [];
  });
}

export function EmailTemplatesEventTree({
  templates,
  audienceId,
  groupId,
  categoryId,
  eventId,
  onSelect,
}: Props) {
  const tree = useMemo(() => buildTree(templates), [templates]);
  const [openAudiences, setOpenAudiences] = useState<Set<string>>(() => new Set([audienceId]));
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const previousAudience = useRef(audienceId);

  useEffect(() => {
    if (previousAudience.current === audienceId) return;
    previousAudience.current = audienceId;
    setOpenAudiences((current) => {
      const next = new Set(current);
      next.add(audienceId);
      return next;
    });
  }, [audienceId]);

  const toggleAudience = (id: string) => {
    setOpenAudiences((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <aside className={et.treeCard} aria-label="Email template audiences">
      <div className={et.treeScroll}>
        {tree.map((audience) => {
          const open = openAudiences.has(audience.id);
          return (
            <div key={audience.id}>
              <button
                type="button"
                className={cn(et.audienceBtn, open && et.audienceBtnOpen)}
                aria-expanded={open}
                onClick={() => toggleAudience(audience.id)}
              >
                <ChevronDown className={cn('size-4 shrink-0 text-[#616161] transition-transform', !open && '-rotate-90')} aria-hidden />
                <span className="min-w-0 flex-1">{audience.label}</span>
                <span className={et.countPill}>
                  {audience.count}
                  <span className="sr-only"> {audience.count === 1 ? 'template' : 'templates'}</span>
                </span>
              </button>
              {open
                ? audience.groups.map((group) => {
                    const groupKey = `${audience.id}:${group.id}`;
                    const groupOpen = !collapsedGroups.has(groupKey);
                    return (
                      <div key={group.id}>
                        <button type="button" className={et.groupBar} aria-expanded={groupOpen} onClick={() => toggleGroup(groupKey)}>
                          <ChevronDown className={cn('size-3.5 shrink-0 transition-transform', !groupOpen && '-rotate-90')} aria-hidden />
                          <span className="min-w-0 flex-1">{group.label}</span>
                        </button>
                        {groupOpen
                          ? group.categories.map((category) => (
                              <div key={category.id}>
                                <div className={et.categoryRow}>
                                  <CategoryIcon categoryId={category.id} />
                                  <span>{category.label}</span>
                                </div>
                                {category.events.map((event) => {
                                  const active =
                                    audience.id === audienceId &&
                                    groupId === group.id &&
                                    categoryId === category.id &&
                                    eventId === event.id;
                                  return (
                                    <button
                                      key={event.id}
                                      type="button"
                                      className={active ? `${et.eventBtn} ${et.eventBtnActive}` : `${et.eventBtn} ${et.eventBtnIdle}`}
                                      aria-current={active ? 'true' : undefined}
                                      onClick={() => onSelect(audience.id, group.id, category.id, event.id)}
                                    >
                                      <span className="min-w-0 flex-1">{event.label}</span>
                                      <span className={et.countPill}>
                                        {event.count}
                                        <span className="sr-only"> {event.count === 1 ? 'template' : 'templates'}</span>
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            ))
                          : null}
                      </div>
                    );
                  })
                : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
