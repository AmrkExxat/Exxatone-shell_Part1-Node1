import type { Meta, StoryObj } from '@storybook/nextjs';
import { ComboChart } from '../../libs/ui/components/highcharts';

const meta = {
  title: 'Highcharts/Combo Chart',
  component: ComboChart,
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showLegend: {
      control: 'boolean',
      description: 'Show or hide the legend',
    },
    showDataLabels: {
      control: 'boolean',
      description: 'Show or hide data labels',
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels',
    },
    tooltipShared: {
      control: 'boolean',
      description: 'Use shared tooltip for all series',
    },
  },
} satisfies Meta<typeof ComboChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data for different scenarios
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const enrollmentAndRevenueData = [
  {
    name: 'Enrollment',
    data: [
      { name: 'Jan', y: 120 },
      { name: 'Feb', y: 140 },
      { name: 'Mar', y: 130 },
      { name: 'Apr', y: 160 },
      { name: 'May', y: 150 },
      { name: 'Jun', y: 180 },
    ],
    color: '#7cb5ec',
    type: 'column',
  },
  {
    name: 'Revenue',
    data: [
      { name: 'Jan', y: 45000 },
      { name: 'Feb', y: 52000 },
      { name: 'Mar', y: 48000 },
      { name: 'Apr', y: 61000 },
      { name: 'May', y: 55000 },
      { name: 'Jun', y: 67000 },
    ],
    color: '#434348',
    type: 'line',
    yAxis: 1,
    lineWidth: 2,
    marker: { enabled: true, radius: 4 },
  },
];

const temperatureAndPrecipitationData = [
  {
    name: 'Temperature (°C)',
    data: [
      { name: 'Jan', y: 5 },
      { name: 'Feb', y: 7 },
      { name: 'Mar', y: 12 },
      { name: 'Apr', y: 18 },
      { name: 'May', y: 22 },
      { name: 'Jun', y: 26 },
    ],
    color: '#f7a35c',
    type: 'line',
    lineWidth: 2,
    marker: { enabled: true, radius: 4 },
  },
  {
    name: 'Precipitation (mm)',
    data: [
      { name: 'Jan', y: 80 },
      { name: 'Feb', y: 65 },
      { name: 'Mar', y: 90 },
      { name: 'Apr', y: 110 },
      { name: 'May', y: 95 },
      { name: 'Jun', y: 70 },
    ],
    color: '#7cb5ec',
    type: 'column',
  },
];

const coursePerformanceData = [
  {
    name: 'Average Score',
    data: [
      { name: 'Jan', y: 85 },
      { name: 'Feb', y: 88 },
      { name: 'Mar', y: 82 },
      { name: 'Apr', y: 90 },
      { name: 'May', y: 87 },
      { name: 'Jun', y: 92 },
    ],
    color: '#90ed7d',
    type: 'line',
    marker: { enabled: true, radius: 5 },
    lineWidth: 3,
  },
  {
    name: 'Students Enrolled',
    data: [
      { name: 'Jan', y: 150 },
      { name: 'Feb', y: 160 },
      { name: 'Mar', y: 155 },
      { name: 'Apr', y: 180 },
      { name: 'May', y: 170 },
      { name: 'Jun', y: 190 },
    ],
    color: '#7cb5ec',
    type: 'column',
  },
];

const websiteMetricsData = [
  {
    name: 'Page Views',
    data: [
      { name: 'Jan', y: 15000 },
      { name: 'Feb', y: 18000 },
      { name: 'Mar', y: 16000 },
      { name: 'Apr', y: 22000 },
      { name: 'May', y: 20000 },
      { name: 'Jun', y: 25000 },
    ],
    color: '#7cb5ec',
    type: 'column',
  },
  {
    name: 'Conversion Rate (%)',
    data: [
      { name: 'Jan', y: 2.5 },
      { name: 'Feb', y: 3.1 },
      { name: 'Mar', y: 2.8 },
      { name: 'Apr', y: 3.5 },
      { name: 'May', y: 3.2 },
      { name: 'Jun', y: 3.8 },
    ],
    color: '#f15c80',
    type: 'line',
    yAxis: 1,
    marker: { enabled: true, radius: 4 },
  },
];

