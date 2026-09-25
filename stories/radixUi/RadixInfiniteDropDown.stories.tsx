import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RadixInfiniteDropDown from '../../libs/ui/radixUi/RadixInfiniteDropDown/RadixInfiniteDropDown';
import { faFilter } from '@fortawesome/pro-light-svg-icons';

const queryClient = new QueryClient();

const meta: Meta<typeof RadixInfiniteDropDown> = {
  title: 'Radix UI/RadixInfiniteDropDown',
  component: RadixInfiniteDropDown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ width: '600px', padding: '20px' }}>
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RadixInfiniteDropDown>;

const fetchOptionsForLocation = async ({
  params,
  debouncedSearch,
}: {
  params: any;
  debouncedSearch: string;
}) => {
  const { pageParam = 1 } = params || {};
  const pageSize = 10;

  const allLocations = Array.from({ length: 100 }, (_, i) => {
    const id = `loc${i + 1}`;
    const hasChildren = i % 2 === 0;

    const paths = [
      [
        {
          name: 'loc 1',
        },
        {
          name: 'loc 2',
        },
      ],
    ];

    const labelString = 'Location Name';

    return {
      id,
      label: Array(i + 1)
        .fill(labelString)
        .join(' '),
      value: id,
      hasChildren,
      // subLabel: getPathForLocation(paths),
      children: hasChildren
        ? Array.from({ length: 3 }, (_, j) => {
            const childId = `${id}-child${j + 1}`;
            const childHasChildren = true; // 50% chance

            return {
              id: childId,
              label: `Location ${i + 1} - Child ${j + 1}`,
              value: childId,
              paths: paths,
              hasChildren: childHasChildren,
              children: childHasChildren
                ? Array.from({ length: 2 }, (_, k) => {
                    const grandchildId = `${childId}-grandchild${k + 1}`;
                    return {
                      id: grandchildId,
                      label: `Location ${i + 1} - Child ${j + 1} - Grandchild ${k + 1}`,
                      value: grandchildId,
                      hasChildren: false,
                      children: [],
                    };
                  })
                : [],
            };
          })
        : [],
    };
  });

  const filtered = debouncedSearch
    ? allLocations.filter((loc) => loc.label.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : allLocations;

  const paginated = filtered.slice((pageParam - 1) * pageSize, pageParam * pageSize);

  // Artificial delay so "Loading more..." stays visible in Storybook
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    data: paginated,
    totalCount: filtered.length,
  };
};

export const SingleSelect: Story = {
  args: {
    queryKey: ['radixInfiniteDropdown', 'single'],
    fetchDataOnScroll: fetchOptionsForLocation,
    placeholder: 'Search items',
    label: 'Single Select',
    dropIcon: faFilter,
    multiple: false,
    searchable: true,
    width: '320px',
    variant: 'pill',
    hideLabel: false,
    height: '32px',
    clearButtonReq: true,
    closeButtonReq: true,
    onChange: (items) => {
      // eslint-disable-next-line no-console
      console.log('SingleSelect changed:', items);
    },
  },
};
export const MultiSelect: Story = {
  args: {
    queryKey: ['radixInfiniteDropdown', 'multi-tree'],
    fetchDataOnScroll: fetchOptionsForLocation,
    placeholder: 'Search items',
    label: 'Multi Select ',
    multiple: true,
    searchable: true,
    width: '420px',
    renderSelectedItemsInTreeStructure: true,
    variant: 'pill',
    onChange: (items) => {
      // eslint-disable-next-line no-console
      console.log('MultiSelectTreeSelected changed:', items);
    },
  },
};

export const DetachedBoxWithTooltip: Story = {
  args: {
    queryKey: ['radixInfiniteDropdown', 'detached'],
    fetchDataOnScroll: fetchOptionsForLocation,
    placeholder: 'Type to search',
    label: 'Detached Dropdown',
    multiple: true,
    searchable: true,
    detachedBox: true,
    specificSearchToolTipText: 'Search is mocked. Type anything to see results.',
    width: 'auto',
    onChange: (items) => {
      // eslint-disable-next-line no-console
      console.log('DetachedBoxWithTooltip changed:', items);
    },
  },
};

// Multi-select where both parent and some children are preselected,
// demonstrating unchecking using the tree-structured selected list.
export const MultiSelectTreeParentAndChildren: Story = {
  args: {
    queryKey: ['radixInfiniteDropdown', 'multi-tree-parent-children'],
    fetchDataOnScroll: fetchOptionsForLocation,
    placeholder: 'Search items',
    label: 'Multi Select (Parent & Children)',
    multiple: true,
    searchable: true,
    width: '420px',
    variant: 'pill',

    onChange: (items) => {
      // eslint-disable-next-line no-console
      console.log('MultiSelectTreeParentAndChildren changed:', items);
    },
  },
};

// Infinite scroll - single select, flat list
export const InfiniteScrollSingleSelect: Story = {
  args: {
    queryKey: ['radixInfiniteDropdown', 'infinite-single'],
    fetchDataOnScroll: fetchOptionsForLocation,
    placeholder: 'Scroll to load more items',
    label: 'Infinite Scroll (Single Select)',
    multiple: false,
    searchable: true,
    width: '320px',
    variant: 'pill',
    maxHeightForMenuItems: 120,
    height: '32px',
    onChange: (items) => {
      // eslint-disable-next-line no-console
      console.log('InfiniteScrollSingleSelect changed:', items);
    },
  },
};

// Infinite scroll - multi select, flat list
export const InfiniteScrollMultiSelect: Story = {
  args: {
    queryKey: ['radixInfiniteDropdown', 'infinite-multi'],
    fetchDataOnScroll: fetchOptionsForLocation,
    placeholder: 'Scroll to load more items',
    label: 'Infinite Scroll (Multi Select)',
    multiple: true,
    searchable: true,
    width: '400px',
    variant: 'pill',
    maxHeightForMenuItems: 120,
    clearButtonReq: false,
    onChange: (items) => {
      // eslint-disable-next-line no-console
      console.log('InfiniteScrollMultiSelect changed:', items);
    },
  },
};
