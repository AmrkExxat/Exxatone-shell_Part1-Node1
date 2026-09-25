'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import {
  Avatar,
  Filter,
  InfiniteScrollTable,
  Select,
  Status,
  type FilterType,
} from '../../../libs/ui';
import classNames from 'classnames';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessages, faPen, faTrashAlt } from '@fortawesome/pro-light-svg-icons';

import { DemoDrawer } from './demoDrawer';

type DrawerFunctions = {
  handleDrawer: (drawerStateData?: any) => void;
};

const drawerData = {
  open: true,
  name: 'Harvey',
  position: 'MD',
};

export default function Page() {
  const queryClient = new QueryClient();

  const drawerRef = useRef<DrawerFunctions>();

  const [viewType, setViewType] = useState<'card' | 'grid'>('grid');

  const columns = [
    {
      id: 'col_name',
      fieldName: 'name',
      headerName: 'Name',
      hiddenOrder: 2,
      isBold: true,
      canSort: false,
      width: '10vw',
      isTruncate: true,
      renderCell: (row: any) => {
        const avatars = ['/avatars/avatar-1.jpg', '/avatars/avatar-2.jpg', '/avatars/avatar-3.jpg'];

        const selectedsrc = avatars[Math.floor(Math.random() * avatars.length)];

        return (
          <div className="my-1 flex flex-row items-center justify-start gap-2">
            <Avatar
              className={classNames(`h-[40px] w-[40px]`)}
              firstName={row?.firstName}
              lastName={row?.lastName}
              src={selectedsrc}
            />
            <span className="text-primary truncate text-xs font-semibold">{row?.name}</span>
          </div>
        );
      },
    },
    {
      id: 'col_age',
      fieldName: 'age',
      headerName: 'Age',
      hiddenOrder: 8,
      isBold: false,
      canSort: true,
      width: '10vw',
      isTruncate: false,
    },
    {
      id: 'col_location',
      fieldName: 'location',
      headerName: 'Location',
      hiddenOrder: 3,
      isBold: true,
      canSort: true,
      width: '13vw',
      isTruncate: true,
    },
    {
      id: 'col_school',
      fieldName: 'school',
      headerName: 'School',
      hiddenOrder: 3,
      isBold: true,
      canSort: true,
      width: '13vw',
      isTruncate: true,
    },
    {
      id: 'col_email',
      fieldName: 'email',
      headerName: 'Email',
      hiddenOrder: 4,
      isBold: false,
      canSort: true,
      width: '10vw',
      isTruncate: false,
      renderCell: (row: any) => {
        return (
          <a
            className="text-primary cursor-pointer text-sm break-words"
            href={`mailTo:${row?.email}`}
          >
            {row?.email}
          </a>
        );
      },
    },
    {
      id: 'col_status',
      fieldName: 'status',
      headerName: 'Status',
      hiddenOrder: 5,
      isBold: true,
      canSort: true,
      width: '9vw',
      isTruncate: true,
      renderCell: (row: any) => {
        return (
          <div className="my-1">
            <Status label={row.status} type="request" />
          </div>
        );
      },
    },
    {
      id: 'col_date',
      fieldName: 'date',
      headerName: 'Date',
      hiddenOrder: 6,
      isBold: false,
      canSort: false,
      width: '20vw',
      isTruncate: false,
      renderCell: (row: any) => {
        return <span>{moment.utc(row?.date).format('MMM DD, YYYY')}</span>;
      },
    },
    {
      id: 'col_category',
      fieldName: 'category',
      headerName: 'Category',
      hiddenOrder: 7,
      isBold: true,
      canSort: true,
      width: '10vw',
      isTruncate: false,
      renderCell: (row: any) => {
        if (viewType !== 'card') {
          return (
            <Select
              id="discipline-select"
              name="discipline-select"
              label=""
              options={[
                { label: 'Art Therapy', value: 'option1', id: 'option1' },
                { label: 'Bio Chemistry', value: 'option2', id: 'option2' },
                {
                  label: 'Speech Pathology',
                  value: 'option3',
                  id: 'option3',
                },
              ]}
            />
          );
        } else {
          return <div className="text-sm">Speech Pathology</div>;
        }
      },
    },
    {
      id: 'col_action',
      fieldName: 'action',
      headerName: 'Action',
      hiddenOrder: 1,
      isBold: true,
      canSort: false,
      width: '7vw',
      isTruncate: false,
      renderCell: (row: any) => {
        if (viewType === 'card') {
          return (
            <div className="flex flex-row items-center justify-start gap-2 text-sm">
              <button
                className="bg-hover flex flex-row items-center justify-start gap-1 rounded-md px-4 py-1 text-xs"
                onClick={onOpenDrawer}
              >
                <FontAwesomeIcon icon={faPen} className="h-3 w-3" aria-hidden="true" />
                Edit
              </button>
              <button className="bg-primary-50 text-primary flex flex-row items-center justify-start gap-1 rounded-md px-4 py-1 text-xs">
                <FontAwesomeIcon icon={faMessages} className="h-3 w-3" aria-hidden="true" />
                Chat
              </button>
              <button className="flex flex-row items-center justify-start gap-1 rounded-md bg-red-100 px-4 py-1 text-xs text-red-500 hover:bg-red-200">
                <FontAwesomeIcon icon={faTrashAlt} className="h-3 w-3" aria-hidden="true" />
                Delete
              </button>
            </div>
          );
        } else {
          return (
            <div className="flex flex-row items-center justify-start gap-2 text-sm">
              <button
                type="button"
                className="focus-indicator text-default hover:bg-hover flex h-6 w-6 items-center justify-center rounded-md"
                onClick={onOpenDrawer}
              >
                <FontAwesomeIcon icon={faPen} className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="focus-indicator text-default hover:bg-hover flex h-6 w-6 items-center justify-center rounded-md"
              >
                <FontAwesomeIcon icon={faMessages} className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="focus-indicator text-warn flex h-6 w-6 items-center justify-center rounded-md hover:bg-red-100"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          );
        }
      },
    },
  ];

  const data = [
    {
      name: 'John Doe',
      age: 30,
      location: '123 Main St, New York, NY',
      email: 'john@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'A',
      firstName: 'John',
      lastName: 'Doe',
      school: 'Greenwich High School',
    },
    {
      name: 'Jane Smith',
      age: 25,
      location: '456 Elm St, Los Angeles, CA',
      email: 'jane@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'B',
      firstName: 'Jane',
      lastName: 'Smith',
      school: 'Sunnydale High School',
    },
    {
      name: 'Alice Johnson',
      age: 35,
      location: '789 Oak Ave, Chicago, IL',
      email: 'alice@example.com',
      date: '2024-05-08',
      status: 'in-progress',
      category: 'C',
      firstName: 'Alice',
      lastName: 'Johnson',
      school: 'Riverside Academy',
    },
    {
      name: 'Bob Brown',
      age: 40,
      location: '321 Maple Dr, Houston, TX',
      email: 'bob@example.com',
      date: '2024-05-08',
      status: 'Approved',
      category: 'A',
      firstName: 'Bob',
      lastName: 'Brown',
      school: 'Oakridge High School',
    },
    {
      name: 'Emily Davis',
      age: 28,
      location: '654 Pine Ln, Phoenix, AZ',
      email: 'emily@example.com',
      date: '2024-05-08',
      status: 'Approved',
      category: 'B',
      firstName: 'Emily',
      lastName: 'Davis',
      school: 'Lakeside Prep',
    },
    {
      name: 'Michael Wilson',
      age: 45,
      location: '987 Birch Blvd, Philadelphia, PA',
      email: 'michael@example.com',
      date: '2024-05-08',
      status: 'in-progress',
      category: 'C',
      firstName: 'Michael',
      lastName: 'Wilson',
      school: 'Pinehill Secondary School',
    },
    {
      name: 'Samantha Martinez',
      age: 33,
      location: '258 Cedar Ct, San Antonio, TX',
      email: 'samantha@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'A',
      firstName: 'Samantha',
      lastName: 'Martinez',
      school: 'Westview Academy',
    },
    {
      name: 'David Anderson',
      age: 38,
      location: '147 Walnut St, San Diego, CA',
      email: 'david@example.com',
      date: '2024-05-08',
      status: 'in-progress',
      category: 'B',
      firstName: 'David',
      lastName: 'Anderson',
      school: 'Northfield High',
    },
    {
      name: 'Jessica Taylor',
      age: 29,
      location: '963 Chestnut Rd, Dallas, TX',
      email: 'jessica@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'C',
      firstName: 'Jessica',
      lastName: 'Taylor',
      school: 'Valley View School',
    },
    {
      name: 'Daniel Thomas',
      age: 42,
      location: '741 Spruce Ave, San Jose, CA',
      email: 'daniel@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'A',
      firstName: 'Daniel',
      lastName: 'Thomas',
      school: 'Maplewood Institute',
    },
    {
      name: 'Maria Garcia',
      age: 31,
      location: '852 Redwood Way, Austin, TX',
      email: 'maria@example.com',
      date: '2024-05-08',
      status: 'in-progress',
      category: 'B',
      firstName: 'Maria',
      lastName: 'Garcia',
      school: 'Heritage Academy',
    },
    {
      name: 'James Rodriguez',
      age: 39,
      location: '369 Sycamore Pl, Jacksonville, FL',
      email: 'james@example.com',
      date: '2024-05-08',
      status: 'Approved',
      category: 'C',
      firstName: 'James',
      lastName: 'Rodriguez',
      school: 'Ridgeview College',
    },
    {
      name: 'Jennifer Hernandez',
      age: 27,
      location: '123 Aspen Blvd, Indianapolis, IN',
      email: 'jennifer@example.com',
      date: '2024-05-08',
      status: 'Approved',
      category: 'A',
      firstName: 'Jennifer',
      lastName: 'Hernandez',
      school: 'Greenfield High',
    },
    {
      name: 'Christopher Lopez',
      age: 36,
      location: '456 Cypress Dr, San Francisco, CA',
      email: 'christopher@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'B',
      firstName: 'Christopher',
      lastName: 'Lopez',
      school: 'Lakeside Academy',
    },
    {
      name: 'Ashley Martinez',
      age: 32,
      location: '789 Willow Ln, Columbus, OH',
      email: 'ashley@example.com',
      date: '2024-05-08',
      status: 'in-progress',
      category: 'C',
      firstName: 'Ashley',
      lastName: 'Martinez',
      school: 'Mountainview High',
    },
    {
      name: 'Matthew Gonzales',
      age: 37,
      location: '321 Poplar St, Charlotte, NC',
      email: 'matthew@example.com',
      date: '2024-05-08',
      status: 'Approved',
      category: 'A',
      firstName: 'Matthew',
      lastName: 'Gonzales',
      school: 'Crescent City School',
    },
    {
      name: 'Amanda Young',
      age: 26,
      location: '654 Hickory Blvd, Fort Worth, TX',
      email: 'amanda@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'B',
      firstName: 'Amanda',
      lastName: 'Young',
      school: 'Silverstone Academy',
    },
    {
      name: 'Ryan Scott',
      age: 41,
      location: '963 Dogwood Rd, Detroit, MI',
      email: 'ryan@example.com',
      date: '2024-05-08',
      status: 'in-progress',
      category: 'C',
      firstName: 'Ryan',
      lastName: 'Scott',
      school: 'Riverbank School',
    },
    {
      name: 'Nicole King',
      age: 34,
      location: '258 Magnolia Ln, El Paso, TX',
      email: 'nicole@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'A',
      firstName: 'Nicole',
      lastName: 'King',
      school: 'Sunset High School',
    },
    {
      name: 'Kevin Wright',
      age: 43,
      location: '147 Beech St, Memphis, TN',
      email: 'kevin@example.com',
      date: '2024-05-08',
      status: 'Approved',
      category: 'B',
      firstName: 'Kevin',
      lastName: 'Wright',
      school: 'Eastside Academy',
    },
    {
      name: 'Laura Adams',
      age: 30,
      location: '741 Juniper Way, Boston, MA',
      email: 'laura@example.com',
      date: '2024-05-08',
      status: 'Draft',
      category: 'C',
      firstName: 'Laura',
      lastName: 'Adams',
      school: 'Westbrook High School',
    },
  ];

  const fetchData = async () => {
    return {
      data,
      count: 2,
    };
  };

  const filters: FilterType[] = [
    {
      filterName: 'country',
      filterOptions: [
        { value: 'india', label: 'India', id: '1' },
        { value: 'canada', label: 'Canada', id: '2' },
        { value: 'mexico', label: 'Mexico', id: '3' },
        { value: 'brazil', label: 'Brazil', id: '4' },
        { value: 'argentina', label: 'Argentina', id: '5' },
        { value: 'uk', label: 'United Kingdom', id: '6' },
        { value: 'germany', label: 'Germany', id: '7' },
        { value: 'france', label: 'France', id: '8' },
        { value: 'italy', label: 'Italy', id: '9' },
        { value: 'spain', label: 'Spain', id: '10' },
      ],
      placeholder: 'Countries',
    },
    {
      filterName: 'city',
      filterOptions: [
        { value: 'mumbai', label: 'Mumbai', id: '1' },
        { value: 'delhi', label: 'Delhi', id: '2' },
        { value: 'bangalore', label: 'Bangalore', id: '3' },
        { value: 'hyderabad', label: 'Hyderabad', id: '4' },
        { value: 'chennai', label: 'Chennai', id: '5' },
        { value: 'kolkata', label: 'Kolkata', id: '6' },
        { value: 'pune', label: 'Pune', id: '7' },
        { value: 'jaipur', label: 'Jaipur', id: '8' },
        { value: 'ahmedabad', label: 'Ahmedabad', id: '9' },
        { value: 'lucknow', label: 'Lucknow', id: '10' },
      ],
      placeholder: 'Cities',
      multiSelect: true,
      defaultValue: [
        { value: 'canada', label: 'Canada', id: '2' },
        { value: 'germany', label: 'Germany', id: '7' },
        { value: 'france', label: 'France', id: '8' },
      ],
    },
    {
      filterName: 'discipline',
      filterOptions: [
        {
          id: '1',
          label: 'Option 1',
          value: 'option1',
          isChecked: false,
          isPartialChecked: false,
          isExpanded: false,
          isParent: true,
          children: [
            {
              id: '1-1',
              label: 'Option 1.1',
              value: 'option1.1',
              isChecked: false,
              isPartialChecked: false,
              isExpanded: false,
              parentId: '1',
              isChild: true,
              children: [
                {
                  id: '1-1-1',
                  label: 'Option 1.1.1',
                  value: 'option1.1.1',
                  isChecked: false,
                  isPartialChecked: false,
                  isExpanded: false,
                  parentId: '1-1',
                  isChild: true,
                  children: [],
                },
                {
                  id: '1-1-2',
                  label: 'Option 1.1.2',
                  value: 'option1.1.2',
                  isChecked: false,
                  isPartialChecked: false,
                  isExpanded: false,
                  parentId: '1-1',
                  isChild: true,
                  children: [],
                },
              ],
            },
            {
              id: '1-2',
              label: 'Option 1.2',
              value: 'option1.2',
              isChecked: false,
              isPartialChecked: false,
              isExpanded: false,
              parentId: '1',
              isChild: true,
              children: [
                {
                  id: '1-2-1',
                  label: 'Option 1.2.1',
                  value: 'option1.2.1',
                  isChecked: false,
                  isPartialChecked: false,
                  isExpanded: false,
                  parentId: '1-2',
                  isChild: true,
                  children: [],
                },
                {
                  id: '1-2-2',
                  label: 'Option 1.2.2',
                  value: 'option1.2.2',
                  isChecked: false,
                  isPartialChecked: false,
                  isExpanded: false,
                  parentId: '1-2',
                  isChild: true,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: '2',
          label: 'Option 2',
          value: 'option2',
          isChecked: false,
          isPartialChecked: false,
          isExpanded: false,
          isParent: true,
          children: [
            {
              id: '2-1',
              label: 'Option 2.1',
              value: 'option2.1',
              isChecked: false,
              isPartialChecked: false,
              isExpanded: false,
              parentId: '2',
              isChild: true,
              children: [],
            },
          ],
        },
        {
          id: '3',
          label: 'Option 3',
          value: 'option3',
          isChecked: false,
          isPartialChecked: false,
          isExpanded: false,
          isParent: true,
          children: [],
        },
      ],
      placeholder: 'Discipline',
      treeSelect: true,
    },
  ];

  const onFilterChange = (selectedOptions: any) => {
    console.log(selectedOptions);
  };

  const onOpenDrawer = () => {
    drawerRef.current?.handleDrawer(drawerData);
  };

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <InfiniteScrollTable
          columns={columns}
          fetchDataOnScroll={fetchData}
          queryKey={['assignments']}
          searchable={true}
          maxHeight="calc(100vh - 210px)"
          noOfCard={2}
          onViewChange={setViewType}
          configureColumns={true}
          tableActions={<Filter filters={filters} onFilterChange={onFilterChange} />}
        ></InfiniteScrollTable>
      </QueryClientProvider>
      <DemoDrawer ref={drawerRef} />
    </div>
  );
}
