import { Button, Modal, Select, Skeleton, TextArea, Tooltip } from '../../common';
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { faCircleInfo, faHospitals, faSchool } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MAX_NOTES_LENGTH = 250;

const TITLE_ID = 'cancel-modal-title';
const NOTES_ERROR_ID = 'cancel-notes-error';

const CancelModalAssignment = ({
  group = false,
  completeGroup = false,
  groupData,
  openModal = false,
  setOpenModal,
  cancelOptionsRef,
  onConfirm,
  getSchoolCancelReason,
  getAssignmentsAction,
  tenantId,
  type = 'site',
}: {
  group?: boolean;
  completeGroup?: boolean;
  groupData?: any;
  openModal: boolean;
  setOpenModal: (e: boolean) => void;
  cancelOptionsRef: any;
  onConfirm: (e: any) => void;
  getSchoolCancelReason: any;
  getAssignmentsAction: any;
  tenantId: string;
  type: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<any>({ reason: null, notes: '' });
  const options = useRef<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [grpAssignmentCount, setGrpAssignmentCount] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openModal) {
      setOpen(openModal);
      setTimeout(() => {
        if (typeof window !== 'undefined' && document) {
          document.getElementById('cancel_assignment_cancel').focus();
        }
      }, 100);
      fetchOptions();
    }
  }, [openModal]);

  const fetchOptions = async () => {
    if (groupData?.id && !completeGroup) {
      const res = await getAssignmentsAction(tenantId, {
        groups: [groupData?.id],
      });
      if (res?.data?.length) {
        setGrpAssignmentCount(res.data.length);
      }
    }
    if (options?.current?.length) {
      setLoading(false);
    }
    if (cancelOptionsRef?.current?.[type]?.length) {
      options.current = cancelOptionsRef?.current?.[type] ?? [];
      setLoading(false);
    } else {
      const optionList = await getSchoolCancelReason();
      options.current = optionList;
      if (cancelOptionsRef) {
        cancelOptionsRef.current[type] = optionList;
      }
      setLoading(false);
    }
  };

  const closeCancelModal = () => {
    setOpen(false);
    setReason({ reason: null, notes: '' });
    setGrpAssignmentCount(0);
    setLoading(true);
    setOpenModal(false);
  };

  const notesExceedLimit = reason?.notes?.length > MAX_NOTES_LENGTH;
  const confirmDisabled = !reason?.reason || notesExceedLimit;

  return (
    <Modal open={open} setOpen={closeCancelModal} aria-labelledby={TITLE_ID}>
      <div ref={containerRef} tabIndex={-1} className="flex flex-col gap-2 p-2 outline-none">
        <h2 id={TITLE_ID} className="text-start text-lg font-semibold">
          Cancel Schedule
        </h2>
        <div className="flex flex-col items-start text-sm">
          {group ? (
            <>
              {completeGroup ? (
                <p className="text-gray-600">Cancel all schedules in this group?</p>
              ) : (
                <>
                  <p className="mb-2 flex flex-wrap items-center gap-1">
                    <span>This schedule is part of group:</span>
                    <span className="text-start font-semibold">{groupData?.name}</span>
                  </p>
                  {grpAssignmentCount > 0 && (
                    <p className="flex flex-wrap items-center gap-1">
                      <span>Canceling this will:</span>
                      <span>
                        Reduce group from {grpAssignmentCount} &rarr; {grpAssignmentCount - 1}{' '}
                        schedules
                      </span>
                    </p>
                  )}
                </>
              )}
            </>
          ) : (
            <p className="text-gray-600">Cancel this individual Schedule?</p>
          )}
          <p className={`${group && !completeGroup ? 'mt-4' : 'mt-1'} text-red-600`} role="note">
            This action cannot be undone.
          </p>
        </div>
        {loading ? (
          <div
            className="flex flex-col gap-2 pt-4"
            aria-busy="true"
            aria-label="Loading cancelation options"
          >
            <Skeleton type="custom" lines={2} />
          </div>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <Select
              id="reason"
              testid="reason"
              label="Reason for Cancellation"
              multiple={false}
              name="reason"
              options={options?.current ?? []}
              onChange={(value) => {
                setReason((prev) => {
                  return {
                    ...prev,
                    reason: value ?? null,
                  };
                });
              }}
              placeholder={'Select a reason'}
              aria-required="true"
              fromModal={true}
            />
            {reason?.reason && (
              <TextArea
                id="reason_text"
                placeholder={'Please provide additional details...'}
                name="reason_text"
                value={reason?.notes ?? ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReason((prev) => {
                    return {
                      ...prev,
                      notes: e?.target?.value ?? '',
                    };
                  })
                }
                rows={3}
                className="px-2 py-2"
                aria-describedby={notesExceedLimit ? NOTES_ERROR_ID : undefined}
                aria-invalid={notesExceedLimit || undefined}
                aria-label="Additional notes for cancelation"
              />
            )}
            {notesExceedLimit && (
              <p id={NOTES_ERROR_ID} role="alert" className="text-end text-xs text-red-500">
                Please limit your input to {MAX_NOTES_LENGTH} characters.
              </p>
            )}
          </div>
        )}
        <div className="flex w-full items-center justify-end gap-2 pt-2">
          <Button
            id="cancel_assignment_cancel"
            testid="cancel_assignment_cancel"
            variant="stroked"
            aria-="Close Cancel Assignment"
            className="border-primary text-primary hover:text-primary focus-visible:outline-primary flex flex-row items-center justify-center rounded border px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={closeCancelModal}
          >
            Cancel
          </Button>
          <Button
            id="cancel_assignment_confirmation"
            testid="cancel_assignment_confirmation"
            aria-label="Cancel Assignment confirmation"
            className="focus-visible:outline-primary flex flex-row items-center justify-center rounded bg-[#BB1E1F] px-4 py-1 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            color="warn-900"
            disabled={confirmDisabled}
            aria-disabled={confirmDisabled}
            onClick={() => {
              onConfirm(reason);
              closeCancelModal();
            }}
          >
            Confirm Cancelation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const CancelBannerAssignment = ({
  label = 'This schedule is canceled',
  reason = '',
  date = null,
  by = '',
  email = '',
  note = '',
}: {
  label?: string;
  reason: string;
  date: any;
  by: string;
  email: string;
  note: string;
}) => {
  return (
    <div className="mb-4 flex flex-col gap-1 rounded-md border border-red-400 bg-red-50 px-4 py-2 text-sm text-red-900">
      <div className="mb-1 flex items-center gap-2">
        <div className="text-base font-semibold">{label}</div>
        <div className="rounded-xl bg-gray-200 px-3 text-xs text-gray-900">By {by ?? 'Site'}</div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-1">
          <div>Reason: {reason ? reason : 'Not specified'}</div>
          <div className="min-w-0 wrap-break-word">{note && '(' + note + ')'}</div>
        </div>
      </div>
      <div className="mb-2 flex items-center gap-4">
        <div>
          Canceled on:{' '}
          {date
            ? moment.utc(date).local().format('MMM DD, YYYY HH:mm') +
              ' ' +
              `(${moment.utc(date).format('MMM DD, YYYY HH:mm')} UTC)`
            : 'Not specified'}
        </div>
        <div>Canceled by: {email ? email : 'Not specified'}</div>
      </div>
    </div>
  );
};

export const CancelBannerGrid = ({
  reason = '',
  date = null,
  email = '',
  id = '',
  status = 'Cancelled',
  children,
}: {
  reason: string;
  date: any;
  email: string;
  id: string;
  status: string;
  children: any;
}) => {
  const cancelTootlip = () => {
    return (
      <Tooltip
        triggerElement={() => (
          <FontAwesomeIcon icon={faCircleInfo} className="h-3 w-3 text-gray-600" />
        )}
        tooltip={() => (
          <div className="w-full p-2 text-sm whitespace-break-spaces">
            <div>Reason: {reason ? reason : 'Not specified'}</div>
            <div>Canceled by: {email ? email : 'Not specified'}</div>
            <div>
              Canceled on:{' '}
              {date
                ? moment.utc(date).local().format('MMM DD, YYYY HH:mm') +
                  ' ' +
                  `(${moment.utc(date).format('MMM DD, YYYY HH:mm')} UTC)`
                : 'Not specified'}
            </div>
          </div>
        )}
        tabIndex={0}
        ariaLabel={`Reason for cancellation`}
        id={`cancel-reason-tooltip-${id}`}
      />
    );
  };
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        {children}
        <div>{cancelTootlip()}</div>
      </div>
      <div className="flex items-center gap-0.5 truncate text-xs">
        <FontAwesomeIcon
          icon={status === 'Revoked' ? faSchool : faHospitals}
          className="mb-[2px] h-3 w-3 pr-0.5 text-gray-500"
        />
        <div className="font-semibold text-gray-600">
          {status === 'Revoked' ? 'School:' : 'Site:'}
        </div>
        <div className="truncate text-gray-500">{reason ? reason : 'Not Specified'}</div>
      </div>
    </div>
  );
};

export default CancelModalAssignment;
