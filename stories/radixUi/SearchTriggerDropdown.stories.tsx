import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  SearchTriggerDropdown,
  type SearchTriggerDropdownOption,
  type SearchTriggerDropdownConfigItem,
} from '../../libs/ui/radixUi/SearchTriggerDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Radix UI/SearchTriggerDropdown',
  component: SearchTriggerDropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '560px', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    border: { control: 'text' },
    minSearchChars: { control: 'number' },
  },
} satisfies Meta<typeof SearchTriggerDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock APIs per section (simulate network delay)
const mockJobSearch = async (query: string): Promise<SearchTriggerDropdownOption[]> => {
  await new Promise((r) => setTimeout(r, 400));
  if (!query || query.length < 3) return [];
  const all = [
    { id: 'j1', label: 'Registered Nurse - ICU', value: 'rn-icu' },
    { id: 'j2', label: 'Physical Therapist', value: 'pt' },
    { id: 'j3', label: 'Cardiology - Hospital', value: 'card-hospital' },
    { id: 'j4', label: 'General Medicine', value: 'gen-med' },
    { id: 'j5', label: 'Pediatrics', value: 'peds' },

    { id: 'j6', label: 'Emergency Medicine', value: 'emergency-med' },
    { id: 'j7', label: 'Orthopedic Surgeon', value: 'ortho-surg' },
    { id: 'j8', label: 'Dermatology', value: 'derm' },
    { id: 'j9', label: 'Psychiatry', value: 'psych' },
    { id: 'j10', label: 'Radiology', value: 'radiology' },
    { id: 'j11', label: 'Oncology', value: 'oncology' },
    { id: 'j12', label: 'Anesthesiology', value: 'anesthesiology' },
    { id: 'j13', label: 'Family Medicine', value: 'family-med' },
    { id: 'j14', label: 'Neurology', value: 'neurology' },
    { id: 'j15', label: 'Gastroenterology', value: 'gastro' },
    { id: 'j16', label: 'Endocrinology', value: 'endocrinology' },
    { id: 'j17', label: 'Nephrology', value: 'nephrology' },
    { id: 'j18', label: 'Pulmonology', value: 'pulmonology' },
    { id: 'j19', label: 'Urology', value: 'urology' },
    { id: 'j20', label: 'Obstetrics & Gynecology', value: 'obgyn' },
    { id: 'j21', label: 'Ophthalmology', value: 'ophthalmology' },
    { id: 'j22', label: 'ENT - Otolaryngology', value: 'ent' },
    { id: 'j23', label: 'Plastic Surgery', value: 'plastic-surg' },
    { id: 'j24', label: 'Infectious Disease', value: 'infectious-disease' },
    { id: 'j25', label: 'Hematology', value: 'hematology' },
    { id: 'j26', label: 'Rheumatology', value: 'rheumatology' },
    { id: 'j27', label: 'Geriatrics', value: 'geriatrics' },
    { id: 'j28', label: 'Pain Management', value: 'pain-mgmt' },
    { id: 'j29', label: 'Sports Medicine', value: 'sports-med' },
    { id: 'j30', label: 'Critical Care Medicine', value: 'critical-care' },
    { id: 'j31', label: 'Hospitalist', value: 'hospitalist' },
    { id: 'j32', label: 'Nurse Practitioner - Family', value: 'np-family' },
    { id: 'j33', label: 'Nurse Practitioner - Acute Care', value: 'np-acute' },
    { id: 'j34', label: 'Physician Assistant', value: 'pa' },
    { id: 'j35', label: 'Occupational Therapist', value: 'ot' },
    { id: 'j35', label: 'Occupat apist', value: 'ot' },
    { id: 'j35', label: 'Occupatioist Therapist', value: 'ot' },
    { id: 'j36', label: 'Speech Language Pathologist', value: 'slp' },
    { id: 'j37', label: 'Medical Laboratory Technician', value: 'mlt' },
    { id: 'j38', label: 'Pharmacist', value: 'pharmacist' },
    { id: 'j39', label: 'Clinical Psychologist', value: 'clinical-psych' },
    { id: 'j40', label: 'Licensed Practical Nurse', value: 'lpn' },
    { id: 'j41', label: 'Home Health Nurse', value: 'home-health-rn' },
    { id: 'j42', label: 'Dialysis Nurse', value: 'dialysis-rn' },
    { id: 'j43', label: 'Telemetry Nurse', value: 'telemetry-rn' },
    { id: 'j44', label: 'Surgical Technologist', value: 'surg-tech' },
    { id: 'j45', label: 'Medical Assistant', value: 'medical-assistant' },
    { id: 'j46', label: 'Respiratory Therapist', value: 'resp-therapist' },
    { id: 'j47', label: 'Cardiac Sonographer', value: 'cardiac-sono' },
    { id: 'j48', label: 'Radiologic Technologist', value: 'rad-tech' },
    { id: 'j49', label: 'CT Technologist', value: 'ct-tech' },
    { id: 'j50', label: 'MRI Technologist', value: 'mri-tech' },
    { id: 'j51', label: 'Phlebotomist', value: 'phlebotomist' },
    { id: 'j52', label: 'Case Manager - RN', value: 'case-mgr-rn' },
    { id: 'j53', label: 'Clinical Research Coordinator', value: 'crc' },
    { id: 'j54', label: 'Healthcare Administrator', value: 'health-admin' },
    { id: 'j55', label: 'Medical Billing Specialist', value: 'medical-biller' },
  ];

  const q = query.toLowerCase();
  return all.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
};

