'use client';

import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Keyboard, A11y } from 'swiper/modules';
import classNames from 'classnames';

import { CarouselProps, CarouselSlide } from './types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoSlide = false,
  timerSeconds = 5,
  className = '',
  onSlideChange,
  showNavigation = false, // Navigation arrows removed, keeping for backward compatibility
  showPagination = true,
  loop = true,
  height = 'h-50',
  'aria-label': ariaLabel = 'Carousel',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.realIndex;
    setActiveIndex(newIndex);
    onSlideChange?.(newIndex);
  };

  const renderSlideContent = (slide: CarouselSlide) => {
    if (slide.isCustom && slide.customComponent) {
      return slide.customComponent;
    }

    return (
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Image is now handled as background in the parent container */}
        {/* Only render image element if it's not being used as background */}
        {slide.image && !slide.useImageAsBackground && (
          <img
            src={slide.image}
            alt={slide.description || 'Carousel slide'}
            className="h-auto max-h-full w-auto max-w-full object-contain"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Show fallback content or placeholder
            }}
          />
        )}

        {slide.description && (
          <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 bg-black p-4 text-white">
            <p className="text-sm">{slide.description}</p>
          </div>
        )}

        {slide.href && (
          <a
            href={slide.href}
            className="absolute inset-0 z-10"
            aria-label={`Navigate to ${slide.description || 'slide content'}`}
          />
        )}
      </div>
    );
  };

  const renderDataCards = (slide: CarouselSlide) => {
    if (!slide.dataCards || slide.dataCards.length === 0) return null;
    return (
      <div className="mb-6 flex gap-2 px-6">
        {slide.dataCards.map((card, index) => (
          <div
            key={index}
            className={classNames(
              'bg-card relative flex-1 rounded-lg p-2 shadow-sm',
              'flex flex-col items-start text-left',
              card.onClick && 'cursor-pointer transition-shadow duration-200 hover:shadow-md'
            )}
            onClick={card.onClick}
            role={card.onClick ? 'button' : undefined}
            tabIndex={card.onClick ? 0 : undefined}
            onKeyDown={
              card.onClick
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      card.onClick?.();
                    }
                  }
                : undefined
            }
          >
            {card.highlight && (
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
            )}

            <div className="flex items-center gap-2">
              {card.icon && <div className="text-sm">{card.icon}</div>}
              <div className="flex flex-col">
                <div
                  className={classNames(
                    'text-base font-bold text-gray-900',
                    card.onClick && 'transition-colors duration-200 hover:text-blue-600'
                  )}
                >
                  {card.value}
                </div>
                <div className="text-xs leading-tight text-gray-500">{card.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Dynamic styles based on showNavigation prop
  const dynamicStyles = showNavigation
    ? `
    .swiper-button-next,
    .swiper-button-prev {
      display: block !important;
      color: #374151 !important;
      background: rgba(255, 255, 255, 0.9) !important;
      border-radius: 50% !important;
      width: 40px !important;
      height: 40px !important;
      margin-top: -20px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      transition: all 0.3s ease !important;
      z-index: 10 !important;
      position: absolute !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
    }
    
    .swiper-button-prev {
      left: 10px !important;
    }
    
    .swiper-button-next {
      right: 10px !important;
    }
    
    .swiper-button-next:hover,
    .swiper-button-prev:hover {
      background: rgba(255, 255, 255, 1) !important;
      transform: translateY(-50%) scale(1.1) !important;
    }
    
    .swiper-button-next:after,
    .swiper-button-prev:after {
      font-size: 16px !important;
      font-weight: bold !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      margin: 0 !important;
    }
    
    .swiper-button-next:hover:after,
    .swiper-button-prev:hover:after {
      transform: translate(-50%, -50%) !important;
    }
    
    .swiper-button-disabled {
      opacity: 0.3 !important;
      cursor: not-allowed !important;
    }
  `
    : `
    .swiper-button-next,
    .swiper-button-prev {
      display: none !important;
    }
  `;

  // Additional styles to prevent overlay conflicts
  const overlayStyles = `
    .swiper-container {
      z-index: 1 !important;
    }
    
    .swiper-wrapper {
      z-index: 1 !important;
    }
    
    .swiper-slide {
      z-index: 1 !important;
    }
    
    .swiper-pagination {
      z-index: 10 !important;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      <style dangerouslySetInnerHTML={{ __html: overlayStyles }} />
      <div className={classNames('relative z-1', className)} role="region" aria-label={ariaLabel}>
        {/* Main Carousel */}
        <div className={classNames('relative', height)}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Autoplay, Keyboard, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            loop={loop}
            autoplay={
              autoSlide
                ? {
                    delay: timerSeconds * 1000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            navigation={
              showNavigation
                ? {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }
                : false
            } // Enable navigation when showNavigation is true
            pagination={
              showPagination
                ? {
                    // Enable Swiper pagination
                    clickable: true,
                    dynamicBullets: true,
                  }
                : false
            }
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => {
              console.log('Swiper initialized with', slides.length, 'slides');
              swiperRef.current = swiper;
            }}
            className="h-full w-full"
            a11y={{
              enabled: true,
              prevSlideMessage: 'Previous slide',
              nextSlideMessage: 'Next slide',
              firstSlideMessage: 'This is the first slide',
              lastSlideMessage: 'This is the last slide',
              paginationBulletMessage: 'Go to slide {{index}}',
            }}
          >
            {slides.map((slide, index) => {
              return (
                <SwiperSlide key={slide.id || index}>
                  <div
                    className="relative flex h-full w-full flex-col overflow-hidden"
                    style={{
                      background: slide.background,
                      ...(slide.image &&
                        slide.useImageAsBackground && {
                          backgroundImage: `url(${slide.image})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          width: '100%',
                          height: '100%',
                        }),
                    }}
                  >
                    <div className="relative z-10 flex flex-1 items-center justify-center p-6">
                      <div className="flex h-full w-full items-center justify-center">
                        {renderSlideContent(slide)}
                      </div>
                    </div>
                    {slide.dataCards && slide.dataCards.length > 0 && (
                      <div className="relative z-10">{renderDataCards(slide)}</div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Buttons - Swiper needs these elements to exist */}
          {showNavigation && (
            <>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </>
          )}
        </div>

        {/* Custom Pagination Fallback */}
        {showPagination && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (swiperRef.current) {
                    swiperRef.current.slideTo(index);
                  }
                }}
                className={classNames(
                  'h-2 w-2 cursor-pointer rounded-full transition-all duration-300',
                  activeIndex === index
                    ? 'scale-125 bg-black shadow-lg'
                    : 'bg-opacity-50 hover:bg-opacity-75 bg-black'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter for Screen Readers */}
        <div className="sr-only" aria-live="polite">
          Slide {activeIndex + 1} of {slides.length}
        </div>
      </div>
    </>
  );
};

export default Carousel;
