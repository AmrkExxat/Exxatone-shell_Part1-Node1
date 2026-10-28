import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateName: string;
  onConfirm: () => void;
};

export function EmailTemplatesDeleteDialog({
  open,
  onOpenChange,
  templateName,
  onConfirm,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-lg border-[#eceef1] sm:max-w-[440px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[16px] font-semibold text-[#212121]">
            Delete this template?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] text-[#616161]">
            &quot;{templateName}&quot; will be removed from this event. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9 rounded-[6px] border-[#3f51b5] text-[#3f51b5] hover:bg-[#f5f7ff]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-9 rounded-[6px] bg-[#c62828] text-white hover:bg-[#b71c1c]"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
