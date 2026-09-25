import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  CheckboxCard,
  CheckIcon,
  type BadgePosition,
  type BadgeSize,
} from '../../libs/ui/radixUi/CheckboxWrapper';
import { ThemeDecorator } from '../ThemeDecorator';

/* -------------------------------- Helper Components -------------------------------- */

/**
 * Wrapper component for interactive checkbox stories
 * Manages internal checked state
 */
const CheckboxCardWrapper: React.FC<{
  children: (checked: boolean, onCheckedChange: (checked: boolean) => void) => React.ReactNode;
  defaultChecked?: boolean;
}> = ({ children, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return <>{children(checked, setChecked)}</>;
};

/**
 * Multi-select wrapper for managing multiple checkbox states
 */
const MultiSelectWrapper: React.FC<{
  items: Array<{ id: number; [key: string]: unknown }>;
  defaultSelected?: number[];
  children: (
    selectedIds: Set<number>,
    handleSelect: (id: number) => (checked: boolean) => void
  ) => React.ReactNode;
}> = ({ items, defaultSelected = [], children }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(defaultSelected));

  const handleSelect = (id: number) => (checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  return <>{children(selectedIds, handleSelect)}</>;
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
        data-testid="checkbox-badge-unchecked"
        className={` ${badgeSizeClasses[size]} bg-card flex items-center justify-center rounded-full border-2 border-gray-300 font-bold text-gray-700 ${animationClass} `}
      >
        {value}
      </div>
    ),
    renderChecked: () => (
      <div
        data-testid="checkbox-badge-checked"
        className={` ${badgeSizeClasses[size]} flex items-center justify-center rounded-full bg-green-500 ${animationClass} `}
      >
        <CheckIcon className={`${badgeIconSizeClasses[size]} text-white`} strokeWidth={3} />
      </div>
    ),
  };
};

/* -------------------------------- Meta -------------------------------- */

const meta = {
  title: 'Radix UI/CheckboxWrapper',
  component: CheckboxCard,
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
          'A flexible checkbox card component built with Radix UI primitives.',
          '',
          '**Features:**',
          '- Full accessibility with screen reader support',
          '- Two customization methods: custom content or render functions',
          '- 9 positioning options for badge placement',
          '- Smooth animations with Tailwind transitions',
          '- Click exclusion for interactive elements (use `data-no-checkbox` attribute)',
          '- Multiple size variants (sm, md, lg, xl)',
          '',
          '**Usage:**',
          '```tsx',
          '<CheckboxCard checked={isChecked} onCheckedChange={setIsChecked}>',
          '  <CheckboxCard.Root id="my-checkbox" />',
          '  <CheckboxCard.Badge',
          '    position="top-center"',
          '    renderUnchecked={() => <span>1</span>}',
          '    renderChecked={() => <CheckIcon className="w-5 h-5 text-white" strokeWidth={3} />}',
          '  />',
          '  <CheckboxCard.Trigger>',
          '    <CheckboxCard.Content>Your content here</CheckboxCard.Content>',
          '  </CheckboxCard.Trigger>',
          '</CheckboxCard>',
          '```',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback when checkbox state changes',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the card',
    },
    testId: {
      control: 'text',
      description: 'Test ID for testing',
    },
  },
} satisfies Meta<typeof CheckboxCard>;

export default meta;

type Story = StoryObj<typeof CheckboxCard>;

/* -------------------------------- Stories -------------------------------- */

/**
 * Default document card that matches the original design.
 * Number badge transforms into checkmark when selected.
 */
export const Default: Story = {
  render: () => (
    <CheckboxCardWrapper defaultChecked={false}>
      {(checked, onCheckedChange) => (
        <CheckboxCard
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={`w-[200px] rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
            checked
              ? 'border-green-500 bg-green-50/50 shadow-green-100'
              : 'bg-card border-gray-200 hover:border-gray-300'
          } `}
        >
          <CheckboxCard.Root id="default-doc" />
          <CheckboxCard.Badge
            position="top-center"
            size="md"
            animate
            {...renderDefaultBadge(1, 'md')}
          />
          <CheckboxCard.Trigger>
            <CheckboxCard.Content className="pt-10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 inline-block rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                    PDF
                  </div>
                  <h3 className="mb-2 truncate text-base font-bold">WJ_Resume_1</h3>
                  <p className="text-sm text-gray-500">Last used yesterday</p>
                </div>
                <button
                  data-no-checkbox
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
            </CheckboxCard.Content>
          </CheckboxCard.Trigger>
        </CheckboxCard>
      )}
    </CheckboxCardWrapper>
  ),
};

/**
 * Document cards example matching the original design.
 * Shows multiple document cards with PDF/DOCX type badges.
 */
