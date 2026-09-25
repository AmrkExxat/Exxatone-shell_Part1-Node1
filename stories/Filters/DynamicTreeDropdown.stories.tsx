import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { DynamicTreeDropdown } from '../../libs/ui'; // Adjust path as needed
import { faBuilding } from '@fortawesome/pro-light-svg-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getPathForLocation } from '../../libs/utilities/utils/removeDuplicates';

const queryClient = new QueryClient();

const meta = {
  title: 'Filters/DynamicTreeDropDown',
  component: DynamicTreeDropdown,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DynamicTreeDropdown>;

export default meta;

type Story = StoryObj<typeof DynamicTreeDropdown>;

const fetchOptionsForLocation = async ({
  params,
  debouncedSearch,
}: {
  params: any;
  debouncedSearch: string;
}) => {
  const { pageParam = 1 } = params || {};
  const pageSize = 5;

  const allLocations = Array.from({ length: 10 }, (_, i) => {
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

    return {
      id,
      label: `Location ${i + 1}`,
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

  return {
    data: paginated,
    totalCount: filtered.length,
  };
};

export const Default: Story = {
  render: () => (
    <div className="bg-card p-4" style={{ height: '500px' }}>
      <QueryClientProvider client={queryClient}>
        <DynamicTreeDropdown
          specificSearchToolTipText={'Type keywords to search'}
          fetchDataOnScroll={fetchOptionsForLocation}
          label="Location"
          placeholder="Search location"
          dropIcon={faBuilding}
          queryKey={['location']}
          onChange={(data) => console.log('Selected (multi):', data)}
          isFilter={false}
          detachedBox={false}
          singleSelectAllowed={false}
          selectParentOnChildSelect={true}
          maxHeightForMenuItems={'160px'}
          multiple={true}
          defaultValues={[
            {
              id: 'loc9-child3',
              label: 'Location 9 - Child 3',
              value: 'loc9-child3',
              hasChildren: true,
            },
          ]}
        />
      </QueryClientProvider>
    </div>
  ),
};

export const SingleSelect: Story = {
  render: () => (
    <div className="bg-card p-4" style={{ height: '500px' }}>
      <QueryClientProvider client={queryClient}>
        <DynamicTreeDropdown
          fetchDataOnScroll={fetchOptionsForLocation}
          label="Location"
          placeholder="Search location"
          dropIcon={faBuilding}
          queryKey={['location']}
          onChange={(data) => console.log('Selected (single):', data)}
          singleSelectAllowed={true}
          isFilter={false}
          detachedBox={false}
          defaultValues={[
            {
              id: 'loc1-child1-grandchild1',
              label: 'Location 1 - Child 1 - Grandchild 1',
              value: 'loc1-child1-grandchild1',
            },
          ]}
          maxHeightForMenuItems={'160px'}
        />
      </QueryClientProvider>
    </div>
  ),
};

export const StaticData: Story = {
  render: () => {
    const staticOptions = [
      {
        id: 'loc1',
        label: 'Static Location 1',
        value: 'loc1',
        hasChildren: true,
        children: [
          {
            id: 'loc1-child1',
            label: 'Static Location 1 - Child 1',
            value: 'loc1-child1',
            hasChildren: false,
            children: [],
          },
          {
            id: 'loc1-child2',
            label: 'Static Location 1 - Child 2',
            value: 'loc1-child2',
            hasChildren: true,
            children: [
              {
                id: 'loc1-child2-child1',
                label: 'Static Location 1 - Child 2 - Subchild 1',
                value: 'loc1-child2-child1',
                hasChildren: false,
                children: [],
              },
              {
                id: 'loc1-child2-child2',
                label: 'Static Location 1 - Child 2 - Subchild 2',
                value: 'loc1-child2-child2',
                hasChildren: false,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 'loc2',
        label: 'Static Location 2',
        value: 'loc2',
        hasChildren: true,
        children: [
          {
            id: 'loc2-child1',
            label: 'Static Location 2 - Child 1',
            value: 'loc2-child1',
            hasChildren: true,
            children: [
              {
                id: 'loc2-child1-child1',
                label: 'Static Location 2 - Child 1 - Subchild 1',
                value: 'loc2-child1-child1',
                hasChildren: false,
                children: [],
              },
            ],
          },
          {
            id: 'loc2-child2',
            label: 'Static Location 2 - Child 2',
            value: 'loc2-child2',
            hasChildren: false,
            children: [],
          },
        ],
      },
      {
        id: 'loc3',
        label: 'Static Location 3',
        value: 'loc3',
        hasChildren: true,
        children: [
          {
            id: 'loc3-child1',
            label: 'Static Location 3 - Child 1',
            value: 'loc3-child1',
            hasChildren: false,
            children: [],
          },
          {
            id: 'loc3-child2',
            label: 'Static Location 3 - Child 2',
            value: 'loc3-child2',
            hasChildren: true,
            children: [
              {
                id: 'loc3-child2-child1',
                label: 'Static Location 3 - Child 2 - Subchild 1',
                value: 'loc3-child2-child1',
                hasChildren: true,
                children: [
                  {
                    id: 'loc3-child2-child1-subchild1',
                    label: 'Static Location 3 - Child 2 - Subchild 1 - Leaf 1',
                    value: 'loc3-child2-child1-subchild1',
                    hasChildren: false,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    return (
      <div className="bg-card p-4" style={{ height: '500px' }}>
        <DynamicTreeDropdown
          options={staticOptions}
          label="Static Location"
          placeholder="Search static location"
          dropIcon={faBuilding}
          queryKey={['static-location']} // You can omit this too if unused
          onChange={(data) => console.log('Selected (static):', data)}
          singleSelectAllowed={true}
          isFilter={false}
          staticDropdown={true}
          isRequired={true}
          showSelectedItems={false}
          showLabel={false}
          detachedBox={true}
        />
      </div>
    );
  },
};
