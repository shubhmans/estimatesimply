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
      <div className="w-full max-w-xl theme-card p-8 rounded-3xl border theme-border shadow-xl text-center space-y-8 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin absolute" />
            <Sparkles className="w-5 h-5 text-primary-container animate-pulse" />
          </div>
          <h3 className="text-xl font-bold theme-gradient-text">
            AI Analysis In Progress
          </h3>
          <p className="text-xs text-theme-on-surface-variant mt-1">
            Analyzing idea and building proposal scope. Please wait.
          </p>
        </div>

        {/* Loading Steps checklist */}
        <div className="space-y-3.5 text-left border-t theme-border-soft pt-6 max-w-md mx-auto">
          {LOADING_STEPS.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs items-start transition-all duration-300 ${isCompleted
                  ? 'text-primary'
                  : isCurrent
                    ? 'text-theme-on-surface font-semibold'
                    : 'text-theme-on-surface-variant'
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary shrink-0 animate-spin mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border theme-border shrink-0 mt-0.5" />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="text-[10px] text-theme-on-surface-variant theme-panel-lite p-3 rounded-lg border theme-border-soft">
          💡 Our advanced Business Analyst prompt takes roughly 10-15 seconds to generate the full hierarchical module list.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl theme-card p-6 sm:p-8 rounded-3xl border theme-border shadow-xl relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-theme-on-surface">Generate Project Scope</h2>
          <p className="text-xs text-theme-on-surface-variant mt-1">
            Fill in the details below to generate a comprehensive, structured proposal.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold tracking-wider text-theme-on-surface-variant">Available Credits</span>
          <span className="theme-tag text-secondary mt-0.5">
            {user?.credits || 0} Credits
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl theme-alert-error text-sm">
          {error}
        </div>
      )}

      {/* Suggestion Pills */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-theme-on-surface-variant block mb-2.5">
          Select standard agency blueprint or try custom idea:
        </span>
        <div className="flex flex-wrap gap-2">
          {MOCK_PROJECT_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePillClick(template)}
              className="px-3.5 py-1.5 rounded-xl theme-btn-secondary text-xs font-medium text-theme-on-surface-variant hover:text-theme-on-background transition-all duration-200"
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Description Textarea */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-theme-on-surface-variant">Project Idea & Scope Description</label>
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] font-bold text-theme-on-surface-variant hover:text-theme-on-background transition-colors"
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
            className="w-full theme-input rounded-xl p-3.5 text-sm text-theme-on-surface placeholder-theme-on-surface-variant transition-colors resize-y"
          />
        </div>

        {/* Modular Grid Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Industry */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-on-surface-variant">Target Industry (Optional)</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Healthcare, FinTech"
              className="w-full theme-input rounded-xl px-3 py-2 text-sm text-theme-on-surface placeholder-theme-on-surface-variant transition-colors"
            />
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-on-surface-variant">Target Budget (Optional)</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., $10k - $25k"
              className="w-full theme-input rounded-xl px-3 py-2 text-sm text-theme-on-surface placeholder-theme-on-surface-variant transition-colors"
            />
          </div>

          {/* Timeline Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-theme-on-surface-variant">Timeline Target (Optional)</label>
            <input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g., 6-8 weeks"
              className="w-full theme-input rounded-xl px-3 py-2 text-sm text-theme-on-surface placeholder-theme-on-surface-variant transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl theme-btn-primary text-white font-bold text-sm shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-on-primary" />
          <span>Analyze & Compile Proposal Scope</span>
        </button>
      </form>
    </div>
  );
}
