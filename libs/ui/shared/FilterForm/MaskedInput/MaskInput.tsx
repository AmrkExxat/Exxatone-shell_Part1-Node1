import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  ChangeEvent,
  useEffect,
} from 'react';

interface DateInputMaskProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  placeholder?: string;
  className?: string;
  'aria-describedby'?: string;
}

const DateInputMask = forwardRef<HTMLInputElement, DateInputMaskProps>(
  (
    {
      value = '',
      onChange,
      onBlur,
      onClick,
      placeholder = 'MM/DD/YYYY',
      className = '',
      'aria-describedby': ariaDescribedBy,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
      if (value instanceof Date && !isNaN(value)) {
        const mm = String(value.getMonth() + 1).padStart(2, '0');
        const dd = String(value.getDate()).padStart(2, '0');
        const yyyy = value.getFullYear();
        setInternalValue(`${mm}/${dd}/${yyyy}`);
      } else if (typeof value === 'string') {
        setInternalValue(value); // fallback
      }
    }, [value]);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const getMaxDayForMonth = (month: number, year?: number) => {
      let day = 31;
      if (month === 2) {
        if (typeof year === 'number' && year.toString().length === 4) {
          day = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
        } else {
          day = 29;
        }
      }

      if ([4, 6, 9, 11].includes(month)) day = 30;
      console.log(day);
      return day;
    };

    const formatDate = (value: string): string => {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 8); // MMDDYYYY
      let formatted = '';

      const mm = digitsOnly.slice(0, 2);
      const dd = digitsOnly.slice(2, 4);
      const yyyy = digitsOnly.slice(4, 8);

      // Month fix
      let safeMM = mm;
      if (mm.length === 2) {
        const month = parseInt(mm);
        if (month < 1) safeMM = '01';
        else if (month > 12) safeMM = '12';
      }

      // Day fix
      let safeDD = dd;
      if (dd.length === 2 && mm.length === 2) {
        const month = parseInt(safeMM);
        const year = yyyy.length === 4 ? parseInt(yyyy) : undefined;
        const maxDay = getMaxDayForMonth(month, month === 2 ? year : undefined);
        const day = parseInt(dd);
        if (day < 1) safeDD = '01';
        else if (day > maxDay) safeDD = String(maxDay).padStart(2, '0');
      }

      // Format step-by-step
      if (safeMM) formatted = safeMM;
      if (safeDD) formatted += `/${safeDD}`;
      if (yyyy) formatted += `/${yyyy}`;

      return formatted;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const formatted = formatDate(e.target.value);
      setInternalValue(formatted);

      // Update the input value in-place for consistency
      e.target.value = formatted;

      // Send original event with formatted value
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowed = [8, 9, 27, 13, 46]; // backspace, tab, esc, enter, delete
      const isCtrl = e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode); // A, C, V, X

      if (allowed.includes(e.keyCode) || isCtrl) return;

      const isDigit = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
      if (!isDigit) {
        e.preventDefault();
      }
    };

    return (
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onClick={onClick}
        maxLength={10}
        placeholder={placeholder}
        className={className}
        aria-describedby={ariaDescribedBy}
      />
    );
  }
);

DateInputMask.displayName = 'DateInputMask';
export default DateInputMask;
