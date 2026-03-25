'use client';

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { leaderboardApi } from '@/lib/api/modules/leaderboard.api';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';

export default function LeaderboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await leaderboardApi.getTopDonors();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <FullPageLoader />;

  // Note: in a real app, this would be a dedicated user leaderboard endpoint. 
  // We're using the charity distribution / analytics data as a placeholder for demonstration.
  const topDonors = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-32 pb-16 px-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center justify-center p-4 bg-yellow-100/50 rounded-full mb-2">
            <Trophy className="h-10 w-10 text-yellow-600" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-heading font-extrabold text-deep-blue">
            Global <span className="text-accent-red">Impact</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-deep-blue/60 max-w-2xl mx-auto">
            Celebrating the charities receiving the most support from our community.
          </motion.p>
        </div>

        {/* Top 3 Podium (Visual concept) */}
      {topDonors.length >= 3 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 pt-12 pb-8 h-80">
          
          {/* 2nd Place */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full md:w-1/3 flex flex-col items-center order-2 md:order-1 font-heading">
              <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-accent-blue/30 w-full text-center mb-4 relative min-h-[100px] flex flex-col justify-center">
                <Medal className="absolute -top-6 left-1/2 -translate-x-1/2 h-8 w-8 text-accent-blue" />
                <h3 className="font-bold text-deep-blue text-sm md:text-base leading-tight px-2">{topDonors[1]?.name || 'User'}</h3>
                <p className="text-accent-blue font-black text-xl">${(topDonors[1]?.totalDonated / 100).toLocaleString()}</p>
              </div>
              <div className="w-full h-32 bg-gradient-to-t from-accent-blue to-accent-blue/10 rounded-t-2xl border-t-4 border-accent-blue/30" />
            </motion.div>

            {/* 1st Place */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2 z-10 font-heading">
              <div className="bg-white p-5 rounded-xl shadow-2xl border-2 border-yellow-400 w-full text-center mb-4 relative transform scale-110 min-h-[110px] flex flex-col justify-center">
                <Trophy className="absolute -top-8 left-1/2 -translate-x-1/2 h-12 w-12 text-yellow-500" />
                <h3 className="font-bold text-deep-blue text-base md:text-lg leading-tight px-2">{topDonors[0]?.name || 'User'}</h3>
                <p className="text-yellow-600 font-black text-2xl">${(topDonors[0]?.totalDonated / 100).toLocaleString()}</p>
              </div>
              <div className="w-full h-48 bg-gradient-to-t from-yellow-400/80 to-yellow-100 rounded-t-2xl border-t-4 border-yellow-400 drop-shadow-xl" />
            </motion.div>

            {/* 3rd Place */}
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full md:w-1/3 flex flex-col items-center order-3 font-heading">
              <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-primary-dark/20 w-full text-center mb-4 relative min-h-[100px] flex flex-col justify-center">
                <Award className="absolute -top-6 left-1/2 -translate-x-1/2 h-8 w-8 text-primary-dark" />
                <h3 className="font-bold text-deep-blue text-sm md:text-base leading-tight px-2">{topDonors[2]?.name || 'User'}</h3>
                <p className="text-primary-dark font-black text-lg">${(topDonors[2]?.totalDonated / 100).toLocaleString()}</p>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-primary-dark/40 to-primary-dark/5 rounded-t-2xl border-t-4 border-primary-dark/30" />
            </motion.div>
          </div>
        )}

        {/* Full List */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white p-2">
          <div className="space-y-2">
            {topDonors.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-soft-bg/50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-deep-blue/5 flex items-center justify-center font-bold text-deep-blue/50">
                    {index + 1}
                  </div>
                  <div>
                     <h4 className="font-heading font-bold text-deep-blue">{item.name}</h4>
                     <p className="text-sm text-deep-blue/50 flex items-center gap-1"><Users size={12}/> {item.donationCount} contributions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-primary-dark">${(item.totalDonated / 100).toLocaleString()}</p>
                </div>
              </div>
            ))}
            
            {topDonors.length === 0 && (
              <div className="p-12 text-center text-deep-blue/50">
                No impact data available yet.
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
