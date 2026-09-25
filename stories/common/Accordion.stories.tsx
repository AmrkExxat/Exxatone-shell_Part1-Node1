import { Meta, StoryObj } from '@storybook/nextjs';
import React, { useState } from 'react';
import { ThemeDecorator } from '../ThemeDecorator';
import { Accordion } from '../../libs/ui';

const meta = {
  title: 'Common/Accordion',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

export const SimpleAccordion: Story = {
  render: () => {
    const onTogggle = (event: any) => {
      console.log(event);
    };
    return (
      <Accordion
        id="accordion_example"
        testid="accordion_example"
        header={
          <div className="accordion-header-title">
            <span> This is a Title</span>
          </div>
        }
        onTogggle={onTogggle}
      >
        <div>This is the intended content to be added into the requirement</div>
      </Accordion>
    );
  },
};

export const AccordionWithActionHeader: Story = {
  render: () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const handleCheckbox = (e) => {
      if (e.key === 'Enter') {
        handleCheckboxChange();
      }
    };

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked);
    };

    return (
      <Accordion
        id="accordion_example"
        testid="accordion_example"
        header={
          <div className="accordion-header-title flex flex-row items-center justify-start gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              onKeyDown={handleCheckbox}
              className="rounded-md"
            />
            Accordion with Action Header
          </div>
        }
      >
        <div>This is the intended content to be added into the requirement</div>
      </Accordion>
    );
  },
};
