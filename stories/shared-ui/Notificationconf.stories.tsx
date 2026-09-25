/* eslint-disable react/display-name */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { faGraduationCap, faMessages, faSync, faUserTag } from '@fortawesome/pro-light-svg-icons';
import { NotificationConfig, NotificationConfigurationObject } from '../../libs/ui';

const meta = {
  title: 'Shared UI/NotificationConfig',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const Notificationconf: Story = {
  render: () => {
    const dummyConfig: NotificationConfigurationObject[] = [
      {
        icon: faMessages,
        heading: 'Message Notification',
        disabled: false,
        emailDisabled: false,
        isChild: false,
        children: [
          {
            notificationKey: 'Chat1',
            heading: 'Message from schools',
            email: false,
            inApp: false,

            emailDisabled: true,
            disabled: true,
            isChild: true,
          },
          {
            notificationKey: 'Chat2',
            heading: 'Message from students',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'Chat3',
            heading: 'Message from clinical instructor',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
        ],
      },
      {
        icon: faUserTag,
        heading: 'Slot requests',
        disabled: false,
        emailDisabled: false,
        isChild: false,
        children: [
          {
            notificationKey: 'CREATE/Slot-Request',
            heading: 'School requested slots',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'UPDATE/Slot-Request',
            heading: 'Slot request updated by school',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'REVOKE/Slot-Request',
            heading: 'Slot request revoked by school',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
        ],
      },
      {
        icon: faGraduationCap,
        heading: 'Schedules',
        disabled: false,
        emailDisabled: false,
        isChild: false,
        children: [
          {
            notificationKey: 'schedules1',
            heading: 'Student schedule is confirmed',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'schedules2',
            heading: 'School cancels the schedules',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'schedules3',
            heading: 'School replaces the student after confirmation',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'schedules4',
            heading: 'Student removed by school after confirmation',
            email: false,
            inApp: true,

            emailDisabled: false,

            isChild: true,
          },
        ],
      },
      {
        icon: faSync,
        heading: 'Onboarding',
        disabled: true,
        emailDisabled: true,
        isChild: false,
        children: [
          {
            notificationKey: 'onboarding1',
            heading: 'Student submits all the requirements',
            email: false,
            inApp: false,

            emailDisabled: false,

            isChild: true,
          },
          {
            notificationKey: 'onboarding2',
            heading: 'Clinical Instructor Onboarded',
            email: true,
            inApp: false,

            emailDisabled: false,

            isChild: true,
          },
        ],
      },
    ];

    const onNotificationChange = (e) => {
      console.log(e);
    };

    return (
      <>
        <div className="bg-card p-4">
          <NotificationConfig
            defaultConfig={dummyConfig}
            onChange={onNotificationChange}
            emailRequired={true}
          />
        </div>
      </>
    );
  },
};
