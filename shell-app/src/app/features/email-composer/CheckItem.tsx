import { Check } from 'lucide-react';
import { DropdownMenuItem } from '../../components/ui/dropdown-menu';
import { cn } from '../../components/ui/utils';

/**
 * Single-choice menu row that marks the current choice with a check on the right, the way the
 * shell's Select does, instead of the radio dot the shell's DropdownMenuRadioItem draws.
 */
export function CheckItem({ selected, onSelect, showCheck = true, className, children }: { selected: boolean; onSelect: () => void; showCheck?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <DropdownMenuItem role="menuitemradio" aria-checked={selected} onSelect={onSelect} className={cn('relative', showCheck && 'pr-8', className)}>
      {children}
      {showCheck && selected && <Check className="absolute right-2 top-2 size-4" />}
    </DropdownMenuItem>
  );
}
