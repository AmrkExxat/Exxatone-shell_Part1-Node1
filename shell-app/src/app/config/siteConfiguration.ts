import { prototypeSite } from '../data/prototype/site';

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
      // Attachment Templates: hidden from the nav for now. Route still exists; see routes.tsx.
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
  name: prototypeSite.name,
  aliasName: prototypeSite.aliasName,
  website: prototypeSite.website,
  ein: prototypeSite.ein,
  totalLocations: prototypeSite.totalLocations,
  addressLines: [...prototypeSite.addressLines],
  phoneNumber: prototypeSite.phone,
  siteDescriptionHint: 'Shown to students when they review this site before a placement.',
  aboutUsParagraphs: [...prototypeSite.aboutUsParagraphs],
  footerLinkLabel: prototypeSite.websiteLabel,
  footerLinkHref: prototypeSite.website,
  lastUpdatedBy: prototypeSite.lastUpdatedBy,
  lastUpdatedAt: prototypeSite.lastUpdatedAt,
};
