import { useState } from 'react';
import { Building2, MessageSquare, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { groupOnboardingStatus, studentsOf } from '../../data/prototype/clearanceLogic';
import type { PrototypeScheduleRecord, SchedulePerson } from '../../data/prototype/scheduleRecords';
import { partnersFont } from '../partners/partnersTypography';
import { OnboardingPill, ScheduleStatusPill, personInitials } from './ScheduleStatusBits';

type Props = {
  schedule: PrototypeScheduleRecord | null;
  onOpenChange: (open: boolean) => void;
  onShowDetails: () => void;
  onEdit: () => void;
  onMessage: () => void;
};

export function GroupDetailsDrawer({ schedule, onOpenChange, onShowDetails, onEdit, onMessage }: Props) {
  return (
    <Sheet open={!!schedule} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={`${partnersFont} w-full gap-0 overflow-hidden p-0 sm:max-w-[1024px] [&>button]:hidden`}
      >
        {schedule ? (
          <GroupDetailsBody
            key={schedule.id}
            schedule={schedule}
            onClose={() => onOpenChange(false)}
            onShowDetails={onShowDetails}
            onEdit={onEdit}
            onMessage={onMessage}
          />
        ) : (
          <SheetTitle className="sr-only">Group Details</SheetTitle>
        )}
      </SheetContent>
    </Sheet>
  );
}

function GroupDetailsBody({
  schedule,
  onClose,
  onShowDetails,
  onEdit,
  onMessage,
}: {
  schedule: PrototypeScheduleRecord;
  onClose: () => void;
  onShowDetails: () => void;
  onEdit: () => void;
  onMessage: () => void;
}) {
  const students = studentsOf(schedule);
  const instructors = schedule.people.filter((person) => person.role === 'ci');
  const members = [...students, ...instructors];
  const confirmedStudents = schedule.scheduleStatus === 'Confirmed' ? students.length : 0;
  const compliant = members.filter((person) => person.onboardingStatus === 'Compliant').length;
  const schoolDone = schedule.schoolRequirements.every((row) => row.status === 'Approved');
  const instructorLabel = instructors.length === 1 ? '1 instructor' : `${instructors.length} instructors`;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <button type="button" aria-label="Close" onClick={onClose} className="rounded p-1 text-[#424242] hover:bg-[#f3f4f6]">
            <X className="size-4" />
          </button>
          <SheetTitle className="text-[16px] font-semibold text-[#212121]">Group Details</SheetTitle>
          <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#424242]">{schedule.scheduleId}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onShowDetails}
            className="h-8 rounded-md border border-[#d1d5db] bg-white px-3 text-[13px] font-medium text-[#212121] hover:bg-[#f5f5f5]"
          >
            Show schedule details
          </button>
          <button type="button" onClick={onEdit} className="h-8 rounded-md bg-[#3f51b5] px-3 text-[13px] font-medium text-white">
            Edit group
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[16px] font-semibold text-[#212121]">{schedule.title || schedule.scheduleId}</h2>
          <ScheduleStatusPill status={schedule.scheduleStatus} />
          <OnboardingPill status={groupOnboardingStatus(schedule)} />
        </div>
        <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[#424242]">
          <Building2 className="size-4 text-[#757575]" aria-hidden />
          {schedule.schoolName}
        </p>

        <dl className="mt-4 grid gap-3 border-y border-[#e5e7eb] py-3 sm:grid-cols-3">
          <Metric label="Slots filled" value={`${students.length} students · ${instructorLabel}`} />
          <Metric label="Confirmation" value={`${confirmedStudents}/${students.length} students confirmed`} />
          <Metric
            label="Compliance"
            value={`${compliant}/${members.length} members compliant`}
            extra={schoolDone ? 'School requirements: Completed' : 'School requirements: Pending'}
            extraTone={schoolDone ? 'done' : 'pending'}
          />
        </dl>

        <section className="mt-5">
          <h3 className="text-[14px] font-semibold text-[#212121]">Instructors</h3>
          {instructors.length ? (
            <ul className="mt-2 grid gap-3 sm:grid-cols-2">
              {instructors.map((person) => (
                <PersonCard key={person.id} person={person} onMessage={onMessage} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-[13px] text-[#757575]">No clinical instructors on this group.</p>
          )}
        </section>

        <section className="mt-5">
          <h3 className="text-[14px] font-semibold text-[#212121]">Students</h3>
          {students.length ? (
            <div className="mt-2 overflow-x-auto rounded-md border border-[#e5e7eb]">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead className="bg-[#f5f6fc] text-[12px] font-semibold uppercase tracking-wide text-[#616161]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Student</th>
                    <th className="px-3 py-2 font-semibold">Schedule ID</th>
                    <th className="px-3 py-2 font-semibold">Program type</th>
                    <th className="px-3 py-2 font-semibold">Schedule status</th>
                    <th className="px-3 py-2 font-semibold">Onboarding</th>
                    <th className="px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((person) => (
                    <tr key={person.id} className="border-t border-[#f3f4f6]">
                      <td className="px-3 py-2">
                        <span className="block font-medium text-[#212121]">{person.name}</span>
                        <span className="block text-[12px] text-[#757575]">{person.email}</span>
                      </td>
                      <td className="px-3 py-2 text-[#424242]">{schedule.scheduleId}</td>
                      <td className="px-3 py-2 text-[#424242]">{schedule.programType}</td>
                      <td className="px-3 py-2">
                        <ScheduleStatusPill status={schedule.scheduleStatus} />
                      </td>
                      <td className="px-3 py-2">
                        <OnboardingPill status={person.onboardingStatus} />
                      </td>
                      <td className="px-3 py-2">
                        <MessageButton name={person.name} onClick={onMessage} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-[#757575]">No students on this group.</p>
          )}
        </section>

        <Notes note={schedule.clearanceNote} />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  extra,
  extraTone = 'pending',
}: {
  label: string;
  value: string;
  extra?: string;
  extraTone?: 'pending' | 'done';
}) {
  return (
    <div>
      <dt className="text-[12px] font-medium text-[#757575]">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium text-[#212121]">{value}</dd>
      {extra ? (
        <dd className={`mt-1 text-[12px] ${extraTone === 'done' ? 'text-[#2e7d32]' : 'text-[#e65100]'}`}>{extra}</dd>
      ) : null}
    </div>
  );
}

function PersonCard({ person, onMessage }: { person: SchedulePerson; onMessage: () => void }) {
  return (
    <li className="rounded-md border border-[#e5e7eb] p-3">
      <div className="flex items-start gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0f766e] text-[11px] font-semibold text-white">
          {personInitials(person.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-[#212121]">{person.name}</p>
          <p className="text-[12px] text-[#757575]">Clinical instructor</p>
          <p className="mt-1 truncate text-[12px] text-[#616161]">{person.email}</p>
          <div className="mt-2">
            <OnboardingPill status={person.onboardingStatus} />
          </div>
        </div>
        <MessageButton name={person.name} onClick={onMessage} />
      </div>
    </li>
  );
}

function MessageButton({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`Message about ${name}`}
      onClick={onClick}
      className="rounded p-1 text-[#424242] hover:bg-[#f3f4f6]"
    >
      <MessageSquare className="size-4" aria-hidden />
    </button>
  );
}

function Notes({ note }: { note?: string }) {
  const [tab, setTab] = useState<'internal' | 'shared'>('internal');
  return (
    <section className="mt-5 rounded-md border border-[#e5e7eb]">
      <div className="flex gap-4 border-b border-[#e5e7eb] px-3" role="tablist" aria-label="Notes">
        <NoteTab id="internal" active={tab === 'internal'} onClick={() => setTab('internal')}>
          Internal note
        </NoteTab>
        <NoteTab id="shared" active={tab === 'shared'} onClick={() => setTab('shared')}>
          Note to student or school
        </NoteTab>
      </div>
      <div className="px-3 py-3" role="tabpanel">
        <p className="text-[13px] text-[#424242]">
          {tab === 'internal' ? note?.trim() || 'No note added' : 'No note added'}
        </p>
        {tab === 'internal' ? (
          <p className="mt-2 inline-flex rounded bg-[#fff8e1] px-2 py-1 text-[12px] text-[#875a00]">
            Not visible to student or school.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function NoteTab({
  id,
  active,
  onClick,
  children,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      onClick={onClick}
      className={`border-b-2 py-2 text-[13px] ${
        active ? 'border-[#3f51b5] font-medium text-[#3f51b5]' : 'border-transparent text-[#757575]'
      }`}
    >
      {children}
    </button>
  );
}
