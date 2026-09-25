import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import CancelModalAssignment, {
  CancelBannerAssignment,
  CancelBannerGrid,
} from '../../libs/ui/components/features/Assignments/CancelModalAssignment';

const MOCK_OPTIONS = [
  { label: 'Student request', value: 'student_request' },
  { label: 'Site unavailable', value: 'site_unavailable' },
  { label: 'Schedule conflict', value: 'schedule_conflict' },
];

const meta = {
  title: 'Shared UI/CancelModalAssignment',
  decorators: [ThemeDecorator],
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<any>;

export const IndividualScheduleOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const cancelOptionsRef = useRef<any>({});
    return (
      <CancelModalAssignment
        openModal={open}
        setOpenModal={setOpen}
        group={false}
        cancelOptionsRef={cancelOptionsRef}
        getSchoolCancelReason={async () => MOCK_OPTIONS}
        getAssignmentsAction={async () => ({ data: [] })}
        onConfirm={(reason) => console.log('Confirmed:', reason)}
        tenantId="tenant-001"
        type="site"
      />
    );
  },
};

export const GroupScheduleOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const cancelOptionsRef = useRef<any>({});
    return (
      <CancelModalAssignment
        openModal={open}
        setOpenModal={setOpen}
        group={true}
        completeGroup={false}
        groupData={{ id: 'group-001', name: 'Cardiology Rotation' }}
        cancelOptionsRef={cancelOptionsRef}
        getSchoolCancelReason={async () => MOCK_OPTIONS}
        getAssignmentsAction={async () => ({ data: [{}, {}, {}] })}
        onConfirm={(reason) => console.log('Confirmed:', reason)}
        tenantId="tenant-001"
        type="site"
      />
    );
  },
};

export const CompleteGroupScheduleOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const cancelOptionsRef = useRef<any>({});
    return (
      <CancelModalAssignment
        openModal={open}
        setOpenModal={setOpen}
        group={true}
        completeGroup={true}
        groupData={{ id: 'group-001', name: 'Cardiology Rotation' }}
        cancelOptionsRef={cancelOptionsRef}
        getSchoolCancelReason={async () => MOCK_OPTIONS}
        getAssignmentsAction={async () => ({ data: [] })}
        onConfirm={(reason) => console.log('Confirmed:', reason)}
        tenantId="tenant-001"
        type="site"
      />
    );
  },
};

export const BannerAssignment: Story = {
  render: () => (
    <CancelBannerAssignment
      reason="Student request"
      date="2024-01-15T10:30:00Z"
      by="Site"
      email="site@hospital.com"
      note="Student had a scheduling conflict"
    />
  ),
};

export const BannerGrid: Story = {
  render: () => (
    <CancelBannerGrid
      id="assign-001"
      reason="Site unavailable"
      date="2024-01-15T10:30:00Z"
      email="site@hospital.com"
      status="Cancelled"
    >
      <span id="banner-grid-child">Assignment Name</span>
    </CancelBannerGrid>
  ),
};

export const BannerGridRevoked: Story = {
  render: () => (
    <CancelBannerGrid
      id="assign-002"
      reason="Program requirement change"
      date="2024-02-01T14:00:00Z"
      email="school@university.edu"
      status="Revoked"
    >
      <span id="banner-grid-revoked-child">Assignment Name</span>
    </CancelBannerGrid>
  ),
};