export const DocumentCards: Story = {
  render: () => {
    const documents = [
      { id: 1, name: 'WJ_Resume_1', type: 'pdf', lastUsed: 'yesterday' },
      { id: 2, name: 'WJ_Resume_2', type: 'pdf', lastUsed: 'Nov 28' },
      { id: 3, name: 'WJ_Resume_3', type: 'docx', lastUsed: 'Oct 10' },
    ];

    return (
      <MultiSelectWrapper items={documents} defaultSelected={[1]}>
        {(selectedIds, handleSelect) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {documents.map((doc, index) => (
              <CheckboxCard
                key={doc.id}
                checked={selectedIds.has(doc.id)}
                onCheckedChange={handleSelect(doc.id)}
                className={`rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                  selectedIds.has(doc.id)
                    ? 'border-green-500 bg-green-50/50 shadow-green-100'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <CheckboxCard.Root id={`doc-${doc.id}`} />
                <CheckboxCard.Badge
                  position="top-center"
                  size="md"
                  animate
                  {...renderDefaultBadge(index + 1, 'md')}
                />
                <CheckboxCard.Trigger>
                  <CheckboxCard.Content className="pt-10">
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
                        data-no-checkbox
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
                  </CheckboxCard.Content>
                </CheckboxCard.Trigger>
              </CheckboxCard>
            ))}
          </div>
        )}
      </MultiSelectWrapper>
    );
  },
};

/**
 * Profile cards with custom content elements.
 * Avatar transforms to checkmark when selected.
 */
export const ProfileCards: Story = {
  render: () => {
    const profiles = [
      { id: 1, name: 'John Doe', role: 'Designer', avatar: '👨‍💼' },
      { id: 2, name: 'Jane Smith', role: 'Developer', avatar: '👩‍💻' },
      { id: 3, name: 'Bob Wilson', role: 'Manager', avatar: '👨‍💼' },
    ];

    return (
      <MultiSelectWrapper items={profiles} defaultSelected={[]}>
        {(selectedIds, handleSelect) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {profiles.map((profile) => (
              <CheckboxCard
                key={profile.id}
                checked={selectedIds.has(profile.id)}
                onCheckedChange={handleSelect(profile.id)}
                className={`rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                  selectedIds.has(profile.id)
                    ? 'border-blue-500 bg-blue-50/50 shadow-blue-100'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <CheckboxCard.Trigger>
                  <CheckboxCard.Root id={`profile-${profile.id}`} />

                  <CheckboxCard.Badge
                    position="top-left"
                    size="lg"
                    animate
                    uncheckedContent={
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl shadow-md">
                        {profile.avatar}
                      </div>
                    }
                    checkedContent={
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-md">
                        <CheckIcon className="h-7 w-7 text-white" strokeWidth={3} />
                      </div>
                    }
                  />
                  <CheckboxCard.Content className="pt-16">
                    <h3 className="mb-1 text-xl font-bold">{profile.name}</h3>
                    <p className="mb-4 text-sm text-gray-600">{profile.role}</p>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">Active</span>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">Verified</span>
                    </div>
                  </CheckboxCard.Content>
                </CheckboxCard.Trigger>
              </CheckboxCard>
            ))}
          </div>
        )}
      </MultiSelectWrapper>
    );
  },
};

/**
 * Pricing cards using render functions for maximum customization.
 */
