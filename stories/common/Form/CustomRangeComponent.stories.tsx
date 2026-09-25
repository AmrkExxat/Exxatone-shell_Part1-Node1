import type { Meta, StoryObj } from '@storybook/react';
import { CustomRangeComponent } from '../../../libs/ui/components/common';

const meta: Meta<typeof CustomRangeComponent> = {
  title: 'Components/CustomRangeComponent',
  component: CustomRangeComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomRangeComponent>;

// Inside container
export const Default: Story = {
  render: () => (
    <div>
      <CustomRangeComponent
        label="Select Range"
        defaultMin={null}
        defaultMax={null}
        onChange={(val) => console.log(val)}
      />
    </div>
  ),
};
