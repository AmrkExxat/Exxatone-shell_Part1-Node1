import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, X } from 'lucide-react';
import { partnersDrawer } from '../../partners/partnersTypography';
import { availabilityCreateDrawer } from './availabilityCreateDrawer';

export function PublishPreferenceDatePickerField({
  id,
  value,
  onChange,
  open: openControlled,
  onOpenChange,
  overlayKey,
  showClear = false,
  clearOpensCalendar = false,
  variant = 'default',
  fullWidth = false,
}: {
  id: string;
  value: string | null;
  onChange: (value: string | null) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  overlayKey?: string;
  showClear?: boolean;
  clearOpensCalendar?: boolean;
  variant?: 'default' | 'emphasis';
  /** Modal rows: use full column width instead of compact 252px cap. */
  fullWidth?: boolean;
}) {
  const [openInternal, setOpenInternal] = useState(false);
  const open = openControlled ?? openInternal;
  const setOpen = onOpenChange ?? setOpenInternal;
  const [viewMonth, setViewMonth] = useState(8);
  const [viewYear, setViewYear] = useState(2026);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const pickDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    onChange(label);
    setOpen(false);
  };

  const shellClass =
    variant === 'emphasis'
      ? value
        ? availabilityCreateDrawer.datePickerTriggerEmphasisFilled
        : availabilityCreateDrawer.datePickerTriggerEmphasisEmpty
      : availabilityCreateDrawer.datePickerTriggerBorderDefault;
  const triggerClass = [
    availabilityCreateDrawer.datePickerTrigger,
    shellClass,
    open ? availabilityCreateDrawer.datePickerTriggerOpen : '',
  ].join(' ');

  const calendarIconClass =
    variant === 'emphasis' ? 'size-4 shrink-0 text-[#3f51b5]' : 'size-4 shrink-0 text-[#616161]';
  const valueTextClass =
    variant === 'emphasis'
      ? `min-w-0 flex-1 truncate text-[14px] font-normal leading-5 ${value ? 'text-[#3f51b5]' : 'text-[#757575]'}`
      : `min-w-0 flex-1 truncate text-[14px] font-normal leading-5 ${
          value ? 'text-[#212121]' : partnersDrawer.programSelectPlaceholder
        }`;

  const handleClear = () => {
    onChange(null);
    if (clearOpensCalendar) setOpen(true);
  };

  const wrapClass = fullWidth ? 'relative w-full' : availabilityCreateDrawer.datePickerWrap;

  return (
    <div className={wrapClass} {...(overlayKey ? { 'data-publish-overlay': overlayKey } : {})}>
      <div className={triggerClass}>
        <button
          id={id}
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={availabilityCreateDrawer.datePickerTriggerBtn}
          onClick={() => setOpen(!open)}
        >
          <Calendar className={calendarIconClass} strokeWidth={2} aria-hidden />
          <span className={valueTextClass}>{value ?? ''}</span>
        </button>
        {showClear && value ? (
          <button
            type="button"
            className={availabilityCreateDrawer.datePickerClearBtn}
            aria-label={clearOpensCalendar ? 'Clear date and open calendar' : 'Clear date'}
            onClick={handleClear}
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </div>
      {open ? (
        <div className={availabilityCreateDrawer.datePickerPopover}>
          <input
            type="text"
            placeholder="Select or Enter date"
            className="mb-1.5 w-full rounded-[4px] border border-[#3f51b5] px-2 py-1 text-[13px] leading-5 outline-none"
            defaultValue={value ?? ''}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v) onChange(v);
            }}
          />
          <p className="mb-1.5 flex items-center gap-1 text-[11px] leading-4 text-[#757575]">
            MM/DD/YYYY
            <Info className="size-2.5 shrink-0" aria-hidden />
          </p>
          <div className="mb-1 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              className="rounded p-0.5 hover:bg-[#f5f5f5]"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else setViewMonth((m) => m - 1);
              }}
            >
              <ChevronLeft className="size-3.5" aria-hidden />
            </button>
            <span className="text-[12px] font-medium leading-4 text-[#212121]">{monthLabel}</span>
            <button
              type="button"
              aria-label="Next month"
              className="rounded p-0.5 hover:bg-[#f5f5f5]"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else setViewMonth((m) => m + 1);
              }}
            >
              <ChevronRight className="size-3.5" aria-hidden />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0 text-center text-[10px] leading-4 text-[#757575]">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} className="flex h-6 items-center justify-center">
                {d}
              </span>
            ))}
            {cells.map((day, i) =>
              day ? (
                <button
                  key={`${day}-${i}`}
                  type="button"
                  className={`${availabilityCreateDrawer.datePickerDayCell} ${
                    value?.includes(String(day).padStart(2, '0')) ||
                    (day === 30 && viewMonth === 8 && viewYear === 2026 && !value)
                      ? 'bg-[#3f51b5] text-white'
                      : 'text-[#212121] hover:bg-[#f5f5f5]'
                  }`}
                  onClick={() => pickDay(day)}
                >
                  {day}
                </button>
              ) : (
                <span key={`e-${i}`} className="h-7" aria-hidden />
              ),
            )}
          </div>
          <div className="mt-1 flex justify-end">
            <button
              type="button"
              className="text-[12px] font-normal leading-4 text-[#155dfc] hover:underline"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
