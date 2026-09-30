import { useLayoutEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';
import { AvailabilityProvider } from '../../data/AvailabilityContext';
import { CreateAvailabilitySheet } from './create/CreateAvailabilitySheet';
import { AvailabilityModuleChrome } from './AvailabilityModuleChrome';
import { availabilityChrome, partnersFont, partnersSurfaces } from './availabilityTypography';

function syncModuleChromeHeight(el: HTMLElement | null) {
  const root = el?.closest('[data-availability-layout]') as HTMLElement | null;
  if (!root || !el) return;
  root.style.setProperty('--availability-module-chrome-height', `${el.offsetHeight}px`);
}

export function AvailabilityLayout() {
  const moduleChromeRef = useRef<HTMLDivElement>(null);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  useLayoutEffect(() => {
    const el = moduleChromeRef.current;
    if (!el) return;

    syncModuleChromeHeight(el);
    const ro = new ResizeObserver(() => syncModuleChromeHeight(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <AvailabilityProvider>
      <div
        data-availability-layout
        className={`min-h-full ${partnersSurfaces.page} ${partnersFont}`}
      >
        <div ref={moduleChromeRef} className={availabilityChrome.moduleSticky}>
          <AvailabilityModuleChrome onCreateSingle={() => setCreateSheetOpen(true)} />
        </div>
        <Outlet />
        <CreateAvailabilitySheet open={createSheetOpen} onOpenChange={setCreateSheetOpen} />
      </div>
    </AvailabilityProvider>
  );
}
