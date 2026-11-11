'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function MotionEnhancer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Dynamic Number Count-up Effect for stats and WSD rule numbers
      const countElements = document.querySelectorAll<HTMLElement>('.dynamic-count');
      countElements.forEach((el) => {
        const rawTarget = el.getAttribute('data-target') || el.innerText;
        const targetValue = parseFloat(rawTarget.replace(/[^\d.]/g, ''));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        if (!isNaN(targetValue)) {
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: targetValue,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              const formatted = Math.floor(counterObj.val);
              el.innerText = `${prefix}${formatted < 10 && targetValue >= 10 ? String(formatted).padStart(2, '0') : formatted}${suffix}`;
            },
          });
        }
      });

      // 2. Middle Monolith ASD Logo Zoom-In & Ambient Glow Expansion Effect
      const monolithSection = document.querySelector<HTMLElement>('.asd-middle-monolith');
      if (monolithSection) {
        const logo = monolithSection.querySelector<HTMLElement>('.asd-monolith-logo-wrap');
        const glow = monolithSection.querySelector<HTMLElement>('.asd-monolith-glow');
        const textElements = monolithSection.querySelectorAll<HTMLElement>(
          '.asd-monolith-kicker, .asd-monolith-title, .asd-monolith-subtitle'
        );

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: monolithSection,
            start: 'top 80%',
            end: 'center 45%',
            scrub: 1,
          },
        });

        if (logo) {
          tl.fromTo(
            logo,
            { scale: 0.6, y: 30, opacity: 0.4 },
            { scale: 1.1, y: 0, opacity: 1, ease: 'power2.out' },
            0
          );
        }

        if (glow) {
          tl.fromTo(
            glow,
            { scaleX: 0.3, scaleY: 0.3, opacity: 0.15 },
            { scaleX: 1.5, scaleY: 1.4, opacity: 0.75, ease: 'power1.out' },
            0
          );
        }

        if (textElements.length > 0) {
          tl.fromTo(
            textElements,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out' },
            0.2
          );
        }
      }

      // 3. Staggered Timer Tiles Smooth Arrival from Top to Bottom (No Rotation)
      const timerSection = document.querySelector<HTMLElement>('.console-section');
      if (timerSection) {
        const timerCards = timerSection.querySelectorAll<HTMLElement>('.speakers-list .speaker');
        if (timerCards.length > 0) {
          gsap.fromTo(
            timerCards,
            { opacity: 0, y: -30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: timerSection.querySelector('.tabs') || timerSection,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      // 4. (Roadmap animation removed as requested: speakers and flow lines are kept static)

      // 5. Per-Character 3D Spinning Arrival for Stage Timer Headline
      const spinChars = document.querySelectorAll<HTMLElement>('.timer-spin-title .spin-char');
      if (spinChars.length > 0) {
        gsap.fromTo(
          spinChars,
          {
            opacity: 0,
            y: 35,
            rotationX: -100,
            rotationY: (i) => (i % 2 === 0 ? -25 : 25),
            scale: 0.8,
            transformOrigin: '50% 50% -25px',
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.035,
            ease: 'back.out(1.8)',
            scrollTrigger: {
              trigger: '.timer-intro-header',
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 6. First Two Sections: Whole Text Animated Reveal (Hero & About)
      const aboutTextElements = document.querySelectorAll<HTMLElement>(
        '.about-editorial-content p, .about-editorial-content h2, .stats-band'
      );
      if (aboutTextElements.length > 0) {
        gsap.fromTo(
          aboutTextElements,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.about-editorial-content',
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 6. Organizer Section Reveal (TGD Left + Divider + White Card Right)
      const organizerSection = document.querySelector<HTMLElement>('.organizer-section');
      if (organizerSection) {
        const organizerElements = organizerSection.querySelectorAll<HTMLElement>(
          '.organizer-emblem-col, .organizer-vertical-divider, .organizer-card-box'
        );
        gsap.fromTo(
          organizerElements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: organizerSection,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 7. Section Headings Smooth Reveal
      gsap.utils.toArray<HTMLElement>('.section-head, .theme-yellow-title, .experience-white-title').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
