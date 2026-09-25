import Link from 'next/link';
import { map, slice } from 'lodash';
import classNames from 'classnames';
import React, { useRef, useState, useCallback } from 'react';
import { Tooltip } from '../Tooltip';
import ReactDOM from 'react-dom';

const ShowMore = ({
  type,
  rowData,
  selector,
  isHyperLink,
  routeSelector,
  routePath,
  showTooltip,
  maxLength,
  moreTextRequired = true,
  isBoundReq = true,
  labelMaxWidth = 'max-w-[125px]',
  entityLabel,
  moreLabelClass = 'p-1 hover:bg-hover',
  contentClass = '',
}: {
  type: 'list' | 'string';
  rowData: any;
  selector: string[];
  isHyperLink?: boolean;
  routeSelector?: string;
  routePath?: string;
  showTooltip?: boolean;
  maxLength?: number;
  moreTextRequired?: boolean;
  isBoundReq?: boolean;
  labelMaxWidth?: string;
  entityLabel?: string;
  moreLabelClass?: string;
  contentClass?: string;
}) => {
  let slicedGroups: any[] = [];

  if (maxLength === undefined || maxLength === null) {
    maxLength = 1;
  }

  if (type === 'list') {
    const listLength: number = rowData?.length as number;

    if (listLength >= 1) {
      slicedGroups = slice(rowData, maxLength, listLength);
    }
  }

  const anchorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [elBounding, setElBounding] = useState<DOMRect>();
  const [showUITooltip, setShowUITooltip] = useState(false);

  const handleMouseEnter = () => {
    setElBounding(anchorRef?.current?.getBoundingClientRect());
    setShowUITooltip(true);
  };

  const handleMouseLeave = () => {
    setShowUITooltip(false);
  };

  const closeTooltip = useCallback(() => {
    setShowUITooltip(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (event.key === 'Escape' && showUITooltip) {
        closeTooltip();
      }
    },
    [showUITooltip, closeTooltip]
  );

  const renderContent = (r: any, isTooltip: boolean) => {
    const formattedText = map(selector, (s, index) => {
      const value = r[s] || '';
      return value + (index < selector.length - 1 ? ' ' : '');
    }).join('');
    const content = () => {
      return isHyperLink ? (
        <Link
          href={`${routePath}/${r[routeSelector as string]}`}
          key={r.id}
          className="link-text truncate"
          tabIndex={0}
        >
          <span className="truncate-content text-primary">{formattedText}</span>
        </Link>
      ) : (
        <div className="truncate">
          <span key={r.id} className="truncate-content">
            {formattedText}
          </span>
        </div>
      );
    };

    const triggerEl = () => {
      return <div className="truncate">{content()}</div>;
    };

    const tooltip = () => {
      return (
        <div className="w-full p-2">
          <span key={r.id}>{formattedText}</span>
        </div>
      );
    };

    return isTooltip ? (
      content()
    ) : (
      <div className={labelMaxWidth}>
        <Tooltip triggerElement={triggerEl} tooltip={tooltip} truncate={true} tabIndex={0} />
      </div>
    );
  };

  const renderToolTip = () => {
    return (
      <div
        ref={tooltipRef}
        id="tooltip_Content"
        onKeyDown={(e) => handleKeyDown(e)}
        className={`ui_tooltip show_more_tooltip bg-card pointer-events-auto fixed z-[9999] max-w-[450px] rounded-md p-0 text-sm break-words shadow-md transition-opacity duration-300 dark:border ${isBoundReq ? 'overflow-y-auto' : ''}`}
        style={
          isBoundReq
            ? {
                top: elBounding?.top + 30,
                left: elBounding?.left,
                maxHeight: window.innerHeight - (elBounding?.top + 35),
              }
            : {
                top: elBounding?.top + 30,
                left: elBounding?.left,
              }
        }
      >
        <div className="w-full p-2">
          {map(slicedGroups, (m, idx: number) => {
            return <div key={`sliced_${idx}`}>{renderContent(m, true)}</div>;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-row flex-wrap gap-1">
      {map(rowData, (r, i: number) => {
        if (maxLength !== undefined && maxLength !== null && i > maxLength - 1) return null;
        return (
          <div
            key={`show_more_data${i}`}
            className={classNames(
              rowData?.length === 1 ? 'w-full' : '',
              'flex flex-row items-center justify-start',
              contentClass ?? ''
            )}
          >
            {renderContent(r, false)}
            {i !== maxLength - 1 && i !== rowData.length - 1 ? ',' : ''}
          </div>
        );
      })}

      {slicedGroups.length > 0 && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          onKeyDown={(e) => handleKeyDown(e)}
          ref={anchorRef}
          id="Show_More_Icon"
          tabIndex={0}
          role="button"
          aria-describedby="tooltip_Content"
          aria-expanded={showUITooltip ? true : false}
          aria-label={`${slicedGroups.length} more ${entityLabel ?? 'item'} `}
          className={`${moreLabelClass} focus-outline-primary focus-visible:outline-primary cursor-pointer rounded-md text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
        >
          <div style={{ textWrap: 'nowrap' }} aria-hidden="true">
            +{slicedGroups.length} {moreTextRequired ? 'more' : ''}
          </div>

          {showTooltip && showUITooltip && elBounding !== undefined && (
            <>{ReactDOM.createPortal(renderToolTip(), document.body)}</>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowMore;
