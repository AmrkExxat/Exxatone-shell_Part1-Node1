import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, FileText, Info, Trash2, UserRound, X } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import {
  CONDITION_FIELDS,
  checklistSummary,
  fieldOptions,
  type ClearanceChecklistItem,
  type ClearanceCondition,
  type ConditionField,
} from '../../data/prototype/clearanceChecklist';
import { matchedPeople } from '../../data/prototype/clearanceLogic';
import type { PrototypeScheduleRecord } from '../../data/prototype/scheduleRecords';
import { notifyInfo } from '../../components/notify';
import { partnersFont } from '../partners/partnersTypography';

type Draft = ClearanceChecklistItem;
type EditorCondition = { field: ConditionField | ''; values: string[] };

function savedConditions(rows: EditorCondition[]): ClearanceCondition[] {
  return rows.filter((row): row is ClearanceCondition => row.field !== '' && row.values.length > 0);
}

function editorRows(conditions: ClearanceCondition[]): EditorCondition[] {
  return conditions.map((row) => ({ field: row.field, values: [...row.values] }));
}

const ACTIVE_TIP =
  "Inactive items aren't tracked on upcoming schedules. Schedules that already have the item checked keep their record.";

export function ChecklistItemEditor({
  draft,
  records,
  onOpenChange,
  onCommit,
}: {
  draft: Draft | 'new' | null;
  records: PrototypeScheduleRecord[];
  onOpenChange: (open: boolean) => void;
  onCommit: (item: Draft, isNew: boolean) => void;
}) {
  const isNew = draft === 'new';
  const source = draft && draft !== 'new' ? draft : null;
  if (!draft) return null;
  return (
    <EditorSheet
      key={source?.id ?? 'new'}
      initial={source ?? blankItem()}
      isNew={isNew}
      records={records}
      onClose={() => onOpenChange(false)}
      onCommit={onCommit}
    />
  );
}

function blankItem(): Draft {
  return { id: `item-${Date.now()}`, name: '', active: true, conditions: [] };
}

function snapshot(item: Draft) {
  return JSON.stringify({
    name: item.name.trim(),
    active: item.active,
    conditions: item.conditions.map((condition) => ({ field: condition.field, values: condition.values })),
  });
}

