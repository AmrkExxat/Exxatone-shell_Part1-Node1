/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  type ChartOptions,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartProps } from './types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const defaultVerticalChartOptions: ChartOptions = {
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
      grid: {
        display: false,
      },
      display: false,
    },
  },
};

const VerticalBarChart: React.FC<ChartProps> = ({ labels, datasets = [], options }) => {
  const data = {
    labels,
    datasets,
  };

  const chartOptions: ChartOptions = {
    ...defaultVerticalChartOptions,
    ...options,
    plugins: {
      ...defaultVerticalChartOptions.plugins,
      ...options?.plugins,
      legend: {
        ...defaultVerticalChartOptions.plugins?.legend,
        ...options?.plugins?.legend,
      },
    },
    scales: {
      ...defaultVerticalChartOptions.scales,
      ...options?.scales,
      x: {
        ...defaultVerticalChartOptions.scales?.x,
        ...options?.scales?.x,
      } as any,
      y: {
        ...defaultVerticalChartOptions.scales?.y,
        ...options?.scales?.y,
      } as any,
    },
  };

  return <Bar options={chartOptions as any} data={data} />;
};

export default VerticalBarChart;
