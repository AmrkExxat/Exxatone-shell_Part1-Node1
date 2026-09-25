import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeGridComponent } from '@syncfusion/ej2-react-treegrid';
import ExxatTreeGrid from '../../libs/ui/components/syncfusion/exxat-tree-grid/ExxatTreeGrid';

// Mock data generator
const generateMockData = (count: number, withChildren: boolean = false) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const item: any = {
      id: `item-${i}`,
      name: `Item ${i}`,
      status: i % 5 === 0 ? 'cancelled' : 'active',
      description: `Description for item ${i}`,
      category: `Category ${Math.ceil(i / 3)}`,
      value: Math.floor(Math.random() * 10000),
      date: new Date(2024, i % 12, i % 28).toISOString(),
      disabled: i % 2 === 0, // Every 7th item is disabled
    };

    if (withChildren && i <= 5) {
      item.children = [
        {
          id: `item-${i}-1`,
          name: `Child ${i}-1`,
          status: 'active',
          description: `Child description ${i}-1`,
          category: `Category ${Math.ceil(i / 3)}`,
          value: Math.floor(Math.random() * 5000),
          parentItem: `item-${i}`,
        },
        {
          id: `item-${i}-2`,
          name: `Child ${i}-2`,
          status: 'active',
          description: `Child description ${i}-2`,
          category: `Category ${Math.ceil(i / 3)}`,
          value: Math.floor(Math.random() * 5000),
          parentItem: `item-${i}`,
        },
      ];
    }

    data.push(item);
  }
  return data;
};

// Mock fetch function
const mockFetchData = async (params: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const data = generateMockData(50, true);
  return {
    data,
    totalCount: 50,
  };
};

// Column definitions
const basicColumns = [
  {
    fieldName: 'name',
    headerName: 'Name',
    width: 200,
    canSort: true,
    visible: true,
  },
  {
    fieldName: 'status',
    headerName: 'Status',
    width: 120,
    canSort: true,
    visible: true,
  },
  {
    fieldName: 'description',
    headerName: 'Description',
    width: 300,
    canSort: false,
    visible: true,
  },
  {
    fieldName: 'category',
    headerName: 'Category',
    width: 150,
    canSort: true,
    visible: true,
  },
  {
    fieldName: 'value',
    headerName: 'Value',
    width: 120,
    canSort: true,
    visible: true,
  },
];

const meta: Meta<typeof ExxatTreeGrid> = {
  title: 'ExxatTreeGrid',
  component: ExxatTreeGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A powerful tree grid component built on Syncfusion TreeGrid with advanced features like sorting, filtering, column configuration, and checkbox selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'text',
      description: 'Height of the grid',
    },
    allowSorting: {
      control: 'boolean',
      description: 'Enable/disable sorting functionality',
    },
    allowFiltering: {
      control: 'boolean',
      description: 'Enable/disable filtering functionality',
    },
    allowResizing: {
      control: 'boolean',
      description: 'Enable/disable column resizing',
    },
    checkboxSelection: {
      control: 'boolean',
      description: 'Enable checkbox selection',
    },
    configureColumns: {
      control: 'boolean',
      description: 'Show column configuration button',
    },
    pagingSize: {
      control: 'number',
      description: 'Number of items per page',
    },
    clearAllBit: {
      control: 'number',
      description:
        'Bit to clear the selections on change of the clearAllBit value. Pass a value greater than 0 to clear the selections.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExxatTreeGrid>;

// Basic Tree Grid
export const Basic: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '500px',
    allowSorting: true,
    allowResizing: true,
    treeColumnIndex: 1,
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Basic Tree Grid</h3>
            <p className="text-sm text-gray-600">Simple tree grid with sorting and resizing</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// With Checkbox Selection
export const WithCheckboxSelection: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '500px',
    checkboxSelection: true,
    checkboxSelectionType: 'Multiple',
    showSelectAll: true,
    autoCheckHierarchy: true,
    onCheckboxSelect: (data, checked) => {
      console.log('Selected items:', data, 'Checked:', checked);
    },
    clearAllBit: -1,
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);

    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Grid with Checkbox Selection</h3>
            <p className="text-sm text-gray-600">Multi-select with hierarchy support</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// With Column Configuration
