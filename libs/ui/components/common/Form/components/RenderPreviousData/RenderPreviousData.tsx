import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '../../../Tooltip';
import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { ShowMoreTree } from '../../../ShowMoreTree';

type RenderPreviousDataProps = {
  label: string;
  id: string;
  data?: any;
  previousData?: any;
  dataType?: string;
  icon?: any;
  listSelector?: string;
  isTree?: boolean;
};

const RenderPreviousData: React.FC<RenderPreviousDataProps> = ({
  label,
  id,
  data = null,
  previousData = null,
  dataType = 'string',
  listSelector = 'id',
  isTree = false,
}) => {
  const [canRender, setCanRender] = useState<boolean>(false);

  const renderPreviousData = () => {
    setCanRender(true);
    const element = document.getElementById(id + '_wrapper');
    if (element) {
      element.style.backgroundColor = '#FCF7F0';
    }
  };

  const resetPreviousData = () => {
    setCanRender(false);
    const element = document.getElementById(id + '_wrapper');
    if (element) {
      element.style.backgroundColor = '';
    }
  };

  useEffect(() => {
    if (previousData) {
      if (dataType === 'list') {
        if (previousData?.length) {
          if (previousData?.length !== data?.length) {
            renderPreviousData();
            return;
          } else {
            const prevListSelector = previousData?.map((i) => i?.[listSelector]);
            const currentDataSelector = data?.map((i) => i?.[listSelector]);
            for (let i_id of prevListSelector) {
              if (!currentDataSelector?.includes(i_id)) {
                renderPreviousData();
                return;
              }
            }
          }
        }
      } else if (dataType === 'object') {
        if (previousData?.[listSelector] !== data?.[listSelector]) {
          renderPreviousData();
          return;
        }
      } else {
        if (previousData !== data) {
          renderPreviousData();
          return;
        }
      }
      if (canRender) resetPreviousData();
    }
  }, [previousData, data]);

  const renderTooltipData = () => {
    return (
      <div>
        {dataType === 'string' && <>{previousData}</>}
        {dataType === 'object' && <>{previousData?.label ?? previousData?.[listSelector]}</>}
        {dataType === 'list' && (
          <>
            {isTree ? (
              <ShowMoreTree
                type="list"
                data={previousData}
                selector={['label']}
                showTooltip={true}
                moreTextRequired={false}
                selectorType={'child'}
                renderInline={true}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {previousData?.map((i) => (
                  <div>{i.label ?? i?.[listSelector]}</div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  if (!canRender) {
    return null;
  }
  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="font-semibold text-[#9A472A]">{label}</div>
      <Tooltip
        triggerWrapperClass={'flex'}
        triggerElement={() => (
          <FontAwesomeIcon icon={faCircleInfo} className="h-3 w-3 pr-1" aria-hidden="true" />
        )}
        tooltip={() => (
          <div className="flex flex-col gap-1 p-2">
            <div className="pr-2 font-semibold">Originally requested:</div>
            {renderTooltipData()}
          </div>
        )}
      />
    </div>
  );
};

export default RenderPreviousData;
