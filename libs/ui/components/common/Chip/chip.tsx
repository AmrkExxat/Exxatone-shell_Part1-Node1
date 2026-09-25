import React from 'react';
import { ChipProps } from './chip.types';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CancelIcon from '@mui/icons-material/Cancel';

const Customchip = ({
  label,
  onDelete = () => console.error('You have not implemented an on Delete'),
  disabled,
  icon,
  avatar,
  variant = 'filled',
  color = 'default',
  className = '',
  ...props
}: ChipProps): JSX.Element => {
  const getColorClasses = (color: string, variant: string) => {
    switch (color) {
      case 'primary':
        return variant === 'filled'
          ? 'bg-blue-500 text-white dark:bg-blue-700 dark:text-white'
          : 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400';
      case 'secondary':
        return variant === 'filled'
          ? 'bg-gray-500 text-white dark:bg-gray-700 dark:text-white'
          : 'border-gray-500 text-gray-500 dark:border-gray-400 dark:text-gray-400';
      case 'error':
        return variant === 'filled'
          ? 'bg-red-500 text-white dark:bg-red-700 dark:text-white'
          : 'border-red-500 text-red-500 dark:border-red-400 dark:text-red-400';
      case 'info':
        return variant === 'filled'
          ? 'bg-cyan-500 text-white dark:bg-cyan-700 dark:text-white'
          : 'border-cyan-500 text-cyan-500 dark:border-cyan-400 dark:text-cyan-400';
      case 'success':
        return variant === 'filled'
          ? 'bg-green-500 text-white dark:bg-green-700 dark:text-white'
          : 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400';
      case 'warning':
        return variant === 'filled'
          ? 'bg-yellow-500 text-white dark:bg-yellow-700 dark:text-white'
          : 'border-yellow-500 text-yellow-500 dark:border-yellow-400 dark:text-yellow-400';
      default:
        return variant === 'filled'
          ? 'bg-gray-300 text-black dark:bg-gray-700 dark:text-white'
          : 'border-black text-black dark:border-white dark:text-white';
    }
  };

  return (
    <Chip
      label={label}
      onDelete={onDelete}
      disabled={disabled}
      icon={icon}
      {...props}
      avatar={
        avatar && (
          <Avatar
            className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
            style={{ fontSize: '0.75rem', width: '1.5rem', height: '1.5rem' }}
          >
            {avatar}
          </Avatar>
        )
      }
      deleteIcon={
        <CancelIcon
          focusable="true"
          tabIndex={0} // Make the icon focusable via keyboard
          aria-hidden="false"
          aria-label={`delete ${label}`}
          onClick={onDelete}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onDelete();
            }
          }}
          className={` ${disabled ? 'text-gray-400' : 'text-gray-400'} dark:${disabled ? 'text-gray-600' : 'text-white'} rounded-full focus-visible:ring-2 focus-visible:ring-gray-500 dark:focus-visible:ring-white`}
        />
      }
      variant={variant}
      className={` ${getColorClasses(color, variant)} rounded-full px-3 py-1 text-sm font-medium ${disabled && 'opacity-60'} ${variant === 'outlined' && 'border'} ${avatar && 'text-xs'} ${className} ${props['clickable'] && 'focus-outline-primary'} `}
      tabIndex={props['clickable'] ? 0 : -1}
    />
  );
};

export default Customchip;
