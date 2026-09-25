'use client';

/** Single entry for onboarding UI: scoped store, fetch orchestration, layout + slots. */

import { useEffect, useMemo, useRef, type ReactNode } from 'react';

import { OnboardingStoreProvider, useOnboardingSlice, useOnboardingStoreApi } from './store/store';
import type { RequirementGroup } from './store/types';
import type { OnboardingContainerProps, OnboardingStoreApi } from './types';
import { DEFAULT_TABS } from './defaultConfig';

import { ThreePanelLayout } from './layouts/ThreePanelLayout';
import { OnePanelLayout } from './layouts/OnePanelLayout';
import { RequirementPane, ReqStatusHeader } from './panes/RequirementPane';
import { FormPane } from './panes/FormPane';
import { RequirementFormPlaceholder } from './panes/RequirementFormPlaceholder';

interface TabBarProps {
  tabs: typeof DEFAULT_TABS;
  topBarActionsSlot?: ReactNode;
  /** Header rendered above the person-selector column (group views). */
  personSelectorHeaderSlot?: ReactNode;
}

const TabButtons = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: typeof DEFAULT_TABS;
  activeTab: string;
  setActiveTab: (key: string) => void;
}) => (
  <div className="flex">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => setActiveTab(tab.key)}
        className={[
          'flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors',
          activeTab === tab.key
            ? 'border-primary text-primary'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        ].join(' ')}
        aria-current={activeTab === tab.key ? 'page' : undefined}
      >
        {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
);

const TabBar = ({ tabs, topBarActionsSlot, personSelectorHeaderSlot }: TabBarProps) => {
  const activeTab = useOnboardingSlice(
    (s) => s.activeTab,
    (a, b) => a === b
  );
  const storeApi = useOnboardingStoreApi();
  const setActiveTab = (key: string) => storeApi.getState().setActiveTab(key);

  if (personSelectorHeaderSlot) {
    return (
      <>
        <div className="flex items-center justify-start">
          <div className="flex w-60 flex-shrink-0 items-center self-stretch border-r border-gray-300 bg-gray-50 lg:w-[16rem]">
            {personSelectorHeaderSlot}
          </div>
          <div className="w-60 border-r border-gray-300 lg:w-[22rem]">
            <TabButtons tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">{topBarActionsSlot}</div>
      </>
    );
  }

  return (
    <>
      <div className="w-60 border-r border-gray-300 lg:w-[22rem]">
        <TabButtons tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex items-center justify-end gap-2">{topBarActionsSlot}</div>
    </>
  );
};

interface SidebarProps {
  requirementItemSlot: OnboardingContainerProps['requirementItemSlot'];
  dirtyCheck?: () => boolean;
  onSaveAndExit?: () => Promise<boolean> | boolean;
}

const Sidebar = ({ requirementItemSlot, dirtyCheck, onSaveAndExit }: SidebarProps) => {
  const activeTab = useOnboardingSlice(
    (s) => s.activeTab,
    (a, b) => a === b
  );
  const groups = useOnboardingSlice((s) => s.requirementGroups);
  const dataPhase = useOnboardingSlice(
    (s) => s.dataPhase,
    (a, b) => a === b
  );
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-col border-b border-gray-200 p-2">
        <ReqStatusHeader activeTab={activeTab} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {dataPhase === 'fetching' ? (
          <div className="flex flex-col gap-2 p-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-12 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : (
          <RequirementPane
            groups={groups}
            itemSlot={requirementItemSlot}
            dirtyCheck={dirtyCheck}
            onSaveAndExit={onSaveAndExit}
          />
        )}
      </div>
    </div>
  );
};

interface OnboardingContentProps extends Omit<OnboardingContainerProps, 'layout'> {
  layout: 'three-panel' | 'one-panel';
  tabs: typeof DEFAULT_TABS;
}

