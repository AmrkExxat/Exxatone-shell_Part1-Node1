import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, RotateCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { cn } from '../../components/ui/utils';
import { ASK_LEO_BRAND_PINK, LeoAIIconAnimation, LeoBetaBadge } from '../leo';
import { classify, generateDraft, suggestionsFor, THINKING_LABEL, type LeoDraft } from './leoDraft';
import { type ComposerRole } from './types';

interface Props {
  role: ComposerRole;
  brandName: string;
  /** How many recipients Leo is writing for, shown in its thinking copy. */
  count: number;
  disabled?: boolean;
  onInsert: (draft: LeoDraft) => void;
}

const stripTags = (html: string) =>
  html
    .replace(/<\/p>/g, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim();

/** Word-by-word reveal, slow to fast like Leo's LeoWordRevealText. */
function Reveal({ text, onDone }: { text: string; onDone: () => void }) {
  const tokens = useMemo(() => text.match(/\S+|\s+/g) ?? [], [text]);
  const [n, setN] = useState(1);
  useEffect(() => {
    if (n >= tokens.length) {
      onDone();
      return;
    }
    const progress = n / Math.max(1, tokens.length - 1);
    const delay = Math.round(14 + (70 - 14) * Math.pow(1 - progress, 1.55));
    const t = window.setTimeout(() => setN((x) => x + 1), delay);
    return () => window.clearTimeout(t);
  }, [n, tokens, onDone]);
  return <>{tokens.slice(0, n).join('')}</>;
}

type Phase = { name: 'idle' } | { name: 'thinking'; prompt: string; step: number } | { name: 'done'; prompt: string; draft: LeoDraft; revealed: boolean };

/**
 * "Write with Leo" — Leo's entry point inside the composer. Mirrors Ask Leo's patterns: pink mark
 * with Beta pill, up to four contextual chips (short label, fuller prompt), a frosted prompt box,
 * task-flavoured thinking copy, a word-by-word reply, and the "review before you send" disclosure.
 */
export function LeoWrite({ role, brandName, count, disabled, onInsert }: Props) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>({ name: 'idle' });
  const [text, setText] = useState('');
  const area = useRef<HTMLTextAreaElement>(null);
  const chips = suggestionsFor(role);

  // Step through Leo's thinking labels, then land the draft.
  useEffect(() => {
    if (phase.name !== 'thinking') return;
    const timers = [
      window.setTimeout(() => setPhase((p) => (p.name === 'thinking' ? { ...p, step: 1 } : p)), 650),
      window.setTimeout(() => setPhase((p) => (p.name === 'thinking' ? { ...p, step: 2 } : p)), 1250),
      window.setTimeout(() => setPhase((p) => (p.name === 'thinking' ? { name: 'done', prompt: p.prompt, draft: generateDraft(p.prompt, role, brandName), revealed: false } : p)), 1900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [phase.name, role, brandName]);

  const ask = (prompt: string) => {
    const p = prompt.trim();
    if (!p) return;
    setText('');
    setPhase({ name: 'thinking', prompt: p, step: 0 });
  };
  const reset = () => {
    setPhase({ name: 'idle' });
    window.setTimeout(() => area.current?.focus(), 0);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPhase({ name: 'idle' });
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-sm font-medium leading-none outline-none transition-colors hover:bg-[#e31c79]/10 focus-visible:ring-[3px] focus-visible:ring-[#e31c79]/30 disabled:pointer-events-none disabled:opacity-50"
          style={{ color: ASK_LEO_BRAND_PINK }}
        >
          <LeoAIIconAnimation size={16} autoPlay={false} />
          Write with Leo
          <LeoBetaBadge className="uppercase tracking-wide" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[440px] p-0" onOpenAutoFocus={(event) => { event.preventDefault(); area.current?.focus(); }}>
        <div className="flex max-h-[420px] flex-col">
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <LeoAIIconAnimation size={20} autoPlay={false} />
          <span className="text-sm font-semibold">Write with Leo</span>
          <LeoBetaBadge />
          <span className="ml-auto text-xs text-muted-foreground">For {count}</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
          {phase.name === 'idle' && (
            <>
              <p className="text-sm text-muted-foreground">Tell Leo what the email should say. It writes a draft with merge tags you can edit.</p>
              <div className="flex flex-wrap gap-2">
                {chips.map(({ id, label, prompt, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => ask(prompt)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[13px] shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-colors hover:border-black/20 hover:bg-slate-50 active:bg-slate-100"
                  >
                    <Icon className="size-3.5 text-muted-foreground" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase.name === 'thinking' && (
            <div role="status" aria-live="polite" className="flex items-center gap-3 py-4">
              <LeoAIIconAnimation size={32} variant="default-out" loop durationMs={3000} />
              <div>
                <p className="text-sm font-medium">{THINKING_LABEL[classify(phase.prompt)][phase.step]}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">“{phase.prompt}”</p>
              </div>
            </div>
          )}

          {phase.name === 'done' && (
            <div className="flex flex-col gap-3">
              <p className="line-clamp-1 text-xs text-muted-foreground">“{phase.prompt}”</p>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm leading-6">
                <p className="mb-2 font-semibold">
                  {phase.revealed ? phase.draft.subject : <Reveal text={phase.draft.subject} onDone={() => undefined} />}
                </p>
                <p className="whitespace-pre-line text-foreground/90">
                  {phase.revealed ? stripTags(phase.draft.body) : <Reveal text={stripTags(phase.draft.body)} onDone={() => setPhase((p) => (p.name === 'done' ? { ...p, revealed: true } : p))} />}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="h-8 border-0 text-white hover:opacity-90"
                  style={{ backgroundColor: ASK_LEO_BRAND_PINK }}
                  onClick={() => {
                    onInsert(phase.draft);
                    setOpen(false);
                    setPhase({ name: 'idle' });
                  }}
                >
                  Use this draft
                </Button>
                <Button variant="outline" className="h-8" onClick={() => ask(phase.prompt)}>
                  <RotateCw /> Try again
                </Button>
                <Button variant="ghost" className="h-8" onClick={reset}>
                  Change request
                </Button>
              </div>
            </div>
          )}
        </div>

        {phase.name !== 'thinking' && (
          <div className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(text);
              }}
              className={cn('ai-composer-idle flex items-end gap-2 rounded-xl border border-black/15 bg-white/80 px-3 py-2 backdrop-blur focus-within:border-[#e31c79]/60 focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#e31c79]/15')}
            >
              <textarea
                ref={area}
                value={text}
                rows={1}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    ask(text);
                  }
                }}
                placeholder="Describe the email you want…"
                aria-label="Describe the email to Leo"
                className="max-h-24 min-h-6 flex-1 resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="submit"
                    aria-label="Send to Leo"
                    disabled={!text.trim()}
                    className="grid size-7 shrink-0 place-items-center rounded-full text-white transition-opacity disabled:opacity-35"
                    style={{ backgroundColor: ASK_LEO_BRAND_PINK }}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Send to Leo</TooltipContent>
              </Tooltip>
            </form>
            <p className="mt-2 text-[11px] leading-4 text-muted-foreground">Leo is in beta and can make mistakes. Please review the draft before you send.</p>
          </div>
        )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
