/* eslint-disable react/display-name */
import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { HelpCenter } from '../../libs/ui';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Shared UI/HelpCenter',
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<any>;

export default meta;

type Story = StoryObj<any>;

function dummyMethod() {
  return new Promise((resolve, reject) => {
    const success = true;
    setTimeout(() => {
      if (success) {
        resolve('Operation was successful!');
      } else {
        reject('Operation failed.');
      }
    }, 1000);
  });
}

const userDetails = {
  loggedInUser: { firstName: 'abc', lastName: 'def', id: 'duw' },
  productId: 'someID',
  productName: 'schoolName',
  email: 'some@email.com',
  userName: 'userName',
  product: 'ExxatOne-School',
  persona: 'School',
  zen_product: 'exxat_one',
};

const fetchCommentsByTicketId = async (id) => {
  let a = {};
  a = {
    comments: [
      {
        url: 'https://exxat.zendesk.com/api/v2/requests/133880/comments/25482809203601.json',
        id: 25482809203601,
        type: 'Comment',
        request_id: 133880,
        body: "(11:10:43 AM) *** Bracken, Alexia joined the chat ***\n(11:10:43 AM) Bracken, Alexia: hi\n(11:11:07 AM) Chandramani Singh: Hello Alexia. Thank you for reaching out to Exxat Prism Support Live Chat. My name is Chandramani.\n(11:11:24 AM) Chandramani Singh: Please let me know how can I assist you today\n(11:15:21 AM) Chandramani Singh: Please let me know how can I assist you today\n(11:16:40 AM) Chandramani Singh: Alexia, Just to confirm, are we still connected?\n(11:18:45 AM) Chandramani Singh: Alexia, I haven't heard from you for a few moments. Would you like to continue chatting?\n(11:20:12 AM) *** Bracken, Alexia left the chat ***",
        html_body:
          '<div class="zd-comment" dir="auto"><p dir="auto">(11:10:43 AM) *** Bracken, Alexia joined the chat ***\n<br>(11:10:43 AM) Bracken, Alexia: hi\n<br>(11:11:07 AM) Chandramani Singh: Hello Alexia. Thank you for reaching out to Exxat Prism Support Live Chat. My name is Chandramani.\n<br>(11:11:24 AM) Chandramani Singh: Please let me know how can I assist you today\n<br>(11:15:21 AM) Chandramani Singh: Please let me know how can I assist you today\n<br>(11:16:40 AM) Chandramani Singh: Alexia, Just to confirm, are we still connected?\n<br>(11:18:45 AM) Chandramani Singh: Alexia, I haven\'t heard from you for a few moments. Would you like to continue chatting?\n<br>(11:20:12 AM) *** Bracken, Alexia left the chat ***</p></div>',
        plain_body:
          "(11:10:43 AM) *** Bracken, Alexia joined the chat ***\n\n(11:10:43 AM) Bracken, Alexia: hi\n\n(11:11:07 AM) Chandramani Singh: Hello Alexia. Thank you for reaching out to Exxat Prism Support Live Chat. My name is Chandramani.\n\n(11:11:24 AM) Chandramani Singh: Please let me know how can I assist you today\n\n(11:15:21 AM) Chandramani Singh: Please let me know how can I assist you today\n\n(11:16:40 AM) Chandramani Singh: Alexia, Just to confirm, are we still connected?\n\n(11:18:45 AM) Chandramani Singh: Alexia, I haven't heard from you for a few moments. Would you like to continue chatting?\n\n(11:20:12 AM) *** Bracken, Alexia left the chat ***",
        public: true,
        author_id: -1,
        attachments: [],
        created_at: '2024-05-29T15:20:12Z',
      },
    ],
    users: [
      {
        id: -1,
        name: 'System',
        photo: null,
        agent: true,
        organization_id: null,
      },
    ],
    organizations: [],
    next_page: null,
    previous_page: null,
    count: 1,
  };
  return a;
};

const fetchMyTicketsData = async (queryParams: any, searchQuery: string) => {
  let row = [
    {
      url: 'https://exxat.zendesk.com/api/v2/tickets/133880.json',
      id: 133880,
      external_id: null,
      via: {
        channel: 'chat',
        source: {
          from: {},
          to: {},
          rel: null,
        },
      },
      created_at: '2024-05-29T15:10:44Z',
      updated_at: '2024-06-03T16:01:15Z',
      generated_timestamp: 1717430475,
      type: null,
      subject: 'Conversation with Ankita Jain',
      raw_subject: 'Conversation with Ankita Jain',
      description:
        'Conversation with Bracken, Alexia\n\nURL: https://uatprism.exxat.com/faculty/account/launch#program_list',
      priority: 'normal',
      status: 'closed',
      recipient: null,
      requester_id: 11592833429393,
      submitter_id: 20840193716241,
      assignee_id: 11954405339793,
      organization_id: 11594636876433,
      group_id: 12119792868241,
      collaborator_ids: [],
      follower_ids: [],
      email_cc_ids: [],
      forum_topic_id: null,
      problem_id: null,
      has_incidents: false,
      is_public: true,
      due_at: null,
      satisfaction_rating: {
        score: 'unoffered',
      },
      sharing_agreement_ids: [],
      custom_status_id: 1900006691493,
      encoded_id: 'G3MJK0-RZVP3',
      followup_ids: [],
      ticket_form_id: 11361589152017,
      brand_id: 360002990097,
      allow_channelback: false,
      allow_attachments: true,
      from_messaging_channel: false,
      result_type: 'ticket',
    },
  ];
  const result = { data: row, totalCount: 1 };
  return result;
};

export const Helpcenter: Story = {
  render: () => {
    return (
      <>
        <HelpCenter
          currentUser={userDetails}
          myTicketsGridFetch={fetchMyTicketsData}
          fetchComment={fetchCommentsByTicketId}
          createUser={dummyMethod}
          isUserPresent={dummyMethod}
          uploadFile={dummyMethod}
          createZenRequest={dummyMethod}
          updateRequest={dummyMethod}
        />
      </>
    );
  },
};
