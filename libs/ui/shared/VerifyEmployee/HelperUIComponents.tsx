export const OtpInfoBox = ({ email }: { email: string }) => (
  <div className="mt-4 flex flex-col justify-start gap-1 rounded-md border p-2 text-left text-[12px]">
    <span>Verification will be sent to:</span>
    <span className="font-semibold">{email}</span>
  </div>
);

export const WarningBox = () => (
  <div className="flex flex-col justify-start gap-1 rounded-md bg-orange-50 p-2 text-left text-[12px] text-[#D97706]">
    <span className="font-semibold">
      Submitting a false institutional email or misrepresenting your identity is a serious violation
    </span>
    <span>If found impersonating:</span>
    <ul className="list-inside list-disc">
      <li>You may be permanently blocked from the Exxat platform</li>
      <li>The clinical site may disqualify you from the placement</li>
      <li>Your eligibility for future employment at this site could be permanently impacted</li>
    </ul>
    <span>
      This information may be shared with the site for verification. Proceed only if you are an
      active employee of the selected institution.
    </span>
  </div>
);

export const HelpTextBox = () => (
  <div className="flex flex-col justify-start gap-1 rounded-md bg-slate-50 p-2 text-left text-[12px]">
    <span className="font-semibold">Need help?</span>
    <span>
      If your email domain is not listed, please contact support. You can also proceed with standard
      onboarding and contact your administrator to update your employment status later.
    </span>
  </div>
);
