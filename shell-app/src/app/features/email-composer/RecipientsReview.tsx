import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { cn } from '../../components/ui/utils';
import {
  ROLE_LABEL,
  attentionOf,
  emailProblem,
  isEmptyRosterRecipient,
  type AttentionKind,
  type ComposerRecipient,
  type ComposerRole,
} from './types';

type FilterId = 'all' | AttentionKind;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'missing-email', label: 'Missing email' },
  { id: 'no-students', label: 'No students assigned' },
  { id: 'multi', label: 'On more than one schedule' },
  { id: 'already', label: 'Already emailed' },
];

interface Props {
  roles: ComposerRole[];
  role: ComposerRole;
  onRole: (role: ComposerRole) => void;
  peopleFor: (role: ComposerRole) => ComposerRecipient[];
  included: (person: ComposerRecipient) => boolean;
  onToggle: (id: string, on: boolean) => void;
  onSetMany: (ids: string[], on: boolean) => void;
  onFixEmail: (id: string, email: string) => void;
  split: boolean;
  canSplit: boolean;
  onSplit: (value: boolean) => void;
  skipPrev: boolean;
  onSkipPrev: (value: boolean) => void;
  copyMe: boolean;
  onCopyMe: (value: boolean) => void;
  meEmail: string;
  recipientCount: number;
  emailCount: number;
  /** `copy` lists the other audiences, for Cc. */
  variant?: 'review' | 'copy';
  /** The first visit shows the three counts. Edit recipients hides them. */
  showStats?: boolean;
}