export const WithColumnConfiguration: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '500px',
    configureColumns: true,
    allowSorting: true,
    allowResizing: true,
    onColumnSettingsSave: (updatedColumns) => {
      console.log('Column settings saved:', updatedColumns);
    },
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Grid with Column Configuration</h3>
            <p className="text-sm text-gray-600">Click the wrench icon to configure columns</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// Single Selection Mode
export const SingleSelection: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '500px',
    checkboxSelection: true,
    checkboxSelectionType: 'Single',
    autoCheckHierarchy: true,
    onCheckboxSelect: (data, checked) => {
      console.log('Selected item:', data, 'Checked:', checked);
    },
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Single Selection Mode</h3>
            <p className="text-sm text-gray-600">Only one item can be selected at a time</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// With Frozen Columns
export const WithFrozenColumns: Story = {
  args: {
    columns: [
      {
        fieldName: 'name',
        headerName: 'Name',
        width: 200,
        canSort: true,
        visible: true,
        freeze: 'Left',
      },
      ...basicColumns.slice(1),
    ],
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '500px',
    allowSorting: true,
    allowResizing: true,
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Grid with Frozen Column</h3>
            <p className="text-sm text-gray-600">Name column is frozen to the left</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// With Custom Pagination
export const CustomPagination: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: async (params: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = generateMockData(150, true);
      return {
        data,
        totalCount: 150,
      };
    },
    height: '500px',
    pagingSize: 25,
    allowSorting: true,
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Grid with Custom Pagination</h3>
            <p className="text-sm text-gray-600">25 items per page, 150 total items</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// With Filtering
export const WithFiltering: Story = {
  args: {
    columns: basicColumns,
    metaData: {
      tenantId: 'tenant-123',
      filterPayload: { status: 'active' },
    },
    fetchData: mockFetchData,
    height: '500px',
    allowFiltering: true,
    allowSorting: true,
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Grid with Filtering</h3>
            <p className="text-sm text-gray-600">Pre-filtered by active status</p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// Full Featured
export const FullFeatured: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '600px',
    checkboxSelection: true,
    checkboxSelectionType: 'Multiple',
    showSelectAll: true,
    autoCheckHierarchy: true,
    configureColumns: true,
    allowSorting: true,
    allowMultiSorting: true,
    allowResizing: true,
    allowFiltering: true,
    allowReordering: true,
    pagingSize: 25,
    onCheckboxSelect: (data, checked) => {
      console.log('Selected:', data, checked);
    },
    onColumnSettingsSave: (cols) => {
      console.log('Columns saved:', cols);
    },
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Full Featured Tree Grid</h3>
            <p className="text-sm text-gray-600">
              All features enabled: sorting, filtering, resizing, reordering, checkbox selection,
              and column configuration
            </p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// With Disabled Rows
export const WithDisabledRows: Story = {
  args: {
    columns: basicColumns,
    metaData: { tenantId: 'tenant-123' },
    fetchData: mockFetchData,
    height: '500px',
    checkboxSelection: true,
    checkboxSelectionType: 'Multiple',
    showSelectAll: true,
    allowSorting: true,
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Grid with Disabled Rows</h3>
            <p className="text-sm text-gray-600">
              Every 7th row is disabled (grayed out and non-selectable)
            </p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};

// Loading State
export const LoadingState: Story = {
  args: {
    columns: basicColumns,
    metaData: undefined,
    fetchData: mockFetchData,
    height: '500px',
  },
  render: (args) => {
    const ref = React.useRef<TreeGridComponent>(null);
    return (
      <div className="p-4">
        <ExxatTreeGrid ref={ref} {...args}>
          <div className="px-4">
            <h3 className="text-lg font-semibold">Loading State</h3>
            <p className="text-sm text-gray-600">
              Grid shows spinner when tenantId is not provided
            </p>
          </div>
        </ExxatTreeGrid>
      </div>
    );
  },
};
