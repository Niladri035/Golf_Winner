'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { scoreApi } from '@/lib/api/modules/score.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const scoreSchema = z.object({
  value: z.number().min(1, 'Score must be at least 1').max(45, 'Score must be a valid draw number (1-45)'),
  date: z.string().min(1, 'Date is required'),
});

type ScoreFormValues = z.infer<typeof scoreSchema>;

export default function ScoresPage() {
  const { user } = useAuthStore();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreSchema),
    defaultValues: { 
      value: undefined, 
      date: new Date().toISOString().split('T')[0] 
    },
  });

  const fetchScores = async () => {
    try {
      const res = await scoreApi.getAll();
      setScores(res.data);
    } catch (err) {
      toast.error('Failed to load scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const onSubmit = async (data: ScoreFormValues) => {
    setIsSubmitting(true);
    try {
      await scoreApi.add(data.value, new Date(data.date).toISOString());
      toast.success('Score added successfully');
      form.reset({ value: undefined, date: new Date().toISOString().split('T')[0] });
      await fetchScores();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add score');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await scoreApi.delete(id);
      toast.success('Score removed');
      setScores(scores.filter(s => s._id !== id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete score');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-extrabold text-deep-blue flex items-center gap-3">
            Manage Scores
          </h1>
          <p className="text-deep-blue/60 font-medium max-w-2xl">
            Submit your golf scores to generate your unique lottery tickets for the monthly draw. We use a rolling window of your 5 most recent scores.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Add Score Form */}
          <Card className="border-none shadow-xl bg-white/70 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-deep-blue text-xl">Add New Score</CardTitle>
              <CardDescription>Enter a valid score between 1 and 45.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-deep-blue/80">Score Value (1-45)</Label>
                  <Input 
                    id="value" 
                    type="number" 
                    min={1} max={45}
                    placeholder="e.g. 18"
                    className="h-12 rounded-xl bg-white/50 border-deep-blue/10"
                    {...form.register('value', { valueAsNumber: true })}
                  />
                  {form.formState.errors.value && (
                    <p className="text-sm text-accent-red mt-1">{form.formState.errors.value.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-deep-blue/80">Date Played</Label>
                  <Input 
                    id="date" 
                    type="date"
                    max={new Date().toISOString().split('T')[0]} 
                    className="h-12 rounded-xl bg-white/50 border-deep-blue/10"
                    {...form.register('date')}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-accent-red mt-1">{form.formState.errors.date.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100 flex gap-2 items-start mt-4">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <p className="text-xs">If you add a 6th score, your oldest score will be automatically archived by the system.</p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || scores.length >= 50} 
                  className="w-full h-12 rounded-xl bg-deep-blue hover:bg-accent-blue text-white mt-2 transition-all shadow-md mt-6"
                >
                  {isSubmitting ? 'Saving...' : <><Plus className="mr-2 h-4 w-4" /> Add Score to Pool</>}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Rolling Window */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-xl text-deep-blue flex items-center justify-between">
              Your 5-Score Window
              <span className="text-sm font-medium bg-deep-blue/10 text-deep-blue px-3 py-1 rounded-full">
                {scores.length} / 5
              </span>
            </h3>

            {loading ? (
              <div className="h-40 flex items-center justify-center border-2 border-dashed border-deep-blue/10 rounded-2xl">
                <div className="w-6 h-6 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
              </div>
            ) : scores.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-deep-blue/10 rounded-2xl text-deep-blue/40 text-sm">
                <AlertCircle className="mb-2 h-6 w-6 opacity-50" />
                No active scores.
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {scores.map((score, idx) => (
                    <motion.div
                      key={score._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="bg-white p-4 rounded-xl border border-deep-blue/10 shadow-sm flex items-center justify-between group"
                    >
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-dark/10 to-accent-red/10 flex items-center justify-center font-heading font-black text-xl text-primary-dark">
                          {score.value}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-deep-blue">
                            {new Date(score.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-deep-blue/50">Used for upcoming draws</p>
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(score._id)}
                        className="text-deep-blue/30 hover:text-accent-red hover:bg-accent-red/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
