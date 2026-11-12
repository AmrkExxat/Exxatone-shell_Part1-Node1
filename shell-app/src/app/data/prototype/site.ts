/** One site identity for the prototype. Pages should read this instead of inventing a hospital. */

export const prototypeSite = {
  id: 'bedlam-hospital',
  name: 'Bedlam Hospital',
  aliasName: 'BH',
  website: 'https://www.bedlamhospital.org',
  websiteLabel: 'bedlamhospital.org',
  ein: '52-1843902',
  phone: '(410) 555-2400',
  totalLocations: 4,
  addressLines: ['700 West Pratt Street', 'Baltimore, Maryland', '21201, US'],
  city: 'Baltimore, MD',
  aboutUsParagraphs: [
    'Bedlam Hospital is a 420-bed teaching hospital in downtown Baltimore. Clinical education placements run across medical-surgical units, the emergency department, rehabilitation, and outpatient clinics.',
    'Nursing students arrive in cohort blocks. Physical therapy students are scheduled one at a time with a named preceptor. Coordinators, preceptors, and school partners all work from the same placement records in Exxat One.',
    'The clinical education office confirms schedules, tracks onboarding, and sends placement mail from one address so schools and students see a single sender.',
  ],
  clinicalEducationName: 'Bedlam Hospital Clinical Education',
  senderName: 'Kierra Mango',
  senderEmail: 'kierra.mango@bedlamhospital.org',
  replyTo: 'clinical.placements@bedlamhospital.org',
  fromEmail: 'noreply@exxat.com',
  hospitalName: 'Bedlam Hospital',
  loginUrl: 'https://app.exxat.com/login',
  footerDisclaimer:
    'This email was sent by Bedlam Hospital Clinical Education via Exxat One. For questions, contact clinical.placements@bedlamhospital.org.',
  lastUpdatedBy: 'Kierra Mango',
  lastUpdatedAt: 'Oct 26, 2026, 5:27 PM',
} as const;

export const prototypeLauncherSites = [
  { id: prototypeSite.id, name: prototypeSite.name, location: prototypeSite.city },
  { id: 'pratt-clinic', name: 'Pratt Street Clinic', location: 'Baltimore, MD' },
  { id: 'green-spring-surgery', name: 'Green Spring Surgery Center', location: 'Baltimore, MD' },
  { id: 'patapsco-community', name: 'Patapsco Community Hospital', location: 'Baltimore, MD' },
] as const;
