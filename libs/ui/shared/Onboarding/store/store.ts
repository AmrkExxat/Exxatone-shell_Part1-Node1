/** Scoped Zustand store: Provider, useOnboardingSlice, useOnboardingStoreApi. */

import { type StateCreator, createStore, useStore } from 'zustand';
import { useContext } from 'react';
import { createScopedStore } from './createScopedStore';
import type {
  OnboardingStore,
  PendingWorkflow,
  RequirementGroup,
  CaasStatusMap,
  DueDateConfig,
  DataPhase,
  RequirementItem,
} from './types';

const IDLE_WORKFLOW: PendingWorkflow = { type: 'idle', restoreRequirementId: null };

const onboardingStoreInitializer: StateCreator<OnboardingStore> = (set, get) => ({
  selectedRequirement: { data: null, isLoading: false },
  activeTab: 'caas',
  isFormExpanded: false,
  dataPhase: 'idle',
  requirementGroups: [],
  requirementCount: 0,
  caasStatusMap: null,
  dueDateConfig: {},
  pendingWorkflow: IDLE_WORKFLOW,
  shouldExpandNewRecord: false,
  selectionRevision: 0,
  restoreRequirementOverride: null,

  selectRequirement: (req: RequirementItem) => {
    set({
      selectedRequirement: { data: req, isLoading: false },
      isFormExpanded: false,
      selectionRevision: get().selectionRevision + 1,
    });
  },

  clearSelectedRequirement: () => set({ selectedRequirement: { data: null, isLoading: false } }),

  completeRequirementTransition: () =>
    set((s) => ({
      selectedRequirement: { ...s.selectedRequirement, isLoading: false },
    })),

  setActiveTab: (tab: string) =>
    set({
      activeTab: tab,
      selectedRequirement: { data: null, isLoading: false },
    }),

  toggleFormExpanded: () => set((s) => ({ isFormExpanded: !s.isFormExpanded })),

  setRequirements: (groups: RequirementGroup[], count: number) =>
    set({ requirementGroups: groups, requirementCount: count }),

  setCaasStatusMap: (map: CaasStatusMap) => set({ caasStatusMap: map }),

  setDueDateConfig: (config: DueDateConfig) => set({ dueDateConfig: config }),

  setDataPhase: (phase: DataPhase) => set({ dataPhase: phase }),

  triggerRefresh: () =>
    set({
      restoreRequirementOverride: null,
      pendingWorkflow: { type: 'refresh', restoreRequirementId: null },
    }),

  triggerRefreshAndRestore: () => {
    const override = get().restoreRequirementOverride;
    const restoreId = override ?? get().selectedRequirement.data?.requirementId ?? null;
    set({
      restoreRequirementOverride: null,
      pendingWorkflow: { type: 'refresh_and_restore', restoreRequirementId: restoreId },
    });
  },

  setRestoreRequirementOverride: (requirementId: string | null) =>
    set({ restoreRequirementOverride: requirementId }),

  triggerAddNewRecord: () => {
    const restoreId = get().selectedRequirement.data?.requirementId ?? null;
    set({ pendingWorkflow: { type: 'add_new_record', restoreRequirementId: restoreId } });
  },

  consumeWorkflow: () => {
    const workflow = get().pendingWorkflow;
    set({ pendingWorkflow: IDLE_WORKFLOW });
    return workflow;
  },

  consumeExpandNewRecord: () => set({ shouldExpandNewRecord: false }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Scoped store — one instance per <OnboardingContainer> mount
// ─────────────────────────────────────────────────────────────────────────────

const {
  Provider: OnboardingStoreProvider,
  useSlice: useOnboardingSlice,
  useStoreApi: useOnboardingStoreApi,
  Context: _OnboardingStoreContext,
} = createScopedStore<OnboardingStore>(onboardingStoreInitializer);

// ─────────────────────────────────────────────────────────────────────────────
// Safe hook — returns null when called OUTSIDE an OnboardingContainer tree,
// a concrete value when called INSIDE.
//
// This lets components that are shared between the old (no-store) and new
// (store-backed) paths safely subscribe without throwing.
//
// Rules-of-hooks note: both useContext and useStore are called unconditionally.
// A module-level fallback store absorbs the useStore call when no Provider
// is present, and we return null so callers know they are outside the context.
// ─────────────────────────────────────────────────────────────────────────────

/** Module-level fallback — never mutated, used only to satisfy useStore */
const _fallbackOnboardingStore = createStore<OnboardingStore>()(onboardingStoreInitializer);

/**
 * Like `useOnboardingSlice` but safe to call outside an `<OnboardingContainer>`.
 *
 * Returns `null` when not inside a store Provider so callers can branch:
 *   const val = useOnboardingSliceSafe(s => s.shouldExpandNewRecord);
 *   if (val !== null) { ... } // new path
 *   else { ... }              // old / legacy path
 */
function useOnboardingSliceSafe<U>(selector: (s: OnboardingStore) => U): U | null {
  const ctxStore = useContext(_OnboardingStoreContext);
  // Always call useStore — never conditionally — rules of hooks satisfied.
  const value = useStore(ctxStore ?? _fallbackOnboardingStore, selector);
  return ctxStore ? value : null;
}

export {
  OnboardingStoreProvider,
  useOnboardingSlice,
  useOnboardingStoreApi,
  useOnboardingSliceSafe,
};
export type { OnboardingStore };
