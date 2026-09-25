import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { HorizontalScroll } from '../../libs/ui/components/common/HorizontalScroll';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/HorizontalScroll',
  component: HorizontalScroll,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="w-full p-4 sm:p-6 md:p-8">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HorizontalScroll>;

export default meta;

type Story = StoryObj<typeof HorizontalScroll>;

const jobCards = [
  {
    id: 1,
    title: 'Geriatric Nurse Practitioner',
    company: 'Sunrise Senior Living',
    location: 'Towson, MD',
    meta: ['Great Fit', '$78k Yearly', 'Inpatient'],
    posted: '1d ago',
  },
  {
    id: 2,
    title: 'Pediatric Nurse Practitioner',
    company: 'Johns Hopkins Medicine',
    location: 'Baltimore, MD',
    meta: ['Good Fit', '$92k Yearly', 'Outpatient'],
    posted: '2d ago',
  },
  {
    id: 3,
    title: 'Family Nurse Practitioner',
    company: 'MedStar Health',
    location: 'Washington, DC',
    meta: ['Great Fit', '$85k Yearly', 'Primary Care'],
    posted: '3d ago',
  },
  {
    id: 4,
    title: 'Acute Care Nurse Practitioner – Critical Care & Emergency',
    company: 'Cleveland Clinic Health System',
    location: 'Cleveland, OH',
    meta: ['Great Fit', '$95k Yearly', 'Inpatient'],
    posted: '4d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'Psychiatric Nurse Practitioner',
    company: 'Kaiser Permanente',
    location: 'Oakland, CA',
    meta: ['Good Fit', '$105k Yearly', 'Behavioral Health'],
    posted: '5d ago',
  },
] as const;

const JobCard: React.FC<{
  job: (typeof jobCards)[number];
}> = ({ job }) => (
  <article className="bg-card flex min-w-[240px] flex-shrink-0 flex-col rounded-xl border border-gray-200 p-3 shadow-sm sm:max-w-[280px] sm:min-w-[260px] sm:p-4">
    <header className="mb-2 flex min-w-0 items-start justify-between gap-2">
      <div className="min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium text-gray-500">{job.posted}</span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">{job.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-gray-600">{job.company}</p>
      </div>
      <button
        type="button"
        aria-label="Save job"
        className="h-6 w-6 shrink-0 rounded-full border border-gray-200 text-xs text-gray-400 hover:bg-gray-50"
      >
        ♥
      </button>
    </header>
    <div className="mb-3 line-clamp-1 text-xs text-gray-500">{job.location}</div>
    <div className="mt-auto flex flex-wrap gap-1">
      {job.meta.map((chip) => (
        <span
          key={chip}
          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700"
        >
          {chip}
        </span>
      ))}
    </div>
  </article>
);

export const RecommendedJobs: Story = {
  args: {
    scrollAmount: 360,
    title: 'Recommended Jobs for you',
    subtitle: 'Jobs based on your profile and preferences',
    ariaLabel: 'Recommended jobs carousel',
    viewAllLabel: 'View all',
    onViewAllClick: () => {
      // eslint-disable-next-line no-alert
      alert('View all jobs');
    },
    children: (
      <>
        {jobCards.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </>
    ),
  },
};

export const TwoRows: Story = {
  args: {
    scrollAmount: 360,
    title: 'Recommended Jobs for you',
    subtitle: 'Jobs based on your profile and preferences',
    ariaLabel: 'Recommended jobs in two rows',
    viewAllLabel: 'View all',
    onViewAllClick: () => {
      // eslint-disable-next-line no-alert
      alert('View all jobs');
    },
    children: [
      <>
        {jobCards.slice(0, 3).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </>,
      <>
        {jobCards.slice(3, 7).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </>,
    ],
  },
};

export const WithCustomViewAllButton: Story = {
  args: {
    scrollAmount: 360,
    title: 'Recommended Jobs for you',
    subtitle: 'Jobs based on your profile and preferences',
    ariaLabel: 'Recommended jobs carousel',
    titleClassName: 'text-lg font-semibold text-red-500',
    subtitleClassName: 'text-lg text-red-500',
    viewAllButton: (
      <button
        type="button"
        onClick={() => {
          // eslint-disable-next-line no-alert
          alert('Custom View all clicked');
        }}
        className="text-primary focus-visible:outline-primary text-xs font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        aria-label="View all recommended jobs"
      >
        View all
      </button>
    ),
    children: (
      <>
        {jobCards.slice(0, 5).map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </>
    ),
  },
};
