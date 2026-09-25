import React from 'react';
import RenderActivationStatusLegend from './RenderActivationStatusLegend';

const RenderStatus = ({ student, i }: { student: any; i: number }) => {
  return (
    <div key={`${student?.id}_${i}`} className={`truncate-content`}>
      <RenderActivationStatusLegend active={student?.usrViewedAt?.length > 0 ? true : false} />
    </div>
  );
};

function RenderActivationStatus({
  row,
  forGroupAssignment = false,
}: {
  row: any;
  forGroupAssignment?: boolean;
}) {
  if (forGroupAssignment) {
    if (row && row?.memberType === 'student' && row?.students?.length > 0) {
      return row.students.map((student: any, i: number) => {
        return <RenderStatus student={student} i={i} />;
      });
    } else {
      return <div className="invisible h-2.5 w-2.5"></div>;
    }
  } else {
    if (row && row?.assignees?.length > 0) {
      return row.assignees.map((student: any, i: number) => {
        return <RenderStatus student={student} i={i} />;
      });
    } else {
      return <div className="invisible h-2.5 w-2.5"></div>;
    }
  }
}

export default RenderActivationStatus;
