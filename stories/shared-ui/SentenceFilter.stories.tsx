/* eslint-disable react/display-name */
import React, { useState, useCallback, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  faCalendar,
  faBuilding,
  faUser,
  faMapMarker,
  faBallot,
  faHospitals,
} from '@fortawesome/pro-light-svg-icons';
import { ThemeDecorator } from '../ThemeDecorator';
import SentenceFilter from '../../libs/ui/shared/FilterForm/SentenceFilter/SentenceFilter';
import type { SentenceFilterConfig } from '../../libs/ui/shared/FilterForm/SentenceFilter/SentenceFilter.types';

const meta = {
  title: 'Shared UI/SentenceFilter',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
    docs: {
      description: {
        component:
          'A flexible filter component that presents filters as natural language sentences with embedded interactive inputs. Features session persistence, conditional loading, and support for all FilterForm filter types.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const BasicTest: Story = {
  render: () => {
    const config: SentenceFilterConfig[] = [
      {
        id: 'test',
        type: 'text',
        label: 'Test Input',
        placeholder: 'Enter text',
      },
    ];

    return (
      <div className="bg-card p-4">
        <h3>Basic SentenceFilter Test</h3>
        <SentenceFilter
          config={config}
          onFilterChange={(values) => console.log('Test filter:', values)}
          sessionKey="testFilter"
        />
      </div>
    );
  },
};

// Mock data providers for dependent filters
const fetchDepartments = async (companyId: any): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const departments: Record<string, { id: string; label: string; value: string }[]> = {
        company1: [
          { id: 'dept1', label: 'Engineering', value: 'engineering' },
          { id: 'dept2', label: 'Marketing', value: 'marketing' },
          { id: 'dept3', label: 'Sales', value: 'sales' },
        ],
        company2: [
          { id: 'dept4', label: 'Research', value: 'research' },
          { id: 'dept5', label: 'Operations', value: 'operations' },
        ],
      };
      resolve(departments[companyId?.value as keyof typeof departments] || []);
    }, 1000);
  });
};

const fetchEmployees = async (departmentId: any): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const employees: Record<string, { id: string; label: string; value: string }[]> = {
        engineering: [
          { id: 'emp1', label: 'John Doe', value: 'john' },
          { id: 'emp2', label: 'Jane Smith', value: 'jane' },
        ],
        marketing: [
          { id: 'emp3', label: 'Bob Johnson', value: 'bob' },
          { id: 'emp4', label: 'Alice Brown', value: 'alice' },
        ],
        sales: [
          { id: 'emp5', label: 'Mike Wilson', value: 'mike' },
          { id: 'emp6', label: 'Sarah Davis', value: 'sarah' },
        ],
      };
      resolve(employees[departmentId?.value as keyof typeof employees] || []);
    }, 500);
  });
};

// Tree options for hierarchical filters
const treeOptions = [
  {
    id: '1',
    label: 'North America',
    children: [
      { id: '1-1', label: 'United States' },
      { id: '1-2', label: 'Canada' },
      { id: '1-3', label: 'Mexico' },
    ],
  },
  {
    id: '2',
    label: 'Europe',
    children: [
      { id: '2-1', label: 'United Kingdom' },
      { id: '2-2', label: 'Germany' },
      { id: '2-3', label: 'France' },
      { id: '2-4', label: 'Spain' },
    ],
  },
  {
    id: '3',
    label: 'Asia',
    children: [
      { id: '3-1', label: 'Japan' },
      { id: '3-2', label: 'South Korea' },
      { id: '3-3', label: 'Singapore' },
    ],
  },
];

