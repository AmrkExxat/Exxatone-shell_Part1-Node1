'use client';

import React from 'react';
import { Tooltip } from '../../../libs';
import { Button } from '../../../libs';
export default function Page() {
  const triggerElement = () => {
    return <Button testid="hover_btn_toolip">Hover on button</Button>;
  };

  const tooltip = () => {
    return (
      <div className="p-4">
        <h2 className="mb-2 text-xl font-bold">Card Title</h2>
        <p className="mb-2">
          This is the content of the card. You can put any text or components here.
        </p>
        <Button testid="action">Action</Button>
      </div>
    );
  };

  return (
    <>
      <span className="mb-8 text-4xl font-bold">Tooltip Example</span>
      <Tooltip triggerElement={triggerElement} tooltip={tooltip} tabIndex={0} />
    </>
  );
}
