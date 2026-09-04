import React from 'react';
import { X, Sliders, Shield, Database, Cpu, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const SettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen, modelInfo } = useDashboard();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold">DRASHTI AI Machine Learning Architecture</h3>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-gov-700" />
              Active Machine Learning Model Performance
            </h4>
            <div className="space-y-3">
              {/* Cost Classification Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Cost Overrun Classification</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 font-mono">
                    XGBoost v4.2 (Production)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Accuracy @ 0.4</span>
                    <span className="font-bold text-slate-900">82.91%</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">ROC-AUC</span>
                    <span className="font-bold text-slate-900">0.8524</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Precision</span>
                    <span className="font-bold text-slate-900">70.00%</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">F1 Score</span>
                    <span className="font-bold text-slate-900">67.63%</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Threshold Parameter:</strong> 0.40 (Classification positive if probability ≥ 40%)
                </div>
              </div>

              {/* Time Model Card */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Time Overrun & Delay Model</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800 font-mono">
                    Random Forest Pipeline
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Time Accuracy</span>
                    <span className="font-bold text-slate-900">81.45%</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Time ROC-AUC</span>
                    <span className="font-bold text-slate-900">0.8410</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-gov-700" />
              Feature Ingestion Signatures
            </h4>
            <div className="p-3 bg-gov-50/70 rounded-lg border border-gov-200 space-y-1.5 text-xs text-gov-900">
              <div><strong>Numerical Features:</strong> Original_Cost_Cr, Cumulative_Expenditure_Cr, Physical_Progress_Pct, Expenditure_Pct_of_Original_Cost</div>
              <div><strong>Categorical Features:</strong> Ministry, Sector, State</div>
              <div><strong>Explainability:</strong> SHAP (SHapley Additive exPlanations) TreeExplainer</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 bg-gov-700 hover:bg-gov-800 text-white text-xs font-bold rounded-lg transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export const HelpModal = () => {
  const { isHelpOpen, setIsHelpOpen } = useDashboard();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold">DRASHTI AI Methodology & User Guide</h3>
          </div>
          <button
            onClick={() => setIsHelpOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-1">Core Mission & Paradigm Shift</h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              Traditional infrastructure monitoring relies on lagging indicators (post-facto reports, manual inspections after deadlines lapse).
              <strong> DRASHTI AI</strong> converts passive monitoring into <strong>Proactive Early Warning</strong> using predictive machine learning models that analyze leading variables (fund burn rate disparity, contractor execution velocity, seasonal weather risks, and right-of-way litigations).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Risk Scoring Index (0 - 100 Scale)
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-800 block">LOW RISK</span>
                <span className="text-[11px] text-emerald-600 font-mono">0.0 - 24.9</span>
                <span className="text-[10px] text-slate-500 block mt-1">Normal execution pace.</span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-800 block">MEDIUM RISK</span>
                <span className="text-[11px] text-amber-600 font-mono">25.0 - 49.9</span>
                <span className="text-[10px] text-slate-500 block mt-1">Minor milestones delayed.</span>
              </div>
              <div className="p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
                <span className="font-bold text-orange-800 block">HIGH RISK</span>
                <span className="text-[11px] text-orange-600 font-mono">50.0 - 79.9</span>
                <span className="text-[10px] text-slate-500 block mt-1">Significant cost/time drift.</span>
              </div>
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold text-red-800 block">CRITICAL RISK</span>
                <span className="text-[11px] text-red-600 font-mono">80.0 - 100.0</span>
                <span className="text-[10px] text-slate-500 block mt-1">Immediate intervention needed.</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Explainable AI (SHAP Framework)</h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every project score is broken down into positive and negative risk contributors. Red bars indicate factors inflating project failure risk, while green bars indicate mitigations such as timely PMKSY central funding or expedited clearances.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsHelpOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
