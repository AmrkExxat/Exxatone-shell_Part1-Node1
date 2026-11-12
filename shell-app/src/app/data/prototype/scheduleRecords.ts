/**
 * Placement records shared by Schedules and Onboarding and Schedule Clearance.
 * Line items follow Site Clearance Prototype V2.1. Columns that prototype omitted
 * (availability, shift, days, preceptor, clinical instructor) are filled here.
 */

export type ScheduleTimeline = 'upcoming' | 'current' | 'completed';
export type OnboardingStatus =
  | 'Compliant'
  | 'Some Action Needed'
  | 'Not Started'
  | 'Not Applicable'
  | 'Not Compliant';
export type RequirementStatus = 'Approved' | 'Pending Review' | 'Get Started';
export type ClearanceItemState = 'Completed' | 'Not Started';

export type ScheduleRequirement = {
  name: string;
  status: RequirementStatus;
  due: string;
  mandatory: boolean;
};

export type ClearanceEntry = {
  status: ClearanceItemState;
};

export type ClearanceHistoryEntry = {
  who: string;
  what: string;
  when: string;
};

export type SchedulePerson = {
  id: string;
  role: 'student' | 'ci';
  name: string;
  email: string;
  onboardingStatus: OnboardingStatus;
  employeeStatus: 'Non-employee' | 'Employee';
  flagged?: boolean;
  requirements: ScheduleRequirement[];
  clearance: Record<string, ClearanceEntry>;
  history: { who: string; what: string; when: string }[];
};

export type PrototypeScheduleRecord = {
  id: string;
  scheduleId: string;
  kind: 'group' | 'individual';
  /** Rotation or group name shown under the schedule ID. */
  title: string;
  schoolName: string;
  availability: string;
  location: string;
  address: string;
  durationLabel: string;
  discipline: string;
  shift: string;
  daysOfWeek: string;
  preceptor: string;
  clinicalInstructor: string;
  programType: string;
  scheduleStatus: string;
  scheduleStatusNote?: string;
  timeline: ScheduleTimeline;
  people: SchedulePerson[];
  schoolRequirements: ScheduleRequirement[];
  groupClearance: Record<string, ClearanceEntry>;
  groupHistory: ClearanceHistoryEntry[];
  /** One note for the whole clearance checklist. */
  clearanceNote?: string;
  clearanceFiles: string[];
  clearanceHistory: ClearanceHistoryEntry[];
};

const req = (
  name: string,
  status: RequirementStatus,
  due: string,
  mandatory = true,
): ScheduleRequirement => ({ name, status, due, mandatory });

function studentReqs(onboarding: OnboardingStatus, due: string): ScheduleRequirement[] {
  const map: Record<OnboardingStatus, RequirementStatus[]> = {
    Compliant: ['Approved', 'Approved', 'Approved', 'Approved'],
    'Some Action Needed': ['Approved', 'Pending Review', 'Get Started', 'Approved'],
    'Not Started': ['Get Started', 'Get Started', 'Get Started', 'Get Started'],
    'Not Applicable': ['Get Started', 'Get Started', 'Get Started', 'Get Started'],
    'Not Compliant': ['Get Started', 'Pending Review', 'Get Started', 'Approved'],
  };
  const m = map[onboarding];
  return [
    req('Covid-19 vaccination', m[0], due),
    req('Background check', m[1], due),
    req('Tuberculosis (TB)', m[2], due),
    req('HIPAA Training', m[3], due, false),
  ];
}

function done(ids: string[]): Record<string, ClearanceEntry> {
  const clearance: Record<string, ClearanceEntry> = {};
  ids.forEach((id) => {
    clearance[id] = { status: 'Completed' };
  });
  return clearance;
}

function student(
  id: string,
  name: string,
  email: string,
  onboarding: OnboardingStatus,
  due: string,
  completed: string[],
  flagged = false,
): SchedulePerson {
  return {
    id,
    role: 'student',
    name,
    email,
    onboardingStatus: onboarding,
    employeeStatus: 'Non-employee',
    flagged,
    requirements: studentReqs(onboarding, due),
    clearance: done(completed),
    history: [],
  };
}

function instructor(
  id: string,
  name: string,
  email: string,
  completed: string[],
): SchedulePerson {
  return {
    id,
    role: 'ci',
    name,
    email,
    onboardingStatus: 'Compliant',
    employeeStatus: 'Employee',
    requirements: [
      req('Covid-19 vaccination', 'Approved', 'Dec 15, 2026'),
      req('Clinical instructor license', 'Approved', 'Dec 15, 2026'),
    ],
    clearance: done(completed),
    history: [],
  };
}

const schoolPair = (a: RequirementStatus, b: RequirementStatus): ScheduleRequirement[] => [
  req('Affiliation agreement on file', a, 'Nov 03, 2026'),
  req('Discipline specific requirement', b, 'Nov 03, 2026'),
];

