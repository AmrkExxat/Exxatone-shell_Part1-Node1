'use client';

import React, { type ReactNode, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Drawer } from '../../../components/layout';
import { Skeleton } from '../../../components/common';

export interface ArchivedRecordsDrawerHandle {
  handleDrawer: (data: { requirement: any; assignmentData: any; archivedRecords: any[] }) => void;
  closeDrawer: () => void;
}

export interface FormBuilderSlotProps {
  requirement: any;
  requirementResult: any;
  responseResult: any;
  /** Pass-through from the parent RenderFormBuilder contract */
  caasResponsePayload?: (rawResponse: any, isSubmit: boolean) => void;
  isViewOnly?: boolean;
  forceDisabled?: boolean;
  declineButtonId?: string;
  saveButtonId?: string;
  submitButtonId?: string;
  reqLoading?: boolean;
}

export interface ArchivedRecordsDrawerProps {
  siteId: string | null | undefined;
  /**
   * Inject the API call to load a single requirement's definition.
   * Equivalent to `complianceRequirementAction(requirementId, siteId)`.
   */
  onFetchRequirementData: (requirementId: string, siteId: string) => Promise<any>;
  /**
   * Slot: render the form builder for a given archived record.
   * Receives the same props as the consumer's RenderFormBuilder component.
   */
  renderFormBuilder: (props: FormBuilderSlotProps) => ReactNode;
}

interface DrawerState {
  open: boolean;
  requirement: any;
  assignmentData: any;
  archivedRecords: any[];
}

const INITIAL_STATE: DrawerState = {
  open: false,
  requirement: null,
  assignmentData: null,
  archivedRecords: [],
};

const FORM_TYPES = ['vaccine', 'titer', 'custom', 'decline', 'bloodTest', 'chestXray'];

const ArchivedRecordsDrawer = React.forwardRef<
  ArchivedRecordsDrawerHandle,
  ArchivedRecordsDrawerProps
>(({ siteId, onFetchRequirementData, renderFormBuilder }, ref) => {
  const [state, setState] = useState<DrawerState>(INITIAL_STATE);
  const [expandedRecords, setExpandedRecords] = useState<Set<number>>(new Set([0]));
  const [recordsData, setRecordsData] = useState<
    Map<number, { reqForms: any; cassResponse: any; loading: boolean }>
  >(new Map());

  React.useImperativeHandle(ref, () => ({
    handleDrawer(data) {
      setState({
        open: true,
        requirement: data.requirement,
        assignmentData: data.assignmentData,
        archivedRecords: data.archivedRecords ?? [],
      });
      setExpandedRecords(new Set([0]));
      setRecordsData(new Map());
    },
    closeDrawer() {
      setState(INITIAL_STATE);
      setExpandedRecords(new Set());
      setRecordsData(new Map());
    },
  }));

  useEffect(() => {
    if (!state.open || !state.archivedRecords.length) return;
    expandedRecords.forEach((index) => {
      if (!recordsData.has(index)) fetchRecordData(index);
    });
  }, [state.open, state.archivedRecords, expandedRecords]);

  const fetchRecordData = async (index: number) => {
    const record = state.archivedRecords[index];
    if (!record || siteId == null) return;

    setRecordsData((prev) =>
      new Map(prev).set(index, { reqForms: null, cassResponse: null, loading: true })
    );

    try {
      const requirementResult = await onFetchRequirementData(
        record.requirementId,
        siteId as string
      );

      const responseResult: Record<string, any> = {};
      FORM_TYPES.forEach((ft) => {
        if (record[ft]) responseResult[ft] = record[ft];
      });
      responseResult.workflowStatus = record.workflowStatus;
      responseResult.workflowComment = record.workflowComment;

      setRecordsData((prev) =>
        new Map(prev).set(index, {
          reqForms: { data: requirementResult },
          cassResponse: responseResult,
          loading: false,
        })
      );
    } catch {
      setRecordsData((prev) =>
        new Map(prev).set(index, { reqForms: null, cassResponse: null, loading: false })
      );
    }
  };

  const toggleRecord = (index: number) => {
    setExpandedRecords((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <Drawer
      drawerOpen={state.open}
      size="large"
      drawer={{
        title: 'Archived Records',
        onClose: () => {
          setState(INITIAL_STATE);
          setExpandedRecords(new Set());
          setRecordsData(new Map());
        },
      }}
      actionButtons={null}
      closeButtonTitle="Close"
    >
      <div className="h-full overflow-y-auto p-4">
        {state.archivedRecords.length > 0 ? (
          <div className="space-y-4">
            {state.archivedRecords.map((record: any, index: number) => {
              const archivedDate = record.archivedAt
                ? moment(record.archivedAt).format('MMM DD, YYYY')
                : 'Unknown Date';
              const isExpanded = expandedRecords.has(index);
              const recordData = recordsData.get(index);

              return (
                <div
                  key={index}
                  className={classNames(
                    'overflow-hidden rounded-lg border border-gray-200',
                    isExpanded && 'shadow-md'
                  )}
                >
                  <div
                    className="flex cursor-pointer items-center justify-between bg-gray-50 p-4 hover:bg-gray-100"
                    onClick={() => toggleRecord(index)}
                    role="button"
                    aria-expanded={isExpanded}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleRecord(index);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Record {index + 1}</div>
                      <div className="text-sm text-gray-600">
                        {archivedDate} • {record.workflowStatus ?? 'Unknown'}
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={classNames(
                        'h-5 w-5 text-gray-600 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="bg-card p-4">
                      {recordData?.loading ? (
                        <Skeleton />
                      ) : recordData?.reqForms?.data ? (
                        renderFormBuilder({
                          requirement: {
                            requirementId: record.requirementId,
                            name: state.requirement?.name ?? 'Archived Requirement',
                            response: {
                              responseId: record.responseId,
                              status: record.workflowStatus,
                              workflowComment: record.workflowComment,
                              carryForwardIds: record.carryForwardIds ?? [],
                            },
                          },
                          requirementResult: recordData.reqForms.data,
                          responseResult: recordData.cassResponse,
                          isViewOnly: true,
                        })
                      ) : (
                        <div className="py-4 text-center text-gray-500">
                          Failed to load record data
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>No archived records found</p>
          </div>
        )}
      </div>
    </Drawer>
  );
});

ArchivedRecordsDrawer.displayName = 'ArchivedRecordsDrawer';

export default ArchivedRecordsDrawer;
