import type { Meta, StoryObj } from '@storybook/nextjs';
import { WeekView } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/WeekView',
  component: WeekView,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'full-width',
    docs: {
      description: {
        component: 'Combination of approaches in Exxat-UI & Exxat-React-UI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    monday: { control: 'boolean', description: 'Select Monday' },
    tuesday: { control: 'boolean', description: 'Select Tuesday' },
    wednesday: { control: 'boolean', description: 'Select Wednesday' },
    thursday: { control: 'boolean', description: 'Select Thursday' },
    friday: { control: 'boolean', description: 'Select Friday' },
    saturday: { control: 'boolean', description: 'Select Saturday' },
    sunday: { control: 'boolean', description: 'Select Sunday' },
    allDays: { control: 'boolean', description: 'Select all days' },
    daysInWeek: {
      control: 'object',
      description: 'Alternative approach used in exxat-react-ui',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    id: { control: 'text', description: 'Component ID for Pendo Integration' },
  },
} satisfies Meta<typeof WeekView>;

export default meta;

type Story = StoryObj<typeof meta>;

//Default or empty state (ID is mandatory for Pendo)
export const Default: Story = {
  args: {
    id: 'weekview-default',
  },
};

// Individual day selection stories
export const SingleDay: Story = {
  args: {
    wednesday: true,
    id: 'weekview-single',
  },
  parameters: {
    docs: {
      description: {
        story: 'Single day selection example',
      },
    },
  },
};

export const MultipleDays: Story = {
  args: {
    monday: true,
    wednesday: true,
    friday: true,
    id: 'weekview-multiple',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple non-consecutive days selected',
      },
    },
  },
};

export const AllDays: Story = {
  args: {
    allDays: true,
    id: 'weekview-all',
  },
  parameters: {
    docs: {
      description: {
        story: 'All days selected using the allDays prop',
      },
    },
  },
};

// Array-based selection stories
export const DaysInWeekBasedSelection: Story = {
  args: {
    daysInWeek: ['MON', 'WED', 'FRI'],
    id: 'weekview-array',
  },
  parameters: {
    docs: {
      description: {
        story: 'Days selected using the daysInWeek array prop',
      },
    },
  },
};

export const DaysInWeekDays: Story = {
  args: {
    daysInWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    id: 'weekview-array-weekdays',
  },
};

// Combination of Exxat-UI & Exxat-React-UI approaches.
export const MixedInput: Story = {
  args: {
    monday: true,
    wednesday: true,
    daysInWeek: ['TUE', 'THU'],
    id: 'weekview-mixed',
  },
};

export const AllDaysOverride: Story = {
  args: {
    monday: true,
    wednesday: true,
    allDays: true,
    id: 'weekview-override',
  },
};
