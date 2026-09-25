import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

import { ThemeDecorator } from '../ThemeDecorator';
import { Button, Modal } from '../../libs/ui';

const meta = {
  title: 'Common/Modal',
  component: Modal,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof Modal>;

export const ModalStory: Story = {
  render: () => {
    const [modalOpen, setModalOpen] = useState(false);

    const onPrimaryAction = () => {
      setModalOpen(false);
    };

    return (
      <div className="flex flex-row items-center justify-center">
        <Button
          id="modal-btn"
          variant="flat"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Open Modal
        </Button>
        <Modal
          id="modal"
          title="Are you sure you want to remove the entity?"
          primaryAction="Add any text"
          secondaryAction="Cancel"
          onSecondary={() => {
            setModalOpen(false);
          }}
          OnPrimary={onPrimaryAction}
          primaryButtonVariant="flat"
          secondaryButtonVariant="stroked"
          open={modalOpen}
          setOpen={setModalOpen}
        />
      </div>
    );
  },
};

export const WithHeading: Story = {
  render: () => {
    const [modalOpen, setModalOpen] = useState(false);

    const onPrimaryAction = () => {
      setModalOpen(false);
    };

    return (
      <div className="flex flex-row items-center justify-center">
        <Button
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Open Modal
        </Button>
        <Modal
          id="modal"
          title="Heading"
          description="In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is"
          primaryAction="Add any text"
          secondaryAction="Cancel"
          onSecondary={() => {
            setModalOpen(false);
          }}
          OnPrimary={onPrimaryAction}
          open={modalOpen}
          setOpen={setModalOpen}
          primaryButtonVariant="flat"
          secondaryButtonVariant="stroked"
        />
      </div>
    );
  },
};

export const CustomTemplate: Story = {
  render: () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
      <div className="flex flex-row items-center justify-center">
        <Button
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Open Modal
        </Button>
        <Modal id="modal" open={modalOpen} setOpen={setModalOpen}>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-x-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Name</span>
                <span className="text-sm">Adaptial - Easton</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Alias Name</span>
                <span className="text-sm">--</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Phone</span>
                <span className="text-sm">(303) 196-2491</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Address</span>
                <span className="text-sm">2464 Royal Ln. Mesa, New Jersey 45463</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
              <Button
                variant="stroked"
                color="warn"
                id="modal_cancel_btn"
                testid="modal_cancel_btn"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="flat"
                color="primary"
                id="modal_confirmed_btn"
                testid="modal_confirmed_btn"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
