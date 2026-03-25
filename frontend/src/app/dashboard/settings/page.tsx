'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/lib/api/modules/user.api';
import { charityApi } from '@/lib/api/modules/charity.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Heart, 
  Shield, 
  ArrowLeft, 
  Save, 
  Loader2,
  ChevronRight,
  UserCircle,
  Lock,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'security' | 'charity';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState<any>(null);
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [selectedCharity, setSelectedCharity] = useState('');
  const [charityPercentage, setCharityPercentage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, charitiesRes] = await Promise.all([
          userApi.getProfile(),
          charityApi.getAll()
        ]);
        
        const userData = profileRes.data;
        setProfile(userData);
        setCharities(charitiesRes.data || []);
        
        // Initialize form
        setName(userData.name);
        setSelectedCharity(userData.selectedCharity?._id || '');
        setCharityPercentage(userData.charityPercentage || 10);
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await userApi.updateProfile({
        name,
        selectedCharity,
        charityPercentage
      });
      
      // Update global auth state to reflect changes immediately
      if (res.success && res.data) {
        updateUser({
          name: res.data.name,
          charityPercentage: res.data.charityPercentage,
        });
      }
      
      toast.success('Settings updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-soft-bg">
        <div className="w-12 h-12 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white/50">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-black text-deep-blue uppercase tracking-tight">Account Settings</h1>
            <p className="text-deep-blue/60 font-medium">Manage your profile and charity preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Nav */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-gradient-to-br from-primary-dark to-accent-red text-white overflow-hidden relative">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center mb-4 backdrop-blur-md">
                  <UserCircle size={48} className="text-white" />
                </div>
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-white/70 text-sm mb-4">{user?.email}</p>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                  {user?.role} Access
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
               <button 
                onClick={() => setActiveTab('profile')}
                className={cn(
                  "w-full p-4 rounded-xl border flex items-center justify-between transition-all group",
                  activeTab === 'profile' 
                    ? "bg-white border-deep-blue/10 shadow-md text-deep-blue" 
                    : "bg-white/50 border-transparent text-deep-blue/40 hover:text-deep-blue hover:bg-white/80"
                )}
               >
                  <div className="flex items-center gap-3">
                    <User size={18} className={activeTab === 'profile' ? "text-primary-dark" : ""} />
                    <span className="font-bold text-sm">Personal Info</span>
                  </div>
                  <ChevronRight size={16} className={cn("transition-transform", activeTab === 'profile' ? "translate-x-1" : "group-hover:translate-x-0.5")} />
               </button>

               <button 
                onClick={() => setActiveTab('security')}
                className={cn(
                  "w-full p-4 rounded-xl border flex items-center justify-between transition-all group",
                  activeTab === 'security' 
                    ? "bg-white border-deep-blue/10 shadow-md text-deep-blue" 
                    : "bg-white/50 border-transparent text-deep-blue/40 hover:text-deep-blue hover:bg-white/80"
                )}
               >
                  <div className="flex items-center gap-3">
                    <Shield size={18} className={activeTab === 'security' ? "text-primary-dark" : ""} />
                    <span className="font-bold text-sm">Security</span>
                  </div>
                  <ChevronRight size={16} className={cn("transition-transform", activeTab === 'security' ? "translate-x-1" : "group-hover:translate-x-0.5")} />
               </button>

               <button 
                onClick={() => setActiveTab('charity')}
                className={cn(
                  "w-full p-4 rounded-xl border flex items-center justify-between transition-all group",
                  activeTab === 'charity' 
                    ? "bg-white border-deep-blue/10 shadow-md text-deep-blue" 
                    : "bg-white/50 border-transparent text-deep-blue/40 hover:text-deep-blue hover:bg-white/80"
                )}
               >
                  <div className="flex items-center gap-3">
                    <Heart size={18} className={activeTab === 'charity' ? "text-accent-red" : ""} />
                    <span className="font-bold text-sm">Charity Preferences</span>
                  </div>
                  <ChevronRight size={16} className={cn("transition-transform", activeTab === 'charity' ? "translate-x-1" : "group-hover:translate-x-0.5")} />
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
                    <CardHeader className="border-b border-deep-blue/5">
                      <CardTitle className="text-lg font-heading font-bold text-deep-blue flex items-center gap-2">
                        <User size={20} className="text-primary-dark" /> Profile Information
                      </CardTitle>
                      <CardDescription>Update your public identity and how others see you.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-deep-blue/60 font-bold text-xs uppercase tracking-widest">Display Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          className="h-12 border-deep-blue/10 focus:ring-primary-dark rounded-xl"
                        />
                      </div>
                      <div className="space-y-2 opacity-60">
                        <Label className="text-deep-blue/60 font-bold text-xs uppercase tracking-widest">Email Address</Label>
                        <div className="relative">
                          <Input value={user?.email} disabled className="h-12 bg-soft-bg border-deep-blue/5 rounded-xl pr-10" />
                          <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-blue/20" />
                        </div>
                        <p className="text-[10px] text-deep-blue/40 font-black uppercase tracking-tight italic">Email is managed by Altrulife Identity Services for security.</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Tip */}
                  <div className="bg-primary-dark/5 p-4 rounded-2xl border border-primary-dark/10 flex gap-4">
                    <div className="p-2 bg-primary-dark rounded-lg text-white h-fit">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-deep-blue">Profile Visibility</p>
                      <p className="text-xs text-deep-blue/60 mt-1">Your display name will be used on the public leaderboard and winner announcements.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
                    <CardHeader className="border-b border-deep-blue/5">
                      <CardTitle className="text-lg font-heading font-bold text-deep-blue flex items-center gap-2">
                        <Shield size={20} className="text-primary-dark" /> Security Settings
                      </CardTitle>
                      <CardDescription>Protect your account with modern security standards.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-deep-blue/5 bg-soft-bg/50">
                          <div>
                            <p className="font-bold text-deep-blue text-sm">Two-Factor Authentication</p>
                            <p className="text-xs text-deep-blue/40">Add an extra layer of security to your account.</p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-lg border-deep-blue/10 text-deep-blue font-bold text-xs">Enable</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 rounded-xl border border-deep-blue/5 bg-soft-bg/50">
                          <div>
                            <p className="font-bold text-deep-blue text-sm">Password Management</p>
                            <p className="text-xs text-deep-blue/40">Last changed 3 months ago.</p>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-lg border-deep-blue/10 text-deep-blue font-bold text-xs">Update</Button>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-deep-blue/5">
                        <p className="text-xs font-bold text-deep-blue/30 uppercase tracking-widest mb-4">Active Sessions</p>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                               <Shield size={16} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-deep-blue">Chrome on Windows</p>
                               <p className="text-[10px] text-deep-blue/40">Current Session • India</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'charity' && (
                <motion.div
                  key="charity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="border-none shadow-xl bg-white/80 backdrop-blur-xl">
                    <CardHeader className="border-b border-deep-blue/5">
                      <CardTitle className="text-lg font-heading font-bold text-deep-blue flex items-center gap-2">
                        <Heart size={20} className="text-accent-red" /> Charity Preferences
                      </CardTitle>
                      <CardDescription>Configure how your subscription supports global causes.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                      <div className="space-y-2">
                        <Label htmlFor="charity" className="text-deep-blue/60 font-bold text-xs uppercase tracking-widest">Selected Charity</Label>
                        <select 
                          id="charity"
                          value={selectedCharity}
                          onChange={(e) => setSelectedCharity(e.target.value)}
                          className="w-full h-12 rounded-xl border border-deep-blue/10 bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-dark/20 transition-all"
                        >
                          <option value="" disabled>Choose a cause to support...</option>
                          {charities.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <Label className="text-deep-blue/60 font-bold text-xs uppercase tracking-widest">Contribution Percentage</Label>
                            <p className="text-[10px] text-deep-blue/40 font-medium">Portion of your monthly fee donated.</p>
                          </div>
                          <span className="text-3xl font-black text-primary-dark tracking-tighter">{charityPercentage}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          step="5"
                          value={charityPercentage}
                          onChange={(e) => setCharityPercentage(parseInt(e.target.value))}
                          className="w-full h-3 bg-deep-blue/5 rounded-full appearance-none cursor-pointer accent-primary-dark"
                        />
                        <div className="flex justify-between text-[10px] font-black text-deep-blue/30 uppercase tracking-[0.2em]">
                          <span>Minimum 10%</span>
                          <span>Maximum Impact 100%</span>
                        </div>
                      </div>

                      {/* Info Card */}
                      <div className="p-4 rounded-2xl bg-accent-red/5 border border-accent-red/10 flex gap-4">
                        <div className="p-2 bg-accent-red rounded-lg text-white h-fit">
                          <Heart size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-deep-blue">Did you know?</p>
                          <p className="text-xs text-deep-blue/60 mt-1">If you set this to 100%, the entire net profit from your subscription goes to your selected charity.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Actions */}
            <div className="flex justify-end gap-3 mt-8">
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-deep-blue/30 font-bold uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-white/50">
                  Discard
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-deep-blue hover:bg-primary-dark text-white h-12 px-10 rounded-xl shadow-lg shadow-deep-blue/10 flex items-center gap-3 font-bold uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Apply & Save
                </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
