import type { Meta, StoryObj } from '@storybook/react';
import TanstackGridComponent, {
  GridColumnDef,
} from '../../libs/ui/components/TanStackGrid/TanstackGridComponent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  salary: number;
  children?: Employee[];
};

const generateHierarchicalEmployees = (): Employee[] => {
  const firstNames = [
    'Sarah',
    'Michael',
    'Emily',
    'David',
    'Jessica',
    'Robert',
    'Amanda',
    'Chris',
    'Lisa',
    'James',
  ];
  const lastNames = [
    'Johnson',
    'Chen',
    'Rodriguez',
    'Kim',
    'Taylor',
    'Wilson',
    'Lee',
    'Martinez',
    'Anderson',
    'Brown',
  ];

  let idCounter = 1;

  const createEmployee = (
    firstName: string,
    lastName: string,
    position: string,
    department: string,
    baseSalary: number
  ): Employee => ({
    id: `emp-${idCounter++}`,
    name: `${firstName} ${lastName}`,
    position,
    department,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    salary: baseSalary + Math.floor(Math.random() * 10000),
  });

  const ceo = createEmployee('Sarah', 'Johnson', 'CEO', 'Executive', 250000);
  ceo.children = [];

  const vpEngineering = createEmployee(
    'Michael',
    'Chen',
    'VP of Engineering',
    'Engineering',
    180000
  );
  const vpSales = createEmployee('Emily', 'Rodriguez', 'VP of Sales', 'Sales', 175000);
  const vpMarketing = createEmployee('David', 'Kim', 'VP of Marketing', 'Marketing', 170000);
  vpEngineering.children = [];
  vpSales.children = [];
  vpMarketing.children = [];

  const engManagers: Employee[] = [];
  for (let i = 0; i < 4; i++) {
    const manager = createEmployee(
      firstNames[i % firstNames.length],
      lastNames[(i + 4) % lastNames.length],
      'Engineering Manager',
      'Engineering',
      140000
    );
    manager.children = [];
    engManagers.push(manager);
  }

  const seniorDevs: Employee[] = [];
  for (let i = 0; i < 8; i++) {
    const dev = createEmployee(
      firstNames[i % firstNames.length],
      lastNames[(i + 5) % lastNames.length],
      'Senior Developer',
      'Engineering',
      120000
    );
    dev.children = [];
    seniorDevs.push(dev);
  }

  const developers: Employee[] = [];
  for (let i = 0; i < 12; i++) {
    const dev = createEmployee(
      firstNames[i % firstNames.length],
      lastNames[(i + 6) % lastNames.length],
      'Developer',
      'Engineering',
      95000
    );
    developers.push(dev);
  }

  const juniorDevs: Employee[] = [];
  for (let i = 0; i < 8; i++) {
    const dev = createEmployee(
      firstNames[i % firstNames.length],
      lastNames[(i + 7) % lastNames.length],
      'Junior Developer',
      'Engineering',
      70000
    );
    juniorDevs.push(dev);
  }

  const salesManager = createEmployee('Kevin', 'Thompson', 'Sales Manager', 'Sales', 130000);
  salesManager.children = [];

  const salesReps: Employee[] = [];
  for (let i = 0; i < 8; i++) {
    const rep = createEmployee(
      firstNames[i % firstNames.length],
      lastNames[(i + 8) % lastNames.length],
      'Sales Representative',
      'Sales',
      85000
    );
    salesReps.push(rep);
  }

  const marketingManager = createEmployee(
    'Alex',
    'Morgan',
    'Marketing Manager',
    'Marketing',
    125000
  );
  marketingManager.children = [];

  const contentLead = createEmployee('Olivia', 'Davis', 'Content Lead', 'Marketing', 95000);
  contentLead.children = [];

  const contentWriters: Employee[] = [];
  for (let i = 0; i < 3; i++) {
    const writer = createEmployee(
      firstNames[i % firstNames.length],
      lastNames[(i + 9) % lastNames.length],
      'Content Writer',
      'Marketing',
      65000
    );
    contentWriters.push(writer);
  }

  const socialMedia = createEmployee('Liam', 'Johnson', 'Social Media Manager', 'Marketing', 78000);
  const seoSpecialist = createEmployee('Nina', 'Patel', 'SEO Specialist', 'Marketing', 82000);

  seniorDevs.forEach((seniorDev, i) => {
    if (juniorDevs[i]) {
      seniorDev.children!.push(juniorDevs[i]);
    }
  });

  engManagers.forEach((manager, i) => {
    if (seniorDevs[i * 2]) manager.children!.push(seniorDevs[i * 2]);
    if (seniorDevs[i * 2 + 1]) manager.children!.push(seniorDevs[i * 2 + 1]);

    if (developers[i * 3]) manager.children!.push(developers[i * 3]);
    if (developers[i * 3 + 1]) manager.children!.push(developers[i * 3 + 1]);
    if (developers[i * 3 + 2]) manager.children!.push(developers[i * 3 + 2]);
  });

  vpEngineering.children = engManagers;

  salesManager.children = salesReps;
  vpSales.children = [salesManager];

  contentLead.children = contentWriters;
  marketingManager.children = [contentLead, socialMedia, seoSpecialist];
  vpMarketing.children = [marketingManager];

  ceo.children = [vpEngineering, vpSales, vpMarketing];

  // Create 9 additional root-level employees, each with their own children and sub-children
  const rootDepartments = [
    'Engineering',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'Operations',
    'Support',
    'Legal',
    'Product',
  ];
  const rootPositions = [
    'Director',
    'Senior Manager',
    'Lead',
    'Principal',
    'Head of Department',
    'VP',
    'Director',
    'Chief',
    'Lead',
  ];

  const roots: Employee[] = [ceo];

  for (let i = 0; i < 9; i++) {
    const firstName = firstNames[(i + 1) % firstNames.length];
    const lastName = lastNames[(i + 1) % lastNames.length];
    const department = rootDepartments[i % rootDepartments.length];
    const position = rootPositions[i % rootPositions.length];
    const baseSalary = 140000 + i * 5000;

    const root = createEmployee(firstName, lastName, position, department, baseSalary);

    // Give each root 2–4 children
    const numChildren = 2 + (i % 3);
    const rootChildren: Employee[] = [];
    for (let c = 0; c < numChildren; c++) {
      const child = createEmployee(
        firstNames[(i + c + 2) % firstNames.length],
        lastNames[(i + c + 2) % lastNames.length],
        c === 0 ? 'Manager' : 'Team Lead',
        department,
        baseSalary - 30000 - c * 5000
      );
      child.children = [];

      // Give first 1–2 children their own sub-children
      const numSubChildren = c < 2 ? 1 + ((c + i) % 2) : 0;
      for (let s = 0; s < numSubChildren; s++) {
        const subChild = createEmployee(
          firstNames[(i + c + s + 4) % firstNames.length],
          lastNames[(i + c + s + 4) % lastNames.length],
          'Specialist',
          department,
          baseSalary - 50000 - s * 3000
        );
        subChild.children = [];
        child.children!.push(subChild);
      }
      rootChildren.push(child);
    }
    root.children = rootChildren;
    roots.push(root);
  }

  return roots;
};

