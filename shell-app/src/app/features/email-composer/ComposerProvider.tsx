import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { Sheet } from '../../components/ui/sheet';
import { EmailComposerDrawer } from './EmailComposerDrawer';
import { EmailHistoryDrawer } from './EmailHistoryDrawer';
import type { ComposerContext } from './types';

interface ComposerApi {
  /** Open the composer from any page, handing it that page's context. */
  openComposer: (ctx: ComposerContext) => void;
  /** Open the email history for a page's recipients (a separate drawer from the composer). */
  openHistory: (ctx: ComposerContext) => void;
  closeComposer: () => void;
}

const Ctx = createContext<ComposerApi | null>(null);

export function useEmailComposer(): ComposerApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useEmailComposer must be used inside <ComposerProvider>');
  return api;
}

/** Mount once in a shell. Renders the composer and history drawers. Toasts use the app host. */
export function ComposerProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<ComposerContext | null>(null);
  const [session, setSession] = useState(0);
  const [hist, setHist] = useState<ComposerContext | null>(null);

  const openComposer = useCallback((next: ComposerContext) => {
    setSession((s) => s + 1);
    setHist(null);
    setCtx(next);
  }, []);
  const openHistory = useCallback((next: ComposerContext) => {
    setCtx(null);
    setHist(next);
  }, []);
  const closeComposer = useCallback(() => setCtx(null), []);
  const api = useMemo(() => ({ openComposer, openHistory, closeComposer }), [openComposer, openHistory, closeComposer]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <Sheet open={!!ctx} onOpenChange={() => { /* The composer confirms before it calls closeComposer. */ }}>
        {ctx && <EmailComposerDrawer key={session} ctx={ctx} onClose={closeComposer} />}
      </Sheet>
      <Sheet open={!!hist} onOpenChange={(o) => !o && setHist(null)}>
        {hist && <EmailHistoryDrawer ctx={hist} onCompose={(prefill) => openComposer({ ...hist, prefill })} />}
      </Sheet>
    </Ctx.Provider>
  );
}
