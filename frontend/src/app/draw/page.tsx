'use client';

import React, { useEffect, useState } from 'react';
import { drawApi } from '@/lib/api/modules/draw.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, RefreshCw, CalendarDays, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DrawPage() {
  const [latestDraw, setLatestDraw] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchLatest = async () => {
    try {
      const res = await drawApi.getLatest();
      setLatestDraw(res.data);
    } catch (err) {
      toast.error('Failed to load the latest draw data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await drawApi.runSimulatedDraw();
      toast.success('Simulation complete!', { description: 'The new draw has been generated.' });
      await fetchLatest();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-soft-bg">
        <div className="w-12 h-12 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-24 pb-12 px-6 overflow-hidden relative">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-accent-red/5 to-transparent blur-3xl" />
      
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-deep-blue/5 border border-deep-blue/10">
              <span className="flex h-2 w-2 rounded-full bg-accent-red animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-deep-blue">Latest Results</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-deep-blue tracking-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-accent-red">Draw</span>
            </h1>
            <p className="text-xl text-deep-blue/60 max-w-2xl">
              Winning numbers are algorithmically weighted based on member golf scores (1-45). Lower scores drawn more frequently.
            </p>
          </motion.div>

          {/* Admin Simulation Tool (visible for demo purposes) */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Button 
              onClick={handleSimulate} 
              disabled={isSimulating}
              variant="outline" 
              className="border-deep-blue/20 text-deep-blue hover:bg-deep-blue/5 h-12 gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Simulating...' : 'Run Manual Simulation'}
            </Button>
          </motion.div>
        </div>

        {latestDraw ? (
          <>
            {/* The Numbers */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-deep-blue/5 rounded-full blur-3xl pointer-events-none" />
              
              <h2 className="text-deep-blue/50 font-bold uppercase tracking-widest text-sm mb-8 z-10 flex items-center gap-2">
                <CalendarDays size={16} /> {latestDraw.month}
              </h2>

              <div className="flex flex-wrap justify-center gap-4 md:gap-8 z-10">
                {(latestDraw.drawnNumbers || []).map((num: number, idx: number) => (
                  <motion.div 
                    key={`${latestDraw._id}-${idx}`}
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15, 
                      delay: 0.5 + (idx * 0.1) 
                    }}
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary-dark to-accent-red flex items-center justify-center shadow-lg shadow-primary-dark/30 transform hover:scale-110 transition-transform duration-300"
                  >
                    <span className="text-3xl md:text-5xl font-black text-white font-heading">
                      {num}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Prize Pool", value: `$${(latestDraw.prizePool / 100).toLocaleString()}`, icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-100" },
                { label: "Participants", value: latestDraw.totalParticipants.toLocaleString(), icon: Users, color: "text-accent-blue", bg: "bg-accent-blue/10" },
                { label: "Jackpot Winners (5 Match)", value: latestDraw.winners.length, icon: Award, color: "text-primary-dark", bg: "bg-primary-dark/10" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + (i * 0.1) }}>
                  <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md hover:-translate-y-1 transition-transform duration-300 h-full">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-deep-blue/60 text-sm font-medium">{stat.label}</CardTitle>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-heading font-black text-deep-blue">{stat.value}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Jackpot Notification */}
            {latestDraw.jackpotRollover > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 flex items-center gap-6"
              >
                <div className="w-16 h-16 shrink-0 rounded-full bg-yellow-500/20 flex items-center justify-center animate-pulse">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-yellow-800">No Jackpot Winners!</h3>
                  <p className="text-yellow-800/80 font-medium">
                    ${(latestDraw.jackpotRollover / 100).toLocaleString()} has rolled over to next month's Draw.
                  </p>
                </div>
              </motion.div>
            )}

          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-white">
            <p className="text-xl text-deep-blue/50 font-medium">No draws have been recorded yet.</p>
            <Button onClick={handleSimulate} className="mt-4 bg-primary-dark hover:bg-accent-red">Run Initial Draw</Button>
          </div>
        )}
      </div>
    </div>
  );
}
