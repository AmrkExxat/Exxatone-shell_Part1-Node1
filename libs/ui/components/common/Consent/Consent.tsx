'use client';

import { Logo } from './ConsentUtils';
import { useRef, useState } from 'react';
import Notifications, { NotificationFunction } from '../Notifications/Notifications';
import { Button } from '../Buttons';
import { Spinner } from '../Spinner';

interface ConsentPageProps {
  setConsent: (e: boolean) => void;
  privacyPolicyUrl?: string;
  termsOfUseUrl?: string;
  updateConsent: (e: string) => any;
  oneProfileId: string;
}

export default function ConsentPage({
  setConsent,
  privacyPolicyUrl = 'https://exxat.com/privacy-policy/',
  termsOfUseUrl = 'https://exxat.com/terms-of-use/',
  updateConsent,
  oneProfileId,
}: ConsentPageProps) {
  const notificationRef = useRef<NotificationFunction>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const onAccept = async () => {
    setLoading(true);
    try {
      const res = await updateConsent(oneProfileId);
      if (res?.success) {
        setConsent?.(true);
      } else {
        notificationRef.current?.handleNotification({
          show: true,
          message: 'Something went wrong',
          description: '',
          colorCode: 'error',
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-card flex min-h-screen w-full items-center justify-center px-4">
      <Notifications ref={notificationRef} />
      <div className="w-full max-w-sm space-y-5">
        <img src={Logo} alt="Exxat" width={48} height={48} />

        <p className="text-sm leading-relaxed text-neutral-500">
          By clicking accept, you confirm to create an account with ExxatOne and that you have read
          and understood ExxatOne&apos;s{' '}
          <a
            href={privacyPolicyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            privacy policy
          </a>{' '}
          and{' '}
          <a
            href={termsOfUseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            terms of use
          </a>
          .
        </p>

        <Button
          onClick={onAccept}
          id="accept_consent"
          testid="accept_consent"
          aria-label="Accept"
          variant="flat"
          disabled={loading}
          color="primary"
          className="w-full"
        >
          <div className="flex items-center justify-between gap-2">
            {loading ? <Spinner size="xs" /> : <span>Accept</span>}
          </div>
        </Button>
      </div>
    </div>
  );
}
