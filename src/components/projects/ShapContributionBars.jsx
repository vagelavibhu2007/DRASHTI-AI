import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export const ShapContributionBars = ({ factors = [], projectName }) => {
  const defaultFactors = [
    { name: 'Expenditure vs Original Cost', contribution: 32, type: 'increase', detail: 'Financial outlay has outpaced sanctioned physical milestones' },
    { name: 'Low Physical Progress Gap', contribution: 24, type: 'increase', detail: 'Actual ground delivery is lagging planned baseline pace' },
    { name: 'Historical Sector Risk', contribution: 18, type: 'increase', detail: 'Sectoral average history indicates high risk of complex clearances' },
    { name: 'Cumulative Expenditure Ratio', contribution: 15, type: 'increase', detail: 'Fund drawdown velocity higher than industry average' },
    { name: 'State-level Spatial Pattern', contribution: 8, type: 'increase', detail: 'Corridor land acquisition and right-of-way challenges in region' },
    { name: 'Central Budgetary Allocation', contribution: -7, type: 'decrease', detail: 'Prompt disbursement of quarterly fiscal tranches' }
  ];

  const items = factors && factors.length > 0 ? factors : defaultFactors;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gov-700" />
              Why is this project risky?
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-100 text-purple-800 border border-purple-200 uppercase">
              Explainable AI (XAI)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-assisted explanation of major risk contributors using Tree-SHAP value attribution.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-red-700">
            <span className="w-2.5 h-2.5 rounded bg-red-500" />
            Increases Risk
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            Reduces Risk
          </span>
        </div>
      </div>

      {/* SHAP Factor Bars */}
      <div className="space-y-4">
        {items.map((factor, index) => {
          const isIncrease = factor.type === 'increase' || factor.contribution > 0;
          const absVal = Math.abs(factor.contribution);
          const percentWidth = Math.min(100, Math.max(10, absVal * 2.5));

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  {isIncrease ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  )}
                  <span>{factor.name}</span>
                </div>

                <span
                  className={`font-mono font-bold text-xs ${
                    isIncrease ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  {isIncrease ? `+${absVal}%` : `-${absVal}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isIncrease
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${percentWidth}%` }}
                />
              </div>

              {/* Detail snippet */}
              {factor.detail && (
                <p className="text-[11px] text-slate-500 pl-5">{factor.detail}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer / Model Footer */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Demo explanation — connected to SHAP model later.</span>
        </div>
        <span className="font-mono font-semibold text-slate-700">Model: GBDT-SHAP-v4</span>
      </div>
    </div>
  );
};

export default ShapContributionBars;

