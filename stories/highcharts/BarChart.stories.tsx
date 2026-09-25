import type { Meta, StoryObj } from '@storybook/nextjs';
import { BarChart } from '../../libs/ui/components/highcharts';

const meta = {
  title: 'Highcharts/Bar Chart',
  component: BarChart,
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
      description: 'Show or hide data labels on bars',
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels',
    },
    chartType: {
      control: 'select',
      options: ['column', 'bar'],
      description: 'Chart type - column or bar',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Chart orientation',
    },
  },
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data for different scenarios
const monthlyRevenueData = [
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
    color: '#7cb5ec',
  },
];

const departmentComparisonData = [
  {
    name: 'Computer Science',
    data: [
      { name: 'Students', y: 450 },
      { name: 'Faculty', y: 25 },
      { name: 'Courses', y: 35 },
    ],
    color: '#7cb5ec',
  },
  {
    name: 'Engineering',
    data: [
      { name: 'Students', y: 380 },
      { name: 'Faculty', y: 22 },
      { name: 'Courses', y: 28 },
    ],
    color: '#434348',
  },
  {
    name: 'Business',
    data: [
      { name: 'Students', y: 320 },
      { name: 'Faculty', y: 18 },
      { name: 'Courses', y: 24 },
    ],
    color: '#90ed7d',
  },
];

const courseEnrollmentData = [
  {
    name: 'Enrollment',
    data: [
      { name: 'Data Science', y: 120 },
      { name: 'Web Development', y: 95 },
      { name: 'Machine Learning', y: 85 },
      { name: 'Database Systems', y: 75 },
      { name: 'Software Engineering', y: 110 },
      { name: 'Cybersecurity', y: 65 },
    ],
    color: '#7cb5ec',
  },
];

const horizontalData = [
  {
    name: 'Performance',
    data: [
      { name: 'Excellent', y: 25 },
      { name: 'Good', y: 45 },
      { name: 'Average', y: 20 },
      { name: 'Below Average', y: 8 },
      { name: 'Poor', y: 2 },
    ],
    color: '#7cb5ec',
  },
];

const stackedData = [
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
];

export const Default: Story = {
  args: {
    series: monthlyRevenueData,
    title: 'Monthly Revenue',
    subtitle: 'Fiscal Year 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    chartType: 'column',
    onPointClick: () => {},
    titleFontSize: '20px',
  },
};

export const MultipleSeries: Story = {
  args: {
    series: departmentComparisonData,
    title: 'Department Comparison',
    subtitle: 'Current Academic Year',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Metrics',
    yAxisTitle: 'Count',
    chartType: 'column',
    grouped: true,
  },
};

export const CourseEnrollment: Story = {
  args: {
    series: courseEnrollmentData,
    title: 'Course Enrollment',
    subtitle: 'Spring Semester 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Course',
    yAxisTitle: 'Students',
    chartType: 'column',
  },
};

export const HorizontalBar: Story = {
  args: {
    series: horizontalData,
    title: 'Student Performance Distribution',
    subtitle: 'End of Semester Results',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Percentage',
    yAxisTitle: 'Performance Level',
    chartType: 'bar',
    orientation: 'horizontal',
  },
};

export const StackedColumns: Story = {
  args: {
    series: stackedData,
    title: 'Enrollment by Mode',
    subtitle: 'Monthly Comparison',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Students',
    chartType: 'column',
    stacked: true,
  },
};

export const WithoutDataLabels: Story = {
  args: {
    series: monthlyRevenueData,
    title: 'Monthly Revenue',
    subtitle: 'Data Labels Hidden',
    height: 400,
    showLegend: true,
    showDataLabels: false,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    chartType: 'column',
  },
};

export const WithoutLegend: Story = {
  args: {
    series: monthlyRevenueData,
    title: 'Monthly Revenue',
    subtitle: 'Legend Hidden',
    height: 400,
    showLegend: false,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Revenue ($)',
    chartType: 'column',
  },
};

export const LargeChart: Story = {
  args: {
    series: courseEnrollmentData,
    title: 'Large Bar Chart',
    subtitle: 'Full Screen Display',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Course',
    yAxisTitle: 'Students',
    chartType: 'column',
  },
};

export const NoDataFound: Story = {
  args: {
    series: [],
    title: 'Slot Approvals and Confirmation',
    subtitle: 'Based on start month',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    xAxisTitle: 'Month',
    yAxisTitle: 'Count',
    chartType: 'column',
    grouped: true,
    titleFontWeight: '600',
    titleFontSize: '15px',
  },
};
