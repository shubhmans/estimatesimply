'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_PROJECT_TEMPLATES } from '@/lib/constants';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface GenerateClientProps {
  user: {
    id: string;
    email: string;
    credits: number;
  } | null;
}

const LOADING_STEPS = [
  'Deconstructing project description and parameters...',
  'Gemini is drafting hierarchical modules and sub-features...',
  'Calculating estimates, suggested stack, and timeline milestones...',
  'Finalizing scope layout and database storage...',
];

export default function GenerateClient({ user }: GenerateClientProps) {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [industry, setIndustry] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Animate the loading checklist during API request
  useEffect(() => {
    if (!loading) return;

    setCurrentStep(0);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [loading]);

  const handlePillClick = (template: typeof MOCK_PROJECT_TEMPLATES[0]) => {
    setInputText(template.idea);
    setIndustry(template.industry);
    setBudget(template.budget);
    setTimeline(template.timeline);
  };

  const handleClear = () => {
    setInputText('');
    setIndustry('');
    setBudget('');
    setTimeline('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputText, industry, budget, timeline }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Scope generation failed. Please try again.');
      }

      router.refresh();
      // Redirect to the newly created project page!
      router.push(`/projects/${data.projectId}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl text-center space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin absolute" />
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            AI Analysis In Progress
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing idea and building proposal scope. Please wait.
          </p>
        </div>

        {/* Loading Steps checklist */}
        <div className="space-y-3.5 text-left border-t border-white/5 pt-6 max-w-md mx-auto">
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs items-start transition-all duration-300 ${
                  isCompleted
                    ? 'text-indigo-400'
                    : isCurrent
                    ? 'text-white font-semibold'
                    : 'text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-500 shrink-0 animate-spin mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 mt-0.5" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-slate-500 bg-slate-900/50 p-3 rounded-lg border border-white/5">
          💡 Our advanced Business Analyst prompt takes roughly 10-15 seconds to generate the full hierarchical module list.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 shadow-2xl relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Generate Project Scope</h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in the details below to generate a comprehensive, structured proposal.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Available Credits</span>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-0.5">
            {user?.credits || 0} Credits
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Suggestion Pills */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-400 block mb-2.5">
          Select standard agency blueprint or try custom idea:
        </span>
        <div className="flex flex-wrap gap-2">
          {MOCK_PROJECT_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePillClick(template)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-xs font-medium text-slate-300 hover:text-white transition-all duration-200"
            >
              🚀 {template.title}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Description Textarea */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-300">Project Idea & Scope Description</label>
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors"
            >
              Clear Form
            </button>
          </div>
          <textarea
            required
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="E.g., Need a mobile fitness app for workouts where users can track hydration, earn points, and viewleaderboards. Needs integration with Stripe and an admin panel."
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-y"
          />
        </div>

        {/* Modular Grid Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Industry (Optional)</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Healthcare, FinTech"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Budget (Optional)</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., $10k - $25k"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Timeline Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Timeline Target (Optional)</label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g., 6-8 weeks"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Analyze & Compile Proposal Scope</span>
        </button>
      </form>
    </div>
  );
}
