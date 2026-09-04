import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import RiskOverview from '../components/dashboard/RiskOverview';
import CostTimeRiskCards from '../components/dashboard/CostTimeRiskCards';
import RiskTrend from '../components/dashboard/RiskTrend';
import {
  SectorRiskChart,
  StateRiskChart,
  MinistryRiskChart
} from '../components/charts/RiskAnalyticsCharts';
import { PieChart, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RiskAnalytics = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Risk Analytics' }]}
      title="Macro Risk Analytics & Exposure Matrix"
      subtitle="Cross-sectoral predictive intelligence, fiscal risk distributions, and geographic hazard models."
      action={
        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Analytics Dossier</span>
        </button>
      }
    >
      {/* Row 1: Donut Risk Overview & Cost/Time Risk Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 flex flex-col">
          <RiskOverview />
        </div>
        <div className="lg:col-span-7 flex flex-col justify-between">
          <CostTimeRiskCards />
        </div>
      </div>

      {/* Row 2: Sector-wise & Ministry-wise Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectorRiskChart />
        <MinistryRiskChart />
      </div>

      {/* Row 3: State-wise Risk Distribution */}
      <StateRiskChart />

      {/* Row 4: Historical Temporal Trend */}
      <RiskTrend />
    </PageContainer>
  );
};

export default RiskAnalytics;

