/* eslint-disable prettier/prettier */

import { faCircleCheck, faClock, faHexagonExclamation } from '@fortawesome/pro-solid-svg-icons';
import { type StatusDetails } from './types';

const colors = {
  blue: { bg: '#00BCD4', fg: '#FFFFFF', icon: '#FFFFFF' },
  purpleLight: { bg: '#FEFBFF', fg: '#4355B6', icon: '#7789ED' },
  grayLight: { bg: '#F5F7FA', fg: '#495F80', icon: '#ABBACE' },
  redLight: { bg: '#FFEDE9', fg: '#8B3B1F', icon: '#DB7756' },
  purpleDark: { bg: '#FBF8FF', fg: '#47464A', icon: '#929094' },
  greenLight: { bg: '#F0FFE6', fg: '#2F7F0C', icon: '#3DA709' },
  yellowLight: { bg: '#FFFBD7', fg: '#7B7114', icon: '#FFC107' },
  red: { bg: '#FEE2E2', fg: '#981C1D', icon: '#ED4647' },
  purple: { bg: '#E6D6FE', fg: '#262626', icon: '#4355B6' },
  purpleDarkAlt: { bg: '#F8F3FF', fg: '#803AED', icon: '#985CF6' },
  grayDark: { bg: '#F5F7FA', fg: '#495F80', icon: '#ABBACE' },
  redLightAlt: { bg: '#FEF2F2', fg: '#981C1D', icon: '#ED4647' },
  yellow: { bg: '#FDE047', fg: '#854D0E', icon: '#854D0E' },
  blueDark: { bg: '#F0EFFF', fg: '#000000', icon: '#000000' },
  redDark: { bg: '#FCA5A5', fg: '#991B1B', icon: '#991B1B' },
  green: { bg: '#86EFAC', fg: '#000000', icon: '#000000' },
  orange: { bg: '#FDBA74', fg: '#854D0E', icon: '#854D0E' },
  greenAlt: { bg: '#C1FB9B', fg: '#333', icon: '#333' },
  gray: { bg: '#D2D9E5', fg: '#333', icon: '#333' },
  yellowAlt: { bg: '#F8E196', fg: '#333', icon: '#333' },
  grayAlt: { bg: '#A9A9A9', fg: '#333', icon: '#333' },
  laurel: { bg: '#DFFDCA', fg: '#333', icon: '#333' },
  cumin: { bg: '#EFD4B9', fg: '#333', icon: '#333' },
  slate: { bg: '#EBEEF3', fg: '#333', icon: '#333' },
};

const createStatus = (
  label: string,
  colors: { bg: string; fg: string; icon: string },
  icon?: any
): StatusDetails => ({
  label,
  bgColor: colors.bg,
  fgColor: colors.fg,
  iconColor: colors.icon,
  icon,
});

export enum ScheduleStatus {
  NEW = 'new',
  UPDATE = 'update',
  PENDING = 'pending',
  GET_STARTED = 'get-started',
  EXPIRED = 'expired',
  EXPIRING = 'expiring',
  PENDING_REVIEW = 'pending-review',
  REVIEW_IN_PROGRESS = 'review-in-progress',
  APPROVED = 'approved',
  UPLOADED = 'uploaded',
  IN_PROGRESS = 'in-progress',
  DRAFT = 'draft',
  REJECTED = 'rejected',
  NOT_APPROVED = 'not-approved',
  UPLOADING = 'uploading',
  COMPLIANT = 'compliant',
  COMPLIANCE_PENDING = 'compliance-pending',
  NON_COMPLIANT = 'non-compliant',
  FAILED_UPLOAD = 'failed-upload',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum RequestStatus {
  IN_PROGRESS = 'in-progress',
  DRAFT = 'draft',
  DECLINED = 'declined',
  REVOKED = 'revoked',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  IN_PROCESS = 'in-process',
}

export enum AvailabilityStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
  REVOKED = 'revoked',
  APPROVED = 'approved',
  NON_COMPLIANT = 'non-compliant',
  COMPLIANT = 'compliant',
  GET_STARTED = 'get-started',
  NOT_STARTED = 'not-started',
  IN_PROCESS = 'in-process',
  DELETED = 'deleted',
}

export enum HelpStatus {
  NEW = 'new',
  IN_PROGRESS = 'in-progress',
  OPEN = 'open',
  PENDING = 'pending',
  HOLD = 'hold',
  CLOSED = 'closed',
  SOLVED = 'solved',
}

export enum WishlistStatus {
  OPEN = 'open',
  UPCOMING = 'upcoming',
  CLOSED = 'closed',
}

