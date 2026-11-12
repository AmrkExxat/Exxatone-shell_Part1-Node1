import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '../../components/ui/sheet';
import { studentsOf } from '../../data/prototype/clearanceLogic';
import type { PrototypeScheduleRecord } from '../../data/prototype/scheduleRecords';
import { partnersFont } from '../partners/partnersTypography';

export type MessageTab = 'school' | 'students' | 'instructors' | 'preceptors';

function named(value: string) {
  const text = value.trim();
  return text !== '' && text !== '—' && text !== '-' && text !== 'Pending';
}

export function messageTabs(schedule: PrototypeScheduleRecord): { id: MessageTab; label: string }[] {
  const tabs: { id: MessageTab; label: string }[] = [{ id: 'school', label: 'School' }];
  if (studentsOf(schedule).length) tabs.push({ id: 'students', label: 'Students' });
  if (named(schedule.clinicalInstructor)) tabs.push({ id: 'instructors', label: 'Clinical instructors' });
  if (named(schedule.preceptor)) tabs.push({ id: 'preceptors', label: 'Preceptors' });
  return tabs;
}

type Message = { id: string; tab: MessageTab; text: string };

export function MessagesPanel({ schedule }: { schedule: PrototypeScheduleRecord }) {
  const tabs = messageTabs(schedule);
  const [tab, setTab] = useState<MessageTab>(tabs[0].id);
  const [text, setText] = useState('');
  const [sendTo, setSendTo] = useState<Record<MessageTab, boolean>>({
    school: true,
    students: false,
    instructors: false,
    preceptors: false,
  });
  const [receivedOpen, setReceivedOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const activeTab = tabs.some((item) => item.id === tab) ? tab : tabs[0].id;
  const visible = messages.filter((message) => message.tab === activeTab);
  const canSend = text.trim().length > 0 && tabs.some((item) => sendTo[item.id]);

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3 text-left text-[13px] text-[#424242]"
        aria-expanded={receivedOpen}
        onClick={() => setReceivedOpen((open) => !open)}
      >
        Message received during track requests
        <ChevronDown className={`size-4 ${receivedOpen ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {receivedOpen ? <p className="px-4 py-3 text-[13px] text-[#757575]">No messages yet.</p> : null}
      <div className="flex gap-4 overflow-x-auto border-b border-[#e5e7eb] px-4" role="tablist" aria-label="Message recipients">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTab === item.id}
            onClick={() => setTab(item.id)}
            className={`shrink-0 py-2 text-[13px] font-medium ${
              activeTab === item.id ? 'border-b-2 border-[#3f51b5] text-[#3f51b5]' : 'text-[#616161]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="min-h-[120px] flex-1 px-4 py-3">
        {visible.length ? (
          <ul className="flex flex-col gap-2">
            {visible.map((message) => (
              <li key={message.id} className="rounded-md bg-[#f5f6fc] px-3 py-2 text-[13px] text-[#212121]">
                {message.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-[#757575]">No messages yet.</p>
        )}
      </div>
      <div className="border-t border-[#e5e7eb] px-4 py-3">
        <p className="text-[12px] font-medium text-[#616161]">Send to</p>
        <div className="mt-1 flex flex-wrap gap-3 text-[13px] text-[#424242]">
          {tabs.map((item) => (
            <label key={item.id} className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={sendTo[item.id]}
                onChange={(event) => setSendTo((current) => ({ ...current, [item.id]: event.target.checked }))}
              />
              {item.label}
            </label>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          placeholder="Type your message here..."
          className="mt-2 w-full resize-none rounded-md border border-[#e5e7eb] px-3 py-2 text-[13px] outline-none focus:border-[#3f51b5]"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            disabled={!canSend}
            className="h-8 rounded-md bg-[#3f51b5] px-3 text-[13px] font-medium text-white disabled:opacity-40"
            onClick={() => {
              const next = tabs
                .filter((item) => sendTo[item.id])
                .map((item) => ({ id: `${Date.now()}-${item.id}`, tab: item.id, text: text.trim() }));
              setMessages((current) => [...next, ...current]);
              setText('');
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export function MessageDrawer({
  schedule,
  onOpenChange,
}: {
  schedule: PrototypeScheduleRecord | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={!!schedule} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`${partnersFont} w-full gap-0 p-0 sm:max-w-[400px]`}>
        {schedule ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-[#e5e7eb] px-4 py-3 pr-12">
              <SheetTitle className="text-[16px] font-semibold text-[#212121]">Messages</SheetTitle>
              <span className="rounded bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#424242]">{schedule.scheduleId}</span>
            </div>
            <MessagesPanel key={schedule.id} schedule={schedule} />
          </div>
        ) : (
          <SheetTitle className="sr-only">Messages</SheetTitle>
        )}
      </SheetContent>
    </Sheet>
  );
}
