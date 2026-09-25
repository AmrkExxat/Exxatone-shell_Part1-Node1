'use client';

import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { Button } from '../../../components/common';
import { Skeleton } from '../../../components/common';
import type { GuidelinesDrawerHandle } from '../types';
import ReqAuditHistoryDrawer, { type ReqAuditHistoryDrawerHandle } from './ReqAuditHistoryDrawer';
import ArchivedRecordsDrawer, {
  type ArchivedRecordsDrawerHandle,
  type FormBuilderSlotProps,
} from './ArchivedRecordsDrawer';
import type { OnboardingStoreApi } from '../types';
import { useOnboardingSlice, useOnboardingStoreApi } from '../store/store';

/** Mirrors the RenderFormBuilder component's public API */
export interface FaasFormBuilderSlotProps extends FormBuilderSlotProps {
  caasResponsePayload: (rawResponse: any, isSubmit: boolean) => void;
  /**
   * True when the store has signalled "a new record was just added — expand the
   * first accordion".  Injected by FaasRequirement so that the form-builder
   * slot component (RenderFormBuilder → Form) stays free of store coupling.
   */
  shouldExpandFirst?: boolean;
  /** Call this once the accordion has been expanded to clear the store flag. */
  onExpandConsumed?: () => void;
}

/**
 * Payload meta computed by the consumer.
 * Consumers own business-logic differences (faculty vs admin, school name, etc.)
 */
export interface FaasPayloadMeta {
  action: string;
  userType: string;
  additionalInfo: Record<string, any>;
}

export interface FaasRequirementProps {
  requirement: any;
  assignmentData: any;
  assignmentGroupId?: string;
  archivedRecords?: any[];
  siteId: string | null | undefined;

  /**
   * Pre-computed expiration details.
   * Consumers are responsible for deriving this from CAAS status maps or other
   * sources before passing it in.  FaasRequirement itself does no derivation.
   */
  expirationDetails?: {
    date?: string;
    workflowStatus?: string;
    [key: string]: any;
  } | null;

  /**
   * When true, the "Add new record" button is shown (consumer computes from
   * expiration state, assignment end date, permissions, etc.).
   */
  showAddNewRecordButton?: boolean;
  forceDisabled?: boolean;
  reqLoading?: boolean;
  declineButtonId?: string;
  saveButtonId?: string;
  submitButtonId?: string;

  /**
   * Provided by `formContentSlot({ requirement, storeApi })`.
   * Used to trigger refresh / add-new-record workflow after archiving.
   */
  storeApi: OnboardingStoreApi;

  /**
   * Ref to the audit history drawer so that `formHeaderActionsSlot` in the
   * consumer can also open it imperatively via `ref.current.handleDrawer(...)`.
   */
  reqAuditHistoryDrawerRef?: RefObject<ReqAuditHistoryDrawerHandle | null>;
  /**
   * Ref to the guidelines drawer so that `formHeaderActionsSlot` can also
   * open it imperatively.
   */
  guidelinesDrawerRef?: RefObject<GuidelinesDrawerHandle | null>;

  onFetchRequirementData: (requirementId: string, siteId: string) => Promise<any>;
  onFetchResponseData: (responseId: string, siteId: string) => Promise<any>;
  onFetchArchivedResponse: (
    archivedRecordId: string,
    formattedAssignmentId: string,
    siteId: string
  ) => Promise<any>;
  /**
   * Inject the audit history fetch call.
   * e.g. `(responseId, siteId) => getResponseAuditHistoryById(responseId, siteId)`
   */
  onFetchAuditHistory: (responseId: string, siteId: string) => Promise<any>;
  /** Called whenever the workflow comment is loaded/changed. */
  onSetComment?: (comment: string) => void;

  /**
   * Consumer provides the formatted assignment ID used for fetching archived response.
   * App-specific (e.g. assignmentId + ':std' | ':fac' | ':grp').
   */
  getFormattedAssignmentId: (assignmentData: any, assignmentGroupId?: string) => string | undefined;

  /** Consumer builds the CAAS payload and submits it (API call, then triggerRefreshAndRestore on submit).
   * Shared UI only passes rawResponse + context; all payload shape and API logic lives in the app.
   */
  onBuildAndSubmitCaasPayload: (params: {
    rawResponse: any;
    isSubmit: boolean;
    reqFormsData: any;
    requirement: any;
    assignmentData: any;
  }) => Promise<void>;

  /**
   * Consumer runs the full "add new record" flow: fetch status, split ids, archive, then triggerAddNewRecord.
   * Shared UI only opens the modal and calls this on confirm.
   */
  onConfirmAddNewRecord: (params: { requirement: any; siteId: string }) => Promise<void>;

