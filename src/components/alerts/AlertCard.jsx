import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  CheckCircle,
  Eye
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import StatusBadge from '../common/StatusBadge';
import { useDashboard } from '../../context/DashboardContext';

export const AlertCard = ({ alert, onStatusChange }) => {
  const navigate = useNavigate();
  const { setDrawerProjectId } = useDashboard();

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4">
      {/* Top row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500">{alert.alertId}</span>
            <RiskBadge level={alert.severity} size="xs" />
          </div>
          <StatusBadge status={alert.status} />
        </div>

        {/* Project Name */}
        <h4
          onClick={() => navigate(`/projects/${alert.projectId}`)}
          className="text-sm font-bold text-slate-900 hover:text-gov-700 cursor-pointer line-clamp-1 transition"
        >
          {alert.projectName}
        </h4>

        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            {alert.ministry}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {alert.state}
          </span>
        </div>
      </div>

      {/* Reason Box */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
        <div className="flex items-center justify-between font-bold text-slate-800">
          <span className="flex items-center gap-1.5 text-red-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            {alert.riskType}
          </span>
          <span className="font-mono text-slate-900">{alert.probability}% Prob.</span>
        </div>
        <p className="text-slate-600 text-[11px] leading-relaxed">{alert.reason}</p>
        {alert.recommendation && (
          <div className="pt-1.5 border-t border-slate-200/80 text-[11px] text-gov-800 font-medium">
            <span className="font-bold">AI Recommendation: </span>
            {alert.recommendation}
          </div>
        )}
      </div>

      {/* Timestamp & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {alert.created}
        </span>

        <div className="flex items-center gap-2">
          {onStatusChange && alert.status !== 'Resolved' && (
            <button
              onClick={() => onStatusChange(alert.alertId, 'Action Initiated')}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md transition"
            >
              Review
            </button>
          )}

          <button
            onClick={() => navigate(`/projects/${alert.projectId}`)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded-md transition shadow-sm"
          >
            <span>View Project</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;