export const ScheduleStatusList: Record<ScheduleStatus, StatusDetails> = {
  [ScheduleStatus.NEW]: createStatus('New', colors.blue),
  [ScheduleStatus.UPDATE]: createStatus('Update', colors.purpleLight),
  [ScheduleStatus.PENDING]: createStatus('Pending', colors.grayLight),
  [ScheduleStatus.GET_STARTED]: createStatus('Get Started', colors.grayLight),
  [ScheduleStatus.EXPIRED]: createStatus('Expired', colors.redLight),
  [ScheduleStatus.EXPIRING]: createStatus('Expiring', colors.redLight),
  [ScheduleStatus.PENDING_REVIEW]: createStatus('Pending Review', colors.purpleDark),
  [ScheduleStatus.REVIEW_IN_PROGRESS]: createStatus('Review In Progress', colors.purpleDark),
  [ScheduleStatus.APPROVED]: createStatus('Approved', colors.greenLight),
  [ScheduleStatus.UPLOADED]: createStatus('Uploaded', colors.greenLight),
  [ScheduleStatus.IN_PROGRESS]: createStatus('In Progress', colors.yellowLight),
  [ScheduleStatus.DRAFT]: createStatus('In Progress', colors.yellowLight),
  [ScheduleStatus.REJECTED]: createStatus('Rejected', colors.red),
  [ScheduleStatus.NOT_APPROVED]: createStatus('Not Approved', colors.red),
  [ScheduleStatus.UPLOADING]: createStatus('Uploading...', colors.purple),
  [ScheduleStatus.COMPLIANT]: createStatus('Ready for placement', colors.greenLight, faCircleCheck),
  [ScheduleStatus.COMPLIANCE_PENDING]: createStatus('Compliance Pending', colors.red),
  [ScheduleStatus.NON_COMPLIANT]: createStatus('Compliance Pending', colors.red),
  [ScheduleStatus.FAILED_UPLOAD]: createStatus(
    'Failed Upload',
    colors.redLightAlt,
    faHexagonExclamation
  ),
  [ScheduleStatus.ONGOING]: createStatus('Ongoing', colors.purpleDarkAlt, faClock),
  [ScheduleStatus.COMPLETED]: createStatus('Completed', colors.grayDark),
  [ScheduleStatus.CANCELLED]: createStatus('Cancelled', colors.red),
};

export const RequestStatusList: Record<RequestStatus, StatusDetails> = {
  [RequestStatus.IN_PROGRESS]: createStatus('Request Pending', colors.yellow),
  [RequestStatus.DRAFT]: createStatus('Review In Progress', colors.blueDark),
  [RequestStatus.DECLINED]: createStatus('Declined', colors.redDark),
  [RequestStatus.REVOKED]: createStatus('Cancelled', colors.redDark),
  [RequestStatus.REJECTED]: createStatus('Declined', colors.redDark),
  [RequestStatus.CANCELLED]: createStatus('Cancelled', colors.redDark),
  [RequestStatus.APPROVED]: createStatus('Approved', colors.green),
  [RequestStatus.IN_PROCESS]: createStatus('In Process', colors.orange),
};

export const AvailabilityStatusList: Record<AvailabilityStatus, StatusDetails> = {
  [AvailabilityStatus.DRAFT]: createStatus('Review In Progress', colors.blueDark),
  [AvailabilityStatus.COMPLETED]: createStatus('Approved', colors.greenAlt),
  [AvailabilityStatus.IN_PROGRESS]: createStatus('Request Pending', colors.blueDark),
  [AvailabilityStatus.REJECTED]: createStatus('Declined', colors.redDark),
  [AvailabilityStatus.CANCELLED]: createStatus('Cancelled', colors.redDark),
  [AvailabilityStatus.ACTIVE]: createStatus('Published', colors.greenAlt),
  [AvailabilityStatus.INACTIVE]: createStatus('Unpublished', colors.gray),
  [AvailabilityStatus.CLOSED]: createStatus('Closed', colors.yellowAlt),
  [AvailabilityStatus.REVOKED]: createStatus('Cancelled', colors.gray),
  [AvailabilityStatus.APPROVED]: createStatus('Approved', colors.greenAlt),
  [AvailabilityStatus.NON_COMPLIANT]: createStatus('Non-Compliant', colors.redDark),
  [AvailabilityStatus.COMPLIANT]: createStatus('Compliant', colors.greenAlt),
  [AvailabilityStatus.GET_STARTED]: createStatus('Get Started', colors.grayAlt),
  [AvailabilityStatus.NOT_STARTED]: createStatus('Not Started', colors.grayAlt),
  [AvailabilityStatus.IN_PROCESS]: createStatus('In Process', colors.blueDark),
  [AvailabilityStatus.DELETED]: createStatus('Deleted', colors.redDark),
};

export const HelpStatusList: Record<HelpStatus, StatusDetails> = {
  [HelpStatus.NEW]: createStatus('New', colors.blue),
  [HelpStatus.IN_PROGRESS]: createStatus('In Progress', colors.yellowAlt),
  [HelpStatus.OPEN]: createStatus('In Progress', colors.yellowAlt),
  [HelpStatus.PENDING]: createStatus('In Progress', colors.yellowAlt),
  [HelpStatus.HOLD]: createStatus('In Progress', colors.yellowAlt),
  [HelpStatus.CLOSED]: createStatus('Closed', colors.greenAlt),
  [HelpStatus.SOLVED]: createStatus('Closed', colors.greenAlt),
};

export const WishlistStatusList: Record<WishlistStatus, StatusDetails> = {
  [WishlistStatus.OPEN]: createStatus('Open', colors.laurel),
  [WishlistStatus.UPCOMING]: createStatus('Upcoming', colors.cumin),
  [WishlistStatus.CLOSED]: createStatus('Closed', colors.slate),
};

export type AllStatusKeys = ScheduleStatus | RequestStatus | AvailabilityStatus | WishlistStatus;
