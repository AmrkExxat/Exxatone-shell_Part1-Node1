/** Internal store types. Consumer-facing types live in ../types.ts. */

export interface RequirementItem {
  requirementId: string;
  name: string;
  required?: boolean;
  descriptions?: string[];
  response?: {
    responseId?: string;
    status?: string;
    /** Workflow metadata returned by CAAS/FAAS */
    worflow?: unknown;
    [key: string]: unknown;
  };
  tags?: {
    /** 'onboarding' | 'ongoing' | 'offboarding' */
    activity?: string;
    dueOn?: string;
    publishOn?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface RequirementGroup {
  /** Display label for the group (e.g. 'Student', 'School', 'Faculty') */
  userType?: string;
  /** The flat list of requirements in this group */
  caasReq: RequirementItem[];
  requirementGroupId?: string;
  [key: string]: unknown;
}

export type CaasStatusMap = Record<
  string,
  {
    workflowStatus?: string;
    /** ISO date string for expiry */
    date?: string;
    [key: string]: unknown;
  }
>;

/** siteId → number-of-days to subtract from startDate */
export type DueDateConfig = Record<string, number>;

export interface TabConfig {
  /** Unique key — used as the URL `?tab=` value */
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export type WorkflowType = 'idle' | 'refresh' | 'refresh_and_restore' | 'add_new_record';

export type DataPhase = 'idle' | 'fetching' | 'ready' | 'error';

export interface PendingWorkflow {
  type: WorkflowType;
  /** requirementId to re-select after data loads (null when type is 'refresh') */
  restoreRequirementId: string | null;
}

export interface OnboardingStoreState {
  selectedRequirement: {
    data: RequirementItem | null;
    isLoading: boolean;
  };

  activeTab: string;
  isFormExpanded: boolean;
  dataPhase: DataPhase;
  requirementGroups: RequirementGroup[];
  requirementCount: number;
  caasStatusMap: CaasStatusMap | null;
  dueDateConfig: DueDateConfig;
  pendingWorkflow: PendingWorkflow;
  shouldExpandNewRecord: boolean;
  selectionRevision: number;
  /** When set, the next refresh-and-restore workflow selects this requirement instead of the current one. */
  restoreRequirementOverride: string | null;
}

export interface OnboardingStoreActions {
  selectRequirement: (req: RequirementItem) => void;
  clearSelectedRequirement: () => void;
  completeRequirementTransition: () => void;
  setActiveTab: (tab: string) => void;

  toggleFormExpanded: () => void;
  setRequirements: (groups: RequirementGroup[], count: number) => void;
  setCaasStatusMap: (map: CaasStatusMap) => void;
  setDueDateConfig: (config: DueDateConfig) => void;
  setDataPhase: (phase: DataPhase) => void;
  triggerRefresh: () => void;
  triggerRefreshAndRestore: () => void;
  triggerAddNewRecord: () => void;
  setRestoreRequirementOverride: (requirementId: string | null) => void;
  consumeWorkflow: () => PendingWorkflow;
  consumeExpandNewRecord: () => void;
}

export type OnboardingStore = OnboardingStoreState & OnboardingStoreActions;
