'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { charityApi } from '@/lib/api/modules/charity.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { Heart, Globe, Award, ExternalLink, CheckCircle2 } from 'lucide-react';
import { buttonVariants } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function CharitiesPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await charityApi.getAll();
        setCharities(res.data);
      } catch (err) {
        toast.error('Failed to load charities');
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleSelectCharity = async (charityId: string) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to select a charity');
      router.push('/login');
      return;
    }

    setSelectingId(charityId);
    try {
      await charityApi.selectForUser(charityId);
      updateUser({ ...user, selectedCharity: charityId } as any);
      toast.success('Charity preference updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update preference');
    } finally {
      setSelectingId(null);
    }
  };

  if (loading) return <FullPageLoader />;

  // @ts-ignore
  const currentUserCharityId = typeof user?.selectedCharity === 'string' ? user.selectedCharity : user?.selectedCharity?._id;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-soft-bg pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center justify-center p-3 bg-accent-blue/10 rounded-full mb-4">
            <Globe className="h-8 w-8 text-accent-blue" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-heading font-extrabold text-deep-blue tracking-tight">
            Our Vetted <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-primary-dark">Partners</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-deep-blue/70">
            A minimum of 10% of every subscription goes directly to the charity of your choice. You have the power to direct your impact.
          </motion.p>
        </div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {charities.map((charity, index) => {
            const isSelected = currentUserCharityId === charity._id;

            return (
              <motion.div
                key={charity._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full flex flex-col overflow-hidden transition-all duration-300 ${isSelected ? 'border-2 border-accent-blue shadow-lg shadow-accent-blue/20 bg-white' : 'border-none shadow-xl bg-white/60 hover:bg-white hover:-translate-y-1 backdrop-blur-md'}`}>
                  
                  {/* Image Header */}
                  <div className="relative h-48 bg-deep-blue/5 overflow-hidden flex items-center justify-center p-6">
                    {charity.images && charity.images.length > 0 ? (
                      <Image 
                        src={charity.images[0].url} 
                        alt={charity.name}
                        fill
                        className="object-cover opacity-80 mix-blend-multiply"
                      />
                    ) : (
                      <Heart className="h-16 w-16 text-deep-blue/20" />
                    )}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-accent-blue text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <CheckCircle2 size={14} /> Your Choice
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="font-heading text-xl text-deep-blue">{charity.name}</CardTitle>
                      {charity.isFeatured && (
                        <span className="shrink-0 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <p className="text-sm text-deep-blue/70 line-clamp-4 leading-relaxed">
                      {charity.description}
                    </p>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                       <span className="inline-flex items-center text-xs font-medium bg-deep-blue/5 text-deep-blue px-2.5 py-1 rounded-full">
                         {charity.category || 'Environment'}
                       </span>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-deep-blue/5 pt-4 flex gap-3">
                    <Button 
                      variant={isSelected ? "outline" : "default"}
                      className={`flex-1 ${isSelected ? 'border-accent-blue text-accent-blue hover:bg-accent-blue/5' : 'bg-primary-dark hover:bg-accent-red text-white shadow-md'}`}
                      onClick={() => handleSelectCharity(charity._id)}
                      disabled={selectingId === charity._id || isSelected}
                    >
                      {selectingId === charity._id ? 'Updating...' : isSelected ? 'Selected' : 'Support Them'}
                    </Button>
                    {charity.websiteUrl && (
                      <Link 
                        href={charity.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "shrink-0 border-deep-blue/20 text-deep-blue")}
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}
                  </CardFooter>

                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  );
}
