import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import RadixDropDown, {
  type DropdownOption,
} from '../../libs/ui/radixUi/RadixDropDown/RadixDropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGlobe } from '@fortawesome/pro-light-svg-icons';

const meta = {
  title: 'Radix UI/RadixDropDown',
  component: RadixDropDown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px', backgroundColor: 'white' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadixDropDown>;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample options
const basicOptions: DropdownOption[] = [
  { value: 'apple', label: 'Apple', id: 'apple' },
  { value: 'banana', label: 'Banana', id: 'banana' },
  { value: 'cherry', label: 'Cherry', id: 'cherry' },
  { value: 'date', label: 'Date', id: 'date' },
  // { value: 'elderberry', label: 'Elderberry is long label and overflow x is auto needed to check', id: 'elderberry' },
  // { value: 'fig', label: 'Fig', id: 'fig' },
  // { value: 'grape', label: 'Grape', id: 'grape' },
  // { value: 'honeydew', label: 'Honeydew',id: 'honeydew' },
  // { value: 'kiwi', label: 'Kiwi',id: 'kiwi' },
  // { value: 'lemon', label: 'Lemon',id: 'lemon' },
  // { value: 'mango', label: 'Mango',id: 'mango' },
  { value: 'nectarine', label: 'Nectarine', id: 'nectarine' },
  { value: 'orange', label: 'Orange', id: 'orange' },
  { value: 'pear', label: 'Pear', id: 'pear' },
  { value: 'pineapple', label: 'Pineapple', id: 'pineapple' },
  { value: 'plum', label: 'Plum', id: 'plum' },
  { value: 'raspberry', label: 'Raspberry', id: 'raspberry' },
  { value: 'strawberry', label: 'Strawberry', id: 'strawberry' },
  { value: 'watermelon', label: 'Watermelon', id: 'watermelon' },
] as DropdownOption[];

const nestedOptions: DropdownOption[] = [
  {
    id: 'north-america',
    value: 'north-america',
    label: 'North America',
    children: [
      { id: 'usa', value: 'usa', label: 'United States' },
      { id: 'canada', value: 'canada', label: 'Canada' },
      { id: 'mexico', value: 'mexico', label: 'Mexico' },
    ],
  },
  {
    id: 'europe',
    value: 'europe',
    label: 'Europe',
    children: [
      { id: 'uk', value: 'uk', label: 'United Kingdom' },
      { id: 'germany', value: 'germany', label: 'Germany' },
      { id: 'france', value: 'france', label: 'France' },
    ],
  },
] as DropdownOption[];

// Pill Style - Single Select (Default)
export const PillSingleSelect: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select Fruit',
    width: '100px',
    id: 'pill-single',
    label: 'Fruit',
    searchable: false,
    dropIcon: faUser,
    onChange: (option) => {
      console.log('Single Select Option:', option);
    },
  },
};

export const PillMultiSelect: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select Fruits',
    multiple: true,
    width: '200px',
    id: 'pill-multi',
    label: 'Fruits',
    searchable: true,
    dropIcon: faUser,
    defaultValue: [basicOptions[0], basicOptions[1]],
    clearable: true,
    addCloseButton: true,
    onChange: (options) => {
      console.log('Multi Select Options:', options);
    },
  },
};

// Pill Style - Nested Multi Select
export const PillNestedSelect: Story = {
  args: {
    options: nestedOptions,
    placeholder: 'Select Country',
    multiple: true,
    width: '200px',
    id: 'pill-nested',
    label: 'Select Country',
    dropIcon: faUser,
    onChange: (options) => {
      console.log('Nested Multi Select Options:', options);
    },
  },
};

// Employer-style contextual menu: title "X is", search, list with icons, clear + close in footer
const employerOptionsWithIcons: DropdownOption[] = [
  {
    id: '1',
    value: 'sandy',
    label: 'SandyPines Adolescent Residential Treatment Center  Treatment Center Treatment Center',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-100 text-xs">
        🌲
      </span>
    ),
  },
  {
    id: '2',
    value: 'magellan',
    label: 'Magellan Health',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-700">
        M
      </span>
    ),
  },
  {
    id: '3',
    value: 'medstar',
    label: 'MedStar Health',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-700">
        M
      </span>
    ),
  },
  {
    id: '4',
    value: 'hca',
    label: 'HCA Healthcare',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-xs font-bold text-red-700">
        +
      </span>
    ),
  },
  {
    id: '5',
    value: 'kaiser',
    label: 'Kaiser Permanente',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs font-bold">
        K
      </span>
    ),
  },
  {
    id: '6',
    value: 'cleveland',
    label: 'Cleveland Clinic',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-xs font-bold text-green-700">
        C
      </span>
    ),
  },
  {
    id: '7',
    value: 'hopkins',
    label: 'Johns Hopkins Medicine',
    icon: (
      <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-700">
        J
      </span>
    ),
  },
];

export const EmployerMultiSelectWithIcons: Story = {
  args: {
    options: employerOptionsWithIcons,
    placeholder: 'Select employer',
    multiple: true,
    variant: 'pill',
    width: '200px',
    id: 'employer-multi',
    label: 'Employer',
    searchable: true,
    searchPlaceholder: 'Search',
    addCloseButton: true,
    onChange: (options) => {
      console.log('Employer options:', options);
    },
  },
};

export const CustomEmployerMultiSelectWithIcons: Story = {
  args: {
    options: employerOptionsWithIcons,
    placeholder: 'Select employer',
    multiple: true,
    variant: 'custom',
    width: '100%',
    id: 'employer-multi',
    label: 'Employer',
    searchable: true,
    searchPlaceholder: 'Search',
    addCloseButton: false,
    onChange: (options) => {
      console.log('Employer options:', options);
    },
  },
};

export const EmployerSingleSelectWithIcons: Story = {
  args: {
    options: employerOptionsWithIcons,
    placeholder: 'Select employer',
    multiple: false,
    variant: 'pill',
    width: '200px',
    id: 'employer-single',
    label: 'Employer',
    searchable: true,
    searchPlaceholder: 'Search',
    addCloseButton: true,
    onChange: (option) => {
      console.log('Employer option:', option);
    },
  },
};
