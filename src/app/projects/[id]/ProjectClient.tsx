'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScopeOutput, Module, Submodule } from '@/lib/gemini';
import { HOURS_PER_DAY } from '@/lib/constants';
import {
  Save, Download, Printer, Plus, Trash2,
  ChevronDown, ChevronUp, Layers, Cpu, ShieldAlert,
  HelpCircle, Check, ArrowLeft, Loader2
} from 'lucide-react';
import Link from 'next/link';

interface ProjectClientProps {
  project: {
    id: string;
    title: string;
    inputText: string;
    industry: string | null;
    budget: string | null;
    timeline: string | null;
    estimateUnit: string;
    generatedScope: string;
    createdAt: Date;
  };
}

export default function ProjectClient({ project }: ProjectClientProps) {
  const router = useRouter();

  // Load scope data from JSON
  const [scope, setScope] = useState<ScopeOutput>(() => {
    try {
      return JSON.parse(project.generatedScope);
    } catch (e) {
      console.error('Failed to parse scope JSON:', e);
      return {} as ScopeOutput;
    }
  });

  const [title, setTitle] = useState(project.title);
  const [estimateUnit, setEstimateUnit] = useState<'days' | 'hours'>(
    (project.estimateUnit as 'days' | 'hours') || 'days'
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'scope' | 'milestones' | 'risks'>('scope');

  // Expanded modules tracker
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [scope.modules?.[0]?.id || '']: true
  });

  // Action states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggle unit utility
  const toggleUnit = (unit: 'days' | 'hours') => {
    setEstimateUnit(unit);
  };

  // Convert raw value (stored as base Days in JSON) to display value
  const toDisplayVal = (daysVal: number) => {
    if (estimateUnit === 'hours') {
      return daysVal * HOURS_PER_DAY;
    }
    return daysVal;
  };

  // Convert input value back to raw base Days
  const toBaseVal = (displayVal: number) => {
    if (estimateUnit === 'hours') {
      return displayVal / HOURS_PER_DAY;
    }
    return displayVal;
  };

  // Toggle accordion expand
  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Calculate sum of estimates in a module
  const calculateModuleSum = (mod: Module) => {
    const sumDays = (mod.submodules || []).reduce((acc, sub) => acc + (Number(sub.estimate) || 0), 0);
    return toDisplayVal(sumDays);
  };

  // Calculate project total
  const calculateProjectTotal = () => {
    const totalDays = (scope.modules || []).reduce((acc, mod) => {
      const modDays = (mod.submodules || []).reduce((sAcc, sub) => sAcc + (Number(sub.estimate) || 0), 0);
      return acc + modDays;
    }, 0);
    return toDisplayVal(totalDays);
  };

  // ==================== EDIT ACTIONS ====================

  // Save changes to the backend database
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          estimateUnit,
          generatedScope: JSON.stringify(scope),
        }),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to save project changes.');
    } finally {
      setSaving(false);
    }
  };

  // Update a sub-module estimate
  const handleSubmoduleEstimateChange = (moduleId: string, subId: string, value: string) => {
    const parsedVal = parseFloat(value) || 0;
    const baseDays = toBaseVal(parsedVal);

    setScope(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          submodules: m.submodules.map(s => {
            if (s.id !== subId) return s;
            return { ...s, estimate: baseDays };
          })
        };
      })
    }));
  };

  // Update a sub-module field (name, description, difficulty)
  const handleSubmoduleFieldChange = (
    moduleId: string,
    subId: string,
    field: keyof Submodule,
    value: string
  ) => {
    setScope(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          submodules: m.submodules.map(s => {
            if (s.id !== subId) return s;
            return { ...s, [field]: value };
          })
        };
      })
    }));
  };

  // Add a sub-module
  const handleAddSubmodule = (moduleId: string) => {
    const newSub: Submodule = {
      id: crypto.randomUUID(),
      name: 'New Sub-feature',
      description: 'Detail the requirements for this sub-feature.',
      estimate: 2, // default 2 days
      difficulty: 'Easy'
    };

    setScope(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          submodules: [...m.submodules, newSub]
        };
      })
    }));

    // Ensure module is expanded
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
  };

  // Delete a sub-module
  const handleDeleteSubmodule = (moduleId: string, subId: string) => {
    setScope(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          submodules: m.submodules.filter(s => s.id !== subId)
        };
      })
    }));
  };

  // Update main module name
  const handleModuleNameChange = (moduleId: string, name: string) => {
    setScope(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id !== moduleId) return m;
        return { ...m, name };
      })
    }));
  };

  // Add new main module
  const handleAddModule = () => {
    const newId = crypto.randomUUID();
    const newMod: Module = {
      id: newId,
      name: 'New Scope Module',
      submodules: [
        {
          id: crypto.randomUUID(),
          name: 'Core Feature A',
          description: 'Scope description for Feature A.',
          estimate: 3,
          difficulty: 'Easy'
        }
      ]
    };

    setScope(prev => ({
      ...prev,
      modules: [...prev.modules, newMod]
    }));

    setExpandedModules(prev => ({ ...prev, [newId]: true }));
  };

  // Delete entire main module
  const handleDeleteModule = (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this entire module and all its sub-features?')) return;

    setScope(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== moduleId)
    }));
  };

  // Update overview fields
  const handleOverviewChange = (field: keyof ScopeOutput, value: string) => {
    setScope(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add items in stack
  const handleStackChange = (layer: 'frontend' | 'backend' | 'database' | 'infrastructure', index: number, value: string) => {
    setScope(prev => {
      const updatedList = [...(prev.suggestedStack[layer] || [])];
      updatedList[index] = value;
      return {
        ...prev,
        suggestedStack: {
          ...prev.suggestedStack,
          [layer]: updatedList
        }
      };
    });
  };

  const handleAddStackItem = (layer: 'frontend' | 'backend' | 'database' | 'infrastructure') => {
    setScope(prev => ({
      ...prev,
      suggestedStack: {
        ...prev.suggestedStack,
        [layer]: [...(prev.suggestedStack[layer] || []), 'New Tech']
      }
    }));
  };

  const handleDeleteStackItem = (layer: 'frontend' | 'backend' | 'database' | 'infrastructure', index: number) => {
    setScope(prev => ({
      ...prev,
      suggestedStack: {
        ...prev.suggestedStack,
        [layer]: (prev.suggestedStack[layer] || []).filter((_, idx) => idx !== index)
      }
    }));
  };

  // Update milestones
  const handleMilestoneChange = (index: number, field: string, value: string | string[]) => {
    setScope(prev => {
      const updated = [...(prev.milestones || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, milestones: updated };
    });
  };

  const handleAddMilestone = () => {
    setScope(prev => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        { phase: 'New Phase', duration: '2 weeks', deliverables: ['Key deliverable A'] }
      ]
    }));
  };

  const handleDeleteMilestone = (index: number) => {
    setScope(prev => ({
      ...prev,
      milestones: (prev.milestones || []).filter((_, idx) => idx !== index)
    }));
  };

  // Update risks
  const handleRiskChange = (index: number, field: 'risk' | 'mitigation', value: string) => {
    setScope(prev => {
      const updated = [...(prev.risks || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, risks: updated };
    });
  };

  const handleAddRisk = () => {
    setScope(prev => ({
      ...prev,
      risks: [...(prev.risks || []), { risk: 'New potential risk', mitigation: 'Proactive mitigation plan.' }]
    }));
  };

  const handleDeleteRisk = (index: number) => {
    setScope(prev => ({
      ...prev,
      risks: (prev.risks || []).filter((_, idx) => idx !== index)
    }));
  };

  // Update assumptions
  const handleAssumptionChange = (index: number, value: string) => {
    setScope(prev => {
      const updated = [...(prev.assumptions || [])];
      updated[index] = value;
      return { ...prev, assumptions: updated };
    });
  };

  const handleAddAssumption = () => {
    setScope(prev => ({
      ...prev,
      assumptions: [...(prev.assumptions || []), 'New client assumption.']
    }));
  };

  const handleDeleteAssumption = (index: number) => {
    setScope(prev => ({
      ...prev,
      assumptions: (prev.assumptions || []).filter((_, idx) => idx !== index)
    }));
  };

  // ==================== EXPORTS ====================

  // Export dynamically to CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Proposal Scope Summary\n';
    csvContent += `Title,${title}\n`;
    csvContent += `Created,${new Date(project.createdAt).toLocaleDateString()}\n`;
    csvContent += `Complexity,${scope.complexity || 'Medium'}\n`;
    csvContent += `Estimate Unit,${estimateUnit}\n\n`;

    csvContent += 'MODULE,SUBMODULE,DESCRIPTION,ESTIMATE (${estimateUnit}),DIFFICULTY\n';

    (scope.modules || []).forEach(m => {
      const modName = `"${m.name.replace(/"/g, '""')}"`;
      (m.submodules || []).forEach(s => {
        const subName = `"${s.name.replace(/"/g, '""')}"`;
        const desc = `"${s.description.replace(/"/g, '""')}"`;
        const est = toDisplayVal(s.estimate);
        csvContent += `${modName},${subName},${desc},${est},${s.difficulty}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_scope_estimate.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print-container">
      {/* Back button and sticky status toolbar (no-print) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center no-print border-b border-theme-border pb-4">
        <Link
          href="/history"
          className="flex items-center gap-1.5 text-xs font-semibold text-theme-on-surface-variant hover:text-theme-on-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proposal History</span>
        </Link>

        {/* Dynamic Saving Indicator */}
        <div className="flex flex-wrap items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>Project Saved!</span>
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="theme-btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl disabled:opacity-50 text-xs font-bold transition-all duration-200"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Changes</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="theme-btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="theme-btn-primary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Header Info Block */}
      <div className="theme-panel p-6 rounded-3xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative">
        <div className="space-y-1.5 flex-1 w-full">
          <span className="theme-tag text-[10px] tracking-wider uppercase font-bold">
            Proposal Scope Document
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full theme-input text-2xl sm:text-3xl font-extrabold text-theme-on-surface focus:outline-none py-1 transition-colors"
          />
          <p className="text-xs text-theme-on-surface-variant">
            Analysed from idea: &ldquo;{project.inputText}&rdquo;
          </p>
        </div>

        {/* Global Days/Hours Estimate Controller */}
        <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0 no-print">
          <span className="text-[10px] font-bold uppercase tracking-wider text-theme-on-surface-variant">
            Total Estimated Scope
          </span>
          <div className="flex items-center gap-4">
            <span className="text-2xl sm:text-3xl font-black theme-gradient-text">
              {calculateProjectTotal()}{' '}
              <span className="text-lg font-bold text-theme-on-surface uppercase">
                {estimateUnit}
              </span>
            </span>
            <div className="inline-flex theme-panel-lite p-1 rounded-xl">
              <button
                type="button"
                onClick={() => toggleUnit('days')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${estimateUnit === 'days'
                    ? 'theme-btn-primary shadow-lg text-on-primary'
                    : 'text-theme-on-surface-variant hover:text-theme-on-background'
                  }`}
              >
                Days
              </button>
              <button
                type="button"
                onClick={() => toggleUnit('hours')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${estimateUnit === 'hours'
                    ? 'theme-btn-primary shadow-lg text-on-primary'
                    : 'text-theme-on-surface-variant hover:text-theme-on-background'
                  }`}
              >
                Hours
              </button>
            </div>
          </div>
        </div>

        {/* Print-only Total badge */}
        <div className="hidden print:block text-right">
          <div className="text-xs font-bold text-theme-on-surface-variant">TOTAL ESTIMATED TIMELINE</div>
          <div className="text-2xl font-black text-theme-on-background">
            {calculateProjectTotal()} {estimateUnit.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Navigation tabs (no-print) */}
      <div className="flex border-b border-theme-border no-print gap-1 select-none">
        {(['scope', 'overview', 'milestones', 'risks'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 capitalize transition-all duration-200 ${activeTab === tab
                ? 'border-theme-border text-primary font-bold bg-surface-container-lowest'
                : 'border-transparent text-theme-on-surface-variant hover:text-theme-on-background'
              }`}
          >
            {tab === 'scope' ? 'Detailed Scope Matrix' : tab}
          </button>
        ))}
      </div>

      {/* Active Tab View */}
      <div className="space-y-6">

        {/* ==================== 1. DETAILED SCOPE TAB ==================== */}
        {activeTab === 'scope' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center no-print">
              <div>
                <h3 className="text-lg font-bold text-theme-on-surface">Hierarchical Features Registry</h3>
                <p className="text-xs text-theme-on-surface-variant">
                  Main modules sum child values automatically. Double-click or select boxes to update values.
                </p>
              </div>
              <button
                onClick={handleAddModule}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl theme-btn-secondary border-dashed border-theme-border text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>

            {/* Print title marker */}
            <h2 className="hidden print:block text-xl font-bold border-b pb-2 mb-4">Detailed Features Scope Registry</h2>

            {/* Accordion container */}
            <div className="space-y-4">
              {(scope.modules || []).map(mod => {
                const isExpanded = expandedModules[mod.id] ?? false;
                const totalModEstimates = calculateModuleSum(mod);
                return (
                  <div
                    key={mod.id}
                    className="rounded-2xl border border-theme-border overflow-hidden transition-all theme-panel-lite"
                  >
                    {/* Module Accordion Header */}
                    <div
                      className="w-full flex items-center justify-between p-4 border-b border-theme-border select-none relative bg-surface-container-lowest"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Layers className="w-4 h-4 text-primary shrink-0" />
                        <input
                          type="text"
                          value={mod.name}
                          onChange={(e) => handleModuleNameChange(mod.id, e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-sm md:text-base font-bold text-theme-on-surface focus:outline-none py-0.5 w-full mr-4 transition-colors"
                        />
                      </div>

                      {/* Badge / Sum */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="theme-tag text-xs font-bold px-2.5 py-1 rounded-md">
                          {totalModEstimates} {estimateUnit}
                        </span>

                        <div className="flex items-center gap-1.5 no-print">
                          <button
                            onClick={() => toggleModule(mod.id)}
                            className="p-1 rounded-lg hover:bg-white/5 text-theme-on-surface-variant hover:text-theme-on-surface"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteModule(mod.id)}
                            className="theme-btn-danger p-1 rounded-lg transition-colors"
                            title="Delete Module"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Module Child submodules list */}
                    {isExpanded && (
                      <div className="p-4 space-y-4 theme-panel-lite">
                        {mod.submodules.length === 0 ? (
                          <div className="text-center py-6 text-xs text-theme-on-surface-variant">
                            No child sub-features in this module. Add one below!
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {mod.submodules.map(sub => (
                              <div
                                key={sub.id}
                                className="theme-card p-4 rounded-xl border border-theme-border relative group/card flex flex-col md:flex-row justify-between gap-4"
                              >
                                {/* Left Side: Details inputs */}
                                <div className="space-y-2 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <input
                                      type="text"
                                      value={sub.name}
                                      onChange={(e) => handleSubmoduleFieldChange(mod.id, sub.id, 'name', e.target.value)}
                                      className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-sm font-bold text-theme-on-surface focus:outline-none w-full max-w-sm transition-colors"
                                      placeholder="Sub-feature title"
                                    />

                                    {/* Difficulty Badge */}
                                    <select
                                      value={sub.difficulty}
                                      onChange={(e) => handleSubmoduleFieldChange(mod.id, sub.id, 'difficulty', e.target.value)}
                                      className="theme-input text-theme-on-surface rounded-md text-[10px] font-bold px-2 py-0.5 focus:outline-none focus:border-theme-border print:border-none"
                                    >
                                      <option value="Easy">Easy</option>
                                      <option value="Medium">Medium</option>
                                      <option value="Hard">Hard</option>
                                    </select>
                                  </div>

                                  <textarea
                                    rows={2}
                                    value={sub.description}
                                    onChange={(e) => handleSubmoduleFieldChange(mod.id, sub.id, 'description', e.target.value)}
                                    className="w-full bg-transparent text-xs text-theme-on-surface-variant placeholder-theme-on-surface-variant focus:outline-none hover:border-b hover:border-theme-border focus:border-b focus:border-theme-border py-1 transition-colors resize-none"
                                    placeholder="Feature description scope..."
                                  />
                                </div>

                                {/* Right Side: Numerical estimate input */}
                                <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 select-none">
                                  <div className="space-y-1 text-left md:text-right">
                                    <label className="text-[10px] font-bold text-theme-on-surface-variant uppercase tracking-wider block">
                                      Estimate ({estimateUnit})
                                    </label>
                                    <input
                                      type="number"
                                      step={estimateUnit === 'hours' ? 8 : 1}
                                      min={0}
                                      value={toDisplayVal(sub.estimate)}
                                      onChange={(e) => handleSubmoduleEstimateChange(mod.id, sub.id, e.target.value)}
                                      className="theme-input rounded-lg px-2.5 py-1 text-sm font-bold text-theme-on-surface text-center w-20 focus:outline-none focus:border-theme-border focus:ring-1 focus:ring-indigo-200 print:bg-transparent print:border-none"
                                    />
                                  </div>

                                  {/* Delete feature button */}
                                  <button
                                    onClick={() => handleDeleteSubmodule(mod.id, sub.id)}
                                    className="theme-btn-danger p-2 rounded-lg no-print"
                                    title="Delete Sub-feature"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add sub-feature trigger (no-print) */}
                        <div className="pt-2 no-print">
                          <button
                            onClick={() => handleAddSubmodule(mod.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-theme-border hover:border-theme-border text-[10px] font-bold text-theme-on-surface-variant hover:text-primary transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Sub-feature</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== 2. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Summary details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-4">
                <h3 className="text-base font-bold text-theme-on-surface border-b border-theme-border pb-2">Executive Summary</h3>
                <textarea
                  rows={4}
                  value={scope.summary}
                  onChange={(e) => handleOverviewChange('summary', e.target.value)}
                  className="w-full theme-panel-lite border border-theme-border rounded-xl p-3.5 text-sm text-theme-on-surface placeholder-theme-on-surface-variant focus:outline-none focus:border-theme-border focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              {/* Technical Stack Grid */}
              <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-4">
                <h3 className="text-base font-bold text-theme-on-surface border-b border-theme-border pb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>Suggested Technical Stack</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['frontend', 'backend', 'database', 'infrastructure'] as const).map(layer => (
                    <div key={layer} className="p-4 theme-panel-lite rounded-xl border border-theme-border space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-primary capitalize">{layer}</span>
                        <button
                          onClick={() => handleAddStackItem(layer)}
                          className="text-[10px] text-primary hover:text-theme-on-surface font-bold no-print"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="space-y-1">
                        {(scope.suggestedStack?.[layer] || []).map((tech, idx) => (
                          <div key={idx} className="flex items-center gap-2 justify-between">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => handleStackChange(layer, idx, e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-xs font-semibold text-theme-on-surface focus:outline-none py-0.5 w-full transition-colors"
                            />
                            <button
                              onClick={() => handleDeleteStackItem(layer, idx)}
                              className="text-theme-on-surface-variant hover:text-theme-on-background text-[10px] font-semibold no-print"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar info */}
            <div className="space-y-6">
              {/* Complexity */}
              <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-4">
                <h3 className="text-base font-bold text-theme-on-surface border-b border-theme-border pb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  <span>Complexity Analysis</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-theme-on-surface-variant uppercase block mb-1">
                      Project Complexity
                    </label>
                    <select
                      value={scope.complexity}
                      onChange={(e) => handleOverviewChange('complexity', e.target.value)}
                      className="theme-input rounded-xl px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:border-theme-border w-full"
                    >
                      <option value="Low">Low Complexity</option>
                      <option value="Medium">Medium Complexity</option>
                      <option value="High">High Complexity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-theme-on-surface-variant uppercase block mb-1">
                      Reasoning
                    </label>
                    <textarea
                      rows={3}
                      value={scope.complexityReasoning}
                      onChange={(e) => handleOverviewChange('complexityReasoning', e.target.value)}
                      className="w-full theme-panel-lite border border-theme-border rounded-xl p-2.5 text-xs text-theme-on-surface-variant placeholder-theme-on-surface-variant focus:outline-none focus:border-theme-border focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Targets info */}
              <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-3.5 text-xs">
                <h3 className="font-bold text-theme-on-surface border-b border-theme-border pb-2">Client Parameters</h3>
                <div>
                  <span className="text-theme-on-surface-variant block font-semibold">Target Industry:</span>
                  <span className="text-primary font-bold text-sm block mt-0.5">{project.industry || 'TBD'}</span>
                </div>
                <div>
                  <span className="text-theme-on-surface-variant block font-semibold">Target Budget:</span>
                  <span className="text-primary font-bold text-sm block mt-0.5">{project.budget || 'TBD'}</span>
                </div>
                <div>
                  <span className="text-theme-on-surface-variant block font-semibold">Target Timeline:</span>
                  <span className="text-primary font-bold text-sm block mt-0.5">{project.timeline || 'TBD'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. MILESTONES TAB ==================== */}
        {activeTab === 'milestones' && (
          <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-6">
            <div className="flex justify-between items-center border-b border-theme-border pb-2">
              <h3 className="text-base font-bold text-theme-on-surface">Suggested Delivery Milestones</h3>
              <button
                onClick={handleAddMilestone}
                className="text-xs text-primary hover:text-theme-on-surface font-bold no-print"
              >
                + Add Phase
              </button>
            </div>

            <div className="space-y-4">
              {(scope.milestones || []).map((mile, idx) => (
                <div key={idx} className="p-4 theme-panel-lite rounded-xl border border-theme-border relative group/milestone space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <input
                      type="text"
                      value={mile.phase}
                      onChange={(e) => handleMilestoneChange(idx, 'phase', e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-sm font-bold text-theme-on-surface focus:outline-none py-0.5 w-full max-w-md transition-colors"
                      placeholder="Phase title..."
                    />

                    <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0">
                      <input
                        type="text"
                        value={mile.duration}
                        onChange={(e) => handleMilestoneChange(idx, 'duration', e.target.value)}
                        className="theme-input rounded-lg px-2 py-1 text-xs text-center text-theme-on-surface w-24 focus:outline-none focus:border-theme-border"
                        placeholder="2 weeks"
                      />

                      <button
                        onClick={() => handleDeleteMilestone(idx)}
                        className="theme-btn-danger p-1 rounded-lg no-print"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Deliverables lists */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-bold text-theme-on-surface-variant uppercase tracking-wider block">Deliverables:</span>
                    {(mile.deliverables || []).map((del, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <span className="text-primary font-bold shrink-0">•</span>
                        <input
                          type="text"
                          value={del}
                          onChange={(e) => {
                            const updatedDelList = [...mile.deliverables];
                            updatedDelList[dIdx] = e.target.value;
                            handleMilestoneChange(idx, 'deliverables', updatedDelList);
                          }}
                          className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-xs text-theme-on-surface focus:outline-none w-full"
                        />
                        <button
                          onClick={() => {
                            const updatedDelList = mile.deliverables.filter((_, subIdx) => subIdx !== dIdx);
                            handleMilestoneChange(idx, 'deliverables', updatedDelList);
                          }}
                          className="text-theme-on-surface-variant hover:text-theme-on-background text-[10px] no-print"
                        >
                          x
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const updatedDelList = [...(mile.deliverables || []), 'New key deliverable'];
                        handleMilestoneChange(idx, 'deliverables', updatedDelList);
                      }}
                      className="text-[10px] text-primary hover:text-primary font-bold mt-1.5 block no-print"
                    >
                      + Add Deliverable
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 4. RISKS & ASSUMPTIONS TAB ==================== */}
        {activeTab === 'risks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Risks Columns */}
            <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-4">
              <div className="flex justify-between items-center border-b border-theme-border pb-2">
                <h3 className="text-base font-bold text-theme-on-surface flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  <span>Potential Risks & Mitigations</span>
                </h3>
                <button
                  onClick={handleAddRisk}
                  className="text-xs text-primary hover:text-theme-on-surface font-bold no-print"
                >
                  + Add Risk
                </button>
              </div>

              <div className="space-y-4">
                {(scope.risks || []).map((risk, idx) => (
                  <div key={idx} className="p-3 theme-panel-lite rounded-xl border border-theme-border space-y-2">
                    <div className="flex justify-between items-start">
                      <input
                        type="text"
                        value={risk.risk}
                        onChange={(e) => handleRiskChange(idx, 'risk', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-xs font-bold text-theme-on-surface focus:outline-none w-full mr-4"
                        placeholder="Risk description..."
                      />
                      <button
                        onClick={() => handleDeleteRisk(idx)}
                        className="text-theme-on-surface-variant hover:text-theme-on-background no-print"
                      >
                        x
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={risk.mitigation}
                      onChange={(e) => handleRiskChange(idx, 'mitigation', e.target.value)}
                      className="w-full bg-transparent text-[11px] text-theme-on-surface-variant placeholder-theme-on-surface-variant focus:outline-none hover:border-b hover:border-theme-border focus:border-b focus:border-theme-border py-0.5 resize-none"
                      placeholder="Mitigation details..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Assumptions Columns */}
            <div className="theme-panel p-6 rounded-3xl border border-theme-border space-y-4">
              <div className="flex justify-between items-center border-b border-theme-border pb-2">
                <h3 className="text-base font-bold text-theme-on-surface flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>Core Proposals Assumptions</span>
                </h3>
                <button
                  onClick={handleAddAssumption}
                  className="text-xs text-primary hover:text-theme-on-surface font-bold no-print"
                >
                  + Add Assumption
                </button>
              </div>

              <div className="space-y-2.5">
                {(scope.assumptions || []).map((ass, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-2 rounded-lg theme-panel-lite border border-theme-border">
                    <span className="text-primary font-bold shrink-0">•</span>
                    <input
                      type="text"
                      value={ass}
                      onChange={(e) => handleAssumptionChange(idx, e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-theme-border focus:border-theme-border text-xs text-theme-on-surface focus:outline-none w-full"
                    />
                    <button
                      onClick={() => handleDeleteAssumption(idx)}
                      className="text-theme-on-surface-variant hover:text-theme-on-background shrink-0 no-print"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
