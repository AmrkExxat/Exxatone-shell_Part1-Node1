'use client';

import React from 'react';
import { ShowMore } from '../../../libs';

export default function Page() {
  const data = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Next js' },
    { id: 4, name: 'JavaScript' },
    { id: 5, name: 'FrontEnd' },
  ];

  const dataWithLink = [
    { id: 1, name: 'Angular', url: 'buttons' },
    { id: 2, name: 'React', url: 'avatar' },
    { id: 3, name: 'Next js', url: 'accordion' },
    { id: 4, name: 'JavaScript', url: 'card' },
    { id: 5, name: 'FrontEnd', url: 'drawer' },
    { id: 6, name: 'BackEnd', url: 'filter' },
    { id: 7, name: 'Go', url: 'modal' },
    { id: 8, name: 'Node', url: 'primarysteps' },
    { id: 9, name: 'Java', url: 'toggleGroupButton' },
    { id: 10, name: 'Typescript', url: 'tabs' },
  ];

  return (
    <>
      <span className="text-4xl font-bold">Show More Examples</span>
      <div className="h-64 w-full rounded-lg border border-dashed border-zinc-500">
        <div className="flex flex-col p-4">
          <span className="text-md font-semibold">Basic</span>
          <div className="flex flex-row flex-wrap gap-4">
            <ShowMore
              type="list"
              rowData={data}
              selector={['name']}
              showTooltip={true}
              maxLength={2}
            />
          </div>
          <br />
          <span className="text-md font-semibold">With Hyperlink</span>
          <div className="flex flex-row flex-wrap gap-4">
            <ShowMore
              type="list"
              rowData={dataWithLink}
              selector={['name']}
              isHyperLink={true}
              routePath="pages"
              routeSelector="url"
              showTooltip={true}
              maxLength={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
