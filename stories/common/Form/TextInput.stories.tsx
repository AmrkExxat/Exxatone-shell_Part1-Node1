import { TextInput, Button } from '../../../libs/ui';
import { type Meta, type StoryObj } from '@storybook/nextjs';
import { useForm } from 'react-hook-form';
import React from 'react';
import { EnvelopeIcon, EyeIcon } from '@heroicons/react/24/solid';
import { ThemeDecorator } from '../../ThemeDecorator';

const meta: Meta<typeof TextInput> = {
  title: 'Form/TextInput',
  component: TextInput,
  parameters: {
    layout: 'fullScreen',
  },
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Basic Input
export const InputBasic: Story = {
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
          <TextInput
            id="basicInput"
            testid="basicInput"
            name="basicInput"
            label="Basic Input"
            type="text"
            registerReturn={register('basicInput')}
            errors={errors}
            placeholder="Enter text here..."
            infoMsg="This is a tooltip."
            required
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

// 2. Input with Validation (Required, Min/Max Length)
export const InputWithValidation: Story = {
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
        noValidate
      >
        <div className="flex flex-col gap-2">
          <TextInput
            id="validatedInput"
            testid="validatedInput"
            name="validatedInput"
            label="Validated Input"
            type="text"
            registerReturn={register('validatedInput', {
              required: 'This field is required',
              minLength: { value: 3, message: 'Minimum length is 3' },
              maxLength: { value: 10, message: 'Maximum length is 10' },
            })}
            errors={errors}
            placeholder="Enter text..."
            required
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

// 3. Input with Leading and Trailing Icons
export const InputWithIcons: Story = {
  render: () => (
    <div className="flex flex-col">
      <TextInput
        id="iconInput"
        testid="iconInput"
        name="iconInput"
        label="Input with Icons"
        type="text"
        placeholder="Enter text..."
        LeadingIcon={<EnvelopeIcon className="text-default h-5 w-5" aria-hidden="true" />}
        TrailingIcon={<EyeIcon className="text-default h-5 w-5" aria-hidden="true" />}
      />
    </div>
  ),
};

// 4. Input with Error Handling
export const InputWithError: Story = {
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
          <TextInput
            id="errorInput"
            testid="errorInput"
            name="errorInput"
            label="Input with Error"
            type="text"
            registerReturn={register('errorInput', {
              required: 'Please enter a value',
            })}
            errors={errors}
            placeholder="Error on Empty submission"
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

// 5. Input with Regex Validation
export const InputWithRegexValidation: Story = {
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
          <TextInput
            id="regexInput"
            testid="regexInput"
            name="regexInput"
            label="Regex Validated Input"
            type="text"
            registerReturn={register('regexInput', {
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Invalid email format',
              },
            })}
            errors={errors}
            placeholder="Enter a valid email"
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

// 6. Disabled Input
export const InputDisabled: Story = {
  render: () => (
    <div className="flex flex-col">
      <TextInput
        id="disabledInput"
        testid="disabledInput"
        name="disabledInput"
        label="Disabled Input"
        type="text"
        disabled
        placeholder="Disabled Input"
      />
    </div>
  ),
};

// 7. Input with Help Text
export const InputWithHelpText: Story = {
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
        <div className="flex flex-col">
          <TextInput
            id="helpTextInput"
            testid="helpTextInput"
            name="helpTextInput"
            label="Input with Help Text"
            type="text"
            registerReturn={register('helpTextInput')}
            errors={errors}
            helpText="Enter your username"
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
