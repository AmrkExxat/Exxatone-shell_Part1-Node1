import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { Checkbox } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Radix UI/Checkbox',
  component: Checkbox,
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
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

const PrismConsentStory = (): JSX.Element => {
  const [checked, setChecked] = useState(true);

  return (
    <div className="max-w-[720px] rounded-md border border-green-200 bg-green-50 px-4 py-3">
      <div className="flex items-start gap-3">
        <Checkbox
          id="prism-consent-checkbox"
          name="prism-consent"
          label=""
          testid="prism-consent-checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          aria-label="prism-consent-label"
          aria-describedby="prism-consent-help"
          className={`h-4 w-4 rounded-[4px] border border-black transition-colors ${
            checked ? 'bg-black text-black accent-black' : 'bg-card text-black accent-black'
          } focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none`}
        />
        <div className="text-sm leading-5 text-gray-900">
          <p id="prism-consent-label" className="font-medium">
            Use my Prism info to speed up account setup.
          </p>
          <p id="prism-consent-help" className="mt-1 text-xs text-gray-600">
            By continuing, you agree to our{' '}
            <a
              className="text-gray-700 underline decoration-gray-600 underline-offset-2 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
              href="#terms"
            >
              T&amp;C
            </a>{' '}
            and{' '}
            <a
              className="text-gray-700 underline decoration-gray-600 underline-offset-2 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
              href="#privacy"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export const PrismConsent: Story = {
  render: () => {
    return <PrismConsentStory />;
  },
};
