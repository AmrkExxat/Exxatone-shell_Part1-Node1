import Link from 'next/link';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type StatusBadgeProps, type VariantStyle, type StatusBadgeVariant } from './types';

const variantStyles: Record<StatusBadgeVariant, VariantStyle> = {
  confirmed: {
    bg: 'bg-[#C1FB9B]',
    border: 'border-green-200',
    text: 'text-[#333]',
  },
  compliant: {
    bg: 'bg-[#53d111]',
    border: 'border-green-200',
    text: 'text-[#262626]',
  },
  'not-confirmed': {
    bg: 'bg-[#fee2e2]',
    border: 'border-yellow-200',
    text: 'text-[#333]',
  },
  'non-compliant': {
    bg: 'bg-[#FECACA]',
    border: 'border-orange-200',
    text: 'text-[#333]',
  },
  'not-started': {
    bg: 'bg-[#E5E7EB]',
    border: 'border-gray-300',
    text: 'text-[#333]',
  },
  'action-needed': {
    bg: 'bg-[#FECACA]',
    border: 'border-orange-200',
    text: 'text-[#333]',
  },
  'in-progress': {
    bg: 'bg-[#F8EBDC]',
    border: 'border-blue-200',
    text: 'text-[#333]',
  },
  canceled: {
    bg: 'bg-[#FECACA]',
    border: 'border-red-200',
    text: 'text-[#333]',
  },
  processing: {
    bg: 'bg-red-100',
    border: 'border-red-200',
    text: 'text-red-800',
  },
  revoked: {
    bg: 'bg-[#FECACA]',
    border: 'border-red-200',
    text: 'text-[#333]',
  },
  pending: {
    bg: 'bg-[#FECACA]',
    border: 'border-yellow-200',
    text: 'text-[#333]',
  },
  na: {
    bg: 'bg-[#E5E7EB]',
    border: 'border-gray-300',
    text: 'text-[#333]',
  },
  unprocessed: {
    bg: 'bg-[#FEE2E2]',
    border: 'border-gray-300',
    text: 'text-[#BB1E1F]',
  },
  processed: {
    bg: 'bg-[#98F660]',
    border: 'border-gray-300',
    text: 'text-[#245512]',
  },
};

const badgeBaseClass =
  'inline-flex items-center gap-1 rounded-sm px-2 py-1 text-sm whitespace-nowrap transition-all';

const interactiveClass = 'cursor-pointer hover:brightness-95 active:scale-95';

const BadgeContent = ({
  label,
  showChevron,
  styles,
  interactive,
}: {
  label: string;
  showChevron: boolean;
  styles: VariantStyle;
  interactive: boolean;
}) => (
  <span
    className={[badgeBaseClass, styles.bg, styles.text, interactive ? interactiveClass : '']
      .filter(Boolean)
      .join(' ')}
  >
    {label}
    {showChevron && <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" aria-hidden />}
  </span>
);

const StatusBadge = ({
  label,
  variant,
  href,
  onClick,
  showChevron,
  className,
}: StatusBadgeProps) => {
  const styles = variantStyles[variant];

  const hasChevron = showChevron ?? (href != null || onClick != null);

  if (href != null) {
    return (
      <Link href={href} className={className}>
        <BadgeContent label={label} showChevron={hasChevron} styles={styles} interactive />
      </Link>
    );
  }

  if (onClick != null) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <BadgeContent label={label} showChevron={hasChevron} styles={styles} interactive />
      </button>
    );
  }

  return (
    <span className={className}>
      <BadgeContent label={label} showChevron={hasChevron} styles={styles} interactive={false} />
    </span>
  );
};

export default StatusBadge;
