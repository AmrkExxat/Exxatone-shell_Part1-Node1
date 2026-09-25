import { Outlet } from 'react-router';
import { SchoolPartnersProvider } from '../../data/SchoolPartnersContext';

export function SchoolPartnersLayout() {
  return (
    <SchoolPartnersProvider>
      <Outlet />
    </SchoolPartnersProvider>
  );
}
