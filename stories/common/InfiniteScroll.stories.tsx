import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeDecorator } from '../ThemeDecorator';
import { InfiniteScroll } from '../../libs/ui';

const meta = {
  title: 'Common/InfiniteScroll',
  component: InfiniteScroll,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InfiniteScroll>;

export default meta;

type Story = StoryObj<typeof InfiniteScroll>;

export const Table: Story = {
  render: () => {
    const queryClient = new QueryClient();

    const data = [
      {
        name: 'John Doe',
        age: 30,
        location: 'New York',
        email: 'john@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'A',
      },
      {
        name: 'Jane Smith',
        age: 25,
        location: 'Los Angeles',
        email: 'jane@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'B',
      },
      {
        name: 'Alice Johnson',
        age: 35,
        location: 'Chicago',
        email: 'alice@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'C',
      },
      {
        name: 'Bob Brown',
        age: 40,
        location: 'Houston',
        email: 'bob@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'A',
      },
      {
        name: 'Emily Davis',
        age: 28,
        location: 'Phoenix',
        email: 'emily@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'B',
      },
      {
        name: 'Michael Wilson',
        age: 45,
        location: 'Philadelphia',
        email: 'michael@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'C',
      },
      {
        name: 'Samantha Martinez',
        age: 33,
        location: 'San Antonio',
        email: 'samantha@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'A',
      },
      {
        name: 'David Anderson',
        age: 38,
        location: 'San Diego',
        email: 'david@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'B',
      },
      {
        name: 'Jessica Taylor',
        age: 29,
        location: 'Dallas',
        email: 'jessica@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'C',
      },
      {
        name: 'Daniel Thomas',
        age: 42,
        location: 'San Jose',
        email: 'daniel@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'A',
      },
      {
        name: 'Maria Garcia',
        age: 31,
        location: 'Austin',
        email: 'maria@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'B',
      },
      {
        name: 'James Rodriguez',
        age: 39,
        location: 'Jacksonville',
        email: 'james@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'C',
      },
      {
        name: 'Jennifer Hernandez',
        age: 27,
        location: 'Indianapolis',
        email: 'jennifer@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'A',
      },
      {
        name: 'Christopher Lopez',
        age: 36,
        location: 'San Francisco',
        email: 'christopher@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'B',
      },
      {
        name: 'Ashley Martinez',
        age: 32,
        location: 'Columbus',
        email: 'ashley@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'C',
      },
      {
        name: 'Matthew Gonzales',
        age: 37,
        location: 'Charlotte',
        email: 'matthew@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'A',
      },
      {
        name: 'Amanda Young',
        age: 26,
        location: 'Fort Worth',
        email: 'amanda@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'B',
      },
      {
        name: 'Ryan Scott',
        age: 41,
        location: 'Detroit',
        email: 'ryan@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'C',
      },
      {
        name: 'Nicole King',
        age: 34,
        location: 'El Paso',
        email: 'nicole@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'A',
      },
      {
        name: 'Kevin Wright',
        age: 43,
        location: 'Memphis',
        email: 'kevin@example.com',
        date: '2024-05-08',
        status: 'Inactive',
        category: 'B',
      },
      {
        name: 'Laura Adams',
        age: 30,
        location: 'Boston',
        email: 'laura@example.com',
        date: '2024-05-08',
        status: 'Active',
        category: 'C',
      },
    ];

    const fetchData = async () => {
      return {
        data,
        count: 2,
      };
    };

    const [query, setQuery] = useState('');

    return (
      <QueryClientProvider client={queryClient}>
        <InfiniteScroll
          fetchDataOnScroll={fetchData}
          queryKey={'assignments'}
          externalQuery={query}
          filterPayload={null}
          containerHeight="calc(100vh - 550px)"
        >
          {(sayHello) => (
            <>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
              <div>Hello</div>
            </>
          )}
        </InfiniteScroll>
      </QueryClientProvider>
    );
  },
};
