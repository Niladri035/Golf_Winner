'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/modules/admin.api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Settings, 
  Heart, 
  Globe, 
  Save, 
  X,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Use a simple state for forms
  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    websiteUrl: '',
    category: 'Environment',
  });

  const fetchCharities = async () => {
    try {
      const res = await adminApi.getCharities();
      setCharities(res.data);
    } catch (err) {
      toast.error('Failed to load charities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleCreate = async () => {
    try {
      await adminApi.createCharity(formData);
      toast.success('Charity created');
      setIsAdding(false);
      setFormData({ name: '', description: '', websiteUrl: '', category: 'Environment' });
      fetchCharities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Creation failed');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await adminApi.updateCharity(id, formData);
      toast.success('Charity updated');
      setEditingId(null);
      fetchCharities();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this charity?')) return;
    try {
      await adminApi.deleteCharity(id);
      toast.success('Charity deleted');
      setCharities(charities.filter(c => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Deletion failed');
    }
  };

  const startEdit = (charity: any) => {
    setEditingId(charity._id);
    setFormData({
      name: charity.name,
      description: charity.description,
      websiteUrl: charity.websiteUrl,
      category: charity.category,
    });
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
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-extrabold text-deep-blue">Charity Console</h1>
            <p className="text-deep-blue/60 font-medium">Manage the vetted environmental partners on the platform.</p>
          </div>
          <Button 
            onClick={() => setIsAdding(true)} 
            disabled={isAdding}
            className="bg-primary-dark hover:bg-accent-red gap-2 shadow-lg"
          >
            <PlusCircle size={20} /> Add New Partner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Add New Entry */}
          <AnimatePresence>
            {isAdding && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Card className="border-2 border-dashed border-primary-dark/20 bg-white/50 h-full p-2">
                     <CardHeader>
                        <CardTitle className="flex justify-between items-center text-primary-dark">
                           New Partner
                           <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)}><X size={18}/></Button>
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <Input placeholder="Partner Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl" />
                        <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[100px] rounded-xl" />
                        <Input placeholder="Website URL" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="h-11 rounded-xl" />
                        <Input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="h-11 rounded-xl" />
                     </CardContent>
                     <CardFooter>
                        <Button className="w-full bg-primary-dark hover:bg-accent-red" onClick={handleCreate}>Create Partner</Button>
                     </CardFooter>
                  </Card>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Charity Cards */}
          {charities.map((charity) => (
             <motion.div key={charity._id} layout>
                <Card className={`h-full border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden transition-all ${editingId === charity._id ? 'ring-2 ring-primary-dark' : ''}`}>
                   {editingId === charity._id ? (
                      <div className="p-6 space-y-4">
                         <div className="flex justify-between items-center">
                            <h3 className="font-heading font-bold text-deep-blue">Editing Partner</h3>
                            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X size={18}/></Button>
                         </div>
                         <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-11 rounded-xl" />
                         <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="min-h-[100px] rounded-xl" />
                         <Input value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="h-11 rounded-xl" />
                         <Button className="w-full bg-deep-blue text-white gap-2" onClick={() => handleUpdate(charity._id)}>
                            <Save size={18}/> Save Changes
                         </Button>
                      </div>
                   ) : (
                      <>
                         <div className="p-6 border-b border-deep-blue/5 flex items-center gap-4 bg-primary-dark/5">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-dark shadow-sm">
                               <Heart size={20} />
                            </div>
                            <div>
                               <h3 className="font-heading font-bold text-deep-blue text-lg">{charity.name}</h3>
                               <p className="text-xs font-medium text-deep-blue/40 uppercase tracking-widest">{charity.category}</p>
                            </div>
                         </div>
                         <CardContent className="pt-6">
                            <p className="text-sm text-deep-blue/70 line-clamp-3 leading-relaxed mb-4">
                               {charity.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-accent-blue font-bold">
                               <Globe size={14} /> <span>{charity.websiteUrl}</span>
                            </div>
                         </CardContent>
                          <CardFooter className="flex gap-2 bg-soft-bg/50 mt-auto p-3">
                            <Button variant="ghost" size="sm" className="flex-1 text-deep-blue/60 hover:text-deep-blue hover:bg-white/50 h-9" onClick={() => startEdit(charity)}>
                               <Edit2 size={14} className="mr-2" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="flex-1 text-accent-red/60 hover:text-accent-red hover:bg-white/50 h-9 font-bold" onClick={() => handleDelete(charity._id)}>
                               <Trash2 size={14} className="mr-2" /> Remove
                            </Button>
                          </CardFooter>
                      </>
                   )}
                </Card>
             </motion.div>
          ))}

        </div>

      </div>
    </div>
  );
}
