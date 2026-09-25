'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { useOnboardingSlice, useOnboardingStoreApi } from '../store/store';
import type { RequirementItem, RequirementGroup } from '../store/types';
import type { RequirementItemSlotProps } from '../types';
import type { RequirementPaneProps } from './pane.types';

const UnsavedChangesDialog = memo(
  ({
    onSaveAndExit,
    onExitWithoutSaving,
    onDismiss,
    loading,
  }: {
    onSaveAndExit: () => void;
    onExitWithoutSaving: () => void;
    onDismiss: () => void;
    loading: boolean;
  }) => (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-changes-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={loading ? undefined : onDismiss}
    >
      <div
        className="bg-card w-full max-w-lg rounded-lg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="unsaved-changes-title" className="mb-2 text-base font-semibold text-gray-900">
          Save Your Progress
        </h2>
        <p className="mb-5 text-sm text-gray-600">
          You have unsaved changes. If you exit now, your work will be lost.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onExitWithoutSaving}
            disabled={loading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            Exit without saving
          </button>
          <button
            type="button"
            onClick={onSaveAndExit}
            disabled={loading}
            className="rounded-md bg-[#1D4ED8] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E40AF] focus:ring-2 focus:ring-[#1D4ED8] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Save and Exit'}
          </button>
        </div>
      </div>
    </div>
  )
);
UnsavedChangesDialog.displayName = 'UnsavedChangesDialog';

const DefaultRequirementRow = memo(
  ({ requirement, isSelected, onClick }: RequirementItemSlotProps) => {
    const handleClick = () => onClick(requirement.requirementId ?? '');
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
        aria-current={isSelected ? 'true' : 'false'}
        className={[
          'focus-visible:outline-primary w-full border-t border-l-4 px-2 py-1 text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-8px]',
          isSelected
            ? 'border-l-primary-500 cursor-pointer border-gray-50 bg-blue-50 shadow-sm'
            : 'bg-card cursor-pointer border-gray-50 border-l-white hover:border-gray-100 hover:bg-gray-100',
        ].join(' ')}
      >
        <span className="text-sm font-medium text-gray-900" role="heading" aria-level={5}>
          <span className="font-semibold">{requirement.name}</span>
          {requirement.required && <span className="ml-1 text-red-600">*</span>}
        </span>
        {requirement.descriptions?.[0] && (
          <div className="mt-1 text-xs text-gray-600">{requirement.descriptions[0]}</div>
        )}
      </div>
    );
  }
);
DefaultRequirementRow.displayName = 'DefaultRequirementRow';

function findRequirementById(
  groups: RequirementGroup[],
  requirementId: string
): RequirementItem | null {
  if (!groups) return null;
  for (const g of groups) {
    const req = g.caasReq?.find((r) => r.requirementId === requirementId);
    if (req) return req;
  }
  return null;
}

const GroupHeader = memo(({ userType }: { userType: string }) => (
  <div className="mt-2 mb-1 flex items-center px-3 text-sm font-semibold text-[#975B00]">
    <h4>For {userType}</h4>
  </div>
));
GroupHeader.displayName = 'GroupHeader';

