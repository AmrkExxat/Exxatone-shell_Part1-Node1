/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Chart as ChartJS, ArcElement, type ChartOptions, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartProps } from './types';

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultDoughnutChartOptions: ChartOptions = {
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
};

const DoughnutChart: React.FC<ChartProps> = ({ labels, datasets = [], options }) => {
  const data = {
    labels,
    datasets,
  };

  const chartOptions: ChartOptions = {
    ...defaultDoughnutChartOptions,
    ...options,
    plugins: {
      ...defaultDoughnutChartOptions.plugins,
      ...options?.plugins,
      legend: {
        ...defaultDoughnutChartOptions.plugins?.legend,
        ...options?.plugins?.legend,
      },
    },
  };

  return <Doughnut data={data} options={chartOptions as any} />;
};

export default DoughnutChart;