const mockLocationSearch = async (query: string): Promise<SearchTriggerDropdownOption[]> => {
  await new Promise((r) => setTimeout(r, 350));
  if (!query || query.length < 3) return [];
  const all = [
    { id: 'l1', label: 'New York, NY', value: 'ny' },
    { id: 'l2', label: 'Los Angeles, CA', value: 'la' },
    { id: 'l3', label: 'Chicago, IL', value: 'chi' },
    { id: 'l4', label: 'Houston, TX', value: 'hou' },
    { id: 'l5', label: 'Boston, MA', value: 'bos' },

    { id: 'l6', label: 'San Francisco, CA', value: 'sf' },
    { id: 'l7', label: 'Seattle, WA', value: 'sea' },
    { id: 'l8', label: 'Miami, FL', value: 'mia' },
    { id: 'l9', label: 'Atlanta, GA', value: 'atl' },
    { id: 'l10', label: 'Dallas, TX', value: 'dal' },
    { id: 'l11', label: 'Denver, CO', value: 'den' },
    { id: 'l12', label: 'Phoenix, AZ', value: 'phx' },
    { id: 'l13', label: 'Philadelphia, PA', value: 'phl' },
    { id: 'l14', label: 'San Diego, CA', value: 'sd' },
    { id: 'l15', label: 'Austin, TX', value: 'aus' },
    { id: 'l16', label: 'Portland, OR', value: 'por' },
    { id: 'l17', label: 'Las Vegas, NV', value: 'lv' },
    { id: 'l18', label: 'Orlando, FL', value: 'orl' },
    { id: 'l19', label: 'Charlotte, NC', value: 'clt' },
    { id: 'l20', label: 'Nashville, TN', value: 'nsh' },
    { id: 'l21', label: 'Detroit, MI', value: 'det' },
    { id: 'l22', label: 'Minneapolis, MN', value: 'mpls' },
    { id: 'l23', label: 'Salt Lake City, UT', value: 'slc' },
    { id: 'l24', label: 'Kansas City, MO', value: 'kc' },
    { id: 'l25', label: 'Indianapolis, IN', value: 'indy' },
    { id: 'l26', label: 'Cleveland, OH', value: 'cle' },
    { id: 'l27', label: 'Columbus, OH', value: 'col' },
    { id: 'l28', label: 'Cincinnati, OH', value: 'cin' },
    { id: 'l29', label: 'Milwaukee, WI', value: 'mil' },
    { id: 'l30', label: 'Pittsburgh, PA', value: 'pit' },
    { id: 'l31', label: 'Raleigh, NC', value: 'ral' },
    { id: 'l32', label: 'Richmond, VA', value: 'ric' },
    { id: 'l33', label: 'Baltimore, MD', value: 'bal' },
    { id: 'l34', label: 'Tampa, FL', value: 'tpa' },
    { id: 'l35', label: 'Jacksonville, FL', value: 'jax' },
    { id: 'l36', label: 'Sacramento, CA', value: 'sac' },
    { id: 'l37', label: 'San Antonio, TX', value: 'sa' },
    { id: 'l38', label: 'Oklahoma City, OK', value: 'okc' },
    { id: 'l39', label: 'New Orleans, LA', value: 'nola' },
    { id: 'l40', label: 'Louisville, KY', value: 'lou' },
    { id: 'l41', label: 'Memphis, TN', value: 'mem' },
    { id: 'l42', label: 'Albuquerque, NM', value: 'abq' },
    { id: 'l43', label: 'Birmingham, AL', value: 'bham' },
    { id: 'l44', label: 'Boise, ID', value: 'boi' },
    { id: 'l45', label: 'Charleston, SC', value: 'chs' },
    { id: 'l46', label: 'Hartford, CT', value: 'hart' },
    { id: 'l47', label: 'Providence, RI', value: 'prov' },
    { id: 'l48', label: 'Buffalo, NY', value: 'buf' },
    { id: 'l49', label: 'Rochester, NY', value: 'roc' },
    { id: 'l50', label: 'Honolulu, HI', value: 'hnl' },
    { id: 'l51', label: 'Anchorage, AK', value: 'anc' },
    { id: 'l52', label: 'Madison, WI', value: 'mad' },
    { id: 'l53', label: 'Des Moines, IA', value: 'dm' },
    { id: 'l54', label: 'Little Rock, AR', value: 'lr' },
    { id: 'l55', label: 'Wichita, KS', value: 'wich' },
  ];

  const q = query.toLowerCase();
  return all.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
};

