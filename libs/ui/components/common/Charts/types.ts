import { ChartOptions } from 'chart.js';

export type ChartProps = {
  labels: string[];
  datasets?: any[];
  options?: ChartOptions;
  onSegmentClick?: (segment: { label: string; value: number; index: number }) => void;
};