// Basic sentence filter story
export const BasicSentenceFilter: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});

    const config: SentenceFilterConfig[] = [
      {
        id: 'status',
        type: 'dropdown',
        label: 'Status',
        placeholder: 'Select status',
        options: [
          { id: 'active', label: 'Active', value: 'active' },
          { id: 'inactive', label: 'Inactive', value: 'inactive' },
          { id: 'pending', label: 'Pending', value: 'pending' },
          { id: 'completed', label: 'Completed', value: 'completed' },
        ],
        icon: faUser,
        defaultValue: { id: 'active', label: 'Active', value: 'active' },
      },
      {
        id: 'dateRange',
        type: 'dateRange',
        label: 'Date Range',
        placeholder: 'Select date range',
        icon: faCalendar,
        startLabel: 'From',
        endLabel: 'To',
      },
      {
        id: 'search',
        type: 'text',
        label: 'Search',
        placeholder: 'Enter keywords',
      },
    ];

    const sentence = 'Show {status} records from {dateRange} containing {search}';

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Basic Sentence Filter</h3>
        <SentenceFilter
          config={config}
          sentence={sentence}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="basicSentenceFilter"
          className="mb-6"
        />
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <strong className="mb-2 block">Current Filter Values:</strong>
          <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// Dependent filters story
export const DependentFilters: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});

    const config: SentenceFilterConfig[] = [
      {
        id: 'company',
        type: 'dropdown',
        label: 'Company',
        placeholder: 'Select company',
        options: [
          { id: 'company1', label: 'Tech Corp', value: 'company1' },
          { id: 'company2', label: 'Innovation Inc', value: 'company2' },
        ],
        icon: faBuilding,
      },
      {
        id: 'department',
        type: 'dropdown',
        label: 'Department',
        placeholder: 'Select department',
        dependency: 'company',
        dataProvider: fetchDepartments,
        icon: faMapMarker,
      },
      {
        id: 'employee',
        type: 'dropdown',
        label: 'Employee',
        placeholder: 'Select employee',
        dependency: 'department',
        dataProvider: fetchEmployees,
        icon: faUser,
      },
    ];

    const sentence = 'Show reports from {company} in {department} for {employee}';

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Dependent Filters with Dynamic Loading</h3>
        <p className="mb-4 text-sm text-gray-600">
          Select a company to load departments, then select a department to load employees.
        </p>
        <SentenceFilter
          config={config}
          sentence={sentence}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="dependentSentenceFilter"
          className="mb-6"
        />
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <strong className="mb-2 block">Current Filter Values:</strong>
          <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// Complex filters with tree dropdown
export const ComplexFilters: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});

    const config: SentenceFilterConfig[] = [
      {
        id: 'regions',
        type: 'treeDropdown',
        label: 'Regions',
        placeholder: 'Select regions',
        options: treeOptions,
        icon: faMapMarker,
        multiple: true,
      },
      {
        id: 'priority',
        type: 'dropdown',
        label: 'Priority',
        placeholder: 'Select priority',
        options: [
          { id: 'high', label: 'High', value: 'high' },
          { id: 'medium', label: 'Medium', value: 'medium' },
          { id: 'low', label: 'Low', value: 'low' },
        ],
        multiple: true,
        isChip: true,
        icon: faBallot,
      },
      {
        id: 'createdDate',
        type: 'datePicker',
        label: 'Created Date',
        placeholder: 'Select date',
        icon: faCalendar,
      },
    ];

    const sentence = 'Show tasks from {regions} with {priority} priority created on {createdDate}';

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Complex Filters with Tree Dropdown</h3>
        <p className="mb-4 text-sm text-gray-600">
          Features hierarchical region selection, multiple priority selection with chips, and date
          picker.
        </p>
        <SentenceFilter
          config={config}
          sentence={sentence}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="complexSentenceFilter"
          className="mb-6"
        />
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <strong className="mb-2 block">Current Filter Values:</strong>
          <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// Without sentence template
export const WithoutSentenceTemplate: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});

    const config: SentenceFilterConfig[] = [
      {
        id: 'category',
        type: 'dropdown',
        label: 'Category',
        placeholder: 'Select category',
        options: [
          { id: 'tech', label: 'Technology', value: 'tech' },
          { id: 'design', label: 'Design', value: 'design' },
          { id: 'marketing', label: 'Marketing', value: 'marketing' },
        ],
        icon: faBallot,
      },
      {
        id: 'dateRange',
        type: 'dateRange',
        label: 'Date Range',
        icon: faCalendar,
      },
      {
        id: 'keywords',
        type: 'text',
        label: 'Keywords',
        placeholder: 'Enter keywords',
      },
    ];

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Default Layout (No Sentence Template)</h3>
        <p className="mb-4 text-sm text-gray-600">
          When no sentence template is provided, filters are displayed in a simple horizontal
          layout.
        </p>
        <SentenceFilter
          config={config}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="noSentenceSentenceFilter"
          className="mb-6"
        />
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <strong className="mb-2 block">Current Filter Values:</strong>
          <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// Session persistence demonstration
