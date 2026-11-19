import { useMemo, useState } from 'react';
import { ChevronDown, Clipboard, ClipboardCheck, Info, Paperclip, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../../components/ui/dialog';
import { useClearanceRecords } from '../../data/ClearanceRecordsContext';
import type { ClearanceChecklistItem } from '../../data/prototype/clearanceChecklist';
import { clearancePeople, groupItemSections, groupItems, personItems, studentsOf } from '../../data/prototype/clearanceLogic';
import type { PrototypeScheduleRecord } from '../../data/prototype/scheduleRecords';
import { partnersFont } from '../partners/partnersTypography';

type Props = {
  schedule: PrototypeScheduleRecord | null;
  /** Person expanded first when this is a group checklist. */
  focusPersonId?: string | null;
  onOpenChange: (open: boolean) => void;
};

export function ClearanceDialog({ schedule, focusPersonId, onOpenChange }: Props) {
  return (
    <Dialog open={!!schedule} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${partnersFont} flex max-h-[85vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[560px]`}
      >
        {schedule ? (
          <ClearanceDialogBody
            key={`${schedule.id}:${focusPersonId ?? 'all'}`}
            schedule={schedule}
            focusPersonId={focusPersonId ?? null}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <DialogTitle className="sr-only">Schedule clearance</DialogTitle>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ClearanceDialogBody({
  schedule,
  focusPersonId,
  onClose,
}: {
  schedule: PrototypeScheduleRecord;
  focusPersonId: string | null;
  onClose: () => void;
}) {
  const { saveClearance } = useClearanceRecords();
  const isGroup = schedule.kind === 'group';
  const people = clearancePeople(schedule);
  const subject = isGroup ? null : (people.find((person) => person.id === focusPersonId) ?? people[0] ?? null);
  const items = isGroup ? groupItems(schedule) : subject ? personItems(schedule, subject) : [];
  const sections = isGroup ? groupItemSections(schedule) : null;
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const next: Record<string, boolean> = {};
    if (isGroup) {
      items.forEach((item) => {
        next[item.id] = schedule.groupClearance[item.id]?.status === 'Completed';
      });
      return next;
    }
    if (subject) {
      items.forEach((item) => {
        next[item.id] = subject.clearance[item.id]?.status === 'Completed';
      });
    }
    return next;
  });
  const [note, setNote] = useState(schedule.clearanceNote ?? '');
  const [files, setFiles] = useState<string[]>(schedule.clearanceFiles);
  const [historyOpen, setHistoryOpen] = useState(false);

  const initial = useMemo(() => {
    const snapshot: Record<string, boolean> = {};
    items.forEach((item) => {
      const entry = isGroup ? schedule.groupClearance[item.id] : subject?.clearance[item.id];
      snapshot[item.id] = entry?.status === 'Completed';
    });
    return snapshot;
  }, [isGroup, items, schedule.groupClearance, subject]);

  const dirty =
    note.trim() !== (schedule.clearanceNote ?? '') ||
    files.join('|') !== schedule.clearanceFiles.join('|') ||
    JSON.stringify(checked) !== JSON.stringify(initial);

  const done = items.filter((item) => checked[item.id]).length;
  const complete = items.length > 0 && done === items.length;
  const title = isGroup ? 'Group Clearance' : subject?.role === 'ci' ? 'Instructor Clearance' : 'Student Clearance';
  const who = isGroup ? schedule.title || schedule.scheduleId : subject?.name;
  const StatusIcon = complete ? ClipboardCheck : Clipboard;
  const chip = isGroup
    ? complete
      ? `Group is cleared · ${done} of ${items.length} items`
      : `Clearance pending · ${done} of ${items.length} items`
    : complete
      ? `Cleared · ${done} of ${items.length} items`
      : `Clearance pending · ${done} of ${items.length} items`;

  return (
    <>
      <div className="border-b border-[#e5e7eb] px-5 py-4 pr-12">
        <div className="flex items-center gap-2">
          <DialogTitle className="text-[18px] font-semibold text-[#212121]">{title}</DialogTitle>
          <span
            className={`inline-grid size-7 place-items-center rounded-md border ${
              complete
                ? 'border-[#a5d6a7] bg-[#e8f5e9] text-[#1b5e20]'
                : 'border-[#f1d893] bg-[#fff6db] text-[#875a00]'
            }`}
          >
            <StatusIcon className="size-4" aria-hidden />
          </span>
        </div>
        <p className="mt-1 text-[13px] text-[#616161]">{who} · {schedule.scheduleId}</p>
        <p className="mt-2 text-[13px] text-[#616161]">
          {schedule.schoolName} · {schedule.discipline} · {schedule.durationLabel}
        </p>
        <p
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
            complete ? 'bg-[#e8f5e9] text-[#1b5e20]' : 'bg-[#fff6db] text-[#875a00]'
          }`}
        >
          <StatusIcon className="size-3.5" aria-hidden />
          {chip}
        </p>
        <p className="mt-2 text-[12px] text-[#757575]">Visible only to your site</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {isGroup && sections ? (
          <GroupChecklist
            schedule={schedule}
            sections={sections}
            checked={checked}
            onToggle={(itemId, value) => setChecked((current) => ({ ...current, [itemId]: value }))}
          />
        ) : subject ? (
          <ItemChecks items={items} checked={checked} onToggle={(itemId, value) => setChecked((current) => ({ ...current, [itemId]: value }))} />
        ) : (
          <p className="text-[13px] text-[#616161]">No clearance items apply to this schedule.</p>
        )}
        <ChecklistNotes
          note={note}
          files={files}
          history={schedule.clearanceHistory}
          historyOpen={historyOpen}
          onNote={setNote}
          onAddFile={() => setFiles((current) => [...current, `clearance-file-${current.length + 1}.pdf`])}
          onRemoveFile={(name) => setFiles((current) => current.filter((file) => file !== name))}
          onToggleHistory={() => setHistoryOpen((open) => !open)}
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-[#e5e7eb] px-5 py-3">
        <button type="button" className="h-9 rounded-md px-3 text-[13px] text-[#424242]" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          disabled={!dirty}
          className="h-9 rounded-md bg-[#3f51b5] px-3 text-[13px] font-medium text-white disabled:opacity-40"
          onClick={() => {
            if (isGroup) {
              saveClearance(schedule.id, {
                items: [],
                groupItems: items.map((item) => ({ itemId: item.id, completed: !!checked[item.id] })),
                note,
                files,
              });
            } else if (subject) {
              saveClearance(schedule.id, {
                items: items.map((item) => ({ personId: subject.id, itemId: item.id, completed: !!checked[item.id] })),
                note,
                files,
              });
            }
            onClose();
          }}
        >
          Save clearance
        </button>
      </div>
    </>
  );
}

function GroupChecklist({
  schedule,
  sections,
  checked,
  onToggle,
}: {
  schedule: PrototypeScheduleRecord;
  sections: ReturnType<typeof groupItemSections>;
  checked: Record<string, boolean>;
  onToggle: (itemId: string, value: boolean) => void;
}) {
  const students = studentsOf(schedule);
  const instructors = schedule.people.filter((person) => person.role === 'ci');
  const [open, setOpen] = useState(false);
  const total = students.length + instructors.length;
  return (
    <div>
      <div className="rounded-lg bg-[#e8eaf6] text-[13px] leading-5 text-[#283593]">
        <button
          type="button"
          className="flex min-h-8 w-full items-center gap-2 px-3 py-2 text-left"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <Info className="size-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            This group has {total} {total === 1 ? 'member' : 'members'}: Students · {students.length}, Clinical instructors · {instructors.length}.
          </span>
          <ChevronDown className={`size-4 shrink-0 ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
        {open ? (
          <div className="px-3 pb-3 pl-9">
            <p>
              <span className="font-medium">Students: </span>
              {students.map((person) => person.name).join(', ') || 'None'}
            </p>
            <p className="mt-1">
              <span className="font-medium">Clinical instructors: </span>
              {instructors.map((person) => person.name).join(', ') || 'None'}
            </p>
            <p className="mt-2">Check each item once for the group. The group is cleared when every item is checked.</p>
          </div>
        ) : null}
      </div>
      {sections.flat ? (
        <div className="mt-4">
          <ItemChecks items={sections.flat} checked={checked} onToggle={onToggle} />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <section>
            <h3 className="text-[13px] font-semibold text-[#212121]">Students</h3>
            <div className="mt-2">
              <ItemChecks items={sections.students ?? []} checked={checked} onToggle={onToggle} />
            </div>
          </section>
          <section>
            <h3 className="text-[13px] font-semibold text-[#212121]">Clinical instructors</h3>
            <div className="mt-2">
              <ItemChecks items={sections.instructors ?? []} checked={checked} onToggle={onToggle} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ItemChecks({
  items,
  checked,
  onToggle,
}: {
  items: ClearanceChecklistItem[];
  checked: Record<string, boolean>;
  onToggle: (itemId: string, value: boolean) => void;
}) {
  if (!items.length) return <p className="text-[13px] text-[#757575]">No items in this section.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.id}>
          <label className="flex items-center gap-2 rounded-md border border-[#e5e7eb] px-3 py-2 text-[14px] text-[#212121]">
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={(event) => onToggle(item.id, event.target.checked)}
            />
            <span className="font-medium">{item.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
function ChecklistNotes({
  note,
  files,
  history,
  historyOpen,
  onNote,
  onAddFile,
  onRemoveFile,
  onToggleHistory,
}: {
  note: string;
  files: string[];
  history: PrototypeScheduleRecord['clearanceHistory'];
  historyOpen: boolean;
  onNote: (value: string) => void;
  onAddFile: () => void;
  onRemoveFile: (name: string) => void;
  onToggleHistory: () => void;
}) {
  return (
    <section className="mt-5 border-t border-[#e5e7eb] pt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-[#212121]">Note and attachments</h3>
        <button
          type="button"
          onClick={onAddFile}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-[#3f51b5]"
        >
          <Paperclip className="size-3.5" aria-hidden />
          Attach
        </button>
      </div>
      <textarea
        value={note}
        onChange={(event) => onNote(event.target.value)}
        rows={3}
        placeholder="Add a note for this checklist"
        className="mt-2 w-full resize-none rounded-md border border-[#e5e7eb] px-3 py-2 text-[13px] text-[#212121] outline-none focus:border-[#3f51b5]"
      />
      {files.length ? (
        <ul className="mt-2 flex flex-wrap gap-2">
          {files.map((file) => (
            <li key={file} className="inline-flex items-center gap-1 rounded-full bg-[#e8eaf6] px-2 py-1 text-[12px] text-[#3f51b5]">
              {file}
              <button type="button" aria-label={`Remove ${file}`} onClick={() => onRemoveFile(file)}>
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between text-[13px] text-[#424242]"
        aria-expanded={historyOpen}
        onClick={onToggleHistory}
      >
        <span className="font-medium">History</span>
        <ChevronDown className={`size-4 ${historyOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {historyOpen ? (
        history.length ? (
          <ul className="mt-2 flex flex-col gap-2">
            {history.map((entry) => (
              <li key={`${entry.when}-${entry.what}`} className="text-[13px] text-[#424242]">
                <span className="font-medium text-[#212121]">{entry.who}</span> · {entry.what}
                <span className="mt-0.5 block text-[12px] text-[#757575]">{entry.when}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[13px] text-[#757575]">No changes yet</p>
        )
      ) : null}
    </section>
  );
}
