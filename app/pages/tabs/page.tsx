'use client';

import React, { useState } from 'react';
import { Tabs } from '../../../libs';

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index: any, query: any) => {
    setActiveTab(index);
    console.log('Tab changed:', index, query);
  };

  const tabData = [
    { title: 'Home', icon: '🏠', query: 'home' },
    { title: 'Profile', icon: '👤', query: 'profile' },
    { title: 'Settings', icon: '⚙️', query: 'settings', badge: 3 },
  ];

  return (
    <>
      <span className="text-4xl font-bold">Tabs</span>

      <div className="space-y-6 p-6">
        <h2 className="text-lg font-bold">Primary Tabs</h2>
        <Tabs tabs={tabData} activeIndex={activeTab} onTabChange={handleTabChange} type="primary" />

        <h2 className="text-lg font-bold">Secondary Tabs</h2>
        <Tabs
          tabs={tabData}
          activeIndex={activeTab}
          onTabChange={handleTabChange}
          type="secondary"
        />

        <h2 className="text-lg font-bold">Tertiary Tabs</h2>
        <Tabs
          tabs={tabData}
          activeIndex={activeTab}
          onTabChange={handleTabChange}
          type="tertiary"
        />

        <h2 className="text-lg font-bold">Switcher Tabs</h2>
        <Tabs
          tabs={tabData}
          activeIndex={activeTab}
          onTabChange={handleTabChange}
          type="switcher"
        />
      </div>
    </>
  );
}
