import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { StatusCard } from '../../libs/ui/radixUi/StatusCard';
import { ThemeDecorator } from '../ThemeDecorator';

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      d="M12.5 5L6.75 10.75L3.5 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      d="M8 3.5V10.5M8 3.5L5.5 6M8 3.5L10.5 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3 12.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StatusRow = () => (
  <div className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
      <CheckIcon />
    </span>
    <span>Imported Successfully</span>
  </div>
);

const CardContent = () => (
  <div className="flex flex-col gap-5">
    <div className="flex items-start gap-4">
      <img
        src="/avatars/avatar-1.jpg"
        alt="William Johnson"
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <div className="text-base font-semibold text-gray-900">William Johnson</div>
        <div className="text-sm text-gray-500">He/Him</div>
        <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
          <div>Doctor of Physical Therapy (DPT)</div>
          <div>University of Southern California</div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <progress
        className="h-2 flex-1 appearance-none overflow-hidden rounded-full bg-gray-200 [&::-moz-progress-bar]:bg-green-500 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-green-500"
        value={75}
        max={100}
        aria-label="Profile completion"
      />
      <span className="text-xs font-medium text-gray-600">75% Completed</span>
    </div>

    <div className="bg-card rounded-xl border border-gray-100 p-4">
      <div className="flex flex-col gap-4">
        {[
          {
            title: 'Personal Information',
            description: 'Name, pronouns, profile photo',
          },
          {
            title: 'Contact Details',
            description: 'Email address, phone number',
          },
          {
            title: 'Address Information',
            description: 'Current address, permanent address',
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">{item.title}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
              <CheckIcon />
            </span>
          </div>
        ))}
      </div>
    </div>

    <button
      type="button"
      className="w-full rounded-md border border-gray-300 py-2 text-sm font-semibold text-gray-700"
    >
      Review And Edit Details
    </button>
  </div>
);

const meta = {
  title: 'Radix UI/StatusCard',
  component: StatusCard,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="bg-gray-50 p-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A generic card container that renders a status section in the lower card',
          'and stacks the main content above it.',
          'Use the `status` and `content` props to pass any React nodes.',
          '',
          'Example:',
          '<StatusCard',
          '  status={<StatusRow />}',
          '  content={<YourContent />}',
          '/>',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: {
    status: <StatusRow />,
    content: <CardContent />,
    statusBackgroundClassName: 'bg-green-50',
    className: 'w-[420px]',
  },
  argTypes: {
    status: {
      control: false,
      description: 'Status content displayed in the lower card',
    },
    content: {
      control: false,
      description: 'Main card content displayed in the top card',
    },
    statusBackgroundClassName: {
      control: 'text',
      description: 'Background class for the status section',
    },
    statusBackgroundColor: {
      control: 'color',
      description: 'Background color for the status section (overrides class)',
    },
    statusClassName: {
      control: 'text',
      description: 'Additional classes for the status content wrapper',
    },
  },
} satisfies Meta<typeof StatusCard>;

export default meta;

type Story = StoryObj<typeof StatusCard>;

export const Default: Story = {};

export const Warning: Story = {
  args: {
    status: (
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-yellow-700">
          <CheckIcon />
        </span>
        <span>Requires Attention</span>
      </div>
    ),
    statusBackgroundClassName: 'bg-yellow-50',
  },
};

export const WithoutIcon: Story = {
  args: {
    status: <span className="text-sm font-semibold text-gray-700">Imported Successfully</span>,
    statusBackgroundClassName: 'bg-gray-50',
  },
};

export const CustomIcon: Story = {
  args: {
    status: (
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <UploadIcon />
        </span>
        <span>Profile Imported</span>
      </div>
    ),
    statusBackgroundClassName: 'bg-blue-50',
  },
};
