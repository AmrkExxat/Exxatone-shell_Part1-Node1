'use client';

import React from 'react';
import { BreadCrumbs, BreadCrumbItemType } from '../../../libs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faChevronDown } from '@fortawesome/pro-light-svg-icons';

export default function Page() {
  const breadcrumbItems: BreadCrumbItemType[] = [
    { label: 'Home', href: '/', current: true },
    { label: 'Products', href: '/products', current: false },
    { label: 'Electronics', current: false }, // Last item is disabled (text only)
  ];

  const handleItemClick = (item: BreadCrumbItemType) => {
    console.log(item.label);
  };

  return (
    <div className="h-full w-full">
      <div className="my-4 text-2xl font-bold">Generic Buttons Example</div>

      <div className="flex flex-col gap-4">
        <div className="bg-card w-full rounded-md border">
          <div className="text-accent mb-4 border-b px-4 py-2 text-lg font-semibold">
            Button Variants
          </div>
          <div className="flex flex-col p-4">
            <span className="text-md mb-4 font-semibold">Default</span>
            <div className="flex flex-row flex-wrap gap-4 pl-8">
              <BreadCrumbs
                items={breadcrumbItems}
                id="breadcrumb_id"
                testid="breadcrumb_id"
                aria-label="Breadcrumb Label"
                onItemClick={handleItemClick}
              />
            </div>

            <br />

            <span className="text-md mb-4 font-semibold">Custom Separator Text</span>
            <div className="flex flex-row flex-wrap gap-4 pl-8">
              <BreadCrumbs
                items={breadcrumbItems}
                separator={
                  <span id="separator_icon" className="mx-2 text-gray-400">
                    {' '}
                    |{' '}
                  </span>
                }
                onItemClick={handleItemClick}
              />
            </div>

            <br />

            <span className="text-md mb-4 font-semibold">Custom Separator Icon</span>
            <div className="flex flex-row flex-wrap gap-4 pl-8">
              <BreadCrumbs
                items={breadcrumbItems}
                separator={
                  <FontAwesomeIcon
                    id="separator_icon"
                    icon={faArrowRight}
                    className="mx-2 h-4 w-4 text-gray-400"
                  />
                }
                onItemClick={handleItemClick}
              />
            </div>

            <br />

            <span className="text-md mb-4 font-semibold">Custom Separator Icon Text</span>
            <div className="flex flex-row flex-wrap gap-4 pl-8">
              <BreadCrumbs
                items={breadcrumbItems}
                separator={
                  <div className="mx-2 flex items-center text-gray-400">
                    <FontAwesomeIcon id="separator_icon" icon={faChevronDown} className="h-4 w-4" />
                    <span id="separator_text" className="ml-1">
                      Next
                    </span>
                  </div>
                }
                onItemClick={handleItemClick}
              />
            </div>

            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
