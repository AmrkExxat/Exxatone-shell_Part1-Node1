'use client';
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/pro-light-svg-icons';

export default function Page() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-4">
        <div className="card">
          <div className="card-header">
            <span className="card-header-title">Publish Options</span>
            <button type="button" className="icon-btn">
              <FontAwesomeIcon icon={faPen} className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="card-content">
            <div className="mb-4 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col items-start justify-center">
                  <span className="text-sm font-semibold">Name</span>
                  <span className="text-sm font-semibold">Adaptial - Easton</span>
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className=" ">Alias name</span>
                  <span className="text-sm font-semibold">-- </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex flex-col items-start justify-center">
                  <span className="text-sm font-semibold">Phone</span>
                  <span className="text-sm font-semibold">(303) 196-2491</span>
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className=" ">Address</span>
                  <span className="text-sm font-semibold">
                    2464 Royal Ln. Mesa, New Jersey 45463{' '}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-header-title">Internal Details</span>
            <button type="button" className="icon-btn">
              <FontAwesomeIcon icon={faPen} className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="card-content mb-4 grid grid-cols-1 gap-2">
            <div className="flex min-h-[44px] items-center justify-between border-b pb-2">
              <div className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit.
              </div>
            </div>
            <div className="flex min-h-[44px] flex-row items-center justify-between">
              <div className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </div>
              <div className="flex flex-row items-center justify-start gap-1">
                <button type="button" className="icon-btn">
                  <FontAwesomeIcon icon={faPen} className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" className="icon-btn text-warn hover:bg-warn-50">
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
