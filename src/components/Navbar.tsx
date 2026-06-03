'use client';

import Image from 'next/image';
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
    <nav className="sticky top-0 z-50 w-full theme-panel border-b theme-border px-4 md:px-8 py-4 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl theme-brand-logo flex items-center justify-center shadow-lg shadow-slate-400/10 group-hover:scale-105 transition-transform duration-200 overflow-hidden">
            <Image src="/estimatesimply-logo.svg" alt={APP_NAME} width={28} height={28} />
          </div>
          <span className="text-xl font-bold tracking-tight theme-gradient-text">
            {APP_NAME}
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-4 md:gap-6">
          {user ? (
            <>
              {/* Credits counter */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full theme-panel-lite text-xs font-semibold">
                <span className="text-theme-on-surface">{user.credits} Credits</span>
              </div>

              {/* Navigation Links */}
              <Link
                href="/generate"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${pathname === '/generate' ? 'theme-link-active' : 'theme-link'
                  }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Proposal</span>
              </Link>

              <Link
                href="/history"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${pathname === '/history' ? 'theme-link-active' : 'theme-link'
                  }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Link>

              <div className="h-4 w-px bg-outline hidden sm:block" />

              <div className="flex items-center gap-3">
                <span className="text-xs text-theme-on-surface-variant hidden lg:inline max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg theme-btn-secondary text-xs font-medium transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 rounded-xl theme-btn-primary text-sm font-semibold shadow-lg shadow-slate-400/10 transition-all duration-200"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
