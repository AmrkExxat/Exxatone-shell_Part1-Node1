import React from 'react';

import { PTLOGO, IYLOGO } from '../assets';

export const CHATITEMS = [
  {
    message:
      'Ryan Which rotation will these be for the students, and do the students have a location preference?',
    sentBy: '2 Month',
    participant: {
      isCurrentUser: true,
      firstName: 'Harvey',
      lastName: 'Specter',
    },
  },

  {
    message:
      'Hi Megan This student lives in South Austin.  This is for our bridge clinical 1. They will have completed spine and LE coursework as well as ABI/vestib, foundation courses, pharm, medical diagnostrics, orthotics/prosthetics, integument. I appreciate your consideration! Jeanne',
    sentBy: '2 Month',
    participant: {
      isCurrentUser: false,
      firstName: 'Mike',
      lastName: 'Ross',
      avatar: <IYLOGO />,
    },
  },

  {
    message: 'Dummy',
    sentBy: '2 Month',
    participant: {
      isCurrentUser: true,
      firstName: 'Harvey',
      lastName: 'Specter',
      avatar: <PTLOGO />,
    },
  },

  {
    message: 'Dummy',
    sentBy: '2 Month',
    participant: {
      isCurrentUser: true,
      firstName: 'Harvey',
      lastName: 'Specter',
      avatar: <PTLOGO />,
    },
  },
  {
    message: 'Dummy',
    sentBy: '2 Month',
    participant: {
      isCurrentUser: false,
      firstName: 'Mike',
      lastName: 'Ross',
    },
  },
];
