'use client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { allTicketsColumns } from './AllTicketsColumn';
import TicketDetails from '../TicketDetails/TicketDetails';
import GridFilter from '../GridFilter/GridFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { Drawer } from '../../../components/layout';
import { Button, InfiniteScrollTable, Modal } from '../../../components/common';

const AllTickets = ({
  fetchData,
  fetchComments,
}: {
  fetchData: (queryParams: any, searchQuery: string) => Promise<any>;
  fetchComments: (id: any) => Promise<any>;
}): JSX.Element => {
  const queryClient = new QueryClient();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any[]>([]);

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openTicket = (row: any) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const openDocuments = async (row) => {
    const ticketData = await fetchComments(row.id);
    let files = [];
    if (ticketData?.comments?.length) {
      for (let i = 0; i < ticketData.comments.length; i++) {
        if (ticketData.comments[i]?.attachments?.length) {
          files.push(...ticketData.comments[i].attachments);
        }
      }
    }
    setDocuments(files);
    setOpen(true);
  };

  const columns: any = allTicketsColumns(openTicket, openDocuments);

  const fetchGridData = async (queryParams: any) => {
    let response = await fetchData(queryParams, filterQuery);
    return response;
  };

  return (
    <div className="bg-card flex flex-col rounded-lg border-[1px] pt-2">
      <GridFilter updateFilter={setFilterQuery} />
      <QueryClientProvider client={queryClient}>
        <InfiniteScrollTable
          columns={columns}
          fetchDataOnScroll={fetchGridData}
          searchable={true}
          queryKey={['allTickets']}
          filterPayload={filterQuery}
          maxHeight="calc(100vh - 300px)"
          showToggleView={false}
        />
      </QueryClientProvider>
      <Drawer
        drawerOpen={drawerOpen}
        actionButtons={<></>}
        size="medium"
        drawer={{
          title: 'Ticket ' + (selectedRow?.id ? selectedRow.id : ''),
          onClose: () => {
            closeDrawer();
          },
        }}
      >
        <>{selectedRow && <TicketDetails fetchData={fetchComments} row={selectedRow} />}</>
      </Drawer>
      <Modal open={open} setOpen={setOpen} modalTitle="tickets_document">
        <div className="">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="tickets_document" className="text-lg font-bold">
              Documents
            </h2>

            <Button
              id="help_center_close_view_documents_btn"
              testid="help_center_close_view_documents_btn"
              variant="link"
              className="focus-indicator mr-2 flex h-6 w-6 items-center justify-center rounded-md p-3 hover:bg-[#80808036]"
              onClick={() => {
                setOpen(false);
              }}
            >
              <span className="sr-only">Close documents</span>
              <FontAwesomeIcon icon={faXmark} className="text-default h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          <div>
            {documents.length > 0 ? (
              <div className="flex justify-start">
                {documents.map((document) => {
                  return (
                    <a
                      className="link link-text text-sm"
                      key={document.id}
                      href={document.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`download ${document.file_name}`}
                    >
                      {document.file_name}
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center py-4 text-sm text-gray-500">
                <span>No documents present</span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllTickets;
