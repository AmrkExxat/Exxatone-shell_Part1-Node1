import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  RadioCardGroup,
  RadioCard,
  RadioIcon,
  type BadgePosition,
  type BadgeSize,
} from '../../libs/ui/radixUi/RadioButtonWrapper';
import { ThemeDecorator } from '../ThemeDecorator';

/* -------------------------------- Helper Components -------------------------------- */

/**
 * Wrapper component for interactive radio stories
 * Manages internal selected value state
 */
const RadioCardGroupWrapper: React.FC<{
  children: (value: string, onValueChange: (value: string) => void) => React.ReactNode;
  defaultValue?: string;
}> = ({ children, defaultValue = '' }) => {
  const [value, setValue] = useState(defaultValue);
  return <>{children(value, setValue)}</>;
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
};

const badgeIconSizeClasses: Record<BadgeSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const renderDefaultBadge = (
  value: React.ReactNode,
  size: BadgeSize,
  animate = true
): { renderUnchecked: () => React.ReactNode; renderChecked: () => React.ReactNode } => {
  const animationClass = animate ? 'transition-all duration-300 ease-in-out' : '';

  return {
    renderUnchecked: () => (
      <div
        data-testid="radio-badge-unchecked"
        className={` ${badgeSizeClasses[size]} bg-card flex items-center justify-center rounded-full border-2 border-gray-300 font-bold text-gray-700 ${animationClass} `}
      >
        {value}
      </div>
    ),
    renderChecked: () => (
      <div
        data-testid="radio-badge-checked"
        className={` ${badgeSizeClasses[size]} flex items-center justify-center rounded-full bg-blue-500 ${animationClass} `}
      >
        <RadioIcon className={`${badgeIconSizeClasses[size]} text-white`} strokeWidth={3} />
      </div>
    ),
  };
};

/* -------------------------------- Meta -------------------------------- */

const meta = {
  title: 'Radix UI/RadioButtonWrapper',
  component: RadioCardGroup,
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
          'A flexible radio card component built with Radix UI primitives.',
          '',
          '**Features:**',
          '- Full accessibility with screen reader support',
          '- Two customization methods: custom content or render functions',
          '- 9 positioning options for badge placement',
          '- Smooth animations with Tailwind transitions',
          '- Click exclusion for interactive elements (use `data-no-radio` attribute)',
          '- Multiple size variants (sm, md, lg, xl)',
          '- Single selection within a group',
          '',
          '**Usage:**',
          '```tsx',
          '<RadioCardGroup value={selectedValue} onValueChange={setSelectedValue}>',
          '  <RadioCard value="option1">',
          '    <RadioCard.Item id="option1" />',
          '    <RadioCard.Badge position="top-center" />',
          '    <RadioCard.Trigger>',
          '      <RadioCard.Content>Option 1</RadioCard.Content>',
          '    </RadioCard.Trigger>',
          '  </RadioCard>',
          '  <RadioCard value="option2">',
          '    <RadioCard.Item id="option2" />',
          '    <RadioCard.Badge position="top-center" />',
          '    <RadioCard.Trigger>',
          '      <RadioCard.Content>Option 2</RadioCard.Content>',
          '    </RadioCard.Trigger>',
          '  </RadioCard>',
          '</RadioCardGroup>',
          '```',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback when radio selection changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the group',
    },
    name: {
      control: 'text',
      description: 'Name attribute for the radio group',
    },
    testId: {
      control: 'text',
      description: 'Test ID for testing',
    },
  },
} satisfies Meta<typeof RadioCardGroup>;

export default meta;

type Story = StoryObj<typeof RadioCardGroup>;

/* -------------------------------- Stories -------------------------------- */

/**
 * Default document card that matches the original design.
 * Number badge transforms into radio icon when selected.
 */
