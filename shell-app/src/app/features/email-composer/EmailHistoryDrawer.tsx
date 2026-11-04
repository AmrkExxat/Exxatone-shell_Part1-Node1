import { PenSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SheetContent } from '../../components/ui/sheet';
import { DrawerHeader } from './DrawerHeader';
import { HistoryPanel } from './HistoryPanel';
import type { ComposerContext, ComposerHistoryItem } from './types';

interface Props {
  ctx: ComposerContext;
  /** Open the composer for this same context, optionally starting from an earlier email. */
  onCompose: (prefill?: ComposerContext['prefill']) => void;
}

/**
 * Email history for a page's recipients. A separate drawer from the composer: pages open it
 * from a row or toolbar action, and it hands off to the composer when the user wants to write.
 */
export function EmailHistoryDrawer({ ctx, onCompose }: Props) {
  const items = ctx.history ?? [];
  const reuse = (h: ComposerHistoryItem) => onCompose({ role: h.role, subject: h.subject, body: h.body });

  return (
    <SheetContent className="w-[520px] gap-0 p-0 sm:max-w-[520px] [&>button.absolute]:hidden">
      <DrawerHeader title="Email history" badge={`${ctx.source}${ctx.subtitle ? ` · ${ctx.subtitle}` : ''}`} description="Earlier emails sent to the recipients on this page.">
        <Button size="sm" className="h-8" onClick={() => onCompose()}>
          <PenSquare /> New email
        </Button>
      </DrawerHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <HistoryPanel items={items} role={null} onReuse={reuse} title={false} />
      </div>
    </SheetContent>
  );
}