export const SessionPersistence: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});
    const [componentKey, setComponentKey] = useState(0);

    const config: SentenceFilterConfig[] = [
      {
        id: 'type',
        type: 'dropdown',
        label: 'Type',
        options: [
          { id: 'bug', label: 'Bug', value: 'bug' },
          { id: 'feature', label: 'Feature', value: 'feature' },
          { id: 'improvement', label: 'Improvement', value: 'improvement' },
        ],
        icon: faBallot,
      },
      {
        id: 'assignee',
        type: 'text',
        label: 'Assignee',
        placeholder: 'Enter assignee name',
      },
      {
        id: 'dueDate',
        type: 'datePicker',
        label: 'Due Date',
        icon: faCalendar,
      },
    ];

    const sentence = 'Find {type} items assigned to {assignee} due by {dueDate}';

    const handleRemount = () => {
      setComponentKey((prev) => prev + 1);
    };

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Session Persistence Demo</h3>
        <p className="mb-4 text-sm text-gray-600">
          Set some filter values, then click "Simulate Page Refresh" to see values persist.
        </p>

        <button
          onClick={handleRemount}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          Simulate Page Refresh
        </button>

        <SentenceFilter
          key={componentKey}
          config={config}
          sentence={sentence}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="persistentSentenceFilter"
          className="mb-6"
        />

        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <strong className="mb-2 block">Current Filter Values:</strong>
          <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// All filter types showcase
export const AllFilterTypes: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});

    const config: SentenceFilterConfig[] = [
      {
        id: 'dropdown',
        type: 'dropdown',
        label: 'Dropdown',
        options: [
          { id: 'opt1', label: 'Option 1', value: 'opt1' },
          { id: 'opt2', label: 'Option 2', value: 'opt2' },
        ],
        icon: faBallot,
      },
      {
        id: 'tree',
        type: 'treeDropdown',
        label: 'Tree',
        options: treeOptions.slice(0, 2),
        icon: faHospitals,
      },
      {
        id: 'dateRange',
        type: 'dateRange',
        label: 'Date Range',
        icon: faCalendar,
      },
      {
        id: 'datePicker',
        type: 'datePicker',
        label: 'Date',
        icon: faCalendar,
      },
      {
        id: 'text',
        type: 'text',
        label: 'Text',
        placeholder: 'Enter text',
      },
    ];

    const sentence =
      'Show {dropdown} records from {tree} between {dateRange} and {datePicker} matching {text}';

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">All Filter Types Showcase</h3>
        <p className="mb-4 text-sm text-gray-600">
          Demonstrates all supported filter types in a single sentence.
        </p>
        <SentenceFilter
          config={config}
          sentence={sentence}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="allTypesSentenceFilter"
          className="mb-6"
        />
        <div className="mt-4 rounded-lg bg-gray-100 p-4">
          <strong className="mb-2 block">Current Filter Values:</strong>
          <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

