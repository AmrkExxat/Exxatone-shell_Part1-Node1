/* eslint-disable react/display-name */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { InfiniteScrollComboBox } from '../../libs/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const meta = {
  title: 'Shared UI/InfiniteScrollComboBox1',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const InfiniteScrollComboBox1: Story = {
  render: () => {
    const onFilterChange = (values) => {
      console.log(values);
    };
    const fetchOptions = (query) => {
      const params = query.params;
      const searchedText = query.debouncedSearch;
      console.log('query', query);
      return new Promise((resolve) => {
        setTimeout(() => {
          let data = Array.from({ length: 20 }, (_, index) => ({
            value: `${params.pageParam * 20 + index + 1}`,
            label: `Option${params.pageParam * 20 + index + 1}`,
            id: `Option${params.pageParam * 20 + index + 1}`,
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

    const height = { height: '500px' };

    return (
      <QueryClientProvider client={queryClient}>
        <InfiniteScrollComboBox
          onSelect={onFilterChange}
          fetchDataOnScroll={fetchOptions}
          isMulti={false}
        />
      </QueryClientProvider>
    );
  },
};
