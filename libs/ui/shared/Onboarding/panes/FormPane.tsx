'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useOnboardingSlice, useOnboardingStoreApi } from '../store/store';
import type { RequirementItem } from '../store/types';
import type { FormPaneProps } from './pane.types';
import { RequirementFormPlaceholder } from './RequirementFormPlaceholder';
import { CommentSection } from './CommentSection';

interface FormPaneContentProps {
  requirement: RequirementItem;
  isLoading: boolean;
  formContentSlot?: FormPaneProps['formContentSlot'];
  formHeaderActionsSlot?: FormPaneProps['formHeaderActionsSlot'];
  storeApi: FormPaneProps['storeApi'];
}

const FormPaneContent = memo(
  ({
    requirement,
    isLoading,
    formContentSlot,
    formHeaderActionsSlot,
    storeApi,
  }: FormPaneContentProps) => {
    const onboardingStoreApi = useOnboardingStoreApi();

    const [commentSectionOpen, setCommentSectionOpen] = useState(false);
    const [commentWarning, setCommentWarning] = useState('');
    const [commentRequired, setCommentRequired] = useState(false);
    const [pendingConfirm, setPendingConfirm] = useState<((comment: string) => void) | null>(null);

    const openCommentSection = useCallback(
      (
        warning: string,
        onConfirm: (comment: string) => void,
        options?: { commentRequired?: boolean }
      ) => {
        setCommentWarning(warning);
        setCommentRequired(options?.commentRequired ?? false);
        setPendingConfirm(() => onConfirm);
        setCommentSectionOpen(true);
      },
      []
    );

    const augmentedStoreApi = useMemo(
      () => ({ ...storeApi, openCommentSection }),
      [storeApi, openCommentSection]
    );

    useEffect(() => {
      if (isLoading) {
        onboardingStoreApi.getState().completeRequirementTransition();
      }
    }, [requirement?.requirementId, isLoading, onboardingStoreApi]);

    if (isLoading) {
      return <RequirementFormPlaceholder variant="loading" />;
    }

    return (
      <>
        <div className="flex-shrink-0 border-b border-gray-200 px-3 py-2">
          <div className="flex flex-wrap items-start gap-2">
            <div className="mt-2 flex min-w-[250px] flex-1 flex-col">
              <div
                className="line-clamp-2 text-[14px] font-semibold break-words text-gray-900"
                title={requirement.name}
              >
                {requirement.name}
              </div>
              {requirement.descriptions?.[0] && (
                <p className="line-clamp-2 text-xs text-gray-600">{requirement.descriptions[0]}</p>
              )}
            </div>

            {/* Actions column + Expand column (main: slot returns two siblings — flex min-w-[250px] flex-1... and flex flex-none items-start justify-end) */}
            {formHeaderActionsSlot &&
              formHeaderActionsSlot({
                requirement,
                storeApi: augmentedStoreApi as any,
                section: 'actions',
              })}
          </div>
          {formHeaderActionsSlot && (
            <div className="flex w-full flex-row items-start justify-start gap-2">
              {formHeaderActionsSlot({
                requirement,
                storeApi: augmentedStoreApi as any,
                section: 'statusRow',
              })}
            </div>
          )}
        </div>

        {/* ── Form body ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-2 py-0">
          {formContentSlot
            ? formContentSlot({ requirement, storeApi: augmentedStoreApi as any })
            : null}
        </div>

        <CommentSection
          isOpen={commentSectionOpen}
          warningText={commentWarning}
          commentRequired={commentRequired}
          onClose={() => {
            setCommentSectionOpen(false);
            setPendingConfirm(null);
            setCommentWarning('');
            setCommentRequired(false);
          }}
          onConfirm={(comment) => {
            pendingConfirm?.(comment);
            setCommentSectionOpen(false);
            setPendingConfirm(null);
            setCommentWarning('');
            setCommentRequired(false);
          }}
        />
      </>
    );
  }
);
FormPaneContent.displayName = 'FormPaneContent';

const FormPane = memo(
  ({ formContentSlot, formHeaderActionsSlot, emptyStateSlot, storeApi }: FormPaneProps) => {
    const requirement = useOnboardingSlice(
      (s) => s.selectedRequirement.data,
      (a, b) => a === b
    );
    const isLoading = useOnboardingSlice(
      (s) => s.selectedRequirement.isLoading,
      (a, b) => a === b
    );
    if (!requirement && !isLoading) {
      return (
        <div className="flex h-full flex-col overflow-hidden">
          {emptyStateSlot ?? <RequirementFormPlaceholder variant="empty" />}
        </div>
      );
    }

    if (isLoading && !requirement) {
      return (
        <div className="flex h-full flex-col overflow-hidden">
          <RequirementFormPlaceholder variant="loading" />
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col overflow-hidden">
        <FormPaneContent
          requirement={requirement!}
          isLoading={isLoading}
          formContentSlot={formContentSlot}
          formHeaderActionsSlot={formHeaderActionsSlot}
          storeApi={storeApi}
        />
      </div>
    );
  }
);
FormPane.displayName = 'FormPane';

export { FormPane, CommentSection };
