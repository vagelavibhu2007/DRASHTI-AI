import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { getRiskColor } from '../../utils/riskUtils';

export const KPICard = ({
  title,
  value,
  supportingText,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'up' | 'down' | 'neutral'
  trendLabel,
  riskLevel,
  onClick,
  isActive = false,
  className = ''
}) => {
  const riskStyles = riskLevel ? getRiskColor(riskLevel) : null;

  return (
    <div
      onClick={onClick}
      className={`relative p-4 sm:p-5 rounded-xl border bg-white transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5' : ''
      } ${
        isActive
          ? 'ring-2 ring-gov-700 border-gov-700 shadow-md'
          : 'border-slate-200/90 shadow-card'
      } ${className}`}
    >
      {/* Top Row: Title & Icon */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 line-clamp-1">
          {title}
        </span>
        {Icon && (
          <div
            className={`p-2 rounded-lg flex items-center justify-center ${
              riskStyles ? riskStyles.bgLight : 'bg-slate-100'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${riskStyles ? riskStyles.text : 'text-slate-600'}`}
            />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <span
          className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            riskStyles ? riskStyles.text : 'text-slate-900'
          }`}
        >
          {value}
        </span>
      </div>

      {/* Bottom Trend & Supporting Text */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80 text-xs">
        <span className="text-slate-500 text-[11px] truncate">{supportingText}</span>
        {trend && (
          <div
            className={`inline-flex items-center gap-0.5 font-semibold text-[11px] font-mono px-1.5 py-0.5 rounded ${
              trendType === 'up'
                ? 'text-red-700 bg-red-50'
                : trendType === 'down'
                ? 'text-emerald-700 bg-emerald-50'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            {trendType === 'up' && <ArrowUpRight className="w-3 h-3" />}
            {trendType === 'down' && <ArrowDownRight className="w-3 h-3" />}
            {trendType === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;

