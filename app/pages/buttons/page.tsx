'use client';

import React from 'react';

import { Button } from '../../../libs';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

export default function Page() {
  return (
    <div className="h-full w-full">
      <div className="my-4 text-2xl font-bold">Generic Buttons Example</div>

      <div className="flex flex-col gap-4">
        <div className="bg-card w-full rounded-md border">
          <div className="text-accent mb-4 border-b px-4 py-2 text-lg font-semibold">
            Button Variants
          </div>
          <div className="flex flex-col p-4">
            <span className="text-md font-semibold">Basic</span>
            <div className="flex flex-row flex-wrap gap-4">
              <Button color="primary" variant="basic" testid="basic_primary">
                Primary
              </Button>
              <Button color="primary" variant="basic" disabled testid="basic_primary">
                Primary
              </Button>
            </div>
            <br />

            <span className="text-md font-semibold">Raised</span>

            <div className="flex flex-row flex-wrap gap-4">
              <Button color="primary" variant="raised" testid="raised_primary">
                Primary
              </Button>
              <Button color="primary" variant="raised" disabled testid="raised_primary">
                Primary
              </Button>
              <button className="icon-btn" type="button">
                <EnvelopeIcon className="h-4 w-4" />
              </button>
            </div>
            <br />

            <span className="text-md font-semibold">Flat</span>
            <div className="flex flex-row flex-wrap gap-4">
              <Button color="primary" variant="flat" testid="flat_primary">
                Primary
              </Button>
              <Button color="primary" variant="flat" disabled testid="flat_primary">
                Primary
              </Button>
            </div>
            <br />

            <span className="text-md font-semibold">Stroked</span>
            <div className="flex flex-row flex-wrap gap-4">
              <Button color="primary" variant="stroked" testid="flat_primary">
                Primary
              </Button>
              <Button color="primary" variant="stroked" disabled testid="flat_primary">
                Primary
              </Button>
            </div>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
