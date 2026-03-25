'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-soft-bg overflow-hidden flex items-center justify-center pt-20">
      
      {/* Abstract Background Shapes */}
      <motion.div 
        style={{ y: yBg }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-primary-dark/10 to-transparent blur-3xl"
      />
      <motion.div 
        style={{ y: yBg }}
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-accent-blue/10 to-transparent blur-3xl"
      />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,48,73,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,48,73,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
        
        {/* Left: Text Content */}
        <motion.div 
          style={{ y: yText, opacity: opacityText }}
          className="flex flex-col items-start text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-primary-dark/10 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent-red animate-pulse" />
            <span className="text-sm font-medium text-primary-dark font-heading">
              Next Draw in 14 Days
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-deep-blue leading-[0.9] tracking-tighter mb-6"
          >
            Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-accent-red">With</span><br/> Purpose.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-deep-blue/70 mb-10 max-w-lg leading-relaxed font-body"
          >
            Turn every stroke into global impact. A premium golf community where your subscription funds environmental charities and enters you into exclusive luxury draws.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base bg-gradient-to-r from-primary-dark to-accent-red hover:from-accent-red hover:to-primary-dark text-white rounded-full transition-all duration-500 shadow-xl shadow-primary-dark/20 hover:shadow-2xl hover:shadow-primary-dark/40 hover:-translate-y-1">
                Join the Club <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/draw">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-2 border-deep-blue/20 text-deep-blue hover:bg-deep-blue hover:text-white transition-all duration-300">
                Explore the Draw
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right: Visual Feature (Glass cards floating) */}
        <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0],
              rotateY: [-15, -12, -15],
              rotateX: [15, 18, 15]
            }}
            transition={{ 
              opacity: { duration: 1.2, delay: 0.5 },
              scale: { duration: 1.2, delay: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-80 p-8 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl z-20"
          >
            <div className="w-12 h-12 rounded-full bg-accent-red/20 flex items-center justify-center mb-6">
              <Trophy className="h-6 w-6 text-accent-red" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2 text-deep-blue">Monthly Jackpots</h3>
            <p className="text-deep-blue/60 text-sm">Win TaylorMade sets, exclusive golf trips, and VIP Masters passes.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [80, 95, 80],
              rotateY: [15, 18, 15],
              rotateX: [-15, -12, -15]
            }}
            transition={{ 
              opacity: { duration: 1.2, delay: 0.7 },
              scale: { duration: 1.2, delay: 0.7 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute left-0 top-20 w-72 p-8 rounded-3xl bg-gradient-to-br from-deep-blue to-accent-blue text-white shadow-2xl z-10"
          >
             <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-6">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-2">Verified Impact</h3>
            <p className="text-white/70 text-sm">10% to 100% of your pool contribution directly funds vetted green charities.</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
