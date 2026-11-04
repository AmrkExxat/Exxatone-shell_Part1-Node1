import { useState } from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { cn } from '../../components/ui/utils';
import { ROLE_LABEL, type ComposerHistoryItem, type ComposerRole } from './types';

const STATUS: Record<ComposerHistoryItem['status'], string> = {
  Sent: 'bg-[#d1fae5] text-[#065f46]',
  Scheduled: 'bg-[#dbeafe] text-[#1e40af]',
  Failed: 'bg-[#fee2e2] text-[#991b1b]',
};

interface Props {
  items: ComposerHistoryItem[];
  /** Currently chosen role; the list starts filtered to it. */
  role: ComposerRole | null;
  onReuse: (item: ComposerHistoryItem) => void;
  /** Show the "Email history" heading row (off when a drawer title already says it). */
  title?: boolean;
}

/** Earlier emails relevant to this page's recipients. Always reachable from the header tabs. */
export function HistoryPanel({ items, role, onReuse, title = true }: Props) {
  const [all, setAll] = useState(!role);
  const [open, setOpen] = useState<string | null>(null);
  const list = all || !role ? items : items.filter((i) => i.role === role);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className={cn('flex items-center gap-2 text-sm', title ? 'justify-between' : 'justify-end')}>
        {title && (
          <span className="flex items-center gap-1.5 font-semibold">
            <HistoryIcon className="size-4" /> Email history
          </span>
        )}
        {role && (
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setAll(!all)}>
            {all ? `Show only ${ROLE_LABEL[role].toLowerCase()}` : 'Show all roles'}
          </Button>
        )}
      </div>

      {list.length === 0 && <p className="rounded-md border p-6 text-center text-sm text-muted-foreground">No earlier emails for these recipients.</p>}

      <ul className="flex flex-col gap-2">
        {list.map((h) => (
          <li key={h.id} className="rounded-lg border bg-card p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold">{h.subject}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {h.sentAt} · {h.sentBy}
                </p>
              </div>
              <span className={cn('shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium', STATUS[h.status])}>{h.status}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <Badge variant="secondary">{ROLE_LABEL[h.role].replace(/s$/, '')}</Badge>
              <span className="text-muted-foreground">To {h.audience}</span>
              {h.note && <span className="text-[#991b1b]">· {h.note}</span>}
            </div>
            {open === h.id ? (
              <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm leading-6 [&_p]:mb-2" dangerouslySetInnerHTML={{ __html: h.body }} />
            ) : (
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{h.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
            )}
            <div className="mt-2 flex gap-1.5">
              <Button variant="outline" size="sm" className="h-7" onClick={() => setOpen(open === h.id ? null : h.id)}>
                {open === h.id ? 'Hide' : 'View'}
              </Button>
              <Button variant="ghost" size="sm" className="h-7" onClick={() => onReuse(h)}>
                Use as starting point
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
