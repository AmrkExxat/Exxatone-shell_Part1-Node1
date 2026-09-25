import React, { useEffect, useMemo, useState } from 'react';
import { type SelectedFilter, type FilterProps } from './Filter.types';
import { Select, TreeSelect } from '../Form';
import { Skeleton } from '../Skeleton';
import classNames from 'classnames';

export default function Filter({
  filters,
  onFilterChange,
  reset = false,
  defaultSelectedOptions,
}: FilterProps): JSX.Element {
  const initialState = useMemo<SelectedFilter>(() => {
    if (defaultSelectedOptions !== undefined && !reset) {
      return defaultSelectedOptions;
    }
    return filters.reduce((acc, filter) => {
      return {
        ...acc,
        [filter.filterName]: [],
      };
    }, {});
  }, [filters]);

  useEffect(() => {
    if (reset) setSelectedOptions(initialState);
  }, [reset]);

  const [selectedOptions, setSelectedOptions] = useState<SelectedFilter>(initialState);

  useEffect(() => {
    onFilterChange(selectedOptions);
  }, [selectedOptions, onFilterChange]);

  const handleFilterChange = (filterName: string, selectedValues: any[]) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [filterName]: selectedValues,
    }));
  };

  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-start gap-3">
      {filters.map(
        ({
          id,
          label,
          filterName,
          multiSelect,
          treeSelect,
          placeholder = 'filter',
          filterOptions,
          defaultValue,
          className,
        }) => {
          if (filterOptions === null) {
            <Skeleton type="default" />;
          } else {
            if (treeSelect === undefined || treeSelect === null || treeSelect === false) {
              return (
                <div className="grow" key={filterName}>
                  <Select
                    id={id ?? 'filter_select'}
                    name={filterName}
                    label={label}
                    multiple={multiSelect}
                    placeholder={placeholder}
                    options={filterOptions}
                    onChange={(selectedValue) => {
                      const selected = multiSelect
                        ? selectedValue
                        : filterOptions.find(({ value }: any) => value === selectedValue)
                          ? [
                              {
                                ...filterOptions.find(({ value }: any) => value === selectedValue),
                              },
                            ]
                          : [];
                      handleFilterChange(filterName, selected as any);
                    }}
                    optionsContainerClassName="z-[999]"
                    defaultValues={
                      multiSelect && typeof defaultValue !== 'string' ? defaultValue : []
                    }
                    defaultValue={
                      !multiSelect && typeof defaultValue === 'string' ? defaultValue : undefined
                    }
                    reset={reset}
                  />
                </div>
              );
            } else {
              return (
                <div className={classNames('grow', className)} key={filterName}>
                  <TreeSelect
                    label={label}
                    placeholder={placeholder}
                    options={filterOptions as any[]}
                    defaultValues={defaultValue as string[]}
                    onChange={(selectedNodes: any[]) => {
                      onFilterChange({
                        ...selectedOptions,
                        [filterName]: selectedNodes,
                      });
                    }}
                    reset={reset}
                    optionsContainerClassName="z-[999]"
                  />
                </div>
              );
            }
          }
        }
      )}
    </div>
  );
}
