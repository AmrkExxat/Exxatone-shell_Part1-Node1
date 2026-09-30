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
  updatePartnerCategories: (id: string, categories: string[]) => void;
}

const SchoolPartnersContext = createContext<SchoolPartnersContextValue | null>(null);

export function SchoolPartnersProvider({ children }: { children: ReactNode }) {
  const [partners, setPartners] = useState<SchoolPartner[]>(initialSchoolPartners);

  const getPartner = useCallback(
    (id: string) => partners.find((p) => p.id === id),
    [partners],
  );

  const updatePartnerCategories = useCallback((id: string, categories: string[]) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, categories: [...categories] } : p)),
    );
  }, []);

  const value = useMemo(
    () => ({ partners, getPartner, updatePartnerCategories }),
    [partners, getPartner, updatePartnerCategories],
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
