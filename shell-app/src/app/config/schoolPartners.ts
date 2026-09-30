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
export const PARTNER_CATEGORY_OPTIONS = [
  'International Partner29012026174215',
  'premium',
  'Premium2',
  'premium3',
  'Prime',
  'Prod Stream-1',
  'Silver',
  'gold',
  'Non-Tiered Partner',
  'Tier 1',
  'Tier 2',
  'Bronze',
] as const;

export const initialSchoolPartners: SchoolPartner[] = [
  {
    id: 'eastwood-state-university',
    schoolName: 'Eastwood State University',
    aliasName: 'ET',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address:
      '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['International Partner29012026174215', 'gold', 'Tier 1', 'Prime'],
    discipline: 'Physical Therapy',
    state: 'Maharashtra',
    contracts: { active: 5, expired: 1 },
    programContactPrimary: 'Mark Johnsonnn',
    programContactExtra: 2,
    contacts: [
      {
        id: 'c1',
        name: 'Mark Johnsonnn',
        email: 'mark.johnson@eastwood.edu',
        phone: '(555) 123-4567',
      },
      {
        id: 'c2',
        name: 'Sarah Chen',
        email: 'sarah.chen@eastwood.edu',
        phone: '(555) 234-5678',
      },
      {
        id: 'c3',
        name: 'David Miller',
        email: 'david.miller@eastwood.edu',
        phone: '(555) 345-6789',
      },
    ],
  },
  {
    id: 'exxat-qa-pt',
    schoolName: 'Exxat-QA-PT',
    aliasName: 'QA-PT',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['Prime'],
    discipline: 'Physical Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 1 },
    programContactPrimary: 'Mark Johnsonnn',
    programContactExtra: 0,
    contacts: [
      {
        id: 'c1',
        name: 'Mark Johnsonnn',
        email: 'mark.j@exxat-qa.edu',
        phone: '(555) 111-2222',
      },
    ],
  },
  {
    id: 'exxat-qa-ot',
    schoolName: 'Exxat-QA-OT',
    aliasName: 'QA-OT',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['gold', 'Silver', 'Tier 2', 'Bronze', 'Non-Tiered Partner'],
    discipline: 'Occupational Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: '--',
    programContactExtra: 0,
    contacts: [],
  },
  {
    id: 'exxat-qa-pt-2',
    schoolName: 'Exxat-QA-PT',
    aliasName: 'QA-PT-2',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['Bronze', 'Non-Tiered Partner'],
    discipline: 'Physical Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: '--',
    programContactExtra: 0,
    contacts: [],
  },
  {
    id: 'exxat-qa-ot-2',
    schoolName: 'Exxat-QA-OT',
    aliasName: 'QA-OT-2',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['International Partner29012026174215', 'gold', 'Silver', 'Prime'],
    discipline: 'Occupational Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: '--',
    programContactExtra: 0,
    contacts: [],
  },
  {
    id: 'exxat-qa-pt-3',
    schoolName: 'Exxat-QA-PT',
    aliasName: 'QA-PT-3',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['International Partner29012026174215', 'gold', 'Silver', 'Prime'],
    discipline: 'Physical Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: '--',
    programContactExtra: 0,
    contacts: [],
  },
  {
    id: 'exxat-qa-ot-3',
    schoolName: 'Exxat-QA-OT',
    aliasName: 'QA-OT-3',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['International Partner29012026174215', 'gold', 'Silver', 'Prime'],
    discipline: 'Occupational Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: 'Mark Johnsonnn',
    programContactExtra: 2,
    contacts: [
      {
        id: 'c1',
        name: 'Mark Johnsonnn',
        email: 'mark.j@exxat-qa.edu',
        phone: '(555) 111-2222',
      },
    ],
  },
  {
    id: 'exxat-qa-pt-4',
    schoolName: 'Exxat-QA-PT',
    aliasName: 'QA-PT-4',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['International Partner29012026174215', 'gold', 'Silver', 'Prime'],
    discipline: 'Physical Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: 'Mark Johnsonnn',
    programContactExtra: 2,
    contacts: [
      {
        id: 'c1',
        name: 'Mark Johnsonnn',
        email: 'mark.j@exxat-qa.edu',
        phone: '(555) 111-2222',
      },
    ],
  },
  {
    id: 'exxat-qa-ot-4',
    schoolName: 'Exxat-QA-OT',
    aliasName: 'QA-OT-4',
    website: '--',
    websiteUrl: '',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['premium'],
    discipline: 'Occupational Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: 'Mark Johnsonnn',
    programContactExtra: 2,
    contacts: [
      {
        id: 'c1',
        name: 'Mark Johnsonnn',
        email: 'mark.j@exxat-qa.edu',
        phone: '(555) 111-2222',
      },
    ],
  },
  {
    id: 'exxat-qa-pt-5',
    schoolName: 'Exxat-QA-PT',
    aliasName: 'QA-PT-5',
    website: 'exxat.com',
    websiteUrl: 'https://www.exxat.com',
    address: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    addressMeta: '401, 4th Floor, I-Space IT Park, Mumbai Pune Bypass Rd, Bavdhan, Pune, Maharashtra, 411021, US',
    categories: ['International Partner29012026174215', 'gold', 'Silver', 'Prime'],
    discipline: 'Physical Therapy',
    state: 'Maharashtra',
    contracts: { active: 4, expired: 0 },
    programContactPrimary: 'Mark Johnsonnn',
    programContactExtra: 2,
    contacts: [
      {
        id: 'c1',
        name: 'Mark Johnsonnn',
        email: 'mark.j@exxat-qa.edu',
        phone: '(555) 111-2222',
      },
    ],
  },
];