export const Default: Story = {
  render: () => (
    <RadioCardGroupWrapper defaultValue="">
      {(value, onValueChange) => (
        <RadioCardGroup value={value} onValueChange={onValueChange} className="flex gap-4">
          {[1, 2, 3].map((num) => (
            <RadioCard
              key={num}
              value={`doc-${num}`}
              className={`w-[200px] rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                value === `doc-${num}`
                  ? 'border-blue-500 bg-blue-50/50 shadow-blue-100'
                  : 'bg-card border-gray-200 hover:border-gray-300'
              } `}
            >
              <RadioCard.Item id={`doc-${num}`} value={`doc-${num}`} />
              <RadioCard.Badge
                position="top-center"
                size="md"
                animate
                {...renderDefaultBadge(num, 'md')}
              />
              <RadioCard.Trigger>
                <RadioCard.Content className="pt-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 inline-block rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                        PDF
                      </div>
                      <h3 className="mb-2 truncate text-base font-bold">WJ_Resume_{num}</h3>
                      <p className="text-sm text-gray-500">Last used yesterday</p>
                    </div>
                    <button
                      data-no-radio
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Menu clicked');
                      }}
                      className="flex-shrink-0 rounded p-1 transition-colors hover:bg-gray-200"
                      aria-label="More options"
                    >
                      <span className="text-xl leading-none font-bold text-gray-600">⋮</span>
                    </button>
                  </div>
                </RadioCard.Content>
              </RadioCard.Trigger>
            </RadioCard>
          ))}
        </RadioCardGroup>
      )}
    </RadioCardGroupWrapper>
  ),
};

/**
 * Document cards example matching the original design.
 * Shows multiple document cards with PDF/DOCX type badges.
 */
export const DocumentCards: Story = {
  render: () => {
    const documents = [
      { id: '1', name: 'WJ_Resume_1', type: 'pdf', lastUsed: 'yesterday' },
      { id: '2', name: 'WJ_Resume_2', type: 'pdf', lastUsed: 'Nov 28' },
      { id: '3', name: 'WJ_Resume_3', type: 'docx', lastUsed: 'Oct 10' },
    ];

    return (
      <RadioCardGroupWrapper defaultValue="1">
        {(value, onValueChange) => (
          <RadioCardGroup value={value} onValueChange={onValueChange} className="flex gap-4">
            {documents.map((doc, index) => (
              <RadioCard
                key={doc.id}
                value={doc.id}
                className={`rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                  value === doc.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-blue-100'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <RadioCard.Item id={`doc-${doc.id}`} value={doc.id} />
                <RadioCard.Badge
                  position="top-center"
                  size="md"
                  animate
                  {...renderDefaultBadge(index + 1, 'md')}
                />
                <RadioCard.Trigger>
                  <RadioCard.Content className="pt-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div
                          className={`mb-3 inline-block rounded px-2 py-1 text-xs font-semibold ${doc.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} `}
                        >
                          {doc.type.toUpperCase()}
                        </div>
                        <h3 className="mb-2 truncate text-base font-bold">{doc.name}</h3>
                        <p className="text-sm text-gray-500">Last used {doc.lastUsed}</p>
                      </div>
                      <button
                        data-no-radio
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Menu for ${doc.name}`);
                        }}
                        className="flex-shrink-0 rounded p-1 transition-colors hover:bg-gray-200"
                        aria-label="More options"
                      >
                        <span className="text-xl leading-none font-bold text-gray-600">⋮</span>
                      </button>
                    </div>
                  </RadioCard.Content>
                </RadioCard.Trigger>
              </RadioCard>
            ))}
          </RadioCardGroup>
        )}
      </RadioCardGroupWrapper>
    );
  },
};

/**
 * Profile cards with custom content elements.
 * Avatar transforms to radio icon when selected.
 */
