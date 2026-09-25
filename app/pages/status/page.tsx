'use client';

import React from 'react';
import { Status } from '../../../libs';

export default function Page() {
  return (
    <>
      <span className="mb-8 text-4xl font-bold">Status</span>
      <div className="h-80 w-full rounded-lg border border-dashed border-zinc-500 pt-8 pl-8">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-8">
              <div className="flex flex-col gap-4">
                <Status label="draft" id="render_status_draft" type="internship" />
                <Status label="completed" id="render_status_completed" type="internship" />
                <Status label="in-progress" id="render_status_in_progress" type="internship" />
              </div>
              <div className="flex flex-col gap-4">
                <Status label="rejected" id="render_status_rejected" type="internship" />
                <Status label="cancelled" id="render_status_cancelled" type="internship" />
                <Status label="active" id="render_status_active" type="internship" />
              </div>
              <div className="flex flex-col gap-4">
                <Status label="inactive" id="render_status_inactive" type="internship" />
                <Status label="closed" id="render_status_closed" type="internship" />
                <Status label="revoked" id="render_status_revoked" type="internship" />
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col gap-4">
                <Status label="approved" id="render_status_approved" type="internship" />
                <Status label="non-compliant" id="render_status_non_compliant" type="internship" />
                <Status label="compliant" id="render_status_compliant" type="internship" />
              </div>
              <div className="flex flex-col gap-4">
                <Status label="get-started" id="render_status_get_started" type="internship" />
                <Status label="not-started" id="render_status_not_started" type="internship" />
              </div>
              <div className="flex flex-col gap-4">
                <Status label="deleted" id="render_status_deleted" type="internship" />
                <Status label="in-process" id="render_status_in_process" type="internship" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
