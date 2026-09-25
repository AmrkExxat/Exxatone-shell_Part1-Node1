import React, { useEffect, useState } from 'react';
import { type NotificationConfigurationObject } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tailwindUtils from '../../../utilities/utils/tailwind.utils';
import { cloneDeep } from 'lodash';

const NotificationConfig = ({
  defaultConfig,
  onChange,
  emailRequired = false,
}: {
  defaultConfig: NotificationConfigurationObject[];
  onChange: (value: any) => void;
  emailRequired?: boolean;
}): JSX.Element => {
  const [config, setConfig] = useState<any[]>([]);

  useEffect(() => {
    let updatedConfig = cloneDeep(defaultConfig);
    updatedConfig = updateParentNode(updatedConfig);
    setConfig(updatedConfig);
  }, [defaultConfig]);

  const updateParentNode = (config: any) => {
    let updatedConfig = cloneDeep(config);
    for (let i = 0; i < updatedConfig.length; i++) {
      if (updatedConfig[i].children?.length) {
        let inAppStatus = getParentStatus(updatedConfig[i].children, 'inApp');
        updatedConfig[i]['inAppindeterminate'] = false;
        if (inAppStatus === 'unchecked') {
          updatedConfig[i]['checkedApp'] = false;
        } else if (inAppStatus === 'checked') {
          updatedConfig[i]['checkedApp'] = true;
        } else if (inAppStatus === 'indeterminate') {
          updatedConfig[i]['inAppindeterminate'] = true;
        }
        let emailStatus = getParentStatus(updatedConfig[i].children, 'email');
        updatedConfig[i]['emailindeterminate'] = false;
        if (emailStatus === 'unchecked') {
          updatedConfig[i]['checkedEmail'] = false;
        } else if (emailStatus === 'checked') {
          updatedConfig[i]['checkedEmail'] = true;
        } else if (emailStatus === 'indeterminate') {
          updatedConfig[i]['emailindeterminate'] = true;
        }
      }
    }
    return updatedConfig;
  };

  const getParentStatus = (node, type) => {
    let status = 'unchecked';
    let filteredList = node.filter((i) => i[type]);
    if (filteredList.length === node.length) {
      status = 'checked';
    } else if (filteredList.length === 0) {
      status = 'unchecked';
    } else if (filteredList.length < node.length) {
      status = 'indeterminate';
    }
    return status;
  };

  const parentChange = (e: any, index: number, type: string) => {
    let updatedConfig = cloneDeep(config);
    if (type === 'email') {
      updatedConfig[index]['emailindeterminate'] = false;
      updatedConfig[index]['checkedEmail'] = e;
    } else if (type === 'inApp') {
      updatedConfig[index]['inAppindeterminate'] = false;
      updatedConfig[index]['checkedApp'] = e;
    }
    if (updatedConfig[index]?.children?.length) {
      for (let i = 0; i < updatedConfig[index].children.length; i++) {
        if (type === 'email') {
          updatedConfig[index].children[i][type] = e;
        }
        if (type === 'inApp') {
          updatedConfig[index].children[i][type] = e;
        }
      }
    }
    setConfig(updatedConfig);
    onChange(updatedConfig);
  };

  const childChange = (e: any, index: number, parentIndex: number, type: string) => {
    let updatedConfig = cloneDeep(config);
    updatedConfig[parentIndex].children[index][type] = e;
    updatedConfig = updateParentNode(updatedConfig);
    setConfig(updatedConfig);
    onChange(updatedConfig);
  };

  const currentNode = (conf, index, parentIndex?) => {
    let fontSize = { fontSize: conf.isChild ? '0.9rem' : '1rem' };
    return (
      <React.Fragment key={index}>
        <tr className={conf.isChild ? 'pl-8' : ''}>
          <td
            className={`${conf.isChild ? 'px-4 py-2' : 'border-b px-4 pt-5 pb-2 font-semibold'} border-gray-200 text-gray-800`}
            style={fontSize}
          >
            <div className="flex items-center space-x-4">
              {conf.icon ? (
                <FontAwesomeIcon icon={conf.icon} className="text-xl text-gray-600" />
              ) : (
                <div className="w-[25px]"></div>
              )}
              <div>
                <div
                  role={`${!conf?.isChild ? 'heading' : ''}`}
                  aria-level={`${!conf?.isChild ? 3 : ''}`}
                  className={`${!conf?.isChild ? 'font-semibold' : ''} text-gray-800`}
                >
                  {conf.heading}
                </div>
                {conf.subHeading && <div className="text-sm text-gray-600">{conf.subHeading}</div>}
              </div>
            </div>
          </td>
          <td
            className={`${conf.isChild ? 'px-4 py-2' : 'border-b px-4 pt-5 pb-2'} border-gray-200 text-center`}
          >
            <input
              type="checkbox"
              aria-label={conf.heading}
              checked={
                conf.isChild
                  ? conf.inApp
                    ? conf.inApp
                    : false
                  : conf.checkedApp
                    ? conf.checkedApp
                    : false
              }
              disabled={conf.disabled}
              onChange={(e) => {
                if (!conf.isChild) {
                  parentChange(e.target.checked, index, 'inApp');
                } else {
                  childChange(e.target.checked, index, parentIndex, 'inApp');
                }
              }}
              ref={(el) => {
                if (el && conf.inAppindeterminate !== undefined) {
                  el.indeterminate = conf.inAppindeterminate;
                }
              }}
              className={tailwindUtils.classNames(
                'form-checkbox h-5 w-5 rounded-[3px]',
                conf.disabled
                  ? 'pointer-events-none cursor-not-allowed text-gray-400'
                  : 'text-primary'
              )}
            />
          </td>
          {emailRequired && (
            <td
              className={`${conf.isChild ? 'px-4 py-2' : 'border-b px-4 pt-5 pb-2'} border-gray-200 text-center`}
            >
              <input
                type="checkbox"
                aria-label={conf.heading}
                checked={
                  conf.isChild
                    ? conf.email
                      ? conf.email
                      : false
                    : conf.checkedEmail
                      ? conf.checkedEmail
                      : false
                }
                onChange={(e) => {
                  if (!conf.isChild) {
                    parentChange(e.target.checked, index, 'email');
                  } else {
                    childChange(e.target.checked, index, parentIndex, 'email');
                  }
                }}
                ref={(el) => {
                  if (el && conf.emailindeterminate !== undefined) {
                    el.indeterminate = conf.emailindeterminate;
                  }
                }}
                disabled={conf.emailDisabled}
                className={tailwindUtils.classNames(
                  'form-checkbox h-5 w-5 rounded-[3px]',
                  conf.emailDisabled
                    ? 'pointer-events-none cursor-not-allowed text-gray-400'
                    : 'text-primary'
                )}
              />
            </td>
          )}
        </tr>
        {conf.children?.length > 0 && (
          <>{conf.children.map((subConf, subIndex) => currentNode(subConf, subIndex, index))}</>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="p-2">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="text-left">
            <th className="pt-1 text-gray-800"></th>
            <th className="pt-1 text-center text-sm text-gray-800">In App</th>
            {emailRequired && <th className="pt-1 text-center text-sm text-gray-800">Email</th>}
          </tr>
        </thead>
        <tbody>
          {config?.length > 0 && <>{config.map((conf, index) => currentNode(conf, index))}</>}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationConfig;
