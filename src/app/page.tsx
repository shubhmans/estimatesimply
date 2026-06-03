import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/lib/auth';
import { Layers, Sliders, FileSpreadsheet, ArrowRight, Zap } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="relative min-h-screen theme-bg flex flex-col text-theme-on-background selection:bg-primary/20">
      {/* Background glow meshes */}
      <div className="glow-primary -top-40 left-1/4" />
      <div className="glow-secondary top-1/3 -right-40" />

      {/* Header */}
      <Navbar user={user} />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-28 pb-16 text-center">


          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.05] mb-6">
            Turn Rough Client Ideas Into{' '}
            <span className="theme-gradient-text">Structured Project Scopes</span>{' '}
            In Seconds
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-theme-on-surface-variant max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
            Stop wasting hours drafting proposals and manual spreadsheets. Allow business analyst AI to clarify features, estimate tasks, calculate milestones, and export stunning proposals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href="/generate"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl theme-btn-primary font-bold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Go to Proposal Generator</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl theme-btn-primary font-bold text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Start Estimating Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl theme-btn-secondary text-base font-bold transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* Interactive Demo Graphic */}
          <div className="mt-16 md:mt-24 max-w-5xl mx-auto rounded-[1.5rem] theme-panel p-2 md:p-4 overflow-hidden relative">
            <div className="absolute -top-4 left-6">
              <span className="theme-badge-primary text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-md">
                Live Demo Preview
              </span>
            </div>

            <div className="theme-card rounded-[1.25rem] p-6 md:p-8 text-left relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b theme-border-soft pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold">Scope: NexCart Marketplace</h3>
                  <p className="text-xs text-theme-on-surface-variant mt-1">Estimates sum up automatically. Try toggling units below.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-theme-on-surface-variant">View Unit:</span>
                  <div className="inline-flex p-1 rounded-lg theme-panel-lite">
                    <button className="theme-btn-primary px-3 py-1 text-xs font-bold rounded-md">Days (8h)</button>
                    <button className="theme-btn-ghost px-3 py-1 text-xs font-bold rounded-md">Hours</button>
                  </div>
                </div>
              </div>

              {/* Modules list */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl theme-panel border border-theme-border">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-secondary">Module 1: Authentication & Profiles</span>
                    <span className="theme-tag">9 Days Total</span>
                  </div>
                  <div className="space-y-2 text-xs text-theme-on-surface-variant">
                    <div className="flex justify-between items-center p-2 rounded-lg theme-card border theme-border">
                      <span>Basic Signup (Email/Password)</span>
                      <span className="font-bold text-primary">3 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg theme-card border theme-border">
                      <span>Social Logins (Google OAuth)</span>
                      <span className="font-bold text-primary">2 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg theme-card border theme-border">
                      <span>Profile Account Portal</span>
                      <span className="font-bold text-primary">4 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 border-t theme-border-soft">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">How It Works</h2>
            <p className="text-sm md:text-base text-theme-on-surface-variant mt-3">From chaotic client requirements to standard scopes in 4 simple moves.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="theme-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl theme-step-icon-primary border theme-border flex items-center justify-center font-bold text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Input Idea</h3>
              <p className="text-xs text-theme-on-surface-variant">Describe the project idea in natural language. Fill optional targets.</p>
            </div>

            <div className="theme-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl theme-step-icon-secondary border theme-border flex items-center justify-center font-bold text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">AI Analyzes</h3>
              <p className="text-xs text-theme-on-surface-variant">Gemini 2.0 parses files, outputs JSON, and frames sub-feature outlines.</p>
            </div>

            <div className="theme-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl theme-step-icon-tertiary border theme-border flex items-center justify-center font-bold text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Refine Canvas</h3>
              <p className="text-xs text-theme-on-surface-variant">Edit features, switch days/hours, adjust values. Estimates compile automatically.</p>
            </div>

            <div className="theme-card p-6 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl theme-feature-icon-primary border theme-border flex items-center justify-center font-bold text-lg mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-lg mb-2">Clean Exports</h3>
              <p className="text-xs text-theme-on-surface-variant">Download formatted CSV lists for pricing matrices or styled PDFs for clients.</p>
            </div>
          </div>
        </section>

        {/* Features Matrix */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20 border-t theme-border-soft">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold">Engineered for Fast Discovery</h2>
            <p className="text-sm md:text-base text-theme-on-surface-variant mt-3">Advanced features supporting professional presales engineers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="theme-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl theme-feature-icon-primary border theme-border flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Module Hierarchy</h3>
              <p className="text-sm text-theme-on-surface-variant leading-relaxed">
                Break projects into high-level modules and detailed sub-features. Keep specifications clean and organized.
              </p>
            </div>

            <div className="theme-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl theme-feature-icon-secondary border theme-border flex items-center justify-center mb-6">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Days / Hours Switch</h3>
              <p className="text-sm text-theme-on-surface-variant leading-relaxed">
                Toggle display units instantly in the UI. Calculations and totals adjust dynamically (1 Day = 8 Hours).
              </p>
            </div>

            <div className="theme-card p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl theme-feature-icon-tertiary border theme-border flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Professional Exporting</h3>
              <p className="text-sm text-theme-on-surface-variant leading-relaxed">
                Compile print-ready, branded PDF proposal packages or export direct CSV files to load into Google Sheets or Jira.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="theme-panel-strong p-12 rounded-[1.5rem] relative overflow-hidden">
            <div className="glow-primary -top-20 -left-20" />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to Win More Deals?</h2>
            <p className="text-theme-on-surface-variant max-w-xl mx-auto mb-8 text-sm md:text-base">
              Join elite design & software agencies leveraging automated discovery scopes. Generate your first proposal free today.
            </p>
            <div className="relative z-10 flex justify-center">
              {user ? (
                <Link
                  href="/generate"
                  className="px-8 py-4 rounded-xl theme-btn-primary font-bold text-base shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Create Proposal Now
                </Link>
              ) : (
                <Link
                  href="/auth"
                  className="px-8 py-4 rounded-xl theme-btn-primary font-bold text-base shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t theme-border text-center no-print">
        <span className="text-xs text-theme-on-surface-variant">
          © {new Date().getFullYear()} {APP_NAME}. Powered by Gemini 2.0 Flash. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
