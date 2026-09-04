import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RISK_DISTRIBUTION_DATA } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export const RiskOverview = () => {
  const navigate = useNavigate();
  const { setSelectedRiskFilter } = useDashboard();

  const handleRiskFilterClick = (level) => {
    setSelectedRiskFilter(level);
    navigate('/projects');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold uppercase tracking-wider">{data.name} Risk</span>
          </div>
          <div className="font-mono text-sm font-bold">{data.value.toLocaleString()} Projects</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{data.percentage} of active portfolio</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-gov-700" />
            Overall Project Risk
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            National distribution across 1,966 central sector projects
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Portfolio Health
        </span>
      </div>

      {/* Donut Chart and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
        {/* Donut Chart */}
        <div className="md:col-span-6 h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPie>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={RISK_DISTRIBUTION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                dataKey="value"
                cursor="pointer"
                onClick={(entry) => handleRiskFilterClick(entry.level)}
              >
                {RISK_DISTRIBUTION_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
            </RechartsPie>
          </ResponsiveContainer>

          {/* Center text in donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold font-mono text-slate-900">1,966</span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Total Projects
            </span>
          </div>
        </div>

        {/* Risk Summary Legend Items */}
        <div className="md:col-span-6 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Click level to filter projects:
          </span>

          {RISK_DISTRIBUTION_DATA.map((item) => (
            <div
              key={item.name}
              onClick={() => handleRiskFilterClick(item.level)}
              className="p-2.5 rounded-lg border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-gov-700 transition">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2 font-mono">({item.percentage})</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-slate-900">
                  {item.value.toLocaleString()}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>53.5% of monitored assets exhibit elevated risk</span>
        <button
          onClick={() => navigate('/high-risk')}
          className="text-gov-700 font-bold hover:underline inline-flex items-center gap-1"
        >
          View Priority 410 Assets →
        </button>
      </div>
    </div>
  );
};

export default RiskOverview;