const OnboardingContent = (props: OnboardingContentProps) => {
  const {
    context,
    onFetchRequirements,
    onFetchCAASStatus,
    onFetchDueDates,
    onStoreReady,
    tabs,
    layout,
    headerSlot,
    requirementItemSlot,
    formContentSlot,
    formHeaderActionsSlot,
    topBarActionsSlot,
    onTabChange,
    personSelectorSlot,
    personSelectorHeaderSlot,
    emptyStateSlot,
    isDirty,
    onSaveAndExit,
    className,
  } = props;

  const storeApiRef = useOnboardingStoreApi();
  const storeApi = useRef<OnboardingStoreApi>({
    triggerRefresh: () => storeApiRef.getState().triggerRefresh(),
    triggerRefreshAndRestore: () => storeApiRef.getState().triggerRefreshAndRestore(),
    triggerAddNewRecord: () => storeApiRef.getState().triggerAddNewRecord(),
    getState: () => storeApiRef.getState(),
  });

  useEffect(() => {
    onStoreReady?.(storeApi.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTab = useOnboardingSlice(
    (s) => s.activeTab,
    (a, b) => a === b
  );
  const pendingWorkflowType = useOnboardingSlice(
    (s) => s.pendingWorkflow.type,
    (a, b) => a === b
  );
  const pendingWorkflowRestoreId = useOnboardingSlice(
    (s) => s.pendingWorkflow.restoreRequirementId,
    (a, b) => a === b
  );

  useEffect(() => {
    onTabChange?.(activeTab);
  }, [activeTab, onTabChange]);

  const lastFetchKey = useRef<string>('');
  const fetchGenRef = useRef<number>(0);

  const runFetch = async (
    tab: string,
    restoreId: string | null,
    expandNewRecord: boolean,
    gen: number
  ) => {
    const store = storeApiRef.getState();
    store.setDataPhase('fetching');

    try {
      const [reqResult, caasResult, dueDateResult] = await Promise.allSettled([
        onFetchRequirements(tab, context),
        onFetchCAASStatus?.(tab, context),
        onFetchDueDates?.(tab, context),
      ]);

      // Discard results from a superseded fetch (user switched view mid-flight).
      if (gen !== fetchGenRef.current) {
        return;
      }

      const freshStore = storeApiRef.getState();

      if (reqResult.status === 'fulfilled') {
        freshStore.setRequirements(reqResult.value.groups, reqResult.value.count);
      }
      if (caasResult?.status === 'fulfilled' && caasResult.value) {
        freshStore.setCaasStatusMap(caasResult.value.map);
      }
      if (dueDateResult?.status === 'fulfilled' && dueDateResult.value) {
        freshStore.setDueDateConfig(dueDateResult.value.config);
      }

      freshStore.setDataPhase('ready');

      if (restoreId && reqResult.status === 'fulfilled') {
        const allReqs = reqResult.value.groups.flatMap((g: RequirementGroup) => g.caasReq ?? []);
        const toRestore = allReqs.find((r) => r.requirementId === restoreId);
        if (toRestore) {
          freshStore.selectRequirement(toRestore);
        }
      }

      if (expandNewRecord) {
        storeApiRef.setState({ shouldExpandNewRecord: true });
      }
    } catch (err) {
      if (gen !== fetchGenRef.current) return;
      storeApiRef.getState().setDataPhase('error');
    }
  };

  useEffect(() => {
    const key = `${activeTab}::${JSON.stringify(context)}`;
    if (lastFetchKey.current === key) return;
    lastFetchKey.current = key;

    const gen = ++fetchGenRef.current;
    void runFetch(activeTab, null, false, gen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, context]);

  useEffect(() => {
    if (pendingWorkflowType === 'idle') return;
    const workflow = storeApiRef.getState().consumeWorkflow();

    const restoreId = workflow.restoreRequirementId;
    const expandNewRecord = workflow.type === 'add_new_record';

    lastFetchKey.current = '';
    const gen = ++fetchGenRef.current;
    void runFetch(activeTab, restoreId, expandNewRecord, gen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingWorkflowType, pendingWorkflowRestoreId]);

  const defaultEmptyState = useMemo(() => <RequirementFormPlaceholder variant="empty" />, []);

  const emptyStateResolved = emptyStateSlot ?? defaultEmptyState;

  const formPane = useMemo(
    () => (
      <FormPane
        formContentSlot={formContentSlot}
        formHeaderActionsSlot={formHeaderActionsSlot}
        emptyStateSlot={emptyStateResolved}
        storeApi={storeApi.current}
      />
    ),
    [formContentSlot, formHeaderActionsSlot, emptyStateResolved]
  );

  const sidebar = useMemo(
    () => (
      <Sidebar
        requirementItemSlot={requirementItemSlot}
        dirtyCheck={isDirty}
        onSaveAndExit={onSaveAndExit}
      />
    ),
    [requirementItemSlot, isDirty, onSaveAndExit]
  );

  const topBar = useMemo(
    () => (
      <TabBar
        tabs={tabs}
        topBarActionsSlot={topBarActionsSlot}
        personSelectorHeaderSlot={personSelectorSlot ? personSelectorHeaderSlot : undefined}
      />
    ),
    [tabs, topBarActionsSlot, personSelectorSlot, personSelectorHeaderSlot]
  );

  return (
    <div className={['flex h-full w-full flex-col', className].filter(Boolean).join(' ')}>
      {headerSlot}

      {layout === 'one-panel' ? (
        <OnePanelLayout topBarSlot={topBar}>{formPane}</OnePanelLayout>
      ) : (
        <ThreePanelLayout
          topBarSlot={topBar}
          sidebarSlot={sidebar}
          formSlot={formPane}
          personSelectorSlot={personSelectorSlot}
        />
      )}
    </div>
  );
};

const OnboardingContainer = (props: OnboardingContainerProps) => {
  const { layout = 'three-panel', tabs = DEFAULT_TABS, defaultTab, ...rest } = props;
  const resolvedDefaultTab = defaultTab ?? tabs[0]?.key ?? 'caas';
  return (
    <OnboardingStoreProvider initial={{ activeTab: resolvedDefaultTab }}>
      <OnboardingContent layout={layout} tabs={tabs} {...rest} />
    </OnboardingStoreProvider>
  );
};

export { OnboardingContainer };
