import { Fragment } from 'react';
import {
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Inbox,
  Mail,
  type LucideIcon,
} from 'lucide-react';
import {
  EMAIL_TEMPLATE_GROUPS,
  templateCountForEvent,
  type EmailTemplateRecord,
} from '../../../config/emailTemplates';
import { et } from './emailTemplatesTokens';

type Props = {
  templates: EmailTemplateRecord[];
  groupId: string;
  categoryId: string;
  eventId: string;
  onSelect: (groupId: string, categoryId: string, eventId: string) => void;
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

function CategoryIcon({ categoryId }: { categoryId: string }) {
  const Icon = CATEGORY_ICONS[categoryId] ?? Mail;
  return <Icon className="size-4 shrink-0 text-[#616161]" strokeWidth={1.75} aria-hidden />;
}

export function EmailTemplatesEventTree({
  templates,
  groupId,
  categoryId,
  eventId,
  onSelect,
}: Props) {
  return (
    <aside className={et.treeCard} aria-label="Email template events">
      <div className={et.treeScroll}>
        {EMAIL_TEMPLATE_GROUPS.map((group, index) => (
          <Fragment key={group.id}>
            <div className={`${et.groupBar} ${index === 0 ? et.groupBarFirst : et.groupBarNext}`}>
              {group.label}
            </div>
            {group.categories.map((category) => (
              <div key={category.id}>
                <div className={et.categoryRow}>
                  <CategoryIcon categoryId={category.id} />
                  <span>{category.label}</span>
                </div>
                {category.events.map((event) => {
                  const active =
                    groupId === group.id &&
                    categoryId === category.id &&
                    eventId === event.id;
                  const count = templateCountForEvent(
                    templates,
                    group.id,
                    category.id,
                    event.id,
                  );
                  return (
                    <button
                      key={event.id}
                      type="button"
                      className={
                        active
                          ? `${et.eventBtn} ${et.eventBtnActive}`
                          : `${et.eventBtn} ${et.eventBtnIdle}`
                      }
                      aria-current={active ? 'true' : undefined}
                      onClick={() => onSelect(group.id, category.id, event.id)}
                    >
                      <span className="min-w-0 flex-1">{event.label}</span>
                      <span className={et.countPill}>
                        {count}
                        <span className="sr-only">
                          {' '}
                          {count === 1 ? 'template' : 'templates'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </aside>
  );
}
