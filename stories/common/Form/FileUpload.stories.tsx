import React, { useState } from 'react';
import { Meta, Story } from '@storybook/nextjs';
import { FileUpload, FileUploadProps } from '../../../libs/ui';
import { ThemeDecorator } from '../../ThemeDecorator';

export default {
  title: 'Form/FileUpload',
  component: FileUpload,
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the file upload component',
    },
    hideLabel: {
      control: 'boolean',
      description: 'Hides the label for the file upload',
    },
    handleFileChange: {
      action: 'fileChange',
      description: 'Handles file changes when files are selected or dropped',
    },
    selectedFiles: {
      control: 'array',
      description: 'The list of selected files',
    },
  },
  parameters: {
    layout: 'fullScreen',
  },
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
} as Meta;

const Template: Story<FileUploadProps> = (args) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  return (
    <div>
      <FileUpload {...args} selectedFiles={selectedFiles} handleFileChange={handleFileChange} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  hideLabel: false,
  selectedFiles: [],
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  hideLabel: false,
  selectedFiles: [],
};
