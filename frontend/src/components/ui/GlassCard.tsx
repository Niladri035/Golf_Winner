import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'premium';
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'light', hoverEffect = false, ...props }, ref) => {
    
    const variants = {
      light: 'bg-white/10 border-white/20 text-deep-blue shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
      dark: 'bg-deep-blue/80 border-deep-blue/50 text-soft-bg shadow-[0_8px_32px_rgba(0,0,0,0.37)]',
      premium: 'bg-gradient-to-br from-primary-dark/90 to-accent-red/90 border-accent-red/50 text-white shadow-[0_8px_32px_rgba(193,18,31,0.3)]',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "backdrop-blur-xl rounded-2xl border",
          variants[variant],
          hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
