import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/lib/auth';
import { Layers, Sliders, FileSpreadsheet, ArrowRight, Zap } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-indigo-500/30">
      {/* Background glow meshes */}
      <div className="glow-primary -top-40 left-1/4" />
      <div className="glow-secondary top-1/3 -right-40" />

      {/* Header */}
      <Navbar user={user} />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-28 pb-16 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>AI-Powered Pre-sales Acceleration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Turn Rough Client Ideas Into{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Structured Project Scopes
            </span>{' '}
            In Seconds
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
            Stop wasting hours drafting proposals and manual spreadsheets. Allow business analyst AI to clarify features, estimate tasks, calculate milestones, and export stunning proposals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href="/generate"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Go to Proposal Generator</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-base shadow-xl shadow-indigo-600/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Start Estimating Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-bold text-base transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Interactive Demo Graphic */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto rounded-3xl glass-panel p-2 md:p-4 border border-white/10 shadow-2xl relative">
            <div className="absolute -top-3 left-4 flex gap-1.5 px-3 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase">
              Live Demo Preview
            </div>

            <div className="bg-slate-950/90 rounded-2xl border border-white/5 p-6 md:p-8 text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold">Scope: NexCart Marketplace</h3>
                  <p className="text-xs text-slate-400 mt-1">Estimates sum up automatically. Try toggling units below.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">View Unit:</span>
                  <div className="inline-flex bg-slate-900 border border-white/5 p-1 rounded-lg">
                    <span className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded-md cursor-default">Days (8h)</span>
                    <span className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-white cursor-pointer rounded-md">Hours</span>
                  </div>
                </div>
              </div>

              {/* Modules list */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-indigo-300">Module 1: Authentication & Profiles</span>
                    <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold">9 Days Total</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-200">• Basic Signup (Email/Password)</span>
                      <span className="text-indigo-400 font-bold">3 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-200">• Social Logins (Google OAuth)</span>
                      <span className="text-indigo-400 font-bold">2 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900 border border-white/5">
                      <span className="text-slate-200">• Profile Account Portal</span>
                      <span className="text-indigo-400 font-bold">4 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">How It Works</h2>
            <p className="text-sm md:text-base text-slate-400 mt-3">From chaotic client requirements to standard scopes in 4 simple moves.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Input Idea</h3>
              <p className="text-xs text-slate-400">Describe the project idea in natural language. Fill optional targets.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">AI Analyzes</h3>
              <p className="text-xs text-slate-400">Gemini 2.0 parses files, outputs JSON, and frames sub-feature outlines.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Refine Canvas</h3>
              <p className="text-xs text-slate-400">Edit features, switch days/hours, adjust values. Estimates compile automatically.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Clean Exports</h3>
              <p className="text-xs text-slate-400">Download formatted CSV lists for pricing matrices or styled PDFs for clients.</p>
            </div>
          </div>
        </section>

        {/* Features Matrix */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Engineered for Fast Discovery</h2>
            <p className="text-sm md:text-base text-slate-400 mt-3">Advanced features supporting professional presales engineers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Module Hierarchy</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Break projects into high-level modules and detailed sub-features. Keep specifications clean and organized.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Days / Hours Switch</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Toggle display units instantly in the UI. Calculations and totals adjust dynamically (1 Day = 8 Hours).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Exporting</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compile print-ready, branded PDF proposal packages or export direct CSV files to load into Google Sheets or Jira.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="glass-panel p-12 rounded-3xl border border-indigo-500/10 relative overflow-hidden">
            <div className="glow-primary -top-20 -left-20" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to Win More Deals?</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm md:text-base">
              Join elite design & software agencies leveraging automated discovery scopes. Generate your first proposal free today.
            </p>
            <div className="relative z-10 flex justify-center">
              {user ? (
                <Link
                  href="/generate"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-base shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Create Proposal Now
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-base shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center no-print">
        <span className="text-xs text-slate-500">
          © {new Date().getFullYear()} {APP_NAME}. Powered by Gemini 2.0 Flash. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
