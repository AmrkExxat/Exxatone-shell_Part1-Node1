import { ChevronDown, CornerUpLeft, CornerUpRight, MoreVertical, Paperclip, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { cn } from '../../components/ui/utils';
import { FooterBlock, HeaderBlock, type FooterKind, type HeaderKind } from './HeaderFooter';
import type { Attachment, ComposerBrand, ComposerRecipient } from './types';

interface Props {
  locked: boolean;
  person: ComposerRecipient | undefined;
  /** Everyone the user can preview as. */
  people: ComposerRecipient[];
  onPick: (id: string) => void;
  subject: string;
  bodyHtml: string;
  hdr: HeaderKind;
  ftr: FooterKind;
  brand: ComposerBrand;
  from: { name: string; email: string; replyTo: string };
  cc: string[];
  attachments: Attachment[];
}

export const formatSize = (bytes: number) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const KIND: Record<string, { label: string; tone: string }> = {
  pdf: { label: 'PDF', tone: 'bg-[#d93025]' },
  doc: { label: 'DOC', tone: 'bg-[#1a73e8]' },
  docx: { label: 'DOC', tone: 'bg-[#1a73e8]' },
  xls: { label: 'XLS', tone: 'bg-[#188038]' },
  xlsx: { label: 'XLS', tone: 'bg-[#188038]' },
};
const kindOf = (name: string) => KIND[name.split('.').pop()?.toLowerCase() ?? ''] ?? { label: 'FILE', tone: 'bg-muted-foreground' };

/**
 * The Preview tab: only the email, laid out like a message in Gmail (subject, sender line with
 * avatar, body, attachment tiles, reply / forward). None of the compose fields are shown.
 */
export function GmailPreview({ locked, person, people, onPick, subject, bodyHtml, hdr, ftr, brand, from, cc, attachments }: Props) {
  if (locked || !person) {
    return <div className="grid flex-1 place-items-center p-10 text-center text-sm text-muted-foreground">Choose who to send to, then you can preview the email.</div>;
  }
  return (
    <div className="flex flex-1 flex-col gap-3 bg-muted/40 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Previewing as
        <Select value={person.id} onValueChange={onPick}>
          <SelectTrigger size="sm" className="h-8 w-auto min-w-48 bg-card text-foreground" aria-label="Preview as">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {people.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <article className="rounded-lg border bg-card px-6 py-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[22px] font-normal leading-7 text-foreground">{subject || '(no subject)'}</h2>
          <span className="mt-1 shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">Inbox</span>
        </div>

        <div className="mt-5 flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-base font-medium text-primary-foreground" aria-hidden>
            {brand.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm">
                  <b className="font-semibold">{from.name}</b> <span className="text-xs text-muted-foreground">&lt;{from.email}&gt;</span>
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  to {person.name}
                  {cc.length > 0 && <>, cc: {cc.join(', ')}</>}
                  <ChevronDown className="size-3.5" />
                </p>
                <p className="text-xs text-muted-foreground">Reply-to: {from.replyTo}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                <span className="mr-1 text-xs">Mon, Nov 2, 9:00 AM</span>
                <Star className="size-4" />
                <CornerUpLeft className="size-4" />
                <MoreVertical className="size-4" />
              </div>
            </div>

            <div className="mt-4 text-sm leading-6 text-foreground">
              {hdr !== 'none' && (
                <div className="mb-4 border-b pb-3">
                  <HeaderBlock kind={hdr} brand={brand} />
                </div>
              )}
              <div className="[&_p]:mb-3 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              {ftr !== 'none' && (
                <div className="mt-4 border-t pt-3">
                  <FooterBlock kind={ftr} brand={brand} />
                </div>
              )}
            </div>

            {attachments.length > 0 && (
              <section className="mt-5 border-t pt-4" aria-label="Attachments">
                <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Paperclip className="size-3.5" /> {attachments.length} {attachments.length === 1 ? 'attachment' : 'attachments'}
                </p>
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-2">
                  {attachments.map((a) => {
                    const k = kindOf(a.name);
                    return (
                      <li key={a.id} className="flex items-center gap-2.5 rounded-lg border bg-card p-2">
                        <span className={cn('grid size-10 shrink-0 place-items-center rounded text-[10px] font-bold text-white', k.tone)}>{k.label}</span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium" title={a.name}>{a.name}</span>
                          <span className="block text-[11px] text-muted-foreground">{formatSize(a.size)}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="h-9 rounded-full px-4" disabled>
                <CornerUpLeft /> Reply
              </Button>
              <Button variant="outline" className="h-9 rounded-full px-4" disabled>
                <CornerUpRight /> Forward
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
