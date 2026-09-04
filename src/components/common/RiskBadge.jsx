import React from 'react';
import { getRiskColor, getRiskLevel } from '../../utils/riskUtils';

export const RiskBadge = ({ level, score, size = 'md', showDot = true, className = '' }) => {
  const currentLevel = level || (score !== undefined ? getRiskLevel(score) : 'LOW');
  const colors = getRiskColor(currentLevel);

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] font-semibold gap-1',
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1.5',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2'
  }[size] || 'px-2.5 py-1 text-xs font-semibold gap-1.5';

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }[size] || 'w-2 h-2';

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase font-mono ${colors.badge} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`rounded-full ${colors.bg} ${dotSizes} ring-2 ring-current/20 animate-pulse`}
          style={{ animationDuration: currentLevel === 'CRITICAL' ? '1.5s' : '3s' }}
        />
      )}
      {currentLevel}
      {score !== undefined && (
        <span className="font-sans font-bold ml-1 opacity-90">({Number(score).toFixed(1)})</span>
      )}
    </span>
  );
};

export default RiskBadge;

