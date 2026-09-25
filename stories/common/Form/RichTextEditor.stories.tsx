import { type Meta, type StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { RichTextEditor } from '../../../libs/ui';
import { ThemeDecorator } from '../../ThemeDecorator';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Form/RichTextEditor',
  parameters: {
    layout: 'fullScreen',
  },
  component: RichTextEditor,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor value={value} onChange={setValue} placeholder="Enter text..." />
      </div>
    );
  },
};

export const WithInitialValue: Story = {
  render: () => {
    const [value, setValue] = useState('<p>This is some <strong>initial</strong> content.</p>');
    return (
      <div className="p-8">
        <RichTextEditor value={value} onChange={setValue} placeholder="Enter text..." />
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter your message here..."
        />
      </div>
    );
  },
};

export const WithMaxLength: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter text..."
          maxLength={300}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value] = useState(
      '<p>This editor is <strong>disabled</strong> and cannot be edited.</p>'
    );
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={() => {}}
          placeholder="Enter text..."
          disabled={true}
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Note: When disabled with initial value, the placeholder should not appear.
        </p>
      </div>
    );
  },
};

export const CustomStyling: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter text..."
          className="max-w-2xl rounded-lg border-2 border-blue-300 p-4"
          maxLength={500}
        />
      </div>
    );
  },
};

export const CustomToolbar: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter text..."
          toolbar={[['bold', 'italic'], [{ header: 1 }, { header: 2 }], ['link']]}
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Custom toolbar with only bold, italic, headers, and link options.
        </p>
      </div>
    );
  },
};

export const CustomModules: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter text..."
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
            ],
          }}
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Custom modules configuration with simplified toolbar.
        </p>
      </div>
    );
  },
};

export const CustomCharCountMessage: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter text..."
          maxLength={200}
          charCountMessage={(count, max) => `Remaining: ${max - count} characters`}
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Custom character count message showing remaining characters.
        </p>
      </div>
    );
  },
};

export const CustomCharCountMessageString: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Enter text..."
          maxLength={150}
          charCountMessage="Characters used: {count} / {max}"
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Note: String message will display as-is (no interpolation).
        </p>
      </div>
    );
  },
};

export const StyleCustomizationDemo: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="p-8">
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Type here..."
          className="rounded-xl border-2 border-emerald-400 p-4 shadow-md [&_.ql-container]:rounded-b-xl [&_.ql-toolbar]:rounded-t-xl [&_.ql-toolbar]:border-emerald-300 [&_.ql-toolbar]:bg-emerald-100 dark:[&_.ql-toolbar]:border-emerald-700 dark:[&_.ql-toolbar]:bg-emerald-900"
        />
      </div>
    );
  },
};
