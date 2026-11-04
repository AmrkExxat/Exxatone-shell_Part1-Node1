import { Outlet, useLocation } from 'react-router';
import { SiteConfigurationNav } from './SiteConfigurationNav';
import { sc } from './siteConfigurationTokens';

/** The template editor takes the full width: no secondary nav, no left gutter. */
function isFullWidthRoute(pathname: string): boolean {
  return pathname.endsWith('/notification/email-templates/editor');
}

export function SiteConfigurationLayout() {
  const { pathname } = useLocation();
  const fullWidth = isFullWidthRoute(pathname);

  return (
    <div
      className={`${sc.font} ${sc.workspaceRoot} min-h-0 flex-1`}
      data-site-configuration-layout
    >
      {fullWidth ? null : <SiteConfigurationNav />}
      <div
        className={`${sc.mainCanvas} min-h-0 flex-1 overflow-y-auto ${fullWidth ? '' : sc.mainColumn}`}
      >
        <Outlet />
      </div>
    </div>
  );
}
