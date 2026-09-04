import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { QuickProjectDrawer } from './components/common/QuickProjectDrawer';
import { SettingsModal, HelpModal } from './components/layout/SystemModals';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import RiskAnalytics from './pages/RiskAnalytics';
import HighRiskProjects from './pages/HighRiskProjects';
import PredictionTrends from './pages/PredictionTrends';
import GeographicRisk from './pages/GeographicRisk';
import Alerts from './pages/Alerts';
import WhatIfAnalysis from './pages/WhatIfAnalysis';
import AIAssistant from './pages/AIAssistant';
import Reports from './pages/Reports';

export const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Application Content Body */}
      <div className="flex-1 flex flex-col min-w-0 pl-20 sm:pl-64 transition-all duration-300">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/risk-analytics" element={<RiskAnalytics />} />
            <Route path="/high-risk" element={<HighRiskProjects />} />
            <Route path="/trends" element={<PredictionTrends />} />
            <Route path="/map" element={<GeographicRisk />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/what-if" element={<WhatIfAnalysis />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/reports" element={<Reports />} />
            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>

        {/* Global Slide-Over Project Drawer */}
        <QuickProjectDrawer />

        {/* System Settings & Help Documentation Modals */}
        <SettingsModal />
        <HelpModal />
      </div>
    </div>
  );
};

export default App;

