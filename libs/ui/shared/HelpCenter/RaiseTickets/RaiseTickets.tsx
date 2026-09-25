import React, { useState, ReactNode } from 'react';
import moment from 'moment';
import { Button, FileUpload, TextArea, TextInput, ToastList } from '../../../components/common';
import {
  FormControlFormStateType,
  getFormControlEror,
  setFormControlState,
} from '../../../../utilities';

const RADIO_OPTIONS = [
  { id: 'reportAProblem', title: 'Report a Problem', checked: true, value: 'Bug' },
  { id: 'suggestAFeature', title: 'Suggest a Feature', checked: false, value: 'Enhancement' },
  { id: 'askAQuestion', title: 'Ask a Question', checked: false, value: 'Query' },
];

function RaiseTickets({
  createUser,
  isUserPresent,
  uploadFile,
  createZenRequest,
  userDetails,
  currentUser,
  rightContent,
}: {
  createUser: (payload: any) => Promise<any>;
  isUserPresent: (id: any) => Promise<any>;
  uploadFile: (files: any, name: string) => Promise<any>;
  createZenRequest: (userRequest: any) => Promise<any>;
  userDetails: any;
  currentUser: any;
  rightContent?: ReactNode;
}) {
  const [state, setState] = useState({
    selectedType: RADIO_OPTIONS[0],
    ticketTitle: '',
    description: '',
    selectedFiles: [],
  });

  const [submitDisable, setSubmitDisable] = useState<boolean>(false);

  const [toasts, setToasts] = useState<any[]>([]);

  const [raiseTicketsFormState, setRaiseTicketsFormState] =
    useState<FormControlFormStateType | null>(null);

  const handleRadioChange = (id: string) => {
    const selectedOption = RADIO_OPTIONS.find((option) => option.id === id);
    if (selectedOption) {
      setState((prevState) => ({
        ...prevState,
        selectedType: selectedOption,
      }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      ticketTitle: e.target.value,
    }));
    if (e?.target?.value?.length) {
      setFormControlState(
        'ticketTitle',
        raiseTicketsFormState,
        setRaiseTicketsFormState,
        true,
        true,
        undefined
      );
    } else {
      setFormControlState(
        'ticketTitle',
        raiseTicketsFormState,
        setRaiseTicketsFormState,
        true,
        false,
        'Please enter title'
      );
    }
  };

  const handleFileChange = (files: File[]) => {
    setState((prevState) => ({
      ...prevState,
      selectedFiles: files,
    }));
  };

  const uploadFileIfAttached = async (attachedFiles: any) => {
    try {
      if (!attachedFiles?.length) {
        return {
          success: false,
          message: 'No files attached.',
        };
      }
      const allPromises = attachedFiles.map((item) => {
        const fd = new FormData();
        fd.append('filePayload', item);
        return uploadFile(fd, item.name);
      });
      const responses = await Promise.all(allPromises);
      return {
        success: true,
        responses,
      };
    } catch (error) {
      console.error('Error while uploading files', error);
      return {
        success: false,
        message: error?.message || 'An unknown error occurred',
      };
    }
  };

  const createTicket = async (formData: any, files: any) => {
    const ticket = {
      request: {
        type: null,
        status: null,
        subject: formData.ticketTitle,
        description: null,
        requester_id: null,
        requester: {
          name: userDetails?.fullName ?? '',
          email: userDetails?.email ?? '',
        },
        custom_fields: [
          {
            id: 11360540932241, //product
            value: currentUser.zen_product,
            Values: null,
          },
          {
            id: 11360668301329, //contact email
            value: userDetails?.email ?? '',
            Values: null,
          },
          {
            id: 11360461467153, //contact name
            value: userDetails?.fullName ?? '',
            Values: null,
          },
          {
            id: 11361468918417, //due date/future date
            value: moment().add(3, 'days').format('YYYY-MM-DD'),
          },
          {
            id: 11455184748305, //request-type
            value: formData.selectedType.value,
          },
        ],
        comment: {
          id: null,
          type: null,
          body: formData.description
            .replace(/(<([^>]+)>)/gi, '')
            .replace(/\s*&nbsp;\s*/gi, ' ')
            .trim(),
          html_body: null,
          plain_body: null,
          uploads: files,
          attachments: null,
        },
        tags: [
          currentUser.persona,
          currentUser.product,
          `${currentUser.product}_Name_${currentUser.productName}`,
          formData.selectedType.id,
          currentUser.productId,
          currentUser?.zen_product,
        ],
      },
    };

    try {
      const createTicketResponse = await createZenRequest(ticket);
      if (createTicketResponse?.success) {
        showToast(
          "The ticket is created successfully. It might take a few minutes to reflect on the 'My Tickets' list.",
          'success'
        );
        return createTicketResponse;
      }
    } catch (err) {
      console.error('error while submitting ticket', err);
    }
  };

  const handleSubmit = async () => {
    if (state.selectedFiles?.length > 0) {
      const uploadFilesResponse = await uploadFileIfAttached(state.selectedFiles);
      if (uploadFilesResponse?.success) {
        const tokens = uploadFilesResponse?.responses?.map((item: any) => item.upload.token);
        const raiseTicketResponse = await createTicket(state, tokens);
        setSubmitDisable(false);
        if (raiseTicketResponse?.success) {
          setState({
            selectedType: RADIO_OPTIONS[0],
            ticketTitle: '',
            description: '',
            selectedFiles: [],
          });
        }
      } else {
        setSubmitDisable(false);
      }
    } else {
      const raiseTicketResponse = await createTicket(state, null);
      setSubmitDisable(false);
      if (raiseTicketResponse?.success) {
        setState({
          selectedType: RADIO_OPTIONS[0],
          ticketTitle: '',
          description: '',
          selectedFiles: [],
        });
      }
    }

    //after submitting ticket, shift focus to Raise ticket tab.
    document.getElementById('Raise_a_ticket-tab-0')?.focus();
  };

  const getNewUser = () => {
    const newUser = {
      user: {
        verified: true,
        email: userDetails.email,
        name: userDetails.fullName,
        active: true,
        identities: [
          {
            type: 'email',
            value: userDetails.email,
          },
          {
            type: 'name',
            value: userDetails.fullName,
          },
          {
            type: 'id',
            value: `${userDetails.id}`,
          },
        ],
        ticketRestriction: 'requested',
        tags: [
          currentUser.persona,
          currentUser['product'],
          currentUser.productName,
          currentUser.productId,
        ],
      },
    };
    return newUser;
  };

  const checkIfUserExists = () => {
    setSubmitDisable(true);
    isUserPresent(userDetails.email).then((response) => {
      if (response?.users?.length) {
        handleSubmit();
      } else {
        console.log(getNewUser());
        const newUser = getNewUser();
        createUser(newUser).then(
          (res) => {
            console.log(res);
            handleSubmit();
          },
          (err) => {
            setSubmitDisable(false);
          }
        );
      }
    });
  };

  const showToast = (message: string, type: 'success') => {
    const toast = {
      id: Date.now()?.toString(),
      message,
      type,
      duration: 4,
    };
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const onClose = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className="flex justify-center">
      <div className="bg-card w-8/12 rounded-lg border-[1px] p-5">
        <div>
          <div className="flex items-baseline justify-start">
            {RADIO_OPTIONS.map((option) => (
              <div key={option.id} className="mr-4 flex items-center">
                <input
                  type="radio"
                  id={option.id}
                  name="ticketOption"
                  checked={state.selectedType.id === option.id}
                  onChange={() => {
                    handleRadioChange(option.id);
                  }}
                  className="me-1"
                  testid="helpCenter_raiseTicket_radio"
                />
                <label htmlFor={option.id}>{option.title}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <TextInput
            name="ticketTitle"
            id="ticketTitle"
            required
            label="Title"
            aria-describedby={
              getFormControlEror('ticketTitle', raiseTicketsFormState)
                ? `help_center_ticketTitle__error`
                : undefined
            }
            onBlur={() => {
              if (state?.ticketTitle?.length) {
                setFormControlState(
                  'ticketTitle',
                  raiseTicketsFormState,
                  setRaiseTicketsFormState,
                  true,
                  true,
                  undefined
                );
              } else {
                setFormControlState(
                  'ticketTitle',
                  raiseTicketsFormState,
                  setRaiseTicketsFormState,
                  true,
                  false,
                  'Please enter title'
                );
              }
            }}
            value={state.ticketTitle}
            onChange={handleTitleChange}
            type="text"
            testid="helpCenter_raiseTicket_title_textInput"
          />
          {getFormControlEror('ticketTitle', raiseTicketsFormState) && (
            <div
              id={`help_center_ticketTitle__error`}
              className="text-warn mt-2 text-xs"
              role="alert"
            >
              {getFormControlEror('ticketTitle', raiseTicketsFormState)}
            </div>
          )}
        </div>

        <div className="mt-5">
          <TextArea
            label="Description"
            id="description"
            name="description"
            rows={4}
            aria-describedby={
              getFormControlEror('description', raiseTicketsFormState)
                ? `help_center_description_error`
                : undefined
            }
            placeholder=""
            value={state.description}
            onChange={(e) => {
              setState({ ...state, description: e.target.value });
              if (e?.target?.value?.length) {
                setFormControlState(
                  'description',
                  raiseTicketsFormState,
                  setRaiseTicketsFormState,
                  true,
                  true,
                  undefined
                );
              } else {
                setFormControlState(
                  'description',
                  raiseTicketsFormState,
                  setRaiseTicketsFormState,
                  true,
                  false,
                  'Please enter description'
                );
              }
            }}
            onBlur={() => {
              if (state?.description?.length) {
                setFormControlState(
                  'description',
                  raiseTicketsFormState,
                  setRaiseTicketsFormState,
                  true,
                  true,
                  undefined
                );
              } else {
                setFormControlState(
                  'description',
                  raiseTicketsFormState,
                  setRaiseTicketsFormState,
                  true,
                  false,
                  'Please enter description'
                );
              }
            }}
            required
            testid="helpCenter_raiseTicket_description_textArea"
          />
          {getFormControlEror('description', raiseTicketsFormState) && (
            <div
              id={`help_center_description_error`}
              className="text-warn mt-2 text-xs"
              role="alert"
            >
              {getFormControlEror('description', raiseTicketsFormState)}
            </div>
          )}
        </div>
        <div className="mt-5">
          <FileUpload selectedFiles={state.selectedFiles} handleFileChange={handleFileChange} />
        </div>

        <Button
          id="help_center_submit_btn"
          testid="help_center_submit_btn"
          disabled={!state.ticketTitle || !state.description || submitDisable}
          color="primary"
          className="mt-5 p-2"
          onClick={checkIfUserExists}
        >
          Submit your ticket
        </Button>
      </div>

      {rightContent && <div className="mt-0 ml-4 min-w-[200px]">{rightContent}</div>}

      <ToastList
        data={toasts}
        position={'top-right'}
        onClose={onClose}
        onClick={() => console.log('')}
      />
    </div>
  );
}

export default RaiseTickets;
