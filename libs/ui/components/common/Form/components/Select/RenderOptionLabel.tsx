import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

export default function renderOptionLabel(
  option: any,
  selected: boolean,
  isChip?: boolean,
  multiple?: boolean,
  noTruncate?: boolean,
  isFilter?: boolean
): JSX.Element {
  const optionLabelRef = useRef<HTMLDivElement>(null);

  const [elBounding, setElBounding] = useState<DOMRect>();

  const [isTruncate, setIsTruncate] = useState<boolean>(false);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setElBounding(optionLabelRef?.current?.getBoundingClientRect());
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  useEffect(() => {
    if (optionLabelRef !== undefined && optionLabelRef !== null) {
      const containerWidth = optionLabelRef?.current?.offsetWidth;
      const truncatedElWidth = (
        optionLabelRef?.current?.querySelector('.truncate-content') as HTMLElement
      )?.offsetWidth;

      if (containerWidth !== undefined && truncatedElWidth > containerWidth) {
        setIsTruncate(true);
      } else {
        setIsTruncate(false);
      }
    }
  }, [optionLabelRef]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={optionLabelRef}
      className={classNames(
        isFilter ? 'filter-text-sm' : 'text-sm',
        selected && !multiple ? 'text-primary font-semibold' : '',
        isChip ? 'py-1' : '',
        noTruncate ? '' : 'truncate'
      )}
    >
      <style>
        {`
            .option-border {
                border: 1px solid var(--my-color) !important
            }
          `}
      </style>
      {isChip ? (
        <span
          className="option-border rounded-md px-2 py-1 text-[.8rem]"
          style={{
            backgroundColor: option.bgColor,
            color: option.textColor,
            ['--my-color']: option.borderColor,
          }}
        >
          {option.label}
        </span>
      ) : (
        <>
          <span className={noTruncate ? '' : 'truncate-content truncate'}>{option.label}</span>
          <br />
          <span className={'text-xs text-gray-700'}>
            {option?.subLabel ? option?.subLabel : ''}
          </span>
        </>
      )}
      <div className="flex flex-col">
        {showTooltip && isTruncate && elBounding && (
          <div
            className="uiTooltip"
            style={{
              top: elBounding?.top + 25,
              left: elBounding?.left,
            }}
          >
            <div className="text-default w-full p-2 break-all whitespace-normal">
              {option.label}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
