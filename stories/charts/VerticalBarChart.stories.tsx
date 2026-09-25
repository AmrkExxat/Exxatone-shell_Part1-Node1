import type { Meta, StoryObj } from '@storybook/nextjs';
import { VerticalBarChart } from '../../libs/ui';

const meta = {
  title: 'Charts/VerticalBar Chart',
  component: VerticalBarChart,
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof VerticalBarChart>;

export default meta;

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
        data: labels.map(() => generateRandomData(0, 1000)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => generateRandomData(0, 1000)),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  },
};
