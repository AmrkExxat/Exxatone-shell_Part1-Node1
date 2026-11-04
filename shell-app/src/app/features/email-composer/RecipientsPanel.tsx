import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { cn } from '../../components/ui/utils';
import {
  emailProblem,
  isEmptyRosterRecipient,
  ROLE_LABEL,
  type ComposerRecipient,
  type ComposerRole,
  type PlacementRow,
} from './types';

const PAGE = 50;
const EMPTY_ROSTER_HINT = 'No students assigned to this schedule';

interface Props {
  role: ComposerRole | null;
  people: ComposerRecipient[];
  excluded: Set<string>;
  skipPrev: boolean;
  split: boolean;
  canSplit: boolean;
  copyMe: boolean;
  meEmail: string;
  willReceive: number;
  edited: Set<string>;
  /** Expanded mode: clicking a row opens that person's own email in the editor. */
  openId: string | null;
  onOpen?: (id: string) => void;
  onToggle: (id: string, on: boolean) => void;
  onSetMany: (ids: string[], on: boolean) => void;
  onSkipPrev: (v: boolean) => void;
  onSplit: (v: boolean) => void;
  onCopyMe: (v: boolean) => void;
}

function Option({ checked, onChange, title, hint }: { checked: boolean; onChange: (v: boolean) => void; title: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 py-1.5 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <span>
        {title}
        {hint && <small className="block text-xs text-muted-foreground">{hint}</small>}
      </span>
    </label>
  );
}

/** Search, select-all, the recipient list (paged for 100+), and the sending options. */
export function RecipientsPanel(p: Props) {
  const [q, setQ] = useState('');
  const [lim, setLim] = useState(PAGE);
  const [openSchedules, setOpenSchedules] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return p.people.filter((x) => !s || (x.name + ' ' + x.email).toLowerCase().includes(s));
  }, [p.people, q]);
  const blockedFn = (x: ComposerRecipient) =>
    !!emailProblem(x) || (p.skipPrev && !!x.lastEmailed) || isEmptyRosterRecipient(x);
  const shown = rows.slice(0, lim);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border-b pb-3">
        <h3 className="mb-1 text-sm font-semibold">Options</h3>
        {p.canSplit && (
          <Option
            checked={p.split}
            onChange={p.onSplit}
            title="Send a separate email for each schedule"
            hint="Otherwise each person gets one email listing all their schedules"
          />
        )}
        <Option checked={p.skipPrev} onChange={p.onSkipPrev} title="Skip people who already got this email" hint={`${p.people.filter((x) => x.lastEmailed).length} already emailed`} />
        <Option checked={p.copyMe} onChange={p.onCopyMe} title="Send me a copy" hint={p.meEmail} />
      </div>
      <h3 className="-mb-2 text-sm font-semibold">
        Recipients <span className="font-normal text-muted-foreground">({p.people.length})</span>
      </h3>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLim(PAGE);
          }}
          placeholder="Search name or email"
          aria-label="Search recipients"
          className="h-9 border-border bg-background pl-8 [&::-webkit-search-cancel-button]:cursor-pointer"
        />
      </div>

      <div className="-mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {shown.length} of {rows.length}
        </span>
        <span className="flex gap-1">
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => p.onSetMany(rows.filter((x) => !blockedFn(x)).map((x) => x.id), true)}>
            Select all
          </Button>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => p.onSetMany(rows.filter((x) => !blockedFn(x)).map((x) => x.id), false)}>
            Clear
          </Button>
        </span>
      </div>

      <ul className="divide-y overflow-hidden rounded-md border">
        {!p.role && <li className="p-4 text-center text-sm text-muted-foreground">Choose a role to see who will get this email.</li>}
        {p.role && rows.length === 0 && <li className="p-4 text-center text-sm text-muted-foreground">No one matches that search.</li>}
        {shown.map((x) => {
          const prob = emailProblem(x);
          const emptyRoster = isEmptyRosterRecipient(x);
          const blocked = blockedFn(x);
          const on = !blocked && !p.excluded.has(x.id);
          const schedulesOpen = openSchedules.has(x.id);
          const scheduleCount = x.rows.length;
          const skipped = p.skipPrev && x.lastEmailed ? `Skipped. ${x.lastEmailed}` : '';
          const toggleSchedules = () =>
            setOpenSchedules((current) => {
              const next = new Set(current);
              if (next.has(x.id)) next.delete(x.id);
              else next.add(x.id);
              return next;
            });
          return (
            <li key={x.id} className={cn('px-3 py-2.5', p.openId === x.id && 'bg-accent/60', emptyRoster && 'bg-[#fafafa]')}>
              <div className="flex items-start gap-3">
                <Checkbox checked={on} disabled={blocked} onCheckedChange={(v) => p.onToggle(x.id, v === true)} aria-label={`Include ${x.name}`} className="mt-1" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('text-sm font-semibold', (!on || emptyRoster) && 'text-muted-foreground')}>{x.name}</span>
                    {scheduleCount > 0 && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#424242]"
                        aria-expanded={schedulesOpen}
                        onClick={toggleSchedules}
                      >
                        {scheduleCount} {scheduleCount === 1 ? 'schedule' : 'schedules'}
                        <ChevronDown className={cn('size-3.5 transition-transform', schedulesOpen && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  <span className="mt-0.5 block break-words text-xs text-muted-foreground">
                    {prob || x.email}
                    {skipped && <span className="block">{skipped}</span>}
                  </span>
                  {emptyRoster && (
                    <p className="mt-1.5 text-[13px] font-medium leading-5 text-[#e65100]">{EMPTY_ROSTER_HINT}</p>
                  )}
                  {schedulesOpen && <ScheduleList rows={x.rows} />}
                </div>
                <span className="flex items-center gap-1">
                  {p.edited.has(x.id) && <Badge variant="outline">Edited</Badge>}
                  {prob ? <Badge variant="destructive">{prob}</Badge> : <Badge variant="secondary">{ROLE_LABEL[x.role].replace(/s$/, '')}</Badge>}
                </span>
              </div>
            </li>
          );
        })}
        {rows.length > shown.length && (
          <li className="p-2 text-center">
            <Button variant="link" size="sm" onClick={() => setLim((n) => n + PAGE)}>
              Show {Math.min(PAGE, rows.length - shown.length)} more
            </Button>
          </li>
        )}
      </ul>


    </div>
  );
}

