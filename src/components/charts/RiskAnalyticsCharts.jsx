import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from 'recharts';
import { SECTOR_RISK_DATA, STATE_RISK_DATA, MINISTRY_RISK_DATA } from '../../data/mockData';
import { getRiskColor } from '../../utils/riskUtils';

export const SectorRiskChart = () => {
  const CustomSectorTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-bold text-sky-300 text-sm">{label}</div>
          <div className="text-slate-300">Total Projects: <span className="font-mono font-bold text-white">{data.totalProjects}</span></div>
          <div className="text-slate-300">Average Risk Index: <span className="font-mono font-bold text-red-400">{data.avgRisk}</span></div>
          <div className="text-slate-300">Cost Overrun Risk: <span className="font-mono font-bold text-amber-400">{data.costRisk}%</span></div>
          <div className="text-slate-300">Time Overrun Risk: <span className="font-mono font-bold text-orange-400">{data.timeRisk}%</span></div>
          <div className="pt-1 text-[10px] text-red-400 font-bold border-t border-slate-800">
            Critical Assets: {data.critical} ({((data.critical / data.totalProjects) * 100).toFixed(1)}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Sector-wise Risk Exposure</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Comparison of average predicted risk score and critical projects by sector
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={SECTOR_RISK_DATA}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis
              dataKey="sector"
              type="category"
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
              width={120}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomSectorTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
            <Bar dataKey="avgRisk" name="Avg Risk Score" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
            <Bar dataKey="costRisk" name="Cost Risk (%)" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const StateRiskChart = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">State-wise Risk Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Volume of Critical & High risk infrastructure projects across key states
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={STATE_RISK_DATA}
            margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="state"
              angle={-35}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 10, fill: '#475569' }}
            />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
            <Tooltip
              formatter={(value, name) => [`${value} Projects`, name]}
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
            <Bar dataKey="critical" name="Critical Risk" stackId="a" fill="#EF4444" />
            <Bar dataKey="high" name="High Risk" stackId="a" fill="#F97316" />
            <Bar dataKey="med" name="Medium Risk" stackId="a" fill="#F59E0B" />
            <Bar dataKey="low" name="Low Risk" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MinistryRiskChart = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Ministry-wise Risk Index</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Proportion of critical infrastructure exposure under central administrative ministries
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={MINISTRY_RISK_DATA}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis
              dataKey="ministry"
              type="category"
              tick={{ fontSize: 10, fill: '#334155' }}
              width={180}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip
              formatter={(val, name) => [`${val}${name.includes('Percent') ? '%' : ''}`, name]}
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
            <Bar dataKey="avgRisk" name="Avg Risk Index" fill="#2563EB" radius={[0, 4, 4, 0]} />
            <Bar dataKey="criticalPercent" name="Critical % Ratio" fill="#DC2626" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

