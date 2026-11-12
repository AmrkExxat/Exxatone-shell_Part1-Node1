import { CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

function ToastCard({
  tone,
  title,
  body,
}: {
  tone: 'info' | 'success';
  title: string;
  body: string;
}) {
  const success = tone === 'success';
  return (
    <div
      className={`flex w-[420px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${
        success ? 'border-[#a5d6a7] bg-[#e8f5e9] text-[#1b5e20]' : 'border-[#e5e7eb] bg-white text-[#212121]'
      }`}
    >
      {success ? (
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
      ) : (
        <Info className="mt-0.5 size-5 shrink-0 text-[#3f51b5]" aria-hidden />
      )}
      <div>
        <p className="text-[14px] font-semibold">{title}</p>
        <p className={`text-[13px] ${success ? '' : 'text-[#616161]'}`}>{body}</p>
      </div>
    </div>
  );
}

export function notifyInfo(title: string, body: string) {
  toast.custom(() => <ToastCard tone="info" title={title} body={body} />);
}

export function notifySuccess(title: string, body: string) {
  toast.custom(() => <ToastCard tone="success" title={title} body={body} />);
}