function ScheduleList({ rows }: { rows: PlacementRow[] }) {
  const byId = new Map<string, { id: string; rotation: string; students: string[]; isGroup: boolean }>();
  rows.forEach((row) => {
    const id = row.scheduleId || '—';
    const students = row.students?.length ? row.students : row.group ? [] : [row.student].filter(Boolean);
    const existing = byId.get(id);
    if (existing) {
      students.forEach((name) => {
        if (!existing.students.includes(name)) existing.students.push(name);
      });
      if (!existing.rotation && row.rotation) existing.rotation = row.rotation;
      existing.isGroup = existing.isGroup || Boolean(row.group);
    } else {
      byId.set(id, { id, rotation: row.rotation || '', students: [...students], isGroup: Boolean(row.group) });
    }
  });
  const groups = [...byId.values()];
  if (!groups.length) return null;
  return (
    <ul className="mt-2 overflow-hidden rounded-md border border-[#e5e7eb]">
      {groups.map((group) => (
        <li key={group.id} className="border-t border-[#e5e7eb] px-3 py-2 first:border-t-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-[#111827]">{group.id}</span>
            {group.rotation && <span className="text-xs text-[#6b7280]">{group.rotation}</span>}
          </div>
          {group.students.length > 0 ? (
            <p className="mt-0.5 text-sm leading-5 text-[#111827]">{group.students.join(', ')}</p>
          ) : group.isGroup ? (
            <p className="mt-0.5 text-sm italic leading-5 text-[#9e9e9e]">{EMPTY_ROSTER_HINT}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
