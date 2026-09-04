import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Calendar,
  Sparkles,
  Bot,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { RiskBadge } from '../common/RiskBadge';

export const Navbar = () => {
  const { stats, alerts, searchQuery, setSearchQuery } = useDashboard();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/projects');
    }
  };

  const unreadAlerts = alerts.filter((a) => a.status === 'New' || a.status === 'Under Review');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 shadow-sm flex items-center justify-between px-4 sm:px-6">
      {/* Left Area: Govt Badge & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* National Emblem stylized tag */}
        <div className="hidden lg:flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
          <div className="w-5 h-5 rounded bg-gov-700 text-white flex items-center justify-center font-bold text-[10px]">
            🇮🇳
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gov-900 leading-none">Government of India</span>
            <span className="text-[9px] text-slate-500 font-normal">PM-GatiShakti / PRAGATI Node</span>
          </div>
        </div>

        {/* Global Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by ID, name, state or sector..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700 transition"
          />
        </form>
      </div>

      {/* Right Area: System Status, Date & Actions */}
      <div className="flex items-center gap-3">
        {/* AI Model Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono">ML Predictor Active (94.6% Acc.)</span>
        </div>

        {/* Last Updated Timestamp */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-lg text-slate-600 text-xs font-medium border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500 font-semibold">Updated:</span>
          <span className="font-mono font-bold text-slate-800">{stats.lastUpdated}</span>
        </div>

        {/* Quick Simulator CTA */}
        <NavLink
          to="/what-if"
          className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gov-700 bg-gov-50 hover:bg-gov-100 border border-gov-200 transition"
        >
          <Sliders className="w-3.5 h-3.5 text-gov-600" />
          <span>Simulate What-If</span>
        </NavLink>

        {/* Quick Assistant CTA */}
        <NavLink
          to="/assistant"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 shadow-sm transition"
        >
          <Bot className="w-3.5 h-3.5 text-sky-300" />
          <span className="hidden md:inline">AI Copilot</span>
        </NavLink>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Early Warning Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-ping" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Early Warning Radar</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {unreadAlerts.length} Active
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {unreadAlerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.alertId}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/alerts');
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <RiskBadge level={alert.severity} size="xs" />
                        <span className="text-[10px] text-slate-400 font-mono">{alert.created}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight line-clamp-1">{alert.projectName}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{alert.reason}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <NavLink
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-gov-700 hover:text-gov-800 inline-flex items-center gap-1"
                  >
                    <span>View all early warning alerts</span>
                    <ExternalLink className="w-3 h-3" />
                  </NavLink>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

