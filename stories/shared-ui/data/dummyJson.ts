import {
  faBallot,
  faCalendar,
  faCalendarRange,
  faDollarSign,
  faHospitals,
  faMapMarkerAlt,
} from '@fortawesome/pro-light-svg-icons';

export const dummy = [
  {
    id: 'lenovo',
    label: 'Lenovo',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-1-1',
        label: 'Child 1-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-2',
    label: 'Parent 2',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-2-1',
        label: 'Child 2-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: false,
      },
      {
        id: 'child-2-2',
        label: 'Child 2-2',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: false,
      },
    ],
  },
  {
    id: 'parent-3',
    label: 'Parent 3',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-3-1',
        label: 'Child 3-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
      {
        id: 'child-3-2',
        label: 'Child 3-2',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-4',
    label: 'Parent 4',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [],
  },
  {
    id: 'parent-5',
    label: 'Parent 5',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-5-1',
        label: 'Child 5-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-6',
    label: 'Parent 6',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-6-1',
        label: 'Child 6-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
      {
        id: 'child-6-2',
        label: 'Child 6-2',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-7',
    label: 'Parent 7',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-7-1',
        label: 'Child 7-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-8',
    label: 'Parent 8',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-8-1',
        label: 'Child 8-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
      {
        id: 'child-8-2',
        label: 'Child 8-2',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-9',
    label: 'Parent 9',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-9-1',
        label: 'Child 9-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
  {
    id: 'parent-10',
    label: 'Parent 10',
    checked: false,
    indeterminate: false,
    type: 'parent',
    unncesessaryKey: true,
    children: [
      {
        id: 'child-10-1',
        label: 'Child 10-1',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
      {
        id: 'child-10-2',
        label: 'Child 10-2',
        checked: false,
        indeterminate: false,
        type: 'child',
        unncesessaryKey: true,
      },
    ],
  },
];

export const dummyChipSelect = [
  {
    id: 'published',
    label: 'Published',
    value: 'Published',
    bgColor: '#86EFAC',
    borderColor: '#98F660',
    textColor: '#245512',
  },
  {
    id: 'unublished',
    label: 'Unpublished',
    value: 'Unpublished',
    bgColor: '#E7E7E7',
    borderColor: '#D1D1D1',
    textColor: '#262626',
  },
  {
    id: 'closed',
    label: 'Closed',
    value: 'Closed',
    bgColor: '#FEE2E2',
    borderColor: '#FBA6A7',
    textColor: '#BB1E1F',
  },
];

export const defaultSelectedMulti = [
  {
    value: '22',
    label: 'Option 22',
    id: 'Option 22',
  },
  {
    value: '23',
    label: 'Option 23',
    id: 'Option 23',
  },
];

export const defaultSelectedSingle = {
  value: '22',
  label: 'Option 22',
  id: 'Option 22',
};

export const defaultSelectedServer = [
  {
    value: '22',
    label: 'Option 22',
    subLabel: 'Option subLevel 22',
    id: 'Option  22',
  },
  {
    value: '23',
    label: 'Option 23',
    subLabel: 'Option subLevel 23',
    id: 'Option 23',
  },
  {
    value: '42',
    label: 'Option 42',
    subLabel: 'Option subLevel 42',
    id: 'Option 42',
  },
  {
    value: '43',
    label: 'Option 43',
    subLabel: 'Option subLevel 43',
    id: 'Option 43',
  },
  {
    value: '82',
    label: 'Option 82',
    subLabel: 'Option subLevel 82',
    id: 'Option 82',
  },
  {
    value: '83',
    label: 'Option 83',
    subLabel: 'Option subLevel 83',
    id: 'Option 83',
  },
];

export const dummySelectValue = [
  {
    value: '21',
    label: 'Option 21',
    id: 'Option 21',
  },
  {
    value: '22',
    label: 'Option 22',
    id: 'Option 22',
  },
  {
    value: '23',
    label: 'Option 23',
    id: 'Option 23',
  },
  {
    value: '24',
    label: 'Option 24',
    id: 'Option 24',
  },
  {
    value: '25',
    label: 'Option 25',
    id: 'Option 25',
  },
  {
    value: '26',
    label: 'Option 26',
    id: 'Option 26',
  },
  {
    value: '27',
    label: 'Option 27',
    id: 'Option 27',
  },
  {
    value: '28',
    label: 'Option 28',
    id: 'Option 28',
  },
  {
    value: '29',
    label: 'Option 29',
    id: 'Option 29',
  },
  {
    value: '30',
    label: 'Option 30',
    id: 'Option 30',
  },
  {
    value: '31',
    label: 'Option 31',
    id: 'Option 31',
  },
  {
    value: '32',
    label: 'Option 32',
    id: 'Option 32',
  },
  {
    value: '33',
    label: 'Option 33',
    id: 'Option 33',
  },
  {
    value: '34',
    label: 'Option 34',
    id: 'Option 34',
  },
  {
    value: '35',
    label: 'Option 35',
    id: 'Option 35',
  },
  {
    value: '36',
    label: 'Option 36',
    id: 'Option 36',
  },
  {
    value: '37',
    label: 'Option 37',
    id: 'Option 37',
  },
  {
    value: '38',
    label: 'Option 38',
    id: 'Option 38',
  },
  {
    value: '39',
    label: 'Option 39',
    id: 'Option 39',
  },
  {
    value: '40',
    label: 'Option 40',
    id: 'Option 40',
  },
];

const defaultSelectionsTree = [
  {
    id: 'parent-5',
    children: [
      {
        id: 'child-5-1',
      },
    ],
  },
  {
    id: 'parent-2',
    children: [
      {
        id: 'child-2-1',
      },
    ],
  },
];

export const fetchOptions = (query) => {
  const params = query.params;
  const searchedText = query.debouncedSearch;
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = Array.from({ length: 20 }, (_, index) => ({
        value: `${params.pageParam * 20 + index + 1}`,
        label: `Option ${params.pageParam * 20 + index + 1}`,
        id: `Option ${params.pageParam * 20 + index + 1}`,
        // subLabel: `Option subLevel ${params.pageParam * 20 + index + 1}`,
      }));
      let count = 300;
      if (searchedText) {
        data = data.filter((option) =>
          option.label.toLowerCase().includes(searchedText.toLowerCase())
        );
        count = data.length;
      }
      const result = { data: data, totalCount: count };
      console.log(result);
      console.log(query);
      resolve(result);
    }, 1000); // Simulate 1 second delay
  });
};

