import type { Meta, StoryObj } from '@storybook/nextjs';
import { PieHighChart } from '../../libs/ui/components/highcharts';

const meta = {
  title: 'Highcharts/Pie Chart',
  component: PieHighChart,
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
      description: 'Show or hide data labels on pie slices',
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels',
    },
    width: {
      control: 'text',
      description: 'Chart width (can be percentage or pixels)',
    },
  },
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data for different scenarios
const studentEnrollmentData = [
  { name: 'Computer Science', y: 45, color: '#7cb5ec' },
  { name: 'Engineering', y: 32, color: '#434348' },
  { name: 'Business', y: 28, color: '#90ed7d' },
  { name: 'Arts & Humanities', y: 18, color: '#f7a35c' },
  { name: 'Medicine', y: 15, color: '#8085e9' },
  { name: 'Law', y: 12, color: '#f15c80' },
];

const revenueData = [
  { name: 'Q1', y: 1200000, color: '#7cb5ec' },
  { name: 'Q2', y: 1800000, color: '#434348' },
  { name: 'Q3', y: 2100000, color: '#90ed7d' },
  { name: 'Q4', y: 2800000, color: '#f7a35c' },
];

const websiteTrafficData = [
  { name: 'Direct', y: 35, color: '#7cb5ec' },
  { name: 'Organic Search', y: 40, color: '#434348' },
  { name: 'Social Media', y: 15, color: '#90ed7d' },
  { name: 'Referral', y: 8, color: '#f7a35c' },
  { name: 'Email', y: 2, color: '#8085e9' },
];

const courseCompletionData = [
  { name: 'Completed', y: 75, color: '#90ed7d' },
  { name: 'In Progress', y: 20, color: '#f7a35c' },
  { name: 'Not Started', y: 5, color: '#f15c80' },
];

export const Default: Story = {
  args: {
    data: studentEnrollmentData,
    title: 'Student Enrollment by Department',
    subtitle: 'Academic Year 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    titleFontSize: '20px',
    onPointClick: () => {},
  },
};

export const RevenueQuarterly: Story = {
  args: {
    data: revenueData,
    title: 'Quarterly Revenue',
    subtitle: 'Fiscal Year 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    dataLabelsFormat: '{point.name}: ${point.y:,.0f}',
  },
};

export const WebsiteTraffic: Story = {
  args: {
    data: websiteTrafficData,
    title: 'Website Traffic Sources',
    subtitle: 'Last 30 Days',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    dataLabelsFormat: '{point.name}: {point.percentage:.1f}%',
  },
};

export const CourseCompletion: Story = {
  args: {
    data: courseCompletionData,
    title: 'Course Completion Status',
    subtitle: 'All Active Courses',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    dataLabelsFormat: '{point.percentage:.1f}%',
  },
};

export const DonutChart: Story = {
  args: {
    data: studentEnrollmentData,
    title: 'Student Enrollment (Donut)',
    subtitle: 'Academic Year 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    innerSize: '60%',
    size: '80%',
  },
};

export const WithoutLegend: Story = {
  args: {
    data: studentEnrollmentData,
    title: 'Student Enrollment',
    subtitle: 'Legend Hidden',
    height: 400,
    showLegend: false,
    showDataLabels: true,
  },
};

export const WithoutDataLabels: Story = {
  args: {
    data: studentEnrollmentData,
    title: 'Student Enrollment',
    subtitle: 'Data Labels Hidden',
    height: 400,
    showLegend: true,
    showDataLabels: false,
  },
};

export const CustomColors: Story = {
  args: {
    data: studentEnrollmentData,
    title: 'Student Enrollment with Custom Colors',
    subtitle: 'Academic Year 2024',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
  },
};

export const LargeChart: Story = {
  args: {
    data: studentEnrollmentData,
    title: 'Large Pie Chart',
    subtitle: 'Full Screen Display',
    height: 400,
    showLegend: true,
    showDataLabels: true,
    size: '85%',
  },
};

export const NoDataFound: Story = {
  args: {
    data: [
      { name: 'Category A', y: 0, color: '#7cb5ec' },
      { name: 'Category B', y: 0, color: '#434348' },
      { name: 'Category C', y: 0, color: '#90ed7d' },
    ],
    title: 'No Data Example',
    subtitle: 'All values are zero',
    height: 400,
    showLegend: true,
    showDataLabels: true,
  },
};
