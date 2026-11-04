import { useEffect, useId, useMemo, useState } from 'react';
import { cn } from '../../components/ui/utils';
import { insertChip, TAG_INFO, TAG_STYLE, TAGS_BY_LENGTH } from './tags';
import { MERGE_TAGS } from './templates';

/** True while the @ list is open, so Escape closes the list and not the drawer behind it. */
export const typeahead = { open: false };


interface Open {
  q: string;
  x: number;
  y: number;
  index: number;
  node: Text;
  start: number;
}

/**
 * "@" in a subject or message opens a list of merge tags. Picking one drops in the same chip the
 * toolbar menu does, and typing a whole tag out by hand turns into that chip too.
 */
export function useTagTypeahead(ref: React.RefObject<HTMLElement | null>, emit: () => void) {
  const id = useId();
  const [st, setSt] = useState<Open | null>(null);
  const matches = useMemo(() => (st ? MERGE_TAGS.filter((t) => t.slice(1).toLowerCase().includes(st.q.trim().toLowerCase())) : []), [st]);
  const visible = !!st && matches.length > 0;
  useEffect(() => {
    typeahead.open = visible;
    return () => {
      typeahead.open = false;
    };
  }, [visible]);

  const close = () => setSt(null);
  const caretIn = (node: Text) => {
    const sel = window.getSelection();
    return sel && sel.anchorNode === node ? sel.anchorOffset : null;
  };
  const put = (node: Text, start: number, end: number, tag: string) => {
    const r = document.createRange();
    r.setStart(node, start);
    r.setEnd(node, end);
    insertChip(r, tag);
    close();
    emit();
  };

  const onInput = () => {
    const el = ref.current;
    const sel = window.getSelection();
    if (!el || !sel || !sel.isCollapsed || !sel.anchorNode || sel.anchorNode.nodeType !== 3 || !el.contains(sel.anchorNode)) return close();
    const node = sel.anchorNode as Text;
    if (node.parentElement?.closest('[data-tag]')) return close();
    const before = (node.textContent ?? '').slice(0, sel.anchorOffset);

    // A whole tag typed out becomes a chip.
    for (const tag of TAGS_BY_LENGTH) {
      if (before.endsWith(tag) && (before.length === tag.length || /[^A-Za-z0-9]$/.test(before.slice(0, before.length - tag.length)))) {
        return put(node, before.length - tag.length, before.length, tag);
      }
    }
    const m = /(?:^|\s)@([A-Za-z ]{0,24})$/.exec(before);
    if (!m) return close();
    const range = sel.getRangeAt(0).cloneRange();
    const rect = range.getClientRects()[0] ?? el.getBoundingClientRect();
    setSt({ q: m[1], x: Math.min(rect.left, window.innerWidth - 300), y: rect.bottom + 6, index: 0, node, start: before.length - m[1].length - 1 });
  };

  const choose = (tag: string) => {
    if (!st) return;
    put(st.node, st.start, caretIn(st.node) ?? st.start + 1 + st.q.length, tag);
  };

  /** Returns true when the key was used by the list. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!visible || !st) return false;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const n = matches.length;
      setSt({ ...st, index: (st.index + (e.key === 'ArrowDown' ? 1 : n - 1)) % n });
      return true;
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      choose(matches[st.index]);
      return true;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return true;
    }
    return false;
  };

  const popup = visible && st && (
    <ul
      id={id}
      role="listbox"
      aria-label="Merge tags"
      style={{ left: st.x, top: st.y }}
      className="fixed z-[70] max-h-72 w-72 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
    >
      {matches.map((t, i) => (
        <li
          key={t}
          id={`${id}-${i}`}
          role="option"
          aria-selected={i === st.index}
          onMouseDown={(e) => {
            e.preventDefault();
            choose(t);
          }}
          onMouseEnter={() => setSt({ ...st, index: i })}
          className={cn('flex cursor-default flex-col items-start gap-0.5 rounded-sm px-2 py-1.5 text-sm', i === st.index && 'bg-accent')}
        >
          <span className={cn('rounded px-1 text-xs font-medium', TAG_STYLE[t])}>{t}</span>
          <span className="text-xs text-muted-foreground">{TAG_INFO[t]?.short}</span>
        </li>
      ))}
    </ul>
  );

  return { onInput, onKeyDown, popup, listProps: visible && st ? { 'aria-controls': id, 'aria-activedescendant': `${id}-${st.index}` } : {} };
}
