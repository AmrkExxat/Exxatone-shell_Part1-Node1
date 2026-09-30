export interface CreateAvailabilityLocationRow {
  id: string;
  name: string;
  type: 'Location';
  group: string;
  groupExtra?: number;
  address: string;
  state: string;
}

const DEMO_STATES = ['DC', 'PA', 'MD', 'VA', 'CA', 'TX'] as const;

const GROUP_LABELS = [
  'Test Stream-12',
  'Mohit Group',
  'Consortium Demo Pool',
  'Regional Cohort A',
  'Fall 2026 Placements',
] as const;

function buildLocations(): CreateAvailabilityLocationRow[] {
  const rows: CreateAvailabilityLocationRow[] = [];
  for (let i = 1; i <= 124; i++) {
    const state = DEMO_STATES[i % DEMO_STATES.length];
    const group = GROUP_LABELS[i % GROUP_LABELS.length];
    const extra = i % 4 === 0 ? (i % 3) + 1 : undefined;
    rows.push({
      id: `loc-${i}`,
      name: i === 19 ? '19 - August Location' : `Demo Location ${String(i).padStart(3, '0')}`,
      type: 'Location',
      group: i === 19 ? 'Mohit Group' : group,
      groupExtra: i === 19 ? 1 : extra,
      address:
        i === 19
          ? 'Pennsylvania Avenue NW, DC, Washington, 20500'
          : `${100 + (i % 900)} Demo Plaza, ${state === 'DC' ? 'Washington' : 'Demo City'}, ${state}, ${20000 + i}`,
      state,
    });
  }
  return rows;
}

export const createAvailabilityLocationRows = buildLocations();
