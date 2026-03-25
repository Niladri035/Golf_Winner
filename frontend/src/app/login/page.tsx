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
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      setAuth(res.data.user, res.data.accessToken);
      toast.success('Welcome back to AltruGreen');
      // Force hard navigate to refresh auth state in layout properly
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-soft-bg relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-dark/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-blue/5 blur-3xl pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden p-2">
          <CardHeader className="text-center pb-6">
            <CardTitle className="font-heading text-3xl font-bold text-deep-blue">Welcome Back</CardTitle>
            <CardDescription className="text-deep-blue/60 mt-2">
              Enter your credentials to access your AltruGreen account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
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
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-deep-blue/80 font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-accent-blue hover:text-deep-blue transition-colors">
                    Forgot password?
                  </Link>
                </div>
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

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary-dark hover:bg-accent-red text-white text-base font-semibold shadow-lg shadow-primary-dark/20 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>

            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-deep-blue/5 pt-6 pb-2">
            <p className="text-deep-blue/60 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-dark font-bold hover:text-accent-red transition-colors">
                Join the Club
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
