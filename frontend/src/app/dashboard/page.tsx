'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { dashboardApi } from '@/lib/api/modules/dashboard.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, CreditCard, Heart, ArrowRight, Settings, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardApi.getOverview();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboard();
    }
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-soft-bg">
        <div className="w-12 h-12 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-black text-deep-blue tracking-tight">
              Welcome back, <span className="text-primary-dark">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-deep-blue/70 font-semibold text-lg">Here's your AltruGreen overview and impact.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
             <Button variant="outline" className="border-deep-blue/20 text-deep-blue hover:bg-white/50 bg-transparent h-12 px-6 rounded-xl shadow-sm" onClick={() => router.push('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4" /> Account Settings
             </Button>
          </motion.div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-none shadow-xl bg-gradient-to-br from-primary-dark to-accent-red text-white overflow-hidden relative h-full">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <CardHeader className="pb-2">
                <CardTitle className="text-white/80 text-sm font-medium flex items-center gap-2">
                  <CreditCard size={18} /> Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold mb-1 capitalize">
                  {data?.subscription?.status || 'Inactive'}
                </div>
                <p className="text-white/70 text-sm">
                  {data?.subscription?.status === 'active' 
                    ? `Renews on ${new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}` 
                    : 'Subscribe to enter the next draw'}
                </p>
                {data?.subscription?.status !== 'active' && (
                  <Button onClick={() => router.push('/subscribe')} className="w-full mt-4 bg-white text-primary-dark hover:bg-white/90">
                    Subscribe Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-none shadow-lg bg-white/70 backdrop-blur-xl h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-deep-blue/60 text-sm font-medium flex items-center gap-2">
                  <Heart size={18} className="text-accent-red" /> Charitable Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-deep-blue mb-1">
                  ${((data?.user?.totalContributions || 0) / 100).toFixed(2)}
                </div>
                <p className="text-deep-blue/60 text-sm mb-4">
                  Total direct contributions
                </p>
                <div className="p-3 bg-accent-blue/10 rounded-lg border border-accent-blue/20">
                  <p className="text-sm font-medium text-deep-blue">
                    Supporting: <span className="font-bold">{data?.user?.selectedCharity?.name || 'Global Environment Fund'}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-none shadow-lg bg-white/70 backdrop-blur-xl h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-deep-blue/60 text-sm font-medium flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-600" /> Recent Winnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.winnings?.length > 0 ? (
                  <div className="space-y-4">
                    {data.winnings.slice(0, 2).map((win: any) => (
                      <div key={win._id} className="flex justify-between items-center p-3 bg-soft-bg rounded-lg border border-deep-blue/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <span className="text-yellow-700 font-bold text-xs">{win.matchTier}M</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-deep-blue">${(win.prizeAmount / 100).toFixed(2)}</p>
                            <p className="text-xs text-deep-blue/50">{new Date(win.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${win.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {win.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-center">
                    <p className="text-deep-blue/40 text-sm mb-4">No winnings yet. Enter your scores to increase your chances next draw!</p>
                  </div>
                )}
                <Button variant="ghost" className="w-full mt-2 text-primary-dark" onClick={() => router.push('/dashboard/winnings')}>
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Scores Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-deep-blue/10">
              <div>
                <CardTitle className="text-xl font-heading font-black text-deep-blue uppercase tracking-wider">Your Golf Scores</CardTitle>
                <CardDescription className="text-deep-blue/50">Your 5 most recent rounds. These numbers represent your tickets for the monthly draw.</CardDescription>
              </div>
              <Button onClick={() => router.push('/dashboard/scores')} className="bg-accent-blue hover:bg-deep-blue text-white shadow-md transition-all active:scale-95">
                Manage Scores
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {data?.user?.scores?.length > 0 ? (
                  data.user.scores.map((score: any, index: number) => (
                    <div key={score._id} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-accent-red rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                      <div className="relative p-6 bg-white rounded-2xl border border-deep-blue/10 flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-deep-blue to-accent-blue">
                          {score.value}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-medium text-deep-blue/40">
                          <CalendarDays size={12} /> {new Date(score.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-deep-blue/10 rounded-2xl">
                    <p className="text-deep-blue/60 mb-4">You haven't added any scores yet.</p>
                    <Button onClick={() => router.push('/dashboard/scores')} variant="outline" className="border-primary-dark text-primary-dark">
                      Add First Score
                    </Button>
                  </div>
                )}
                {/* Empty slots placeholders */}
                {data?.user?.scores && Array.from({ length: Math.max(0, 5 - data.user.scores.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-6 bg-soft-bg/50 rounded-2xl border-2 border-dashed border-deep-blue/10 flex flex-col items-center justify-center h-full min-h-[120px]">
                    <span className="text-2xl font-bold text-deep-blue/20">?</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
