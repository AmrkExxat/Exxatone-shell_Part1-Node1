import { History, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useEmailComposer } from './ComposerProvider';
import type { ComposerContext } from './types';

interface Props {
  /** How many rows the user has selected on the page. Email is disabled at 0. */
  selectedCount: number;
  /** Build the composer context from the current selection (the page's adapter). */
  getSelected: () => ComposerContext;
  /** History scope when nothing is selected, e.g. every row on the page. Defaults to the selection. */
  getAll?: () => ComposerContext;
  /** Noun for the tooltip, e.g. "schedules". */
  noun?: string;
}

/**
 * The page-toolbar entry points to the shared email feature: "Email" (needs a selection) and
 * "Email history". Drop it into any list page's toolbar and give it the page's adapter.
 */
export function EmailActions({ selectedCount, getSelected, getAll, noun = 'rows' }: Props) {
  const { openComposer, openHistory } = useEmailComposer();
  return (
    <>
      <Button
        variant="outline"
        className="h-[34px] gap-2 rounded border-primary px-3 text-sm font-medium text-primary hover:text-primary"
        disabled={!selectedCount}
        title={selectedCount ? `Email the selected ${noun}` : `Select ${noun} to email`}
        onClick={() => openComposer(getSelected())}
      >
        <Mail className="size-4" /> Email
      </Button>
      <Button variant="outline" className="h-[34px] gap-2 rounded px-3 text-sm font-normal" onClick={() => openHistory(selectedCount || !getAll ? getSelected() : getAll())}>
        <History className="size-4" /> Email history
      </Button>
    </>
  );
}
