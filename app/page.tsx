import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Clock,
  Compass,
  Flame,
  Instagram,
  Mic2,
  Shield,
  Youtube,
} from 'lucide-react';
import asdData from '@/content/asd-iv.json';
import {
  ABOUT_FEATURED_IMAGE,
  GALLERY_ITEMS,
  HERO_FEATURED_IMAGE,
  OFFICIAL_LOGOS,
} from '@/lib/gallery';
import { DebateConsole } from '@/components/debate-console';
import { MotionEnhancer } from '@/components/motion-enhancer';
import { HeroAnimated } from '@/components/hero-animated';
import { FooterInteractiveHero } from '@/components/footer-hero';
import { DepthCarousel } from '@/components/depth-carousel';

export default function Home() {
  const { event, sections, links } = asdData;

  return (
    <main className="landing-page">
      <MotionEnhancer />

      {/* 00. STICKY BRANDED NAVIGATION */}
      <header className="site-nav">
        <div className="site-nav-inner wrap">
          {/* ASD Logo PNG only */}
          <Link href="#home" aria-label="All-Star Debate IV Home" className="flex items-center">
            <Image
              src={OFFICIAL_LOGOS.asdWhite}
              alt="All-Star Debate Official Logo"
              width={42}
              height={30}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Clean links in the middle */}
          <nav className="nav-links" aria-label="Primary Navigation">
            <a href="#about">ABOUT</a>
            <a href="#theme">THEME</a>
            <a href="#confrontations">CONFRONTATIONS</a>
            <a href="#gallery">GALLERY</a>
          </nav>

          {/* Action CTA */}
          <div className="nav-actions">
            <Link href="/timer" className="nav-cta-btn">
              <Clock size={14} aria-hidden="true" />
              <span>LIVE TIMER</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 01. CINEMATIC HERO SECTION */}
      <section id="home" className="hero-section">
        {/* Full-height photographic background with right-to-left gradient fade into pure black */}
        <div className="hero-photo-layer" aria-hidden="true">
          <Image
            src={HERO_FEATURED_IMAGE.src}
            alt="All-Star Debate Grand Arena Assembly"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            className="object-cover object-center"
            priority
          />
          <div className="hero-photo-overlay" />
        </div>

        <div className="wrap relative z-10">
          <HeroAnimated tagline={event.tagline} />
        </div>
      </section>

      {/* 02. ABOUT THE EVENT */}
      <section id="about" className="about-section-editorial">
        {/* Photographic side layer with gradual gradient blend into pure black */}
        <div className="about-photo-layer" aria-hidden="true">
          <Image
            src={ABOUT_FEATURED_IMAGE.src}
            alt={ABOUT_FEATURED_IMAGE.title}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="about-photo-overlay" />
        </div>

        <div className="wrap relative z-10">
          <div className="about-editorial-content">
            <div className="section-kicker">
              <Compass size={16} aria-hidden="true" />
              <span>01 // THE COMPETITION</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl uppercase my-4 leading-none tracking-tight">
              WHERE ARGUMENTS
              <br />
              <span className="text-amber-accent">BECOME ART.</span>
            </h2>

            <p>
              <strong>All-Star Debate (ASD)</strong> is the premier national Moroccan university debating tournament hosted annually by <strong>The Great Debaters club at ENSA Fès</strong>. It gathers the most rigorous orators and intellectual teams representing universities and grandes écoles across the kingdom.
            </p>
            <p>
              Structured around the prestigious <strong>World Schools Debate (WSD)</strong> format, ASD challenges participants across three distinct linguistic arenas: <strong>English, French, and Arabic</strong>. Each round tests critical discernment, structured rebuttal, and cross-examination under strict parliamentary timing.
            </p>

            <div className="stats-band">
              <div className="stat-item">
                <b className="dynamic-count" data-target="18">18</b>
                <span>CONFIRMED DEBATERS</span>
              </div>
              <div className="stat-item">
                <b className="dynamic-count" data-target="3" data-prefix="0">03</b>
                <span>LINGUISTIC ARENAS</span>
              </div>
              <div className="stat-item">
                <b className="dynamic-count" data-target="1" data-prefix="0">01</b>
                <span>GRAND STAGE</span>
              </div>
              <div className="stat-item">
                <b>WSD</b>
                <span>COMPETITIVE FORMAT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. THE THEME 2026 - BOLD WARM YELLOW BACKGROUND */}
      <section id="theme" className="theme-section-yellow">
        <div className="wrap">
          {/* Icon removed as requested */}
          <div className="theme-yellow-kicker">
            <span>02 // THE PHILOSOPHICAL THEME</span>
          </div>

          <h2 className="theme-yellow-title">
            THE DECEPTION OF TRUTH:
            <br />
            WE ARE ALL FOOLS.
          </h2>

          <p className="theme-yellow-quote">
            &ldquo;Do societies need <em>shared narratives</em> more than shared truths? We dismantle certainty so that critical discernment may breathe.&rdquo;
          </p>

          <div className="theme-yellow-pillars-grid">
            {event.theme.pillars.map((p, idx) => (
              <div key={idx} className="pillar-card-contrast">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="pillar-keyword">{p.keyword}</span>
                  <span className="pillar-arabic" dir="rtl">
                    {p.arabic}
                  </span>
                </div>
                <p className="pillar-desc">{p.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04. THE THREE CONFRONTATIONS */}
      <section id="confrontations" className="content-section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-kicker">
              <Mic2 size={16} aria-hidden="true" />
              <span>03 // OFFICIAL ARENAS & MOTIONS</span>
            </div>
            <h2>
              THREE ARENAS.
              <br />
              <span className="stroke-title">SIX OPPOSING FORCES.</span>
            </h2>
          </div>

          {sections.map((sec) => (
            <article
              key={sec.id}
              className="confrontation-block"
              id={`arena-${sec.id}`}
            >
              <div className="confrontation-header">
                <div className="confrontation-lang-cluster">
                  <span className="confrontation-order">{sec.order}</span>
                  <strong>{sec.language.toUpperCase()} ARENA</strong>
                  <span className="text-muted font-mono text-sm">({sec.native})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="confrontation-badge">{sec.badge}</span>
                  <Link
                    href={`/timer`}
                    className="text-amber-accent font-mono text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    <span>OPEN CLOCK</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Humanized Debate Motion (No heavy box background) */}
              <div className="confrontation-motion-humanized">
                <span className="motion-human-kicker">OFFICIAL DEBATE MOTION</span>
                <blockquote
                  className="motion-quote-human"
                  dir={sec.dir}
                  lang={sec.id === 'arabic' ? 'ar' : sec.id === 'french' ? 'fr' : 'en'}
                >
                  &ldquo;{sec.motion}&rdquo;
                </blockquote>
                <p className="motion-context-human">{sec.context}</p>
              </div>

              {/* Parliamentary Speech Roadmap with Step-by-Step Flow Line & Avatar Revealing */}
              <div className="confrontation-teams-grid">
                {/* Government / Proposition Roadmap */}
                <div className="team-column">
                  <div className="team-header-bar">
                    <h4>{sec.teams.government.title}</h4>
                    <span className="team-side-indicator">+ PROPOSITION</span>
                  </div>

                  <div className="roadmap-spine">
                    {sec.teams.government.members.map((debater, idx) => (
                      <React.Fragment key={debater.order}>
                        <div className="roadmap-node" data-speaker-step={debater.order}>
                          <div className="roadmap-avatar">
                            <Mic2 size={18} aria-hidden="true" />
                          </div>
                          <div className="roadmap-content">
                            <div className="flex items-center justify-between">
                              <span className="roadmap-name">{debater.name}</span>
                              <span className="roadmap-step-tag">SPEAKER 0{debater.order}</span>
                            </div>
                            <span className="roadmap-role block">{debater.role}</span>
                          </div>
                        </div>

                        {idx < 2 && (
                          <div className="roadmap-flow-segment" data-flow-step={idx + 1}>
                            <svg
                              className="roadmap-flow-svg"
                              viewBox="0 0 40 34"
                              preserveAspectRatio="none"
                              aria-hidden="true"
                            >
                              <path
                                d={
                                  idx === 0
                                    ? 'M 24,0 C 38,11 10,23 24,34'
                                    : 'M 24,0 C 10,11 38,23 24,34'
                                }
                                className={`roadmap-flow-path roadmap-flow-path--${idx + 1}`}
                              />
                            </svg>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Opposition Roadmap */}
                <div className="team-column">
                  <div className="team-header-bar">
                    <h4>{sec.teams.opposition.title}</h4>
                    <span className="team-side-indicator">− OPPOSITION</span>
                  </div>

                  <div className="roadmap-spine">
                    {sec.teams.opposition.members.map((debater, idx) => (
                      <React.Fragment key={debater.order}>
                        <div className="roadmap-node" data-speaker-step={debater.order}>
                          <div className="roadmap-avatar">
                            <Mic2 size={18} aria-hidden="true" />
                          </div>
                          <div className="roadmap-content">
                            <div className="flex items-center justify-between">
                              <span className="roadmap-name">{debater.name}</span>
                              <span className="roadmap-step-tag">SPEAKER 0{debater.order}</span>
                            </div>
                            <span className="roadmap-role block">{debater.role}</span>
                          </div>
                        </div>

                        {idx < 2 && (
                          <div className="roadmap-flow-segment" data-flow-step={idx + 1}>
                            <svg
                              className="roadmap-flow-svg"
                              viewBox="0 0 40 34"
                              preserveAspectRatio="none"
                              aria-hidden="true"
                            >
                              <path
                                d={
                                  idx === 0
                                    ? 'M 24,0 C 10,11 38,23 24,34'
                                    : 'M 24,0 C 38,11 10,23 24,34'
                                }
                                className={`roadmap-flow-path roadmap-flow-path--${idx + 1}`}
                              />
                            </svg>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 05. MIDDLE ASD LOGO MONOLITH SHOWCASE (ZOOM EFFECT + EXPANDING GLOW) */}
      <section className="asd-middle-monolith" aria-label="All-Star Debate Emblem">
        <div className="asd-monolith-glow" aria-hidden="true" />
        <div className="wrap relative z-10">
          <div className="asd-monolith-logo-wrap">
            <Image
              src={OFFICIAL_LOGOS.asdWhite}
              alt="All-Star Debate IV Emblem"
              width={160}
              height={115}
              className="h-28 md:h-36 w-auto object-contain mx-auto"
            />
          </div>
          {/* Combined IV directly with ALL-STAR DEBATE as requested */}
          <h2 className="asd-monolith-title">ALL-STAR DEBATE IV</h2>
          <p className="asd-monolith-subtitle">
            THE NATIONAL ARENA OF CRITICAL INQUIRY AND RHETORICAL MASTERY · 18 DEBATERS · 3 LANGUAGES
          </p>
        </div>
      </section>

      {/* 06. WSD RULES - CLEAN CREAM WHITE BACKGROUND WITH DYNAMIC NUMBERS */}
      <section id="experience" className="experience-section-white">
        <div className="wrap">
          <div className="experience-white-kicker">
            <BookOpen size={16} aria-hidden="true" />
            <span>04 // PARLIAMENTARY RULES</span>
          </div>
          <h2 className="experience-white-title">
            WORLD SCHOOLS DEBATE: THE ARCHITECTURE OF CLASH.
          </h2>

          <p className="experience-white-lead">
            ASD adopts the <strong>World Schools Debate (WSD)</strong> format, an international standard designed to combine substantive depth with rapid dynamic engagement. Teams of three debaters confront each other across alternating speeches.
          </p>

          <div className="wsd-rules-grid-white">
            <div className="wsd-rule-card-white">
              <div
                className="wsd-rule-num dynamic-count"
                data-target="8"
                data-prefix="0"
                data-suffix="M"
              >
                08M
              </div>
              <h3>STANDARD SPEECH</h3>
              <p>
                Each speaker has 8 minutes to present case architecture, deepen argumentation, or execute substantive refutation. The first and eighth minutes are protected from Points of Information (POIs).
              </p>
            </div>

            <div className="wsd-rule-card-white">
              <div
                className="wsd-rule-num dynamic-count"
                data-target="45"
                data-suffix="S"
              >
                45S
              </div>
              <h3>POI PROTECTED BUFFER</h3>
              <p>
                Offered by opposing debaters between the 1st and 7th minute. Following any accepted POI, an automatic 45-second protected buffer ensures uninterrupted speaking rhythm.
              </p>
            </div>

            <div className="wsd-rule-card-white">
              <div
                className="wsd-rule-num dynamic-count"
                data-target="4"
                data-prefix="0"
                data-suffix="M"
              >
                04M
              </div>
              <h3>REPLY SPEECH</h3>
              <p>
                Delivered by either the 1st or 2nd speaker. A concise 4-minute synthesis crystallizing key voting clashes without introducing new matter. No POIs permitted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 07. EMBEDDED LIVE DEBATE CHRONOGRAPH */}
      <div className="timer-intro-header wrap">
        <div className="section-kicker">
          <Clock size={16} aria-hidden="true" />
          <span>OFFICIAL STAGE TIMING SYSTEM</span>
        </div>
        <h2
          className="timer-spin-title font-display text-4xl sm:text-6xl md:text-7xl uppercase leading-none tracking-tight"
          aria-label="LIVE DEBATE STAGE CHRONOMETER"
        >
          {['LIVE', 'DEBATE', 'STAGE', 'CHRONOMETER'].map((word, wIdx) => (
            <span key={wIdx} className="spin-word-wrap inline-block mr-3 sm:mr-4 whitespace-nowrap">
              {word.split('').map((char, cIdx) => (
                <span key={cIdx} className="spin-char inline-block" aria-hidden="true">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>

      <div id="timer">
        <DebateConsole isStandalonePage={false} />
      </div>

      {/* 08. PREVIOUS EDITIONS & ARCHIVE GALLERY */}
      <section id="gallery" className="content-section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-kicker">
              <Award size={16} aria-hidden="true" />
              <span>05 // ARCHIVE & MOMENTS</span>
            </div>
            <h2>
              THE ARENA
              <br />
              <em>IN MOTION.</em>
            </h2>
          </div>

          {/* Mobile & Small Screens: React Bits 3D Depth Carousel with High Quality */}
          <div className="block md:hidden">
            <DepthCarousel
              slides={[
                { item: GALLERY_ITEMS[1], tag: 'OFFICIAL CEREMONY', pos: 'object-[center_25%]' },
                { item: GALLERY_ITEMS[4], tag: 'TRIUMPH & HONORS', pos: 'object-[center_10%]' },
                { item: GALLERY_ITEMS[8], tag: 'BEST SPEAKER TROPHY', pos: 'object-[center_12%]' },
                { item: GALLERY_ITEMS[0], tag: 'PASSION AT THE ROSTRUM', pos: 'object-[center_top]' },
                { item: GALLERY_ITEMS[2], tag: 'THE CRITICAL BENCH', pos: 'object-[center_20%]' },
                { item: GALLERY_ITEMS[3], tag: 'RHETORIC & CONVICTION', pos: 'object-[center_top]' },
                { item: GALLERY_ITEMS[9], tag: 'COLLECTIVE EXCELLENCE', pos: 'object-[center_12%]' },
                { item: GALLERY_ITEMS[5], tag: 'ANATOMY OF REFUTATION', pos: 'object-[center_20%]' },
                { item: GALLERY_ITEMS[6], tag: 'STRATEGY IN REAL-TIME', pos: 'object-center' },
                { item: GALLERY_ITEMS[14], tag: 'CELEBRATING MERIT', pos: 'object-[center_10%]' },
              ]}
            />
          </div>

          {/* Laptop & Desktop Screens: Clean Organized Multi-Frame & Masonry Grid */}
          <div className="hidden md:block">
            {/* Lead 2-up grid */}
            <div className="gallery-lead-grid">
              <div className="gallery-large-frame">
                <div className="gallery-card-inner">
                  <span className="gallery-overlay-badge">OFFICIAL CEREMONY</span>
                  <Image
                    src={GALLERY_ITEMS[1].src}
                    alt={GALLERY_ITEMS[1].title}
                    fill
                    quality={95}
                    sizes="(max-width: 1200px) 60vw, 800px"
                    className="object-cover object-[center_25%]"
                    priority
                  />
                  <div className="gallery-caption-bar">
                    <strong>{GALLERY_ITEMS[1].title}</strong>
                    <span>{GALLERY_ITEMS[1].caption}</span>
                  </div>
                </div>
              </div>

              <div className="gallery-large-frame">
                <div className="gallery-card-inner">
                  <span className="gallery-overlay-badge">THE CRITICAL BENCH</span>
                  <Image
                    src={GALLERY_ITEMS[2].src}
                    alt={GALLERY_ITEMS[2].title}
                    fill
                    quality={95}
                    sizes="(max-width: 1200px) 40vw, 550px"
                    className="object-cover object-[center_20%]"
                  />
                  <div className="gallery-caption-bar">
                    <strong>{GALLERY_ITEMS[2].title}</strong>
                    <span>{GALLERY_ITEMS[2].caption}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-column organized masonry grid */}
            <div className="gallery-masonry-grid">
              {[
                { item: GALLERY_ITEMS[0], pos: 'object-[center_top]', portrait: false, tag: 'PODIUM' },
                { item: GALLERY_ITEMS[4], pos: 'object-[center_10%]', portrait: true, tag: 'CEREMONY' },
                { item: GALLERY_ITEMS[8], pos: 'object-[center_12%]', portrait: true, tag: 'DISTINCTION' },
                { item: GALLERY_ITEMS[3], pos: 'object-[center_top]', portrait: false, tag: 'RHETORIC' },
                { item: GALLERY_ITEMS[9], pos: 'object-[center_12%]', portrait: true, tag: 'TEAM' },
                { item: GALLERY_ITEMS[5], pos: 'object-[center_20%]', portrait: false, tag: 'ATMOSPHERE' },
                { item: GALLERY_ITEMS[6], pos: 'object-center', portrait: false, tag: 'STRATEGY' },
                { item: GALLERY_ITEMS[14], pos: 'object-[center_10%]', portrait: true, tag: 'MERIT' },
              ].map(({ item, pos, portrait, tag }) => (
                <div
                  key={item.id}
                  className={`gallery-item-tile ${portrait ? 'gallery-item-tile--portrait' : ''}`}
                >
                  <div className="gallery-tile-frame">
                    <span className="gallery-tile-badge">{tag}</span>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      quality={95}
                      sizes="(max-width: 1200px) 25vw, 350px"
                      className={`object-cover ${pos} transition-transform duration-500 hover:scale-105`}
                    />
                  </div>
                  <div className="gallery-tile-footer">
                    <strong>{item.title}</strong>
                    <span>{item.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 09. MEDIA AND SOCIALS */}
      <section id="social" className="content-section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-kicker">
              <Flame size={16} aria-hidden="true" />
              <span>06 // SOCIAL DISCOURSE</span>
            </div>
            <h2>
              JOIN THE
              <br />
              <em>CONVERSATION.</em>
            </h2>
          </div>

          <div className="social-cards-grid">
            <a
              href={links.instagram}
              target="_blank"
              rel="noreferrer"
              className="social-card"
            >
              <div className="social-card-top">
                <Instagram size={36} className="text-amber-accent" />
                <ArrowUpRight size={22} className="text-muted" />
              </div>
              <div className="social-card-body">
                <h3>@ALLSTARDEBATE</h3>
                <p>
                  Follow official tournament bulletins, lineup drops, jury announcements,
                  and live debate stories on Instagram.
                </p>
              </div>
              <div className="social-card-footer">
                <span>VIEW INSTAGRAM PROFILE</span>
                <ArrowRight size={15} />
              </div>
            </a>

            <a
              href={links.youtube}
              target="_blank"
              rel="noreferrer"
              className="social-card"
            >
              <div className="social-card-top">
                <Youtube size={38} className="text-amber-accent" />
                <ArrowUpRight size={22} className="text-muted" />
              </div>
              <div className="social-card-body">
                <h3>THE GREAT DEBATERS ENSAF</h3>
                <p>
                  Watch full recorded debate rounds, final presentations, and archive
                  performances across Arabic, French, and English arenas.
                </p>
              </div>
              <div className="social-card-footer">
                <span>WATCH ON YOUTUBE</span>
                <ArrowRight size={15} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 10. ORGANIZER SECTION (TGD BIGGER AT LEFT · VERTICAL DIVIDER · WHITE BOX CONTENT ON RIGHT WITH GOLD ICONS) */}
      <section className="organizer-section" aria-label="Event Organizer — The Great Debaters ENSA Fès">
        <div className="wrap">
          <div className="organizer-grid">
            {/* Left Column: Big TGD Official Emblem */}
            <div className="organizer-emblem-col">
              <a
                href="https://www.instagram.com/tgd_ensaf/"
                target="_blank"
                rel="noreferrer"
                className="organizer-emblem-link group"
                aria-label="The Great Debaters ENSA Fès Official Page"
              >
                <Image
                  src={OFFICIAL_LOGOS.tgdBlack}
                  alt="The Great Debaters ENSA Fès Official Crest"
                  width={220}
                  height={220}
                  className="organizer-tgd-logo h-36 sm:h-44 md:h-56 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </a>
            </div>

            {/* Middle: Vertical Separator Line */}
            <div className="organizer-vertical-divider" aria-hidden="true" />

            {/* Right Column: White Box with Content and Gold Icons */}
            <div className="organizer-card-box">
              <span className="organizer-kicker">ORGANIZED & POWERED BY</span>
              <h3 className="organizer-title">THE GREAT DEBATERS · ENSA FÈS</h3>
              <p className="organizer-desc">
                The Great Debaters is the official debating and public speaking society of the École Nationale des Sciences Appliquées de Fès (ENSA Fès), dedicated to fostering critical thinking, oratory elegance, and trilingual dialogue across Moroccan universities.
              </p>

              {/* Gold Icons & Links */}
              <div className="organizer-gold-row">
                <a
                  href="https://www.instagram.com/tgd_ensaf/"
                  target="_blank"
                  rel="noreferrer"
                  className="organizer-gold-item group"
                  aria-label="Instagram @tgd_ensaf"
                >
                  <Instagram size={18} className="organizer-gold-icon" aria-hidden="true" />
                  <span>@tgd_ensaf</span>
                </a>

                <a
                  href={links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="organizer-gold-item group"
                  aria-label="YouTube The Great Debaters"
                >
                  <Youtube size={18} className="organizer-gold-icon" aria-hidden="true" />
                  <span>The Great Debaters</span>
                </a>

                <div className="organizer-gold-item">
                  <Shield size={18} className="organizer-gold-icon" aria-hidden="true" />
                  <span>ENSA FÈS · EST. 2017</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. REBUILT 4-COLUMN FOOTER WITH CURSOR-TRACKING CHROME HERO STATEMENT */}
      <footer className="site-footer wrap">
        {/* 4-Column Grid: Brand bio + Navigation + Arenas + Connect */}
        <div className="footer-grid-four">
          {/* Col 1: Brand & Bio */}
          <div className="footer-col footer-col--brand">
            <Link href="#home" className="footer-brand-header block mb-4" aria-label="Back to top">
              <Image
                src={OFFICIAL_LOGOS.asdWhite}
                alt="All-Star Debate IV"
                width={88}
                height={62}
                className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              />
            </Link>
            <p className="footer-brand-bio">
              Morocco&apos;s premier national university debate tournament, hosted by The Great Debaters club at ENSA Fès. 18 confirmed debaters clashing across English, French, and Arabic arenas under World Schools Debate standards.
            </p>
            {/* Portfolio credit directly under the first component */}
            <div className="footer-credit-under-brand">
              <span>Made with ❤️ by </span>
              <a
                href="https://www.ayoubameur.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-credit-link"
              >
                Ayoub Ameur
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">NAVIGATION</h4>
            <ul className="footer-col-links">
              <li><a href="#home">Overview</a></li>
              <li><a href="#about">The Competition</a></li>
              <li><a href="#theme">Philosophical Theme</a></li>
              <li><a href="#confrontations">Official Arenas</a></li>
              <li><a href="#experience">WSD Rules</a></li>
            </ul>
          </div>

          {/* Col 3: Arenas & Timing */}
          <div className="footer-col">
            <h4 className="footer-col-title">DEBATE ARENAS</h4>
            <ul className="footer-col-links">
              <li><a href="#arena-arabic">المناظرة العربية (Arabic)</a></li>
              <li><a href="#arena-french">Débat Français (French)</a></li>
              <li><a href="#arena-english">English Arena (WSD)</a></li>
              <li><Link href="/timer">Live Stage Chronograph ↗</Link></li>
              <li><a href="#gallery">Archive & Moments</a></li>
            </ul>
          </div>

          {/* Col 4: Connect & Socials */}
          <div className="footer-col">
            <h4 className="footer-col-title">CONNECT</h4>
            <ul className="footer-col-links">
              <li><a href={links.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></li>
              <li><a href={links.youtube} target="_blank" rel="noreferrer">YouTube Archive ↗</a></li>
              <li><a href="https://www.instagram.com/tgd_ensaf/" target="_blank" rel="noreferrer">The Great Debaters ↗</a></li>
              <li><a href="#home">Back to Top ↑</a></li>
            </ul>
          </div>
        </div>

        {/* Edge-to-Edge ALL-STAR DEBATE Hero Statement with Interactive Cursor-Tracking Pure Chrome */}
        <FooterInteractiveHero />
      </footer>
    </main>
  );
}
