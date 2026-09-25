'use client';

import React, { useState } from 'react';
import { Carousel } from '../../../libs/ui/components/common/Carousel';
import type { CarouselSlide } from '../../../libs/ui/components/common/Carousel/types';
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
  faLocationDot,
} from '@fortawesome/pro-light-svg-icons';

export default function CarouselPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data object to store all the values
  const gridData = {
    powerfulNetwork: {
      locations: 8898,
      sites: 341,
      slots: 15406,
      availabilities: 12772,
      disciplines: 31,
    },
  };

  // Example slides similar to your screenshots
  const slides: CarouselSlide[] = [
    {
      id: 'powerful-network',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
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
      dataCards: [
        {
          icon: <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />,
          value: `${gridData.powerfulNetwork.locations.toLocaleString()}`,
          label: `Locations across ${gridData.powerfulNetwork.sites} Sites/Brands`,
        },
        {
          icon: <FontAwesomeIcon icon={faGraduationCap} className="text-green-600" />,
          value: `${gridData.powerfulNetwork.slots.toLocaleString()}`,
          label: `Slots listed for ${gridData.powerfulNetwork.availabilities.toLocaleString()} availabilities`,
        },
        {
          icon: <FontAwesomeIcon icon={faAtom} className="text-purple-600" />,
          value: `${gridData.powerfulNetwork.disciplines}`,
          label: 'Disciplines & Specializations',
        },
      ],
    },
    {
      id: 'trust-impact',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      isCustom: true,
      customComponent: (
        <div
          className="flex h-full w-full flex-col py-4"
          style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></div>
                <h2 className="text-sm font-bold text-gray-900">TRUST & IMPACT</h2>
              </div>
              <p className="text-m mb-1 font-semibold text-gray-800">
                500+ partner schools & 25+ disciplines connected
              </p>
              <p className="mb-4 text-sm text-gray-600">
                Extensive network spanning multiple institutions and clinical sites
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                  <span className="text-sm font-medium">500+ partner schools</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faAtom} className="text-purple-600" />
                  <span className="text-sm font-medium">25+ disciplines</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
                  <span className="text-sm font-medium">1000+ sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} className="text-purple-600" />
                  <span className="text-sm font-medium">2,500+ locations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'accredited-schools',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      isCustom: true,
      customComponent: (
        <div
          className="flex h-full w-full flex-col p-6"
          style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' }}
        >
          {/* Top Header Section */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></div>
              <h2 className="text-sm font-semibold text-gray-900">ACCREDITED SCHOOLS</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-300">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-600" />
                </div>
                <span className="max-w-xs text-xs text-gray-600">
                  A Collaborative platform that connects Sites, Schools & Students for Placements &
                  Onboarding
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Area - World Map Image with Overlays */}
          <div className="relative flex-1 overflow-hidden rounded-lg">
            {/* World Map Image */}
            <img
              src="/accredited-schools-slide.png"
              alt="World map showing global network connections"
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', e);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />

            {/* Text Overlays */}
            <div className="absolute inset-0 flex items-center justify-end pr-6">
              <div className="text-right text-white">
                <h2 className="mb-2 text-2xl font-bold">850+ Accredited Schools Connected</h2>
                <p className="text-sm opacity-90">Partner Schools Actively Requesting Placements</p>
              </div>
            </div>
          </div>
        </div>
      ),
      dataCards: [
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />,
          value: '75k+',
          label: 'Slot Availabilities',
        },
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />,
          value: '120k+',
          label: 'Placements requests',
        },
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />,
          value: '3.5k+',
          label: 'Clinical sites',
        },
      ],
    },
    {
      id: 'growth-momentum',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      isCustom: true,
      customComponent: (
        <div
          className="flex h-full w-full flex-col p-8"
          style={{ background: 'linear-gradient(135deg, #fefefe 0%, #faf5ff 100%)' }}
        >
          {/* Top section */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-gray-700">NETWORK SCALE</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-500" />
                </div>
                <span className="max-w-xs text-sm text-gray-600">
                  A Collaborative platform that connects Sites, Schools & Students for Placements &
                  Onboarding
                </span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="mb-3 text-4xl font-bold text-gray-900">
                600+ partner schools & 60+ disciplines connected
              </h2>
              <p className="text-lg text-gray-600">
                Extensive network spanning multiple institutions and clinical sites
              </p>
            </div>
          </div>
        </div>
      ),
      dataCards: [
        {
          icon: <FontAwesomeIcon icon={faSchool} className="text-green-500" />,
          value: '100+',
          label: 'new schools added this year',
        },
        {
          icon: <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500" />,
          value: '15K+',
          label: 'availabilities added',
        },
        {
          icon: <FontAwesomeIcon icon={faCheckCircle} className="text-red-500" />,
          value: '25K+',
          label: 'requests added',
        },
        {
          icon: <FontAwesomeIcon icon={faCheckCircle} className="text-orange-500" />,
          value: '18K+',
          label: 'slots approved (last 12 months)',
        },
      ],
    },
    {
      id: 'network-scale',
      background: 'linear-gradient(135deg,rgb(239, 154, 201) 0%,rgb(244, 226, 240) 100%)',
      isCustom: true,
      customComponent: (
        <div className="flex h-full w-full flex-col p-8">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold text-gray-900">NETWORK SCALE</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-300">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-600" />
                </div>
                <span className="max-w-xs text-xs text-gray-600">
                  A Collaborative platform that connects Sites, Schools & Students for Placements &
                  Onboarding
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faSchool} className="text-xl text-gray-700" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  600+ partner schools & 60+ disciplines connected
                </h2>
                <span className="max-w-sm text-xs text-gray-600">
                  Extensive network spanning multiple institutions and clinical sites
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      dataCards: [
        {
          icon: <FontAwesomeIcon icon={faSchool} className="text-blue-500" />,
          value: '600+',
          label: 'partner schools',
          highlight: true,
        },
        {
          icon: <FontAwesomeIcon icon={faHeart} className="text-purple-500" />,
          value: '60+',
          label: 'disciplines',
        },
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />,
          value: '303',
          label: 'sites',
          highlight: true,
        },
      ],
    },
    {
      id: 'accredited-schools-new',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      isCustom: true,
      customComponent: (
        <div
          className="flex h-full w-full flex-col p-6"
          style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' }}
        >
          {/* Top Header Section */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true"></div>
              <h2 className="text-sm font-semibold text-gray-900">ACCREDITED SCHOOLS</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-300">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-600" />
                </div>
                <span className="max-w-xs text-xs text-gray-600">
                  A Collaborative platform that connects Sites, Schools & Students for Placements &
                  Onboarding
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Area - Dark Blue Background */}
          <div className="relative mb-4 flex-1 overflow-hidden rounded-lg bg-blue-900 p-6">
            {/* World Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full rounded-lg bg-blue-800"></div>
            </div>

            {/* Network Dots and Lines */}
            <div className="absolute inset-0">
              <div className="bg-card absolute top-4 left-8 h-2 w-2 rounded-full opacity-60"></div>
              <div className="bg-card absolute top-8 right-12 h-2 w-2 rounded-full opacity-60"></div>
              <div className="bg-card absolute bottom-8 left-16 h-2 w-2 rounded-full opacity-60"></div>
              <div className="bg-card absolute right-8 bottom-4 h-2 w-2 rounded-full opacity-60"></div>
              <div className="bg-card absolute top-1/2 left-1/4 h-2 w-2 rounded-full opacity-60"></div>
              <div className="bg-card absolute top-1/3 right-1/3 h-2 w-2 rounded-full opacity-60"></div>

              {/* Connection Lines */}
              <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 1 }}>
                <line x1="8" y1="4" x2="12" y2="8" stroke="white" strokeWidth="1" opacity="0.3" />
                <line x1="16" y1="8" x2="12" y2="8" stroke="white" strokeWidth="1" opacity="0.3" />
                <line x1="16" y1="8" x2="8" y2="16" stroke="white" strokeWidth="1" opacity="0.3" />
                <line x1="8" y1="16" x2="8" y2="4" stroke="white" strokeWidth="1" opacity="0.3" />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="text-white">
                <h2 className="mb-2 text-2xl font-bold">850+ Accredited Schools Connected</h2>
                <p className="text-sm opacity-90">Partner Schools Actively Requesting Placements</p>
              </div>
            </div>
          </div>
        </div>
      ),
      dataCards: [
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />,
          value: '75k+',
          label: 'Slot Availabilities',
        },
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />,
          value: '120k+',
          label: 'Placements requests',
        },
        {
          icon: <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />,
          value: '3.5k+',
          label: 'Clinical sites',
        },
      ],
    },
    {
      id: 'growth-momentum',
      background: 'linear-gradient(135deg,rgb(239, 154, 201) 0%,rgb(244, 226, 240) 100%)',
      isCustom: true,
      customComponent: (
        <div className="flex h-full w-full flex-col p-8">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold text-gray-900">GROWTH & MOMENTUM</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-300">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-600" />
                </div>
                <span className="max-w-xs text-xs text-gray-600">
                  A Collaborative platform that connects Sites, Schools & Students for Placements &
                  Onboarding
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faGraduationCap} className="text-xl text-gray-700" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  100+ new schools added this year
                </h2>
                <span className="max-w-sm text-xs text-gray-600">
                  Growing growth in partnerships and activity (last 12 months)
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      dataCards: [
        {
          icon: <FontAwesomeIcon icon={faSchool} className="text-green-500" />,
          value: '100+',
          label: 'new schools added this year',
          highlight: true,
        },
        {
          icon: <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500" />,
          value: '15K+',
          label: 'availabilities added',
        },
        {
          icon: <FontAwesomeIcon icon={faCheckCircle} className="text-red-500" />,
          value: '25K+',
          label: 'requests added',
          highlight: true,
        },
      ],
    },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-8 text-4xl font-bold">Carousel Component</h1>

      <div className="space-y-8">
        {/* Basic Carousel */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Carousel</h2>
          <div className="max-w-4xl">
            <div className="overflow-hidden rounded-lg">
              <Carousel
                slides={slides}
                autoSlide={true}
                timerSeconds={5}
                onSlideChange={setCurrentSlide}
                aria-label="Statistics Carousel"
                height="h-64"
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Current slide: {currentSlide + 1} of {slides.length}
          </p>
        </div>

        {/* Manual Control Carousel */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Manual Control Carousel</h2>
          <div className="max-w-4xl">
            <div className="overflow-hidden rounded-lg">
              <Carousel
                slides={slides}
                autoSlide={false}
                onSlideChange={setCurrentSlide}
                aria-label="Manual Control Carousel"
                height="h-64"
              />
            </div>
          </div>
        </div>

        {/* Simple Image Carousel */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Simple Image Carousel</h2>
          <div className="max-w-2xl">
            <Carousel
              slides={[
                {
                  id: 'image-1',
                  image: '/public/avatars/avatar-1.jpg',
                  description: 'First slide description',
                  href: '#',
                },
                {
                  id: 'image-2',
                  image: '/public/avatars/avatar-2.jpg',
                  description: 'Second slide description',
                },
                {
                  id: 'image-3',
                  image: '/public/avatars/avatar-3.jpg',
                  description: 'Third slide description',
                },
              ]}
              autoSlide={true}
              timerSeconds={3}
              height="h-64"
              aria-label="Image Carousel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
