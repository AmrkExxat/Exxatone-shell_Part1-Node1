'use client';

import React from 'react';
import { Avatar } from '../../../libs';

export default function Page() {
  return (
    <div className="h-full w-full">
      <div className="my-4 text-2xl font-bold">Generic Example</div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <div className="bg-card w-1/2 rounded-md border">
            <div className="text-accent mb-4 border-b px-4 py-2 text-lg font-semibold">
              Avatar Variants
            </div>
            <div className="flex flex-col p-4">
              <span className="text-md mb-4 font-semibold">Basic Avatar</span>
              <div className="flex flex-row flex-wrap gap-4">
                <Avatar testid="defaultAvatar" />
              </div>
              <br />

              <span className="text-md mb-4 font-semibold">Avatar with src</span>
              <div className="flex flex-row flex-wrap gap-4">
                <Avatar
                  testid="Avatar_with_src"
                  src="https://via.placeholder.com/90"
                  alt="placeholder image"
                />
                <Avatar
                  testid="Avatar_with_src_rounded"
                  src="https://via.placeholder.com/90"
                  alt="placeholder rounded image"
                />
              </div>
              <br />

              <span className="text-md mb-4 font-semibold">Avatar with name</span>
              <div className="flex flex-row flex-wrap gap-4">
                <Avatar
                  testid="Avatar_with_Name"
                  firstName="Harvey"
                  lastName="Specter"
                  className="h-[60px] w-[60px] text-xl"
                />
                <Avatar
                  testid="Avatar_with_Color"
                  fgColor="white"
                  bgColor="purple"
                  firstName="Harvey"
                  lastName="Specter"
                  className="h-[60px] w-[60px] text-xl"
                />
              </div>
              <br />

              <span className="text-md mb-4 font-semibold">Avatar with Different Sizes</span>
              <div className="flex flex-row flex-wrap gap-4">
                <Avatar testid="Avatar_with_25" className="h-[25px] w-[25px]" />
                <Avatar testid="Avatar_with_50" className="h-[50px] w-[50px]" />
                <Avatar testid="Avatar_with_75" className="h-[75px] w-[75px]" />
                <Avatar testid="Avatar_with_100" className="h-[100px] w-[100px]" />
                <Avatar
                  testid="Avatar_with_125"
                  fgColor="white"
                  bgColor="purple"
                  firstName="Harvey"
                  lastName="Specter"
                  className="h-[125px] w-[125px] text-xl"
                />
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
