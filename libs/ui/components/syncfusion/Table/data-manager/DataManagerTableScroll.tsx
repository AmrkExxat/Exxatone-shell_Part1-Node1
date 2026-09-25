import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import React, { useEffect, useRef, useState } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  InfiniteScroll,
  VirtualScroll,
  Selection,
  Sort,
  Reorder,
  Freeze,
  Page,
  Resize,
  ColumnChooser,
} from '@syncfusion/ej2-react-grids';

import classNames from 'classnames';

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NNaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXped3RdRGBfU0B0XUtWYE4='
);

class CustomPostAdaptor extends UrlAdaptor {
  processQuery(dm, query, hierarchyFilters) {
    const request = super.processQuery(dm, query, hierarchyFilters);
    request.data = JSON.stringify(request.data); // convert payload to string
    return request;
  }

  makeRequest(request, deffered, args, query) {
    getInternshipsAction('65d302d9a3e1b0205723025e', {}, 1, 50, '', '')
      .then((data) => deffered.resolve({ result: data.data, count: data.totalCount }))
      .catch((error) => deffered.reject([{ error }]));
  }
}

const InternshipGrid = ({
  siteId,
  columns,
  fetchDataOnScroll,
}: {
  siteId: string;
  columns: any;
  fetchDataOnScroll: () => void;
}) => {
  const gridRef = useRef();
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const dataManager = new DataManager({
    url: 'https://your.api/endpoint',
    adaptor: new CustomPostAdaptor(),
    siteId: siteId,
    fetchDataOnScroll: fetchDataOnScroll,
  });

  const onDataBound = (args, a) => {
    const grid: any = gridRef?.current;

    setLoadedCount(grid?.currentViewData?.length);
    setTotalCount(grid?.totalDataRecordsCount);
    gridRef.current?.hideSpinner();
  };

  const updateVisibleRow = (primaryKey, updatedRowData) => {
    const query = new Query().skip(50).take(100);
    dataManager.executeQuery(query);
  };

  const handleActionBegin = (args) => {
    if (args.requestType === 'infiniteScroll' || args.requestType === 'refresh') {
      gridRef.current?.showSpinner();
    }
    if (args.requestType === 'sorting') {
      const grid = gridRef.current?.ej2_instances[0];
      const sortField = args.columnName;
      const direction = args.direction; // 'Ascending' or 'Descending'

      // Prepare query for DataManager
      const query = new Query()
        .skip(0)
        .take(grid.pageSettings.pageSize)
        .sortBy(sortField, direction.toLowerCase());

      dataManager.executeQuery(query).then((result) => {
        grid.setProperties({ dataSource: result.result }, true);
      });

      args.cancel = true; // Cancel default sort — we're manually fetching data
    }
  };

  const onColumnDragStop = (args) => {
    console.log('Column reordered:', args.column.field, 'to', args.target);
    // You could save new column order in local storage or backend
  };

  const updateColumnOrder = (fromField, toField) => {
    const grid = gridRef.current;

    if (grid) {
      // Move `fromField` column before `toField` column
      grid.reorderColumns(fromField, toField);
    }
  };

  const updateRowAndRefresh = async (id, updatedFields) => {
    const grid = gridRef.current;

    // Get current skip/take (InfiniteScroll paging state)
    const skip = grid.contentModule.startIndex;
    const take = grid.pageSettings.pageSize;

    // 1. Send update to backend (optional, if server needs sync)
    await fetch(`https://api.example.com/data/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    });

    // 2. Re-fetch current page
    const query = new Query().skip(skip).take(take);

    const response = await dataManager.executeQuery(query);

    // 3. Apply new data to grid without resetting scroll
    grid.setProperties({ dataSource: response.result }, true);
  };

  // const updateRowById = (id, updatedData) => {
  // 	// Update loadedDataRef and state
  // 	const idx = loadedDataRef.current.findIndex((item) => item.id === id);
  // 	if (idx === -1) {
  // 		alert(`Row with id ${id} is not loaded currently; cannot update`);
  // 		return;
  // 	}
  // 	// Update data object shallow merge
  // 	loadedDataRef.current[idx] = { ...loadedDataRef.current[idx], ...updatedData };
  // 	setDataSource([...loadedDataRef.current]);
  // 	// Update UI row via gridRef updateRow
  // 	if (gridRef.current) {
  // 		// updatedData might be partial, merge with full data
  // 		const fullUpdatedData = loadedDataRef.current[idx];
  // 		gridRef.current.updateRow(fullUpdatedData);
  // 	}
  // };

  const columns: any = availabilityColumns(
    () => {
      console.log();
    },
    () => {
      console.log();
    },
    () => {
      console.log();
    }
  );

  return (
    <>
      <GridComponent
        ref={gridRef}
        dataSource={dataManager}
        allowSorting={true}
        enableInfiniteScrolling={true}
        height={500}
        allowPaging={false}
        allowReordering={true}
        pageSettings={{ pageSize: 50 }}
        enableVirtualization={false}
        actionBegin={handleActionBegin}
        checkAllRows={false}
        isCheckBoxSelection={false}
        columnDragStop={onColumnDragStop}
        // actionComplete={handleActionComplete}
        selectionSettings={{
          type: 'Multiple',
          mode: 'Both',
          checkboxOnly: true,
          persistSelection: true,
        }}
        dataBound={onDataBound}
        loadingIndicator={{ indicatorType: 'Shimmer' }}
      >
        <ColumnsDirective>
          {checkboxSelection && (
            <ColumnDirective type="checkbox" width="50" freeze="Left"></ColumnDirective>
          )}
          {columns?.map((column) => {
            return (
              <ColumnDirective
                field={column.fieldName}
                headerText={column.headerName}
                minWidth={column.width}
                width={column.width}
                freeze={column?.freeze ?? 'None'}
                clipMode="EllipsisWithTooltip"
                template={column?.renderCell}
              ></ColumnDirective>
            );
          })}
          {/* Add more columns as needed */}
        </ColumnsDirective>
        <Inject
          services={[
            InfiniteScroll,
            VirtualScroll,
            Selection,
            Sort,
            Freeze,
            Page,
            Reorder,
            Resize,
            ColumnChooser,
          ]}
        />
      </GridComponent>
      <div
        className={classNames(
          'flex flex-row items-center justify-end rounded-br-md rounded-bl-md border border-r-0 border-l-0 p-2 text-xs'
        )}
      >
        Showing {loadedCount?.length} of {totalCount} results
      </div>
    </>
  );
};

export default InternshipGrid;