const RequirementPane = memo(
  ({ groups, itemSlot, isPaid = true, dirtyCheck, onSaveAndExit }: RequirementPaneProps) => {
    const selectedId = useOnboardingSlice(
      (s) => s.selectedRequirement.data?.requirementId ?? null,
      (a, b) => a === b
    );
    const storeApi = useOnboardingStoreApi();
    const groupsRef = useRef(groups);
    groupsRef.current = groups;

    const [pendingReq, setPendingReq] = useState<RequirementItem | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleClickById = useCallback(
      (requirementId: string) => {
        if (!isPaid) return;
        const req = findRequirementById(groupsRef.current, requirementId);
        if (!req) return;

        const dirty = dirtyCheck?.() ?? false;

        if (dirty) {
          setPendingReq(req);
          return;
        }
        storeApi.getState().selectRequirement(req);
      },
      [isPaid, storeApi, dirtyCheck]
    );

    const discardAndSelect = useCallback(() => {
      if (!pendingReq) return;
      storeApi.getState().selectRequirement(pendingReq);
      setPendingReq(null);
    }, [pendingReq, storeApi]);

    const dismissDialog = useCallback(() => {
      if (saveLoading) return;
      setPendingReq(null);
    }, [saveLoading]);

    const saveAndSelect = useCallback(async () => {
      if (!pendingReq || !onSaveAndExit) return;
      const targetRequirementId = pendingReq.requirementId ?? null;
      setSaveLoading(true);
      try {
        storeApi.getState().setRestoreRequirementOverride(targetRequirementId);
        const didSave = await Promise.resolve(onSaveAndExit());
        if (!didSave) {
          storeApi.getState().setRestoreRequirementOverride(null);
          return;
        }
        setPendingReq(null);
      } catch (error) {
        storeApi.getState().setRestoreRequirementOverride(null);
        console.error('[RequirementPane] save before exit failed', error);
      } finally {
        setSaveLoading(false);
      }
    }, [pendingReq, onSaveAndExit, storeApi]);

    if (!groups || groups.length === 0) return null;

    return (
      <>
        {pendingReq && (
          <UnsavedChangesDialog
            onSaveAndExit={() => {
              void saveAndSelect();
            }}
            onExitWithoutSaving={discardAndSelect}
            onDismiss={dismissDialog}
            loading={saveLoading}
          />
        )}
        {groups.map((group: RequirementGroup, groupIdx: number) => {
          if (!group.caasReq?.length) return null;

          return (
            <div key={group.requirementGroupId ?? groupIdx}>
              {group.userType && <GroupHeader userType={group.userType} />}

              <div role="list">
                {group.caasReq.map((req: RequirementItem, reqIdx: number) => {
                  const isSelected = req.requirementId === selectedId;
                  const slotProps: RequirementItemSlotProps = {
                    requirement: req,
                    isSelected,
                    onClick: handleClickById,
                  };

                  return (
                    <div
                      key={req.requirementId ?? reqIdx}
                      role="listitem"
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {itemSlot ? itemSlot(slotProps) : <DefaultRequirementRow {...slotProps} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }
);
RequirementPane.displayName = 'RequirementPane';

const TITLE_BY_TAB: Record<string, string> = {
  caas: 'Onboarding Requirements',
  onb: 'Ongoing Activities',
  ofb: 'Offboarding Activities',
};

const MANDATORY_LEGEND_BY_TAB: Record<string, string> = {
  caas: '* Mandatory - Requirement',
  onb: '* Mandatory Activity',
  ofb: '* Mandatory Activity',
};

interface ReqStatusHeaderProps {
  activeTab?: string;
  title?: string;
  mandatoryLegendText?: string;
  layout?: 'row' | 'column';
}

const ReqStatusHeader = memo(
  ({
    activeTab,
    title,
    mandatoryLegendText = '* Mandatory Requirement',
    layout: _layout,
  }: ReqStatusHeaderProps) => {
    const count = useOnboardingSlice(
      (s) => s.requirementCount,
      (a, b) => a === b
    );
    const resolvedTitle =
      title ?? (activeTab ? (TITLE_BY_TAB[activeTab] ?? 'Requirements') : 'Requirements');
    const resolvedMandatory =
      mandatoryLegendText ??
      (activeTab
        ? (MANDATORY_LEGEND_BY_TAB[activeTab] ?? '* Mandatory Requirement')
        : '* Mandatory Requirement');

    return (
      <div>
        <div className="flex items-center justify-between md:flex-row md:justify-between">
          <div className="flex items-center justify-between md:flex-row md:justify-between">
            <div className="text-[14px] font-semibold text-[#262626]" role="heading" aria-level={3}>
              {resolvedTitle}
            </div>
            <div className="text-md ml-2 rounded-lg bg-[#EBEEF3] p-1 font-light">{count}</div>
          </div>
          <div
            className="flex items-center space-x-1 text-xs font-semibold text-red-400"
            aria-label={resolvedMandatory}
          >
            <span>{resolvedMandatory}</span>
          </div>
        </div>
      </div>
    );
  }
);
ReqStatusHeader.displayName = 'ReqStatusHeader';

export { RequirementPane, ReqStatusHeader };
