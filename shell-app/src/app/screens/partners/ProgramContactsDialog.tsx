import type { ProgramContact } from '../../config/schoolPartners';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../../components/ui/dialog';
import { partnersType } from './partnersTypography';

type ProgramContactsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: ProgramContact[];
};

export function ProgramContactsDialog({
  open,
  onOpenChange,
  contacts,
}: ProgramContactsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] gap-0 rounded-lg border-[#eceef1] p-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:max-w-[560px] [&>button]:hidden">
        <DialogTitle className={`px-6 pt-6 pb-4 text-left ${partnersType.fieldValue}`}>
          All Contacts
        </DialogTitle>
        <DialogDescription className="sr-only">
          Program contacts for this partner
        </DialogDescription>
        <ul className="max-h-[min(420px,60vh)] overflow-y-auto px-6">
          {contacts.map((contact, index) => (
            <li
              key={contact.id}
              className={`py-4 ${index < contacts.length - 1 ? 'border-b border-[#eceef1]' : ''}`}
            >
              <p className={`${partnersType.fieldValue} font-semibold text-[#212121]`}>
                {contact.name}
              </p>
              <p className="mt-2 text-[14px] leading-5 text-[#424242]">
                Phone: {contact.phone}
              </p>
              <a
                href={`mailto:${contact.email}`}
                className={`mt-1 inline-block ${partnersType.link}`}
              >
                {contact.email}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex justify-end px-6 py-4">
          <Button
            type="button"
            className="h-9 rounded-md bg-[#3f51b5] px-5 text-[14px] font-medium text-white hover:bg-[#3949ab]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