const facultyWorkloadData = [
  {
    name: 'Teaching Hours',
    data: [
      { name: 'Jan', y: 120 },
      { name: 'Feb', y: 130 },
      { name: 'Mar', y: 125 },
      { name: 'Apr', y: 140 },
      { name: 'May', y: 135 },
      { name: 'Jun', y: 150 },
    ],
    color: '#7cb5ec',
    type: 'column',
  },
  {
    name: 'Research Hours',
    data: [
      { name: 'Jan', y: 80 },
      { name: 'Feb', y: 75 },
      { name: 'Mar', y: 85 },
      { name: 'Apr', y: 70 },
      { name: 'May', y: 80 },
      { name: 'Jun', y: 65 },
    ],
    color: '#434348',
    type: 'column',
  },
  {
    name: 'Productivity Index',
    data: [
      { name: 'Jan', y: 85 },
      { name: 'Feb', y: 88 },
      { name: 'Mar', y: 82 },
      { name: 'Apr', y: 90 },
      { name: 'May', y: 87 },
      { name: 'Jun', y: 92 },
    ],
    color: '#90ed7d',
    type: 'line',
    yAxis: 1,
    marker: { enabled: true, radius: 4 },
    lineWidth: 2,
  },
];

const budgetData = [
  {
    name: 'Budget Allocated',
    data: [
      { name: 'Jan', y: 500000 },
      { name: 'Feb', y: 520000 },
      { name: 'Mar', y: 480000 },
      { name: 'Apr', y: 550000 },
      { name: 'May', y: 530000 },
      { name: 'Jun', y: 580000 },
    ],
    color: '#7cb5ec',
    type: 'column',
  },
  {
    name: 'Budget Spent',
    data: [
      { name: 'Jan', y: 450000 },
      { name: 'Feb', y: 480000 },
      { name: 'Mar', y: 460000 },
      { name: 'Apr', y: 520000 },
      { name: 'May', y: 500000 },
      { name: 'Jun', y: 540000 },
    ],
    color: '#434348',
    type: 'column',
  },
  {
    name: 'Utilization Rate (%)',
    data: [
      { name: 'Jan', y: 90 },
      { name: 'Feb', y: 92 },
      { name: 'Mar', y: 96 },
      { name: 'Apr', y: 95 },
      { name: 'May', y: 94 },
      { name: 'Jun', y: 93 },
    ],
    color: '#f7a35c',
    type: 'line',
    yAxis: 1,
    marker: { enabled: true, radius: 4 },
  },
];

export const Default: Story = {
  args: {
    series: enrollmentAndRevenueData,
    categories,
    title: 'Enrollment vs Revenue',
    subtitle: 'Monthly Comparison',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    yAxisSecondaryTitle: 'Revenue ($)',
    tooltipShared: true,
    onPointClick: () => {},
  },
};

export const TemperatureAndPrecipitation: Story = {
  args: {
    series: temperatureAndPrecipitationData,
    categories,
    title: 'Temperature vs Precipitation',
    subtitle: 'Monthly Weather Data',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Precipitation (mm)',
    yAxisSecondaryTitle: 'Temperature (°C)',
    tooltipShared: true,
  },
};

export const CoursePerformance: Story = {
  args: {
    series: coursePerformanceData,
    categories,
    title: 'Course Performance vs Enrollment',
    subtitle: 'Academic Metrics',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    yAxisSecondaryTitle: 'Average Score (%)',
    tooltipShared: true,
  },
};

export const WebsiteMetrics: Story = {
  args: {
    series: websiteMetricsData,
    categories,
    title: 'Website Performance',
    subtitle: 'Page Views vs Conversion Rate',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Page Views',
    yAxisSecondaryTitle: 'Conversion Rate (%)',
    tooltipShared: true,
  },
};

export const FacultyWorkload: Story = {
  args: {
    series: facultyWorkloadData,
    categories,
    title: 'Faculty Workload Analysis',
    subtitle: 'Hours vs Productivity',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Hours',
    yAxisSecondaryTitle: 'Productivity Index',
    tooltipShared: true,
  },
};

export const BudgetAnalysis: Story = {
  args: {
    series: budgetData,
    categories,
    title: 'Budget Analysis',
    subtitle: 'Allocated vs Spent vs Utilization',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Budget ($)',
    yAxisSecondaryTitle: 'Utilization Rate (%)',
    tooltipShared: true,
  },
};

export const WithoutLegend: Story = {
  args: {
    series: enrollmentAndRevenueData,
    categories,
    title: 'Enrollment vs Revenue',
    subtitle: 'Legend Hidden',
    height: 400,
    showLegend: false,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    yAxisSecondaryTitle: 'Revenue ($)',
    tooltipShared: true,
  },
};

export const LargeChart: Story = {
  args: {
    series: facultyWorkloadData,
    categories,
    title: 'Large Combo Chart',
    subtitle: 'Full Screen Display',
    height: 600,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Hours',
    yAxisSecondaryTitle: 'Productivity Index',
    tooltipShared: true,
  },
};

export const NoDataFound: Story = {
  args: {
    series: [],
    categories: [],
    title: 'Monthly Inflow of Requests',
    subtitle: 'Last 12 months view',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Requests Count',
    yAxisSecondaryTitle: 'Slots Count',
    tooltipShared: true,
    titleFontSize: '15px',
    titleFontWeight: '600',
  },
};
