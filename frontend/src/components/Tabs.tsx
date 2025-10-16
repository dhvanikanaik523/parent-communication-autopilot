import React, { useState } from 'react';

interface Tab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || '');

  const activeContent = tabs.find(tab => tab.value === activeTab)?.content;

  return (
    <div>
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`tabs-trigger ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">{activeContent}</div>
    </div>
  );
};
