import { ChatItemType } from './types';

export const getParticipantTitle = (participant: ChatItemType['participant']): string => {
  const { firstName, lastName, email } = participant || {};

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return email || 'Unknown Participant';
};

export const getParticipantInitials = (participant: ChatItemType['participant']): string => {
  let initials = '';

  const { firstName, lastName } = participant || {};

  if (firstName && lastName) {
    initials = `${firstName?.charAt(0)?.toUpperCase()}${lastName?.charAt(0)?.toUpperCase()}`;
  }

  return initials;
};
