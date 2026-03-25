'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api/modules/auth.api';
import { useAuthStore } from '@/store/authStore';
import { ArrowRight, Mail, Lock, User, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  adminKey: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', adminKey: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    const payload = { ...data };
    if (!payload.adminKey) delete payload.adminKey;

    try {
      const res = await authApi.register(payload);
      setAuth(res.data.user, res.data.accessToken);
      toast.success('Account created successfully', {
        description: 'Welcome to the AltruGreen community.'
      });
      // Force hard navigate
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-soft-bg relative overflow-hidden py-12">
      
      {/* Background Decor */}
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-dark/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[0%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-accent-blue/5 blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden p-2">
          <CardHeader className="text-center pb-6">
            <CardTitle className="font-heading text-3xl font-bold text-deep-blue">Join the Club</CardTitle>
            <CardDescription className="text-deep-blue/60 mt-2">
              Create your account to start playing with purpose
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-deep-blue/80 font-medium ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-deep-blue/40" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe"
                    className="pl-10 h-12 rounded-xl bg-white/50 border-deep-blue/10 focus-visible:ring-accent-red"
                    {...form.register('name')}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-sm text-accent-red font-medium ml-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-deep-blue/80 font-medium ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-deep-blue/40" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com"
                    className="pl-10 h-12 rounded-xl bg-white/50 border-deep-blue/10 focus-visible:ring-accent-red"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-accent-red font-medium ml-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-deep-blue/80 font-medium ml-1">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-deep-blue/40" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl bg-white/50 border-deep-blue/10 focus-visible:ring-accent-red"
                    {...form.register('password')}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-accent-red font-medium ml-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              {/* Hidden Admin Key trigger */}
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowAdminKey(!showAdminKey)}
                  className="text-xs text-deep-blue/30 hover:text-deep-blue/60 transition-colors"
                >
                  Admin Setup
                </button>
              </div>

              {showAdminKey && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="adminKey" className="text-deep-blue/80 font-medium ml-1">Admin Registration Key</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-deep-blue/40" />
                    <Input 
                      id="adminKey" 
                      type="password" 
                      placeholder="Enter secret key..."
                      className="pl-10 h-12 rounded-xl bg-white/50 border-deep-blue/10 focus-visible:ring-primary-dark"
                      {...form.register('adminKey')}
                    />
                  </div>
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-xl mt-4 bg-primary-dark hover:bg-accent-red text-white text-base font-semibold shadow-lg shadow-primary-dark/20 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>

              <p className="text-xs text-center text-deep-blue/50 mt-4 px-4 leading-relaxed">
                By creating an account, you agree to our <Link href="/terms" className="underline hover:text-deep-blue">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-deep-blue">Privacy Policy</Link>.
              </p>

            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-deep-blue/5 pt-6 pb-2">
            <p className="text-deep-blue/60 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-dark font-bold hover:text-accent-red transition-colors">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
