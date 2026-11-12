import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, Building2, Calendar, Download, History, MapPin, MessageSquareText, Star, Stethoscope } from 'lucide-react';
import { useClearanceRecords } from '../../data/ClearanceRecordsContext';
import {
  displayName,
  groupOnboardingStatus,
  memberIconState,
  scheduleClearance,
  studentsOf,
} from '../../data/prototype/clearanceLogic';
import type { SchedulePerson, ScheduleRequirement } from '../../data/prototype/scheduleRecords';
import { partnersFont } from '../partners/partnersTypography';
import { ClearanceDialog } from './ClearanceDialog';
import { MessageDrawer } from './MessageDrawer';
import { ClearanceIconButton, OnboardingPill, personInitials } from './ScheduleStatusBits';

type RequirementRow = ScheduleRequirement & { key: string };

export function ScheduleDetailPage() {
  const { siteId = '', scheduleId = '' } = useParams<{ siteId: string; scheduleId: string }>();
  const [searchParams] = useSearchParams();
  const { records } = useClearanceRecords();
  const schedule = records.find((row) => row.id === scheduleId || row.scheduleId === scheduleId);
  const [picked, setPicked] = useState<{ scheduleId: string; personId: string } | null>(null);
  const [requirementKey, setRequirementKey] = useState<string | null>(null);
  const fallbackPersonId = schedule?.people.find((row) => row.role === 'student')?.id ?? 'school';
  const personId = picked && schedule && picked.scheduleId === schedule.id ? picked.personId : fallbackPersonId;
  const [clearanceFor, setClearanceFor] = useState<string | null | undefined>(undefined);
  const [messageOpen, setMessageOpen] = useState(false);

  const person = schedule?.people.find((row) => row.id === personId);
  const sections = useMemo(() => {
    if (!schedule) return [];
    if (personId === 'school' || !person) {
      return schedule.schoolRequirements.length
        ? [{ label: 'For School', rows: schedule.schoolRequirements.map((row, index) => ({ ...row, key: `sch:${index}` })) }]
        : [];
    }
    if (schedule.kind === 'individual') {
      const blocks: { label: string; rows: RequirementRow[] }[] = [];
      if (schedule.schoolRequirements.length) {
        blocks.push({
          label: 'For School',
          rows: schedule.schoolRequirements.map((row, index) => ({ ...row, key: `sch:${index}` })),
        });
      }
      blocks.push({
        label: 'For Student',
        rows: person.requirements.map((row, index) => ({ ...row, key: `stu:${index}` })),
      });
      return blocks;
    }
    if (person.role === 'ci') {
      return [{ label: 'For Clinical Instructors', rows: person.requirements.map((row, index) => ({ ...row, key: `ci:${index}` })) }];
    }
    return [{ label: 'For Student', rows: person.requirements.map((row, index) => ({ ...row, key: `stu:${index}` })) }];
  }, [person, personId, schedule]);

  const selectedKey = requirementKey && sections.some((section) => section.rows.some((row) => row.key === requirementKey))
    ? requirementKey
    : sections[0]?.rows[0]?.key ?? null;
  const selected = sections.flatMap((section) => section.rows).find((row) => row.key === selectedKey) ?? null;

  if (!schedule) {
    return <p className={`${partnersFont} px-6 py-8 text-[#424242]`}>This schedule is not in the prototype data.</p>;
  }

  const isGroup = schedule.kind === 'group';
  const onboarding = isGroup ? groupOnboardingStatus(schedule) : schedule.people[0].onboardingStatus;
  const heading = isGroup ? displayName(schedule) : (person && personId !== 'school' ? person.name : displayName(schedule));
  const flagged = !isGroup && schedule.people[0].flagged;
  const from = searchParams.get('from');
  const listKind = from === 'all' || from === 'group' || from === 'individual' ? from : isGroup ? 'group' : 'individual';
  const listHref = `/site/${siteId}/schedules/list/${listKind}`;

  return (
    <div className={`${partnersFont} px-6 py-4`}>
      <Link to={listHref} className="inline-flex items-center gap-1 text-[13px] font-medium text-[#3f51b5] hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Schedules and onboarding
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[20px] font-semibold text-[#212121]">{heading}</h1>
            {isGroup ? (
              <span className="rounded-full bg-[#ede7f6] px-2 py-0.5 text-[12px] font-medium text-[#4527a0]">Group</span>
            ) : null}
            <OnboardingPill status={onboarding} />
            <ClearanceIconButton
              state={
                isGroup
                  ? scheduleClearance(schedule).state
                  : schedule.people[0]
                    ? memberIconState(schedule, schedule.people[0])
                    : 'na'
              }
              target={isGroup ? { isGroup: true } : { role: 'student' }}
              note={schedule.clearanceNote}
              onClick={() => setClearanceFor(isGroup ? null : (schedule.people[0]?.id ?? null))}
            />
            {flagged ? (
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#875a00]">
                <Star className="size-3" aria-hidden /> Flagged for Hire
              </span>
            ) : null}
          </div>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[#424242]">
            <span>{schedule.scheduleId}</span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3.5 text-[#757575]" aria-hidden /> {schedule.schoolName}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-[#757575]" aria-hidden /> {schedule.location} | {schedule.address}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5 text-[#757575]" aria-hidden /> {schedule.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <Stethoscope className="size-3.5 text-[#757575]" aria-hidden /> {schedule.discipline}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMessageOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#3f51b5] px-3 text-[13px] font-medium text-white"
        >
          <MessageSquareText className="size-4" aria-hidden />
          Message
        </button>
      </div>
      <div className="mt-4 flex gap-4 border-b border-[#e5e7eb] text-[14px]">
        <span className="border-b-2 border-[#3f51b5] pb-2 font-medium text-[#3f51b5]">Onboarding Details</span>
        <span className="pb-2 text-[#9e9e9e]">Ongoing Activity</span>
        <span className="pb-2 text-[#9e9e9e]">Offboarding Activity</span>
      </div>
      <div className={`mt-4 grid items-start gap-4 ${isGroup ? 'lg:grid-cols-[240px_280px_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'}`}>
        {isGroup ? (
          <PeopleCard
            schedule={schedule}
            personId={personId}
            onOpenClearance={(id) => setClearanceFor(id)}
            onSelect={(id) => {
              setPicked({ scheduleId: schedule.id, personId: id });
              setRequirementKey(null);
            }}
          />
        ) : null}
        <RequirementList
          sections={sections}
          selectedKey={selectedKey}
          onSelect={setRequirementKey}
        />
        <RequirementPanel key={selectedKey ?? 'none'} requirement={selected} />
      </div>
      <ClearanceDialog
        schedule={clearanceFor === undefined ? null : schedule}
        focusPersonId={clearanceFor}
        onOpenChange={(open) => {
          if (!open) setClearanceFor(undefined);
        }}
      />
      <MessageDrawer schedule={messageOpen ? schedule : null} onOpenChange={setMessageOpen} />
    </div>
  );
}

function PeopleCard({
  schedule,
  personId,
  onSelect,
  onOpenClearance,
}: {
  schedule: NonNullable<ReturnType<typeof useClearanceRecords>['records'][number]>;
  personId: string;
  onSelect: (id: string) => void;
  onOpenClearance: (id: string) => void;
}) {
  const schoolPending = schedule.schoolRequirements.some((row) => row.status !== 'Approved');
  return (
    <div className="rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <PersonGroup
        title="Students"
        schedule={schedule}
        people={studentsOf(schedule)}
        selectedId={personId}
        onSelect={onSelect}
        onOpenClearance={onOpenClearance}
      />
      <PersonGroup
        title="Clinical Instructors"
        schedule={schedule}
        people={schedule.people.filter((person) => person.role === 'ci')}
        selectedId={personId}
        onSelect={onSelect}
        onOpenClearance={onOpenClearance}
      />
      <div className="border-t border-[#f3f4f6] p-2">
        <p className="px-2 py-1 text-[12px] font-semibold text-[#616161]">School Requirements</p>
        <button
          type="button"
          onClick={() => onSelect('school')}
          className={`flex w-full rounded-md px-2 py-2 text-left text-[13px] ${personId === 'school' ? 'bg-[#e8eaf6]' : 'hover:bg-[#fafafa]'}`}
        >
          <span>
            <span className="block font-medium text-[#212121]">{schedule.schoolName}</span>
            <span className={schoolPending ? 'text-[#e65100]' : 'text-[#2e7d32]'}>
              {schoolPending ? 'Pending' : 'Approved'}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

function PersonGroup({
  title,
  schedule,
  people,
  selectedId,
  onSelect,
  onOpenClearance,
}: {
  title: string;
  schedule: NonNullable<ReturnType<typeof useClearanceRecords>['records'][number]>;
  people: SchedulePerson[];
  selectedId: string;
  onSelect: (id: string) => void;
  onOpenClearance: (id: string) => void;
}) {
  if (!people.length) return null;
  return (
    <div className="p-2">
      <p className="px-2 py-1 text-[12px] font-semibold text-[#616161]">{title}</p>
      {people.map((person) => (
        <div
          key={person.id}
          className={`flex items-center gap-2 rounded-md px-2 py-2 ${selectedId === person.id ? 'bg-[#e8eaf6]' : ''}`}
        >
          <button type="button" onClick={() => onSelect(person.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white ${
                person.role === 'ci' ? 'bg-[#0f766e]' : 'bg-[#3f51b5]'
              }`}
            >
              {personInitials(person.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-[#212121]">{person.name}</span>
              <OnboardingPill status={person.onboardingStatus} />
            </span>
          </button>
          {schedule.kind === 'group' ? null : (
            <ClearanceIconButton
              state={memberIconState(schedule, person)}
              target={{ role: person.role }}
              note={schedule.clearanceNote}
              onClick={() => onOpenClearance(person.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function RequirementList({
  sections,
  selectedKey,
  onSelect,
}: {
  sections: { label: string; rows: RequirementRow[] }[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  const total = sections.reduce((count, section) => count + section.rows.length, 0);
  return (
    <div className="rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-3 py-3">
        <h2 className="text-[14px] font-semibold text-[#212121]">Onboarding Requirements {total}</h2>
        <span className="text-[11px] text-[#757575]">* Mandatory</span>
      </div>
      {sections.map((section) => (
        <div key={section.label}>
          <p className="bg-[#fafafa] px-3 py-1.5 text-[12px] font-semibold text-[#616161]">{section.label}</p>
          {section.rows.map((row) => (
            <button
              key={row.key}
              type="button"
              onClick={() => onSelect(row.key)}
              className={`flex w-full items-center justify-between gap-2 border-b border-[#f3f4f6] px-3 py-2 text-left ${selectedKey === row.key ? 'bg-[#f5f6fc]' : 'hover:bg-[#fafafa]'}`}
            >
              <span>
                <span className="block text-[13px] text-[#212121]">
                  {row.name}
                  {row.mandatory ? <span className="text-[#c62828]"> *</span> : null}
                </span>
                <span className="block text-[12px] text-[#757575]">Due date {row.due}</span>
              </span>
              <RequirementPill status={row.status} />
            </button>
          ))}
        </div>
      ))}
      {!total ? <p className="px-3 py-4 text-[13px] text-[#616161]">No onboarding requirements on this schedule.</p> : null}
    </div>
  );
}

function RequirementPanel({ requirement }: { requirement: RequirementRow | null }) {
  const [status, setStatus] = useState<ScheduleRequirement['status']>(requirement?.status ?? 'Get Started');
  const [historyOpen, setHistoryOpen] = useState(false);
  if (!requirement) {
    return <div className="rounded-lg bg-white p-4 text-[13px] text-[#616161]">Select a requirement.</div>;
  }
  const fileName = `${requirement.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`;
  return (
    <div className="rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e5e7eb] px-4 py-3">
        <div>
          <h2 className="text-[16px] font-semibold text-[#212121]">{requirement.name}</h2>
          <p className="mt-1 text-[12px] text-[#757575]">
            <RequirementPill status={status} /> <span className="ml-2">Due date {requirement.due}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Requirement status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ScheduleRequirement['status'])}
            className="h-8 rounded-md border border-[#e5e7eb] bg-white px-2 text-[13px]"
          >
            <option>Approved</option>
            <option>Pending Review</option>
            <option>Get Started</option>
          </select>
          <button type="button" className="inline-flex h-8 items-center gap-1 rounded-md border border-[#e5e7eb] px-2 text-[13px] text-[#424242]">
            <Download className="size-3.5" aria-hidden /> Download
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-md border border-[#e5e7eb] px-2 text-[13px] text-[#424242]"
            aria-expanded={historyOpen}
            onClick={() => setHistoryOpen((open) => !open)}
          >
            <History className="size-3.5" aria-hidden /> History
          </button>
        </div>
      </div>
      {historyOpen ? <p className="border-b border-[#e5e7eb] px-4 py-2 text-[12px] text-[#757575]">No review history yet.</p> : null}
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div>
          <h3 className="text-[13px] font-semibold text-[#212121]">Guidelines</h3>
          <ul className="mt-2 list-disc pl-4 text-[13px] leading-5 text-[#424242]">
            <li>Upload the required document or complete the form.</li>
            <li>All documents must be current and legible.</li>
          </ul>
        </div>
        <div className="rounded-md border border-[#e5e7eb] p-3 text-[13px] text-[#424242]">
          <p className="font-medium text-[#212121]">Uploaded document</p>
          <p className="mt-2">
            {status === 'Get Started' ? 'This requirement has not been submitted yet.' : fileName}
          </p>
        </div>
      </div>
    </div>
  );
}

function RequirementPill({ status }: { status: ScheduleRequirement['status'] }) {
  const className =
    status === 'Approved'
      ? 'bg-[#e8f5e9] text-[#1b5e20]'
      : status === 'Pending Review'
        ? 'bg-white text-[#424242] ring-1 ring-[#e5e7eb]'
        : 'bg-[#f3f4f6] text-[#424242]';
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-medium ${className}`}>{status}</span>;
}
