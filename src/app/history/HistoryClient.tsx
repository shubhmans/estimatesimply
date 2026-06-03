'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Trash2, ArrowRight, Layers, Sparkles, Filter } from 'lucide-react';

interface ProjectRow {
  id: string;
  userId: string;
  title: string;
  inputText: string;
  industry: string | null;
  budget: string | null;
  timeline: string | null;
  estimateUnit: string;
  generatedScope: string;
  createdAt: Date;
}

interface HistoryClientProps {
  initialProjects: ProjectRow[];
}

export default function HistoryClient({ initialProjects }: HistoryClientProps) {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<ProjectRow[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [complexityFilter, setComplexityFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract totals and complexity safely
  const parseProjectMeta = (proj: ProjectRow) => {
    try {
      const scope = JSON.parse(proj.generatedScope) as {
        modules?: Array<{ submodules?: Array<{ estimate?: number }> }>;
        complexity?: string;
      };
      const totalDays = (scope.modules || []).reduce((acc, mod) => {
        const modDays = (mod.submodules || []).reduce(
          (sAcc, sub) => sAcc + (Number(sub.estimate) || 0),
          0
        );
        return acc + modDays;
      }, 0);

      const displayVal = proj.estimateUnit === 'hours' ? totalDays * 8 : totalDays;

      return {
        total: displayVal,
        unit: proj.estimateUnit,
        complexity: scope.complexity || 'Medium',
      };
    } catch {
      return { total: 0, unit: 'days', complexity: 'Medium' };
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal permanent from your history?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setProjectsList(prev => prev.filter(p => p.id !== id));
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to delete proposal.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter list
  const filteredProjects = projectsList.filter(proj => {
    const meta = parseProjectMeta(proj);
    const matchesSearch =
      proj.title.toLowerCase().includes(search.toLowerCase()) ||
      proj.inputText.toLowerCase().includes(search.toLowerCase());

    const matchesComplexity =
      complexityFilter === 'All' ||
      meta.complexity === complexityFilter;

    return matchesSearch && matchesComplexity;
  });

  return (
    <div className="space-y-6">
      {/* Search and filter controls bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 rounded-2xl theme-panel border border-theme-border no-print">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-theme-on-surface-variant">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name or description keywords..."
            className="w-full theme-input border-theme-border rounded-xl py-2 pl-10 pr-4 text-xs text-theme-on-surface placeholder-theme-on-surface-variant focus:outline-none focus:border-theme-border transition-colors"
          />
        </div>

        {/* Complexity filters */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0 select-none">
          <Filter className="w-3.5 h-3.5 text-theme-on-surface-variant" />
          <span className="text-xs text-theme-on-surface-variant">Complexity:</span>
          <div className="inline-flex theme-panel-lite border border-theme-border p-1 rounded-xl">
            {(['All', 'Low', 'Medium', 'High'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setComplexityFilter(filter)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${complexityFilter === filter
                    ? 'theme-btn-primary'
                    : 'text-theme-on-surface-variant hover:text-theme-on-surface'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid list of project proposals */}
      {filteredProjects.length === 0 ? (
        <div className="theme-panel p-12 rounded-3xl border border-theme-border text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl theme-step-icon-primary flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-lg font-bold text-theme-on-surface">No Proposals Found</h3>
            <p className="text-xs text-theme-on-surface-variant leading-relaxed">
              {projectsList.length === 0
                ? "You haven't generated any project proposals yet. Describe your first idea and let AI build it!"
                : 'No proposals match your active filters or search search terms.'}
            </p>
          </div>
          {projectsList.length === 0 && (
            <Link
              href="/generate"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl theme-btn-primary font-bold text-xs shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create First Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => {
            const meta = parseProjectMeta(proj);
            const dateStr = new Date(proj.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={proj.id}
                className="theme-card p-6 rounded-2xl border border-theme-border flex flex-col justify-between h-[280px]"
              >
                {/* Top info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-theme-on-surface-variant flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" />
                      <span>{dateStr}</span>
                    </span>

                    {/* Complexity Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide border ${meta.complexity === 'High'
                          ? 'bg-red-500/10 border-red-500/25 text-red-400'
                          : meta.complexity === 'Medium'
                            ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                            : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                        }`}
                    >
                      {meta.complexity}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-theme-on-surface text-base line-clamp-1 group-hover:text-primary">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-theme-on-surface-variant line-clamp-3">
                      &ldquo;{proj.inputText}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Bottom stats and link action */}
                <div className="border-t border-theme-border pt-4 flex justify-between items-center select-none">
                  <div>
                    <span className="text-[9px] font-bold text-theme-on-surface-variant uppercase tracking-wider block">Scope Sum</span>
                    <span className="text-sm font-bold text-primary">
                      {meta.total} <span className="text-[10px] text-theme-on-surface-variant uppercase">{meta.unit}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(proj.id)}
                      disabled={deletingId === proj.id}
                      className="p-2 rounded-lg bg-error/10 hover:bg-error/20 text-theme-on-surface-variant hover:text-error disabled:opacity-50 transition-colors"
                      title="Delete Proposal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/projects/${proj.id}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl theme-btn-primary text-xs font-bold transition-colors hover:bg-primary-container"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
