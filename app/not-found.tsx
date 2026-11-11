import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#F6F0E5] flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <span className="font-mono text-xs font-bold text-amber-accent tracking-widest uppercase block mb-3">
          404 // NOT FOUND
        </span>
        <h1 className="font-display text-6xl uppercase tracking-tight mb-4">
          PAGE NOT FOUND
        </h1>
        <p className="font-mono text-sm text-[#A0A0A5] mb-8 leading-relaxed">
          The requested debate docket or stage URL does not exist or has been relocated within the All-Star Debate arena.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#F0A526] text-[#0B0B0C] px-6 py-3 font-mono text-xs font-bold tracking-widest uppercase hover:bg-[#F7B744] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>RETURN TO ASD IV ARENA</span>
        </Link>
      </div>
    </main>
  );
}