// API Call Example - Demonstrates dataProvider functionality
export const APICallExample: Story = {
  render: () => {
    const [filterValues, setFilterValues] = useState({});
    const [apiLogs, setApiLogs] = useState<string[]>([]);

    // Enhanced data providers with logging - memoized to prevent multiple calls
    const fetchDepartmentsWithLog = useCallback(async (companyId: any): Promise<any[]> => {
      const log = `API Call: Fetching departments for company ${companyId?.label || companyId?.value}`;
      setApiLogs((prev) => [...prev, log]);

      return new Promise((resolve) => {
        setTimeout(() => {
          const departments: Record<string, { id: string; label: string; value: string }[]> = {
            company1: [
              { id: 'dept1', label: 'Engineering', value: 'engineering' },
              { id: 'dept2', label: 'Marketing', value: 'marketing' },
              { id: 'dept3', label: 'Sales', value: 'sales' },
            ],
            company2: [
              { id: 'dept4', label: 'Research', value: 'research' },
              { id: 'dept5', label: 'Operations', value: 'operations' },
            ],
          };
          const result = departments[companyId?.value as keyof typeof departments] || [];
          setApiLogs((prev) => [...prev, `API Response: Found ${result.length} departments`]);
          resolve(result);
        }, 1000);
      });
    }, []);

    const fetchEmployeesWithLog = useCallback(async (departmentId: any): Promise<any[]> => {
      const log = `API Call: Fetching employees for department ${departmentId?.label || departmentId?.value}`;
      setApiLogs((prev) => [...prev, log]);

      return new Promise((resolve) => {
        setTimeout(() => {
          const employees: Record<string, { id: string; label: string; value: string }[]> = {
            engineering: [
              { id: 'emp1', label: 'John Doe', value: 'john' },
              { id: 'emp2', label: 'Jane Smith', value: 'jane' },
            ],
            marketing: [
              { id: 'emp3', label: 'Bob Johnson', value: 'bob' },
              { id: 'emp4', label: 'Alice Brown', value: 'alice' },
            ],
            sales: [
              { id: 'emp5', label: 'Mike Wilson', value: 'mike' },
              { id: 'emp6', label: 'Sarah Davis', value: 'sarah' },
            ],
          };
          const result = employees[departmentId?.value as keyof typeof employees] || [];
          setApiLogs((prev) => [...prev, `API Response: Found ${result.length} employees`]);
          resolve(result);
        }, 500);
      });
    }, []);

    // Memoize the config array to prevent recreation on every render
    const config = useMemo(
      (): SentenceFilterConfig[] => [
        {
          id: 'company',
          type: 'dropdown',
          label: 'Company',
          placeholder: 'Select company',
          options: [
            { id: 'company1', label: 'Tech Corp', value: 'company1' },
            { id: 'company2', label: 'Innovation Inc', value: 'company2' },
          ],
          icon: faBuilding,
        },
        {
          id: 'department',
          type: 'dropdown',
          label: 'Department',
          placeholder: 'Select department',
          dependency: 'company', // Depends on company selection
          dataProvider: fetchDepartmentsWithLog, // API call function
          icon: faMapMarker,
        },
        {
          id: 'employee',
          type: 'dropdown',
          label: 'Employee',
          placeholder: 'Select employee',
          dependency: 'department', // Depends on department selection
          dataProvider: fetchEmployeesWithLog, // API call function
          icon: faUser,
        },
      ],
      [fetchDepartmentsWithLog, fetchEmployeesWithLog]
    );

    const sentence = 'Show reports from {company} in {department} for {employee}';

    const clearLogs = () => {
      setApiLogs([]);
    };

    return (
      <div className="bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">API Call Example - Dynamic Data Loading</h3>
        <p className="mb-4 text-sm text-gray-600">
          This example demonstrates how filters can load options via API calls based on previous
          selections. Select a company to trigger an API call for departments, then select a
          department to load employees.
        </p>

        <div className="mb-4">
          <button
            onClick={clearLogs}
            className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
          >
            Clear API Logs
          </button>
        </div>

        <SentenceFilter
          config={config}
          sentence={sentence}
          onFilterChange={(values) => {
            setFilterValues(values);
          }}
          sessionKey="apiCallExample"
          className="mb-6"
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-lg bg-gray-100 p-4">
            <strong className="mb-2 block">Current Filter Values:</strong>
            <pre className="overflow-auto text-sm">{JSON.stringify(filterValues, null, 2)}</pre>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <strong className="mb-2 block">API Call Logs:</strong>
            <div className="max-h-40 space-y-1 overflow-y-auto text-sm">
              {apiLogs.length === 0 ? (
                <span className="text-gray-500">
                  No API calls yet. Select a company to see API calls in action.
                </span>
              ) : (
                apiLogs.map((log, index) => (
                  <div key={index} className="bg-card rounded p-1 font-mono text-xs">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};
