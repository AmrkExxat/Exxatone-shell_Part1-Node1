'use client';

import moment from 'moment';
import { Skeleton } from '../../components/common';
import RenderResponseStatus from './RenderResponseStatus';

const ResponseAuditHistory = ({
  loading,
  responseHistory,
}: {
  loading: boolean;
  responseHistory: any;
}) => {
  return (
    <div className="flex flex-col">
      {loading ? (
        <Skeleton />
      ) : (
        <>
          {responseHistory?.statusUpdates === undefined ||
          responseHistory?.statusUpdates === null ||
          responseHistory?.statusUpdates?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-sm">
              No audit history available. This onboarding requirement was created before audit
              tracking was introduced.
            </div>
          ) : (
            <div className="flex flex-col gap-4 pb-4">
              {responseHistory?.statusUpdates
                ?.slice()
                ?.reverse()
                ?.map((update: any, index: number) => {
                  return (
                    <div className="bg-card flex flex-col rounded-md border" key={index}>
                      <div className="flex flex-row items-center justify-between border-b p-2 text-sm">
                        <div className="flex flex-col items-center justify-center rounded-md px-2 py-1 font-semibold">
                          <RenderResponseStatus
                            label={
                              update?.status?.length > 0
                                ? update?.status?.trim()?.toLowerCase() === 'in-progress'
                                  ? 'review-in-progress'
                                  : update?.status?.trim()?.toLowerCase() === 'getstarted'
                                    ? 'getstarted'
                                    : update?.status
                                : 'new'
                            }
                          />
                        </div>
                        <div>{moment(update?.updatedOn).format('MMM D, YYYY - h:mm A')}</div>
                      </div>
                      <div className="flex flex-col gap-3 p-4">
                        {update?.comment ||
                          (update?.reason && (
                            <div className="flex flex-col text-sm">
                              <span className="font-semibold">Reason</span>
                              <span>{update?.comment ?? update?.reason ?? '-'}</span>
                            </div>
                          ))}
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold">Updated by</span>
                          <span>{update?.updatedByUser}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResponseAuditHistory;
