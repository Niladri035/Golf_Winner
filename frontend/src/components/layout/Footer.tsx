import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-deep-blue text-soft-bg py-16 px-6 mt-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-accent-red blur-xl opacity-50" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-2">
          <Link href="/" className="font-heading font-extrabold text-3xl text-soft-bg mb-4 block">
            Altru<span className="text-accent-red">Green</span>
          </Link>
          <p className="text-soft-bg/70 max-w-sm text-sm leading-relaxed mb-8">
            A premium golf community where every swing counts. We combine competitive play with transparent charitable giving, turning your passion into purpose.
          </p>
          <p className="flex items-center gap-2 text-sm text-soft-bg/50">
            Made with <Heart size={16} className="text-accent-red" /> for the community.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-6 text-white">Platform</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">About Us</Link></li>
            <li><Link href="/draw" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">How It Works</Link></li>
            <li><Link href="/charities" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">Our Charities</Link></li>
            <li><Link href="/leaderboard" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">Leaderboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-6 text-white">Legal</h4>
          <ul className="space-y-4">
            <li><Link href="/terms" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">Terms & Conditions</Link></li>
            <li><Link href="/privacy" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link href="/rules" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">Draw Rules</Link></li>
            <li><Link href="/contact" className="text-soft-bg/70 hover:text-soft-bg transition-colors text-sm">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-soft-bg/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-soft-bg/40">
        <p>© {new Date().getFullYear()} AltruGreen Subscription Platform. All rights reserved.</p>
        <p>18 holes, 1 mission.</p>
      </div>
    </footer>
  );
};