export const PricingCards: Story = {
  render: () => {
    const plans = [
      { id: 1, title: 'Premium Plan', price: '$29/mo', color: 'purple' },
      { id: 2, title: 'Business Plan', price: '$99/mo', color: 'blue' },
      { id: 3, title: 'Enterprise', price: 'Custom', color: 'orange' },
    ];

    return (
      <MultiSelectWrapper items={plans} defaultSelected={[]}>
        {(selectedIds, handleSelect) => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <CheckboxCard
                key={plan.id}
                checked={selectedIds.has(plan.id)}
                onCheckedChange={handleSelect(plan.id)}
                className={`rounded-xl border-2 p-8 shadow-sm transition-all hover:shadow-md ${
                  selectedIds.has(plan.id)
                    ? 'border-green-500 bg-green-50/50'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <CheckboxCard.Root id={`plan-${plan.id}`} />
                <CheckboxCard.Badge
                  position="top-right"
                  size="lg"
                  animate
                  renderUnchecked={() => (
                    <div className="rounded-full border-2 border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                      Select
                    </div>
                  )}
                  renderChecked={() => (
                    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
                      <CheckIcon className="h-4 w-4" strokeWidth={3} />
                      Selected
                    </div>
                  )}
                />
                <CheckboxCard.Trigger>
                  <CheckboxCard.Content>
                    <h3 className="mb-2 text-2xl font-bold">{plan.title}</h3>
                    <p className="mb-4 text-3xl font-bold text-gray-900">{plan.price}</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Feature one</li>
                      <li>✓ Feature two</li>
                      <li>✓ Feature three</li>
                      <li>✓ Feature four</li>
                    </ul>
                  </CheckboxCard.Content>
                </CheckboxCard.Trigger>
              </CheckboxCard>
            ))}
          </div>
        )}
      </MultiSelectWrapper>
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
      <div className="grid grid-cols-3 gap-4">
        {positions.map((position) => (
          <CheckboxCardWrapper key={position}>
            {(checked, onCheckedChange) => (
              <CheckboxCard
                checked={checked}
                onCheckedChange={onCheckedChange}
                className={`h-32 rounded-xl border-2 p-6 transition-all ${
                  checked
                    ? 'border-green-500 bg-green-50'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <CheckboxCard.Root id={`position-${position}`} />
                <CheckboxCard.Badge
                  position={position}
                  size="sm"
                  animate
                  {...renderDefaultBadge('•', 'sm')}
                />
                <CheckboxCard.Trigger>
                  <CheckboxCard.Content className="flex h-full items-center justify-center">
                    <span className="text-xs text-gray-500">{position}</span>
                  </CheckboxCard.Content>
                </CheckboxCard.Trigger>
              </CheckboxCard>
            )}
          </CheckboxCardWrapper>
        ))}
      </div>
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
      <div className="flex items-start gap-4">
        {sizes.map((size) => (
          <CheckboxCardWrapper key={size}>
            {(checked, onCheckedChange) => (
              <CheckboxCard
                checked={checked}
                onCheckedChange={onCheckedChange}
                className={`w-32 rounded-xl border-2 p-6 transition-all ${
                  checked
                    ? 'border-green-500 bg-green-50'
                    : 'bg-card border-gray-200 hover:border-gray-300'
                } `}
              >
                <CheckboxCard.Root id={`size-${size}`} />
                <CheckboxCard.Badge
                  position="top-center"
                  size={size}
                  animate
                  {...renderDefaultBadge(1, size)}
                />
                <CheckboxCard.Trigger>
                  <CheckboxCard.Content className="pt-12 text-center">
                    <span className="text-sm font-medium text-gray-700">{size.toUpperCase()}</span>
                  </CheckboxCard.Content>
                </CheckboxCard.Trigger>
              </CheckboxCard>
            )}
          </CheckboxCardWrapper>
        ))}
      </div>
    );
  },
};

/**
 * Demonstrates animation disabled state.
 */
export const WithoutAnimation: Story = {
  render: () => (
    <CheckboxCardWrapper>
      {(checked, onCheckedChange) => (
        <CheckboxCard
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={`w-48 rounded-xl border-2 p-6 transition-all ${
            checked
              ? 'border-green-500 bg-green-50'
              : 'bg-card border-gray-200 hover:border-gray-300'
          } `}
        >
          <CheckboxCard.Root id="no-animation" />
          <CheckboxCard.Badge
            position="top-center"
            size="md"
            animate={false}
            {...renderDefaultBadge(1, 'md', false)}
          />
          <CheckboxCard.Trigger>
            <CheckboxCard.Content className="pt-10 text-center">
              <span className="text-sm text-gray-500">No animation</span>
            </CheckboxCard.Content>
          </CheckboxCard.Trigger>
        </CheckboxCard>
      )}
    </CheckboxCardWrapper>
  ),
};

/**
 * Demonstrates the kebab menu remaining clickable independently.
 */
export const InteractiveElements: Story = {
  render: () => (
    <CheckboxCardWrapper>
      {(checked, onCheckedChange) => (
        <CheckboxCard
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={`w-64 rounded-xl border-2 p-6 transition-all ${
            checked
              ? 'border-green-500 bg-green-50'
              : 'bg-card border-gray-200 hover:border-gray-300'
          } `}
        >
          <CheckboxCard.Root id="interactive-demo" />
          <CheckboxCard.Badge
            position="top-center"
            size="md"
            animate
            {...renderDefaultBadge(1, 'md')}
          />
          <CheckboxCard.Trigger>
            <CheckboxCard.Content className="pt-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-1 text-base font-bold">Document</h3>
                  <p className="text-sm text-gray-500">Click card to select</p>
                </div>
                <button
                  data-no-checkbox
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
                The kebab menu uses <code>data-no-checkbox</code> attribute
              </p>
            </CheckboxCard.Content>
          </CheckboxCard.Trigger>
        </CheckboxCard>
      )}
    </CheckboxCardWrapper>
  ),
};
