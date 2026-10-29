/** Site Configuration — secondary nav IA (prod reference) + mock Bedlam site profile. */

export type SiteConfigNavLeaf = {
  id: string;
  label: string;
  /** Path segment under `/site/:siteId/site-configuration/` */
  segment: string;
};

export type SiteConfigNavSection = {
  id: string;
  label: string;
  children?: SiteConfigNavLeaf[];
};

export const SITE_CONFIG_NAV_SECTIONS: SiteConfigNavSection[] = [
  {
    id: 'site-details',
    label: 'Site Details',
    children: [
      { id: 'basic-details', label: 'Basic Details', segment: 'site-details/basic-details' },
      { id: 'designations', label: 'Designations', segment: 'site-details/designations' },
      { id: 'location-grouping', label: 'Location Grouping', segment: 'site-details/location-grouping' },
    ],
  },
  {
    id: 'availability-details',
    label: 'Availability Details',
    children: [
      {
        id: 'discipline-specialization',
        label: 'Discipline & Specialization',
        segment: 'availability-details/discipline-specialization',
      },
      { id: 'program-type', label: 'Program Type', segment: 'availability-details/program-type' },
      { id: 'schedule-details', label: 'Schedule Details', segment: 'availability-details/schedule-details' },
      { id: 'shifts', label: 'Shifts', segment: 'availability-details/shifts' },
    ],
  },
  {
    id: 'program-partners',
    label: 'Program Partners',
    children: [{ id: 'category', label: 'Category', segment: 'program-partners/category' }],
  },
  {
    id: 'configure-activities',
    label: 'Configure Activities/Requirements',
    children: [
      {
        id: 'onboarding-requirements',
        label: 'Onboarding Requirements',
        segment: 'configure-activities/onboarding-requirements',
      },
      {
        id: 'ongoing-activities',
        label: 'Ongoing Activities',
        segment: 'configure-activities/ongoing-activities',
      },
      {
        id: 'offboarding-activities',
        label: 'Offboarding Activities',
        segment: 'configure-activities/offboarding-activities',
      },
    ],
  },
  {
    id: 'notification',
    label: 'Notification',
    children: [
      { id: 'email-setup', label: 'Email Setup', segment: 'notification/email-setup' },
      { id: 'email-templates', label: 'Email Templates', segment: 'notification/email-templates' },
      {
        id: 'attachment-templates',
        label: 'Attachment Templates',
        segment: 'notification/attachment-templates',
      },
      {
        id: 'notification-configuration',
        label: 'Notification Configuration',
        segment: 'notification/notification-configuration',
      },
      {
        id: 'my-notifications',
        label: 'My Notifications',
        segment: 'notification/my-notifications',
      },
    ],
  },
];

export const SITE_CONFIG_DEFAULT_SEGMENT = 'site-details/basic-details';

export function siteConfigPath(siteId: string, segment: string) {
  return `/site/${siteId}/site-configuration/${segment}`;
}

export const MOCK_SITE_BASIC_DETAILS = {
  name: 'Bedlam-Hospital',
  aliasName: 'ED',
  website: 'https://www.exxat.com',
  ein: '11042',
  totalLocations: 133,
  addressLines: [
    '11801 Seven Seas Dr, Suite 401',
    'Orlando, California',
    '32839, US',
  ],
  phoneNumber: '12345',
  siteDescriptionHint: 'This description will be shown to students as part of your job postings',
  aboutUsParagraphs: [
    'Bedlam Hospital is a modern, multidisciplinary healthcare facility committed to delivering high-quality, patient-centered care. With a strong focus on clinical excellence, innovation, and compassionate service, we provide a wide range of medical services across acute care, outpatient treatment, and specialized programs.',
    'Our team of experienced physicians, clinicians, and support staff work collaboratively to ensure the best outcomes for our patients. Equipped with advanced medical technology and a supportive learning environment, Bedlam Hospital also serves as a training ground for students and early-career professionals seeking hands-on clinical experience.',
    'We take pride in fostering a culture of continuous learning, inclusivity, and excellence—making Bedlam Hospital a trusted partner in both patient care and professional development.',
  ],
  footerLinkLabel: 'exxat.com',
  footerLinkHref: 'https://www.exxat.com',
  lastUpdatedBy: 'darp_test@mailinator.com',
  lastUpdatedAt: 'Oct 26, 2026 17:27 PM IST',
};
