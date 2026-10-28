import { useLayoutEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import { SchedulesModuleChrome } from './SchedulesModuleChrome';
import { partnersFont, partnersSurfaces, schedulesChrome } from './schedulesTypography';

function syncModuleChromeHeight(el: HTMLElement | null) {
  const root = el?.closest('[data-schedules-layout]') as HTMLElement | null;
  if (!root || !el) return;
  root.style.setProperty('--schedules-module-chrome-height', `${el.offsetHeight}px`);
}

export function SchedulesLayout() {
  const moduleChromeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = moduleChromeRef.current;
    if (!el) return;
    syncModuleChromeHeight(el);
    const ro = new ResizeObserver(() => syncModuleChromeHeight(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      data-schedules-layout
      className={`min-h-full ${partnersSurfaces.page} ${partnersFont}`}
    >
      <div ref={moduleChromeRef} className={schedulesChrome.moduleSticky}>
        <SchedulesModuleChrome />
      </div>
      <Outlet />
    </div>
  );
}
