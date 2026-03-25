'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { adminApi } from '@/lib/api/modules/admin.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  ArrowLeft,
  UserCheck,
  UserX,
  Loader2,
  Mail,
  Shield,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const router = useRouter();
  const { user: currentUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || currentUser?.role !== 'admin')) {
      router.replace('/');
    }
  }, [isAuthenticated, currentUser, authLoading, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getUsers(1, 100);
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') fetchUsers();
  }, [currentUser]);

  const handleActivate = async (userId: string) => {
    try {
      setActivatingId(userId);
      await adminApi.activateUser(userId);
      toast.success('User activated successfully');
      fetchUsers(); // Refresh list
    } catch (err) {
      toast.error('Failed to activate user');
    } finally {
      setActivatingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || (loading && users.length === 0)) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-soft-bg">
        <div className="w-12 h-12 border-4 border-accent-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin')} className="p-2 hover:bg-white/50">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-black text-deep-blue uppercase tracking-tight">User Management</h1>
              <p className="text-deep-blue/60 font-medium">Manage platform access and subscription overrides.</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-deep-blue/30" size={18} />
            <input 
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-white/70 backdrop-blur-md border border-deep-blue/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/20 transition-all font-medium text-deep-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-deep-blue/5 border-b border-deep-blue/10">
                    <th className="px-6 py-4 text-xs font-black text-deep-blue/40 uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 text-xs font-black text-deep-blue/40 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-xs font-black text-deep-blue/40 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-deep-blue/40 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-4 text-xs font-black text-deep-blue/40 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-deep-blue/5">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((u) => (
                      <motion.tr 
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-soft-bg/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-dark to-accent-red flex items-center justify-center text-white font-black shadow-md">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-deep-blue">{u.name}</p>
                              <p className="text-xs font-medium text-deep-blue/50 flex items-center gap-1">
                                <Mail size={12} /> {u.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                            {u.role === 'admin' ? <Shield size={12} /> : null}
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {u.subscriptionStatus === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                            {u.subscriptionStatus.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-deep-blue/60">
                           <div className="flex items-center gap-1">
                              <Calendar size={14} /> {new Date(u.createdAt).toLocaleDateString()}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.subscriptionStatus !== 'active' && (
                            <Button 
                              onClick={() => handleActivate(u._id)}
                              disabled={activatingId === u._id}
                              className="bg-accent-blue hover:bg-deep-blue text-white shadow-lg active:scale-95 transition-all h-9 px-4 rounded-lg"
                            >
                              {activatingId === u._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Activate'
                              )}
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-deep-blue/30 font-medium italic">No users found matching your search.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
