import React, { useState, useRef, useEffect, KeyboardEvent, useId } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';

export interface SearchDropDownOption {
  id: string;
  label: string;
  value?: string;
}

interface SearchDropDownProps {
  options: SearchDropDownOption[];
  value: string;
  onChange: (option: SearchDropDownOption) => void;
  className?: string;
  placeholder?: string;
  testid?: string;
  disabled?: boolean;
  label?: string;
}

export const SearchDropDown: React.FC<SearchDropDownProps> = ({
  options,
  value,
  onChange,
  className = '',
  placeholder = 'Select',
  testid = 'search_dropdown',
  disabled = false,
  label = 'Search from',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const [isNavigatingOptions, setIsNavigatingOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.id === value);
  const uniqueId = useId();
  const listboxId = `custom-select-listbox-${uniqueId}`;
  const labelId = `custom-select-label-${uniqueId}`;
  const liveRegionId = `custom-select-live-${uniqueId}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        setHoveredIndex(-1);
        setIsNavigatingOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const highlightedElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });

        const option = options[highlightedIndex];
        const isSelected = option.id === value;
        const position = highlightedIndex + 1;
        const total = options.length;
        const selectionStatus = isSelected ? 'selected' : 'not selected';

        setAnnouncement(`${option.label} ${selectionStatus} ${position} of ${total}`);
      }
    }
  }, [isOpen, highlightedIndex, options, value]);

  useEffect(() => {
    if (selectedOption) {
      const state = isOpen ? 'expanded' : 'collapsed';
      setAnnouncement(`${label}: combo box ${selectedOption.label} ${state}`);
    }
  }, [selectedOption, isOpen, label]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
          setIsNavigatingOptions(true);
          e.preventDefault();
        } else if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex]);
          setIsOpen(false);
          setHighlightedIndex(-1);
          setHoveredIndex(-1);
          setIsNavigatingOptions(false);
          comboboxRef.current?.focus();
          e.preventDefault();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        setHoveredIndex(-1);
        setIsNavigatingOptions(false);
        comboboxRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
          setIsNavigatingOptions(true);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
          setIsNavigatingOptions(true);
        }
        setHoveredIndex(-1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(options.length - 1);
          setIsNavigatingOptions(true);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          setIsNavigatingOptions(true);
        }
        setHoveredIndex(-1);
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setHighlightedIndex(-1);
          setHoveredIndex(-1);
          setIsNavigatingOptions(false);
        }
        break;
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      if (!isOpen) {
        setIsOpen(true);
        const currentIndex = options.findIndex((option) => option.id === value);
        const indexToHighlight = currentIndex >= 0 ? currentIndex : 0;
        setHighlightedIndex(indexToHighlight);
        setIsNavigatingOptions(false);
      } else {
        setIsOpen(false);
        setHighlightedIndex(-1);
        setHoveredIndex(-1);
        setIsNavigatingOptions(false);
      }
    }
  };

  const handleOptionClick = (option: SearchDropDownOption) => {
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    setHoveredIndex(-1);
    setIsNavigatingOptions(false);
    comboboxRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative w-[100px] ${className}`} data-testid={testid}>
      <div
        ref={comboboxRef}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-describedby={liveRegionId}
        aria-activedescendant={
          highlightedIndex >= 0 ? `option-${options[highlightedIndex]?.id}` : undefined
        }
        tabIndex={disabled ? -1 : 0}
        className={`relative flex min-h-6 w-full cursor-pointer items-center justify-between border-none bg-transparent p-0 text-sm text-gray-900 ${
          !isNavigatingOptions
            ? 'focus-visible:outline-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
            : ''
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsNavigatingOptions(false);
        }}
        aria-disabled={disabled}
      >
        <div className="ml-2 flex-grow truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </div>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          aria-labelledby={labelId}
          aria-multiselectable="false"
          className="focus-visible:outline-primary-500 bg-card absolute z-[1000] mt-1 max-h-60 w-[150px] overflow-y-auto rounded-md border border-gray-200 shadow-lg focus-visible:outline focus-visible:outline-2"
          tabIndex={-1}
        >
          {options.map((option, index) => {
            const isSelected = option.id === value;
            const isKeyboardHighlighted = isNavigatingOptions && highlightedIndex === index;
            const isHovered = hoveredIndex === index;

            return (
              <li
                key={option.id}
                id={`option-${option.id}`}
                role="option"
                aria-selected={isSelected}
                className={`cursor-pointer px-2 py-2 text-sm transition-colors duration-150 ${
                  isKeyboardHighlighted
                    ? 'outline-primary-500 bg-blue-50 outline outline-2 outline-offset-[-2px]'
                    : isHovered
                      ? 'bg-gray-100'
                      : ''
                } ${isSelected ? 'text-primary-500 bg-gray-100 font-semibold' : ''}`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  if (isNavigatingOptions) {
                    setIsNavigatingOptions(false);
                    setHighlightedIndex(-1);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(-1);
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchDropDown;
