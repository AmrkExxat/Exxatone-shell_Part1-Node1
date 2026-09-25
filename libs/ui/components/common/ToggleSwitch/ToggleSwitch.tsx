import React, { useState, ReactNode, KeyboardEvent, useRef, useEffect } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';

interface ToggleSwitchProps extends SwitchProps {
  defaultChecked?: boolean;
  className?: string;
  testid?: string;
  ariaLabel?: string;
}

const ToggleSwitch = (props: ToggleSwitchProps): ReactNode => {
  const { disabled, defaultChecked, testid, ariaLabel, className, ...restProps } = props;
  const [isChecked, setIsChecked] = useState(defaultChecked || false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);
  const hadMouseDown = useRef(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      setIsChecked(!isChecked);
    }
    setIsFocusVisible(true);
  };

  const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
    if (!hadMouseDown.current) {
      setIsFocusVisible(true);
    }

    if (restProps.onFocus) {
      restProps.onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocusVisible(false);

    if (restProps.onBlur) {
      restProps.onBlur(event);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    hadMouseDown.current = true;
    setIsFocusVisible(false);

    if (restProps.onMouseDown) {
      restProps.onMouseDown(event);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimeout(() => {
      hadMouseDown.current = false;
    }, 0);

    if (restProps.onMouseUp) {
      restProps.onMouseUp(event);
    }
  };

  useEffect(() => {
    if (!switchRef.current) return;

    const switchElement = switchRef.current;
    const thumbElement = switchElement.querySelector('.MuiSwitch-thumb') as HTMLElement;

    if (!thumbElement) return;

    if (isFocusVisible) {
      thumbElement.style.outline = '2px solid rgba(63,81,181, 1)';
      thumbElement.style.outlineOffset = '5px';
    } else {
      thumbElement.style.outline = '';
      thumbElement.style.outlineOffset = '';
    }
  }, [isFocusVisible]);

  return (
    <Switch
      ref={switchRef}
      disabled={disabled}
      checked={isChecked}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      data-testid={testid}
      className={className}
      {...restProps}
      inputProps={{
        'aria-label': ariaLabel,
        testid: testid,
      }}
    />
  );
};

export default ToggleSwitch;
