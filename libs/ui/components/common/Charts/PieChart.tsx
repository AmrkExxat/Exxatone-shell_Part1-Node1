/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ChartProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const defaultPieChartOptions: ChartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
  maintainAspectRatio: false,
};

const PieChart: React.FC<ChartProps> = ({ labels, datasets = [], options }) => {
  // Check if data is empty or contains only zero values
  const hasData = datasets.some(
    (dataset) =>
      dataset.data && Array.isArray(dataset.data) && dataset.data.some((value) => value > 0)
  );

  // Check if datasets are completely empty (null, undefined, or empty array)
  const isCompletelyEmpty =
    !datasets ||
    datasets.length === 0 ||
    datasets.every(
      (dataset) => !dataset.data || !Array.isArray(dataset.data) || dataset.data.length === 0
    );

  // If completely empty (no labels or no datasets), show red exclamation
  if (isCompletelyEmpty) {
    const emptyData = {
      labels: ['No Data'],
      datasets: [
        {
          label: 'No Data',
          data: [1],
          backgroundColor: ['#F3F4F6'], // gray-100
          borderColor: ['#E5E7EB'], // gray-200
          borderWidth: 1,
        },
      ],
    };

    const emptyChartOptions: ChartOptions = {
      ...defaultPieChartOptions,
      ...options,
      plugins: {
        ...defaultPieChartOptions.plugins,
        ...options?.plugins,
        legend: {
          ...defaultPieChartOptions.plugins?.legend,
          ...options?.plugins?.legend,
          display: false, // Hide legend for completely empty state
        },
        tooltip: {
          enabled: false, // Disable tooltips for empty state
        },
      },
      elements: {
        arc: {
          borderWidth: 0, // Remove borders for cleaner empty state
        },
      },
    };

    // Determine legend position from options
    const legendPosition =
      options?.plugins?.legend?.position ||
      defaultPieChartOptions.plugins?.legend?.position ||
      'bottom';

    // Create layout based on legend position
    if (legendPosition === 'right' || legendPosition === 'left') {
      return (
        <div className="flex items-center space-x-4">
          {legendPosition === 'left' && (
            <div className="flex items-center space-x-2">
              {/* Red circular exclamation icon */}
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500">
                <FontAwesomeIcon icon={faExclamation} className="text-xs text-red-500" />
              </div>
              {/* No data text */}
              <div className="text-sm font-medium text-red-500">No data</div>
            </div>
          )}
          <div className="h-48 flex-1">
            <Pie data={emptyData} options={emptyChartOptions as any} />
          </div>
          {legendPosition === 'right' && (
            <div className="flex items-center space-x-2">
              {/* Red circular exclamation icon */}
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500">
                <FontAwesomeIcon icon={faExclamation} className="text-xs text-red-500" />
              </div>
              {/* No data text */}
              <div className="text-sm font-medium text-red-500">No data</div>
            </div>
          )}
        </div>
      );
    } else {
      // Default to bottom positioning
      return (
        <div className="flex flex-col items-center">
          <div className="h-48 w-full">
            <Pie data={emptyData} options={emptyChartOptions as any} />
          </div>
          <div className="mt-4 flex items-center space-x-2">
            {/* Red circular exclamation icon */}
            <div className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500">
              <FontAwesomeIcon icon={faExclamation} className="text-xs text-red-500" />
            </div>
            {/* No data text */}
            <div className="text-sm font-medium text-red-500">No data</div>
          </div>
        </div>
      );
    }
  }

  // If no data but has labels, show disabled legend
  if (!hasData) {
    const emptyData = {
      labels: labels.length > 0 ? labels : ['No Data'],
      datasets: [
        {
          label: 'No Data',
          data: labels.length > 0 ? new Array(labels.length).fill(1) : [1],
          backgroundColor: new Array(labels.length > 0 ? labels.length : 1).fill('#F3F4F6'), // gray-100
          borderColor: new Array(labels.length > 0 ? labels.length : 1).fill('#E5E7EB'), // gray-200
          borderWidth: 1,
        },
      ],
    };

    const emptyChartOptions: ChartOptions = {
      ...defaultPieChartOptions,
      ...options,
      plugins: {
        ...defaultPieChartOptions.plugins,
        ...options?.plugins,
        legend: {
          ...defaultPieChartOptions.plugins?.legend,
          ...options?.plugins?.legend,
          display: true, // Show legend for empty state
          labels: {
            ...defaultPieChartOptions.plugins?.legend?.labels,
            ...options?.plugins?.legend?.labels,
            color: '#9CA3AF', // gray-400 for disabled appearance
            font: {
              ...defaultPieChartOptions.plugins?.legend?.labels?.font,
              ...options?.plugins?.legend?.labels?.font,
              style: 'italic', // Make text italic to indicate disabled state
            },
            generateLabels: (chart) => {
              const labels = chart.data.labels || [];
              return labels.map((label, index) => ({
                text: `${label} (No data)`,
                fillStyle: '#F3F4F6', // gray-100
                strokeStyle: '#E5E7EB', // gray-200
                lineWidth: 1,
                hidden: false,
                index,
              }));
            },
          },
        },
        tooltip: {
          enabled: false, // Disable tooltips for empty state
        },
      },
      elements: {
        arc: {
          borderWidth: 0, // Remove borders for cleaner empty state
        },
      },
    };

    return <Pie data={emptyData} options={emptyChartOptions as any} />;
  }

  // Normal chart rendering when data exists
  const data = {
    labels,
    datasets,
  };

  const chartOptions: ChartOptions = {
    ...defaultPieChartOptions,
    ...options,
    plugins: {
      ...defaultPieChartOptions.plugins,
      ...options?.plugins,
      legend: {
        ...defaultPieChartOptions.plugins?.legend,
        ...options?.plugins?.legend,
      },
    },
  };

  return <Pie data={data} options={chartOptions as any} />;
};

export default PieChart;
