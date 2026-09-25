import { AdornedInput, Button } from '../../../libs/ui';
import { type Meta, type StoryObj } from '@storybook/nextjs';
import { useForm } from 'react-hook-form';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPen } from '@fortawesome/pro-light-svg-icons';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { ThemeDecorator } from '../../ThemeDecorator';

const meta: Meta<typeof AdornedInput> = {
  title: 'Form/AdornedInput',
  component: AdornedInput,
  parameters: {
    layout: 'fullScreen',
  },
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithStartIconAndDisabledButton: Story = {
  render: () => (
    <AdornedInput
      id="email-disabled-btn"
      testid="email-disabled-btn"
      name="email"
      label="Secondary Email"
      required
      placeholder="Enter your secondary email"
      startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      endAdornment={
        <Button
          testid="save-btn"
          variant="flat"
          size="xs"
          disabled
          className="h-6 min-w-[80px] rounded text-sm"
        >
          Save
        </Button>
      }
    />
  ),
};

export const WithStartIconAndActiveButton: Story = {
  render: () => {
    const {
      register,
      formState: { errors },
    } = useForm({ defaultValues: { email: 'william.j2004@gmail.com' } });

    return (
      <AdornedInput
        id="email-active-btn"
        testid="email-active-btn"
        name="email"
        label="Secondary Email"
        required
        registerReturn={register('email')}
        errors={errors}
        startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
        endAdornment={
          <Button
            testid="save-btn"
            variant="flat"
            color="primary"
            size="xs"
            className="h-6 min-w-[80px] rounded bg-neutral-800 text-sm text-white"
          >
            Save
          </Button>
        }
      />
    );
  },
};

export const WithVerifyBadge: Story = {
  render: () => (
    <AdornedInput
      id="email-verify"
      testid="email-verify"
      name="email"
      label="Secondary Email"
      required
      value="william.j2004@gmail.com"
      readOnly
      startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      endAdornment={
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-0.5 text-xs text-blue-500">
            <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
            Verify
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <button type="button" aria-label="Edit email">
            <FontAwesomeIcon icon={faPen} className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      }
    />
  ),
};

export const WithVerifiedBadge: Story = {
  render: () => (
    <AdornedInput
      id="email-verified"
      testid="email-verified"
      name="email"
      label="Secondary Email"
      required
      value="william.j2004@gmail.com"
      readOnly
      startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
      endAdornment={
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5 text-xs text-green-600">
            <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
            Verified
          </span>
          <div className="h-4 w-px bg-gray-300" />
          <button type="button" aria-label="Edit email">
            <FontAwesomeIcon icon={faPen} className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      }
    />
  ),
};

export const WithErrorState: Story = {
  render: () => {
    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm();

    return (
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <div className="flex flex-col gap-2">
          <AdornedInput
            id="email-error"
            testid="email-error"
            name="email"
            label="Secondary Email"
            required
            placeholder="Enter your secondary email"
            registerReturn={register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Invalid email format',
              },
            })}
            errors={errors}
            startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
            endAdornment={
              <Button testid="save-btn" variant="flat" size="xs" disabled>
                Save
              </Button>
            }
          />
          <div>
            <Button type="submit" testid="submit" color="primary" variant="flat">
              Submit
            </Button>
          </div>
        </div>
      </form>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <AdornedInput
      id="email-disabled"
      testid="email-disabled"
      name="email"
      label="Secondary Email"
      disabled
      placeholder="Disabled input"
      startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />}
      endAdornment={
        <Button testid="save-btn" variant="flat" size="xs" disabled>
          Save
        </Button>
      }
    />
  ),
};

export const WithHelpText: Story = {
  render: () => (
    <AdornedInput
      id="email-help"
      testid="email-help"
      name="email"
      label="Secondary Email"
      placeholder="Enter your secondary email"
      helpText="This email will be used for account recovery."
      startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    />
  ),
};

export const CustomClassNames: Story = {
  render: () => (
    <AdornedInput
      id="email-custom"
      testid="email-custom"
      name="email"
      label="Custom Styled"
      placeholder="Custom styles applied"
      className="max-w-md"
      containerClassName="border-2 border-blue-400 rounded-xl h-12 px-4"
      inputClassName="text-base placeholder:text-blue-300"
      startAdornmentClassName="text-blue-500"
      endAdornmentClassName="text-blue-600"
      startAdornment={<EnvelopeIcon className="h-5 w-5" aria-hidden="true" />}
      endAdornment={
        <Button testid="save-btn" variant="flat" size="xs" className="bg-blue-500 text-white">
          Save
        </Button>
      }
    />
  ),
};

export const StartAdornmentOnly: Story = {
  render: () => (
    <AdornedInput
      id="email-start-only"
      testid="email-start-only"
      name="email"
      label="Start Adornment Only"
      placeholder="Enter your email"
      startAdornment={<EnvelopeIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />}
    />
  ),
};

export const EndAdornmentOnly: Story = {
  render: () => (
    <AdornedInput
      id="email-end-only"
      testid="email-end-only"
      name="email"
      label="End Adornment Only"
      placeholder="Enter your email"
      endAdornment={
        <Button testid="save-btn" variant="flat" color="primary" size="xs">
          Save
        </Button>
      }
    />
  ),
};
