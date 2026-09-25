import React from 'react';

export interface CarouselSlide {
  id: string;
  image?: string;
  description?: string;
  href?: string;
  isCustom?: boolean;
  customComponent?: React.ReactNode;
  background?: string;
  useImageAsBackground?: boolean; // When true, image will be used as background instead of img element
  dataCards?: Array<{
    icon?: React.ReactNode;
    value: string;
    label: string;
    highlight?: boolean;
    onClick?: () => void;
  }>;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  autoSlide?: boolean;
  timerSeconds?: number;
  className?: string;
  onSlideChange?: (index: number) => void;
  showNavigation?: boolean;
  showPagination?: boolean;
  loop?: boolean;
  height?: string;
  'aria-label'?: string;
}
