import { ReactNode } from 'react';

export type Participant = {
  isCurrentUser: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: ReactNode;
  src?: string;
};

export type ChatItemType = {
  sentBy: string;
  participant: Participant;
  message: string;
};
