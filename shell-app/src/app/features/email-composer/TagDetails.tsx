import { useEffect, useRef, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { IconButton } from '../../components/ui/icon-button';
import { cn } from '../../components/ui/utils';
import { TAG_INFO, TAG_STYLE } from './tags';

/** What a tag turns into for one recipient, so the details can show a real example. */
export type DescribeTag = (tag: string) => { person: string; value: string } | null;

interface Open {
  tag: string;
  el: HTMLElement;
  x: number;
  y: number;
}

/** True while a tag details card is open, so Escape closes the card and not the drawer. */
export const tagDetails = { open: false };

/**
 * Click (or Enter on) a tag chip to see what it means, who it applies to and what it becomes for
 * the person being previewed. Used by both the message and the subject editors.
 */
export function useTagDetails(emit: () => void, describe?: DescribeTag) {
  const [st, setSt] = useState<Open | null>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tagDetails.open = !!st;
    if (!st) return;
    const out = (e: PointerEvent) => {
      if (!card.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest?.('[data-tag]')) setSt(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setSt(null);
        st.el.focus();
      }
    };
    document.addEventListener('pointerdown', out, true);
    document.addEventListener('keydown', key, true);
    return () => {
      tagDetails.open = false;
      document.removeEventListener('pointerdown', out, true);
      document.removeEventListener('keydown', key, true);
    };
  }, [st]);

  const openFor = (el: HTMLElement) => {
    const tag = el.getAttribute('data-tag');
    if (!tag) return false;
    const r = el.getBoundingClientRect();
    setSt({ tag, el, x: Math.max(8, Math.min(r.left, window.innerWidth - 336)), y: r.bottom + 8 });
    return true;
  };

  const onClick = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-tag]');
    if (el && openFor(el)) e.preventDefault();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-tag]');
    if (el && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openFor(el);
    }
  };

  const info = st && TAG_INFO[st.tag];
  const ex = st && describe?.(st.tag);
  const popup = st && (
    <div
      ref={card}
      role="dialog"
      aria-label={`${st.tag} details`}
      style={{ left: st.x, top: st.y }}
      className="fixed z-[70] w-80 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn('rounded px-1.5 py-0.5 text-sm font-medium', TAG_STYLE[st.tag])}>{st.tag}</span>
        <IconButton label="Close details" tooltipSide="top" className="-mr-1 -mt-1 size-7" onClick={() => setSt(null)}>
          <X />
        </IconButton>
      </div>
      {info && (
        <>
          <p className="mt-2 text-sm leading-5">{info.long}</p>
          {info.scope && <p className="mt-1.5 text-xs text-muted-foreground">{info.scope}</p>}
        </>
      )}
      {ex && (
        <div className="mt-2.5 rounded-md bg-muted/60 p-2 text-xs">
          <span className="text-muted-foreground">For {ex.person}:</span> <span className="font-medium text-foreground">{ex.value || 'No value on this schedule'}</span>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-destructive hover:text-destructive"
          onClick={() => {
            const el = st.el;
            const parent = el.parentElement;
            el.remove();
            setSt(null);
            emit();
            parent?.focus?.();
          }}
        >
          <Trash2 /> Remove tag
        </Button>
      </div>
    </div>
  );

  return { onClick, onKeyDown, popup };
}
