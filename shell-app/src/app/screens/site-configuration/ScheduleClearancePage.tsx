import { useState, type Dispatch, type SetStateAction } from 'react';
import { BadgeCheck, ChevronDown, FileText, GraduationCap, MapPin, Plus, Trash2, UserRound, Users } from 'lucide-react';
import { notifyInfo, notifySuccess } from '../../components/notify';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { useClearanceRecords } from '../../data/ClearanceRecordsContext';
import { checklistTags, type ClearanceChecklistItem, type TagIcon } from '../../data/prototype/clearanceChecklist';
import { clearanceIconFor } from '../../data/prototype/clearanceLogic';
import { partnersFont } from '../partners/partnersTypography';
import { ChecklistItemEditor } from './ChecklistItemEditor';
import { sc } from './siteConfigurationTokens';

type Draft = ClearanceChecklistItem;

export function ScheduleClearancePage() {
  const { records, checklist, trackingEnabled, checklistHistory, saveChecklist } = useClearanceRecords();
  const [items, setItems] = useState<Draft[]>(checklist);
  const [tracking, setTracking] = useState(trackingEnabled);
  const [editor, setEditor] = useState<Draft | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Draft | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const dirty = tracking !== trackingEnabled || JSON.stringify(items) !== JSON.stringify(checklist);
  const activeCount = items.filter((item) => item.active).length;

  return (
    <div className={`${partnersFont} flex flex-col gap-4 pb-6 pt-1`}>
      <section className={sc.infoCard}>
        <div className={sc.cardHeader}>
          <h1 className={sc.cardTitle}>Schedule Clearance</h1>
        </div>
        <div className={sc.cardBody}>
          <p className="text-[13px] text-[#616161]">
            Track your site’s own steps — badge, system access, parking, orientation — before a student or clinical instructor starts a placement.
          </p>
          <p className="mt-3 rounded-md bg-[#fff8e1] px-3 py-2 text-[13px] text-[#875a00]">
            Changes will apply to all upcoming schedules, regardless of their current clearance status. Previously cleared schedules may revert to Pending if new or updated requirements are introduced.
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold text-[#212121]">Set up clearance tracking</p>
              <p className="text-[12px] text-[#757575]">When off, no clearance icons show.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={tracking}
              aria-label="Set up clearance tracking"
              onClick={() => {
                const next = !tracking;
                setTracking(next);
                notifyInfo(
                  next ? 'Clearance tracking turned on' : 'Clearance tracking turned off',
                  next
                    ? 'Save the page to show icons on schedules.'
                    : 'Save the page to hide clearance icons.',
                );
              }}
              className={`relative h-6 w-11 rounded-full ${tracking ? 'bg-[#3f51b5]' : 'bg-[#d1d5db]'}`}
            >
              <span className={`absolute top-0.5 size-5 rounded-full bg-white transition ${tracking ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </section>

      <section className={sc.infoCard}>
        <div className={sc.cardHeader}>
          <h2 className={sc.cardTitle}>Clearance Requirement Checklist</h2>
          <span className="text-[12px] text-[#757575]">
            {activeCount} active · {items.length - activeCount} inactive
          </span>
        </div>
        <div className={sc.cardBody}>
          <ul className="flex flex-col gap-2 rounded-md bg-[#f5f5f5] p-2">
            {items.map((item, index) => (
              <li key={item.id} className={`rounded-md border border-[#e5e7eb] bg-white px-3 py-3 ${item.active ? '' : 'opacity-60'}`}>
                <div className="grid items-start gap-3 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)]">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#212121]">{item.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {checklistTags(item).map((tag) => (
                        <TagChip key={tag.icon} icon={tag.icon} label={tag.label} tip={tag.tip} applied={tag.applied} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-nowrap items-center justify-end gap-1.5">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.active}
                      aria-label={`${item.active ? 'Deactivate' : 'Activate'} ${item.name}`}
                      onClick={() => {
                        const next = !item.active;
                        setItems((current) => current.map((row) => (row.id === item.id ? { ...row, active: next } : row)));
                        notifyInfo(
                          next ? `${item.name} turned on` : `${item.name} turned off`,
                          next
                            ? 'Save the page to track it on schedules.'
                            : 'Save the page to stop tracking it.',
                        );
                      }}
                      className={`relative h-6 w-11 rounded-full ${item.active ? 'bg-[#3f51b5]' : 'bg-[#d1d5db]'}`}
                    >
                      <span className={`absolute top-0.5 size-5 rounded-full bg-white ${item.active ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <button type="button" className="h-8 shrink-0 whitespace-nowrap rounded-md border border-[#e5e7eb] px-2 text-[12px] text-[#424242]" onClick={() => setEditor(item)}>
                      Advanced settings
                    </button>
                    <button type="button" className="rounded p-1 text-[#616161]" aria-label={`Move ${item.name} up`} disabled={index === 0} onClick={() => move(setItems, index, -1)}>
                      ↑
                    </button>
                    <button type="button" className="rounded p-1 text-[#616161]" aria-label={`Move ${item.name} down`} disabled={index === items.length - 1} onClick={() => move(setItems, index, 1)}>
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      className="rounded p-1 text-[#c62828]"
                      onClick={() => setPendingDelete(item)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1 rounded-md border border-[#3f51b5] px-3 text-[13px] font-medium text-[#3f51b5]"
              onClick={() => setEditor('new')}
            >
              <Plus className="size-4" /> Add checklist item
            </button>
            <div className="flex items-center gap-3">
              {dirty ? <span className="text-[12px] text-[#757575]">Unsaved changes</span> : null}
              <button
                type="button"
                disabled={!dirty}
                className="h-9 rounded-md bg-[#3f51b5] px-4 text-[13px] font-medium text-white disabled:opacity-40"
                onClick={() => {
                  const changed = records.filter((schedule) => schedule.scheduleStatus !== 'Cancelled' && schedule.scheduleStatus !== 'Canceled')
                    .filter((schedule) => clearanceIconFor(schedule, checklist, trackingEnabled) !== clearanceIconFor(schedule, items, tracking)).length;
                  saveChecklist(items, tracking);
                  const noun = changed === 1 ? 'schedule' : 'schedules';
                  notifySuccess('Schedule clearance saved', `Clearance updated on ${changed} upcoming ${noun}.`);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={sc.infoCard}>
        <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left" aria-expanded={historyOpen} onClick={() => setHistoryOpen((open) => !open)}>
          <span className="text-[14px] font-semibold text-[#212121]">Edit history</span>
          <ChevronDown className={`size-4 ${historyOpen ? 'rotate-180' : ''}`} />
        </button>
        {historyOpen ? (
          <ul className="border-t border-[#e5e7eb] px-4 py-3">
            {checklistHistory.map((entry) => (
              <li key={`${entry.when}-${entry.what}`} className="border-b border-[#f3f4f6] py-2 text-[13px] text-[#424242] last:border-0">
                <span className="font-medium text-[#212121]">{entry.who}</span> · {entry.what}
                <span className="mt-0.5 block text-[12px] text-[#757575]">{entry.when}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <ChecklistItemEditor
        draft={editor}
        records={records}
        onOpenChange={(open) => { if (!open) setEditor(null); }}
        onCommit={(next, isNew) => {
          setItems((current) => (isNew ? [...current, next] : current.map((row) => (row.id === next.id ? next : row))));
          if (isNew) notifyInfo('Checklist item added', 'Save the page to apply it to schedules.');
          else notifySuccess('Checklist item updated', 'Save the page to apply it to schedules.');
          setEditor(null);
        }}
      />
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent className={partnersFont}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this checklist item?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.name}” will be removed from the checklist. Save the page to apply that to schedules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep item</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#c62828] text-white hover:bg-[#b71c1c]"
              onClick={() => {
                if (!pendingDelete) return;
                setItems((current) => current.filter((row) => row.id !== pendingDelete.id));
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function move(setItems: Dispatch<SetStateAction<Draft[]>>, index: number, direction: -1 | 1) {
  setItems((current) => {
    const next = [...current];
    const target = index + direction;
    if (target < 0 || target >= next.length) return current;
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    return next;
  });
}

const TAG_ICONS: Record<TagIcon, typeof Users> = {
  exp: Users,
  persona: UserRound,
  loc: MapPin,
  disc: GraduationCap,
  prog: FileText,
  emp: BadgeCheck,
};

function TagChip({
  icon,
  label,
  tip,
  applied,
}: {
  icon: TagIcon;
  label: string;
  tip?: string;
  applied?: boolean;
}) {
  const Icon = TAG_ICONS[icon];
  const className = applied
    ? 'border border-[#c5c8ce] bg-[#f3f4f6] font-medium text-[#212121]'
    : 'border border-transparent bg-[#f3f4f6] font-normal text-[#616161]';
  const chip = (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] ${className}`}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  );
  if (!tip) return chip;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="rounded-full">{chip}</button>
      </TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  );
}
