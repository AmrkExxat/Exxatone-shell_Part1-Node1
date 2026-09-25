import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  CalendarDaysIcon,
  UserPlusIcon,
  UserGroupIcon,
  BellAlertIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import {
  ProgressWorkflowCard,
  WorkflowBadge,
} from '../../libs/ui/components/common/ProgressWorkflowCard';
import type { WorkflowSection } from '../../libs/ui/components/common/ProgressWorkflowCard';
import { ThemeDecorator } from '../ThemeDecorator';

// ---------------------------------------------------------------------------
// Reusable story helpers
// ---------------------------------------------------------------------------

/** Blue action link with optional leading icon — mirrors the screenshot style. */
const ActionLink: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({
  icon,
  children,
}) => (
  <a
    href="#"
    onClick={(e) => e.preventDefault()}
    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
  >
    {icon}
    {children}
  </a>
);

/** Green "completed" state text — used instead of interactive links. */
const CompletedText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-xs font-medium text-green-600">{children}</span>
);

/** Orange/warning metric text — slots/students not yet filled. */
const WarnMetric: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-medium text-orange-500">{children}</span>
);

/** Neutral dark metric text — slots filled or informational. */
const Metric: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="font-medium text-gray-700">{children}</span>
);

const iconSm = 'h-3.5 w-3.5';

// ---------------------------------------------------------------------------
// Section data factories
// ---------------------------------------------------------------------------

const makeEmptySlotsSection = (): WorkflowSection => ({
  id: 'slots',
  label: 'Slots',
  status: 'pending',
  metric: <WarnMetric>00/08 Students</WarnMetric>,
  secondaryMetric: <WarnMetric>00 Instructors</WarnMetric>,
  actions: (
    <div className="flex flex-wrap gap-3">
      <ActionLink icon={<CalendarDaysIcon className={iconSm} />}>Schedule Students</ActionLink>
      <ActionLink icon={<UserPlusIcon className={iconSm} />}>Add Instructor</ActionLink>
    </div>
  ),
});

const makeEmptyConfirmationSection = (): WorkflowSection => ({
  id: 'confirmation',
  label: 'Confirmation',
  status: 'pending',
  metric: <Metric>00/08 Students</Metric>,
  helperText: 'Slots to be filled',
});

const makeEmptyComplianceSection = (): WorkflowSection => ({
  id: 'compliance',
  label: 'Compliance',
  status: 'pending',
  metric: <Metric>00/08 Members</Metric>,
  badge: <WorkflowBadge label="School Requirements Pending" tone="warning" />,
});

// ---------------------------------------------------------------------------
// Story data — matches every frame in the screenshot
// ---------------------------------------------------------------------------

/** Frame 1 — all pending, nothing filled */
const frame1Sections: WorkflowSection[] = [
  makeEmptySlotsSection(),
  makeEmptyConfirmationSection(),
  makeEmptyComplianceSection(),
];

/** Frame 2 — partially filling slots */
const frame2Sections: WorkflowSection[] = [
  {
    id: 'slots',
    label: 'Slots',
    status: 'in_progress',
    metric: <WarnMetric>04/08 Students</WarnMetric>,
    secondaryMetric: <WarnMetric>00 Instructors</WarnMetric>,
    actions: (
      <div className="flex flex-wrap gap-3">
        <ActionLink icon={<CalendarDaysIcon className={iconSm} />}>Schedule Students</ActionLink>
        <ActionLink icon={<UserPlusIcon className={iconSm} />}>Add Instructor</ActionLink>
      </div>
    ),
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    status: 'in_progress',
    metric: <Metric>01/08 Students</Metric>,
    actions: <ActionLink icon={<UserGroupIcon className={iconSm} />}>Confirm Students</ActionLink>,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    status: 'pending',
    metric: <Metric>00/08 Members</Metric>,
    badge: <WorkflowBadge label="School Requirements Pending" tone="warning" />,
    actions: <ActionLink icon={<BellAlertIcon className={iconSm} />}>Remind Onboarding</ActionLink>,
  },
];

/** Frame 3 — more progress */
const frame3Sections: WorkflowSection[] = [
  {
    id: 'slots',
    label: 'Slots',
    status: 'in_progress',
    metric: <WarnMetric>06/08 Students</WarnMetric>,
    secondaryMetric: <Metric>01 Instructors</Metric>,
    actions: (
      <div className="flex flex-wrap gap-3">
        <ActionLink icon={<CalendarDaysIcon className={iconSm} />}>Schedule Students</ActionLink>
        <ActionLink icon={<UserPlusIcon className={iconSm} />}>Invite Instructor</ActionLink>
      </div>
    ),
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    status: 'in_progress',
    metric: <Metric>05/08 Students</Metric>,
    actions: <ActionLink icon={<UserGroupIcon className={iconSm} />}>Confirm Students</ActionLink>,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    status: 'in_progress',
    metric: <Metric>03/09 Members</Metric>,
    badge: <WorkflowBadge label="School Requirements Pending" tone="warning" />,
    actions: <ActionLink icon={<BellAlertIcon className={iconSm} />}>Remind Onboarding</ActionLink>,
  },
];

