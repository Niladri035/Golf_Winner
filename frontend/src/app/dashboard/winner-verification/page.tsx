'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { winnerApi } from '@/lib/api/modules/winner.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Upload, CheckCircle2, AlertTriangle, FileVideo, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function WinnerVerificationPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [win, setWin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await winnerApi.getWinnerStatus();
        setWin(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchStatus();
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('proof', file);

    try {
      await winnerApi.submitProof(formData);
      toast.success('Proof submitted!', { description: 'Our admin team will verify it within 24-48 hours.' });
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload proof');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-soft-bg">
        <div className="w-12 h-12 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!win) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-soft-bg p-6 text-center">
        <div className="w-20 h-20 bg-deep-blue/5 rounded-full flex items-center justify-center mb-6">
          <Trophy className="h-10 w-10 text-deep-blue/20" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-deep-blue mb-2">No Active Wins</h1>
        <p className="text-deep-blue/50 max-w-sm">
          You don't currently have any pending prize verifications. Keep playing and submitting your scores!
        </p>
        <Button onClick={() => router.push('/dashboard')} variant="link" className="mt-4 text-primary-dark">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex p-3 bg-yellow-100 rounded-full mb-2">
             <Trophy className="h-8 w-8 text-yellow-600" />
          </motion.div>
          <h1 className="text-4xl font-heading font-extrabold text-deep-blue">Claim Your Prize</h1>
          <p className="text-deep-blue/60">Upload a 'Proof of Life' photo or video with your prize to unlock future draws.</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="bg-primary-dark/5 border-b border-deep-blue/5">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Draw: {win.drawId?.month || 'Recent'}</CardTitle>
                <CardDescription>Match Tier: {win.matchTier} Numbers</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-deep-blue/40 uppercase tracking-widest">Prize Amount</p>
                <p className="text-2xl font-heading font-black text-primary-dark">${(win.prizeAmount / 100).toLocaleString()}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-8 space-y-8">
            
            {win.status === 'pending' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="border-2 border-dashed border-deep-blue/10 rounded-2xl p-8 flex flex-col items-center justify-center bg-soft-bg/30 hover:bg-white hover:border-accent-red/30 transition-all cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  
                  {preview ? (
                    <div className="w-full space-y-4">
                      {file?.type.startsWith('video') ? (
                         <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-deep-blue/5 shadow-sm">
                           <FileVideo className="text-accent-blue" />
                           <span className="text-sm font-medium truncate">{file.name}</span>
                         </div>
                      ) : (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-deep-blue/10">
                           <img src={preview} alt="Proof preview" className="object-cover w-full h-full" />
                        </div>
                      )}
                      <Button variant="outline" className="w-full border-deep-blue/10">Change File</Button>
                    </div>
                  ) : (
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-md group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-accent-red" />
                      </div>
                      <p className="text-sm font-bold text-deep-blue">Drop your proof here or click to browse</p>
                      <p className="text-xs text-deep-blue/40 mt-1">Accepts images and short videos (max 50MB)</p>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3 text-amber-800">
                   <AlertTriangle size={20} className="shrink-0" />
                   <p className="text-xs leading-relaxed">
                     <span className="font-bold">Important:</span> To keep our community transparent, winner proof is required. Please ensure the prize is clearly visible in your submission.
                   </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={!file || isSubmitting}
                  className="w-full h-14 bg-primary-dark hover:bg-accent-red text-white text-lg rounded-xl shadow-xl shadow-primary-dark/20 transition-all"
                >
                  {isSubmitting ? 'Uploading Proof...' : 'Submit Verification'}
                </Button>

              </form>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 size={40} />
                 </div>
                 <h3 className="text-2xl font-heading font-bold text-deep-blue capitalize">{win.status}</h3>
                 <p className="text-deep-blue/50 max-w-sm text-sm">
                   {win.status === 'verified' 
                    ? 'Your proof has been verified! You are eligible for all future draws.'
                    : 'Your proof is currently under review by our team.'}
                 </p>
                 <Button onClick={() => router.push('/dashboard')} variant="outline" className="mt-4">
                   Return to Dashboard
                 </Button>
              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
