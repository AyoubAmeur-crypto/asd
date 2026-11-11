import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DebateConsole } from '@/components/debate-console';
import { OFFICIAL_LOGOS } from '@/lib/gallery';

export const metadata: Metadata = {
  title: 'Live Debate Chronograph Console | All-Star Debate IV (ASD IV 2026)',
  description:
    'Dedicated trilingual stage chronometer for All-Star Debate IV, featuring 18 independent debater clocks, WSD 8-minute/4-minute timing, 5-minute warnings, and overtime tracking.',
};

export default function TimerPage() {
  return (
    <main className="timer-page-main">
      {/* Top Header - Streamlined: Back Icon on left corner, ASD logo on right */}
      <header className="timer-nav wrap">
        <div className="timer-nav-left">
          <Link href="/" className="timer-back-icon-btn" aria-label="Return to Main Website">
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="timer-nav-right">
          <Link href="/" className="timer-logo-link" aria-label="All-Star Debate IV Home">
            <Image
              src={OFFICIAL_LOGOS.asdWhite}
              alt="All-Star Debate IV Official Logo"
              width={54}
              height={38}
              className="h-8 md:h-9 w-auto object-contain hover:opacity-85 transition-opacity"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Main Debate Console */}
      <DebateConsole isStandalonePage={true} />

      {/* Footer */}
      <footer className="timer-footer wrap">
        <div className="timer-footer-inner">
          <span>ALL-STAR DEBATE IV · WORLD SCHOOLS DEBATE FORMAT (WSD)</span>
          <span>THE GREAT DEBATERS ENSA FÈS · LOCAL-FIRST STAGE TIMER</span>
          <Link href="/#experience" className="hover:underline">
            VIEW WSD RULES & TIMING ARCHITECTURE
          </Link>
        </div>
      </footer>
    </main>
  );
}

