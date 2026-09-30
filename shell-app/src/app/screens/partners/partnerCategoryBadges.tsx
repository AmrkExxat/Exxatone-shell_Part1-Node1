import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { partnersType } from './partnersTypography';

const categoryBadge =
  'inline-flex w-auto max-w-full shrink-0 items-center self-start rounded-full bg-[#e8eaf6] px-2.5 py-0.5 text-[12px] font-medium leading-4 text-[#3949ab]';
/** Inside `CategoryBadgeTruncated` wrapper (table column + Basic Information). */
const categoryBadgeTruncateBlock =
  'block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-[#e8eaf6] px-2.5 py-0.5 text-[12px] font-medium leading-4 text-[#3949ab]';

const TRUNCATED_BADGE_CAP = 'max-w-[200px]';
const overflowBadge =
  'inline-flex shrink-0 cursor-default items-center rounded-full border border-[#3f51b5] bg-white px-2 py-0.5 text-[12px] font-medium leading-4 text-[#3f51b5]';

export function CategoryBadge({
  label,
  truncate = false,
  className = '',
}: {
  label: string;
  truncate?: boolean;
  className?: string;
}) {
  return (
    <span className={`${truncate ? categoryBadgeTruncateBlock : categoryBadge} ${className}`}>
      {label}
    </span>
  );
}

export function CategoryOverflowBadge({ count }: { count: number }) {
  return <span className={overflowBadge}>+{count} more</span>;
}

function CategoryBadgeTruncated({
  label,
  capClass = TRUNCATED_BADGE_CAP,
}: {
  label: string;
  capClass?: string;
}) {
  return (
    <div className={`min-w-0 ${capClass}`}>
      <CategoryBadge label={label} truncate className="min-w-0" />
    </div>
  );
}

type TwoLineLayout = {
  line1: string[];
  line2: string[];
  hiddenCount: number;
  line1TruncateSingle: boolean;
};

/** Two lines max — overflow chip on line 2; popover lists all categories. */
export function categoryTwoLineLayout(categories: string[]): TwoLineLayout {
  if (categories.length === 0) {
    return { line1: [], line2: [], hiddenCount: 0, line1TruncateSingle: false };
  }
  if (categories.length === 1) {
    return { line1: [categories[0]], line2: [], hiddenCount: 0, line1TruncateSingle: false };
  }
  if (categories.length === 2) {
    return {
      line1: [categories[0]],
      line2: [categories[1]],
      hiddenCount: 0,
      line1TruncateSingle: false,
    };
  }
  if (categories.length === 3) {
    return {
      line1: [categories[0]],
      line2: [categories[1], categories[2]],
      hiddenCount: 0,
      line1TruncateSingle: false,
    };
  }
  if (categories.length === 4) {
    return {
      line1: [categories[0]],
      line2: [categories[1]],
      hiddenCount: 2,
      line1TruncateSingle: true,
    };
  }
  return {
    line1: categories.slice(0, 3),
    line2: [],
    hiddenCount: categories.length - 3,
    line1TruncateSingle: false,
  };
}

const TABLE_LINE1_TRUNCATE_MIN_LEN = 22;

function shouldTruncateLine1Badge(
  label: string,
  line1TruncateSingle: boolean,
  variant: 'table' | 'inline',
): boolean {
  if (variant === 'inline') return false;
  if (line1TruncateSingle) return true;
  return label.length > TABLE_LINE1_TRUNCATE_MIN_LEN;
}

type TwoLineProps = {
  categories: string[];
  className?: string;
  widthClassName?: string;
  /** `inline` = Basic Information (full badge labels, no ellipsis). */
  variant?: 'table' | 'inline';
};

/** Two-line category badges + "+N more" popover (list table + Basic Information). */
export function PartnerCategoryTwoLineBadges({
  categories,
  className = '',
  widthClassName,
  variant = 'table',
}: TwoLineProps) {
  const isTable = variant === 'table';
  const resolvedWidthClassName =
    widthClassName ?? (isTable ? 'w-full min-w-0 max-w-full' : 'max-w-full');
  const truncateCapClass = 'w-full max-w-full';
  const shellOverflow = isTable ? 'min-w-0 overflow-hidden' : '';
  const rowLayout = isTable
    ? 'flex w-full min-w-0 max-w-full flex-nowrap items-center gap-1.5 overflow-hidden'
    : 'flex max-w-full flex-wrap items-center gap-1.5';
  const popoverId = useId();
  const overflowRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const { line1, line2, hiddenCount, line1TruncateSingle } = useMemo(
    () => categoryTwoLineLayout(categories),
    [categories],
  );

  const showPopover = open && hiddenCount > 0;

  useEffect(() => {
    if (!showPopover || !overflowRef.current) return;
    const rect = overflowRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, [showPopover]);

  if (categories.length === 0) return null;

  return (
    <>
      <div
        className={`flex max-w-full flex-col items-start gap-1 py-0.5 leading-none ${shellOverflow} ${resolvedWidthClassName} ${className}`}
      >
        {line1.length === 1 ? (
          shouldTruncateLine1Badge(line1[0], line1TruncateSingle, variant) ? (
            <CategoryBadgeTruncated label={line1[0]} capClass={truncateCapClass} />
          ) : (
            <CategoryBadge label={line1[0]} />
          )
        ) : (
          <div className={rowLayout}>
            {line1.map((label, index) =>
              index === 0 && shouldTruncateLine1Badge(label, false, variant) ? (
                <CategoryBadgeTruncated
                  key={`l1-${label}-${index}`}
                  label={label}
                  capClass={truncateCapClass}
                />
              ) : (
                <CategoryBadge key={`l1-${label}-${index}`} label={label} />
              ),
            )}
          </div>
        )}
        {line2.length > 0 || hiddenCount > 0 ? (
          <div className={rowLayout}>
            {line2.map((label, index) => (
              <CategoryBadge key={`l2-${label}-${index}`} label={label} className="w-auto" />
            ))}
            {hiddenCount > 0 ? (
              <span
                ref={overflowRef}
                className="inline-flex shrink-0"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                tabIndex={0}
                role="button"
                aria-describedby={showPopover ? popoverId : undefined}
                aria-label={`${hiddenCount} more categories`}
              >
                <CategoryOverflowBadge count={hiddenCount} />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {showPopover
        ? createPortal(
            <div
              id={popoverId}
              role="tooltip"
              className="pointer-events-none fixed z-[200] w-[min(300px,calc(100vw-2rem))] rounded-[8px] border border-[#eceef1] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
              style={{ top: coords.top, left: coords.left }}
            >
              <p
                className={`${partnersType.badgeSm} mb-2 font-semibold uppercase tracking-wide text-[#757575]`}
              >
                ALL CATEGORIES ({categories.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((label, index) => (
                  <CategoryBadge key={`all-${label}-${index}`} label={label} />
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/** Table category column — two-line wrap; popover only on "+N more". */
export function PartnerCategoryTableCell({ categories }: { categories: string[] }) {
  if (categories.length === 0) {
    return <span className="text-[14px] text-[#757575]">—</span>;
  }
  return <PartnerCategoryTwoLineBadges categories={categories} variant="table" />;
}

/** All badges wrapped (Edit Category drawer collapsed state). */
export function PartnerCategoryCollapsedBadges({
  categories,
  className = 'mt-2',
}: {
  categories: string[];
  className?: string;
}) {
  if (categories.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {categories.map((label) => (
        <CategoryBadge key={label} label={label} />
      ))}
    </div>
  );
}
