import exxatLogo from '../../../../assets/bulk-email/exxat-logo.png';
import type { EmailHeaderLogo } from '../../../config/bulkEmail';
import { bulkEmailDrawer as d } from './bulkEmailDrawer';

function BedlamHospitalLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 80"
      fill="none"
      className={className}
      role="img"
      aria-label="Bedlam Hospital logo"
    >
      <rect x="4" y="8" width="64" height="64" rx="14" fill="#0b5cab" />
      <path d="M28 22h16v14h14v16H44v14H28V52H14V36h14V22z" fill="#ffffff" />
      <text
        x="84"
        y="40"
        fontFamily="Source Sans 3, Helvetica, Arial, sans-serif"
        fontSize="30"
        fontWeight="700"
        fill="#0b2e4f"
      >
        Bedlam Hospital
      </text>
      <text
        x="85"
        y="62"
        fontFamily="Source Sans 3, Helvetica, Arial, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="2.4"
        fill="#5b7a99"
      >
        OKLAHOMA CITY · OK
      </text>
    </svg>
  );
}

function ShareProfileSiteLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460 80"
      fill="none"
      className={className}
      role="img"
      aria-label="Bedlam Health Network logo"
    >
      <circle cx="40" cy="40" r="32" fill="#0f766e" />
      <path d="M40 20c-8 10-14 16-14 24a14 14 0 0028 0c0-8-6-14-14-24z" fill="#ffffff" />
      <circle cx="40" cy="45" r="5" fill="#0f766e" />
      <text
        x="86"
        y="40"
        fontFamily="Source Sans 3, Helvetica, Arial, sans-serif"
        fontSize="28"
        fontWeight="700"
        fill="#134e4a"
      >
        Bedlam Health Network
      </text>
      <text
        x="87"
        y="62"
        fontFamily="Source Sans 3, Helvetica, Arial, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="2.4"
        fill="#4d7c76"
      >
        SHARED PROFILE
      </text>
    </svg>
  );
}

const HEADER_LOGOS: Record<
  Exclude<EmailHeaderLogo, null>,
  { Logo: typeof BedlamHospitalLogo; caption: string }
> = {
  site: { Logo: BedlamHospitalLogo, caption: 'Site logo' },
  shareProfileSite: { Logo: ShareProfileSiteLogo, caption: 'Share Profile site logo' },
};

type Variant = 'compose' | 'preview';

export function EmailHeaderLogoBand({
  logo,
  variant,
  compact = false,
}: {
  logo: EmailHeaderLogo;
  variant: Variant;
  compact?: boolean;
}) {
  if (!logo) return null;
  const { Logo, caption } = HEADER_LOGOS[logo];
  const logoClass = compact
    ? 'h-6 w-auto max-w-[120px]'
    : variant === 'preview'
      ? 'h-9 w-auto max-w-full'
      : 'h-10 w-auto max-w-full';

  if (variant === 'preview') {
    if (compact) return <Logo className={logoClass} />;
    return (
      <div className={d.previewLogoHeader}>
        <Logo className={logoClass} />
      </div>
    );
  }

  return (
    <div className={d.logoBand}>
      <p className={d.logoBandCaption}>Header · {caption}</p>
      <div className={d.logoBandFrame}>
        <Logo className={logoClass} />
      </div>
    </div>
  );
}

export function EmailFooterLogoBand({ show, variant }: { show: boolean; variant: Variant }) {
  if (!show) return null;

  if (variant === 'preview') {
    return (
      <div className={d.previewLogoFooter}>
        <img src={exxatLogo} alt="Exxat logo" className="h-6 w-auto" />
      </div>
    );
  }

  return (
    <div className={d.logoBand}>
      <p className={d.logoBandCaption}>Footer · Exxat logo</p>
      <div className={d.logoBandFrame}>
        <img src={exxatLogo} alt="Exxat logo" className="h-8 w-auto" />
      </div>
    </div>
  );
}
