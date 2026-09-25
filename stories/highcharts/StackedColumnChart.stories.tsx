import type { Meta, StoryObj } from '@storybook/nextjs';
import { StackedColumnChart } from '../../libs/ui/components/highcharts';

const meta = {
  title: 'Highcharts/Stacked Column Chart',
  component: StackedColumnChart,
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
      description: 'Show or hide data labels on columns',
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels',
    },
  },
} satisfies Meta<typeof StackedColumnChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data for different scenarios
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const enrollmentByModeData = [
  {
    name: 'Online',
    data: [
      { name: 'Jan', y: 120 },
      { name: 'Feb', y: 140 },
      { name: 'Mar', y: 130 },
      { name: 'Apr', y: 160 },
      { name: 'May', y: 150 },
      { name: 'Jun', y: 180 },
    ],
    color: '#7cb5ec',
    stack: 'total',
  },
  {
    name: 'In-Person',
    data: [
      { name: 'Jan', y: 80 },
      { name: 'Feb', y: 90 },
      { name: 'Mar', y: 85 },
      { name: 'Apr', y: 110 },
      { name: 'May', y: 100 },
      { name: 'Jun', y: 120 },
    ],
    color: '#434348',
    stack: 'total',
  },
  {
    name: 'Hybrid',
    data: [
      { name: 'Jan', y: 60 },
      { name: 'Feb', y: 70 },
      { name: 'Mar', y: 65 },
      { name: 'Apr', y: 85 },
      { name: 'May', y: 75 },
      { name: 'Jun', y: 95 },
    ],
    color: '#90ed7d',
    stack: 'total',
  },
];

const departmentEnrollmentData = [
  {
    name: 'Computer Science',
    data: [
      { name: 'Jan', y: 150 },
      { name: 'Feb', y: 160 },
      { name: 'Mar', y: 155 },
      { name: 'Apr', y: 180 },
      { name: 'May', y: 170 },
      { name: 'Jun', y: 190 },
    ],
    color: '#7cb5ec',
    stack: 'total',
  },
  {
    name: 'Engineering',
    data: [
      { name: 'Jan', y: 120 },
      { name: 'Feb', y: 130 },
      { name: 'Mar', y: 125 },
      { name: 'Apr', y: 145 },
      { name: 'May', y: 140 },
      { name: 'Jun', y: 155 },
    ],
    color: '#434348',
    stack: 'total',
  },
  {
    name: 'Business',
    data: [
      { name: 'Jan', y: 100 },
      { name: 'Feb', y: 110 },
      { name: 'Mar', y: 105 },
      { name: 'Apr', y: 125 },
      { name: 'May', y: 120 },
      { name: 'Jun', y: 135 },
    ],
    color: '#90ed7d',
    stack: 'total',
  },
];

const revenueBySourceData = [
  {
    name: 'Tuition',
    data: [
      { name: 'Jan', y: 800000 },
      { name: 'Feb', y: 850000 },
      { name: 'Mar', y: 820000 },
      { name: 'Apr', y: 900000 },
      { name: 'May', y: 880000 },
      { name: 'Jun', y: 950000 },
    ],
    color: '#7cb5ec',
    stack: 'total',
  },
  {
    name: 'Grants',
    data: [
      { name: 'Jan', y: 200000 },
      { name: 'Feb', y: 220000 },
      { name: 'Mar', y: 210000 },
      { name: 'Apr', y: 240000 },
      { name: 'May', y: 230000 },
      { name: 'Jun', y: 260000 },
    ],
    color: '#434348',
    stack: 'total',
  },
  {
    name: 'Donations',
    data: [
      { name: 'Jan', y: 50000 },
      { name: 'Feb', y: 60000 },
      { name: 'Mar', y: 55000 },
      { name: 'Apr', y: 70000 },
      { name: 'May', y: 65000 },
      { name: 'Jun', y: 80000 },
    ],
    color: '#90ed7d',
    stack: 'total',
  },
];

