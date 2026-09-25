import React, { useState } from 'react';
import { ToggleGroupButtonProps } from './types';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const ToggleGroupButton = ({
  id,
  options,
  initialSelected,
  onChange,
  disabled = false,
  size = 'medium',
  customStyles = {},
  ...props
}: ToggleGroupButtonProps) => {
  const [selected, setSelected] = useState<string | number | null>(initialSelected);

  const defaultStyles = {
    selectedBg: 'blue',
    selectedColor: 'white',
    defaultBg: '',
    defaultColor: '',
    hoverBg: 'lightgray',
    hoverColor: '',
    borderRadius: '4px',
  };

  const styles = { ...defaultStyles, ...customStyles };

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string | number | null) => {
    if (!disabled && !!newValue) {
      setSelected(newValue);
      onChange(event, newValue);
    }
  };

  return (
    <ToggleButtonGroup
      id={id}
      value={selected}
      exclusive={true}
      onChange={handleChange}
      disabled={disabled}
      size={size}
      {...props}
      aria-label="custom toggle button group"
      sx={{
        opacity: disabled ? 0.6 : 1, // Apply opacity when disabled
      }}
      role="list"
    >
      {options.map((option, index) => (
        <ToggleButton
          id={option.id}
          className={`${selected === option.value ? '' : 'text-default bg-card'}`}
          key={option.value}
          value={option.value}
          disabled={option?.disabled}
          sx={{
            backgroundColor:
              selected === option.value
                ? `${styles.selectedBg} !important`
                : `${styles.defaultBg} !important`,
            color:
              selected === option.value
                ? `${styles.selectedColor} !important`
                : `${styles.defaultColor} !important`,
            '&:hover': {
              backgroundColor: selected !== option.value ? `${styles.hoverBg} !important` : '',
              color: selected === option.value ? `${styles.hoverColor} !important` : '',
            },
            borderRadius:
              index === 0
                ? `${styles.borderRadius} 0 0 ${styles.borderRadius}`
                : index === options.length - 1
                  ? `0 ${styles.borderRadius} ${styles.borderRadius} 0`
                  : '0',
            opacity: option?.disabled ? 0.6 : 1,
          }}
          aria-label={option.label}
          aria-pressed={undefined}
          role="listitem"
          tabIndex={-1}
        >
          <div
            className="focus-outline-primary"
            tabIndex={0}
            aria-current={selected === option.value ? 'page' : undefined}
          >
            {option.label}
          </div>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleGroupButton;
