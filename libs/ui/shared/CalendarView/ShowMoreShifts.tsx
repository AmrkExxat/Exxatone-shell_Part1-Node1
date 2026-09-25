'use client';

const ShowMoreShifts = ({ rowData }: { rowData: any[] }): JSX.Element => {
  return (
    <span className="line-clamp-1 text-xs">
      {rowData?.[0]?.name} {rowData?.length > 1 && `+${rowData?.length - 1}`}
    </span>
  );
};

export default ShowMoreShifts;
