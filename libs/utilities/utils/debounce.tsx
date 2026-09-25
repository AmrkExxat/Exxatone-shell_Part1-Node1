import { useEffect, useState } from 'react';

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (value.length > 2 || value.length === 0) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [value, delay]);

  return debouncedValue;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: NodeJS.Timeout | null = null;
  let result: ReturnType<T> | undefined;

  return function executedFunction(...args: Parameters<T>): ReturnType<T> | undefined {
    const later = (): void => {
      timeout = null;
      result = func(...args) as ReturnType<T>;
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);

    return result;
  };
}

export default useDebounce;