export const ProfileCards: Story = {
  render: () => {
    const profiles = [
      { id: '1', name: 'John Doe', role: 'Designer', avatar: '👨‍💼' },
      { id: '2', name: 'Jane Smith', role: 'Developer', avatar: '👩‍💻' },
      { id: '3', name: 'Bob Wilson', role: 'Manager', avatar: '👨‍💼' },
    ];

    return (
      <RadioCardGroupWrapper defaultValue="">
        {(value, onValueChange) => (
          <RadioCardGroup value={value} onValueChange={onValueChange} className="flex gap-4">
            {profiles.map((profile) => (
              <RadioCard
                key={profile.id}
                value={profile.id}
                className={`rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                  value === profile.id
                    ? 'border-blue-500 bg-blue-50/50 shadow-blue-100'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <RadioCard.Item id={`profile-${profile.id}`} value={profile.id} />
                <RadioCard.Badge
                  position="top-left"
                  size="lg"
                  animate
                  uncheckedContent={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl shadow-md">
                      {profile.avatar}
                    </div>
                  }
                  checkedContent={
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
                      <RadioIcon className="h-7 w-7 text-white" strokeWidth={3} />
                    </div>
                  }
                />
                <RadioCard.Trigger>
                  <RadioCard.Content className="pt-16">
                    <h3 className="mb-1 text-xl font-bold">{profile.name}</h3>
                    <p className="mb-4 text-sm text-gray-600">{profile.role}</p>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">Active</span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">Verified</span>
                    </div>
                  </RadioCard.Content>
                </RadioCard.Trigger>
              </RadioCard>
            ))}
          </RadioCardGroup>
        )}
      </RadioCardGroupWrapper>
    );
  },
};

/**
 * Pricing cards using render functions for maximum customization.
 */
export const PricingCards: Story = {
  render: () => {
    const plans = [
      { id: 'premium', title: 'Premium Plan', price: '$29/mo', color: 'purple' },
      { id: 'business', title: 'Business Plan', price: '$99/mo', color: 'blue' },
      { id: 'enterprise', title: 'Enterprise', price: 'Custom', color: 'orange' },
    ];

    return (
      <RadioCardGroupWrapper defaultValue="">
        {(value, onValueChange) => (
          <RadioCardGroup value={value} onValueChange={onValueChange} className="flex gap-4">
            {plans.map((plan) => (
              <RadioCard
                key={plan.id}
                value={plan.id}
                className={`rounded-xl border-2 p-8 shadow-sm transition-all hover:shadow-md ${
                  value === plan.id
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <RadioCard.Item id={`plan-${plan.id}`} value={plan.id} />
                <RadioCard.Badge
                  position="top-right"
                  size="lg"
                  animate
                  renderUnchecked={() => (
                    <div className="rounded-full border-2 border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                      Select
                    </div>
                  )}
                  renderChecked={() => (
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
                      <RadioIcon className="h-4 w-4" strokeWidth={3} />
                      Selected
                    </div>
                  )}
                />
                <RadioCard.Trigger>
                  <RadioCard.Content>
                    <h3 className="mb-2 text-2xl font-bold">{plan.title}</h3>
                    <p className="mb-4 text-3xl font-bold text-gray-900">{plan.price}</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Feature one</li>
                      <li>✓ Feature two</li>
                      <li>✓ Feature three</li>
                      <li>✓ Feature four</li>
                    </ul>
                  </RadioCard.Content>
                </RadioCard.Trigger>
              </RadioCard>
            ))}
          </RadioCardGroup>
        )}
      </RadioCardGroupWrapper>
    );
  },
};

/**
 * Demonstrates all available badge positions.
 */
export const BadgePositions: Story = {
  render: () => {
    const positions: BadgePosition[] = [
      'top-left',
      'top-center',
      'top-right',
      'left-center',
      'center',
      'right-center',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];

    return (
      <RadioCardGroupWrapper defaultValue="">
        {(value, onValueChange) => (
          <RadioCardGroup
            value={value}
            onValueChange={onValueChange}
            className="grid grid-cols-3 gap-4"
          >
            {positions.map((position) => (
              <RadioCard
                key={position}
                value={position}
                className={`h-32 rounded-xl border-2 p-6 transition-all ${
                  value === position
                    ? 'border-blue-500 bg-blue-50'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <RadioCard.Item id={`position-${position}`} value={position} />
                <RadioCard.Badge
                  position={position}
                  size="sm"
                  animate
                  {...renderDefaultBadge('•', 'sm')}
                />
                <RadioCard.Trigger>
                  <RadioCard.Content className="flex h-full items-center justify-center">
                    <span className="text-xs text-gray-500">{position}</span>
                  </RadioCard.Content>
                </RadioCard.Trigger>
              </RadioCard>
            ))}
          </RadioCardGroup>
        )}
      </RadioCardGroupWrapper>
    );
  },
};

/**
 * Demonstrates all available badge sizes.
 */
export const BadgeSizes: Story = {
  render: () => {
    const sizes: BadgeSize[] = ['sm', 'md', 'lg', 'xl'];

    return (
      <RadioCardGroupWrapper defaultValue="">
        {(value, onValueChange) => (
          <RadioCardGroup
            value={value}
            onValueChange={onValueChange}
            className="flex items-start gap-4"
          >
            {sizes.map((size) => (
              <RadioCard
                key={size}
                value={size}
                className={`w-32 rounded-xl border-2 p-6 transition-all ${
                  value === size
                    ? 'border-blue-500 bg-blue-50'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <RadioCard.Item id={`size-${size}`} value={size} />
                <RadioCard.Badge
                  position="top-center"
                  size={size}
                  animate
                  {...renderDefaultBadge(1, size)}
                />
                <RadioCard.Trigger>
                  <RadioCard.Content className="pt-12 text-center">
                    <span className="text-sm font-medium text-gray-700">{size.toUpperCase()}</span>
                  </RadioCard.Content>
                </RadioCard.Trigger>
              </RadioCard>
            ))}
          </RadioCardGroup>
        )}
      </RadioCardGroupWrapper>
    );
  },
};

/**
 * Demonstrates animation disabled state.
 */
export const WithoutAnimation: Story = {
  render: () => (
    <RadioCardGroupWrapper defaultValue="">
      {(value, onValueChange) => (
        <RadioCardGroup value={value} onValueChange={onValueChange} className="flex gap-4">
          {['option1', 'option2'].map((option) => (
            <RadioCard
              key={option}
              value={option}
              className={`w-48 rounded-xl border-2 p-6 transition-all ${
                value === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-card border-gray-200 hover:border-gray-300'
              } `}
            >
              <RadioCard.Item id={option} value={option} />
              <RadioCard.Badge
                position="top-center"
                size="md"
                animate={false}
                {...renderDefaultBadge(1, 'md', false)}
              />
              <RadioCard.Trigger>
                <RadioCard.Content className="pt-10 text-center">
                  <span className="text-sm text-gray-500">No animation</span>
                </RadioCard.Content>
              </RadioCard.Trigger>
            </RadioCard>
          ))}
        </RadioCardGroup>
      )}
    </RadioCardGroupWrapper>
  ),
};

/**
 * Demonstrates the kebab menu remaining clickable independently.
 */
export const InteractiveElements: Story = {
  render: () => (
    <RadioCardGroupWrapper defaultValue="">
      {(value, onValueChange) => (
        <RadioCardGroup value={value} onValueChange={onValueChange} className="flex gap-4">
          {['card1', 'card2'].map((cardId) => (
            <RadioCard
              key={cardId}
              value={cardId}
              className={`w-64 rounded-xl border-2 p-6 transition-all ${
                value === cardId
                  ? 'border-blue-500 bg-blue-50'
                  : 'bg-card border-gray-200 hover:border-gray-300'
              } `}
            >
              <RadioCard.Item id={cardId} value={cardId} />
              <RadioCard.Badge
                position="top-center"
                size="md"
                animate
                {...renderDefaultBadge(1, 'md')}
              />
              <RadioCard.Trigger>
                <RadioCard.Content className="pt-10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="mb-1 text-base font-bold">Document</h3>
                      <p className="text-sm text-gray-500">Click card to select</p>
                    </div>
                    <button
                      data-no-radio
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Menu clicked! Card selection unchanged.');
                      }}
                      className="rounded p-2 transition-colors hover:bg-gray-200"
                      aria-label="More options"
                    >
                      <span className="text-xl leading-none font-bold text-gray-600">⋮</span>
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-gray-400">
                    The kebab menu uses <code>data-no-radio</code> attribute
                  </p>
                </RadioCard.Content>
              </RadioCard.Trigger>
            </RadioCard>
          ))}
        </RadioCardGroup>
      )}
    </RadioCardGroupWrapper>
  ),
};
