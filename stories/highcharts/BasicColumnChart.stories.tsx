import type { Meta, StoryObj } from '@storybook/nextjs';
import { BasicColumnChart } from '../../libs/ui/components/highcharts';

const meta = {
  title: 'Highcharts/Basic Column Chart',
  component: BasicColumnChart,
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {
    showDataLabels: {
      control: 'boolean',
      description: 'Show or hide data labels on columns',
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels',
    },
    borderRadius: {
      control: 'text',
      description: 'Border radius for columns',
    },
    groupPadding: {
      control: 'number',
      description: 'Padding between column groups',
    },
  },
} satisfies Meta<typeof BasicColumnChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data for different scenarios
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const singleSeriesData = [
  {
    name: 'Revenue',
    data: [45000, 52000, 48000, 61000, 55000, 67000],
    color: '#7cb5ec',
  },
];

const multipleSeriesData = [
  {
    name: 'Online',
    data: [120, 140, 130, 160, 150, 180],
    color: '#7cb5ec',
  },
  {
    name: 'In-Person',
    data: [80, 90, 85, 110, 100, 120],
    color: '#434348',
  },
  {
    name: 'Hybrid',
    data: [60, 70, 65, 85, 75, 95],
    color: '#90ed7d',
  },
];

const departmentData = [
  {
    name: 'Computer Science',
    data: [450, 480, 520, 490, 510, 540],
    color: '#7cb5ec',
  },
  {
    name: 'Engineering',
    data: [380, 400, 420, 410, 430, 450],
    color: '#434348',
  },
  {
    name: 'Business',
    data: [320, 340, 360, 350, 370, 390],
    color: '#90ed7d',
  },
];

const coursePerformanceData = [
  {
    name: 'Average Score',
    data: [85, 88, 82, 90, 87, 92],
    color: '#7cb5ec',
  },
];

const enrollmentTrendData = [
  {
    name: 'New Enrollments',
    data: [120, 135, 110, 150, 140, 165],
    color: '#7cb5ec',
  },
  {
    name: 'Graduations',
    data: [95, 105, 90, 120, 110, 130],
    color: '#434348',
  },
];

export const Default: Story = {
  args: {
    categories,
    series: singleSeriesData,
    title: 'Monthly Revenue',
    subtitle: 'Fiscal Year 2024',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    tooltipSuffix: ' USD',
    titleFontWeight: '600',
    onPointClick: () => {},
  },
};

export const MultipleSeries: Story = {
  args: {
    categories,
    series: multipleSeriesData,
    title: 'Enrollment by Mode',
    subtitle: 'Monthly Comparison',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    tooltipSuffix: ' students',
  },
};

export const DepartmentComparison: Story = {
  args: {
    categories,
    series: departmentData,
    title: 'Department Enrollment Trends',
    subtitle: 'Current Academic Year',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    tooltipSuffix: ' students',
  },
};

export const CoursePerformance: Story = {
  args: {
    categories,
    series: coursePerformanceData,
    title: 'Course Performance',
    subtitle: 'Average Scores by Month',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Average Score (%)',
    tooltipSuffix: '%',
    yAxisMin: 0,
    yAxisTitle: 'Score (%)',
  },
};

export const EnrollmentTrends: Story = {
  args: {
    categories,
    series: enrollmentTrendData,
    title: 'Enrollment vs Graduation',
    subtitle: 'Monthly Trends',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Count',
    tooltipSuffix: ' students',
  },
};

export const RoundedColumns: Story = {
  args: {
    categories,
    series: singleSeriesData,
    title: 'Monthly Revenue (Rounded)',
    subtitle: 'Fiscal Year 2024',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    tooltipSuffix: ' USD',
    borderRadius: '8px',
  },
};

export const WithoutDataLabels: Story = {
  args: {
    categories,
    series: singleSeriesData,
    title: 'Monthly Revenue',
    subtitle: 'Data Labels Hidden',
    height: 400,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    tooltipSuffix: ' USD',
  },
};

export const CustomGroupPadding: Story = {
  args: {
    categories,
    series: multipleSeriesData,
    title: 'Enrollment by Mode',
    subtitle: 'Custom Group Padding',
    height: 400,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    tooltipSuffix: ' students',
    groupPadding: 0.2,
  },
};

export const LargeChart: Story = {
  args: {
    categories,
    series: departmentData,
    title: 'Large Column Chart',
    subtitle: 'Full Screen Display',
    height: 600,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    tooltipSuffix: ' students',
  },
};
