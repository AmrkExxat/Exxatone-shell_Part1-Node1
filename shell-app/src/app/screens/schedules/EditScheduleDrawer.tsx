import { useState, type ReactNode } from 'react';
import { Calendar, Info, MapPin, User, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { useClearanceRecords } from '../../data/ClearanceRecordsContext';
import { studentsOf } from '../../data/prototype/clearanceLogic';
import type { PrototypeScheduleRecord } from '../../data/prototype/scheduleRecords';
import { partnersFont } from '../partners/partnersTypography';
import { MessagesPanel } from './MessageDrawer';
import { OnboardingPill, ScheduleStatusPill } from './ScheduleStatusBits';

const DISCIPLINES = ['Art Therapy', 'Nursing', 'Occupational Therapy', 'Physical Therapy'];
const PROGRAMS = ['Masters', 'BSN', 'DPT', 'Doctorate'];
const SHIFTS = ['Day', 'Evening', 'Night'];
const DAY_OPTIONS = ['Mon – Fri', 'Mon – Thu', 'Tue – Fri'];
const SPECIALIZATIONS = [
  'Acute Care',
  'IP-Adult Acute Care',
  'IP-Cardiopulmonary',
  'IP-Home Health',
  'IP-Neurology',
  'Outpatient',
];

type Props = {
  schedule: PrototypeScheduleRecord | null;
  onOpenChange: (open: boolean) => void;
};

export function EditScheduleDrawer({ schedule, onOpenChange }: Props) {
  return (
    <Sheet open={!!schedule} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`${partnersFont} w-full gap-0 overflow-hidden p-0 sm:max-w-[1024px] [&>button]:hidden`}
      >
        {schedule ? (
          <EditScheduleBody key={schedule.id} schedule={schedule} onClose={() => onOpenChange(false)} />
        ) : (
          <SheetTitle className="sr-only">Edit Schedule</SheetTitle>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditScheduleBody({
  schedule,
  onClose,
}: {
  schedule: PrototypeScheduleRecord;
  onClose: () => void;
}) {
  const { patchSchedule } = useClearanceRecords();
  const students = studentsOf(schedule);
  const [discipline, setDiscipline] = useState(schedule.discipline);
  const [programType, setProgramType] = useState(schedule.programType);
  const [shift, setShift] = useState(schedule.shift === '—' ? '' : schedule.shift);
  const [daysOfWeek, setDaysOfWeek] = useState(schedule.daysOfWeek === '—' ? '' : schedule.daysOfWeek);
  const [preceptor, setPreceptor] = useState(schedule.preceptor === '—' || schedule.preceptor === 'Pending' ? '' : schedule.preceptor);
  const [specializations, setSpecializations] = useState<string[]>(['Acute Care']);
  const [specsOpen, setSpecsOpen] = useState(false);
  const [start, setStart] = useState(splitDuration(schedule.durationLabel)[0]);
  const [end, setEnd] = useState(splitDuration(schedule.durationLabel)[1]);
  const [nonConsecutive, setNonConsecutive] = useState(false);
  const [blocks, setBlocks] = useState(false);
  const [noteTab, setNoteTab] = useState<'internal' | 'shared'>('internal');
  const [internalNote, setInternalNote] = useState('');
  const [sharedNote, setSharedNote] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const requestId = schedule.scheduleId.replace(/\D/g, '');

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Close" onClick={onClose} className="rounded p-1 text-[#424242] hover:bg-[#f3f4f6]">
            <X className="size-4" />
          </button>
          <SheetTitle className="text-[16px] font-semibold text-[#212121]">Edit Schedule</SheetTitle>
          <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#424242]">{schedule.scheduleId}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="h-8 rounded-md border border-[#c62828] px-3 text-[13px] font-medium text-[#c62828]"
          >
            Cancel Schedule
          </button>
          <button
            type="button"
            className="h-8 rounded-md bg-[#3f51b5] px-3 text-[13px] font-medium text-white"
            onClick={() => {
              patchSchedule(schedule.id, {
                shift: shift || '—',
                daysOfWeek: daysOfWeek || '—',
                preceptor: preceptor || 'Pending',
              });
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-y-auto px-5 py-4">
          <section className="rounded-lg border border-[#e5e7eb] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[14px] font-medium text-[#3f51b5]">
                {schedule.availability || schedule.title || schedule.scheduleId}
                <span className="ml-2 font-normal text-[#757575]">(Request ID: {requestId})</span>
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ede7f6] px-2 py-0.5 text-[12px] font-medium text-[#4527a0]">
                <User className="size-3.5" aria-hidden />
                {schedule.kind === 'group' ? 'Group' : 'Individual'}
              </span>
            </div>
            <h3 className="mt-4 text-[13px] font-semibold text-[#212121]">Slot Approved Information</h3>
            <ul className="mt-2 flex flex-col gap-1.5 text-[13px] text-[#424242]">
              <li className="inline-flex items-center gap-2">
                <Calendar className="size-4 text-[#757575]" aria-hidden /> Duration : {schedule.durationLabel}
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-[#757575]" aria-hidden /> Locations : {schedule.location}
              </li>
              <li className="inline-flex items-center gap-2">
                <User className="size-4 text-[#757575]" aria-hidden /> Program type : {schedule.programType}
              </li>
            </ul>
            <button type="button" className="mt-3 h-8 rounded-md border border-[#3f51b5] px-3 text-[13px] font-medium text-[#3f51b5]">
              Move Schedule
            </button>
          </section>

          <Field label="Discipline" required>
            <Select value={discipline} onChange={setDiscipline} options={DISCIPLINES} />
          </Field>
          <Field label="Specialization" required>
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-[#e5e7eb] px-3 text-[13px]"
                onClick={() => setSpecsOpen((open) => !open)}
              >
                <span className="truncate text-[#424242]">{specializations.join(', ') || 'Select'}</span>
                <span className="rounded-full bg-[#e8eaf6] px-2 py-0.5 text-[12px] text-[#3f51b5]">{specializations.length}</span>
              </button>
              {specsOpen ? (
                <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-[#e5e7eb] bg-white p-2 shadow-md">
                  {SPECIALIZATIONS.map((item) => (
                    <li key={item}>
                      <label className="flex items-center gap-2 px-1 py-1 text-[13px]">
                        <input
                          type="checkbox"
                          checked={specializations.includes(item)}
                          onChange={(event) =>
                            setSpecializations((current) =>
                              event.target.checked ? [...current, item] : current.filter((row) => row !== item),
                            )
                          }
                        />
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Field>
          <Field label="Program type" required>
            <Select value={programType} onChange={setProgramType} options={PROGRAMS} />
          </Field>
          <Field label="Primary Location" required>
            <div className="flex h-10 items-center gap-2 rounded-md border border-[#e5e7eb] px-3 text-[13px] text-[#424242]">
              <MapPin className="size-4 text-[#757575]" aria-hidden />
              {schedule.location}
            </div>
          </Field>
          <Field
            label="Additional Locations"
            hint="Placements can include more than one location."
          >
            <div className="flex h-10 items-center gap-2 rounded-md border border-[#e5e7eb] px-3 text-[13px] text-[#9e9e9e]">
              <MapPin className="size-4" aria-hidden />
              Select Location(s)
            </div>
          </Field>
          <Field label="Preceptors">
            <div className="flex h-10 items-center gap-2 rounded-md border border-[#e5e7eb] px-3">
              <User className="size-4 text-[#757575]" aria-hidden />
              <input
                value={preceptor}
                onChange={(event) => setPreceptor(event.target.value)}
                placeholder="Select Preceptor"
                className="w-full bg-transparent text-[13px] outline-none"
              />
            </div>
          </Field>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <DateField label="Placement start date" value={start} onChange={setStart} />
            <DateField label="Placement end date" value={end} onChange={setEnd} />
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-[13px] text-[#424242]">
            Set Non-Consecutive Dates
            <input type="checkbox" checked={nonConsecutive} onChange={(event) => setNonConsecutive(event.target.checked)} />
          </label>
          <h3 className="mt-5 text-[13px] font-semibold text-[#212121]">Shift Details</h3>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Field label="Shift">
              <Select value={shift} onChange={setShift} options={SHIFTS} placeholder="Please select a option" />
            </Field>
            <Field label="Days of week">
              <Select value={daysOfWeek} onChange={setDaysOfWeek} options={DAY_OPTIONS} placeholder="Please select a option" />
            </Field>
          </div>

          <section className="mt-5 rounded-lg border border-[#e5e7eb] p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[14px] font-semibold text-[#212121]">Student Details</h3>
              <span className="flex items-center gap-2">
                <ScheduleStatusPill status={schedule.scheduleStatus} />
                <OnboardingPill status={students[0]?.onboardingStatus ?? 'Not Started'} />
              </span>
            </div>
            {students.map((student) => {
              const [first, ...rest] = student.name.split(' ');
              return (
                <div key={student.id} className="mt-4 border-t border-[#f3f4f6] pt-3">
                  <p className="text-[14px] font-medium text-[#3f51b5]">{student.name}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Field label="First Name" required>
                      <input defaultValue={first} className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-[13px]" />
                    </Field>
                    <Field label="Last Name" trailing={<span className="text-[13px] font-medium text-[#c62828]">Remove</span>}>
                      <input defaultValue={rest.join(' ')} className="h-10 w-full rounded-md border border-[#e5e7eb] px-3 text-[13px]" />
                    </Field>
                  </div>
                  <Field label="Email" required>
                    <input readOnly value={student.email} className="h-10 w-full rounded-md border border-[#e5e7eb] bg-[#fafafa] px-3 text-[13px]" />
                  </Field>
                  <Field label="Graduation Date">
                    <div className="flex h-10 items-center rounded-md border border-[#e5e7eb] px-3">
                      <input defaultValue="Oct 2026" className="w-full bg-transparent text-[13px] outline-none" />
                      <Calendar className="size-4 text-[#757575]" aria-hidden />
                    </div>
                  </Field>
                </div>
              );
            })}
          </section>

          <section className="mt-4 rounded-lg border border-[#e5e7eb] p-4">
            <label className="flex items-center justify-between gap-3 text-[14px] font-medium text-[#212121]">
              Schedule Blocks
              <input type="checkbox" checked={blocks} onChange={(event) => setBlocks(event.target.checked)} />
            </label>
            <p className="mt-1 text-[12px] text-[#757575]">
              Schedule blocks when placements vary by date, location, preceptor, shift, or days of week.
            </p>
          </section>

          <section className="mt-4 rounded-lg border border-[#e5e7eb] p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#212121]">Notes</h3>
              <button type="button" className="text-[13px] font-medium text-[#3f51b5]" onClick={() => setEditingNote((open) => !open)}>
                Edit
              </button>
            </div>
            <div className="mt-2 flex gap-4 border-b border-[#e5e7eb] text-[13px]">
              <button type="button" className={noteTab === 'internal' ? 'border-b-2 border-[#3f51b5] pb-2 font-medium text-[#3f51b5]' : 'pb-2 text-[#616161]'} onClick={() => setNoteTab('internal')}>
                Internal note
              </button>
              <button type="button" className={noteTab === 'shared' ? 'border-b-2 border-[#3f51b5] pb-2 font-medium text-[#3f51b5]' : 'pb-2 text-[#616161]'} onClick={() => setNoteTab('shared')}>
                Note to Student or School
              </button>
            </div>
            {editingNote ? (
              <textarea
                value={noteTab === 'internal' ? internalNote : sharedNote}
                onChange={(event) => (noteTab === 'internal' ? setInternalNote(event.target.value) : setSharedNote(event.target.value))}
                rows={3}
                className="mt-3 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-[13px] outline-none"
              />
            ) : (
              <p className="mt-3 text-[13px] text-[#757575]">
                {(noteTab === 'internal' ? internalNote : sharedNote) || 'No note added'}
              </p>
            )}
            {noteTab === 'internal' ? (
              <p className="mt-3 inline-flex rounded-md bg-[#fff6db] px-2 py-1 text-[12px] text-[#875a00]">
                Not visible to student or school.
              </p>
            ) : null}
          </section>
        </div>
        <aside className="hidden border-l border-[#e5e7eb] lg:flex lg:flex-col">
          <h2 className="border-b border-[#e5e7eb] px-4 py-3 text-[14px] font-semibold text-[#212121]">Messages</h2>
          <MessagesPanel schedule={schedule} />
        </aside>
      </div>
      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent className={partnersFont}>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              {schedule.scheduleId} will be marked Cancelled. Clearance icons will no longer show.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep schedule</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#c62828] hover:bg-[#b71c1c]"
              onClick={() => {
                patchSchedule(schedule.id, {
                  scheduleStatus: 'Cancelled',
                  scheduleStatusNote: 'Site: Cancelled',
                });
                onClose();
              }}
            >
              Cancel Schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function splitDuration(label: string) {
  const parts = label.split('–').map((part) => part.trim());
  return [parts[0] ?? '', parts[1] ?? ''] as const;
}

function Field({
  label,
  required,
  hint,
  trailing,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mt-3 block">
      <span className="mb-1 flex items-center gap-1 text-[13px] font-medium text-[#212121]">
        {label}
        {required ? <span className="text-[#c62828]">*</span> : null}
        {hint ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={hint} className="text-[#757575]">
                <Info className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{hint}</TooltipContent>
          </Tooltip>
        ) : null}
        {trailing ? <span className="ml-auto">{trailing}</span> : null}
      </span>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-[13px] text-[#212121]"
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {value && !options.includes(value) ? <option value={value}>{value}</option> : null}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-[#212121]">{label}</span>
      <span className="flex h-10 items-center gap-2 rounded-md border border-[#e5e7eb] px-3">
        <Calendar className="size-4 text-[#757575]" aria-hidden />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-[13px] outline-none" />
        {value ? (
          <button type="button" aria-label={`Clear ${label}`} onClick={() => onChange('')} className="text-[#757575]">
            <X className="size-3.5" />
          </button>
        ) : null}
      </span>
    </label>
  );
}
