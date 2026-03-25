'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { subscriptionApi } from '@/lib/api/modules/subscription.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SubscribePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null);

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!isAuthenticated) {
      toast.info('Please create an account to subscribe');
      router.push('/register');
      return;
    }

    setLoading(plan);
    try {
      const res = await subscriptionApi.createCheckout(plan);
      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe Checkout
      }
    } catch (error: any) {
      toast.error('Failed to initialize checkout. Please try again.');
      setLoading(null);
    }
  };

  const features = [
    "Entry into Monthly Luxury Draws",
    "Minimum 10% direct charitable impact",
    "Rolling 5-score handicap window tracking",
    "Exclusive community events & leaderboards",
    "Transparent algorithmic draw engine"
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg py-20 px-6 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-deep-blue to-soft-bg pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-heading font-extrabold text-white">
            Join the Club
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/80 max-w-2xl mx-auto">
            Experience premium golf subscription while making a real-world impact. Simple, transparent pricing.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Monthly Plan */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="h-full border-none shadow-xl bg-white hover:-translate-y-2 transition-transform duration-300">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-heading font-bold text-deep-blue">Monthly Membership</CardTitle>
                <CardDescription className="text-lg">Flexible, cancel anytime.</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8 border-b border-deep-blue/5">
                <div className="my-6">
                  <span className="text-6xl font-black text-deep-blue font-heading">$10</span>
                  <span className="text-deep-blue/60 font-medium">/month</span>
                </div>
                <Button 
                  size="lg" 
                  disabled={loading !== null}
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full text-lg h-14 bg-deep-blue hover:bg-accent-blue text-white rounded-xl shadow-lg"
                >
                  {loading === 'monthly' ? 'Starting Checkout...' : 'Select Monthly'}
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-6 space-y-4 bg-soft-bg/50 mt-auto rounded-b-xl">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-deep-blue/80">
                    <CheckCircle2 size={18} className="text-accent-blue shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardFooter>
            </Card>
          </motion.div>

          {/* Yearly Plan (Premium) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
            <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
              <span className="bg-accent-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                Best Value (Save $20)
              </span>
            </div>
            <Card className="h-full border-2 border-accent-red shadow-2xl bg-white hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full blur-3xl" />
              <CardHeader className="text-center pb-2 relative z-10">
                <CardTitle className="text-2xl font-heading font-bold text-primary-dark">Annual Membership</CardTitle>
                <CardDescription className="text-lg text-primary-dark/70">Commit to impact.</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8 border-b border-deep-blue/5 relative z-10">
                <div className="my-6">
                  <span className="text-6xl font-black text-primary-dark font-heading">$100</span>
                  <span className="text-primary-dark/60 font-medium">/year</span>
                </div>
                <Button 
                  size="lg"
                  disabled={loading !== null} 
                  onClick={() => handleSubscribe('yearly')}
                  className="w-full text-lg h-14 bg-gradient-to-r from-primary-dark to-accent-red hover:from-accent-red hover:to-primary-dark text-white rounded-xl shadow-xl shadow-primary-dark/20"
                >
                  {loading === 'yearly' ? 'Starting Checkout...' : 'Select Annual'}
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-6 space-y-4 bg-primary-dark/5 mt-auto rounded-b-xl relative z-10">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-primary-dark/90 font-medium">
                    <CheckCircle2 size={18} className="text-accent-red shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardFooter>
            </Card>
          </motion.div>

        </div>

        <div className="mt-16 text-center text-deep-blue/60 flex items-center justify-center gap-2">
          <ShieldCheck size={20} className="text-green-600" />
          <span className="font-medium">Secure, encrypted checkout processed by Stripe.</span>
        </div>
      </div>
    </div>
  );
}
