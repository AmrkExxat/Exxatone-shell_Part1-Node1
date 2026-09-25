import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import * as XLSX from 'xlsx';
import { FileViewer } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const SMALL_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const SMALL_JPG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

const mockFiles = [
  {
    id: 'file-001',
    fileName: 'sample-image.png',
    binaryData: SMALL_PNG,
    contentType: 'image/png',
    updatedTimestamp: '2024-01-15T10:30:00Z',
  },
];

const meta = {
  title: 'Common/FileViewer',
  component: FileViewer,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onClose: fn(),
    fetchFileData: fn(),
    downloadCloudFile: fn(),
    downloadTemporaryFile: fn(),
    onViewed: fn(),
  },
} satisfies Meta<typeof FileViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    previewFile: 'file-001',
    filesArray: mockFiles,
  },
};

export const MultipleFiles: Story = {
  args: {
    previewFile: 'file-001',
    filesArray: [
      ...mockFiles,
      {
        id: 'file-002',
        fileName: 'another-image.jpg',
        binaryData: SMALL_JPG,
        contentType: 'image/jpeg',
        updatedTimestamp: '2024-01-16T11:00:00Z',
      },
      {
        id: 'file-csv-large',
        fileName: 'large-data.csv',
        binaryData: generateLargeCsvDataUrl(),
        contentType: 'text/csv',
        updatedTimestamp: '2024-01-17T09:00:00Z',
      },
      {
        id: 'file-xlsx-large',
        fileName: 'large-data.xlsx',
        binaryData: generateLargeXlsxDataUrl(),
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        updatedTimestamp: '2024-01-18T09:00:00Z',
      },
    ],
  },
};

export const VideoSourceLink: Story = {
  args: {
    previewFile: true,
    filesArray: [],
    field: {
      fieldId: 'video-field',
      description: 'Introduction Video',
      sourceLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoControls: true,
    },
  },
};

export const Closed: Story = {
  args: {
    previewFile: false,
    filesArray: mockFiles,
  },
};

function generateLargeXlsxDataUrl(): string {
  const workbook = XLSX.utils.book_new();
  const data: string[][] = [['id', 'name', 'value']];
  for (let i = 1; i <= 1001; i++) {
    data.push([String(i), `Name ${i}`, `Value ${i}`]);
  }
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
}

function generateLargeCsvDataUrl(): string {
  const rows = ['id,name,value'];
  for (let i = 1; i <= 1001; i++) {
    rows.push(`${i},Name ${i},Value ${i}`);
  }
  return `data:text/csv;base64,${btoa(rows.join('\n'))}`;
}

export const LargeXlsxData: Story = {
  args: {
    previewFile: 'file-xlsx-large',
    filesArray: [
      {
        id: 'file-xlsx-large',
        fileName: 'large-data.xlsx',
        binaryData: generateLargeXlsxDataUrl(),
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        updatedTimestamp: '2024-01-15T10:30:00Z',
      },
    ],
  },
};

export const LargeCsvData: Story = {
  args: {
    previewFile: 'file-csv-large',
    filesArray: [
      {
        id: 'file-csv-large',
        fileName: 'large-data.csv',
        binaryData: generateLargeCsvDataUrl(),
        contentType: 'text/csv',
        updatedTimestamp: '2024-01-15T10:30:00Z',
      },
    ],
  },
};
