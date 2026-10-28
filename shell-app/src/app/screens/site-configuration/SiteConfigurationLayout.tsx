import { Outlet } from 'react-router';
import { SiteConfigurationNav } from './SiteConfigurationNav';
import { sc } from './siteConfigurationTokens';

export function SiteConfigurationLayout() {
  return (
    <div
      className={`${sc.font} ${sc.workspaceRoot} min-h-0 flex-1`}
      data-site-configuration-layout
    >
      <SiteConfigurationNav />
      <div className={`${sc.mainColumn} ${sc.mainCanvas} min-h-0 flex-1 overflow-y-auto`}>
        <Outlet />
      </div>
    </div>
  );
}
