import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Status } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/Status',
  component: Status,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'full-width',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Status>;

export default meta;

type Story = StoryObj<typeof Status>;

export const InternshipStatus: Story = {
  render: () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Status label="draft" id="render_status_draft" type="internship" />
        <Status label="completed" id="render_status_completed" type="internship" />
        <Status label="in-progress" id="render_status_in_progress" type="internship" />
        <Status label="rejected" id="render_status_rejected" type="internship" />
        <Status label="cancelled" id="render_status_cancelled" type="internship" />
        <Status label="active" id="render_status_active" type="internship" />
        <Status label="inactive" id="render_status_inactive" type="internship" />
        <Status label="closed" id="render_status_closed" type="internship" />
        <Status label="revoked" id="render_status_revoked" type="internship" />
        <Status label="approved" id="render_status_approved" type="internship" />
        <Status label="non-compliant" id="render_status_non_compliant" type="internship" />
        <Status label="compliant" id="render_status_compliant" type="internship" />
        <Status label="get-started" id="render_status_get_started" type="internship" />
        <Status label="not-started" id="render_status_not_started" type="internship" />
        <Status label="in-process" id="render_status_in_process" type="internship" />
        <Status label="deleted" id="render_status_deleted" type="internship" />
      </div>
    );
  },
};

export const RequestStatus: Story = {
  render: () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Status label="draft" id="render_status_draft" type="request" />
        <Status label="approved" id="render_status_approved" type="request" />
        <Status label="in-progress" id="render_status_in_progress" type="request" />
        <Status label="declined" id="render_status_declined" type="request" />
        <Status label="rejected" id="render_status_rejected" type="request" />
        <Status label="revoked" id="render_status_revoked" type="request" />
        <Status label="in-process" id="render_status_in_process" type="request" />
        <Status label="cancelled" id="render_status_cancelled" type="request" />
      </div>
    );
  },
};
export const ScheduleStatus: Story = {
  render: () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-start gap-4">
          <Status label="new" id="render_status_new" type="schedule" />
          <Status label="update" id="render_status_update" type="schedule" />
          <Status label="pending" id="render_status_in_pending" type="schedule" />
          <Status label="get-started" id="render_status_get_started" type="schedule" />
          <Status label="expired" id="render_status_expired" type="schedule" />
          <Status label="pending-review" id="render_status_pending_review" type="schedule" />
          <Status
            label="review-in-progress"
            id="render_status_review_in_progress"
            type="schedule"
          />
          <Status label="approved" id="render_status_approved" type="schedule" />
          <Status label="uploaded" id="render_status_uploaded" type="schedule" />
          <Status label="in-progress" id="render_status_in_progress" type="schedule" />
          <Status label="draft" id="render_status_draft" type="schedule" />
          <Status label="uploading" id="render_status_uploading" type="schedule" />
          <Status label="compliant" id="render_status_compliant" type="schedule" />
          <Status
            label="compliance-pending"
            id="render_status_compliance_pending"
            type="schedule"
          />
          <Status label="non-compliant" id="render_status_non_compliant" type="schedule" />
          <Status label="failed-upload" id="render_status_failed_upload" type="schedule" />
          <Status label="ongoing" id="render_status_ongoing" type="schedule" />
          <Status label="completed" id="render_status_completed" type="schedule" />
          <Status label="cancelled" id="render_status_cancelled" type="schedule" />
        </div>
        <div className="flex flex-col items-center justify-start gap-4">
          <Status label="new" id="render_status_new" type="schedule" showDot />
          <Status label="update" id="render_status_update" type="schedule" showDot />
          <Status label="pending" id="render_status_in_pending" type="schedule" showDot />
          <Status label="get-started" id="render_status_get_started" type="schedule" showDot />
          <Status label="expired" id="render_status_expired" type="schedule" showDot />
          <Status
            label="pending-review"
            id="render_status_pending_review"
            type="schedule"
            showDot
          />
          <Status
            label="review-in-progress"
            id="render_status_review_in_progress"
            type="schedule"
            showDot
          />
          <Status label="approved" id="render_status_approved" type="schedule" showDot />
          <Status label="uploaded" id="render_status_uploaded" type="schedule" showDot />
          <Status label="in-progress" id="render_status_in_progress" type="schedule" showDot />
          <Status label="draft" id="render_status_draft" type="schedule" showDot />
          <Status label="uploading" id="render_status_uploading" type="schedule" showDot />
          <Status label="compliant" id="render_status_compliant" type="schedule" showDot />
          <Status
            label="compliance-pending"
            id="render_status_compliance_pending"
            type="schedule"
            showDot
          />
          <Status label="non-compliant" id="render_status_non_compliant" type="schedule" showDot />
          <Status label="failed-upload" id="render_status_failed_upload" type="schedule" showDot />
          <Status label="ongoing" id="render_status_ongoing" type="schedule" showDot />
          <Status label="completed" id="render_status_completed" type="schedule" showDot />
          <Status label="cancelled" id="render_status_cancelled" type="schedule" showDot />
        </div>
        <div className="flex flex-col items-center justify-start gap-4">
          <Status label="compliant" id="render_status_cancelled" type="schedule" showIcon />
          <Status label="failed-upload" id="render_status_cancelled" type="schedule" showIcon />
          <Status label="ongoing" id="render_status_cancelled" type="schedule" showIcon />
        </div>
      </div>
    );
  },
};
