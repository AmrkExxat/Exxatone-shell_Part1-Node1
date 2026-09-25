import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import ConsentPage from '../../libs/ui/components/common/Consent/Consent';

const meta = {
  title: 'Common/Consent',
  component: ConsentPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    setConsent: fn(),
    updateConsent: fn().mockResolvedValue({ success: true }),
    oneProfileId: 'user-123',
  },
} satisfies Meta<typeof ConsentPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomUrls: Story = {
  args: {
    privacyPolicyUrl: 'https://example.com/privacy',
    termsOfUseUrl: 'https://example.com/terms',
  },
};

export const AcceptFails: Story = {
  args: {
    updateConsent: fn().mockResolvedValue({ success: false }),
  },
};
