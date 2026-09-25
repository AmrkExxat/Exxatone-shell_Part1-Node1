import type { Meta, StoryObj } from '@storybook/nextjs';

import { PieChart } from '../../libs/ui';

const meta = {
  title: 'Charts/Pie Chart',
  component: PieChart,
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    onSegmentClick: (segment) => {
      console.log('Clicked segment:', segment);
      alert(`Clicked: ${segment.label} with value ${segment.value} at index ${segment.index}`);
    },
  },
};

export const EmptyData: Story = {
  args: {
    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
    datasets: [
      {
        label: 'Sample Data',
        data: [0, 0, 0, 0], // All zero values
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
    options: {
      plugins: {
        legend: {
          position: 'right',
          display: true,
        },
      },
    },
    onSegmentClick: (segment) => {
      console.log('Empty data segment clicked:', segment);
      alert(`Clicked: ${segment.label} with value ${segment.value} at index ${segment.index}`);
    },
  },
};

export const NoData: Story = {
  args: {
    labels: [],
    datasets: [],
    options: {
      plugins: {
        legend: {
          position: 'right',
          display: true,
        },
      },
    },
    onSegmentClick: (segment) => {
      console.log('No data segment clicked:', segment);
      alert(`Clicked: ${segment.label} with value ${segment.value} at index ${segment.index}`);
    },
  },
};
