import { useCallback, useRef, useState } from 'react';
import { X } from 'lucide-react';
import uploadCloudIcon from '../../../../assets/site-configuration/icon-upload-cloud.svg';
import {
  EMAIL_SETUP_LOGO_ACCEPT,
  EMAIL_SETUP_LOGO_MAX_BYTES,
  isValidEmail,
  MOCK_EMAIL_SETUP,
  normalizeEmail,
} from '../../../config/emailSetup';
import { sc } from '../siteConfigurationTokens';
import { es } from './emailSetupTokens';

function ReplyToChipField({
  emails,
  onChange,
}: {
  emails: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitDraft = useCallback(
    (raw: string) => {
      const token = raw.trim().replace(/,$/, '');
      if (!token) return;
      if (!isValidEmail(token)) {
        setError('Enter a valid email address.');
        return;
      }
      const normalized = normalizeEmail(token);
      if (emails.some((e) => normalizeEmail(e) === normalized)) {
        setError('That address is already added.');
        return;
      }
      setError(null);
      onChange([...emails, token.trim()]);
      setDraft('');
    },
    [emails, onChange],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft(draft);
    } else if (e.key === 'Backspace' && draft === '' && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  };

  return (
    <div className={es.fieldStack}>
      <div
        className={`${es.fieldWidth} ${es.controlShell} ${es.chipField}`}
        role="group"
        aria-label="Default reply-to addresses"
        onClick={() => inputRef.current?.focus()}
      >
        {emails.map((email) => (
          <span key={email} className={es.chip}>
            <span className="max-w-[240px] truncate">{email}</span>
            <button
              type="button"
              className={es.chipRemove}
              aria-label={`Remove ${email}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(emails.filter((item) => item !== email));
              }}
            >
              <X className="size-3" strokeWidth={2} aria-hidden />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          inputMode="email"
          value={draft}
          placeholder={emails.length === 0 ? 'Add reply-to address…' : 'Add another…'}
          className={es.chipInput}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => commitDraft(draft)}
        />
      </div>
      <p className={es.fieldHint}>Press Enter or comma to add</p>
      {error ? <p className={es.errorHint}>{error}</p> : null}
    </div>
  );
}

export function EmailSetupPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(MOCK_EMAIL_SETUP.displayName);
  const [replyTo, setReplyTo] = useState<string[]>(MOCK_EMAIL_SETUP.replyTo);
  const [footer, setFooter] = useState(MOCK_EMAIL_SETUP.footerDisclaimer);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const canSave = displayName.trim().length > 0;

  const handleLogoPick = (file: File | undefined) => {
    if (!file) return;
    setLogoError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['png', 'jpg', 'jpeg', 'svg'];
    if (!ext || !allowed.includes(ext)) {
      setLogoError('Use PNG, JPG, or SVG.');
      return;
    }
    if (file.size > EMAIL_SETUP_LOGO_MAX_BYTES) {
      setLogoError('Logo must be 2 MB or smaller.');
      return;
    }
    if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!canSave) return;
    setSaved(true);
  };

  return (
    <div className={`${sc.font} pb-1 pt-1`}>
      <div className={sc.infoCard}>
        <div className="space-y-8 p-6">
          <header className="space-y-2">
            <h1 className={sc.cardTitle}>Email Setup</h1>
            <p className={es.pageIntro}>
              Set the display name that recipients see in the From field of email notifications from
              your site, plus default reply-to and branding used across outgoing mail.
            </p>
          </header>

          <section className={es.block} aria-labelledby="email-setup-display-name-label">
            <label id="email-setup-display-name-label" htmlFor="email-setup-display-name" className={es.fieldLabel}>
              Email Display Name
            </label>
            <div className={`${es.fieldWidth} ${es.controlShell}`}>
              <input
                id="email-setup-display-name"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setSaved(false);
                }}
                className={es.textInputInner}
              />
            </div>
            <p className={es.fieldHint}>Recipients see this as the sender name.</p>
          </section>

          <section className={`${es.block} ${es.blockDivider}`} aria-labelledby="email-setup-reply-to-label">
            <div className="space-y-1">
              <p id="email-setup-reply-to-label" className={es.fieldLabel}>
                Default Reply-To
              </p>
              <p className={es.fieldIntro}>
                Tenant-wide fallback. Individual templates can override this.
              </p>
            </div>
            <ReplyToChipField
              emails={replyTo}
              onChange={(next) => {
                setReplyTo(next);
                setSaved(false);
              }}
            />
          </section>

          <section className={`${es.block} ${es.blockDivider}`} aria-labelledby="email-setup-branding-label">
            <div className="space-y-1">
              <p id="email-setup-branding-label" className={es.fieldLabel}>
                Tenant Branding
              </p>
              <p className={es.fieldIntro}>
                Logo appears in the email header. Footer text is appended to every outgoing email.
              </p>
            </div>
            <div className={`${es.fieldStack} ${es.fieldWidth}`}>
              <span className={es.fieldLabel}>Tenant Logo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept={EMAIL_SETUP_LOGO_ACCEPT}
                className="hidden"
                onChange={(e) => {
                  handleLogoPick(e.target.files?.[0]);
                  e.target.value = '';
                  setSaved(false);
                }}
              />
              <button
                type="button"
                className={es.uploadZone}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleLogoPick(e.dataTransfer.files?.[0]);
                  setSaved(false);
                }}
              >
                <div className={sc.uploadStack}>
                  {logoPreviewUrl ? (
                    <img
                      src={logoPreviewUrl}
                      alt=""
                      className="max-h-16 max-w-full object-contain"
                    />
                  ) : (
                    <img src={uploadCloudIcon} alt="" className="size-8" aria-hidden />
                  )}
                  <span className={es.uploadTitle}>Click to upload or drag &amp; drop</span>
                  <span className={es.uploadHint}>PNG, JPG, SVG · Max 2 MB</span>
                  {logoFile ? <span className={es.uploadFileName}>{logoFile.name}</span> : null}
                </div>
              </button>
              {logoError ? <p className={es.errorHint}>{logoError}</p> : null}
            </div>
            <div className={`${es.fieldStack} ${es.fieldWidth}`}>
              <label htmlFor="email-setup-footer" className={es.fieldLabel}>
                Footer / Disclaimer
              </label>
              <textarea
                id="email-setup-footer"
                value={footer}
                onChange={(e) => {
                  setFooter(e.target.value);
                  setSaved(false);
                }}
                className={es.textArea}
              />
              <p className={es.charCount}>{footer.length} characters</p>
            </div>
          </section>

          <div className={es.saveRow}>
            {saved ? (
              <p className={`${es.savedBanner} ${es.fieldWidth}`} role="status">
                Settings saved (prototype — not persisted).
              </p>
            ) : null}
            <button type="button" className={es.btnPrimary} disabled={!canSave} onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
