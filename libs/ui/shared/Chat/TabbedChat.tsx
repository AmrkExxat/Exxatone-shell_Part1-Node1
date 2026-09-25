import { FC, ReactElement, useState } from 'react';
import { ChatItemType } from './types';
import classNames from 'classnames';
import Chat from './Chat';
import { Skeleton } from '../../components';

interface ChatTabItemType {
  id: string;
  title: string;
  textInputPlaceholder?: string;
  chatItems: ChatItemType[];
}

interface TabbedChatProps {
  containerHeight: string;
  handleOnSend: (data: { message: string; tabId: string }) => void;
  tabs: ChatTabItemType[];
}

const TabbedChat: FC<TabbedChatProps> = ({ containerHeight, handleOnSend, tabs }): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs?.[0]?.id);
  const [loadingTab, setLoadingTab] = useState<string | null>(null);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
    setLoadingTab(tabId);

    setTimeout(() => {
      setLoadingTab(null);
    }, 750);
  };

  return (
    <div className="flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-card z-50 flex flex-row border-b shadow-sm" id="tab" role="list">
        {tabs.map((tab) => (
          <button
            id={tab.id}
            key={tab.id}
            aria-current={selectedTab === tab?.id}
            onClick={() => handleTabClick(tab.id)}
            className={classNames(
              'hover:bg-hover focus-visible:outline-primary flex min-h-[48px] min-w-[100px] flex-col items-center justify-center rounded border-b-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              selectedTab === tab.id
                ? 'border-b-primary text-primary'
                : 'text-default border-b-transparent'
            )}
          >
            <span role="listitem">{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map((tab) =>
          tab.id === selectedTab ? (
            <div key={tab.id}>
              {loadingTab === tab.id ? (
                <div className="flex flex-col p-4" id="skeleton">
                  <Skeleton type="default" key={`${tab.id}-skeleton`} />
                </div>
              ) : (
                <Chat
                  key={tab.id}
                  containerHeight={containerHeight}
                  chatItems={tab.chatItems}
                  placeholder={tab.textInputPlaceholder}
                  handleOnSend={(data: any) => handleOnSend({ ...data, tabId: tab.id })}
                />
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default TabbedChat;
