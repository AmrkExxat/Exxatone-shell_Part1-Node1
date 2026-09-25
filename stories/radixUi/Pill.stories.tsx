import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Pill } from '../../libs/ui/radixUi/Pill';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Radix UI/Pill',
  component: Pill,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Pill Label',
    variant: 'filled',
    size: 'sm',
    type: 'pill',
    colorScheme: 'default',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['filled', 'outlined'],
      description: 'Visual variant of the pill',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size of the pill',
    },
    type: {
      control: 'radio',
      options: ['pill', 'square'],
      description: 'Shape type of the pill',
    },
    colorScheme: {
      control: 'radio',
      options: ['default', 'success', 'warning', 'info', 'error'],
      description: 'Semantic color scheme',
    },
    customBgColor: {
      control: 'color',
      description: 'Custom background color (overrides colorScheme for filled variant)',
    },
    customTextColor: {
      control: 'color',
      description: 'Custom text color (overrides colorScheme)',
    },
    customBorderColor: {
      control: 'color',
      description: 'Custom border color (overrides colorScheme for outlined variant)',
    },
    children: {
      control: 'text',
      description: 'The text content of the pill',
    },
    startAdornment: {
      control: false,
      description: 'Element to render at the start (e.g., icon)',
    },
    endAdornment: {
      control: false,
      description: 'Element to render at the end (e.g., icon)',
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;

type Story = StoryObj<typeof Pill>;

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.3334 4L6.00008 11.3333L2.66675 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
  </svg>
);

const DotIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill={color} />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 7H14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Pill',
  },
};

/* -------------------------------- Variants -------------------------------- */

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-600">Filled</h3>
        <div className="flex flex-wrap gap-2">
          <Pill variant="filled" colorScheme="default">
            Default
          </Pill>
          <Pill variant="filled" colorScheme="success">
            Success
          </Pill>
          <Pill variant="filled" colorScheme="warning">
            Warning
          </Pill>
          <Pill variant="filled" colorScheme="info">
            Info
          </Pill>
          <Pill variant="filled" colorScheme="error">
            Error
          </Pill>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-600">Outlined</h3>
        <div className="flex flex-wrap gap-2">
          <Pill variant="outlined" colorScheme="default">
            Default
          </Pill>
          <Pill variant="outlined" colorScheme="success">
            Success
          </Pill>
          <Pill variant="outlined" colorScheme="warning">
            Warning
          </Pill>
          <Pill variant="outlined" colorScheme="info">
            Info
          </Pill>
          <Pill variant="outlined" colorScheme="error">
            Error
          </Pill>
        </div>
      </div>
    </div>
  ),
};

/* -------------------------------- Sizes -------------------------------- */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Pill size="sm">Small</Pill>
        <Pill size="md">Medium</Pill>
      </div>
      <div className="flex items-center gap-4">
        <Pill size="sm" variant="outlined">
          Small Outlined
        </Pill>
        <Pill size="md" variant="outlined">
          Medium Outlined
        </Pill>
      </div>
    </div>
  ),
};

/* -------------------------------- Types (Shapes) -------------------------------- */

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-600">Pill (Default - Fully Rounded)</h3>
        <div className="flex flex-wrap gap-2">
          <Pill type="pill" size="sm">
            Small Pill
          </Pill>
          <Pill type="pill" size="md">
            Medium Pill
          </Pill>
          <Pill type="pill" variant="outlined" size="sm">
            Outlined Pill
          </Pill>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-600">Square (Minimal Rounding)</h3>
        <div className="flex flex-wrap gap-2">
          <Pill type="square">Pediatric PT</Pill>
          <Pill type="square" variant="outlined">
            Square Outlined
          </Pill>
          <Pill type="square" colorScheme="success">
            Approved
          </Pill>
          <Pill type="square" colorScheme="error">
            Rejected
          </Pill>
        </div>
      </div>
    </div>
  ),
};

export const SquareWithCloseIcon: Story = {
  render: () => {
    const CloseIcon = () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L4 12M4 4L12 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

    return (
      <div className="flex flex-wrap gap-3">
        <Pill type="square" colorScheme="default" endAdornment={<CloseIcon />}>
          Pediatric PT
        </Pill>
        <Pill type="square" colorScheme="info" variant="outlined" endAdornment={<CloseIcon />}>
          Outpatient
        </Pill>
        <Pill type="square" colorScheme="success" endAdornment={<CloseIcon />}>
          Full-time
        </Pill>
      </div>
    );
  },
};

/* -------------------------------- Types (Shapes) -------------------------------- */

