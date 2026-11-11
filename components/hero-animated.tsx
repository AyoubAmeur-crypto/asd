'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Clock, MoveRight } from 'lucide-react';

interface HeroAnimatedProps {
  tagline: string;
}

export function HeroAnimated({ tagline }: HeroAnimatedProps) {
  return (
    <div className="hero-content-simple">
      {/* Main Title - Clean, massive, editorial Anton typography */}
      <div className="hero-title-container">
        <h1 className="hero-title-main">
          <motion.span
            className="block overflow-hidden"
            initial={{ opacity: 0, y: 55 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-word-primary">ALL-STAR</span>
          </motion.span>
          <motion.span
            className="block overflow-hidden"
            initial={{ opacity: 0, y: 55 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-word-primary">DEBATE </span>
            <span className="hero-word-accent">IV</span>
          </motion.span>
        </h1>
      </div>

      {/* Official Tagline */}
      <motion.p
        className="hero-tagline-clean"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {tagline}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        className="hero-actions-simple"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <a href="#confrontations" className="hero-btn-primary">
          <span>EXPLORE CONFRONTATIONS</span>
          <MoveRight size={16} aria-hidden="true" />
        </a>

        <Link href="/timer" className="hero-btn-secondary">
          <Clock size={16} aria-hidden="true" />
          <span>LAUNCH LIVE CHRONOGRAPH</span>
        </Link>
      </motion.div>
    </div>
  );
}
