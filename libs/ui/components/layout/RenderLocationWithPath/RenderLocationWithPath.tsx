import React from 'react';

type PathItem = {
  name?: string;
};

type Address = {
  lines?: string[];
  city?: string;
  state?: string;
  zip?: string;
};

type LocationType = {
  id: string;
  name?: string;
  paths?: PathItem[][];
  addresses?: Address;
};

interface LocationDisplayProps {
  location: LocationType | null | undefined;
  showAddress?: boolean;
  compact?: boolean;
  className?: string;
}

const RenderLocationWithPath: React.FC<LocationDisplayProps> = ({
  location,
  showAddress = false,
  compact = false,
  className = '',
}) => {
  if (!location || typeof location !== 'object') return null;

  const pathArray: PathItem[] = location?.paths?.[0] ?? [];

  const pathString = pathArray
    .map((i) => i?.name)
    .filter(Boolean)
    .join(' > ');
  const locationName = location?.name ?? '';

  let locationAddress = '';
  if (showAddress && location?.addresses) {
    const address = location.addresses;
    const addressLines = [
      address?.lines?.[0],
      address?.lines?.[1],
      address?.city,
      address?.state,
      address?.zip,
    ]
      .filter(Boolean)
      .join(', ');
    locationAddress = addressLines;
  }

  return (
    <div
      key={`location_${location.id}`}
      role="heading"
      aria-level={4}
      className={`text-xs whitespace-normal ${compact ? 'mt-[2px] flex w-full text-[12px] font-semibold' : 'mb-1'} ${className}`}
    >
      <div className={compact ? '' : 'mb-1 font-semibold'}>
        <span>{locationName}</span>
        {pathString && <span>{` ( ${pathString} )`}</span>}
      </div>
      {showAddress && !compact && locationAddress && <div>{locationAddress}</div>}
    </div>
  );
};

export default RenderLocationWithPath;
