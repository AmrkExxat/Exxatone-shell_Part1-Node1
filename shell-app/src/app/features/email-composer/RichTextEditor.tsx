import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Heading1, Italic, Link2, List, ListOrdered, Paperclip, Strikethrough, Underline } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { IconButton } from '../../components/ui/icon-button';
import { Input } from '../../components/ui/input';
import { cn } from '../../components/ui/utils';
import { decorateHtml, insertChip, serializeHtml, TAG_INFO, TAG_STYLE } from './tags';
import { useTagDetails, type DescribeTag } from './TagDetails';
import { useTagTypeahead } from './TagTypeahead';

interface Props {
  value: string;
  onChange: (html: string) => void;
  tags: string[];
  onAttach: (files: File[]) => void;
  /** Inside the content box, above the message (the header option). */
  top?: React.ReactNode;
  /** Inside the content box, below the message (the footer option). */
  bottom?: React.ReactNode;
  /** Between the content box and the toolbar (attachments). */
  below?: React.ReactNode;
  /** Where to draw the toolbar. When set, it is portalled there (a bar pinned under the scrolling area). */
  toolbarTarget?: HTMLElement | null;
  /** What a tag becomes for the person being previewed (shown in the tag's details). */
  describe?: DescribeTag;
  /** Shown in the message area while a blank template has no content yet. */
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Message editor. The content box holds the optional header, the editable message and the
 * optional footer, so they read as one email; the formatting toolbar sits under it.
 *
 * The message is uncontrolled while typing (the caret never jumps). `value` is plain stored
 * HTML; merge tags are drawn as coloured chips in the DOM and turned back into text on the way out.
 */
export function RichTextEditor({ value, onChange, tags, onAttach, top, bottom, below, toolbarTarget, describe, placeholder, disabled, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const saved = useRef<Range | null>(null);
  const [tagQuery, setTagQuery] = useState('');
  const shownTags = tags.filter((tag) => {
    const q = tagQuery.trim().toLowerCase();
    return !q || `${tag} ${TAG_INFO[tag]?.short ?? ''}`.toLowerCase().includes(q);
  });

  const emit = () => ref.current && onChange(serializeHtml(ref.current));
  const ta = useTagTypeahead(ref, emit);
  const td = useTagDetails(emit, describe);

  useEffect(() => {
    const el = ref.current;
    if (el && serializeHtml(el) !== value) el.innerHTML = decorateHtml(value);
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };
  const remember = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) saved.current = sel.getRangeAt(0).cloneRange();
  };
  const insertTag = (tag: string) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    let range = saved.current;
    if (!range) {
      range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
    }
    sel?.removeAllRanges();
    sel?.addRange(range);
    insertChip(sel!.getRangeAt(0), tag);
    emit();
  };
  const isH1 = () => (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'h1';

  const tool = 'size-8 shrink-0 text-muted-foreground hover:text-foreground';
  const keep = (e: React.MouseEvent) => e.preventDefault();

  // Arrow keys move between toolbar buttons (a toolbar is one tab stop's worth of controls).
  const onBarKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    const items = Array.from(bar.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length;
    items[next].focus();
  };

  const toolbar = (
      <div ref={bar} role="toolbar" aria-label="Formatting" aria-orientation="horizontal" onKeyDown={onBarKey} className="mb-2 flex min-w-0 items-center gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
        <IconButton label="Heading" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('formatBlock', isH1() ? 'p' : 'h1')} disabled={disabled}>
          <Heading1 />
        </IconButton>
        <IconButton label="Bold" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('bold')} disabled={disabled}>
          <Bold />
        </IconButton>
        <IconButton label="Italic" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('italic')} disabled={disabled}>
          <Italic />
        </IconButton>
        <IconButton label="Underline" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('underline')} disabled={disabled}>
          <Underline />
        </IconButton>
        <IconButton label="Strikethrough" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('strikeThrough')} disabled={disabled}>
          <Strikethrough />
        </IconButton>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <IconButton label="Bulleted list" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('insertUnorderedList')} disabled={disabled}>
          <List />
        </IconButton>
        <IconButton label="Numbered list" tooltipSide="top" className={tool} onMouseDown={keep} onClick={() => exec('insertOrderedList')} disabled={disabled}>
          <ListOrdered />
        </IconButton>
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <IconButton
          label="Add link"
          tooltipSide="top"
          className={tool}
          onMouseDown={keep}
          disabled={disabled}
          onClick={() => {
            const url = window.prompt('Link URL', 'https://');
            if (url) exec('createLink', url);
          }}
        >
          <Link2 />
        </IconButton>
        <IconButton label="Attach file" tooltipSide="top" className={tool} disabled={disabled} onClick={() => fileRef.current?.click()}>
          <Paperclip />
        </IconButton>
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            onAttach(Array.from(e.target.files ?? []));
            e.target.value = '';
          }}
        />
        </div>
        <DropdownMenu onOpenChange={(open) => { if (!open) setTagQuery(''); }}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 shrink-0 whitespace-nowrap border-[#c5cae9] px-2.5 text-xs font-medium text-[#3f51b5] hover:bg-[#eef0fb] hover:text-[#283593]"
              onMouseDown={() => remember()}
              disabled={disabled}
            >
              @ Insert merge field
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="max-h-80 w-72" onCloseAutoFocus={(e) => e.preventDefault()}>
            <div className="p-2">
              <Input
                value={tagQuery}
                onChange={(event) => setTagQuery(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
                placeholder="Search merge fields"
                aria-label="Search merge fields"
                className="h-8"
              />
            </div>
            {shownTags.map((t) => (
              <DropdownMenuItem key={t} onSelect={() => insertTag(t)} className="flex-col items-start gap-0.5">
                <span className={cn('rounded px-1 text-xs font-medium', TAG_STYLE[t])}>{t}</span>
                <span className="text-xs text-muted-foreground">{TAG_INFO[t]?.short}</span>
              </DropdownMenuItem>
            ))}
            {shownTags.length === 0 && <p className="px-2 py-3 text-center text-xs text-muted-foreground">No matching fields.</p>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      {toolbarTarget ? null : toolbar}
      <div className="flex min-h-[260px] flex-1 flex-col rounded-md border bg-input-background focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        {top}
        <div className="relative min-h-[140px] flex-1">
          {placeholder && !disabled && isEmptyMessage(value) && (
            <p className="pointer-events-none absolute inset-x-3 top-2.5 text-sm leading-6 text-muted-foreground">
              {placeholder}
            </p>
          )}
          <div
            ref={ref}
            contentEditable={!disabled}
            suppressContentEditableWarning
            role="textbox"
            aria-multiline="true"
            aria-label="Email body"
            aria-describedby="tag-hint"
            aria-readonly={disabled || undefined}
            {...ta.listProps}
            onInput={() => {
              emit();
              ta.onInput();
            }}
            onKeyDown={(e) => {
              if (!ta.onKeyDown(e)) td.onKeyDown(e);
            }}
            onClick={td.onClick}
            onBlur={remember}
            className={cn(
              'min-h-[140px] h-full px-3 py-2.5 text-sm leading-6 outline-none',
              '[&_p]:mb-3 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_a]:text-primary [&_a]:underline',
              '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
            )}
          />
        </div>
        {bottom}
      </div>
      {ta.popup}
      {td.popup}
      {below}
      {toolbarTarget ? createPortal(toolbar, toolbarTarget) : null}
    </div>
  );
}

function isEmptyMessage(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() === '';
}