function EditorSheet({
  initial,
  isNew,
  records,
  onClose,
  onCommit,
}: {
  initial: Draft;
  isNew: boolean;
  records: PrototypeScheduleRecord[];
  onClose: () => void;
  onCommit: (item: Draft, isNew: boolean) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [active, setActive] = useState(initial.active);
  const [scope, setScope] = useState<'all' | 'limit'>(initial.conditions.length ? 'limit' : 'all');
  const [conditions, setConditions] = useState<EditorCondition[]>(() => editorRows(initial.conditions));
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const item = useMemo<Draft>(
    () => ({ ...initial, name, active, conditions: scope === 'all' ? [] : savedConditions(conditions) }),
    [active, conditions, initial, name, scope],
  );
  const dirty = snapshot({ ...item, conditions: conditions.filter((row) => row.field !== '').map((row) => ({ field: row.field, values: row.values })) }) !== snapshot(initial);
  const impact = useMemo(() => countImpact(item, records), [item, records]);
  const used = new Set(conditions.map((row) => row.field).filter((field) => field !== ''));
  const filled = conditions.filter((row) => row.values.length > 0).length;
  const individualOnly = conditions.some(
    (row) => row.field === 'exp' && row.values.length === 1 && row.values[0] === 'Individual',
  );
  const problems = submitted ? collectIssues(name, conditions, scope === 'limit') : [];

  function chooseAll() {
    setScope('all');
    setConditions([]);
  }

  function chooseLimit() {
    setScope('limit');
    setConditions((current) => (current.length ? current : [{ field: '', values: [] }]));
  }

  function commit() {
    const found = collectIssues(name, conditions, scope === 'limit');
    if (found.length) {
      setSubmitted(true);
      return;
    }
    onCommit({ ...item, name: name.trim() }, isNew);
  }

  function requestClose() {
    if (dirty) setConfirmClose(true);
    else onClose();
  }

  return (
    <>
      <Sheet open onOpenChange={(open) => { if (!open) requestClose(); }}>
        <SheetContent
          side="right"
          className={`${partnersFont} w-full gap-0 overflow-hidden bg-[#f3f4f6] p-0 sm:max-w-[720px] [&>button]:hidden`}
          onEscapeKeyDown={(event) => {
            if (!dirty) return;
            event.preventDefault();
            setConfirmClose(true);
          }}
          onPointerDownOutside={(event) => {
            if (!dirty) return;
            event.preventDefault();
            setConfirmClose(true);
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3">
              <button type="button" aria-label="Close" onClick={requestClose} className="grid size-9 shrink-0 place-items-center rounded-md bg-[#f3f4f6] text-[#424242]">
                <X className="size-4" />
              </button>
              <div className="min-w-0 flex-1">
                <SheetTitle className="text-[16px] font-semibold text-[#212121]">
                  {isNew ? 'New checklist item' : 'Edit checklist item'}
                </SheetTitle>
                <p className="truncate text-[13px] text-[#757575]">{name.trim() || 'Untitled item'}</p>
              </div>
              <button
                type="button"
                className="h-9 shrink-0 rounded-md bg-[#3f51b5] px-4 text-[13px] font-medium text-white"
                onClick={commit}
              >
                {isNew ? 'Add item' : 'Save item'}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {problems.length ? (
                <div className="mb-3 flex items-start gap-2 rounded-md border border-[#ef9a9a] bg-[#ffebee] px-3 py-2 text-[13px] leading-5 text-[#b71c1c]">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p>Fix {problems.length} {problems.length === 1 ? 'issue' : 'issues'} before saving: {issueHeadline(problems[0])}.</p>
                </div>
              ) : null}
              {bannerOpen ? (
                <div className="flex items-start gap-2 rounded-md bg-[#fff8e1] px-3 py-2 text-[13px] leading-5 text-[#875a00]">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p className="flex-1">
                    Changes will apply to all upcoming schedules, regardless of their current clearance status. Previously cleared schedules may revert to Pending if new or updated requirements are introduced.
                  </p>
                  <button type="button" aria-label="Dismiss notice" className="shrink-0" onClick={() => setBannerOpen(false)}>
                    <X className="size-4" />
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                className="mt-3 flex w-full items-start gap-2 rounded-md bg-[#e8eaf6] px-3 py-2 text-left"
                aria-expanded={summaryOpen}
                onClick={() => setSummaryOpen((open) => !open)}
              >
                <FileText className="mt-0.5 size-4 shrink-0 text-[#3f51b5]" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold tracking-wide text-[#3f51b5]">SUMMARY</span>
                  {summaryOpen ? (
                    <span className="mt-1 block text-[13px] leading-5 text-[#1a237e]">
                      {checklistSummary(item).map((segment, index) =>
                        segment.bold ? <strong key={index}>{segment.text}</strong> : <span key={index}>{segment.text}</span>,
                      )}
                    </span>
                  ) : null}
                </span>
                <ChevronDown className={`mt-0.5 size-4 shrink-0 text-[#3f51b5] ${summaryOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>

              <section className="mt-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3">
                <div className="flex items-end gap-4">
                  <label className="min-w-0 flex-1 text-[13px] font-semibold text-[#212121]">
                    Item name
                    <input
                      value={name}
                      placeholder="For example, Badge Creation"
                      onChange={(event) => setName(event.target.value)}
                      className={`mt-1 h-10 w-full rounded-md border bg-white px-3 text-[14px] font-normal outline-none focus:border-[#3f51b5] ${problems.some((issue) => issue.kind === 'name') ? 'border-[#c62828]' : 'border-[#e5e7eb]'}`}
                    />
                    {problems.some((issue) => issue.kind === 'name') ? (
                      <span className="mt-1 block text-[12px] font-normal text-[#c62828]">Enter an item name.</span>
                    ) : null}
                  </label>
                  <div className="flex shrink-0 flex-col items-start gap-2">
                    <span className="text-[13px] font-semibold text-[#212121]">Active</span>
                    <span className="inline-flex h-10 items-center gap-1.5">
                      <Switch
                        checked={active}
                        onCheckedChange={(next) => {
                          setActive(next);
                          notifyInfo(
                            next ? 'Item marked active' : 'Item marked inactive',
                            'Save the item to keep this change.',
                          );
                        }}
                        aria-label="Active"
                        className="data-[state=checked]:bg-[#3f51b5]"
                      />
                      <InfoTip label="About inactive items" text={ACTIVE_TIP} />
                    </span>
                  </div>
                </div>
              </section>

              <section className="mt-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#212121]">
                    <span className="grid size-7 place-items-center rounded-md bg-[#e8eaf6] text-[#3f51b5]">
                      <UserRound className="size-4" aria-hidden />
                    </span>
                    Applies to
                  </span>
                  <span className="text-[12px] text-[#757575]">
                    {filled} {filled === 1 ? 'condition' : 'conditions'} · {impact.schedules} upcoming {impact.schedules === 1 ? 'schedule' : 'schedules'}
                  </span>
                </div>

                <fieldset className="mt-3">
                  <legend className="sr-only">How this item applies</legend>
                  <label className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="applies-scope"
                      checked={scope === 'all'}
                      onChange={chooseAll}
                      className="mt-0.5 size-3.5 accent-[#3f51b5]"
                    />
                    <span>
                      <span className="block text-[13px] font-medium leading-5 text-[#212121]">Applicable to all</span>
                      <span className="block text-[12px] leading-4 text-[#616161]">This item applies to every upcoming schedule.</span>
                    </span>
                  </label>
                  <label className="mt-3 flex items-start gap-2">
                    <input
                      type="radio"
                      name="applies-scope"
                      checked={scope === 'limit'}
                      onChange={chooseLimit}
                      className="mt-0.5 size-3.5 accent-[#3f51b5]"
                    />
                    <span className="text-[13px] font-medium leading-5 text-[#212121]">Apply condition</span>
                  </label>
                </fieldset>

                {scope === 'limit' ? (
                <div className="mt-3 rounded-lg border border-[#e5e7eb] px-3 py-3">
                  <ul className="flex flex-col gap-3">
                    {conditions.map((condition, index) => {
                      const rowIssue = problems.find((issue) => issue.index === index);
                      return (
                      <li key={`${condition.field || 'open'}-${index}`}>
                        <div className="flex items-start gap-2">
                          <span className="mt-2 w-11 shrink-0 text-[13px] text-[#757575]">{index === 0 ? 'Where' : 'and'}</span>
                          <Select
                            value={condition.field || undefined}
                            onValueChange={(value) =>
                              setConditions((current) =>
                                current.map((row, rowIndex) =>
                                  rowIndex === index ? { field: value as ConditionField, values: [] } : row,
                                ),
                              )
                            }
                          >
                            <SelectTrigger className={`h-9 w-[148px] bg-white ${rowIssue?.kind === 'field' ? 'border-[#c62828]' : 'border-[#e5e7eb]'}`} aria-label="Condition field">
                              <SelectValue placeholder="Choose a field" />
                            </SelectTrigger>
                            <SelectContent className="z-[80]">
                              {CONDITION_FIELDS.filter((field) => field.id === condition.field || !used.has(field.id)).map((field) => (
                                <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex h-9 w-[92px] shrink-0 items-center justify-between rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-2 text-[12px] text-[#9e9e9e]" aria-disabled="true">
                            is any of
                            <ChevronDown className="size-4 shrink-0" aria-hidden />
                          </div>
                          {condition.field ? (
                            <ValuePicker
                              field={condition.field}
                              values={condition.values}
                              individualOnly={individualOnly}
                              invalid={rowIssue?.kind === 'values'}
                              onChange={(values) =>
                                setConditions((current) =>
                                  current.map((row, rowIndex) => {
                                    if (rowIndex === index) return { ...row, values };
                                    if (
                                      condition.field === 'exp' &&
                                      values.length === 1 &&
                                      values[0] === 'Individual' &&
                                      row.field === 'persona'
                                    ) {
                                      return { ...row, values: row.values.filter((value) => value !== 'Clinical instructor') };
                                    }
                                    return row;
                                  }),
                                )
                              }
                            />
                          ) : (
                            <div className="flex h-9 min-w-0 flex-1 items-center justify-between rounded-md border border-[#e5e7eb] bg-[#f3f4f6] px-3 text-[13px] text-[#9e9e9e]">
                              <span className="truncate">Choose a field first</span>
                              <ChevronDown className="size-4 shrink-0" aria-hidden />
                            </div>
                          )}
                          <button
                            type="button"
                            aria-label="Remove condition"
                            className="mt-2 text-[#9e9e9e] hover:text-[#c62828]"
                            onClick={() => setConditions((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        {rowIssue ? (
                          <p className="mt-1.5 ml-[52px] text-[12px] leading-4 text-[#c62828]">{rowIssue.message}</p>
                        ) : null}
                        {condition.field === 'exp' && condition.values.includes('Group') ? (
                          <p className="mt-1.5 ml-[52px] flex items-start gap-1.5 text-[12px] leading-4 text-[#616161]">
                            <Info className="mt-0.5 size-3.5 shrink-0 text-[#757575]" aria-hidden />
                            This applies to the overall group.
                          </p>
                        ) : null}
                        {individualOnly && condition.field === 'persona' ? (
                          <p className="mt-1.5 ml-[52px] flex items-start gap-1.5 text-[12px] leading-4 text-[#616161]">
                            <Info className="mt-0.5 size-3.5 shrink-0 text-[#757575]" aria-hidden />
                            Clinical instructors are only on group schedules.
                          </p>
                        ) : null}
                      </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    className="mt-3 text-[13px] font-medium text-[#3f51b5] disabled:opacity-40"
                    disabled={used.size >= CONDITION_FIELDS.length || conditions.some((row) => row.field === '')}
                    onClick={() => setConditions((current) => [...current, { field: '', values: [] }])}
                  >
                    + Add condition
                  </button>
                </div>
                ) : null}

                <div className="mt-3 overflow-hidden rounded-lg bg-[#f5f6fc]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                    aria-expanded={previewOpen}
                    onClick={() => setPreviewOpen((open) => !open)}
                  >
                    <span className="inline-flex items-start gap-2 text-[13px] text-[#424242]">
                      <UserRound className="mt-0.5 size-4 shrink-0 text-[#757575]" aria-hidden />
                      <span>
                        Applies to <strong>{impact.schedules}</strong> of {impact.total} upcoming schedules
                      </span>
                    </span>
                    <ChevronDown className={`size-4 shrink-0 text-[#616161] ${previewOpen ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                  {previewOpen ? (
                    <div className="border-t border-[#e5e7eb] px-3 py-3">
                      <p className="text-[13px] text-[#424242]">{impact.detail}</p>
                      {impact.rows.length ? (
                        <ul className="mt-3 grid grid-cols-2 gap-3">
                          {impact.rows.map((row) => (
                            <li key={row.schedule.id}>
                              <p className="text-[13px] font-semibold text-[#212121]">
                                {row.schedule.scheduleId} · {row.schedule.kind === 'group' ? 'Group' : 'Individual'}
                              </p>
                              <p className="text-[12px] text-[#616161]">
                                {row.schedule.location} · {row.schedule.discipline} · {row.schedule.programType} — {row.who}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-[13px] text-[#757575]">No schedules match.</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent className={partnersFont}>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              {isNew
                ? "This new item hasn't been added yet. If you close now, it's lost."
                : "Your edits to this item haven't been saved. If you close now, they're lost."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#3f51b5] text-white hover:bg-[#3f51b5]"
              onClick={() => {
                setConfirmClose(false);
                onClose();
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ValuePicker({
  field,
  values,
  individualOnly,
  invalid,
  onChange,
}: {
  field: ConditionField;
  values: string[];
  individualOnly: boolean;
  invalid?: boolean;
  onChange: (values: string[]) => void;
}) {
  const options = fieldOptions(field);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" aria-label={`Values for ${field}`} className={`flex min-h-9 min-w-0 flex-1 flex-wrap items-center gap-1 rounded-md border bg-white px-2 py-1 text-left ${invalid ? 'border-[#c62828]' : 'border-[#e5e7eb]'}`}>
          {values.length ? (
            values.map((value) => (
              <span key={value} className="inline-flex items-center gap-1 rounded-full bg-[#e8eaf6] px-2 py-0.5 text-[12px] font-medium text-[#3f51b5]">
                {value}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${value}`}
                  className="text-[#3f51b5]"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange(values.filter((current) => current !== value));
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    event.stopPropagation();
                    onChange(values.filter((current) => current !== value));
                  }}
                >
                  <X className="size-3" />
                </span>
              </span>
            ))
          ) : (
            <span className="text-[13px] text-[#9e9e9e]">Select</span>
          )}
          <ChevronDown className="ml-auto size-4 shrink-0 text-[#757575]" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-[80] w-64 p-2">
        <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto">
          {options.map((option) => {
            const disabled = individualOnly && field === 'persona' && option === 'Clinical instructor';
            const checked = values.includes(option);
            return (
              <li key={option}>
                <label className={`flex items-center gap-2 rounded px-2 py-1 text-[13px] ${disabled ? 'cursor-not-allowed text-[#9e9e9e]' : 'cursor-pointer hover:bg-[#f5f6fc]'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) =>
                      onChange(event.target.checked ? [...values, option] : values.filter((current) => current !== option))
                    }
                  />
                  {option}
                </label>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" aria-label={label} className="mt-0.5 shrink-0 text-[#757575]" onClick={(event) => event.preventDefault()}>
          <Info className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="z-[80] max-w-[260px] border-0 bg-[#212121] text-left text-white [&>svg]:bg-[#212121] [&>svg]:fill-[#212121]">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function countImpact(item: Draft, records: PrototypeScheduleRecord[]) {
  const upcoming = records.filter((row) => row.scheduleStatus !== 'Cancelled' && row.scheduleStatus !== 'Canceled');
  const probe = { ...item, active: true };
  const rows = upcoming
    .map((schedule) => ({ schedule, people: matchedPeople(probe, schedule) }))
    .filter((row) => row.people.length > 0);
  const students = rows
    .filter((row) => row.schedule.kind === 'individual')
    .reduce((count, row) => count + row.people.filter((person) => person.role === 'student').length, 0);
  const groups = rows.filter((row) => row.schedule.kind === 'group').length;
  return {
    schedules: rows.length,
    total: upcoming.length,
    detail: `checked for ${students} students on individual schedules and once on ${groups} group schedules.`,
    rows: rows.map((row) => {
      if (row.schedule.kind === 'group') {
        const members = row.schedule.people.filter((person) => person.role === 'student' || person.role === 'ci').length;
        return { schedule: row.schedule, who: `group of ${members}` };
      }
      const studentCount = row.people.filter((person) => person.role === 'student').length;
      return { schedule: row.schedule, who: `${studentCount} ${studentCount === 1 ? 'student' : 'students'}` };
    }),
  };
}

type EditorIssue = { kind: 'name' | 'scope' | 'field' | 'values'; index?: number; message: string };

function collectIssues(name: string, conditions: EditorCondition[], limit: boolean): EditorIssue[] {
  const found: EditorIssue[] = [];
  if (!name.trim()) found.push({ kind: 'name', message: 'Enter an item name.' });
  if (!limit) return found;
  if (!savedConditions(conditions).length) {
    found.push({ kind: 'scope', message: 'Add a condition, or choose Applicable to all.' });
  }
  conditions.forEach((row, index) => {
    if (!row.field) found.push({ kind: 'field', index, message: 'Choose a field, or remove this condition.' });
    else if (!row.values.length) found.push({ kind: 'values', index, message: 'Choose at least one value, or remove this condition.' });
  });
  return found;
}

function issueHeadline(issue: EditorIssue) {
  if (issue.kind === 'name') return 'Enter an item name';
  if (issue.kind === 'scope') return 'Add a condition, or choose Applicable to all';
  if (issue.kind === 'field') return 'Choose a field for every condition, or remove it';
  return 'Choose at least one value for every condition, or remove it';
}
