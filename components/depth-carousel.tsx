'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '@/lib/gallery';

interface CarouselSlide {
  item: GalleryItem;
  tag: string;
  pos: string;
}

interface DepthCarouselProps {
  slides: CarouselSlide[];
}

export function DepthCarousel({ slides }: DepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const total = slides.length;

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current < -40) {
      next();
    } else if (touchDeltaX.current > 40) {
      prev();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div
      className="depth-carousel-wrapper"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="ASD IV Archive Photo Depth Carousel"
    >
      {/* 3D Perspective Stage */}
      <div className="depth-carousel-stage">
        {slides.map((slide, index) => {
          let diff = (index - activeIndex) % total;
          if (diff > total / 2) diff -= total;
          if (diff < -total / 2) diff += total;

          const isCenter = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isFarLeft = diff === -2;
          const isFarRight = diff === 2;
          const isVisible = Math.abs(diff) <= 2;

          let transformStyle = '';
          let zIndex = 1;
          let opacity = 0;
          let filter = 'none';

          if (isCenter) {
            transformStyle = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
            zIndex = 20;
            opacity = 1;
          } else if (isLeft) {
            transformStyle = 'translate3d(-54%, 0, -85px) scale(0.85) rotateY(16deg)';
            zIndex = 10;
            opacity = 0.65;
            filter = 'brightness(0.7)';
          } else if (isRight) {
            transformStyle = 'translate3d(54%, 0, -85px) scale(0.85) rotateY(-16deg)';
            zIndex = 10;
            opacity = 0.65;
            filter = 'brightness(0.7)';
          } else if (isFarLeft) {
            transformStyle = 'translate3d(-92%, 0, -160px) scale(0.72) rotateY(26deg)';
            zIndex = 5;
            opacity = 0.3;
            filter = 'brightness(0.4) blur(1px)';
          } else if (isFarRight) {
            transformStyle = 'translate3d(92%, 0, -160px) scale(0.72) rotateY(-26deg)';
            zIndex = 5;
            opacity = 0.3;
            filter = 'brightness(0.4) blur(1px)';
          }

          if (!isVisible) {
            return null;
          }

          return (
            <div
              key={slide.item.id}
              className={`depth-carousel-card ${isCenter ? 'is-active' : ''}`}
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                filter,
              }}
              onClick={() => {
                if (!isCenter) goTo(index);
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}: ${slide.item.title}`}
            >
              <div className="depth-card-frame">
                {/* Ultra High Quality Next.js Image */}
                <Image
                  src={slide.item.src}
                  alt={slide.item.title}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 86vw, 420px"
                  priority={Math.abs(diff) <= 1}
                  className={`object-cover ${slide.pos} transition-transform duration-500`}
                />

                {/* Top Category Badge */}
                <div className="depth-card-badge">
                  <span>{slide.tag}</span>
                </div>

                {/* Bottom Vignette & Information */}
                <div className="depth-card-info">
                  <h4 className="depth-card-title">{slide.item.title}</h4>
                  <p className="depth-card-caption">{slide.item.caption}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls Bar */}
      <div className="depth-carousel-nav">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photograph"
          className="depth-nav-btn"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="depth-nav-indicator">
          <span className="depth-nav-counter">
            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="depth-dots-row">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => goTo(dotIdx)}
                className={`depth-dot ${dotIdx === activeIndex ? 'is-active' : ''}`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next photograph"
          className="depth-nav-btn"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
