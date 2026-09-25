import { type Meta, type StoryObj } from '@storybook/nextjs';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextArea } from '../../../libs/ui';
import { ThemeDecorator } from '../../ThemeDecorator';

const meta: Meta<typeof TextArea> = {
  title: 'Form/TextArea',
  parameters: {
    layout: 'fullScreen',
  },
  component: TextArea,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const TextAreaDisabled: Story = {
  args: {
    name: 'secondary address',
    label: 'Alternate address',
    disabled: true,
    helpText: 'Please put a secondary address',
  },
};

export const TextAreaWithValidation: Story = {
  render: () => {
    const {
      register,
      formState: { errors },
      handleSubmit,
    } = useForm();
    return (
      <div className="flex flex-col">
        <form onSubmit={handleSubmit(() => {})}>
          <div className="mt-2 flex flex-col gap-2">
            <TextArea
              name="address"
              id="address"
              label="Home Address"
              helpText="Enter full address"
              registerReturn={register('address', {
                required: 'Please enter a valid address',
                minLength: {
                  message: 'Address should be atleast 50 characters long',
                  value: 50,
                },
              })}
              errors={errors}
            />
            <div className="flex flex-row items-center justify-start">
              <Button id="textarea-submit-btn" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  },
};
