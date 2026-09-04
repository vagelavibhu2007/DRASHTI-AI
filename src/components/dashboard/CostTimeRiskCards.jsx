import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { DollarSign, Clock, Sparkles } from 'lucide-react';
import { COST_RISK_DISTRIBUTION, TIME_RISK_DISTRIBUTION, DASHBOARD_STATS } from '../../data/mockData';

export const CostTimeRiskCards = () => {
  const CustomBarTooltip = ({ active, payload, label, prefix }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-700">
          <span className="font-semibold text-slate-300 block">{label}</span>
          <span className="font-mono font-bold text-sm text-sky-400">
            {payload[0].value} Projects
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* CARD 1: Cost Overrun Risk */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50 text-red-700">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Cost Overrun Risk
                </h3>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Predicted Probability
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">310 in severe zone</span>
          </div>

          {/* Value Display */}
          <div className="flex items-baseline gap-3 my-2">
            <span className="text-3xl font-extrabold font-mono text-red-600 tracking-tight">
              {DASHBOARD_STATS.averageCostRisk}%
            </span>
            <span className="text-xs text-slate-500">Portfolio Average Probability</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Forecasted fiscal exposure driven by commodity price volatility & prolonged execution cycles.
          </p>
        </div>

        {/* Distribution Chart */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Probability Distribution (Number of Projects)
          </span>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COST_RISK_DISTRIBUTION} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip prefix="Cost Risk" />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {COST_RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell
                      key={`cost-cell-${index}`}
                      fill={index >= 3 ? '#EF4444' : index === 2 ? '#F59E0B' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CARD 2: Time Overrun Risk */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Time Overrun Risk
                </h3>
                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Predicted Probability
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">300 in severe zone</span>
          </div>

          {/* Value Display */}
          <div className="flex items-baseline gap-3 my-2">
            <span className="text-3xl font-extrabold font-mono text-orange-600 tracking-tight">
              {DASHBOARD_STATS.averageTimeRisk}%
            </span>
            <span className="text-xs text-slate-500">Portfolio Average Probability</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Forecasted schedule slippage influenced by RoW disputes, utility shifting & monsoonal stops.
          </p>
        </div>

        {/* Distribution Chart */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Probability Distribution (Number of Projects)
          </span>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TIME_RISK_DISTRIBUTION} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip prefix="Time Risk" />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {TIME_RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell
                      key={`time-cell-${index}`}
                      fill={index >= 3 ? '#F97316' : index === 2 ? '#F59E0B' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostTimeRiskCards;