const mockDepartmentSearch = async (query: string): Promise<SearchTriggerDropdownOption[]> => {
  await new Promise((r) => setTimeout(r, 300));
  if (!query || query.length < 3) return [];
  const all = [
    { id: 'd1', label: 'Emergency', value: 'em' },
    { id: 'd2', label: 'Surgery', value: 'surg' },
    { id: 'd3', label: 'Radiology', value: 'rad' },
    { id: 'd4', label: 'Cardiology', value: 'card' },
    { id: 'd5', label: 'Pediatrics', value: 'peds' },
  ];
  const q = query.toLowerCase();
  return all.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));
};

// Gradient border: left pink/purple → center orange/yellow → right blue/teal
const gradientBorderClass = 'bg-[linear-gradient(to_right,_#e8b4d4,_#f5d4a0,_#a8d8ea)]';

/** Config like your spec: Job, Location, Department – each with onSearch and onSelect (no per-section width = equal split) */
const defaultConfig: SearchTriggerDropdownConfigItem[] = [
  {
    id: 'job',
    label: 'Job',
    placeholder: 'Select Job',
    defaultValue: 'XYZ',
    onSearch: mockJobSearch,
    onSelect: (option) => console.log('Job selected:', option),
  },
  {
    id: 'location',
    label: 'Location',
    placeholder: 'Select Location',
    defaultValue: { id: 'l1', label: 'New York, NY', value: 'ny' },
    onSearch: mockLocationSearch,
    onSelect: (option) => console.log('Location selected:', option),
  },
  {
    id: 'department',
    label: 'Department',
    placeholder: 'Select Department',
    onSearch: mockDepartmentSearch,
    onSelect: (option) => console.log('Department selected:', option),
  },
];

/** Config with per-section widths: Job fixed 280px, Location and Department share the rest equally */
const configWithSectionWidths: SearchTriggerDropdownConfigItem[] = [
  {
    id: 'job',
    label: 'Job',
    placeholder: 'Select Job',
    width: '280px',
    defaultValue: { id: 'j1', label: 'Registered Nurse - ICU', value: 'rn-icu' },
    onSearch: mockJobSearch,
    onSelect: (option) => console.log('Job selected:', option),
  },
  {
    id: 'location',
    label: 'Location',
    placeholder: 'Select Location',
    defaultValue: { id: 'l1', label: 'New York, NY', value: 'ny' },
    onSearch: mockLocationSearch,
    onSelect: (option) => console.log('Location selected:', option),
  },
  {
    id: 'department',
    label: 'Department',
    placeholder: 'Select Department',
    onSearch: mockDepartmentSearch,
    onSelect: (option) => console.log('Department selected:', option),
  },
];

export const Default: Story = {
  args: {
    config: defaultConfig,
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    border: '1px solid #d1d5db',
    handleSearch: (sections) => {
      // Example payload when clicking the search icon:
      // [{ id, label, inputValue, selectedOption }]
      // eslint-disable-next-line no-console
      console.log('Search icon click payload:', sections);
    },
  },
};

export const GradientBorder: Story = {
  args: {
    config: defaultConfig,
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    borderClassName: gradientBorderClass,
  },
};

export const CustomWidthAndHeight: Story = {
  args: {
    config: defaultConfig,
    minSearchChars: 3,
    width: '480px',
    height: '48px',
    borderClassName: gradientBorderClass,
  },
};

/** Three filter sections: Job, Location, Department (each with its own API) */
export const ThreeFilters: Story = {
  args: {
    config: defaultConfig,
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    borderClassName: gradientBorderClass,
  },
};

/** Per-section widths: Job has fixed 280px; Location and Department divide the remaining width equally */
export const CustomSectionWidths: Story = {
  args: {
    config: configWithSectionWidths,
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    border: '1px solid #d1d5db',
    handleSearch: (sections) => {
      // eslint-disable-next-line no-console
      console.log('Search icon click payload:', sections);
    },
  },
};

