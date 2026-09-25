/* eslint-disable prettier/prettier */
'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/pro-solid-svg-icons';
import moment from 'moment';
import { Accordion, Button, FileUpload, TextArea } from '../../../components/common';
import {
  FormControlFormStateType,
  getFormControlEror,
  setFormControlState,
} from '../../../../utilities';

const TicketDetails = ({
  fetchData,
  uploadFile,
  updateRequest,
  row,
}: {
  fetchData: (query: any) => Promise<any>;
  uploadFile: (files: any, name: string) => Promise<any>;
  updateRequest: (ticketId, comment: any) => Promise<any>;
  row: any;
}): JSX.Element => {
  const [showReplyBlock, setShowReplyBlock] = useState<boolean>(false);
  const [commentsGroupedByDate, setCommentsGroupedByDate] = useState<any>();
  const [submitDisable, setSubmitDisable] = useState<boolean>(false);
  const [state, setState] = useState({
    description: '',
    selectedFiles: [] as File[],
  });
  const [ticketDetailsFormState, setTicketDetailsFormState] =
    useState<FormControlFormStateType | null>(null);

  useEffect(() => {
    fetchReplies();
  }, [fetchData]);

  const fetchReplies = async () => {
    let response = await fetchData(row.id);
    const userMap = getUserMapping(response.users);
    const commentsGroupedByDate = groupByDate(response.comments, userMap);
    let comments =
      commentsGroupedByDate && commentsGroupedByDate.length > 0
        ? commentsGroupedByDate.reverse()
        : [];
    setCommentsGroupedByDate(comments);
  };

  const getUserMapping = (userObject: Array<{ id: number; name: string }>): Map<number, string> => {
    const userMap = new Map();
    userObject.map((user) => {
      userMap.set(user.id, user.name);
    });
    return userMap;
  };

  const groupByDate = (response: any, userObject: Map<number, string>) => {
    const results: Array<{
      date: string;
      messageArray: Array<{
        from: string;
        message: string;
        attachments: Array<string>;
        dateAndTime: string;
      }>;
    }> = [];
    let currentDate: null | string = null;
    let currentGroupedMessage:
      | {
          date: string;
          messageArray: Array<{
            from: string;
            message: string;
            attachments: Array<string>;
            dateAndTime: string;
          }>;
        }
      | Record<string, never> = {};
    response.forEach((message: any) => {
      const messageDate = dateTimeStandardization(message.created_at);
      const dateAndTime = dateTimeStandardization(message.created_at, true);
      const messageObject = {
        from: String(userObject.get(message.author_id)),
        message: message.body,
        attachments: [...message.attachments],
        dateAndTime: dateAndTime,
      };
      if (results.length === 0 || (currentDate !== null && currentDate !== messageDate)) {
        currentDate = messageDate;
        currentGroupedMessage = {
          date: messageDate,
          messageArray: [],
        };
        currentGroupedMessage.messageArray.push(messageObject);
        results.push(currentGroupedMessage);
      } else {
        currentGroupedMessage.messageArray.push(messageObject);
      }
    });
    return results;
  };

  const dateTimeStandardization = (dateTime, timeRequired: boolean = false) => {
    if (timeRequired) {
      return moment(dateTime).format('MM/DD/YYYY, hh:mm:ss A z');
    } else {
      return moment(dateTime).format('MM/DD/YYYY');
    }
  };

  const handleFileChange = (files: File[]) => {
    setState((prevState) => ({
      ...prevState,
      selectedFiles: [...prevState.selectedFiles, ...files],
    }));
  };

  const submitReply = async (files: any[] | null) => {
    const response = await updateRequest(row.id, {
      request: {
        comment: {
          html_body: state.description,
          uploads: files,
        },
      },
    });
    setSubmitDisable(false);
    return response;
  };

  const clearState = () => {
    setState({
      description: '',
      selectedFiles: [] as File[],
    });
    setShowReplyBlock(false);
    setFormControlState(
      'description',
      ticketDetailsFormState,
      setTicketDetailsFormState,
      true,
      true,
      undefined
    );
    fetchReplies();
  };

  const showReply = () => {
    setShowReplyBlock(true);
    setFormControlState(
      'description',
      ticketDetailsFormState,
      setTicketDetailsFormState,
      true,
      true,
      undefined
    );
  };

  const uploadFileIfAttached = async () => {
    setSubmitDisable(true);
    if (state.selectedFiles?.length > 0) {
      const allPromises = state.selectedFiles.map((item) => {
        const fd = new FormData();
        fd.append('filePayload', item);
        return uploadFile(fd, item.name);
      });
      const responses = await Promise.all(allPromises);
      await submitReply(responses.map((item: any) => item.upload.token)).then((res) => {
        clearState();
      });
    } else {
      await submitReply(null).then((res) => {
        clearState();
      });
    }
    setTimeout(() => document.getElementById('help_center_reply_btn')?.focus(), 1500);
  };

  return (
    <div className="mb-3 h-full p-3">
      <div className="flex justify-end p-2">
        <Button
          testid="help_center_reply_btn"
          id="help_center_reply_btn"
          onClick={() => showReply()}
        >
          <FontAwesomeIcon
            icon={faReply}
            style={{ paddingRight: '4px' }}
            aria-hidden="true"
            className="py-1.5"
          />
          Reply
        </Button>
      </div>
      {showReplyBlock && (
        <div className="reply-block bg-card mb-5 rounded-lg border-2 px-3 py-5">
          <div className="">
            <FileUpload selectedFiles={state.selectedFiles} handleFileChange={handleFileChange} />
          </div>
          <div className="mt-5 mb-3">
            <TextArea
              label="Description"
              id="description"
              name="description"
              rows={7}
              placeholder=""
              value={state.description}
              aria-describedby={
                getFormControlEror('description', ticketDetailsFormState)
                  ? `help_center_ticket_details_description_error`
                  : undefined
              }
              onBlur={() => {
                if (state?.description?.length) {
                  setFormControlState(
                    'description',
                    ticketDetailsFormState,
                    setTicketDetailsFormState,
                    true,
                    true,
                    undefined
                  );
                } else {
                  setFormControlState(
                    'description',
                    ticketDetailsFormState,
                    setTicketDetailsFormState,
                    true,
                    false,
                    'Please enter description'
                  );
                }
              }}
              onChange={(e: string) => {
                if (e.target.value === '') {
                  setFormControlState(
                    'description',
                    ticketDetailsFormState,
                    setTicketDetailsFormState,
                    true,
                    false,
                    'Please enter description'
                  );
                } else {
                  setFormControlState(
                    'description',
                    ticketDetailsFormState,
                    setTicketDetailsFormState,
                    true,
                    true,
                    undefined
                  );
                }
                setState({ ...state, description: e.target.value });
              }}
              required
              testid="helpCenter_myTicket_ticketDetail_description_textArea"
            />
            {getFormControlEror('description', ticketDetailsFormState) && (
              <div
                id={`help_center_ticket_details_description_error`}
                className="text-warn mt-2 text-xs"
                role="alert"
              >
                {getFormControlEror('description', ticketDetailsFormState)}
              </div>
            )}
          </div>
          <Button
            id="help_center_submit_ticket_btn"
            testid="help_center_submit_ticket_btn"
            color="primary"
            className="mt-5 p-2"
            disabled={!state.description || submitDisable}
            onClick={() => uploadFileIfAttached()}
          >
            Submit
          </Button>
        </div>
      )}
      {commentsGroupedByDate?.length > 0 && (
        <>
          {commentsGroupedByDate.map((commentGroup) => {
            return (
              <div key={commentGroup.date} className="py-2">
                <Accordion header={commentGroup.date} expanded={true}>
                  <div className="text-sm">
                    {commentGroup.messageArray?.length > 0 && (
                      <>
                        {commentGroup.messageArray.map((comment, commentIdx) => {
                          return (
                            <div key={commentIdx} className="border-b-[1px] p-2">
                              <div className="py-2 font-semibold italic">From: {comment.from}</div>
                              <pre className="whitespace-pre-wrap text-gray-600">
                                {comment.message}
                              </pre>
                              {comment.attachments?.length > 0 && (
                                <>
                                  {comment.attachments.map((attachment, attachIdx) => {
                                    return (
                                      <div
                                        key={commentIdx + '_' + attachIdx}
                                        className="py-2 text-sm text-[#495AB9]"
                                      >
                                        <a
                                          tabIndex={0}
                                          href={attachment.content_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="link text-primary disabled:text-disabled flex min-w-[32px] cursor-pointer items-center justify-center px-3 text-sm font-normal hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed"
                                          aria-label={`${attachment.file_name} opens in new tab`}
                                        >
                                          {attachment.file_name}
                                        </a>
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                              <span className="pt-4 text-sm italic">
                                Last updated on <strong>{comment.dateAndTime}</strong>
                              </span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </Accordion>
              </div>
            );
          })}
        </>
      )}
      {!commentsGroupedByDate ||
        (commentsGroupedByDate?.length === 0 && (
          <div className="flex items-center justify-center p-3 text-sm text-gray-500">
            <span>No Comments</span>
          </div>
        ))}
    </div>
  );
};

export default TicketDetails;
