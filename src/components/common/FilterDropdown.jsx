import React from 'react';
import { ChevronDown } from 'lucide-react';

export const FilterDropdown = ({
  label,
  value,
  onChange,
  options = [],
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {label && (
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none w-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-lg py-2 ${
            Icon ? 'pl-8' : 'pl-3'
          } pr-8 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700 transition cursor-pointer shadow-sm`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default FilterDropdown;

