import React from 'react';
import { cn } from '../../lib/utils';

export const LoadingSpinner = ({ className, size = 'default' }: { className?: string, size?: 'sm' | 'default' | 'lg' | 'xl' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div 
        className={cn(
          "rounded-full border-accent-red border-t-transparent animate-spin",
          sizes[size]
        )} 
      />
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-soft-bg/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
    <LoadingSpinner size="xl" />
    <p className="mt-4 font-heading font-medium text-deep-blue animate-pulse">Loading AltruGreen...</p>
  </div>
);
