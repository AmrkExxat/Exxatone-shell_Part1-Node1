import { Meta, StoryObj } from '@storybook/nextjs';
import React, { useRef, useState } from 'react';
import { Radio, RadioGroup } from '../../../libs/ui';

const meta: Meta<typeof RadioGroup> = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

// Default Radio Group with state management
export const Default: StoryObj<typeof RadioGroup> = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string>('nike');

    return (
      <RadioGroup
        title="Clothing Brands"
        required
        defaultValue={selectedValue}
        onChange={(value) => setSelectedValue(value)}
      >
        <Radio id="nike" label="Nike" name="brand" value="nike" />
        <Radio id="adidas" label="Adidas" name="brand" value="adidas" />
        <Radio id="puma" label="Puma" name="brand" value="puma" />
      </RadioGroup>
    );
  },
};

// Disabled state demonstration
export const DisabledStates: StoryObj<typeof RadioGroup> = {
  render: () => (
    <div className="space-y-6">
      <RadioGroup title="Disabled Group" disabled defaultValue="car">
        <Radio id="car" label="Car" name="vehicle" value="car" />
        <Radio id="bike" label="Bike" name="vehicle" value="bike" />
        <Radio id="truck" label="Truck" name="vehicle" value="truck" />
      </RadioGroup>

      <RadioGroup title="Individual Disabled Options" defaultValue="option1">
        <Radio id="option1" label="Enabled Option" name="mixed" value="option1" />
        <Radio id="option2" label="Disabled Option" name="mixed" value="option2" disabled />
        <Radio id="option3" label="Enabled Option" name="mixed" value="option3" />
      </RadioGroup>
    </div>
  ),
};

// Error state demonstration
export const WithErrors: StoryObj<typeof RadioGroup> = {
  render: () => (
    <RadioGroup title="Payment Method" required error="Please select a payment method">
      <Radio id="credit" label="Credit Card" name="payment" value="credit" />
      <Radio id="debit" label="Debit Card" name="payment" value="debit" />
      <Radio id="paypal" label="PayPal" name="payment" value="paypal" />
    </RadioGroup>
  ),
};

// Orientation variants
export const Orientations: StoryObj<typeof RadioGroup> = {
  render: () => (
    <div className="space-y-6">
      <RadioGroup title="Horizontal Layout" orientation="horizontal" defaultValue="option1">
        <Radio id="hoption1" label="Option 1" name="horizontal" value="option1" />
        <Radio id="hoption2" label="Option 2" name="horizontal" value="option2" />
        <Radio id="hoption3" label="Option 3" name="horizontal" value="option3" />
      </RadioGroup>

      <RadioGroup title="Vertical Layout (Default)" orientation="vertical" defaultValue="choice1">
        <Radio id="voption1" label="Choice 1" name="vertical" value="choice1" />
        <Radio id="voption2" label="Choice 2" name="vertical" value="choice2" />
        <Radio id="voption3" label="Choice 3" name="vertical" value="choice3" />
      </RadioGroup>
    </div>
  ),
};

export const InteractiveExample: StoryObj<typeof RadioGroup> = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>();
    const [hasError, setHasError] = useState(false);
    const [clearTrigger, setClearTrigger] = useState(0);

    const handleChange = (value: string | undefined) => {
      setSelectedValue(value);
      setHasError(false);
    };

    const handleClear = () => {
      setSelectedValue(undefined);
      setClearTrigger((prev) => prev + 1);
    };

    return (
      <div className="space-y-4">
        <RadioGroup
          title="Subscription Plan"
          required
          value={selectedValue}
          onChange={handleChange}
          clearTrigger={clearTrigger}
          error={hasError ? 'Please select a subscription plan' : undefined}
        >
          <Radio id="basic" label="Basic Plan" name="subscription" value="basic" helpText="basic" />
          <Radio id="pro" label="Pro Plan" name="subscription" value="pro" />
          <Radio
            id="enterprise"
            label="Enterprise Plan"
            name="subscription"
            value="enterprise"
            helpText="enterprise"
            errorText="enterprise"
            flexDir="column"
            disabled
          />
        </RadioGroup>

        <button
          onClick={() => setHasError(!selectedValue)}
          className="hover:bg-primary-dark bg-primary rounded px-4 py-2 text-white"
        >
          Submit
        </button>
        {/* <button onClick={handleClear}>Clear Selection</button> */}
      </div>
    );
  },
};