const courseCompletionData = [
  {
    name: 'Completed',
    data: [
      { name: 'Jan', y: 75 },
      { name: 'Feb', y: 80 },
      { name: 'Mar', y: 78 },
      { name: 'Apr', y: 85 },
      { name: 'May', y: 82 },
      { name: 'Jun', y: 88 },
    ],
    color: '#90ed7d',
    stack: 'total',
  },
  {
    name: 'In Progress',
    data: [
      { name: 'Jan', y: 20 },
      { name: 'Feb', y: 18 },
      { name: 'Mar', y: 19 },
      { name: 'Apr', y: 15 },
      { name: 'May', y: 16 },
      { name: 'Jun', y: 12 },
    ],
    color: '#f7a35c',
    stack: 'total',
  },
  {
    name: 'Not Started',
    data: [
      { name: 'Jan', y: 5 },
      { name: 'Feb', y: 2 },
      { name: 'Mar', y: 3 },
      { name: 'Apr', y: 0 },
      { name: 'May', y: 2 },
      { name: 'Jun', y: 0 },
    ],
    color: '#f15c80',
    stack: 'total',
  },
];

const facultyWorkloadData = [
  {
    name: 'Teaching',
    data: [
      { name: 'Jan', y: 60 },
      { name: 'Feb', y: 65 },
      { name: 'Mar', y: 62 },
      { name: 'Apr', y: 70 },
      { name: 'May', y: 68 },
      { name: 'Jun', y: 75 },
    ],
    color: '#7cb5ec',
    stack: 'total',
  },
  {
    name: 'Research',
    data: [
      { name: 'Jan', y: 25 },
      { name: 'Feb', y: 22 },
      { name: 'Mar', y: 24 },
      { name: 'Apr', y: 20 },
      { name: 'May', y: 21 },
      { name: 'Jun', y: 18 },
    ],
    color: '#434348',
    stack: 'total',
  },
  {
    name: 'Administrative',
    data: [
      { name: 'Jan', y: 15 },
      { name: 'Feb', y: 13 },
      { name: 'Mar', y: 14 },
      { name: 'Apr', y: 10 },
      { name: 'May', y: 11 },
      { name: 'Jun', y: 7 },
    ],
    color: '#90ed7d',
    stack: 'total',
  },
];

export const Default: Story = {
  args: {
    series: enrollmentByModeData,
    categories,
    title: 'Enrollment by Mode',
    subtitle: 'Monthly Comparison',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    onPointClick: () => {},
  },
};

export const DepartmentEnrollment: Story = {
  args: {
    series: departmentEnrollmentData,
    categories,
    title: 'Department Enrollment',
    subtitle: 'Monthly Trends',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
  },
};

export const RevenueBySource: Story = {
  args: {
    series: revenueBySourceData,
    categories,
    title: 'Revenue by Source',
    subtitle: 'Fiscal Year 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    dataLabelsFormat: '${point.y:,.0f}',
  },
};

export const CourseCompletion: Story = {
  args: {
    series: courseCompletionData,
    categories,
    title: 'Course Completion Status',
    subtitle: 'Monthly Progress',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Percentage (%)',
    dataLabelsFormat: '{point.percentage:.1f}%',
  },
};

export const FacultyWorkload: Story = {
  args: {
    series: facultyWorkloadData,
    categories,
    title: 'Faculty Workload Distribution',
    subtitle: 'Monthly Allocation',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Hours (%)',
    dataLabelsFormat: '{point.percentage:.1f}%',
  },
};

export const WithoutDataLabels: Story = {
  args: {
    series: enrollmentByModeData,
    categories,
    title: 'Enrollment by Mode',
    subtitle: 'Data Labels Hidden',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
  },
};

export const WithoutLegend: Story = {
  args: {
    series: enrollmentByModeData,
    categories,
    title: 'Enrollment by Mode',
    subtitle: 'Legend Hidden',
    height: 400,
    showLegend: false,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
  },
};

export const LargeChart: Story = {
  args: {
    series: departmentEnrollmentData,
    categories,
    title: 'Large Stacked Column Chart',
    subtitle: 'Full Screen Display',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
  },
};

export const NoDataFound: Story = {
  args: {
    series: [],
    categories: ['< 7 days', '7 - 15 days', '15 - 30 days', '30+ days'],
    title: 'Request Aging Overview',
    subtitle: '',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Time Period',
    yAxisTitle: 'Number of Requests',
    titleFontSize: '15px',
    titleFontWeight: '600',
  },
};
