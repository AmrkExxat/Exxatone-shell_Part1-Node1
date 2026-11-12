import { type ReactNode } from 'react';
import editIcon from '../../../assets/site-configuration/icon-edit.svg';
import uploadCloudIcon from '../../../assets/site-configuration/icon-upload-cloud.svg';
import siteLogoPreview from '../../../assets/site-configuration/site-logo-preview.png';
import { MOCK_SITE_BASIC_DETAILS } from '../../config/siteConfiguration';
import { sc } from './siteConfigurationTokens';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className={sc.fieldLabel}>{label}</p>
      <div>{children}</div>
    </div>
  );
}

export function BasicDetailsPage() {
  const d = MOCK_SITE_BASIC_DETAILS;

  return (
    <div className="pb-1 pt-1">
      <div className={sc.contentGrid}>
        <section className={sc.infoCard}>
          <div className={sc.cardHeader}>
            <h1 className={sc.cardTitle}>Basic Information</h1>
            <button
              type="button"
              aria-label="Edit basic information"
              title="Edit"
              className="inline-flex size-8 min-h-8 min-w-8 items-center justify-center rounded-[6px] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f51b5]"
            >
              <img src={editIcon} alt="" className="size-4" aria-hidden />
            </button>
          </div>
          <div className={sc.cardBody}>
            <div className={sc.fieldGrid}>
              <Field label="Name">
                <p className={sc.fieldValue}>{d.name}</p>
              </Field>
              <Field label="Alias Name">
                <p className={sc.fieldValue}>{d.aliasName}</p>
              </Field>
              <Field label="Website">
                <a href={d.website} className={sc.link} target="_blank" rel="noreferrer">
                  {d.website}
                </a>
              </Field>
              <Field label="EIN">
                <p className={sc.fieldValue}>{d.ein}</p>
              </Field>
              <Field label="Total locations">
                <p className={sc.fieldValue}>{d.totalLocations}</p>
              </Field>
              <Field label="Address">
                <p className={sc.fieldValueDark}>{d.addressLines[0]}</p>
                <p className={sc.fieldValue}>{d.addressLines[1]}</p>
                <p className={sc.fieldValue}>{d.addressLines[2]}</p>
              </Field>
              <Field label="Phone Number">
                <p className={sc.fieldValue}>{d.phoneNumber}</p>
              </Field>
            </div>

            <div className="pt-4">
              <p className={sc.siteDescTitle}>
                Site Description ({d.siteDescriptionHint})
              </p>
              <div className="space-y-2 pl-4 pt-2">
                <p className={sc.aboutTitle}>About Us</p>
                {d.aboutUsParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className={sc.aboutBody}>
                    {paragraph}
                  </p>
                ))}
                <p className="pt-2">
                  <a href={d.footerLinkHref} className={sc.footerLink} target="_blank" rel="noreferrer">
                    {d.footerLinkLabel}
                  </a>
                </p>
              </div>
              <p className={sc.metaFooter}>
                Last updated by {d.lastUpdatedBy} on {d.lastUpdatedAt}
              </p>
            </div>
          </div>
        </section>

        <aside className={sc.rightRail}>
          <div className={sc.logoBlock}>
            <img
              src={siteLogoPreview}
              alt="Site logo: Exxat and Great Place To Work Certified"
              className={sc.logoImage}
            />
          </div>
          <div className={`${sc.uploadCard} mt-4`}>
            <div className={sc.uploadHeader}>
              <h2 className={sc.cardTitle}>Upload Logo</h2>
            </div>
            <div className={sc.uploadBody}>
              <div className={sc.uploadZone}>
                <div className={sc.uploadStack}>
                  <img src={uploadCloudIcon} alt="" className="size-8" aria-hidden />
                  <button type="button" className={sc.uploadLink}>
                    Upload a file
                  </button>
                  <p className={sc.uploadHint}>PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
