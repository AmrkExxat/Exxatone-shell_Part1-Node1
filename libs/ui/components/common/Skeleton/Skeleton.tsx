import React from 'react';

export type SkeletonProps = {
  type: 'default' | 'text' | 'card' | 'image' | 'widget' | 'list' | 'custom' | 'stacked';
  lines?: number;
  height?: string;
  className?: string;
  width?: string;
};

export const renderNumberOfLines = (numberOfLines: number = 2) => (
  <div role="status" className="w-full animate-pulse">
    {[...Array(numberOfLines)].map((_, index) =>
      renderSmallLine(index % 2 === 0 ? 'max-w-[360px]' : 'max-w-[300px]')
    )}
    <span className="sr-only">Loading...</span>
  </div>
);

export const renderSmallLine = (width: string, index?: number) => {
  const _index = index ? `small_line_${index}` : `small_line_${Math.random()}`;
  return (
    <div
      key={`small_line_${_index}`}
      className={`h-2 rounded-full bg-gray-200 dark:bg-gray-700 ${width} mb-2.5`}
    ></div>
  );
};

const Skeleton = (props: SkeletonProps): React.ReactElement => {
  const { type } = props;

  const renderLine = (width: string, className = '') => {
    const _index = `small_line_${Math.random()}`;

    return (
      <div
        key={`line_${_index}`}
        className={`h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 ${width} ${className}`}
      ></div>
    );
  };

  const renderSVGIcon = () => (
    <svg
      className="h-10 w-10 text-gray-200 dark:text-gray-700"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
    </svg>
  );

  const renderText = () => (
    <div role="status" className="max-w-lg animate-pulse space-y-2.5">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex w-full items-center">
          {renderLine(index % 2 === 0 ? 'w-32' : 'w-full')}
          {renderLine('w-24', 'ms-2')}
          {renderLine('w-full', 'ms-2')}
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderCard = () => (
    <div role="status" className="bg-card max-w-sm animate-pulse rounded-md border p-4 md:p-6">
      {renderLine('w-48 mb-4')}
      {[...Array(3)].map((_, index) => renderSmallLine('mb-2.5', index))}
      <div className="mt-2 flex items-center">
        {renderSVGIcon()}
        <div className="mt-3 ml-2">
          {renderLine('w-32 mb-2')}
          {renderSmallLine('w-48')}
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderImage = () => (
    <div
      role="status"
      className="animate-pulse space-y-8 md:flex md:items-center md:space-y-0 md:space-x-8 rtl:space-x-reverse"
    >
      <div className="flex h-48 w-full items-center justify-center rounded bg-gray-300 sm:w-96 dark:bg-gray-700">
        <svg
          className="h-10 w-10 text-gray-200 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>
      <div className="w-full">
        {renderLine('w-48 mb-4')}
        {[...Array(5)].map((_, index) =>
          renderSmallLine(index % 2 === 0 ? 'max-w-[480px]' : 'max-w-[360px]')
        )}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderWidget = () => (
    <div role="status" className="bg-card max-w-sm animate-pulse rounded-md border p-4 md:p-6">
      {renderLine('w-32 mb-2.5')}
      {renderSmallLine('w-48 mb-10')}
      <div className="mt-4 flex items-baseline">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className={`w-full rounded-t-lg bg-gray-200 ${index % 2 === 0 ? 'h-72' : 'h-56'} dark:bg-gray-700 ${index > 0 ? 'ms-6' : ''}`}
          ></div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderList = () => (
    <div
      role="status"
      className="bg-card max-w-md animate-pulse space-y-4 divide-y divide-gray-200 rounded-md border p-4 md:p-6 dark:divide-gray-700"
    >
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center justify-between pt-4">
          <div>
            {renderLine('w-24 mb-2.5')}
            {renderSmallLine('w-32')}
          </div>
          {renderLine('w-12')}
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderDefault = () => (
    <div role="status" className="max-w-sm animate-pulse">
      {renderLine('w-48 mb-4')}
      {[...Array(5)].map((_, index) =>
        renderSmallLine(index % 2 === 0 ? 'max-w-[360px]' : 'max-w-[300px]')
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderStacked = (
    lines: number = 2,
    height: string = 'h-[50px]',
    className: string = 'rounded-[8px] bg-gray-200 dark:bg-gray-700 ',
    width: string = 'w-[277px]'
  ) => (
    <div role="status" className="w-full max-w-xl animate-pulse space-y-4">
      {[...Array(lines)].map((_, index) => (
        <div key={index} className={`${height} ${className} ${width}`} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );

  switch (type) {
    case 'text':
      return renderText();
    case 'card':
      return renderCard();
    case 'image':
      return renderImage();
    case 'widget':
      return renderWidget();
    case 'list':
      return renderList();
    case 'custom':
      return renderNumberOfLines(props?.lines ?? 2);
    case 'stacked':
      return renderStacked(
        props?.lines ?? 2,
        props?.height ?? 'h-[50px]',
        props?.className ?? 'rounded-[8px] bg-gray-200 dark:bg-gray-700',
        props?.width ?? 'w-[277px]'
      );
    case 'default':
    default:
      return renderDefault();
  }
};

export default Skeleton;