const hierarchicalEmployees = generateHierarchicalEmployees();

const hierarchyColumns: GridColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 600,
    minSize: 400,
    maxSize: 800,
  },
  {
    accessorKey: 'position',
    header: 'Position',
    size: 600,
    minSize: 550,
    maxSize: 600,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 150,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 250,
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    size: 150,
    cell: ({ getValue }) => {
      const salary = getValue() as number;
      return `$${salary.toLocaleString()}`;
    },
  },
];

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
  salary: number;
  joinedDate: string;
  location: string;
};

const generateMockUsers = (count: number): User[] => {
  const roles = ['Admin', 'Manager', 'Developer', 'Designer', 'QA'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR'];
  const locations = ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user has a pretty big name for the sake of testing-${i + 1}`,
    name: `User name is also pretty big for the sake of testing ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    department: departments[i % departments.length],
    salary: 50000 + ((i * 5000) % 100000),
    joinedDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
    location: locations[i % locations.length],
  }));
};

const mockUsers = generateMockUsers(1000);

const baseColumns: GridColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'Hidden Column (ID)',
    size: 20,
    enableResizing: true,
    disableColumnConfig: true,
    hiddenByDefault: true,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    size: 10,
    hiddenByDefault: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 250,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    size: 150,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 120,
    cell: ({ getValue }) => {
      const status = getValue() as User['status'];
      const colors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'department',
    header: 'Department',
    size: 150,
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    size: 150,
    cell: ({ getValue }) => {
      const salary = getValue() as number;
      return `$${salary.toLocaleString()}`;
    },
  },
  {
    accessorKey: 'joinedDate',
    header: 'Joined Date',
    size: 150,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    size: 150,
  },
  {
    id: 'action-icon',
    header: 'Action',
    size: 80,
    disableColumnConfig: true,
    pinPosition: 'right',
    cell: () => (
      <button className="rounded p-2 hover:bg-gray-100">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 200,
    cell: () => (
      <div className="flex gap-2">
        <button className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
          View
        </button>
        <button className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600">
          Edit
        </button>
        <button className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
          Delete
        </button>
      </div>
    ),
  },
];

const pinnedColumns: GridColumnDef<User>[] = [
  {
    ...baseColumns[0],
    pinPosition: 'left',
  },
  {
    ...baseColumns[1],
    pinPosition: 'left',
  },
  ...baseColumns.slice(2, -1),
  {
    ...baseColumns[baseColumns.length - 1],
    pinPosition: 'right',
  },
];

