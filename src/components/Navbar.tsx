'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import { Sparkles, History, PlusCircle, LogOut } from 'lucide-react';

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    credits: number;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.refresh();
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 px-4 md:px-8 py-4 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              {/* Credits counter */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{user.credits} Credits</span>
              </div>

              {/* Navigation Links */}
              <Link
                href="/generate"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === '/generate' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Proposal</span>
              </Link>

              <Link
                href="/history"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  pathname === '/history' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Link>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 hidden lg:inline max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-slate-300 text-xs font-medium transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
