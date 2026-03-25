'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api/modules/admin.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  User, 
  Trophy, 
  Calendar,
  AlertCircle,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      const res = await adminApi.getPendingWinners();
      // Handle paginated response structure
      const winnersList = Array.isArray(res.data) ? res.data : (res.data.winners || []);
      setWinners(winnersList);
    } catch (err) {
      toast.error('Failed to load pending winners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    setProcessingId(id);
    try {
      await adminApi.verifyWinner(id, status);
      toast.success(`Winner ${status === 'verified' ? 'Approved' : 'Rejected'}`);
      setWinners(winners.filter(w => w._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setProcessingId(null);
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
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="space-y-1">
          <h1 className="text-4xl font-heading font-extrabold text-deep-blue">Winner Verification</h1>
          <p className="text-deep-blue/60 font-medium">Review submitted proof-of-life for prize claimants.</p>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {winners.map((winner, i) => (
              <motion.div 
                key={winner._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                   <div className="grid md:grid-cols-3">
                      
                      {/* Proof Preview */}
                      <div className="bg-deep-blue/5 p-4 flex items-center justify-center min-h-[200px] border-r border-deep-blue/5">
                         {winner.proofUrl ? (
                           winner.proofUrl.includes('.mp4') || winner.proofUrl.includes('.mov') ? (
                             <div className="text-center group cursor-pointer" onClick={() => window.open(winner.proofUrl)}>
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                   <Play size={24} className="text-accent-red ml-1" />
                                </div>
                                <p className="text-xs font-bold text-deep-blue mt-3">Watch Video Proof</p>
                             </div>
                           ) : (
                             <img 
                                src={winner.proofUrl} 
                                alt="Winner Proof" 
                                className="object-cover rounded-lg w-full h-full cursor-pointer hover:opacity-90 transition-opacity" 
                                onClick={() => window.open(winner.proofUrl)}
                             />
                           )
                         ) : (
                           <div className="text-deep-blue/20">
                              <AlertCircle size={48} />
                              <p className="text-xs font-bold mt-2">No Proof Uploaded</p>
                           </div>
                         )}
                      </div>

                      {/* Winner Details */}
                      <div className="p-6 col-span-2 flex flex-col justify-between">
                         <div>
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-soft-bg flex items-center justify-center text-deep-blue/40 border border-deep-blue/5">
                                     <User size={20} />
                                  </div>
                                  <div>
                                     <h3 className="font-heading font-bold text-deep-blue">{winner.userId?.name || 'Anonymous User'}</h3>
                                     <p className="text-xs text-deep-blue/40">{winner.userId?.email}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-xs font-bold text-deep-blue/30 uppercase tracking-widest">Prize</p>
                                  <p className="text-xl font-heading font-black text-primary-dark">${(winner.prizeAmount / 100).toLocaleString()}</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-deep-blue/5">
                               <div className="flex items-center gap-2 text-sm text-deep-blue/60">
                                  <Calendar size={14} /> <span>Draw: {winner.drawId?.month || 'Recent'}</span>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-deep-blue/60">
                                  <Trophy size={14} className="text-yellow-600" /> <span>{winner.matchTier} Match Tier</span>
                               </div>
                            </div>
                         </div>

                         <div className="flex gap-4 pt-4">
                            <Button 
                              onClick={() => handleVerify(winner._id, 'verified')}
                              disabled={processingId === winner._id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2 font-bold"
                            >
                               <CheckCircle2 size={18} /> Approve Release
                            </Button>
                            <Button 
                              onClick={() => handleVerify(winner._id, 'rejected')}
                              disabled={processingId === winner._id}
                              variant="outline"
                              className="flex-1 border-accent-red/20 text-accent-red hover:bg-accent-red/5 gap-2 font-bold"
                            >
                               <XCircle size={18} /> Reject Proof
                            </Button>
                             <Link 
                                href={winner.proofUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                             >
                                <ExternalLink size={18} className="text-deep-blue/40" />
                             </Link>
                         </div>
                      </div>

                   </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {winners.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-deep-blue/10 rounded-3xl bg-white/30">
               <CheckCircle2 size={48} className="mx-auto text-green-500/30 mb-4" />
               <p className="text-xl font-heading font-bold text-deep-blue/30">All clear. No pending verifications.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
