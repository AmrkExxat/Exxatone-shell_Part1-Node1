import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import {
  Button,
  OnboardingContainer,
  Status,
  type FetchCAASStatusResult,
  type FetchDueDatesResult,
  type FetchRequirementsResult,
  type FormContentSlotProps,
  type FormHeaderActionsSlotProps,
  type RequirementGroup,
  type RequirementItem,
} from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

function toScheduleStatusLabel(label: string): string {
  const lower = (label ?? '').trim().toLowerCase();
  if (lower === 'getstarted') return 'get-started';
  if (lower === 'notapproved') return 'not-approved';
  if (lower === 'expiring') return 'pending';
  if (lower === 'pendingreview' || lower === 'pending review') return 'pending-review';
  if (lower === 'reviewinprogress') return 'review-in-progress';
  if (lower === 'inprogress') return 'in-progress';
  return lower || 'new';
}

const mockRequirements = (): FetchRequirementsResult => {
  const mkReq = (
    partial: Partial<RequirementItem> & Pick<RequirementItem, 'requirementId' | 'name'>
  ): RequirementItem => ({
    requirementId: partial.requirementId,
    name: partial.name,
    required: partial.required ?? false,
    descriptions: partial.descriptions ?? [],
    response: partial.response ?? {},
    tags: partial.tags ?? { activity: 'caas' },
  });

  const groups: RequirementGroup[] = [
    {
      requirementGroupId: 'student',
      userType: 'Student',
      caasReq: [
        mkReq({
          requirementId: 'req-1',
          name: 'Confidentiality Agreement Attestation',
          required: true,
          descriptions: ['This is a sample requirement description.'],
          response: { responseId: 'resp-1', status: 'PendingReview' },
        }),
        mkReq({
          requirementId: 'req-2',
          name: 'HIPAA Training Certificate',
          required: true,
          descriptions: ['Upload your training certificate.'],
          response: { responseId: 'resp-2', status: 'Approved' },
        }),
        mkReq({
          requirementId: 'req-3',
          name: 'Immunization Record',
          required: false,
          descriptions: ['Optional, if already on file.'],
          response: { responseId: 'resp-3', status: 'GetStarted' },
        }),
      ],
    },
  ];

  return { groups, count: groups.flatMap((g) => g.caasReq ?? []).length };
};

const mockCaasStatus = (): FetchCAASStatusResult => ({
  map: {
    'resp-1': { workflowStatus: 'PendingReview' },
    'resp-2': { workflowStatus: 'approved' },
    'resp-3': { workflowStatus: 'getstarted' },
  },
});

const mockDueDates = (): FetchDueDatesResult => ({
  config: { demoSite: 10 },
});

const FormContent = ({ requirement, storeApi }: FormContentSlotProps) => (
  <div className="p-6">
    <div className="text-sm font-semibold text-gray-900">{requirement.name}</div>
    {requirement.descriptions?.[0] && (
      <div className="mt-1 text-xs text-gray-600">{requirement.descriptions[0]}</div>
    )}

    <div className="mt-4 flex flex-wrap gap-2">
      <Button variant="stroked" size="sm" onClick={() => storeApi.triggerRefresh()}>
        Refresh
      </Button>
      <Button variant="stroked" size="sm" onClick={() => storeApi.triggerRefreshAndRestore()}>
        Refresh + restore
      </Button>
      <Button variant="stroked" size="sm" onClick={() => storeApi.triggerAddNewRecord()}>
        Add new record workflow
      </Button>
    </div>
  </div>
);

const FormHeaderActions = ({ requirement, storeApi, section }: FormHeaderActionsSlotProps) => {
  const status = toScheduleStatusLabel(requirement?.response?.status ?? '');

  if (section === 'statusRow') {
    return (
      <Status
        type="requirement"
        id={`storybook-form-status-${requirement?.requirementId ?? 'unknown'}`}
        label={status}
      />
    );
  }

  return (
    <>
      <div className="flex min-w-[250px] flex-1 flex-row flex-wrap items-start justify-end gap-2">
        <Button
          variant="stroked"
          size="sm"
          onClick={() => storeApi.getState().toggleFormExpanded()}
        >
          Toggle expand
        </Button>
      </div>
      <div className="flex flex-none items-start justify-end">
        <Button variant="basic" size="sm" onClick={() => storeApi.getState().toggleFormExpanded()}>
          Expand
        </Button>
      </div>
    </>
  );
};

const meta = {
  title: 'Shared UI/Onboarding/OnboardingContainer',
  component: OnboardingContainer,
  decorators: [ThemeDecorator],
  parameters: { layout: 'full-width' },
  tags: ['autodocs'],
} satisfies Meta<typeof OnboardingContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[calc(100vh-200px)] w-full">
      <OnboardingContainer
        context={{ siteId: 'demoSite', assignmentId: 'demoAssignment' }}
        defaultTab="caas"
        onFetchRequirements={async () => mockRequirements()}
        onFetchCAASStatus={async () => mockCaasStatus()}
        onFetchDueDates={async () => mockDueDates()}
        topBarActionsSlot={
          <div className="flex items-center gap-2 pr-2">
            <Button variant="basic" size="sm">
              Top action
            </Button>
          </div>
        }
        formContentSlot={FormContent}
        formHeaderActionsSlot={FormHeaderActions}
      />
    </div>
  ),
};

export const WithPersonSelector: Story = {
  render: () => (
    <div className="h-[calc(100vh-200px)] w-full">
      <OnboardingContainer
        context={{ siteId: 'demoSite', assignmentId: 'demoAssignment', groupId: 'demoGroup' }}
        defaultTab="caas"
        onFetchRequirements={async () => mockRequirements()}
        onFetchCAASStatus={async () => mockCaasStatus()}
        onFetchDueDates={async () => mockDueDates()}
        personSelectorHeaderSlot={<div className="px-3 text-sm font-semibold">People</div>}
        personSelectorSlot={
          <div className="flex flex-col gap-2 p-3 text-sm">
            <button type="button" className="bg-card rounded px-2 py-1 text-left hover:bg-gray-100">
              Student A
            </button>
            <button type="button" className="bg-card rounded px-2 py-1 text-left hover:bg-gray-100">
              Student B
            </button>
          </div>
        }
        formContentSlot={FormContent}
        formHeaderActionsSlot={FormHeaderActions}
      />
    </div>
  ),
};
