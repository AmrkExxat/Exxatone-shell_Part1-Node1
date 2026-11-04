import { prototypeLocations } from '../data/prototype/directory';

export interface CreateAvailabilityLocationRow {
  id: string;
  name: string;
  type: 'Location';
  group: string;
  groupExtra?: number;
  address: string;
  state: string;
}

/** Locations a coordinator can publish against — the same units as schedules. */
export const createAvailabilityLocationRows: CreateAvailabilityLocationRow[] = prototypeLocations.map(
  (location) => ({
    id: location.id,
    name: location.name,
    type: 'Location',
    group: location.unit,
    address: location.address,
    state: location.state,
  }),
);
