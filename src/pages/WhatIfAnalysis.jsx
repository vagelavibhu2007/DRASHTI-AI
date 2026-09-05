import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Info,
  DollarSign,
  Clock,
  Gauge,
  Zap,
  Loader2
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useDashboard } from '../context/DashboardContext';
import { api } from '../services/api';
import { formatCurrency, formatPercent } from '../utils/riskUtils';
import { RiskBadge } from '../components/common/RiskBadge';

export const WhatIfAnalysis = () => {
  const location = useLocation();
  const { projects } = useDashboard();

  // Selected project baseline or first project
  const initialProject = location.state?.project || projects[0];
  const [selectedProjectId, setSelectedProjectId] = useState(initialProject.projectId);

  const currentProject = projects.find((p) => String(p.projectId) === String(selectedProjectId)) || projects[0];

  // Simulation State Variables
  const [originalCost, setOriginalCost] = useState(currentProject.originalCost);
  const [cumulativeExpenditure, setCumulativeExpenditure] = useState(currentProject.cumulativeExpenditure);
  const [physicalProgress, setPhysicalProgress] = useState(currentProject.physicalProgress);

  // Simulated Scenario Result from ML API
  const [simulatedResult, setSimulatedResult] = useState(null);
  const [isInferencing, setIsInferencing] = useState(false);

  // Sync when project changes
  useEffect(() => {
    setOriginalCost(currentProject.originalCost);
    setCumulativeExpenditure(currentProject.cumulativeExpenditure);
    setPhysicalProgress(currentProject.physicalProgress);
  }, [currentProject]);

  const expenditurePercentage = originalCost > 0
    ? Number(((cumulativeExpenditure / originalCost) * 100).toFixed(1))
    : 0;

  // Real-time ML Prediction Call on variable change
  useEffect(() => {
    let isMounted = true;
    const runSimulationPrediction = async () => {
      setIsInferencing(true);
      try {
        const payload = {
          project_id: currentProject.projectId,
          project_name: currentProject.projectName,
          Original_Cost_Cr: Number(originalCost),
          Cumulative_Expenditure_Cr: Number(cumulativeExpenditure),
          Physical_Progress_Pct: Number(physicalProgress),
          Expenditure_Pct_of_Original_Cost: expenditurePercentage,
          Ministry: currentProject.ministry,
          Sector: currentProject.sector,
          State: currentProject.state
        };

        const res = await api.predictRisk(payload);
        if (isMounted && res.success && res.data) {
          setSimulatedResult(res.data);
        }
      } catch (err) {
        console.warn('Simulation inference error:', err);
      } finally {
        if (isMounted) setIsInferencing(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      runSimulationPrediction();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [originalCost, cumulativeExpenditure, physicalProgress, expenditurePercentage, currentProject]);

  const simCostRisk = simulatedResult ? simulatedResult.cost_overrun_probability : currentProject.costRisk;
  const simTimeRisk = simulatedResult ? simulatedResult.time_overrun_probability : currentProject.timeRisk;
  const simOverallRisk = simulatedResult ? simulatedResult.overall_risk_score : currentProject.overallRisk;
  const simRiskLevel = simulatedResult ? simulatedResult.risk_level : currentProject.riskLevel;

  const overallDelta = Number((simOverallRisk - currentProject.overallRisk).toFixed(1));

  const resetToBaseline = () => {
    setOriginalCost(currentProject.originalCost);
    setCumulativeExpenditure(currentProject.cumulativeExpenditure);
    setPhysicalProgress(currentProject.physicalProgress);
  };

  const applyPreset = (presetName) => {
    if (presetName === 'accelerate') {
      setPhysicalProgress(Math.min(100, Math.round(physicalProgress + 18)));
      setCumulativeExpenditure(Math.round(originalCost * 0.75));
    } else if (presetName === 'slowdown') {
      setPhysicalProgress(Math.max(10, Math.round(physicalProgress - 15)));
    } else if (presetName === 'budget_cap') {
      setCumulativeExpenditure(Math.round(originalCost * 0.90));
    }
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'What-If Risk Simulation' }]}
      title="What-If Risk Simulation"
      subtitle="Explore how project conditions may affect predicted risk using real-time machine learning inference."
      action={
        <button
          onClick={resetToBaseline}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset to Project Baseline</span>
        </button>
      }
    >
      {/* Target Project Selection & Quick Presets */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Target Project:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-700/20 max-w-md"
          >
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                #{p.projectId} - {p.projectName} ({p.state})
              </option>
            ))}
          </select>
        </div>

        {/* Preset Scenarios */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
          <button
            onClick={() => applyPreset('accelerate')}
            className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-emerald-600" />
            Accelerate Physical Execution (+18%)
          </button>
          <button
            onClick={() => applyPreset('slowdown')}
            className="px-2.5 py-1 text-xs font-bold text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md transition"
          >
            Monsoon Delay (-15%)
          </button>
          <button
            onClick={() => applyPreset('budget_cap')}
            className="px-2.5 py-1 text-xs font-bold text-gov-800 bg-gov-50 hover:bg-gov-100 border border-gov-200 rounded-md transition"
          >
            Cap Spend at 90%
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Input Controls */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gov-700" />
                Input Controls
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust sliders to evaluate model response
              </p>
            </div>
            {isInferencing && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gov-700 font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ML Computing...
              </span>
            )}
          </div>

          {/* Slider 1: Physical Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Physical Progress</span>
              <span className="font-mono text-sm font-bold text-gov-800">{physicalProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={physicalProgress}
              onChange={(e) => setPhysicalProgress(Number(e.target.value))}
              className="w-full accent-gov-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0%</span>
              <span>Baseline: {currentProject.physicalProgress}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 2: Cumulative Expenditure */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">Cumulative Expenditure</span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {formatCurrency(cumulativeExpenditure)}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max={Math.round(originalCost * 1.8)}
              step="10"
              value={cumulativeExpenditure}
              onChange={(e) => setCumulativeExpenditure(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹10 Cr</span>
              <span>Baseline: {formatCurrency(currentProject.cumulativeExpenditure)}</span>
              <span>{formatCurrency(originalCost * 1.8)}</span>
            </div>
          </div>

          {/* Numeric Inputs: Original Cost & Expenditure % */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Original Cost
              </label>
              <div className="font-mono text-sm font-bold text-slate-900">
                {formatCurrency(originalCost)}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Expenditure %
              </label>
              <div className={`font-mono text-sm font-bold ${expenditurePercentage > 100 ? 'text-red-600' : 'text-slate-900'}`}>
                {expenditurePercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CURRENT SCENARIO vs SIMULATED SCENARIO */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gov-700" />
                Scenario Comparison Outcome
              </h3>

              {/* Risk Change Delta */}
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                  overallDelta < 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : overallDelta > 0
                    ? 'bg-red-50 text-red-800 border-red-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {overallDelta < 0 && <ArrowDownRight className="w-4 h-4 text-emerald-600" />}
                {overallDelta > 0 && <ArrowUpRight className="w-4 h-4 text-red-600" />}
                {overallDelta === 0 && <Minus className="w-4 h-4 text-slate-400" />}
                <span>
                  {overallDelta < 0
                    ? `↓ ${Math.abs(overallDelta)} points (Improvement)`
                    : overallDelta > 0
                    ? `↑ ${overallDelta} points (Escalation)`
                    : '0.0 Change'}
                </span>
              </div>
            </div>

            {/* Current vs Simulated Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CURRENT SCENARIO */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    CURRENT SCENARIO
                  </span>
                  <RiskBadge level={currentProject.riskLevel} size="xs" showDot={false} />
                </div>

                <div className="space-y-2 pt-1 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-sans">Cost Risk:</span>
                    <span className="font-bold text-red-600">{formatPercent(currentProject.costRisk)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-sans">Time Risk:</span>
                    <span className="font-bold text-orange-600">{formatPercent(currentProject.timeRisk)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 font-sans">
                    <span className="font-bold text-slate-800">Overall Risk:</span>
                    <span className="font-mono text-lg font-extrabold text-slate-900">
                      {Number(currentProject.overallRisk).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SIMULATED SCENARIO */}
              <div className="p-4 bg-gov-50/80 rounded-xl border border-gov-300 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gov-800">
                    SIMULATED SCENARIO
                  </span>
                  <RiskBadge level={simRiskLevel} size="xs" showDot={false} />
                </div>

                <div className="space-y-2 pt-1 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gov-800 font-sans font-medium">Cost Risk:</span>
                    <span className="font-bold text-red-600">{formatPercent(simCostRisk)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gov-800 font-sans font-medium">Time Risk:</span>
                    <span className="font-bold text-orange-600">{formatPercent(simTimeRisk)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gov-200 font-sans">
                    <span className="font-bold text-gov-900">Overall Risk:</span>
                    <span className="font-mono text-lg font-extrabold text-gov-900">
                      {Number(simOverallRisk).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Prescriptive Insight */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Live Machine Learning Prescriptive Assessment
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {overallDelta < 0
                  ? `Simulated parameters produce a predicted risk reduction of ${Math.abs(overallDelta)} points. Bringing physical progress into close alignment with expenditure significantly reduces cost and schedule hazard probabilities.`
                  : overallDelta > 0
                  ? `Notice: This simulation increases the overall project hazard index by ${overallDelta} points. Disproportionate fund burning ahead of physical verification triggers severe XGBoost classification risk.`
                  : 'Modify variables to observe live ML model sensitivity.'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Connected to live XGBoost & Random Forest ML pipelines.</span>
            </div>
            <span className="font-mono font-bold text-gov-800">DRISHTI ML Engine v4.2</span>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default WhatIfAnalysis;
