import React, { useState } from 'react';
import {
  ArrowRight,
  Database,
  Activity,
  FileSpreadsheet,
  BrainCircuit,
  Gauge,
  Sparkles,
  BellRing,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const USPBanner = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gradient-to-r from-gov-950 via-gov-900 to-gov-850 rounded-2xl p-5 sm:p-6 text-white shadow-gov border border-gov-700/40 relative overflow-hidden">
      {/* Background Subtle Tech Pattern */}
      <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 -top-10 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gov-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-sky-400/20 text-sky-300 border border-sky-400/30">
              CORE PARADIGM SHIFT
            </span>
            <span className="text-xs text-slate-400 font-mono">DRASHTI AI Engine v4.2</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
            <span>From Monitoring to Prediction</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            "Don't Just Monitor Projects — Predict Their Risks."
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gov-800/80 hover:bg-gov-700 text-slate-200 border border-gov-700 transition"
        >
          <span>{isExpanded ? 'Collapse Workflow' : 'Explore Workflow'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Comparison Workflows */}
      {isExpanded && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
          {/* Traditional Workflow (Inactive/Outdated) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Traditional Monitoring
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Reactive (Post-Facto)
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Relies on manual inspections and historical monthly expenditure uploads. Delays are discovered only after deadlines lapse.
              </p>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-between gap-1 text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Project Data</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Monitoring</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium">Reports</span>
              </div>
            </div>
          </div>

          {/* DRASHTI AI Workflow (Modern & Intelligent) */}
          <div className="lg:col-span-8 p-4 rounded-xl bg-gov-900/90 border border-sky-500/30 ring-1 ring-sky-500/20 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    DRASHTI AI Intelligent Architecture
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Proactive (Predictive)
                </span>
              </div>
              <p className="text-xs text-slate-200 mb-4 leading-relaxed">
                Synthesizes leading indicator variables (SHAP values, fund drawdowns, contractor throughput) to forecast cost & time slippages 6–18 months in advance.
              </p>
            </div>

            {/* Steps Workflow */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-gov-800">
              <div className="p-2 rounded-lg bg-gov-950/80 border border-gov-800 flex flex-col items-center text-center">
                <Database className="w-4 h-4 text-slate-300 mb-1" />
                <span className="text-[11px] font-bold text-slate-200">1. Raw Data</span>
                <span className="text-[9px] text-slate-400">MoSPI + Field</span>
              </div>

              <div className="p-2 rounded-lg bg-gov-950/80 border border-gov-800 flex flex-col items-center text-center">
                <BrainCircuit className="w-4 h-4 text-sky-400 mb-1" />
                <span className="text-[11px] font-bold text-sky-300">2. ML Predict</span>
                <span className="text-[9px] text-slate-400">Hazard Trees</span>
              </div>

              <div className="p-2 rounded-lg bg-gov-950/80 border border-gov-800 flex flex-col items-center text-center">
                <Gauge className="w-4 h-4 text-amber-400 mb-1" />
                <span className="text-[11px] font-bold text-amber-300">3. Risk Score</span>
                <span className="text-[9px] text-slate-400">0 - 100 Index</span>
              </div>

              <div className="p-2 rounded-lg bg-gov-950/80 border border-gov-800 flex flex-col items-center text-center">
                <Sparkles className="w-4 h-4 text-purple-400 mb-1" />
                <span className="text-[11px] font-bold text-purple-300">4. Explain AI</span>
                <span className="text-[9px] text-slate-400">SHAP Vectors</span>
              </div>

              <div className="p-2 rounded-lg bg-gov-950/80 border border-gov-800 flex flex-col items-center text-center">
                <BellRing className="w-4 h-4 text-red-400 mb-1" />
                <span className="text-[11px] font-bold text-red-300">5. Early Alert</span>
                <span className="text-[9px] text-slate-400">Automated</span>
              </div>

              <div className="p-2 rounded-lg bg-gov-950/80 border border-emerald-500/30 flex flex-col items-center text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold text-emerald-300">6. Action</span>
                <span className="text-[9px] text-slate-400">Intervention</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default USPBanner;

