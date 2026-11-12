import { partnersListChrome, partnersSurfaces } from './schedulesTypography';

export function SchedulesTabPlaceholder({ title }: { title: string }) {
  return (
    <div className={`${partnersListChrome.contentInset} py-8`}>
      <div className={`${partnersSurfaces.card} p-10 text-center`}>
        <h2 className="text-base font-semibold text-[#212121]">{title}</h2>
        <p className="mt-2 text-sm text-[#757575]">
          This view is not built in Part1_Node-1a yet. Use Overview or Schedules List for review.
        </p>
      </div>
    </div>
  );
}