const rawSchedules: Array<
  Omit<PrototypeScheduleRecord, 'clearanceFiles' | 'clearanceHistory' | 'clearanceNote'> & {
    clearanceNote?: string;
    clearanceFiles?: string[];
    clearanceHistory?: ClearanceHistoryEntry[];
  }
> = [
  {
    id: 'SCH-1000',
    scheduleId: 'SCH-1000',
    kind: 'individual',
    title: '1Y-EastCoast-PTASpr2027',
    schoolName: 'Stanford Medical Education',
    availability: '1Y-EastCoast-PTASpr2027',
    location: 'Sep Location 1',
    address: '78 rd, cal, C',
    durationLabel: 'Jan 04, 2027 – Jan 28, 2027',
    discipline: 'Art Therapy',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: 'Lena Ortiz, ATR',
    clinicalInstructor: '—',
    programType: 'Masters',
    scheduleStatus: 'Confirmed',
    timeline: 'upcoming',
    people: [
      student(
        'p-jessica',
        'Jessica Vid',
        'jessica.vid@stanford.edu',
        'Compliant',
        'Dec 04, 2026',
        ['badge'],
        true,
      ),
    ],
    schoolRequirements: schoolPair('Approved', 'Pending Review'),
    groupClearance: {},
    groupHistory: [],
    clearanceNote: 'Photo taken at the Security desk. Badge printed and waiting for pickup.',
    clearanceFiles: ['badge_photo_jessica_vid.jpg'],
    clearanceHistory: [
      {
        who: 'Priya Raman',
        what: 'Uploaded badge_photo_jessica_vid.jpg to “Badge Creation”',
        when: 'Oct 21, 2026, 11:20 AM',
      },
      {
        who: 'Priya Raman',
        what: 'Added a note to “Badge Creation”',
        when: 'Oct 21, 2026, 11:18 AM',
      },
      {
        who: 'Daniel Okafor',
        what: 'Checked “Badge Creation”',
        when: 'Oct 21, 2026, 11:05 AM',
      },
    ],
  },
  {
    id: 'SCH-1010',
    scheduleId: 'SCH-1010',
    kind: 'individual',
    title: '1Y-EastCoast-PTASpr2027',
    schoolName: 'Stanford Medical Education',
    availability: '1Y-EastCoast-PTASpr2027',
    location: 'Sep Location 1',
    address: '78 rd, cal, C',
    durationLabel: 'Jan 04, 2027 – Jan 28, 2027',
    discipline: 'Art Therapy',
    shift: 'Day',
    daysOfWeek: 'Mon – Thu',
    preceptor: 'Lena Ortiz, ATR',
    clinicalInstructor: '—',
    programType: 'Masters',
    scheduleStatus: 'Confirmed',
    timeline: 'upcoming',
    people: [
      student('p-jamie', 'Jamie Johnson', 'jamie.johnson@university.edu', 'Compliant', 'Dec 04, 2026', [
        'badge',
        'workday',
        'parking',
      ]),
    ],
    schoolRequirements: schoolPair('Approved', 'Approved'),
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1005',
    scheduleId: 'SCH-1005',
    kind: 'group',
    title: 'Art Therapy Group',
    schoolName: 'Metro Allied Health',
    availability: 'Art Therapy Group',
    location: 'Community Hospital',
    address: '12 Elm St, Houston, MA',
    durationLabel: 'Jan 15, 2027 – Mar 15, 2027',
    discipline: 'Art Therapy',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: 'Hannah Brooks, ATR',
    clinicalInstructor: 'Mike Ross',
    programType: 'Masters',
    scheduleStatus: 'Confirmed',
    timeline: 'upcoming',
    people: [
      student('p-kevin', 'Kevin Brown', 'kevin.brown@university.edu', 'Some Action Needed', 'Dec 15, 2026', []),
      student('p-priya', 'Priya Shah', 'priya.shah@university.edu', 'Compliant', 'Dec 15, 2026', []),
      student('p-marcus', 'Marcus Lee', 'marcus.lee@university.edu', 'Compliant', 'Dec 15, 2026', []),
      instructor('p-mike', 'Mike Ross', 'mike.ross@metroallied.edu', []),
    ],
    schoolRequirements: schoolPair('Pending Review', 'Approved'),
    groupClearance: { workday: { status: 'Completed' } },
    groupHistory: [],
    clearanceNote: 'Preceptor access request sent for Mike Ross. Waiting on IT.',
    clearanceFiles: [],
    clearanceHistory: [],
  },
  {
    id: 'SCH-1002',
    scheduleId: 'SCH-1002',
    kind: 'individual',
    title: '',
    schoolName: 'University of Health Sciences',
    availability: 'Med-Surg Clinical',
    location: 'Memorial Regional Hospital',
    address: '400 Main St, Denver, CO',
    durationLabel: 'Nov 02, 2026 – Feb 15, 2027',
    discipline: 'Nursing',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: 'Elena Vasquez, RN',
    clinicalInstructor: '—',
    programType: 'BSN',
    scheduleStatus: 'Confirmed',
    timeline: 'upcoming',
    people: [
      student('p-emily', 'Emily Davis', 'emily.davis@university.edu', 'Some Action Needed', 'Nov 16, 2026', [
        'badge',
        'workday',
      ]),
    ],
    schoolRequirements: [],
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1009',
    scheduleId: 'SCH-1009',
    kind: 'individual',
    title: '',
    schoolName: 'Metro Allied Health',
    availability: 'Outpatient Rehabilitation',
    location: 'Providence Medical Center',
    address: '9 Oak Ave, Austin, TX',
    durationLabel: 'Oct 05, 2026 – Dec 18, 2026',
    discipline: 'Occupational Therapy',
    shift: 'Day',
    daysOfWeek: 'Tue – Fri',
    preceptor: 'James Porter, OT',
    clinicalInstructor: '—',
    programType: 'Masters',
    scheduleStatus: 'Confirmed',
    timeline: 'current',
    people: [
      student(
        'p-jmartinez',
        'Jessica Martinez',
        'jessica.martinez@university.edu',
        'Some Action Needed',
        'Sep 21, 2026',
        ['badge', 'workday', 'parking', 'epic'],
        true,
      ),
    ],
    schoolRequirements: [],
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1003',
    scheduleId: 'SCH-1003',
    kind: 'individual',
    title: '',
    schoolName: 'Metro Allied Health',
    availability: 'Acute Care OT',
    location: 'Regional Health Partners',
    address: '22 Pine Rd, Boston, MA',
    durationLabel: 'Oct 19, 2026 – Jan 15, 2027',
    discipline: 'Occupational Therapy',
    shift: 'Day',
    daysOfWeek: 'Mon – Thu',
    preceptor: 'Priya Anand, OT',
    clinicalInstructor: '—',
    programType: 'Masters',
    scheduleStatus: 'Confirmed',
    timeline: 'current',
    people: [
      student('p-lisa', 'Lisa Richardson', 'lisa.richardson@university.edu', 'Compliant', 'Oct 05, 2026', [
        'workday',
      ]),
    ],
    schoolRequirements: schoolPair('Approved', 'Approved'),
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1014',
    scheduleId: 'SCH-1014',
    kind: 'group',
    title: 'Summer 2027 Group Rotation',
    schoolName: 'State College of Nursing',
    availability: 'Summer 2027 Group Rotation',
    location: 'Providence Medical Center',
    address: '9 Oak Ave, Austin, TX',
    durationLabel: 'Jun 01, 2027 – Aug 30, 2027',
    discipline: 'Physical Therapy',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: 'Lisa Hammond, PT',
    clinicalInstructor: 'Dr. Anil Patel',
    programType: 'DPT',
    scheduleStatus: 'Confirmed',
    timeline: 'upcoming',
    people: [
      student('p-ava', 'Ava Thompson', 'ava.thompson@statecollege.edu', 'Compliant', 'May 15, 2027', []),
      student('p-noah', 'Noah Garcia', 'noah.garcia@statecollege.edu', 'Compliant', 'May 15, 2027', []),
      {
        ...instructor('p-anil', 'Dr. Anil Patel', 'anil.patel@statecollege.edu', []),
        requirements: [
          req('Covid-19 vaccination', 'Approved', 'May 15, 2027'),
          req('Clinical instructor license', 'Approved', 'May 15, 2027'),
        ],
      },
    ],
    schoolRequirements: schoolPair('Approved', 'Approved'),
    groupClearance: {
      workday: { status: 'Completed' },
      test: { status: 'Completed' },
    },
    groupHistory: [{ who: 'Grace Kim', what: 'Group cleared', when: 'May 20, 2027, 10:02 AM' }],
  },
  {
    id: 'SCH-1004',
    scheduleId: 'SCH-1004',
    kind: 'individual',
    title: '',
    schoolName: 'State College of Nursing',
    availability: 'Pediatric Nursing Clinical',
    location: "St. Mary's Medical Center",
    address: '1 Hill St, Denver, CO',
    durationLabel: 'Mar 15, 2027 – Jun 15, 2027',
    discipline: 'Nursing',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: 'Pending',
    clinicalInstructor: '—',
    programType: 'BSN',
    scheduleStatus: 'Confirmed',
    timeline: 'upcoming',
    people: [
      student('p-michelle', 'Michelle Lee', 'michelle.lee@university.edu', 'Not Started', 'Mar 01, 2027', []),
    ],
    schoolRequirements: [],
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1007',
    scheduleId: 'SCH-1007',
    kind: 'individual',
    title: '',
    schoolName: 'University of Health Sciences',
    availability: 'Community Health Nursing',
    location: "St. Mary's Medical Center",
    address: '1 Hill St, Denver, CO',
    durationLabel: 'Mar 01, 2026 – May 30, 2026',
    discipline: 'Nursing',
    shift: 'Day',
    daysOfWeek: 'Mon – Thu',
    preceptor: 'Pat Rivera, RN',
    clinicalInstructor: '—',
    programType: 'BSN',
    scheduleStatus: 'Confirmed',
    timeline: 'completed',
    people: [
      student(
        'p-alexandra',
        'Alexandra Miller',
        'alexandra.miller@university.edu',
        'Compliant',
        'Feb 15, 2026',
        ['badge', 'workday', 'parking', 'epic'],
      ),
    ],
    schoolRequirements: [],
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1001',
    scheduleId: 'SCH-1001',
    kind: 'individual',
    title: 'University Clinical Rotation 002',
    schoolName: 'State College of Nursing',
    availability: 'University Clinical Rotation 002',
    location: 'Providence Medical Center',
    address: '9 Oak Ave, Austin, TX',
    durationLabel: 'Jun 01, 2027 – Aug 30, 2027',
    discipline: 'Physical Therapy',
    shift: '—',
    daysOfWeek: '—',
    preceptor: 'Pending',
    clinicalInstructor: '—',
    programType: 'DPT',
    scheduleStatus: 'Not Confirmed',
    scheduleStatusNote: 'Pending since 3 days',
    timeline: 'upcoming',
    people: [
      student('p-taylor', 'Taylor Nguyen', 'taylor.nguyen@university.edu', 'Not Applicable', 'May 15, 2027', []),
    ],
    schoolRequirements: [],
    groupClearance: {},
    groupHistory: [],
  },
  {
    id: 'SCH-1011',
    scheduleId: 'SCH-1011',
    kind: 'individual',
    title: '1Y-EastCoast-PTASpr2027',
    schoolName: 'Stanford Medical Education',
    availability: '1Y-EastCoast-PTASpr2027',
    location: 'Sep Location 1',
    address: '78 rd, cal, C',
    durationLabel: 'Jan 04, 2027 – Jan 28, 2027',
    discipline: 'Art Therapy',
    shift: 'Day',
    daysOfWeek: 'Mon – Fri',
    preceptor: '—',
    clinicalInstructor: '—',
    programType: 'Masters',
    scheduleStatus: 'Cancelled',
    scheduleStatusNote: 'School: Student withdrew',
    timeline: 'upcoming',
    people: [
      student('p-sarah', 'Sarah Smith', 'sarah.smith@university.edu', 'Compliant', 'Dec 04, 2026', [], true),
    ],
    schoolRequirements: [],
    groupClearance: {},
    groupHistory: [],
  },
];

