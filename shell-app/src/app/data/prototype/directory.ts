/** Schools, locations, and people shared by schedules, partners, email, and availability. */

export const prototypePartnerCategories = [
  'Tier 1',
  'Tier 2',
  'Gold',
  'Silver',
  'Bronze',
  'Prime',
  'Non-Tiered Partner',
] as const;

export type PrototypeContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type PrototypeSchool = {
  id: string;
  name: string;
  alias: string;
  discipline: 'Nursing' | 'Physical Therapy';
  program: string;
  website: string;
  websiteUrl: string;
  address: string;
  state: string;
  cityLabel: string;
  categories: string[];
  contracts: { active: number; expired: number };
  contacts: PrototypeContact[];
};

export type PrototypeLocation = {
  id: string;
  name: string;
  unit: string;
  address: string;
  state: string;
  coordinator: { name: string; email: string };
};

export const prototypeSchools: PrototypeSchool[] = [
  {
    id: 'eastwood-state-university',
    name: 'Eastwood State University',
    alias: 'ESU',
    discipline: 'Physical Therapy',
    program: 'DPT',
    website: 'eastwoodstate.edu',
    websiteUrl: 'https://www.eastwoodstate.edu',
    address: '2500 North Charles Street, Baltimore, Maryland, 21218, US',
    state: 'Maryland',
    cityLabel: 'Baltimore, MD',
    categories: ['Tier 1', 'Gold'],
    contracts: { active: 2, expired: 0 },
    contacts: [
      {
        id: 'esu-mark',
        name: 'Mark Johnson',
        email: 'mark.johnson@eastwoodstate.edu',
        phone: '(410) 555-0184',
      },
      {
        id: 'esu-sarah',
        name: 'Sarah Chen',
        email: 'sarah.chen@eastwoodstate.edu',
        phone: '(410) 555-0185',
      },
    ],
  },
  {
    id: 'harborview-university',
    name: 'Harborview University',
    alias: 'HVU',
    discipline: 'Physical Therapy',
    program: 'DPT',
    website: 'harborview.edu',
    websiteUrl: 'https://www.harborview.edu',
    address: '410 West Lexington Street, Baltimore, Maryland, 21201, US',
    state: 'Maryland',
    cityLabel: 'Baltimore, MD',
    categories: ['Tier 1', 'Prime'],
    contracts: { active: 1, expired: 0 },
    contacts: [
      {
        id: 'hvu-gregory',
        name: 'Gregory Ashford',
        email: 'g.ashford@harborview.edu',
        phone: '(410) 555-0160',
      },
    ],
  },
  {
    id: 'riverside-college-of-nursing',
    name: 'Riverside College of Nursing',
    alias: 'RCN',
    discipline: 'Nursing',
    program: 'BSN',
    website: 'riversidenursing.edu',
    websiteUrl: 'https://www.riversidenursing.edu',
    address: '800 South Caton Avenue, Baltimore, Maryland, 21229, US',
    state: 'Maryland',
    cityLabel: 'Baltimore, MD',
    categories: ['Tier 1', 'Gold'],
    contracts: { active: 3, expired: 1 },
    contacts: [
      {
        id: 'rcn-tasha',
        name: 'Tasha Greene',
        email: 'placements@riversidenursing.edu',
        phone: '(410) 555-0191',
      },
      {
        id: 'rcn-paul',
        name: 'Paul Nguyen',
        email: 'placements@riversidenursing.edu',
        phone: '(410) 555-0192',
      },
    ],
  },
  {
    id: 'chesapeake-school-of-nursing',
    name: 'Chesapeake School of Nursing',
    alias: 'CSN',
    discipline: 'Nursing',
    program: 'BSN',
    website: 'chesapeakenursing.edu',
    websiteUrl: 'https://www.chesapeakenursing.edu',
    address: '200 College Parkway, Arnold, Maryland, 21012, US',
    state: 'Maryland',
    cityLabel: 'Arnold, MD',
    categories: ['Tier 2', 'Silver'],
    contracts: { active: 1, expired: 0 },
    contacts: [
      {
        id: 'csn-renee',
        name: 'Renee Alvarez',
        email: 'r.alvarez@chesapeakenursing.edu',
        phone: '(410) 555-0177',
      },
    ],
  },
  {
    id: 'bowie-state-university',
    name: 'Bowie State University',
    alias: 'BSU',
    discipline: 'Nursing',
    program: 'BSN',
    website: 'bowiestate.edu',
    websiteUrl: 'https://www.bowiestate.edu',
    address: '14000 Jericho Park Road, Bowie, Maryland, 20715, US',
    state: 'Maryland',
    cityLabel: 'Bowie, MD',
    categories: ['Tier 2', 'Prime'],
    contracts: { active: 1, expired: 0 },
    contacts: [
      {
        id: 'bsu-renee',
        name: 'Dr. Renee Blackwell',
        email: 'renee.blackwell@bowiestate.edu',
        phone: '(301) 555-0148',
      },
    ],
  },
];

export const prototypeLocations: PrototypeLocation[] = [
  {
    id: 'med-surg',
    name: 'Bedlam Hospital — Medical/Surgical',
    unit: 'Medical/Surgical',
    address: '700 West Pratt Street, Baltimore, Maryland, 21201, US',
    state: 'Maryland',
    coordinator: { name: 'Danielle Price', email: 'danielle.price@bedlamhospital.org' },
  },
  {
    id: 'ed',
    name: 'Bedlam Hospital — Emergency Department',
    unit: 'Emergency Department',
    address: '700 West Pratt Street, Baltimore, Maryland, 21201, US',
    state: 'Maryland',
    coordinator: { name: 'Omar Reyes', email: 'omar.reyes@bedlamhospital.org' },
  },
  {
    id: 'rehab',
    name: 'Bedlam Hospital — Rehabilitation Center',
    unit: 'Rehabilitation',
    address: '214 North Greene Street, Baltimore, Maryland, 21201, US',
    state: 'Maryland',
    coordinator: { name: 'Nina Patel', email: 'nina.patel@bedlamhospital.org' },
  },
  {
    id: 'outpatient',
    name: 'Bedlam Hospital — Outpatient Pavilion',
    unit: 'Outpatient',
    address: '301 West Lombard Street, Baltimore, Maryland, 21201, US',
    state: 'Maryland',
    coordinator: { name: 'Victor Hale', email: 'victor.hale@bedlamhospital.org' },
  },
];

export function schoolByName(name: string): PrototypeSchool | undefined {
  return prototypeSchools.find((school) => school.name === name);
}

export function contactsForSchool(name: string): { name: string; email: string }[] {
  return (schoolByName(name)?.contacts ?? []).map((contact) => ({
    name: contact.name,
    email: contact.email,
  }));
}

export function staffForLocation(name: string): { name: string; email: string } | undefined {
  return prototypeLocations.find((location) => location.name === name)?.coordinator;
}
