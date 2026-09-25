'use client';
import React, { useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyTickets from './MyTickets/MyTickets';
import RaiseTickets from './RaiseTickets/RaiseTickets';
import { Tabs } from '../../components/common/Tabs';
import { Button } from '../../components/common/Buttons'; // Correct import path with 's'

const tabs = [
  { name: 'raiseTicket', title: 'Raise a ticket' },
  { name: 'myTickets', title: 'My Tickets' },
  // { name: 'allTickets', title: 'All Tickets' },
];

const HelpCenter = ({
  currentUser,
  myTicketsGridFetch,
  fetchComment,
  createUser,
  isUserPresent,
  uploadFile,
  createZenRequest,
  updateRequest,
  rightContent,
}: {
  currentUser: any;
  myTicketsGridFetch: (queryParams: any, searchQuery: string) => Promise<any>;
  fetchComment: (id: any) => Promise<any>;
  createUser: (payload: any) => Promise<any>;
  isUserPresent: (id: any) => Promise<any>;
  uploadFile: (files: any, name: string) => Promise<any>;
  createZenRequest: (userRequest: any) => Promise<any>;
  updateRequest: (ticketId: string, comment: any) => Promise<any>;
  rightContent?: ReactNode;
}): JSX.Element => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const queryClient = new QueryClient();
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    id: '',
    email: '',
    userName: '',
    product: '',
    persona: '',
  });

  useEffect(() => {
    if (currentUser) {
      updateUserDetails();
    }
    document.title = 'Help | Exxat One';
  }, [currentUser]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const updateUserDetails = () => {
    setUserDetails({
      fullName: currentUser?.loggedInUser?.lastName
        ? currentUser.loggedInUser.lastName + ', ' + currentUser.loggedInUser.firstName
        : currentUser.loggedInUser.firstName,
      id: currentUser?.loggedInUser?.id,
      email: currentUser?.email,
      userName: currentUser.userName,
      product: currentUser.product,
      persona: currentUser.persona,
    });
  };

  const tabContents = [
    <RaiseTickets
      key="raiseTicket"
      userDetails={userDetails}
      currentUser={currentUser}
      createUser={createUser}
      isUserPresent={isUserPresent}
      createZenRequest={createZenRequest}
      uploadFile={uploadFile}
      rightContent={rightContent}
    />,
    <MyTickets
      key="myTickets"
      fetchData={myTicketsGridFetch}
      fetchComments={fetchComment}
      updateRequest={updateRequest}
      uploadFile={uploadFile}
      rightContent={rightContent}
    />,
    // <AllTickets key="allTickets" fetchData={allTicketsGridFetch} fetchComments={fetchComment} />,
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="p-3">
          <Tabs
            id="help_center"
            tabs={tabs}
            activeIndex={tabIndex}
            onTabChange={handleTabChange}
            position="left"
          />
        </div>
        <div className="px-3">{tabContents[tabIndex]}</div>
      </div>
    </QueryClientProvider>
  );
};

export default HelpCenter;
