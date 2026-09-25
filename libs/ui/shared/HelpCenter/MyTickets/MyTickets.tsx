'use client';
import React, { useState, ReactNode, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { myTicketsColumns } from './MyTicketsColumn';
import TicketDetails from '../TicketDetails/TicketDetails';
import GridFilter from '../GridFilter/GridFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';
import { Drawer } from '../../../components/layout';
import { Button, InfiniteScrollTable, Modal } from '../../../components/common';
import { cloneDeep } from 'lodash';

const queryClient = new QueryClient();

const MyTickets = ({
  fetchData,
  fetchComments,
  uploadFile,
  updateRequest,
  rightContent,
}: {
  fetchData: (queryParams: any, searchQuery: string) => Promise<any>;
  fetchComments: (id: any) => Promise<any>;
  uploadFile: (files: any, name: string) => Promise<any>;
  updateRequest: (ticketId: string, comment: any) => Promise<any>;
  rightContent?: ReactNode;
}): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchText, setSearchtext] = useState<string>('');

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

  const columns: any = myTicketsColumns(openTicket, openDocuments);

  const fetchGridData = async (queryParams: any) => {
    const query = cloneDeep(queryParams);
    query['debouncedSearch'] = searchText;
    let response = await fetchData(query, filterQuery?.query ?? '');
    return response;
  };

  return (
    <div className="flex">
      <div className="flex-grow">
        <div className="bg-card flex flex-col rounded-lg">
          <QueryClientProvider client={queryClient}>
            <InfiniteScrollTable
              columns={columns}
              fetchDataOnScroll={fetchGridData}
              searchable={false}
              queryKey={['myTickets']}
              filterPayload={filterQuery}
              maxHeight="calc(100vh - 300px)"
              showToggleView={false}
              tableActions={
                <div className="py-3">
                  <GridFilter
                    updateFilter={(e) => {
                      setSearchtext(e?.searchedText ?? '');
                      setFilterQuery(e ?? '');
                    }}
                  />
                </div>
              }
            />
          </QueryClientProvider>
          <Drawer
            drawerOpen={drawerOpen}
            size="medium"
            actionButtons={<></>}
            drawer={{
              title: 'Ticket ' + (selectedRow?.id ? selectedRow.id : ''),
              onClose: () => {
                closeDrawer();
              },
            }}
          >
            <>
              {selectedRow && (
                <TicketDetails
                  fetchData={fetchComments}
                  row={selectedRow}
                  uploadFile={uploadFile}
                  updateRequest={updateRequest}
                />
              )}
            </>
          </Drawer>
          <Modal open={open} setOpen={setOpen} modalTitle="tickets_document">
            <div className="">
              <div className="mb-3 flex items-center justify-between">
                <h2 id="tickets_document" className="text-lg font-bold">
                  Documents
                </h2>

                <Button
                  id="close_view_documents_btn"
                  testid="close_view_documents_btn"
                  variant="basic"
                  className="focus-indicator mr-2 flex h-6 w-6 items-center justify-center rounded-md p-3 hover:bg-[#80808036]"
                  onClick={() => {
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setOpen(false);
                    }
                  }}
                >
                  <span className="sr-only">Close Documents</span>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-default h-5 w-5"
                    aria-hidden="true"
                  />
                </Button>
              </div>
              <div>
                {documents.length > 0 ? (
                  <div>
                    {documents.map((document) => {
                      return (
                        <div className="flex justify-start">
                          <a
                            className="link focus-visible:outline-primary text-sm focus-visible:outline focus-visible:outline-2"
                            id="close_view_documents_btn"
                            key={document.id}
                            href={document.content_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`download ${document.file_name}`}
                          >
                            {document.file_name}
                          </a>
                        </div>
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
      </div>

      {rightContent && <div className="mt-0 ml-4 min-w-[200px]">{rightContent}</div>}
    </div>
  );
};

export default MyTickets;