const mockFetchData = async ({ pagination, sorting, columnFilters, globalFilter }: any) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = [...mockUsers];

  if (globalFilter) {
    filteredData = filteredData.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }

  columnFilters.forEach((filter: any) => {
    filteredData = filteredData.filter((user) =>
      String(user[filter.id as keyof User])
        .toLowerCase()
        .includes(String(filter.value).toLowerCase())
    );
  });

  // Sorting
  if (sorting.length > 0) {
    const sort = sorting[0];
    filteredData.sort((a, b) => {
      const aValue = a[sort.id as keyof User];
      const bValue = b[sort.id as keyof User];
      if (aValue < bValue) return sort.desc ? 1 : -1;
      if (aValue > bValue) return sort.desc ? -1 : 1;
      return 0;
    });
  }

  // Pagination
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;
  const paginatedData = filteredData.slice(start, end);

  return {
    data: paginatedData,
    total: filteredData.length,
  };
};

const meta = {
  title: 'Common/TanstackGrid',
  component: TanstackGridComponent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof TanstackGridComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicGrid: Story = {
  args: {
    columns: baseColumns,
    fetchData: mockFetchData,
    serverData: true,
    pageSize: 10,
    pageSizeOptions: [10, 40, 20, 100],
    canSort: true,
    canResize: true,
    canReorder: true,
    selectionMode: 'single',
    showSelectAllCheckbox: true,
    onSelectedRowsChange: (selectedRows) => {
      console.log('Basic Grid rows changed:', selectedRows);
    },

    gridHeight: 450,
  },
};

export const FullFeaturedGrid: Story = {
  args: {
    columns: pinnedColumns,
    fetchData: mockFetchData,
    serverData: true,
    pageSize: 15,
    canSort: true,
    canResize: true,
    canReorder: true,
    canPinning: true,
    showColumnFilters: true,
    globalFilter: true,
    selectionMode: 'multiple',
    canSelectAll: true,
    disableAllRowSelectionOnPageChange: true,
    disableAllSelection: true,
    getRowCanSelect: (row) => row.index % 3 === 0,
    gridHeight: 700,
  },
};

export const HierarchyGrid: Story = {
  args: {
    columns: hierarchyColumns,
    data: hierarchicalEmployees,
    serverData: false,
    pageSize: 100,
    canSort: true,
    canResize: true,
    canReorder: true,
    selectionMode: 'hierarchySingleSelect',
    canSelectAll: true,
    enableHierarchy: true,
    enableVirtualization: false,
    autoExpandAll: false,
    onSelectedRowsChange: (selectedRows) => {
      console.log('Selected rows changed:', selectedRows);
    },
    selectChildrenOnParentSelect: true,
    getRowId: (row: Employee) => row.id,
    getSubRows: (row: Employee) => row.children,
  },
};

//Nested Grid demo
type ParentData = {
  id: string;
  name: string;
  category: string;
  status: string;
};

// Example child data type for nested grid
type ChildData = {
  id: string;
  detail: string;
  value: number;
  date: string;
};

const parentColumns: GridColumnDef<ParentData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 200,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    size: 150,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 120,
  },
];

const childColumns: GridColumnDef<ChildData>[] = [
  {
    accessorKey: 'detail',
    header: 'Detail',
    size: 250,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    size: 120,
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return `$${value.toLocaleString()}`;
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    size: 150,
  },
];

// Sample data
const parentData: ParentData[] = [
  {
    id: '1',
    name: 'Project Alpha Project Alpha Project Alpha Project Alpha Project Alpha Project Alpha',
    category: 'Development',
    status: 'Active',
  },
  { id: '2', name: 'Project Beta', category: 'Marketing', status: 'Completed' },
  { id: '3', name: 'Project Gamma', category: 'Research', status: 'Active' },
];

export const NestedGrid: Story = {
  args: {
    columns: parentColumns,
    data: parentData,
    serverData: false,
    pageSize: 10,
    canSort: true,
    canResize: true,
    canReorder: true,
    selectionMode: 'multiple',
    canSelectAll: true,
    enableNestedGrid: true,
    enableVirtualization: false,
    nestedGridRenderer: (row) => {
      const childData = [
        {
          id: `${row.original.id}-1`,
          detail: `Detail 1 for ${row.original.name}`,
          value: Math.floor(Math.random() * 10000),
          date: new Date().toLocaleDateString(),
        },
        {
          id: `${row.original.id}-2`,
          detail: `Detail 2 for ${row.original.name}`,
          value: Math.floor(Math.random() * 10000),
          date: new Date().toLocaleDateString(),
        },
        {
          id: `${row.original.id}-3`,
          detail: `Detail 3 for ${row.original.name}`,
          value: Math.floor(Math.random() * 10000),
          date: new Date().toLocaleDateString(),
        },
      ];

      return (
        <TanstackGridComponent
          columns={childColumns}
          data={childData}
          canSort={true}
          canResize={true}
          selectionMode="multiple"
          showPagination={false}
          showToolbar={false}
          gridHeight={300}
          id={`nested-grid-${row.id}`}
          headerClassName="bg-gray-400"
          cellClassName="bg-blue-200"
          enableStripedRows={false}
        />
      );
    },
    getRowId: (row) => row.id,
  },
};
