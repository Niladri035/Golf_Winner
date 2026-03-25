'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { adminApi } from '@/lib/api/modules/admin.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  BarChart3, 
  Trophy, 
  Settings, 
  ArrowUpRight, 
  ArrowDownRight, 
  Heart,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.replace('/');
    }
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.getAnalytics();
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load platform analytics');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchAnalytics();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-soft-bg">
        <div className="w-12 h-12 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: `$${((data?.revenueMetrics?.totalRevenue || 0) / 100).toLocaleString()}`, icon: DollarSign, trend: '+12%', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Subscribers', value: data?.subscriptionMetrics?.activeSubscribers || 0, icon: Users, trend: '+5%', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
    { label: 'Pending Verifications', value: data?.winnerMetrics?.pendingVerifications || 0, icon: AlertCircle, trend: 'Critical', color: 'text-accent-red', bg: 'bg-accent-red/10' },
    { label: 'Charity Impact', value: `$${((data?.charityMetrics?.totalDonated || 0) / 100).toLocaleString()}`, icon: Heart, trend: '+20%', color: 'text-primary-dark', bg: 'bg-primary-dark/10' }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-extrabold text-deep-blue">Console Alpha</h1>
            <p className="text-deep-blue/60 font-medium">Platform-wide oversight and management.</p>
          </div>
          <div className="flex gap-4">
             <Button onClick={() => router.push('/admin/users')} className="bg-accent-blue hover:bg-deep-blue text-white">
               Manage Users
             </Button>
             <Button onClick={() => router.push('/admin/winners')} className="bg-primary-dark hover:bg-accent-red">
               Verify Winners
             </Button>
             <Button variant="outline" onClick={() => router.push('/admin/charities')} className="border-deep-blue/20">
               Manage Charities
             </Button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-none shadow-lg bg-white/70 backdrop-blur-xl hover:-translate-y-1 transition-transform">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-deep-blue/60">{stat.label}</CardTitle>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black text-deep-blue font-heading">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs font-bold text-green-600">
                     <ArrowUpRight size={14} /> {stat.trend} <span className="text-deep-blue/30 font-medium ml-1">since last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Console Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Draw Activity */}
          <Card className="lg:col-span-2 border-none shadow-xl bg-white/80 backdrop-blur-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-deep-blue/5">
              <div>
                <CardTitle className="text-xl font-heading font-bold text-deep-blue">Platform Activity</CardTitle>
                <CardDescription>Live metrics for the current draw cycle.</CardDescription>
              </div>
              <BarChart3 className="text-deep-blue/10" size={32} />
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-8">
                {/* Visual indicator (Progress Bar) */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-deep-blue/70">
                    <span>Pool Collection</span>
                    <span>${((data?.revenueMetrics?.monthlyExpectedPool || 0) / 100).toLocaleString() || '$0'}</span>
                  </div>
                  <div className="w-full h-4 bg-deep-blue/5 rounded-full overflow-hidden border border-deep-blue/5">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: '65%' }} 
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-primary-dark to-accent-red" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="p-4 rounded-2xl bg-soft-bg/50 border border-deep-blue/5">
                      <p className="text-xs font-bold text-deep-blue/40 uppercase tracking-widest mb-1">Total Users</p>
                      <p className="text-2xl font-heading font-black text-deep-blue">{data?.userMetrics?.totalUsers || 0}</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-soft-bg/50 border border-deep-blue/5">
                      <p className="text-xs font-bold text-deep-blue/40 uppercase tracking-widest mb-1">New this month</p>
                      <p className="text-2xl font-heading font-black text-accent-blue">+{data?.userMetrics?.newUsersThisMonth || 0}</p>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions / Charity Distribution */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
             <CardHeader className="border-b border-deep-blue/5">
                <CardTitle className="text-lg font-heading font-bold text-deep-blue">Charity Performance</CardTitle>
                <CardDescription>Distribution of user preferences.</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="space-y-6">
                   {data?.charityMetrics?.distribution?.map((item: any, i: number) => (
                      <div key={i} className="flex flex-col gap-2">
                         <div className="flex justify-between items-center px-1">
                            <span className="text-sm font-bold text-deep-blue/80">{item._id}</span>
                            <span className="text-xs font-medium text-deep-blue/40">{item.count} Votes</span>
                         </div>
                         <div className="w-full h-2 bg-deep-blue/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${(item.total / (data.charityMetrics.totalDonated || 1)) * 100}%` }}
                               className="h-full bg-accent-blue"
                            />
                         </div>
                      </div>
                   ))}
                   
                   {!data?.charityMetrics?.distribution?.length && (
                      <p className="text-sm text-center py-8 text-deep-blue/30 italic">No distribution data available.</p>
                   )}

                   <div className="pt-4 mt-4 border-t border-deep-blue/5">
                      <Button variant="ghost" className="w-full text-primary-dark hover:bg-primary-dark/5" onClick={() => router.push('/admin/charities')}>
                        Configure Charities <Settings size={14} className="ml-2" />
                      </Button>
                   </div>
                </div>
             </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
