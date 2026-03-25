'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { isMenuOpen, toggleMenu } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'The Draw', href: '/draw' },
    { label: 'Charities', href: '/charities' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-b border-deep-blue/10" />
        <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-heading font-extrabold text-2xl text-deep-blue">
            Altru<span className="text-accent-red">Green</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-accent-red",
                    pathname === link.href ? "text-accent-red" : "text-deep-blue/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-deep-blue/10 pl-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm font-medium text-deep-blue flex items-center gap-2 hover:text-accent-red transition-colors">
                    <UserIcon size={18} />
                    <span>{user?.name}</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-sm font-bold text-accent-red flex items-center gap-2 hover:text-primary-dark transition-colors border-l border-deep-blue/10 pl-4">
                      <span>Admin Console</span>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={logout} className="text-deep-blue/60 hover:text-accent-red">
                    <LogOut size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" className="text-deep-blue">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-primary-dark hover:bg-accent-red text-soft-bg border-none">
                      Join the Club
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden relative z-50 text-deep-blue" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-soft-bg/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className="font-heading text-3xl font-bold text-deep-blue hover:text-accent-red transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="w-24 h-px bg-deep-blue/20 my-4" />

            {isAuthenticated ? (
              <div className="flex flex-col items-center gap-6">
                <Link href="/dashboard" onClick={toggleMenu} className="font-heading text-xl font-semibold text-deep-blue">
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={toggleMenu} className="font-heading text-xl font-bold text-accent-red">
                    Admin Console
                  </Link>
                )}
                <button onClick={() => { logout(); toggleMenu(); }} className="text-accent-red font-medium">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Link href="/login" onClick={toggleMenu} className="font-heading text-xl font-semibold text-deep-blue">
                  Login
                </Link>
                <Link href="/register" onClick={toggleMenu}>
                  <Button size="lg" className="bg-primary-dark hover:bg-accent-red mt-4 px-8">
                    Join the Club
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
