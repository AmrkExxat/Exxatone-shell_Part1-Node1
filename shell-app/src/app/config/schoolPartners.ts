import { prototypePartnerCategories, prototypeSchools } from '../data/prototype/directory';

export interface ProgramContact {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ContractCounts {
  active: number;
  expired: number;
}

export interface SchoolPartner {
  id: string;
  schoolName: string;
  aliasName: string;
  website: string;
  websiteUrl: string;
  address: string;
  addressMeta: string;
  categories: string[];
  discipline: string;
  state: string;
  contracts: ContractCounts;
  programContactPrimary: string;
  programContactExtra: number;
  contacts: ProgramContact[];
}

export function partnerCategoriesSummary(count: number): string {
  if (count === 0) return 'Please select an option';
  if (count === 1) return '1 Category Selected';
  return `${count} Categories Selected`;
}

/** Tenant partner category values (multi-select prototype). */
export const PARTNER_CATEGORY_OPTIONS = prototypePartnerCategories;

export const initialSchoolPartners: SchoolPartner[] = prototypeSchools.map((school) => ({
  id: school.id,
  schoolName: school.name,
  aliasName: school.alias,
  website: school.website,
  websiteUrl: school.websiteUrl,
  address: school.address,
  addressMeta: school.address,
  categories: [...school.categories],
  discipline: school.discipline,
  state: school.state,
  contracts: school.contracts,
  programContactPrimary: school.contacts[0]?.name ?? '--',
  programContactExtra: Math.max(0, school.contacts.length - 1),
  contacts: school.contacts.map((contact) => ({ ...contact })),
}));
