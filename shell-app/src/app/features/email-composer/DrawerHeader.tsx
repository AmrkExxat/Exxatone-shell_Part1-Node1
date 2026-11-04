import { X } from 'lucide-react';
import { IconButton } from '../../components/ui/icon-button';
import { SheetClose, SheetDescription, SheetTitle } from '../../components/ui/sheet';

interface Props {
  title: string;
  /** Grey chip after the title, like the schedule ID on the Edit Schedule drawer. */
  badge?: string;
  /** Read by screen readers only. */
  description: string;
  /** When set, close asks the drawer instead of dismissing immediately. */
  onClose?: () => void;
  /** Actions on the right of the bar. */
  children?: React.ReactNode;
}

/**
 * Drawer header shared by the composer, history and recipients drawers. Measured from the
 * Exxat One drawers (e.g. Edit Schedule): a 48px white bar, close button on the left, then the
 * title and a grey chip, with the drawer's actions on the right.
 */
export function DrawerHeader({ title, badge, description, onClose, children }: Props) {
  const closeButton = (
    <IconButton label="Close" className="size-8 shrink-0" onClick={onClose}>
      <X className="size-[18px]" />
    </IconButton>
  );
  return (
    <header className="flex max-h-12 min-h-12 shrink-0 items-center justify-between gap-3 border-b bg-card py-3 pl-3 pr-4">
      <div className="flex min-w-0 items-center gap-2">
        {onClose ? closeButton : <SheetClose asChild>{closeButton}</SheetClose>}
        <SheetTitle className="shrink-0 text-base font-medium leading-6">{title}</SheetTitle>
        {badge && <span className="truncate rounded-md bg-gray-200 px-2 py-1 text-xs leading-4 text-foreground">{badge}</span>}
        <SheetDescription className="sr-only">{description}</SheetDescription>
      </div>
      {children && <div className="flex shrink-0 items-center gap-3">{children}</div>}
    </header>
  );
}
