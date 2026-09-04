import React from 'react';

export const StatusBadge = ({ status }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  switch (status?.toLowerCase()) {
    case 'new':
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200';
      dotColor = 'bg-blue-500';
      break;
    case 'under review':
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
      dotColor = 'bg-amber-500';
      break;
    case 'action initiated':
      badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200';
      dotColor = 'bg-purple-500';
      break;
    case 'resolved':
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dotColor = 'bg-emerald-500';
      break;
    case 'under progress':
      badgeStyle = 'bg-gov-50 text-gov-700 border-gov-200';
      dotColor = 'bg-gov-600';
      break;
    case 'nearing completion':
      badgeStyle = 'bg-teal-50 text-teal-700 border-teal-200';
      dotColor = 'bg-teal-600';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default StatusBadge;

