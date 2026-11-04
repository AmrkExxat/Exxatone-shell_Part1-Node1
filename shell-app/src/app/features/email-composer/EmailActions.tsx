import { Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useEmailComposer } from './ComposerProvider';
import type { ComposerContext } from './types';

interface Props {
  /** How many rows the user has selected on the page. Email is disabled at 0. */
  selectedCount: number;
  /** Build the composer context from the current selection (the page's adapter). */
  getSelected: () => ComposerContext;
  /** Noun for the tooltip, e.g. "schedules". */
  noun?: string;
}

/**
 * The page-toolbar entry to the shared email feature. Email history lives with the page's
 * primary action. Drop this into a list toolbar and give it the page's adapter.
 */
export function EmailActions({ selectedCount, getSelected, noun = 'rows' }: Props) {
  const { openComposer } = useEmailComposer();
  return (
    <Button
      variant="outline"
      className="h-[34px] gap-2 rounded border-primary px-3 text-sm font-medium text-primary hover:text-primary"
      disabled={!selectedCount}
      title={selectedCount ? `Email the selected ${noun}` : `Select ${noun} to email`}
      onClick={() => openComposer(getSelected())}
    >
      <Mail className="size-4" /> Email
    </Button>
  );
}
