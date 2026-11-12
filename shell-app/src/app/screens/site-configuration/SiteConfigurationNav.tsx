import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import chevronDown from '../../../assets/site-configuration/chevron-down.svg';
import chevronRight from '../../../assets/site-configuration/chevron-right.svg';
import {
  SITE_CONFIG_NAV_SECTIONS,
  siteConfigPath,
  type SiteConfigNavSection,
} from '../../config/siteConfiguration';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../components/ui/collapsible';
import { sc } from './siteConfigurationTokens';

function activeSegment(pathname: string, siteId: string) {
  const prefix = `/site/${siteId}/site-configuration/`;
  if (!pathname.startsWith(prefix)) return '';
  const segment = pathname.slice(prefix.length).replace(/\/$/, '');
  if (segment.startsWith('notification/email-templates')) return 'notification/email-templates';
  return segment;
}

function openSectionsForRoute(segment: string): Record<string, boolean> {
  const open: Record<string, boolean> = { 'site-details': true };
  for (const section of SITE_CONFIG_NAV_SECTIONS) {
    if (section.children?.some((c) => c.segment === segment)) {
      open[section.id] = true;
    }
  }
  return open;
}

export function SiteConfigurationNav() {
  const { siteId = '' } = useParams<{ siteId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const current = activeSegment(location.pathname, siteId);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    openSectionsForRoute(current),
  );

  useEffect(() => {
    setOpenSections((prev) => ({ ...prev, ...openSectionsForRoute(current) }));
  }, [current]);

  const go = (segment: string) => {
    if (!siteId) return;
    navigate(siteConfigPath(siteId, segment));
  };

  const renderLeaf = (segment: string, label: string) => {
    const active = current === segment;
    return (
      <div key={segment} className={sc.navLeafWrap}>
        <button
          type="button"
          onClick={() => go(segment)}
          className={
            active
              ? `${sc.navLeafBase} ${sc.navLeafActive}`
              : `${sc.navLeafBase} ${sc.navLeafIdle}`
          }
          aria-current={active ? 'page' : undefined}
        >
          {label}
        </button>
      </div>
    );
  };

  const renderSection = (section: SiteConfigNavSection) => {
    if (!section.children?.length) return null;

    const isOpen = openSections[section.id] ?? false;

    return (
      <Collapsible
        key={section.id}
        open={isOpen}
        onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, [section.id]: open }))}
      >
        <CollapsibleTrigger className={sc.sectionBtn} type="button" title={section.label}>
          <span className={sc.sectionLabel}>{section.label}</span>
          <img
            src={isOpen ? chevronDown : chevronRight}
            alt=""
            aria-hidden
            className={sc.chevron}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-1">
          {section.children.map((child) => renderLeaf(child.segment, child.label))}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <aside className={sc.configCard} aria-label="Configuration">
      <div className={sc.configInner}>
        <p className={sc.configTitle}>Configuration</p>
        <nav className={sc.configNav}>{SITE_CONFIG_NAV_SECTIONS.map(renderSection)}</nav>
      </div>
    </aside>
  );
}
