'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/generate';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const safeEndpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(safeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      router.refresh();
      router.push(redirect);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative">
      {/* Tab Selector */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/5 mb-6">
        <button
          onClick={() => {
            setIsLogin(true);
            setError(null);
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setIsLogin(false);
            setError(null);
          }}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@agency.com"
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          {!isLogin && (
            <p className="text-[10px] text-slate-400 mt-1">
              Must be at least 6 characters.
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/20 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isLogin ? 'Signing In...' : 'Registering...'}</span>
            </>
          ) : (
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
          )}
        </button>
      </form>

      {/* Credits notice */}
      <div className="mt-6 text-center">
        <span className="text-[11px] text-slate-500">
          {isLogin
            ? 'Welcome back to your agency presales assistant.'
            : `New accounts are pre-loaded with 10 free generation credits.`}
        </span>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="glow-primary top-1/4 -left-1/4" />
      <div className="glow-secondary bottom-1/4 -right-1/4" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {APP_NAME}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Automate discovery. Refine scope. Impress clients.
          </p>
        </div>

        {/* Suspense Auth Form */}
        <Suspense fallback={
          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center min-h-[350px]">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
            <span className="text-xs text-slate-500">Loading secure portal...</span>
          </div>
        }>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
