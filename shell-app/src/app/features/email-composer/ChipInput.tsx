import { useId, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { IconButton } from '../../components/ui/icon-button';
import { Popover, PopoverAnchor, PopoverContent } from '../../components/ui/popover';
import { cn } from '../../components/ui/utils';

/** One person/address the user can pick while typing. `value` is what becomes the chip. */
export interface Suggestion {
  value: string;
  name: string;
  email: string;
  tag?: string;
}

/** True while a suggestion list is open, so Escape closes the list and not the drawer behind it. */
export const suggest = { open: false };

interface Props {
  list: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  label: string;
  /** Rendered between the chips and the text box (e.g. the "View all" link). */
  after?: React.ReactNode;
  /** Chips shown before collapsing into "+N more" (keeps the row calm for 100+ addresses). */
  visible?: number;
  /** People to offer in a popover once the user starts typing. */
  suggestions?: Suggestion[];
  /** Only one value allowed (e.g. From). Picking replaces the current one. */
  single?: boolean;
  className?: string;
}

/** Address chips + free-text box. Handles Enter / comma / blur, and pasted lists of emails. */
export function ChipInput({ list, onChange, placeholder, label, after, visible = 3, suggestions = [], single, className }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const listId = useId();
  const add = (parts: string[]) => {
    if (!parts.length) return;
    onChange(single ? [parts[0]] : [...list, ...parts].filter((v, i, a) => a.indexOf(v) === i));
    setText('');
    setActive(0);
  };
  const commit = (raw: string) => add(raw.split(/[\s,;]+/).filter(Boolean));
  const q = text.trim().toLowerCase();
  const matches = useMemo(
    () =>
      q
        ? suggestions.filter((x) => !list.includes(x.value) && (x.name + ' ' + x.email).toLowerCase().includes(q)).slice(0, 6)
        : [],
    [q, suggestions, list],
  );
  const popOpen = focused && matches.length > 0;
  suggest.open = popOpen;
  const shown = open ? list : list.slice(0, visible);
  const more = list.length - visible;

  return (
    <Popover open={popOpen}>
    <PopoverAnchor asChild>
    <div className={cn('flex min-w-0 flex-1 flex-wrap items-center gap-1.5', open && 'max-h-28 overflow-auto', className)}>
      {shown.map((e, i) => (
        <Badge key={e + i} variant="secondary" className="gap-0.5 py-0.5 pl-2 pr-0.5 text-[13px] font-normal">
          {e}
          <IconButton
            label={`Remove ${e}`}
            tooltipSide="top"
            className="size-4 rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => onChange(list.filter((_, j) => j !== i))}
          >
            <X className="size-3" />
          </IconButton>
        </Badge>
      ))}
      {more > 0 && (
        <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setOpen(!open)}>
          {open ? 'Show less' : `+${more} more`}
        </Button>
      )}
      {after}
      <input
        value={text}
        aria-label={label}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={popOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        onFocus={() => setFocused(true)}
        onChange={(e) => {
          setText(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (popOpen && e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => (a + 1) % matches.length);
          } else if (popOpen && e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => (a - 1 + matches.length) % matches.length);
          } else if (popOpen && (e.key === 'Enter' || e.key === 'Tab')) {
            e.preventDefault();
            add([matches[active].value]);
          } else if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit(text);
          } else if (e.key === 'Escape' && popOpen) {
            setText('');
          } else if (e.key === 'Backspace' && !text && list.length) {
            onChange(list.slice(0, -1));
          }
        }}
        onBlur={() => {
          setFocused(false);
          suggest.open = false;
          commit(text);
        }}
        onPaste={(e) => {
          const t = e.clipboardData.getData('text');
          if (/[\s,;]/.test(t.trim())) {
            e.preventDefault();
            commit(t);
          }
        }}
        className="h-7 min-w-[140px] flex-1 border-0 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
    </PopoverAnchor>
    <PopoverContent
      align="start"
      sideOffset={6}
      className="w-80 p-1"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
    >
      <ul id={listId} role="listbox" aria-label={`${label} suggestions`}>
        {matches.map((m, i) => (
          <li
            key={m.value}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => {
              e.preventDefault();
              add([m.value]);
            }}
            onMouseEnter={() => setActive(i)}
            className={cn('flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm', i === active && 'bg-accent')}
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{m.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{m.email}</span>
            </span>
            {m.tag && (
              <Badge variant="secondary" className="shrink-0 text-[11px] font-normal">
                {m.tag}
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </PopoverContent>
    </Popover>
  );
}
