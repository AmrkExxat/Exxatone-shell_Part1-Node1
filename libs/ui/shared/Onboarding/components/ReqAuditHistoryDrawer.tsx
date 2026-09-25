'use client';

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Drawer } from '../../../components/layout';
import { ResponseAuditHistory } from '../../AuditHistory';

export interface ReqAuditHistoryDrawerHandle {
  handleDrawer: (data: {
    requirement: any;
    assignmentData: any;
    requirementCoversEntirePlacement?: boolean;
  }) => void;
  closeDrawer: () => void;
}

export interface ReqAuditHistoryDrawerProps {
  /** siteId used when fetching audit history */
  siteId: string | null | undefined;
  /**
   * Inject the API call.
   * Should call something like `getResponseAuditHistoryById(responseId, siteId)`.
   */
  onFetchAuditHistory: (responseId: string, siteId: string) => Promise<any>;
}

interface DrawerState {
  open: boolean;
  requirement: any;
  assignmentData: any;
  requirementCoversEntirePlacement: boolean;
}

const INITIAL_STATE: DrawerState = {
  open: false,
  requirement: null,
  assignmentData: null,
  requirementCoversEntirePlacement: false,
};

const ReqAuditHistoryDrawer = React.forwardRef<
  ReqAuditHistoryDrawerHandle,
  ReqAuditHistoryDrawerProps
>(({ siteId, onFetchAuditHistory }, ref) => {
  const [state, setState] = useState<DrawerState>(INITIAL_STATE);
  const [responseHistory, setResponseHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useImperativeHandle(ref, () => ({
    handleDrawer(data) {
      setState({
        open: true,
        requirement: data.requirement,
        assignmentData: data.assignmentData,
        requirementCoversEntirePlacement: data.requirementCoversEntirePlacement ?? false,
      });
    },
    closeDrawer() {
      setState(INITIAL_STATE);
    },
  }));

  useEffect(() => {
    if (!state.open || !state.requirement || siteId == null) return;

    const responseId = state.requirement?.response?.responseId;
    if (!responseId) return;

    setLoading(true);
    onFetchAuditHistory(responseId, siteId as string)
      .then((response) => {
        if (!response) {
          setResponseHistory(null);
          return;
        }

        const assignmentEndDate = state.assignmentData?.endDate
          ? moment(state.assignmentData.endDate)
          : null;

        if (!assignmentEndDate) {
          setResponseHistory(response);
          return;
        }

        const filtered = { ...response };

        if (Array.isArray(filtered.statusUpdates)) {
          filtered.statusUpdates = filtered.statusUpdates.filter((update: any) => {
            const date = moment(update?.updatedOn || update?.timestamp);
            const isBeforeEnd = date.isSameOrBefore(assignmentEndDate, 'day');
            if (state.requirementCoversEntirePlacement) {
              const isExpiring = update?.status?.trim()?.toLowerCase() === 'expiring';
              return isBeforeEnd && !isExpiring;
            }
            return isBeforeEnd;
          });
        }

        if (Array.isArray(filtered.generalAudits)) {
          filtered.generalAudits = filtered.generalAudits.filter((audit: any) => {
            const date = moment(audit?.actionTakenOn || audit?.timestamp);
            const isBeforeEnd = date.isSameOrBefore(assignmentEndDate, 'day');
            if (state.requirementCoversEntirePlacement) {
              const status = audit?.status?.trim()?.toLowerCase();
              const action = audit?.action?.trim()?.toLowerCase();
              const isExpiring = status === 'expiring' || action === 'expiring';
              return isBeforeEnd && !isExpiring;
            }
            return isBeforeEnd;
          });
        }

        setResponseHistory(filtered);
      })
      .catch((err) => {
        console.error('Failed to fetch response audit history', err);
        setResponseHistory(null);
      })
      .finally(() => setLoading(false));
  }, [state.open, state.requirement, siteId]);

  return (
    <Drawer
      drawerOpen={state.open}
      size="small"
      drawer={{
        title: 'Status History',
        onClose: () => setState(INITIAL_STATE),
      }}
    >
      <ResponseAuditHistory loading={loading} responseHistory={responseHistory} />
    </Drawer>
  );
});

ReqAuditHistoryDrawer.displayName = 'ReqAuditHistoryDrawer';

export default ReqAuditHistoryDrawer;
