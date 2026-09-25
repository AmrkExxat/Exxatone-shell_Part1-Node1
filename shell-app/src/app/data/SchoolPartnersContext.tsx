import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  initialSchoolPartners,
  type SchoolPartner,
} from '../config/schoolPartners';

interface SchoolPartnersContextValue {
  partners: SchoolPartner[];
  getPartner: (id: string) => SchoolPartner | undefined;
  updatePartnerCategory: (id: string, category: string) => void;
}

const SchoolPartnersContext = createContext<SchoolPartnersContextValue | null>(null);

export function SchoolPartnersProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<SchoolPartner[]>(initialSchoolPartners);

  const getPartner = useCallback(
    (id: string) => partners.find((p) => p.id === id),
    [partners],
  );

  const updatePartnerCategory = useCallback((id: string, category: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, category } : p)),
    );
  }, []);

  const value = useMemo(
    () => ({ partners, getPartner, updatePartnerCategory }),
    [partners, getPartner, updatePartnerCategory],
  );

  return (
    <SchoolPartnersContext.Provider value={value}>{children}</SchoolPartnersContext.Provider>
  );
}

export function useSchoolPartners() {
  const ctx = useContext(SchoolPartnersContext);
  if (!ctx) {
    throw new Error('useSchoolPartners must be used within SchoolPartnersProvider');
  }
  return ctx;
}