export const prototypeScheduleRecords: PrototypeScheduleRecord[] = rawSchedules.map((row) => ({
  clearanceFiles: [],
  clearanceHistory: [],
  ...row,
}));

export const prototypeRecentActivities = [
  {
    id: 'ra1',
    text: 'Jessica Vid confirmed for 1Y-EastCoast-PTASpr2027',
    discipline: 'Art Therapy',
    location: 'Sep Location 1',
    updatedOn: 'Oct 21, 2026',
    updatedBy: 'Priya Raman',
    variant: 'updated' as const,
  },
  {
    id: 'ra2',
    text: 'Sarah Smith schedule cancelled — student withdrew',
    discipline: 'Art Therapy',
    location: 'Sep Location 1',
    updatedOn: 'Oct 18, 2026',
    updatedBy: 'Kierra Mango',
    variant: 'cancelled' as const,
  },
  {
    id: 'ra3',
    text: 'Summer 2027 Group Rotation orientation booked',
    discipline: 'Physical Therapy',
    location: 'Providence Medical Center',
    updatedOn: 'May 20, 2027',
    updatedBy: 'Grace Kim',
    variant: 'updated' as const,
  },
  {
    id: 'ra4',
    text: 'Emily Davis onboarding still needs a document',
    discipline: 'Nursing',
    location: 'Memorial Regional Hospital',
    updatedOn: 'Oct 12, 2026',
    updatedBy: 'Daniel Okafor',
    variant: 'updated' as const,
  },
  {
    id: 'ra5',
    text: 'Art Therapy Group roster updated at Community Hospital',
    discipline: 'Art Therapy',
    location: 'Community Hospital',
    updatedOn: 'Oct 09, 2026',
    updatedBy: 'Hannah Brooks',
    variant: 'updated' as const,
  },
];
