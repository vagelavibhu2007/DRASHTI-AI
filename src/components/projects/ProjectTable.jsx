import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Building2,
  MapPin
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { RiskBadge } from '../common/RiskBadge';
import { formatPercent } from '../../utils/riskUtils';
import { EmptyState } from '../common/CommonUI';

export const ProjectTable = ({
  projectsList,
  pageSize = 10,
  enablePagination = true,
  title,
  subtitle,
  headerAction
}) => {
  const navigate = useNavigate();
  const { setDrawerProjectId, clearAllFilters } = useDashboard();

  // Sorting
  const [sortField, setSortField] = useState('overallRisk');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProjects = useMemo(() => {
    const list = [...(projectsList || [])];
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [projectsList, sortField, sortDirection]);

  // Pagination calculation
  const totalItems = sortedProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProjects = enablePagination
    ? sortedProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedProjects;

  if (totalItems === 0) {
    return (
      <EmptyState
        title="No infrastructure projects match your filter criteria"
        description="Try adjusting your risk category, state, sector or search query."
        onReset={clearAllFilters}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Optional Table Header */}
      {(title || headerAction) && (
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/90 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 select-none">
            <tr>
              <th className="py-3 px-3.5 w-14 text-center">Rank</th>
              <th
                onClick={() => handleSort('projectId')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition"
              >
                <div className="flex items-center gap-1">
                  <span>Project ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('projectName')}
                className="py-3 px-3.5 min-w-[220px] cursor-pointer hover:bg-slate-200/70 transition"
              >
                <div className="flex items-center gap-1">
                  <span>Project Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 hidden lg:table-cell">Ministry / Sector</th>
              <th className="py-3 px-3 hidden md:table-cell">State</th>
              <th
                onClick={() => handleSort('physicalProgress')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Physical %</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('costRisk')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Cost Risk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('timeRisk')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Time Risk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('overallRisk')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Overall Risk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-center">Risk Level</th>
              <th className="py-3 px-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {paginatedProjects.map((p, index) => {
              const rank = enablePagination
                ? (currentPage - 1) * pageSize + index + 1
                : index + 1;

              return (
                <tr
                  key={p.projectId}
                  className="hover:bg-slate-50/90 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-400 text-xs">
                    {rank <= 3 ? (
                      <span className="inline-block w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] leading-5">
                        {rank}
                      </span>
                    ) : (
                      `#${rank}`
                    )}
                  </td>

                  {/* Project ID */}
                  <td className="py-3 px-3 font-mono font-bold text-gov-800">
                    <button
                      onClick={() => setDrawerProjectId(p.projectId)}
                      className="hover:underline hover:text-gov-600 inline-flex items-center gap-1"
                      title="Quick Preview"
                    >
                      <span>{p.projectId}</span>
                      <Eye className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  </td>

                  {/* Project Name */}
                  <td className="py-3 px-3.5 max-w-xs">
                    <button
                      onClick={() => navigate(`/projects/${p.projectId}`)}
                      className="font-bold text-slate-900 hover:text-gov-700 text-left line-clamp-1 block transition"
                      title={p.projectName}
                    >
                      {p.projectName}
                    </button>
                    <span className="text-[11px] text-slate-500 line-clamp-1 font-normal lg:hidden">
                      {p.sector} • {p.state}
                    </span>
                  </td>

                  {/* Ministry / Sector */}
                  <td className="py-3 px-3 hidden lg:table-cell max-w-[200px]">
                    <span className="block truncate font-semibold text-slate-800 text-[11px]">
                      {p.sector}
                    </span>
                    <span className="block truncate text-[10px] text-slate-400">
                      {p.ministry}
                    </span>
                  </td>

                  {/* State */}
                  <td className="py-3 px-3 hidden md:table-cell whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {p.state}
                    </span>
                  </td>

                  {/* Physical Progress */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-bold text-slate-800">
                        {formatPercent(p.physicalProgress)}
                      </span>
                      <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-gov-600 h-full rounded-full"
                          style={{ width: `${p.physicalProgress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cost Risk */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-red-600 whitespace-nowrap">
                    {formatPercent(p.costRisk)}
                  </td>

                  {/* Time Risk */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-orange-600 whitespace-nowrap">
                    {formatPercent(p.timeRisk)}
                  </td>

                  {/* Overall Risk Score */}
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-slate-900 text-sm whitespace-nowrap">
                    {Number(p.overallRisk).toFixed(1)}
                  </td>

                  {/* Risk Level Badge */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <RiskBadge level={p.riskLevel} size="xs" />
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/projects/${p.projectId}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-gov-700 hover:text-white bg-gov-50 hover:bg-gov-700 border border-gov-200 rounded-md transition shadow-sm"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {enablePagination && totalPages > 1 && (
        <div className="p-3.5 sm:px-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-bold text-slate-900">{totalItems}</span> projects
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;

