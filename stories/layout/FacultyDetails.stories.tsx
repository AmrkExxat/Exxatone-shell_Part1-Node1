import React, { useState } from 'react';
import { Meta, Story } from '@storybook/nextjs';
import { ThemeDecorator } from '../ThemeDecorator';
import { FacultyDetails, FacultyDetailsComponentProps } from '../../libs/ui';

export default {
  title: 'Layout/FacultyDetails',
  component: FacultyDetails,
  decorators: [ThemeDecorator],
  tags: ['autodocs'],
} as Meta;

export const Template: Story<FacultyDetailsComponentProps> = (args: any) => {
  return (
    <div>
      <FacultyDetails faculties={args.faculties} universities={args.universities} />
    </div>
  );
};
