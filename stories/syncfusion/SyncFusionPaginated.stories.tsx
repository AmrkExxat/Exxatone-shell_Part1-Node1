import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import moment from 'moment';
import { faMessages, faPen, faTrashAlt } from '@fortawesome/pro-light-svg-icons';
import { ThemeDecorator } from '../ThemeDecorator';
import { Avatar, ShowMore, Status } from '../../libs/ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import SyncfusionGridPagination from '../../libs/ui/components/syncfusion/paginated-grid/SyncfusionGridPagination';

const meta = {
  title: 'SyncFusion/SyncFusion/Paginated',
  component: SyncfusionGridPagination,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SyncfusionGridPagination>;

export default meta;

type Story = StoryObj<typeof SyncfusionGridPagination>;

let count = 0;

function addGuidsToArray<T extends object>(
  arr: T[],
  key: string = 'id'
): (T & { [k: string]: string })[] {
  return arr.map((item) => ({
    ...item,
    [key]: crypto.randomUUID(),
  }));
}

export const SyncFusion: Story = {
  render: () => {
    const gridRef = useRef<any>(null);
    const [columns, setColumns] = useState<any>([]);

    const columnsList = [
      {
        id: 'col_name',
        fieldName: 'name',
        headerName: 'Name',
        hiddenOrder: 2,
        isBold: true,
        canSort: false,
        width: 300,
        isTruncate: true,
        renderCell: (row: any) => {
          const avatars = [
            '/avatars/avatar-1.jpg',
            '/avatars/avatar-2.jpg',
            '/avatars/avatar-3.jpg',
          ];

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
        id: 'col_course',
        fieldName: 'course',
        headerName: 'Course',
        hiddenOrder: 8,
        isBold: false,
        canSort: true,
        width: 200,
        isTruncate: false,
        renderCell: () => {
          const data = [
            { id: 1, name: 'Angular Angular Angular Angular' },
            { id: 2, name: 'React' },
            { id: 3, name: 'Next js' },
            { id: 4, name: 'JavaScript' },
            { id: 5, name: 'FrontEnd' },
          ];
          return (
            <ShowMore
              type="list"
              rowData={data}
              selector={['name']}
              showTooltip={true}
              maxLength={2}
            />
          );
        },
      },
      {
        id: 'col_location',
        fieldName: 'location',
        headerName: 'Location',
        hiddenOrder: 3,
        isBold: true,
        canSort: true,
        width: 190,
        isTruncate: true,
      },
      {
        id: 'col_school',
        fieldName: 'school',
        headerName: 'School',
        hiddenOrder: 3,
        isBold: true,
        canSort: true,
        width: 150,
        isTruncate: true,
      },
      {
        id: 'col_email',
        fieldName: 'email',
        headerName: 'Email',
        hiddenOrder: 4,
        isBold: false,
        canSort: true,
        width: 190,
        isTruncate: false,
        renderCell: (row: any) => {
          return (
            <a
              className="link-text cursor-pointer text-sm break-words"
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
        width: 180,
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
        width: 150,
        isTruncate: false,
        renderCell: (row: any) => {
          return <span>{moment.utc(row?.date).format('MMM DD, YYYY')}</span>;
        },
      },
      {
        id: 'col_date1',
        fieldName: 'date',
        headerName: 'Date',
        hiddenOrder: 6,
        isBold: false,
        canSort: false,
        width: 150,
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
        width: 150,
        isTruncate: false,
        renderCell: () => {
          return <div className="text-sm">Speech Pathology</div>;
        },
      },
      {
        id: 'col_action',
        fieldName: 'action',
        headerName: 'Action',
        hiddenOrder: 1,
        isBold: true,
        canSort: false,
        width: 140,
        isTruncate: false,
        renderCell: () => {
          return (
            <div className="flex flex-row items-center justify-start gap-2 text-sm">
              <button
                type="button"
                className="focus-indicator text-default hover:bg-hover flex h-6 w-6 items-center justify-center rounded-md"
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
        disabled: true,
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

    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const fetchData = async () => {
      const da = [];

      await sleep(2000); // sleep for 2 seconds

      for (let i = 0; i < 21; i++) {
        da.push({
          ...data[i],
          name: `${data[i].name}_${count + 1}_index`,
        });
        count = ++count;
      }

      return {
        data: addGuidsToArray(da, 'id'),
        totalCount: 210,
      };
    };

    useEffect(() => {
      setColumns(columnsList);
    }, []);

    return (
      <SyncfusionGridPagination
        ref={gridRef}
        columns={columns}
        fetchData={fetchData}
        configureColumns={true}
        allowSorting={true}
        allowResizing={true}
        allowReordering={true}
        checkboxSelection={true}
        showSelectAll={true}
        allowPaging={true}
        siteId={''}
      >
        <div></div>
      </SyncfusionGridPagination>
    );
  },
};
