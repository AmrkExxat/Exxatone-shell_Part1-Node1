/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';
import React from 'react';
import moment from 'moment';
import { Button, Status } from '../../../components/common';
import { faBallot, faCalendarRange } from '@fortawesome/pro-light-svg-icons';

export const myTicketsColumns = (openTicket: (item: any) => any, openDoc: (item: any) => any) => {
  return [
    {
      fieldName: 'subject',
      headerName: 'SUBJECT AND DESCRIPTION',
      hiddenOrder: 4,
      isBold: true,
      canSort: true,
      width: '200px',
      isTruncate: false,
      renderCell: (row: any) => {
        return (
          <div className="p-4">
            <div className="flex items-center">
              <span className="mr-2 w-max rounded-sm bg-[#d8d8d8] px-[8px] py-[2px] text-xs leading-normal whitespace-nowrap">
                ID - {row.id}
              </span>
              <Button
                id={`help_center_my-ticket_${row.subject}`}
                testid="help_center_my_ticket"
                size="xs"
                variant="link"
                className="font-semibold"
                onClick={() => openTicket && openTicket(row)}
              >
                {row.subject}
              </Button>
            </div>
            <div className="mt-3 text-[.8rem]">
              <p>{row.description}</p>
            </div>
            <div className="mt-3 text-[.8rem] italic">
              <span>
                <span>Created Date</span>
                <span className="ml-1 font-semibold">
                  {moment(row.created_at).format('MMM DD, YYYY')},
                </span>
              </span>
              <span className="ml-2">
                <span>Updated Date</span>
                <span className="ml-1 font-semibold">
                  {moment(row.updated_at).format('MMM DD, YYYY')}
                </span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      fieldName: 'status',
      headerName: 'STATUS',
      hiddenOrder: 4,
      isBold: true,
      canSort: false,
      width: '150px',
      isTruncate: false,
      renderCell: (row: any) => {
        return <Status type="helpcenter" label={row.status} id={row.status} />;
      },
    },
    {
      fieldName: 'documents',
      headerName: 'DOCUMENTS',
      hiddenOrder: 4,
      isBold: false,
      canSort: false,
      width: '150px',
      isTruncate: false,
      renderCell: (row: any) => {
        return (
          <Button
            id="help_center_view_document_btn"
            testid="help_center_view_document_btn"
            size="xs"
            variant="link"
            onClick={() => {
              openDoc(row);
              setTimeout(() => document.getElementById('close_view_documents_btn')?.focus(), 500);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                openDoc(row);
                setTimeout(() => document.getElementById('close_view_documents_btn')?.focus(), 500);
              }
            }}
            aria-label={`View Documents of ${row.subject}`}
          >
            View Documents
          </Button>
        );
      },
    },
  ];
};

export function myTicketFilterConfig(defaultOptions: any) {
  return [
    {
      id: 'created',
      type: 'dateRange',
      label: 'Created date',
      defaultValues: defaultOptions?.created ?? {},
      placeholder: 'Enter date',
      icon: faCalendarRange,
      showSelected: true,
    },
    {
      id: 'updated',
      type: 'dateRange',
      label: 'Updated date',
      defaultValues: defaultOptions?.updated ?? {},
      placeholder: 'Enter date',
      icon: faCalendarRange,
      showSelected: true,
    },
    {
      id: 'status',
      type: 'dropdown',
      label: 'Status',
      options: [
        {
          label: 'New',
          value: 'new',
          id: 'new',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
          id: 'in-progress',
        },
        {
          label: 'Closed',
          value: 'closed',
          id: 'closed',
        },
      ],
      name: 'Status',
      multiple: true,
      icon: faBallot,
      searchable: false,
      selectAllRequired: true,
      defaultValues: defaultOptions?.status ?? [],
    },
  ];
}
