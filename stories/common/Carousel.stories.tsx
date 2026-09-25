import type { Meta, StoryObj } from '@storybook/nextjs';
import React from 'react';
import { Carousel } from '../../libs/ui/components/common/Carousel';
import type { CarouselSlide } from '../../libs/ui/components/common/Carousel/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGraduationCap,
  faUsers,
  faCheckCircle,
  faStar,
  faSchool,
  faHeart,
  faMapMarkerAlt,
  faGlobe,
  faBuilding,
  faAtom,
} from '@fortawesome/pro-light-svg-icons';
import { ThemeDecorator } from '../ThemeDecorator';

const meta = {
  title: 'Common/Carousel',
  component: Carousel,
  decorators: [ThemeDecorator],
  parameters: {
    layout: 'fullScreen',
  },
  tags: ['autodocs'],
  argTypes: {
    autoSlide: {
      control: 'boolean',
      description: 'Enable automatic sliding',
    },
    timerSeconds: {
      control: { type: 'number', min: 1, max: 30 },
      description: 'Time between auto-slides in seconds',
    },
    showNavigation: {
      control: 'boolean',
      description: 'Show navigation arrows (deprecated - arrows removed, using pagination only)',
    },
    showPagination: {
      control: 'boolean',
      description: 'Show pagination dots',
    },
    loop: {
      control: 'boolean',
      description: 'Enable infinite loop',
    },
    height: {
      control: 'text',
      description: 'Height of the carousel',
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

const gridData = {
  networkScale: {
    partnerSchools: 676,
    disciplines: 31,
    sites: 8898,
    locations: 12000,
    availabilities: 12772,
    brands: 8898,
  },
  networkGrowth: {
    newPrograms: 475,
    totalAvailabilities: 'NA',
    totalSlotsApproved: 22533,
  },
  networkCredibility: {
    uniqueStudentsPlaced: 2196,
    totalRequestsProcessed: 27752,
    totalPlacementsCompleted: 2688,
  },
  platformActivity: {
    openAvailabilities: 472,
    requestsPendingApprovals: 23,
    uniqueSchools: 8,
    ongoingSchedules: 156,
    upcomingSchedules: 89,
  },
  powerfulNetwork: {
    locations: 8898,
    sites: 341,
    slots: 15406,
    availabilities: 12772,
    disciplines: 31,
  },
};

// Sample slides data
const sampleSlides = [
  {
    id: 'network-scale-new',
    background: 'linear-gradient(135deg,rgb(233, 205, 233) 0%,rgba(134, 72, 130, 0.64) 100%)',
    isCustom: true,
    customComponent: (
      <div className="flex h-full w-full items-start px-4 pt-4">
        {/* Left Side - Image (40%) */}
        <div className="flex w-2/5 items-center justify-center">
          <img
            src="/networkScale.png"
            alt="Network Scale visualization showing partner schools and disciplines"
            className="max-h-full max-w-full object-contain"
            style={{ maxHeight: '85%' }}
            onError={(e) => {
              console.error('Failed to load networkScale.png');
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Right Side - Text Content (60%) */}
        <div className="flex w-3/5 flex-col items-center justify-center pt-4 text-center">
          <div className="text-gray-900">
            <h2 className="mb-2 text-2xl leading-none font-bold tracking-wide capitalize">
              Network Scale & Reach
            </h2>
            <div className="mb-3 text-sm text-gray-600">
              A nationwide ecosystem built to connect programs, sites, and students at scale
            </div>
            <div className="text-lg leading-none font-bold text-gray-700">
              {gridData.networkScale.partnerSchools} Active Schools •{' '}
              {gridData.networkScale.disciplines} Disciplines & Specializations •{' '}
              {gridData.networkScale.availabilities.toLocaleString()} Availabilities •{' '}
              {gridData.networkScale.brands.toLocaleString()} Brands and Locations
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'network-growth-freshness',
    background: 'linear-gradient(135deg,rgb(233, 205, 233) 0%,rgba(134, 72, 130, 0.64) 100%)',
    isCustom: true,
    customComponent: (
      <div className="flex h-full w-full items-start px-4 pt-4">
        {/* Left Side - Image (40%) */}
        <div className="flex w-2/5 items-center justify-center">
          <img
            src="/networkGrowth.png"
            alt="Network Growth visualization showing growth trends"
            className="max-h-full max-w-full object-contain"
            style={{ maxHeight: '85%' }}
          />
        </div>

        {/* Right Side - Text Content (60%) */}
        <div className="flex w-3/5 flex-col items-center justify-center pt-4 text-center">
          <div className="text-gray-900">
            <h2 className="mb-2 text-2xl leading-none font-bold tracking-wide capitalize">
              Network Growth & Freshness (Last 12 Months)
            </h2>
            <div className="mb-3 text-sm text-gray-600">
              A thriving network that's expanding faster every day
            </div>
            <div className="text-lg leading-none font-bold text-gray-700">
              {gridData.networkGrowth.newPrograms} New Programs Added •{' '}
              {gridData.networkGrowth.totalAvailabilities} Total Availabilities Posted and Requested
              • {gridData.networkGrowth.totalSlotsApproved.toLocaleString()} Total Slots Approved by
              Sites
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'network-credibility-usage',
    background: 'linear-gradient(135deg,rgb(233, 205, 233) 0%,rgba(134, 72, 130, 0.64) 100%)',
    isCustom: true,
    customComponent: (
      <div className="flex h-full w-full items-start px-4 pt-4">
        {/* Left Side - Image (40%) */}
        <div className="flex w-2/5 items-center justify-center">
          <img
            src="/trusted.png"
            alt="Network Credibility visualization showing trust and reliability"
            className="max-h-full max-w-full object-contain"
            style={{ maxHeight: '85%' }}
          />
        </div>

        {/* Right Side - Text Content (60%) */}
        <div className="flex w-3/5 flex-col items-center justify-center pt-4 text-center">
          <div className="text-gray-900">
            <h2 className="mb-2 text-2xl leading-none font-bold tracking-wide capitalize">
              Network Credibility & Usage
            </h2>
            <div className="mb-3 text-sm text-gray-600">
              Proven. Trusted. Powering thousands of successful placements
            </div>
            <div className="text-lg leading-none font-bold text-gray-700">
              {gridData.networkCredibility.uniqueStudentsPlaced.toLocaleString()} Unique Students
              Placed • {gridData.networkCredibility.totalRequestsProcessed.toLocaleString()} Total
              Requests Processed •{' '}
              {gridData.networkCredibility.totalPlacementsCompleted.toLocaleString()} Total
              Placements Completed
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'powerful-network-overview',
    background: 'linear-gradient(135deg, #fdf2f8 0%,rgb(251, 179, 238) 100%)',
    isCustom: true,
    customComponent: (
      <div className="flex h-full w-full items-center justify-between px-6">
        {/* Left Side - Text Content (60%) */}
        <div className="flex w-3/5 flex-col items-start justify-center text-left">
          <div className="text-gray-900">
            <h2 className="mb-3 text-3xl leading-tight font-bold">
              A Powerful Clinical Network At Your Fingertips
            </h2>
            <div className="mb-6 text-lg text-gray-600">
              Growing stronger every day with new partners
            </div>
            <div className="flex gap-1">
              <div className="rounded-3xl border border-purple-200 bg-white/50 font-semibold text-gray-900">
                1,200+ Partner Sites
              </div>
              <div className="rounded-3xl border border-purple-200 bg-white/50 font-semibold text-gray-900">
                85,000+ Slots Listed
              </div>
              <div className="rounded-3xl border border-purple-200 bg-white/50 font-semibold text-gray-900">
                8,000+ Facilities Served
              </div>
              <div className="rounded-3xl border border-purple-200 bg-white/50 font-semibold text-gray-900">
                50+ Disciplines Supported
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image (40%) */}
        <div className="flex h-full w-2/5 items-center justify-center">
          <img
            src="/powerfulNetwork.png"
            alt="Powerful clinical network visualization"
            className="h-auto max-h-full w-auto max-w-full object-contain"
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>
      </div>
    ),
  },
];

const imageSlides: CarouselSlide[] = [
  {
    id: 'image-1',
    image: 'https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Slide+1',
    description: 'First slide with image',
    href: '#',
  },
  {
    id: 'image-2',
    image: 'https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=Slide+2',
    description: 'Second slide with image',
  },
  {
    id: 'image-3',
    image: 'https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Slide+3',
    description: 'Third slide with image',
  },
];

export const Default: Story = {
  args: {
    slides: sampleSlides,
    autoSlide: true,
    timerSeconds: 5,
    showNavigation: false, // Navigation arrows removed, using pagination only
    showPagination: true,
    loop: true,
    height: 'h-40',
    'aria-label': 'Statistics Carousel',
  },
};

export const ManualControl: Story = {
  args: {
    slides: sampleSlides,
    autoSlide: false,
    showNavigation: false, // Navigation arrows removed, using pagination only
    showPagination: true,
    loop: true,
    height: 'h-40',
    'aria-label': 'Manual Control Carousel',
  },
};

export const ImageCarousel: Story = {
  args: {
    slides: imageSlides,
    autoSlide: true,
    timerSeconds: 3,
    showNavigation: false, // Navigation arrows removed, using pagination only
    showPagination: true,
    loop: true,
    height: 'h-64',
    'aria-label': 'Image Carousel',
  },
};

export const NoNavigation: Story = {
  args: {
    slides: sampleSlides,
    autoSlide: true,
    timerSeconds: 5,
    showNavigation: false, // Navigation arrows removed, using pagination only
    showPagination: true,
    loop: true,
    height: 'h-50',
    'aria-label': 'No Navigation Carousel (Default Behavior)',
  },
};

export const NoPagination: Story = {
  args: {
    slides: sampleSlides,
    autoSlide: true,
    timerSeconds: 5,
    showNavigation: true, // Enable navigation arrows for manual scrolling
    showPagination: false,
    loop: true,
    height: 'h-50',
    'aria-label': 'No Pagination Carousel with Navigation Arrows',
  },
};

export const NavigationOnly: Story = {
  args: {
    slides: sampleSlides,
    autoSlide: false,
    timerSeconds: 5,
    showNavigation: true, // Navigation arrows only, no pagination
    showPagination: false,
    loop: true,
    height: 'h-50',
    'aria-label': 'Navigation Arrows Only Carousel',
  },
};

export const FastAutoSlide: Story = {
  args: {
    slides: sampleSlides,
    autoSlide: true,
    timerSeconds: 2,
    showNavigation: false, // Navigation arrows removed, using pagination only
    showPagination: true,
    loop: true,
    height: 'h-50',
    'aria-label': 'Fast Auto Slide Carousel',
  },
};

export const NonClickableDataCards: Story = {
  args: {
    slides: [
      {
        id: 'non-clickable-example',
        background: 'linear-gradient(135deg,rgb(239, 154, 201) 0%,rgb(244, 226, 240) 100%)',
        isCustom: true,
        customComponent: (
          <div className="flex h-full w-full flex-col p-8">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-semibold text-gray-900">NON-CLICKABLE EXAMPLE</span>
              </div>
            </div>
            <div className="flex flex-1 items-center">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={faBuilding} className="text-xl text-gray-700" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    DataCards without click handlers
                  </h2>
                  <span className="max-w-sm text-xs text-gray-600">
                    These cards are not clickable - no onClick handlers provided
                  </span>
                </div>
              </div>
            </div>
          </div>
        ),
        dataCards: [
          {
            icon: <FontAwesomeIcon icon={faUsers} className="text-blue-500" />,
            value: '50K+',
            label: 'static data',
            highlight: true,
          },
          {
            icon: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
            value: '80K+',
            label: 'read-only info',
          },
          {
            icon: <FontAwesomeIcon icon={faStar} className="text-pink-500" />,
            value: '100K+',
            label: 'display only',
            highlight: true,
          },
        ],
      },
    ],
    autoSlide: false,
    showNavigation: false,
    showPagination: true,
    loop: true,
    height: 'h-50',
    'aria-label': 'Non-Clickable DataCards Example',
  },
};

export const BackgroundImageExample: Story = {
  args: {
    slides: [
      {
        id: 'background-image-example',
        image: '/accredited-schools-slide.png',
        useImageAsBackground: true,
        isCustom: true,
        customComponent: (
          <div className="flex h-full w-full flex-col p-8">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm font-semibold text-white">BACKGROUND IMAGE EXAMPLE</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">Image as Background</h2>
                <p className="text-lg text-white opacity-90">
                  This slide uses the image as a background instead of a regular image element
                </p>
              </div>
            </div>
          </div>
        ),
        dataCards: [
          {
            icon: <FontAwesomeIcon icon={faUsers} className="text-blue-500" />,
            value: '25K+',
            label: 'background users',
            highlight: true,
            onClick: () => {
              console.log('Clicked: 25K+ background users');
              alert('Clicked: 25K+ background users');
            },
          },
          {
            icon: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />,
            value: '40K+',
            label: 'background data',
            onClick: () => {
              console.log('Clicked: 40K+ background data');
              alert('Clicked: 40K+ background data');
            },
          },
          {
            icon: <FontAwesomeIcon icon={faStar} className="text-pink-500" />,
            value: '60K+',
            label: 'background metrics',
            highlight: true,
            onClick: () => {
              console.log('Clicked: 60K+ background metrics');
              alert('Clicked: 60K+ background metrics');
            },
          },
        ],
      },
    ],
    autoSlide: false,
    showNavigation: false,
    showPagination: true,
    loop: true,
    height: 'h-50',
    'aria-label': 'Background Image Example',
  },
};
