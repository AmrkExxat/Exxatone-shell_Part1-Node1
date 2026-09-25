import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { NewFileUpload } from '../../libs/ui/components/common/Form/components';
import { ThemeDecorator } from '../ThemeDecorator';

/** Simulated upload function for stories */
const simulateUpload = (delayMs = 100): any => {
  return async (_file, onProgress) => {
    const totalSteps = 20;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      onProgress(Math.round((i / totalSteps) * 100));
    }
    return { success: true };
  };
};

/** Simulated failing upload function for stories */
const simulateFailingUpload = (): any => {
  return async (_file, onProgress) => {
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      onProgress(Math.round((i / totalSteps) * 100));
    }
    return { success: false, error: 'Simulated upload failure' };
  };
};

const meta = {
  title: 'Common/NewFileUpload',
  component: NewFileUpload,
  decorators: [
    ThemeDecorator,
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    dropzoneText: { control: 'text', description: 'Text shown in the drop zone area' },
    formatHint: { control: 'text', description: 'Hint text showing supported formats' },
    maxFileSizeMB: { control: 'number', description: 'Maximum file size in MB' },
    uploadingText: { control: 'text', description: 'Text shown while file is uploading' },
    uploadFailedText: { control: 'text', description: 'Text shown when upload fails' },
    replaceText: { control: 'text', description: 'Text for replace file button' },
    width: { control: 'text', description: 'Width of the drop zone container' },
  },
} satisfies Meta<typeof NewFileUpload>;

export default meta;

type Story = StoryObj<typeof NewFileUpload>;

/* ------------------ Default ------------------ */

export const Default: Story = {
  render: () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [clearBit, setClearBit] = useState(0);

    const handleFileChange: any = async (file: File, onProgress: (progress: number) => void) => {
      console.log('file', file);
      const result = await simulateUpload()(file, onProgress);
      if (result.success) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
      return result;
    };

    const handleChangeMenuItems = (item: any) => {
      console.log('item', item);
    };

    const handleDeleteFile = () => {
      setSelectedFile(null);
      setClearBit(clearBit + 1);
    };

    const handleFiles = (files: File | null) => {
      setSelectedFile(files);
    };

    return (
      <div>
        <div>
          <button onClick={handleDeleteFile}>Delete File</button>
          {!selectedFile && <button onClick={() => alert('upload file')}>Upload File</button>}
        </div>
        <NewFileUpload
          onUploadFile={handleFileChange}
          selectedFile={selectedFile}
          handleChangeMenuItems={handleChangeMenuItems}
          clearBit={clearBit}
          handleFiles={handleFiles}
        />
      </div>
    );
  },
};

export const DefaultFailure: Story = {
  render: () => {
    return (
      <NewFileUpload
        onUploadFile={async (file, onProgress) => {
          console.log('file', file);
          const result = await simulateFailingUpload()(file, onProgress);
          console.log('result', result);
          return result;
        }}
      />
    );
  },
};
