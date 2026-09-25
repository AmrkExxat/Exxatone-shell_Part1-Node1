/** Public API types for Onboarding. Import from @exxat/ui. */

import type { ReactNode } from 'react';
import type {
  RequirementItem,
  RequirementGroup,
  CaasStatusMap,
  DueDateConfig,
  TabConfig,
  OnboardingStore,
} from './store/types';

export type { RequirementItem, RequirementGroup, CaasStatusMap, DueDateConfig, TabConfig };

export type OnboardingContext = Record<string, unknown>;

export interface FetchRequirementsResult {
  groups: RequirementGroup[];
  count: number;
}

export interface FetchCAASStatusResult {
  map: CaasStatusMap;
}

export interface FetchDueDatesResult {
  config: DueDateConfig;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store API surface exposed to consumers via `onStoreReady`
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Imperative handle returned to consumers so they can trigger workflow signals
 * from outside the React tree (e.g. from server action callbacks).
 */
export interface OnboardingStoreApi {
  /** Re-fetch requirements without restoring the previous selection */
  triggerRefresh: () => void;
  /** Re-fetch and re-select the previously selected requirement */
  triggerRefreshAndRestore: () => void;
  /** Re-fetch, re-select, and expand the new-record accordion */
  triggerAddNewRecord: () => void;
  /** Read a snapshot of the full store state */
  getState: () => OnboardingStore;
}

// ─────────────────────────────────────────────────────────────────────────────
// Slot / render-prop prop shapes
// ─────────────────────────────────────────────────────────────────────────────

/** Props passed to `requirementItemSlot`. onClick(requirementId) so the same stable ref can be passed to every row. */
export interface RequirementItemSlotProps {
  requirement: RequirementItem;
  isSelected: boolean;
  onClick: (requirementId: string) => void;
}

export interface FormContentSlotProps {
  requirement: RequirementItem;
  storeApi: OnboardingStoreApi;
}

export interface FormHeaderActionsSlotProps {
  requirement: RequirementItem;
  storeApi: OnboardingStoreApi;
  /** 'actions' | 'statusRow' — slot returns only that section for layout. */
  section?: 'actions' | 'statusRow';
}

export interface GuidelinesDrawerHandle {
  handleDrawer: (data: { reqForms?: any }) => void;
  closeDrawer: () => void;
}

export interface OnboardingContainerProps {
  layout?: 'three-panel' | 'one-panel';

  /**
   * Tab definitions. Defaults: caas, onb, ofb.
   *   { key: 'caas', label: 'Onboarding' }
   *   { key: 'onb',  label: 'Ongoing'    }
   *   { key: 'ofb',  label: 'Offboarding'}
   * Pass a custom array to override — e.g. a single tab or different labels.
   */
  tabs?: TabConfig[];

  /** Which tab key is active on first render. Defaults to the first tab's key. */
  defaultTab?: string;

  /**
   * Opaque context forwarded to every consumer callback.
   * Typically: { siteId, assignmentId, groupId, … }
   * Changing this value causes a full data re-fetch (treated like a new instance).
   */
  context: OnboardingContext;

  /**
   * Fetch and transform requirement data for the given tab.
   * Called whenever the active tab changes or a workflow triggers a refresh.
   * Return type matches the store's internal shape — no further transformation needed.
   */
  onFetchRequirements: (
    tab: string,
    context: OnboardingContext
  ) => Promise<FetchRequirementsResult>;

  /**
   * Optional: fetch CAAS status dashboard data (expiry, workflow status).
   * Receives the same `tab` as `onFetchRequirements` so implementations can
   * derive the correct userEmail / groupIds from assignmentDetails[tab].
   * If omitted, expiry-related UI is hidden.
   */
  onFetchCAASStatus?: (tab: string, context: OnboardingContext) => Promise<FetchCAASStatusResult>;

  /**
   * Optional: fetch the site-specific due-date offset config.
   * Receives `tab` for consistency with the other data callbacks.
   * If omitted, due dates fall back to startDate with no subtraction.
   */
  onFetchDueDates?: (tab: string, context: OnboardingContext) => Promise<FetchDueDatesResult>;

  /**
   * Rendered above the panel area.
   * Keep consumer-specific headers (BasicDetails, GroupBasicDetails) here.
   * The shared component never renders a header itself.
   */
  headerSlot?: ReactNode;

  /**
   * Custom renderer for each requirement row in the sidebar list.
   * Receives the requirement, its selected state, and an onClick handler.
   * When omitted the built-in row renderer is used (shows name, status badge, due date).
   */
  requirementItemSlot?: (props: RequirementItemSlotProps) => ReactNode;

  /**
   * The form body rendered inside the FormPane for the selected requirement.
   * Typically: <FaasRequirement … />.
   * When omitted, only the shared header area (name, status, description) is shown.
   */
  formContentSlot?: (props: FormContentSlotProps) => ReactNode;

  /**
   * Action controls placed in the FormPane header row.
   * e.g. Status select dropdown, Download button.
   * Kept consumer-side because rubix and network have different controls here.
   */
  formHeaderActionsSlot?: (props: FormHeaderActionsSlotProps) => ReactNode;

  /**
   * Content placed to the right of the tab bar.
   * e.g. Chat/message button.
   */
  topBarActionsSlot?: ReactNode;

  /**
   * Notifies consumers whenever the active tab changes inside the onboarding store.
   * Useful when parent screens need to sync URL/search params or trigger side-effects.
   */
  onTabChange?: (tab: string) => void;

  /**
   * Optional extra panel rendered to the LEFT of the requirement list sidebar.
   * Use for group assignment views that need a people-selector column
   * (students / clinical instructors / school requirements).
   * When present the layout becomes: [personSelector] | [sidebar] | [form].
   */
  personSelectorSlot?: ReactNode;

  /**
   * Header rendered in the top-bar above the `personSelectorSlot` column.
   * Only shown when `personSelectorSlot` is also provided.
   * e.g. a "Students" label that aligns with the left panel.
   */
  personSelectorHeaderSlot?: ReactNode;

  /**
   * Shown in the FormPane when no requirement is selected.
   * Defaults to a "Select a requirement" placeholder.
   */
  emptyStateSlot?: ReactNode;

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Called once after the store initialises.
   * Use the returned handle to call triggerRefresh / triggerAddNewRecord etc.
   * from outside the React tree (e.g. inside a server-action callback).
   */
  onStoreReady?: (api: OnboardingStoreApi) => void;

  /**
   * Called by `RequirementPane` before switching to a new requirement.
   * Return true when the currently visible form has unsaved changes — the pane
   * will show a confirmation dialog and abort the navigation if the user cancels.
   * Typically wired to `RenderFormBuilderHandle.isFormDirty`.
   */
  isDirty?: () => boolean;

  onSaveAndExit?: () => Promise<boolean> | boolean;

  // ── Styling ───────────────────────────────────────────────────────────────
  className?: string;
}