export const TypesWithCloseIcon: Story = {
  render: () => {
    const CloseIcon = () => (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M12 4L4 12M4 4l8 8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );

    return (
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-600">Pill Type (Default)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Pill type="pill">Pill Shape</Pill>
            <Pill type="pill" variant="outlined">
              Pill Outlined
            </Pill>
            <Pill type="pill" colorScheme="success">
              Success Pill
            </Pill>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-600">Square Type</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Pill type="square" endAdornment={<CloseIcon />}>
              Square Shape
            </Pill>
            <Pill type="square" variant="outlined" endAdornment={<CloseIcon />}>
              Square Outlined
            </Pill>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-600">Square with Close Icon</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Pill type="square" colorScheme="info" endAdornment={<CloseIcon />}>
              Pediatric PT
            </Pill>
            <Pill
              type="square"
              variant="outlined"
              colorScheme="default"
              endAdornment={<CloseIcon />}
            >
              Removable Tag
            </Pill>
          </div>
        </div>
      </div>
    );
  },
};

/* -------------------------------- With Adornments -------------------------------- */

export const WithStartAdornment: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Pill colorScheme="success" startAdornment={<CheckIcon />}>
        Application Submitted
      </Pill>
      <Pill colorScheme="success" startAdornment={<EyeIcon />}>
        Application Viewed
      </Pill>
      <Pill variant="outlined" colorScheme="default" startAdornment={<CalendarIcon />}>
        Due on 10 Sep
      </Pill>
    </div>
  ),
};

export const WithEndAdornment: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Pill customBgColor="#FFF0E8" customTextColor="#1a1a1a" endAdornment={<InfoIcon />}>
        🤩 Perfect Fit
      </Pill>
    </div>
  ),
};

export const WithBothAdornments: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Pill colorScheme="info" startAdornment={<CalendarIcon />} endAdornment={<InfoIcon />}>
        Scheduled
      </Pill>
    </div>
  ),
};

export const StatusPills: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-600">Application Status</h3>
      <div className="flex flex-wrap gap-3">
        <Pill colorScheme="success" startAdornment={<CheckIcon />}>
          Application Submitted
        </Pill>
        <Pill colorScheme="success" startAdornment={<EyeIcon />}>
          Application Viewed
        </Pill>
        <Pill colorScheme="warning">Incomplete</Pill>
        <Pill customBgColor="#FEF3E2" customTextColor="#0D7377">
          Coming Soon
        </Pill>
      </div>
    </div>
  ),
};

export const ActionRequired: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Pill variant="outlined" colorScheme="error" startAdornment={<DotIcon color="#DC2626" />}>
        Action Required
      </Pill>
      <Pill variant="outlined" colorScheme="default" startAdornment={<CalendarIcon />}>
        Due on 10 Sep
      </Pill>
      <Pill variant="outlined" colorScheme="info" startAdornment={<CalendarIcon />}>
        Upcoming
      </Pill>
    </div>
  ),
};

export const AttributeTags: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-600">Job Attributes</h3>
      <div className="flex flex-wrap gap-2">
        <Pill variant="outlined" colorScheme="default">
          💰 34k Yearly
        </Pill>
        <Pill variant="outlined" colorScheme="default">
          🏥 Outpatient
        </Pill>
        <Pill variant="outlined" colorScheme="default">
          ✓ Full-time
        </Pill>
        <Pill variant="outlined" colorScheme="default">
          🌱 Fresh Graduate
        </Pill>
      </div>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium text-gray-600">Custom Color Schemes</h3>
      <div className="flex flex-wrap gap-3">
        <Pill customBgColor="#FFF0E8" customTextColor="#1a1a1a">
          🤩 Perfect Fit
        </Pill>
        <Pill customBgColor="#E8F51C" customTextColor="#1a1a1a">
          Incomplete
        </Pill>
        <Pill customBgColor="#FEF3E2" customTextColor="#0D7377">
          Coming Soon
        </Pill>
        <Pill customBgColor="#F0FDF4" customTextColor="#166534">
          Approved
        </Pill>
      </div>
      <h3 className="text-sm font-medium text-gray-600">Custom Outlined</h3>
      <div className="flex flex-wrap gap-3">
        <Pill variant="outlined" customBorderColor="#7C3AED" customTextColor="#7C3AED">
          Purple
        </Pill>
        <Pill variant="outlined" customBorderColor="#EC4899" customTextColor="#EC4899">
          Pink
        </Pill>
        <Pill variant="outlined" customBorderColor="#14B8A6" customTextColor="#14B8A6">
          Teal
        </Pill>
      </div>
    </div>
  ),
};
