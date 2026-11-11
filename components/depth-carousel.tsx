'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/lib/gallery';

interface CarouselSlide {
  item: GalleryItem;
  tag?: string;
  pos: string;
}

interface DepthCarouselProps {
  slides: CarouselSlide[];
}

export function DepthCarousel({ slides }: DepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef<number>(0);
  const deltaX = useRef<number>(0);
  const lastWheelTime = useRef<number>(0);
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

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Touch gesture handling (mobile swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const handleTouchEnd = () => {
    if (deltaX.current < -35) {
      next();
    } else if (deltaX.current > 35) {
      prev();
    }
    deltaX.current = 0;
  };

  // Mouse drag handling (desktop swipe)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    deltaX.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    deltaX.current = e.clientX - startX.current;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    if (deltaX.current < -35) {
      next();
    } else if (deltaX.current > 35) {
      prev();
    }
    isDragging.current = false;
    deltaX.current = 0;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      if (deltaX.current < -35) next();
      else if (deltaX.current > 35) prev();
      isDragging.current = false;
      deltaX.current = 0;
    }
  };

  // Horizontal wheel / trackpad swipe
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 450) return;
    if (Math.abs(e.deltaX) > 25) {
      if (e.deltaX > 0) next();
      else prev();
      lastWheelTime.current = now;
    }
  };

  return (
    <div
      className="depth-carousel-wrapper"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
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
            transformStyle = 'translate3d(-52%, 0, -90px) scale(0.85) rotateY(16deg)';
            zIndex = 10;
            opacity = 0.65;
            filter = 'brightness(0.7)';
          } else if (isRight) {
            transformStyle = 'translate3d(52%, 0, -90px) scale(0.85) rotateY(-16deg)';
            zIndex = 10;
            opacity = 0.65;
            filter = 'brightness(0.7)';
          } else if (isFarLeft) {
            transformStyle = 'translate3d(-90%, 0, -170px) scale(0.72) rotateY(26deg)';
            zIndex = 5;
            opacity = 0.28;
            filter = 'brightness(0.4) blur(1px)';
          } else if (isFarRight) {
            transformStyle = 'translate3d(90%, 0, -170px) scale(0.72) rotateY(-26deg)';
            zIndex = 5;
            opacity = 0.28;
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
              {/* Image Frame with No Stroke and No Gray Overlay */}
              <div className="depth-card-frame">
                <Image
                  src={slide.item.src}
                  alt={slide.item.title}
                  fill
                  quality={95}
                  sizes="(max-width: 768px) 88vw, (max-width: 1200px) 72vw, 760px"
                  priority={Math.abs(diff) <= 1}
                  className={`object-cover ${slide.pos} select-none pointer-events-none transition-transform duration-500`}
                />

                {/* Bottom Vignette & Information - Pure White Text Only, No Top Overlay */}
                <div className="depth-card-info">
                  <h4 className="depth-card-title">{slide.item.title}</h4>
                  <p className="depth-card-caption">{slide.item.caption}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation - Just The Dots */}
      <div className="depth-carousel-nav">
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
    </div>
  );
}
