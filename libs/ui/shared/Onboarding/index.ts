// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export { OnboardingContainer } from './OnboardingContainer';

// ─────────────────────────────────────────────────────────────────────────────
// Store access hooks — for slot components that need store slices
// ─────────────────────────────────────────────────────────────────────────────
export {
  useOnboardingSlice,
  useOnboardingStoreApi,
  useOnboardingSliceSafe,
} from './OnboardingStoreContext';
export type { OnboardingStore } from './OnboardingStoreContext';

// ─────────────────────────────────────────────────────────────────────────────
// Generic store manager — usable for other scoped stores in the codebase
// ─────────────────────────────────────────────────────────────────────────────
export { createScopedStore } from './store/createScopedStore';
export type { ScopedStoreResult } from './store/createScopedStore';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components — for consumers who want to compose their own layouts
// ─────────────────────────────────────────────────────────────────────────────
export { RequirementPane, ReqStatusHeader } from './panes/RequirementPane';
export { FormPane, CommentSection } from './panes/FormPane';
export { RequirementFormPlaceholder } from './panes/RequirementFormPlaceholder';
export { ThreePanelLayout } from './layouts/ThreePanelLayout';
export { OnePanelLayout } from './layouts/OnePanelLayout';

// ─────────────────────────────────────────────────────────────────────────────
// Default slot renderers
// ─────────────────────────────────────────────────────────────────────────────
export { DefaultRequirementItemSlot, DefaultEmptyState } from './DefaultSlotContent';

// ─────────────────────────────────────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────────────────────────────────────
export type {
  // Container
  OnboardingContainerProps,
  OnboardingContext,
  OnboardingStoreApi,
  // Fetch result shapes
  FetchRequirementsResult,
  FetchCAASStatusResult,
  FetchDueDatesResult,
  // Slot prop shapes
  RequirementItemSlotProps,
  FormContentSlotProps,
  FormHeaderActionsSlotProps,
  // Domain types
  RequirementItem,
  RequirementGroup,
  CaasStatusMap,
  DueDateConfig,
  TabConfig,
  GuidelinesDrawerHandle,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Form components — FaasRequirement + supporting drawers (Guidelines are consumer-side)
// ─────────────────────────────────────────────────────────────────────────────
export { FaasRequirement, ReqAuditHistoryDrawer, ArchivedRecordsDrawer } from './components';
export type {
  FaasRequirementProps,
  FaasFormBuilderSlotProps,
  FaasPayloadMeta,
  ReqAuditHistoryDrawerHandle,
  ReqAuditHistoryDrawerProps,
  ArchivedRecordsDrawerHandle,
  ArchivedRecordsDrawerProps,
  FormBuilderSlotProps,
} from './components';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
export { DEFAULT_TABS } from './defaultConfig';
