/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import {
  Chart as ChartJS,
  BarElement,
  type ChartOptions,
  Tooltip,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartProps } from './types';

ChartJS.register(BarElement, Tooltip, CategoryScale, LinearScale);

const defaultStackChartOptions: ChartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 25,
      },
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
    },
  },
};

const StackBarChart: React.FC<ChartProps> = ({ labels, datasets = [], options }) => {
  const data = {
    labels,
    datasets,
  };

  const chartOptions: ChartOptions = {
    ...defaultStackChartOptions,
    ...options,
    plugins: {
      ...defaultStackChartOptions.plugins,
      ...options?.plugins,
      legend: {
        ...defaultStackChartOptions.plugins?.legend,
        ...options?.plugins?.legend,
      },
    },
    scales: {
      ...defaultStackChartOptions.scales,
      ...options?.scales,
      x: {
        ...defaultStackChartOptions.scales?.x,
        ...options?.scales?.x,
      } as any,
      y: {
        ...defaultStackChartOptions.scales?.y,
        ...options?.scales?.y,
      } as any,
    },
  };

  return <Bar options={chartOptions as any} data={data} />;
};

export default StackBarChart;