  /** Render the requirement's form using the consumer's RenderFormBuilder. */
  renderFormBuilder: (props: FaasFormBuilderSlotProps) => ReactNode;
  /** Used by GuidelinesComponent and GuidelinesDrawer to fetch file attachments. */
  onFetchFiles: (collectionId: string) => Promise<any[]>;
  /** Optional slot for rendering fetched file attachments inside guidelines. */
  renderFiles?: (files: any[], collectionId: string) => ReactNode;

  /**
   * Optional slot to render the guidelines panel (consumer-owned; uses client-side JSON/data).
   * When provided, receives guidelinesData from reqForms?.data?.guidelines.
   * When omitted, the guidelines panel is not shown.
   */
  renderGuidelinesPanel?: (guidelinesData: any) => ReactNode;

  /**
   * Optional. When provided, determines whether the guidelines panel is visible.
   * When omitted, default is: show if guidelinesData has any of clinicalInstructor/templates/reviewer/student non-empty.
   */
  shouldShowGuidelinesPanel?: (guidelinesData: any) => boolean;
}

const FaasRequirement = ({
  requirement,
  assignmentData,
  assignmentGroupId,
  archivedRecords = [],
  siteId,
  expirationDetails: _expirationDetails,
  showAddNewRecordButton = false,
  forceDisabled,
  reqLoading,
  declineButtonId,
  saveButtonId,
  submitButtonId,
  storeApi: _storeApi,
  reqAuditHistoryDrawerRef,
  guidelinesDrawerRef: _guidelinesDrawerRef,
  onFetchRequirementData,
  onFetchResponseData,
  onFetchArchivedResponse,
  onFetchAuditHistory,
  onSetComment,
  getFormattedAssignmentId,
  onBuildAndSubmitCaasPayload,
  onConfirmAddNewRecord,
  renderFormBuilder,
  onFetchFiles: _onFetchFiles,
  renderFiles: _renderFiles,
  renderGuidelinesPanel,
  shouldShowGuidelinesPanel,
}: FaasRequirementProps) => {
  const [fetchResult, setFetchResult] = useState<{ reqForms: any; cassResponse: any } | null>(null);

  const reqForms = fetchResult?.reqForms ?? null;

  const cassResponse = fetchResult?.cassResponse ?? null;

  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);

  const archivedRecordsDrawerRef = useRef<ArchivedRecordsDrawerHandle>(null);

  const assignmentDataRef = useRef(assignmentData);

  const assignmentGroupIdRef = useRef(assignmentGroupId);

  assignmentDataRef.current = assignmentData;

  assignmentGroupIdRef.current = assignmentGroupId;

  const shouldExpandNewRecord = useOnboardingSlice(
    (s) => s.shouldExpandNewRecord,
    (a, b) => a === b
  );

  const selectionRevision = useOnboardingSlice(
    (s) => s.selectionRevision,
    (a, b) => a === b
  );
  const onboardingStoreApi = useOnboardingStoreApi();

  const consumeExpandNewRecord = useCallback(() => {
    onboardingStoreApi.getState().consumeExpandNewRecord();
  }, [onboardingStoreApi, requirement?.requirementId]);

  useEffect(() => {
    if (!requirement || isEmpty(requirement)) return;
    if (!siteId) return;

    setFetchResult(null);

    const isArchived = requirement?.response?.isArchived;
    const formattedId = getFormattedAssignmentId(
      assignmentDataRef.current,
      assignmentGroupIdRef.current
    );

    const responsePromise =
      isArchived && formattedId
        ? onFetchArchivedResponse(
            requirement.response.archivedRecordId,
            formattedId,
            siteId as string
          )
        : onFetchResponseData(requirement.response?.responseId, siteId as string);

    Promise.allSettled([
      onFetchRequirementData(requirement.requirementId, siteId as string),
      responsePromise,
    ])
      .then(([reqResult, resResult]) => {
        const reqData = reqResult.status === 'fulfilled' ? reqResult.value : null;
        const resData = resResult.status === 'fulfilled' ? resResult.value : null;
        setFetchResult({ reqForms: { data: reqData }, cassResponse: resData });
        onSetComment?.(resData?.workflowComment ?? '');
      })
      .catch((err) => {
        console.error('[FaasRequirement] fetch catch', err);
      });
  }, [
    requirement?.requirementId,
    requirement?.response?.responseId,
    requirement?.response?.isArchived,
    requirement?.response?.archivedRecordId,
    selectionRevision,
    siteId,
    getFormattedAssignmentId,
    onFetchRequirementData,
    onFetchResponseData,
    onFetchArchivedResponse,
    onSetComment,
  ]);

  const caasResponsePayload = useCallback(
    (rawResponse: any, isSubmit: boolean) =>
      onBuildAndSubmitCaasPayload({
        rawResponse,
        isSubmit,
        reqFormsData: reqForms?.data,
        requirement,
        assignmentData,
      }),
    [reqForms?.data, requirement, assignmentData, onBuildAndSubmitCaasPayload]
  );

  const handleConfirmAddRecord = useCallback(async () => {
    try {
      await onConfirmAddNewRecord({ requirement, siteId: siteId as string });
      setOpenAddRecordModal(false);
    } catch (err) {
      console.error('Error in add new record flow:', err);
      setOpenAddRecordModal(false);
    }
  }, [requirement, siteId, onConfirmAddNewRecord]);

  const guidelinesData = useMemo(() => reqForms?.data?.guidelines, [reqForms?.data]);
  const showGuidelinesPanel =
    !!renderGuidelinesPanel &&
    (shouldShowGuidelinesPanel
      ? shouldShowGuidelinesPanel(guidelinesData)
      : !guidelinesData ||
        (guidelinesData.clinicalInstructor && !isEmpty(guidelinesData.clinicalInstructor)) ||
        (guidelinesData.templates && !isEmpty(guidelinesData.templates)) ||
        (guidelinesData.reviewer && !isEmpty(guidelinesData.reviewer)) ||
        (guidelinesData.student && !isEmpty(guidelinesData.student)));

  return (
    <>
      {!reqForms ? (
        <Skeleton type="default" lines={3} />
      ) : (
        <div className="my-2">
          {/* ── Action bar ──────────────────────────────────────────────── */}
          <div className="mb-4 flex flex-row items-center justify-end gap-2">
            {archivedRecords.length > 0 && (
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  archivedRecordsDrawerRef.current?.handleDrawer({
                    requirement,
                    assignmentData,
                    archivedRecords,
                  })
                }
              >
                Archived Records
              </Button>
            )}
            {showAddNewRecordButton && (
              <Button
                type="button"
                variant="stroked"
                className="flex flex-row items-center justify-center gap-2"
                onClick={() => setOpenAddRecordModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add new record</span>
              </Button>
            )}
          </div>

          {/* ── Content grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-12 gap-2">
            {showGuidelinesPanel && renderGuidelinesPanel && (
              <div className="col-span-12 md:col-span-4">
                <div className="rounded-lg border border-[#EBEEF3] bg-[#F7F8F8] px-4 py-5 text-sm break-words text-[#262626]">
                  <div className="mb-2 border-b pb-4 font-bold" role="heading" aria-level={5}>
                    Guidelines
                  </div>
                  {renderGuidelinesPanel(guidelinesData)}
                </div>
              </div>
            )}

            <div className={showGuidelinesPanel ? 'col-span-12 md:col-span-8' : 'col-span-12'}>
              {reqForms?.data &&
                renderFormBuilder({
                  requirement,
                  requirementResult: reqForms.data,
                  responseResult: cassResponse,
                  caasResponsePayload,
                  isViewOnly: requirement?.response?.isArchived === true,
                  forceDisabled,
                  declineButtonId,
                  saveButtonId,
                  submitButtonId,
                  reqLoading,
                  shouldExpandFirst: shouldExpandNewRecord,
                  onExpandConsumed: consumeExpandNewRecord,
                })}
            </div>
          </div>
        </div>
      )}

      {/* ── Add new record confirmation modal ───────────────────────────── */}
      {openAddRecordModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-record-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-xl">
            <div className="mb-4">
              <div id="add-record-title" className="mb-2 text-lg font-semibold">
                Add New Record
              </div>
              <p className="text-[16px] text-gray-700">Are you sure you want to add new record?</p>
              <p className="mt-2 text-[16px] text-gray-700">
                We will archive the approved records permanently
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="stroked" onClick={() => setOpenAddRecordModal(false)}>
                Not Now
              </Button>
              <Button
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                variant="flat"
                color="primary"
                onClick={handleConfirmAddRecord}
                aria-label="Add Record"
                id="add_record_confirm_btn"
              >
                Add Record
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Drawers ──────────────────────────────────────────────────────── */}
      <ReqAuditHistoryDrawer
        ref={reqAuditHistoryDrawerRef}
        siteId={siteId}
        onFetchAuditHistory={onFetchAuditHistory}
      />
      <ArchivedRecordsDrawer
        ref={archivedRecordsDrawerRef}
        siteId={siteId}
        onFetchRequirementData={onFetchRequirementData}
        renderFormBuilder={(props) =>
          renderFormBuilder({
            ...props,
            caasResponsePayload: props.caasResponsePayload ?? (() => {}),
          })
        }
      />
    </>
  );
};

export default FaasRequirement;
