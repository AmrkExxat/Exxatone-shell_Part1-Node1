import type { Meta, StoryObj } from '@storybook/nextjs';
import { StackBarChart } from '../../libs/ui';

const meta = {
  title: 'Charts/StackBar Chart',
  component: StackBarChart,
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof StackBarChart>;

export default meta;

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// Function to generate random number between min and max
const generateRandomData = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => generateRandomData(-1000, 1000)),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => generateRandomData(-1000, 1000)),
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Dataset 3',
        data: labels.map(() => generateRandomData(-1000, 1000)),
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
    options,
  },
};
