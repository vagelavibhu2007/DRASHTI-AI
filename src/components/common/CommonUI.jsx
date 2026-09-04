import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const EmptyState = ({
  title = 'No projects found',
  description = 'Try adjusting your search criteria or clear active filters.',
  onReset
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-gov-700 bg-gov-50 hover:bg-gov-100 border border-gov-200 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse space-y-3 p-4">
        <div className="h-8 bg-slate-200 rounded w-full"></div>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          <div className="h-3 bg-slate-100 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

export const SectionHeader = ({
  title,
  subtitle,
  badge,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          {badge && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-gov-100 text-gov-800 border border-gov-200">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

