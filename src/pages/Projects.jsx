import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import PageContainer from '../components/layout/PageContainer';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectTable from '../components/projects/ProjectTable';
import { Download, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Projects = () => {
  const { filteredProjects, stats } = useDashboard();
  const navigate = useNavigate();

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Projects Directory' }]}
      title="National Infrastructure Projects Repository"
      subtitle="Complete database of 1,966 central sector infrastructure investments monitored via DRASHTI AI"
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Filtered (CSV)</span>
          </button>
        </div>
      }
    >
      {/* Search and Multi-Criteria Filters */}
      <ProjectFilters resultsCount={filteredProjects.length} />

      {/* Main Filtered Table */}
      <ProjectTable
        projectsList={filteredProjects}
        pageSize={15}
        enablePagination={true}
      />
    </PageContainer>
  );
};

export default Projects;

