'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Heart, 
  Globe, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const steps = [
  {
    title: "Join the Movement",
    description: "Subscribe to our premium golf platform. A minimum of 10% of your membership goes directly to environmental causes.",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600 border-yellow-200"
  },
  {
    title: "Submit Your Scores",
    description: "Every round you play generates a 5-digit ticket based on your performance. Lower scores (1-45) mean better odds.",
    icon: Target,
    color: "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
  },
  {
    title: "The Monthly Draw",
    description: "Our weighted draw engine picks 5 numbers. If they match yours, you win a share of the luxury prize pool.",
    icon: Trophy,
    color: "bg-primary-dark/10 text-primary-dark border-primary-dark/20"
  },
  {
    title: "Multiply Your Impact",
    description: "Winnings are distributed transparently. Winners provide proof of prize to keep the community honest and thriving.",
    icon: Heart,
    color: "bg-accent-red/10 text-accent-red border-accent-red/20"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-deep-blue text-white overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-accent-blue/10 rounded-full blur-3xl" />
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-6xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8"
            >
              How It <span className="text-secondary opacity-80">Works</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              AltruGreen merges the thrill of competition with the power of collective giving. Discover the cycle of impact.
            </motion.p>
         </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
               {steps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                     <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-8 ${step.color} shadow-lg transition-transform group-hover:rotate-6`}>
                        <step.icon size={32} />
                     </div>
                     <span className="absolute -top-4 -left-4 text-8xl font-black text-deep-blue/5 pointer-events-none">{i + 1}.</span>
                     <h3 className="text-2xl font-heading font-bold text-deep-blue mb-4">{step.title}</h3>
                     <p className="text-deep-blue/60 leading-relaxed font-body">{step.description}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Impact Visualization */}
      <section className="py-24 px-6 bg-white/40 backdrop-blur-md italic">
         <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}>
               <ShieldCheck className="mx-auto h-20 w-20 text-accent-red" />
               <h2 className="text-4xl font-heading font-extrabold text-deep-blue mt-8 mb-4">Transparent by Design</h2>
               <p className="text-lg text-deep-blue/60 max-w-2xl mx-auto">
                 We use open-source algorithms for our weighted draws. Your golf score directly influences your probability of being picked—the better you play, the better your odds.
               </p>
               <div className="flex flex-wrap justify-center gap-4 mt-10">
                  <div className="px-6 py-4 rounded-2xl bg-deep-blue text-white shadow-xl flex items-center gap-3">
                     <TrendingUp className="text-accent-blue" />
                     <span className="font-bold">Verified Probabilities</span>
                  </div>
                  <div className="px-6 py-4 rounded-2xl bg-white border border-deep-blue/10 text-deep-blue shadow-xl flex items-center gap-3">
                     <Globe className="text-accent-red" />
                     <span className="font-bold">Third-Party Vetted Charities</span>
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
         <Link href="/register">
           <Button size="lg" className="h-16 px-12 rounded-full text-lg font-bold bg-primary-dark hover:bg-accent-red shadow-2xl transition-all hover:scale-105 active:scale-95">
              Start playing today <ArrowRight className="ml-2" />
           </Button>
         </Link>
      </div>

    </div>
  );
}
