import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../../components/ui/sheet';
import { isValidEmail, normalizeEmail } from '../../../config/emailSetup';
import type { NotificationRecipient } from '../../../config/notificationPreferences';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { et } from '../email-templates/emailTemplatesTokens';
import { es } from '../email-setup/emailSetupTokens';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleLabel: string;
  recipients: NotificationRecipient[];
  onSave: (next: NotificationRecipient[]) => void;
};

export function RecipientsSheet({ open, onOpenChange, roleLabel, recipients, onSave }: Props) {
  const [rows, setRows] = useState(recipients);
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setRows(recipients);
    setQuery('');
    setEmail('');
    setAdding(false);
    setError(null);
  }, [open, recipients]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (person) =>
        person.name.toLowerCase().includes(needle) || person.email.toLowerCase().includes(needle),
    );
  }, [query, rows]);

  const addExternal = () => {
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError('Enter a valid email address.');
      return;
    }
    const normalized = normalizeEmail(trimmed);
    if (rows.some((person) => normalizeEmail(person.email) === normalized)) {
      setError('That address is already on the list.');
      return;
    }
    setRows((current) => [
      {
        id: `ext-${Date.now()}`,
        name: trimmed,
        email: trimmed,
        kind: 'external',
        selected: true,
        blocked: false,
      },
      ...current,
    ]);
    setEmail('');
    setAdding(false);
    setError(null);
  };

  const save = () => {
    onSave(rows);
    toast.success('Recipients updated.');
    onOpenChange(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setRows(recipients);
        onOpenChange(next);
      }}
    >
      <SheetContent
        className="w-full gap-0 bg-white p-0 sm:max-w-[440px] [&>button]:hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="flex h-full min-h-0 flex-col bg-[#f5f5f5]">
          <SheetHeader className="flex-row items-center gap-3 border-b border-[#eceef1] bg-white px-4 py-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetClose
                  aria-label="Close"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6] text-[#424242] hover:bg-[#e5e7eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
                >
                  <X className="size-4" aria-hidden />
                </SheetClose>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
            <div className="min-w-0 flex-1 text-left">
              <SheetTitle className="text-[16px] font-semibold text-[#212121]">Recipients</SheetTitle>
              <SheetDescription className="text-[13px] text-[#616161]">
                Who receives {roleLabel} notifications.
              </SheetDescription>
            </div>
            <button type="button" className={et.btnPrimary} onClick={save}>
              Save
            </button>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="space-y-4 rounded-[8px] border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_1.5px_rgba(0,0,0,0.08)]">
          <div className={es.controlShell}>
            <div className="flex items-center">
              <Search className="ml-3 size-4 shrink-0 text-[#9e9e9e]" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email..."
                aria-label="Search recipients"
                className={es.textInputInner}
              />
            </div>
          </div>
          {adding ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className={`${es.controlShell} min-w-0 flex-1`}>
                  <input
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError(null);
                    }}
                    placeholder="Add email address..."
                    aria-label="External email address"
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'recipient-email-error' : undefined}
                    className={es.textInputInner}
                  />
                </div>
                <button type="button" className={et.dialogBtnSecondary} onClick={addExternal}>
                  Add
                </button>
              </div>
              {error ? (
                <p id="recipient-email-error" role="alert" className="text-[12px] text-[#c62828]">
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-[14px] font-medium text-[#3f51b5] hover:underline"
              onClick={() => setAdding(true)}
            >
              <Plus className="size-4" aria-hidden />
              Add external recipient
            </button>
          )}
          <ul className="space-y-1">
            {visible.map((person) => (
              <li key={person.id}>
                <label
                  className={`flex items-start gap-3 rounded-[6px] px-2 py-2 ${
                    person.blocked ? 'opacity-70' : 'hover:bg-[#fafafa]'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-[#3f51b5]"
                    checked={person.selected && !person.blocked}
                    disabled={person.blocked}
                    onChange={(event) =>
                      setRows((current) =>
                        current.map((item) =>
                          item.id === person.id ? { ...item, selected: event.target.checked } : item,
                        ),
                      )
                    }
                  />
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-[#212121]">
                      {person.name}
                      {person.kind === 'external' ? (
                        <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] font-medium text-[#616161]">
                          External recipient
                        </span>
                      ) : null}
                    </span>
                    <span className="block text-[12px] text-[#757575]">{person.email}</span>
                    {person.blocked ? (
                      <span className="block text-[12px] text-[#616161]">
                        Has blocked all notifications
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            ))}
            </ul>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