const fetchOptionsForOnBoardingStatus = async (query: any) => {
  return {
    data: [
      {
        id: 'Compliant',
        value: 'Compliant',
        label: 'Compliant',
        hasChildren: false,
      },
      {
        id: 'Non-Compliant',
        value: 'Non-Compliant',
        label: 'Non-Compliant',
        hasChildren: true,
        children: [
          {
            id: 'Some Action Needed',
            value: 'Some Action Needed',
            label: 'Some Action Needed',
            hasChildren: false,
            children: [],
          },
          {
            id: 'Not Started',
            value: 'Not Started',
            label: 'Not Started',
            hasChildren: false,
            children: [],
          },
        ],
      },
      {
        id: 'NA',
        value: 'NA',
        label: 'Not Applicable',
        hasChildren: false,
        children: [],
      },
    ],
    totalCount: 3,
  };
};

export const filterConfig = [
  {
    id: 'disciplinceAndSpecialization',
    type: 'treeDropdown',
    label: 'Discipline & Specialization',
    parentLabel: 'Specialization',
    placeholder: 'Search for one or more discipline or specialization',
    options: dummy,
    icon: faHospitals,
    showSelected: true,
    defaultValues: defaultSelectionsTree,
    extraFilter: true,
    hidden: true,
  },
  {
    id: 'createdDate',
    type: 'dateRange',
    label: 'Created Date',
    defaultValues: null,
    placeholder: 'Enter date',
    icon: faCalendarRange,
    showSelected: true,
    disableId: 'publishedDate',
    extraFilter: true,
    hidden: true,
  },
  {
    id: 'schools',
    type: 'infiniteDropdown',
    label: 'Schools',
    defaultValues: defaultSelectedMulti,
    placeholder: 'Search Schools',
    icon: faCalendarRange,
    searchable: true,
    multiple: true,
    extraFilter: true,
    hidden: true,
    callback: dummySelectValue,
  },
  {
    id: 'publishedDate',
    type: 'customDateRangePicker',
    label: 'Published Date',
    options: [
      {
        id: 'last_7_days',
        label: 'Last 7 Days',
        value: 'last_7_days',
      },
      {
        id: 'last_14_days',
        label: 'Last 14 Days',
        value: 'last_14_days',
      },
      {
        id: 'last_30_days',
        label: 'Last 30 Days',
        value: 'last_30_days',
      },
      {
        id: 'custom_range',
        label: 'Custom Date Range',
        value: 'custom_range',
      },
    ],
    icon: faCalendarRange,
    extraFilter: true,
    hidden: true,
    disableId: 'createdDate',
  },
  {
    id: 'dueDate',
    type: 'datePicker',
    label: 'Due date',
    defaultValues: null,
    icon: faCalendar,
    placeholder: 'Enter due',
    extraFilter: true,
    hidden: true,
    defaultValues: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'multiDrop',
    type: 'dropdown',
    label: 'Multi select',
    options: dummySelectValue,
    name: 'Multi select',
    multiple: true,
    icon: faBallot,
    searchable: true,
    placeholder: 'Select values',
    selectAllRequired: true,
    defaultValues: defaultSelectedMulti,
    extraFilter: true,
    hidden: true,
  },
  {
    id: 'singleDrop',
    type: 'dropdown',
    label: 'Single select',
    options: dummySelectValue,
    name: 'Single select',
    icon: faBallot,
    searchable: true,
    placeholder: 'Select values',
    defaultValue: defaultSelectedSingle,
    extraFilter: true,
    hidden: true,
    multiple: false,
    defaultValue: defaultSelectedSingle[0],
  },
  {
    id: 'chipDrop',
    type: 'dropdown',
    label: 'Chip select',
    options: dummyChipSelect,
    multiple: true,
    name: 'Chip select',
    icon: faBallot,
    isChip: true,
    extraFilter: true,
    hidden: true,
    defaultValues: [dummyChipSelect[0], dummyChipSelect[2]],
  },
  {
    id: 'rangeFilter',
    type: 'customRangeComponent',
    label: 'Range',
    name: 'Range',
    extraFilter: true,
    hidden: true,
    icon: faBallot,

    defaultValues: { min: 10, max: 50 },
  },
  {
    id: 'serverSelect',
    type: 'infiniteDynamicDropdown',
    label: 'LOcation',
    defaultValues: defaultSelectedServer,
    placeholder: 'Infinite select',
    icon: faBallot,
    searchable: true,
    multiple: true,
    extraFilter: true,
    hidden: true,
    callback: fetchOptions,
  },
  {
    id: 'onBoardingStatus',
    type: 'infiniteDynamicDropdown',
    label: 'Onboarding Status',
    defaultValues: [
      {
        id: 'Compliant',
        value: 'Compliant',
        label: 'Compliant',
        hasChildren: false,
      },
    ],
    placeholder: 'Search Onboarding Status',
    icon: faBallot,
    searchable: true,
    staticDropdown: true,
    singleSelectAllowed: true,
    detachedBox: true,
    extraFilter: true,
    hidden: true,
    callback: fetchOptionsForOnBoardingStatus,
  },
  {
    id: 'radixSliderFilter',
    type: 'radixSliderFilter',
    label: 'Price Range',
    min: 0,
    max: 100,
    step: 1,
    extraFilter: true,
    hidden: true,
    icon: faDollarSign,
  },
  {
    id: 'radixDropdownSingleSelect',
    type: 'radixDropdownSingleSelect',
    label: 'Dropdown Single Select',
    options: dummySelectValue,
    extraFilter: true,
    hidden: true,
    icon: faBallot,
    defaultValue: defaultSelectedSingle,
  },
  {
    id: 'radixDropdownMultiSelect',
    type: 'radixDropdownMultiSelect',
    label: 'Dropdown Multi Select',
    options: dummySelectValue,
    extraFilter: true,
    hidden: true,
    icon: faBallot,
    // defaultValue: defaultSelectedMulti,
  },
  {
    id: 'locationFilter',
    type: 'radixInfiniteDropdown',
    label: 'Location',
    placeholder: 'Search locations',
    multiple: true,
    searchable: true,
    callback: fetchOptions, // ({ params, debouncedSearch }) => Promise<{ data, totalCount }>
    defaultValues: [],
    icon: faMapMarkerAlt,
    addedFilter: true,
    extraFilter: true,
    hideLabel: true,
    width: '200px',
    maxHeightForMenuItems: 200,
    canInitialFetch: true,
  },
];
