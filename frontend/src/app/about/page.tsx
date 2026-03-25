'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe, ShieldCheck, TreePine, Wind, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg overflow-x-hidden">
      
      {/* Cinematic Hero */}
      <section className="relative h-[70vh] flex items-center justify-center bg-deep-blue overflow-hidden">
         <motion.div 
           initial={{ opacity: 0, scale: 1.1 }} 
           animate={{ opacity: 0.3, scale: 1 }} 
           transition={{ duration: 2 }}
           className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070')] bg-cover bg-center grayscale" 
         />
         <div className="relative z-10 text-center px-6 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
               <h1 className="text-7xl md:text-9xl font-heading font-extrabold text-white tracking-tighter leading-none mb-8">
                  Our <span className="text-secondary opacity-80">Mission</span>.
               </h1>
               <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed max-w-3xl mx-auto italic">
                 "To transform the competitive spirit of golf into a measurable force for environmental restoration."
               </p>
            </motion.div>
         </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 px-6">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -30 }} 
               whileInView={{ opacity: 1, x: 0 }} 
               viewport={{ once: true }}
               className="space-y-8"
            >
               <div className="w-12 h-1 bg-accent-red" />
               <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-deep-blue leading-tight">
                  Beyond the Green. Towards the Forest.
               </h2>
               <p className="text-lg text-deep-blue/70 leading-relaxed font-body">
                  AltruGreen was founded with a simple realization: the same passion that drives golfers to perfect their swing can be harnessed to protect the world we play in. 
                  <br/><br/>
                  We didn't want to build just another charity site. We wanted to build a community where premium access and excitement drive consistent, verifiable impact. By leveraging algorithmic transparency and the subscription model, we ensure that every shot taken on the course contributes to reforestation, clean water projects, and climate resilience.
               </p>
               <div className="flex gap-12 pt-4">
                  <div className="text-center">
                     <p className="text-4xl font-black text-primary-dark">250+</p>
                     <p className="text-xs font-bold text-deep-blue/40 uppercase tracking-widest mt-1">Acres Restored</p>
                  </div>
                  <div className="text-center">
                     <p className="text-4xl font-black text-accent-blue">15k</p>
                     <p className="text-xs font-bold text-deep-blue/40 uppercase tracking-widest mt-1">Vetted Partner Hours</p>
                  </div>
               </div>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-6 relative">
               <div className="space-y-6">
                  <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-xl border border-deep-blue/5">
                     <TreePine className="h-10 w-10 text-primary-dark mb-4" />
                     <h4 className="font-heading font-bold text-deep-blue">Reforestation</h4>
                     <p className="text-xs text-deep-blue/50 mt-2">Connecting local golf clubs with global forest restoration initiatives.</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="bg-deep-blue text-white p-8 rounded-3xl shadow-xl">
                     <Wind className="h-10 w-10 text-accent-blue mb-4" />
                     <h4 className="font-heading font-bold">Ocean Cleanup</h4>
                     <p className="text-xs text-white/50 mt-2">Diverting plastic from coastal ecosystems through targeted community funding.</p>
                  </motion.div>
               </div>
               <div className="space-y-6 flex flex-col justify-center">
                  <motion.div whileHover={{ y: -5 }} className="bg-accent-red text-white p-8 rounded-3xl shadow-xl">
                     <Users className="h-10 w-10 text-white mb-4" />
                     <h4 className="font-heading font-bold">Community</h4>
                     <p className="text-xs text-white/50 mt-2">Building a global network of philanthropically minded golfers.</p>
                  </motion.div>
               </div>
            </div>
         </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-deep-blue/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-heading font-extrabold text-deep-blue">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               {[
                 { title: "Transparency", desc: "Open algorithms and verified charitable receipts for every dollar donated.", icon: Globe },
                 { title: "Impact-First", desc: "Our platform exists to serve the environment, not just the game.", icon: Heart },
                 { title: "Integrity", desc: "Multi-factor winner verification to ensure a fair and honest community.", icon: ShieldCheck },
               ].map((v, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }} className="text-center space-y-4">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md">
                        <v.icon className="h-8 w-8 text-primary-dark" />
                     </div>
                     <h4 className="text-xl font-heading font-bold text-deep-blue">{v.title}</h4>
                     <p className="text-sm text-deep-blue/60 leading-relaxed max-w-[250px] mx-auto">{v.desc}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}
