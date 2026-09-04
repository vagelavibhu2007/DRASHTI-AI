import React from 'react';
import { getRiskColor, getRiskLevel } from '../../utils/riskUtils';

export const RiskGauge = ({ score = 0, size = 180, strokeWidth = 14, label = 'Risk Score' }) => {
  const riskLevel = getRiskLevel(score);
  const colors = getRiskColor(riskLevel);

  // SVG parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation: display 240 degrees arc (from 150 deg to 390 deg)
  const arcLength = circumference * (240 / 360);
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = arcLength - (normalizedScore / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-[210deg] origin-center"
      >
        {/* Track Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Dynamic Progress Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.accent}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
          {Number(score).toFixed(1)}
        </span>
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 mt-0.5">
          {label}
        </span>
        <div className="mt-1">
          <span
            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${colors.badge}`}
          >
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;