/** Frame 4 — slots and confirmation done, compliance partially done */
const frame4Sections: WorkflowSection[] = [
  {
    id: 'slots',
    label: 'Slots',
    status: 'completed',
    metric: <Metric>08/08 Students</Metric>,
    secondaryMetric: <Metric>02 Instructors</Metric>,
    actions: (
      <div className="flex flex-wrap gap-3">
        <CompletedText>All Slots Filled</CompletedText>
        <ActionLink icon={<UserPlusIcon className={iconSm} />}>Invite Instructors</ActionLink>
      </div>
    ),
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    status: 'completed',
    metric: <Metric>08/08 Students</Metric>,
    actions: <CompletedText>All Confirmed</CompletedText>,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    status: 'in_progress',
    metric: <Metric>08/10 Members</Metric>,
    badge: <WorkflowBadge label="School Requirements: Completed" tone="success" />,
    actions: <ActionLink icon={<BellAlertIcon className={iconSm} />}>Remind Onboarding</ActionLink>,
  },
];

/** Frame 5 — fully complete */
const frame5Sections: WorkflowSection[] = [
  {
    id: 'slots',
    label: 'Slots',
    status: 'completed',
    metric: <Metric>08/08 Students</Metric>,
    secondaryMetric: <Metric>02 Instructors</Metric>,
    actions: <CompletedText>All Slots Filled</CompletedText>,
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    status: 'completed',
    metric: <Metric>08/08 Students</Metric>,
    actions: <CompletedText>All Confirmed</CompletedText>,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    status: 'completed',
    metric: <Metric>10/10 Members</Metric>,
    badge: <WorkflowBadge label="School Requirements: Completed" tone="success" />,
    actions: <CompletedText>All Compliant</CompletedText>,
  },
];

/** ACE Placement — no instructor needed variant */
const acePlacementSections: WorkflowSection[] = [
  {
    id: 'slots',
    label: 'Slots',
    status: 'completed',
    metric: <Metric>08/08 Students</Metric>,
    secondaryMetric: (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        No instructor needed
        <span title="This schedule requires a Preceptor">
          <InformationCircleIcon className="h-3.5 w-3.5 cursor-help text-gray-400" />
        </span>
      </span>
    ),
    actions: <CompletedText>All Slots Filled</CompletedText>,
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    status: 'completed',
    metric: <Metric>08/08 Students</Metric>,
    actions: <CompletedText>All Confirmed</CompletedText>,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    status: 'completed',
    metric: <Metric>08/08 Members</Metric>,
    badge: <WorkflowBadge label="School Requirements: Completed" tone="success" />,
    actions: <CompletedText>All Compliant</CompletedText>,
  },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Common/ProgressWorkflowCard',
  component: ProgressWorkflowCard,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
} satisfies Meta<typeof ProgressWorkflowCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Playground — fully interactive via Storybook controls. */
export const Playground: Story = {
  args: {
    sections: frame2Sections,
  },
};

/** All pending — nothing has been filled yet. */
export const AllPending: Story = {
  name: 'All Pending',
  render: () => <ProgressWorkflowCard sections={frame1Sections} />,
};

/** Partially filled — slots and confirmation are in progress. */
export const InProgress: Story = {
  name: 'In Progress',
  render: () => <ProgressWorkflowCard sections={frame2Sections} />,
};

/** Slots and confirmation done, compliance still being collected. */
export const NearComplete: Story = {
  name: 'Near Complete',
  render: () => <ProgressWorkflowCard sections={frame4Sections} />,
};

/** Every section is fully completed. */
export const AllCompleted: Story = {
  name: 'All Completed',
  render: () => <ProgressWorkflowCard sections={frame5Sections} />,
};

/** ACE Placement — no instructor required; tooltip on secondary metric. */
export const ACEPlacement: Story = {
  name: 'ACE Placement (No Instructor)',
  render: () => <ProgressWorkflowCard sections={acePlacementSections} />,
};

/**
 * All progress states stacked — mirrors every frame in the original screenshot.
 * Great for visual regression / design review.
 */