/** Two sections only - with accessible label via aria-labelledby */
export const TwoSections: Story = {
  args: {
    label: 'Search jobs and locations',
    config: [
      {
        id: 'job',
        label: 'Job',
        placeholder: 'Job title, Hospital, Discipline etccc',
        onSearch: mockJobSearch,
        onSelect: (o) => console.log('Job:', o),
        width: '60%',
        disableTrigger: true,
        initialResults: [
          {
            title: 'Recent',
            options: [
              { id: 'r1', label: 'Registered Nurse', value: 'rn' },
              { id: 'r2', label: 'Physical Therapist', value: 'pt' },
            ],
          },
          {
            title: 'Suggestions',
            options: [
              { id: 's1', label: 'Registered Nurse', value: 'rn' },
              { id: 's2', label: 'Physical Therapist', value: 'pt' },
            ],
          },
        ],
        children: (
          <div className="px-3 py-2 text-xs text-gray-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('Search button clicked');
              }}
              aria-label="Search jobs"
              aria-expanded={false}
              tabIndex={0}
              className="focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
            >
              <span>Jobss</span>
            </button>
          </div>
        ),
      },
      {
        id: 'location',
        label: 'Location',
        placeholder: 'Locations',
        onSearch: mockLocationSearch,
        children: (
          <div className="px-3 py-2 text-xs text-gray-500">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('Search button clicked');
              }}
              aria-label="Search locations"
              aria-expanded={false}
              tabIndex={0}
              className="focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
            >
              <span>loccc</span>
            </button>
          </div>
        ),
        initialResults: [
          {
            title: 'Recent',
            options: [
              { id: 'r1', label: 'New York, NY', value: 'ny' },
              { id: 'r2', label: 'Los Angeles, CA', value: 'la' },
            ],
          },
          {
            title: 'Suggestions',
            options: [
              { id: 's1', label: 'New York, NY', value: 'ny' },
              { id: 's2', label: 'Los Angeles, CA', value: 'la' },
            ],
          },
        ],
        onSelect: (o) => console.log('Location:', o),
        width: '40%',
      },
    ],
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    borderClassName: gradientBorderClass,
    handleSearch: (sections) => {
      // Example payload when clicking the search icon:
      // [{ id, label, inputValue, selectedOption }]
      // eslint-disable-next-line no-console
      console.log('Search icon click payload:', sections);
    },
    // handleClear runs only after Search has been clicked at least once
    handleClear: (sections, clearedSectionId) => {
      // eslint-disable-next-line no-console
      console.log('sections:', sections, 'clearedSectionId:', clearedSectionId);
    },
  },
};

/** Default text-only values (no initial selectedOption) */
export const DefaultTextDefaults: Story = {
  args: {
    config: [
      {
        id: 'job',
        label: 'Job',
        placeholder: 'Select Job',
        defaultValue: 'Search jobs...',
        onSearch: mockJobSearch,
        onSelect: (o) => console.log('Job:', o),
      },
      {
        id: 'location',
        label: 'Location',
        placeholder: 'Select Location',
        defaultValue: 'Near me',
        onSearch: mockLocationSearch,
        onSelect: (o) => console.log('Location:', o),
      },
    ],
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    borderClassName: gradientBorderClass,
    handleSearch: (sections) => {
      // eslint-disable-next-line no-console
      console.log('Text-defaults payload:', sections);
    },
  },
};

export const NoResultsDropdownStaysClosed: Story = {
  args: {
    config: [
      {
        id: 'job',
        label: 'Job',
        placeholder: 'Type 3+ chars…',
        onSearch: async () => {
          await new Promise((r) => setTimeout(r, 300));
          return [];
        },
        onSelect: () => {},
      },
      {
        id: 'location',
        label: 'Location',
        placeholder: 'Locations',
        onSearch: async () => [],
        onSelect: () => {},
      },
    ],
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    border: '1px solid #d1d5db',
  },
};

/** Example showing how a consumer can provide and observe an external searchButtonSubmittedRef */
export const WithExternalSearchSubmittedRef: Story = {
  render: (args) => {
    const searchButtonSubmittedRef = React.useRef(false);

    return (
      <SearchTriggerDropdown
        {...args}
        searchButtonSubmittedRef={searchButtonSubmittedRef}
        handleSearch={(sections) => {
          // eslint-disable-next-line no-console
          console.log('Search icon click payload (external ref):', sections);
          // Mark as submitted from the consumer side as well (optional,
          // the component will already set this to true on click).
          searchButtonSubmittedRef.current = true;
        }}
        handleClear={(sections, clearedSectionId) => {
          // eslint-disable-next-line no-console
          console.log(
            'External ref current value:',
            searchButtonSubmittedRef.current,
            'clearedSectionId:',
            clearedSectionId,
            'full payload:',
            sections
          );
        }}
      />
    );
  },
  args: {
    config: defaultConfig,
    minSearchChars: 3,
    width: '100%',
    height: '44px',
    borderClassName: gradientBorderClass,
  },
};
