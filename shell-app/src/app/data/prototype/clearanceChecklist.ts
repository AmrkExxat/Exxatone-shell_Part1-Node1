/** Checklist that drives schedule clearance icons. Edited from Schedule Clearance setup. */

export type ConditionField = 'exp' | 'persona' | 'loc' | 'disc' | 'prog' | 'emp';

export type ClearanceCondition = {
  field: ConditionField;
  values: string[];
};

export type ClearanceChecklistItem = {
  id: string;
  name: string;
  active: boolean;
  conditions: ClearanceCondition[];
};

export type SummarySegment = { text: string; bold?: boolean };
export type TagIcon = ConditionField;

export const EXPERIENCE_OPTIONS = ['Individual', 'Group'];
export const LOCATION_OPTIONS = [
  'Sep Location 1',
  'Memorial Regional Hospital',
  'Regional Health Partners',
  'Providence Medical Center',
  "St. Mary's Medical Center",
  'Community Hospital',
];
export const DISCIPLINE_OPTIONS = ['Art Therapy', 'Nursing', 'Occupational Therapy', 'Physical Therapy'];
export const PROGRAM_OPTIONS = ['BSN', 'Masters', 'DPT', 'Doctoral'];
export const EMPLOYEE_OPTIONS = ['Non-employee', 'Employee'];
export const PERSONA_OPTIONS = ['Student', 'Clinical instructor'];

export const CONDITION_FIELDS: { id: ConditionField; label: string; options: string[] }[] = [
  { id: 'exp', label: 'Experience type', options: EXPERIENCE_OPTIONS },
  { id: 'persona', label: 'Persona', options: PERSONA_OPTIONS },
  { id: 'loc', label: 'Location', options: LOCATION_OPTIONS },
  { id: 'disc', label: 'Discipline', options: DISCIPLINE_OPTIONS },
  { id: 'prog', label: 'Program type', options: PROGRAM_OPTIONS },
  { id: 'emp', label: 'Employee status', options: EMPLOYEE_OPTIONS },
];

const TAG_FIELDS: { field: ConditionField; tone: 'blue' | 'grey'; empty: string }[] = [
  { field: 'exp', tone: 'blue', empty: 'Group & Individual' },
  { field: 'persona', tone: 'blue', empty: 'Student & CI' },
  { field: 'loc', tone: 'grey', empty: 'All' },
  { field: 'disc', tone: 'grey', empty: 'All' },
  { field: 'prog', tone: 'grey', empty: 'All' },
  { field: 'emp', tone: 'grey', empty: 'Employee & Non-employee' },
];

export function fieldLabel(field: ConditionField) {
  return CONDITION_FIELDS.find((row) => row.id === field)?.label ?? field;
}

export function fieldOptions(field: ConditionField) {
  return CONDITION_FIELDS.find((row) => row.id === field)?.options ?? [];
}

const item = (
  id: string,
  name: string,
  conditions: ClearanceCondition[] = [],
  active = true,
): ClearanceChecklistItem => ({ id, name, active, conditions });

const exp = (value: 'Individual' | 'Group'): ClearanceCondition => ({ field: 'exp', values: [value] });

export const clearanceChecklist: ClearanceChecklistItem[] = [
  item('badge', 'Badge Creation', [exp('Individual')]),
  item('workday', 'Access to Workday', [exp('Group'), { field: 'persona', values: ['Student'] }]),
  item('parking', 'Picture for Parking Pass', [
    exp('Individual'),
    { field: 'persona', values: ['Student'] },
    { field: 'loc', values: ['Sep Location 1', 'Community Hospital'] },
  ]),
  item('epic', 'EHR (Epic) Access', [
    exp('Individual'),
    { field: 'disc', values: ['Nursing', 'Occupational Therapy', 'Physical Therapy'] },
  ]),
  item('preceptor', 'Preceptor access in Workday', [
    exp('Group'),
    { field: 'persona', values: ['Clinical instructor'] },
    { field: 'loc', values: ["St. Mary's Medical Center", 'Community Hospital'] },
  ]),
  item('locker', 'Locker assignment', [exp('Individual'), { field: 'loc', values: ['Community Hospital'] }], false),
  item('test', 'Test A - Schedule Clearance Checklist', [
    exp('Group'),
    { field: 'persona', values: ['Clinical instructor'] },
    { field: 'emp', values: ['Employee'] },
  ]),
];

export type ChecklistTag = { tone: 'blue' | 'grey'; icon: TagIcon; label: string; tip?: string; applied?: boolean };

export function valuesOf(row: ClearanceChecklistItem, field: ConditionField) {
  return row.conditions.find((condition) => condition.field === field)?.values ?? [];
}

function displayValues(values: string[], empty: string) {
  if (!values.length) return { text: empty };
  if (values.length === 1) return { text: values[0] };
  if (values.length === 2) return { text: `${values[0]} & ${values[1]}` };
  return { text: `${values[0]}, ${values[1]} +${values.length - 2}`, tip: values.join(', ') };
}

export function checklistTags(row: ClearanceChecklistItem): ChecklistTag[] {
  return TAG_FIELDS.map((tag) => {
    const values = valuesOf(row, tag.field);
    const shown = displayValues(values, tag.empty);
    return {
      tone: tag.tone,
      icon: tag.field,
      label: `${fieldLabel(tag.field)}: ${shown.text}`,
      tip: shown.tip,
      applied: values.length > 0,
    };
  });
}

function joinValues(values: string[]): SummarySegment[] {
  const segments: SummarySegment[] = [];
  values.forEach((value, index) => {
    if (index > 0) segments.push({ text: index === values.length - 1 ? ' or ' : ', ' });
    segments.push({ text: value, bold: true });
  });
  return segments;
}

export function checklistSummary(row: ClearanceChecklistItem): SummarySegment[] {
  const experience = valuesOf(row, 'exp');
  const persona = valuesOf(row, 'persona');
  const individual = !experience.length || experience.includes('Individual');
  const group = !experience.length || experience.includes('Group');
  const segments: SummarySegment[] = [{ text: 'Checked for ' }];
  if (individual) {
    segments.push({ text: 'the student', bold: true }, { text: ' on individual schedules' });
  }
  if (individual && group) segments.push({ text: ', and for ' });
  if (group) {
    let who = 'each member (students and clinical instructors)';
    if (persona.length === 1 && persona[0] === 'Student') who = 'students';
    if (persona.length === 1 && persona[0] === 'Clinical instructor') who = 'clinical instructors';
    segments.push({ text: who, bold: true }, { text: ' on group schedules' });
  }
  segments.push({ text: '. ' });

  const scoped: ConditionField[] = ['loc', 'disc', 'prog'];
  const set = scoped.filter((field) => valuesOf(row, field).length > 0);
  const open = scoped.filter((field) => !valuesOf(row, field).length);
  if (set.length) {
    segments.push({ text: 'Only where ' });
    set.forEach((field, index) => {
      if (index > 0) segments.push({ text: ' and ' });
      segments.push({ text: `${fieldLabel(field).toLowerCase()} is ` }, ...joinValues(valuesOf(row, field)));
    });
    segments.push({ text: '. ' });
  }
  if (open.length) {
    const names = open.map((field) => fieldLabel(field).toLowerCase());
    const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
    segments.push({ text: `At every ${list}.` });
  }
  const employee = valuesOf(row, 'emp');
  if (employee.length === 1) {
    segments.push({ text: ' For ' }, { text: employee[0], bold: true }, { text: ' members only.' });
  }
  return segments;
}