function OptionSwitch({
  id,
  checked,
  onCheckedChange,
  label,
  hint,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm text-[#212121]">
          {label}
        </label>
        <p className="text-xs text-[#6b7280]">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2">
      <p className="text-xl font-semibold leading-6 text-[#111827]">{value}</p>
      <p className="text-xs text-[#6b7280]">{label}</p>
    </div>
  );
}

/** First step of the composer: who gets the email, and what still needs a decision. */
export function RecipientsReview(p: Props) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [query, setQuery] = useState('');
  const [openSchedules, setOpenSchedules] = useState<Set<string>>(new Set());
  const [draftEmail, setDraftEmail] = useState<Record<string, string>>({});

  const people = p.peopleFor(p.role);
  const counts = useMemo(() => {
    const tally = { all: people.length, 'missing-email': 0, 'no-students': 0, multi: 0, already: 0 };
    people.forEach((person) => {
      attentionOf(person).forEach((kind) => {
        tally[kind] += 1;
      });
    });
    return tally;
  }, [people]);
  const needsAttention = people.filter((person) => attentionOf(person).length > 0).length;

  const shown = people.filter((person) => {
    const text = `${person.name} ${person.email}`.toLowerCase();
    if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;
    if (filter === 'all') return true;
    return attentionOf(person).includes(filter);
  });

  const selectable = shown.filter((person) => !emailProblem(person) && !isEmptyRosterRecipient(person) && !(p.skipPrev && person.lastEmailed));

  const copying = p.variant === 'copy';
  const audienceLabel = copying ? 'Copy from' : 'Send to';

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="w-[min(100%,320px)]">
        <label htmlFor="composer-audience" className="mb-1.5 block text-sm font-medium text-[#212121]">
          {audienceLabel}
        </label>
        <Select
          value={p.role}
          onValueChange={(next) => {
            p.onRole(next as ComposerRole);
            setFilter('all');
            setQuery('');
          }}
        >
          <SelectTrigger
          id="composer-audience"
          className="h-9 w-full rounded-md border border-[#d1d5db] bg-white px-3 text-sm text-[#212121] shadow-sm hover:bg-white focus-visible:border-[#3f51b5] focus-visible:ring-[#3f51b5]/30"
          aria-label={audienceLabel}
        >
            <SelectValue>
              {ROLE_LABEL[p.role]} · {people.length}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {p.roles.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABEL[role]} · {p.peopleFor(role).length}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!copying && p.showStats !== false && (
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Will receive this" value={p.recipientCount} />
          <Stat label="Emails to send" value={p.emailCount} />
          <Stat label="Need attention" value={needsAttention} />
        </div>
      )}

      {!copying && (
        <div className="grid gap-2 border-b pb-3">
          {p.canSplit && (
            <OptionSwitch
              id="composer-split"
              checked={p.split}
              onCheckedChange={p.onSplit}
              label="Send a separate email for each schedule"
              hint={
                p.split
                  ? 'People on more than one schedule get one email per schedule.'
                  : 'People on more than one schedule get a single email listing them.'
              }
            />
          )}
          <OptionSwitch
            id="composer-skip"
            checked={p.skipPrev}
            onCheckedChange={p.onSkipPrev}
            label="Skip people who already got this email"
            hint={`${counts.already} already emailed`}
          />
          <OptionSwitch
            id="composer-copy"
            checked={p.copyMe}
            onCheckedChange={p.onCopyMe}
            label="Send me a copy"
            hint={p.meEmail}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.filter((item) => item.id === 'all' || counts[item.id] > 0).map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs',
              filter === item.id ? 'border-[#3f51b5] bg-[#eef0fb] font-medium text-[#3f51b5]' : 'border-[#e5e7eb] text-[#424242]',
            )}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
            <span>{item.id === 'all' ? counts.all : counts[item.id]}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name or email"
          aria-label="Search recipients"
          className="h-9 border-border bg-background pl-8"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {shown.length} of {people.length}
        </span>
        <span className="flex gap-2">
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => p.onSetMany(selectable.map((person) => person.id), true)}>
            Select all
          </Button>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => p.onSetMany(selectable.map((person) => person.id), false)}>
            Clear
          </Button>
        </span>
      </div>

      <ul className="divide-y overflow-hidden rounded-md border">
        {shown.length === 0 && <li className="p-4 text-center text-sm text-muted-foreground">No one matches that filter.</li>}
        {shown.map((person) => {
          const problem = emailProblem(person);
          const empty = isEmptyRosterRecipient(person);
          const blocked = !!problem || empty || (p.skipPrev && !!person.lastEmailed);
          const on = p.included(person);
          const open = openSchedules.has(person.id);
          const reasons = attentionOf(person);
          return (
            <li key={person.id} className={cn('px-3 py-2.5', empty && 'bg-[#fafafa]')}>
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={on}
                  disabled={blocked}
                  onCheckedChange={(value) => p.onToggle(person.id, value === true)}
                  aria-label={`Include ${person.name}`}
                  className="mt-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('text-sm font-semibold', !on && 'text-muted-foreground')}>{person.name}</span>
                    {person.rows.length > 0 && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-0.5 text-xs font-medium text-[#424242]"
                        aria-expanded={open}
                        onClick={() =>
                          setOpenSchedules((current) => {
                            const next = new Set(current);
                            if (next.has(person.id)) next.delete(person.id);
                            else next.add(person.id);
                            return next;
                          })
                        }
                      >
                        {person.rows.length} {person.rows.length === 1 ? 'schedule' : 'schedules'}
                        <ChevronDown className={cn('size-3.5', open && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{problem || person.email}</span>
                  {empty && <p className="mt-1 text-[13px] font-medium text-[#e65100]">No students assigned to this schedule</p>}
                  {reasons.includes('multi') && (
                    <p className="mt-1 text-xs text-[#6b7280]">
                      {p.split ? 'Gets one email for each schedule.' : 'Gets one email listing every schedule.'}
                    </p>
                  )}
                  {problem === 'No email address' && (
                    <form
                      className="mt-2 flex gap-2"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const value = (draftEmail[person.id] ?? '').trim();
                        if (value) p.onFixEmail(person.id, value);
                      }}
                    >
                      <Input
                        type="email"
                        required
                        value={draftEmail[person.id] ?? ''}
                        onChange={(event) => setDraftEmail((current) => ({ ...current, [person.id]: event.target.value }))}
                        placeholder="Add email address"
                        aria-label={`Email for ${person.name}`}
                        className="h-8"
                      />
                      <Button type="submit" size="sm" variant="outline">
                        Add email
                      </Button>
                    </form>
                  )}
                  {open && (
                    <ul className="mt-2 overflow-hidden rounded-md border border-[#e5e7eb]">
                      {person.rows.map((row, index) => (
                        <li key={`${row.scheduleId}-${index}`} className="border-t border-[#e5e7eb] px-3 py-2 first:border-t-0">
                          <span className="text-sm font-semibold">{row.scheduleId}</span>
                          {row.rotation && <span className="ml-2 text-xs text-[#6b7280]">{row.rotation}</span>}
                          <p className="text-sm text-[#111827]">
                            {row.students?.length ? row.students.join(', ') : 'No students assigned to this schedule'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Badge variant="secondary">{ROLE_LABEL[person.role].replace(/s$/, '')}</Badge>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
