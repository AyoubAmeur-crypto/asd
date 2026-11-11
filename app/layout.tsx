import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0B0C',
};

export const metadata: Metadata = {
  title: 'ASD IV | All-Star Debate IV — The Great Debaters ENSA Fès',
  description:
    'Official event landing page and 18-debater live chronograph console for All-Star Debate IV (ASD IV 2026), organized by The Great Debaters at ENSA Fès across Arabic, French, and English sections.',
  keywords: [
    'All-Star Debate',
    'ASD IV',
    'The Great Debaters',
    'ENSA Fès',
    'University Debate Morocco',
    'Debate Timer',
    'Chronograph',
  ],
  openGraph: {
    title: 'All-Star Debate IV (ASD IV 2026) — The Great Debaters ENSA Fès',
    description:
      'Three linguistic arenas. Eighteen university debaters. Live stage chronograph console.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