export const AllProgressStates: Story = {
  name: 'All Progress States (Screenshot Replica)',
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        frame1Sections,
        frame2Sections,
        frame3Sections,
        frame4Sections,
        frame5Sections,
        acePlacementSections,
      ].map((sections, i) => (
        <ProgressWorkflowCard key={i} sections={sections} />
      ))}
    </div>
  ),
};

/** Four-section variant — demonstrates that the layout scales beyond 3 columns. */
export const FourSections: Story = {
  name: 'Four Sections',
  render: () => (
    <ProgressWorkflowCard
      sections={[
        {
          id: 'eligibility',
          label: 'Eligibility',
          status: 'completed',
          metric: <Metric>12/12 Students</Metric>,
          actions: <CompletedText>All Eligible</CompletedText>,
        },
        {
          id: 'slots',
          label: 'Slots',
          status: 'completed',
          metric: <Metric>08/08 Students</Metric>,
          secondaryMetric: <Metric>02 Instructors</Metric>,
          actions: <CompletedText>All Slots Filled</CompletedText>,
        },
        {
          id: 'confirmation',
          label: 'Confirmation',
          status: 'in_progress',
          metric: <WarnMetric>05/08 Students</WarnMetric>,
          actions: (
            <ActionLink icon={<UserGroupIcon className={iconSm} />}>Confirm Students</ActionLink>
          ),
        },
        {
          id: 'compliance',
          label: 'Compliance',
          status: 'pending',
          metric: <Metric>00/08 Members</Metric>,
          badge: <WorkflowBadge label="School Requirements Pending" tone="warning" />,
          helperText: 'Awaiting confirmation step',
        },
      ]}
    />
  ),
};

/** Single-section variant — edge case, still renders correctly. */
export const SingleSection: Story = {
  name: 'Single Section',
  render: () => (
    <ProgressWorkflowCard
      sections={[
        {
          id: 'compliance',
          label: 'Compliance',
          status: 'in_progress',
          metric: <Metric>06/12 Members</Metric>,
          badge: <WorkflowBadge label="School Requirements Pending" tone="warning" />,
          actions: (
            <ActionLink icon={<BellAlertIcon className={iconSm} />}>Remind Onboarding</ActionLink>
          ),
        },
      ]}
    />
  ),
};

/** Neutral badge tone — informational, no action required. */
export const NeutralBadge: Story = {
  name: 'Neutral Badge Tone',
  render: () => (
    <ProgressWorkflowCard
      sections={[
        {
          id: 'slots',
          label: 'Slots',
          status: 'in_progress',
          metric: <WarnMetric>03/08 Students</WarnMetric>,
          badge: <WorkflowBadge label="Optional Rotation" tone="neutral" />,
          actions: (
            <ActionLink icon={<CalendarDaysIcon className={iconSm} />}>
              Schedule Students
            </ActionLink>
          ),
        },
        {
          id: 'confirmation',
          label: 'Confirmation',
          status: 'pending',
          metric: <Metric>00/08 Students</Metric>,
          helperText: 'Awaiting slot fill',
        },
        {
          id: 'compliance',
          label: 'Compliance',
          status: 'pending',
          metric: <Metric>00/08 Members</Metric>,
          badge: <WorkflowBadge label="Requirements Waived" tone="neutral" />,
        },
      ]}
    />
  ),
};

/** Footer slot — shown with an extra info row below actions. */
export const WithFooter: Story = {
  name: 'With Footer Slot',
  render: () => (
    <ProgressWorkflowCard
      sections={[
        {
          id: 'slots',
          label: 'Slots',
          status: 'completed',
          metric: <Metric>08/08 Students</Metric>,
          actions: <CompletedText>All Slots Filled</CompletedText>,
          footer: (
            <span className="flex items-center gap-1">
              <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" />
              Verified by coordinator on May 20, 2026
            </span>
          ),
        },
        {
          id: 'confirmation',
          label: 'Confirmation',
          status: 'completed',
          metric: <Metric>08/08 Students</Metric>,
          actions: <CompletedText>All Confirmed</CompletedText>,
          footer: <span>Last reminder sent 2 days ago</span>,
        },
        {
          id: 'compliance',
          label: 'Compliance',
          status: 'in_progress',
          metric: <Metric>06/08 Members</Metric>,
          badge: <WorkflowBadge label="School Requirements Pending" tone="warning" />,
          actions: (
            <ActionLink icon={<BellAlertIcon className={iconSm} />}>Remind Onboarding</ActionLink>
          ),
          footer: <span>2 members missing documents</span>,
        },
      ]}
    />
  ),
};
