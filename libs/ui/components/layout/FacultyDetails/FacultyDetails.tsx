import React from 'react';

const FacultyDetails = (props: any): JSX.Element => {
  return (
    <>
      <div className="bg-card rounded-md border border-gray-200 pb-2 shadow-sm">
        <div className="flex min-h-[44px] items-center justify-between border-b border-b-gray-200 px-4 py-2">
          <span className="leading-none font-semibold text-gray-900" role="heading" aria-level={3}>
            Clinical Instructor Details
          </span>
        </div>
        <div
          className={`${props?.classWrapper ? props.classWrapper : 'm-4 flex flex-row flex-wrap items-center justify-start gap-12 px-4'}`}
        >
          {props?.faculties?.map((item: any, index: number) => {
            const schoolDetails = props?.universities?.find(
              (school: any) => school.id === item?.oneSchoolId
            );
            return (
              <div key={index} className="flex flex-col items-start justify-start gap-2">
                <span className="text-sm font-semibold break-all">{schoolDetails?.name}</span>
                {typeof item === 'object' && (
                  <div className="flex flex-row items-start justify-start gap-2">
                    <div
                      className={`flex h-[40px] w-[40px] items-center justify-center rounded-full ${props?.isDarkTheme ? 'bg-[#39393C] text-white' : 'bg-[#F1E9FE] text-[#803AED]'} text-center text-sm font-semibold`}
                    >
                      {item?.firstName?.charAt(0)}
                      {item?.lastName?.charAt(0)}
                    </div>
                    <div className="flex flex-col items-start justify-start text-xs">
                      <span className="font-semibold break-all">
                        {item?.firstName} {item?.lastName}
                      </span>
                      <span className="font-light break-all text-gray-400">{item?.phone}</span>
                      <a href={`mailto:${item?.userEmail}`} className="link-text mt-0.5 break-all">
                        {item?.userEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FacultyDetails;
