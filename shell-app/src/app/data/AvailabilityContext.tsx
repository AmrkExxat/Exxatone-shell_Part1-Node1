import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  initialAvailabilityRecords,
  type AvailabilityRecord,
} from '../config/availability';

interface AvailabilityContextValue {
  records: AvailabilityRecord[];
}

const AvailabilityContext = createContext<AvailabilityContextValue | null>(null);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [records] = useState<AvailabilityRecord[]>(initialAvailabilityRecords);
  const value = useMemo(() => ({ records }), [records]);
  return (
    <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const ctx = useContext(AvailabilityContext);
  if (!ctx) {
    throw new Error('useAvailability must be used within AvailabilityProvider');
  }
  return ctx;
}
