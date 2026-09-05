import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import indiaGeoData from '../../data/india_states_simplified.json';
import { INDIA_STATE_PATHS } from '../../data/indiaMapPaths';
import { STATE_RISK_DATA, MOCK_PROJECTS } from '../../data/mockData';
import { getRiskLevel } from '../../utils/riskUtils';
import { RiskBadge } from '../common/RiskBadge';
import {
  MapPin,
  Building2,
  RotateCcw,
  Clock,
  IndianRupee,
  Layers,
  ExternalLink,
  ShieldAlert,
  Navigation
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

// Helper component to smoothly animate map viewport on state selection
const MapViewportController = ({ selectedState, stateStats }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedState && selectedState !== 'ALL' && stateStats[selectedState]) {
      const coords = stateStats[selectedState].lonLatCentroid;
      if (coords && coords.length === 2) {
        // [lon, lat] -> [lat, lon]
        map.flyTo([coords[1], coords[0]], 6.5, { duration: 1.2 });
      }
    } else if (selectedState === 'ALL') {
      map.flyTo([22.5, 82.0], 4.8, { duration: 1.2 });
    }
  }, [selectedState, stateStats, map]);

  return null;
};

export const IndiaRiskMap = () => {
  const { setDrawerProjectId, projects: contextProjects } = useDashboard();
  const geoJsonRef = useRef(null);

  // Use context projects if available, otherwise MOCK_PROJECTS
  const allProjects = useMemo(() => {
    return contextProjects && contextProjects.length > 0 ? contextProjects : MOCK_PROJECTS;
  }, [contextProjects]);

  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [activeHoverState, setActiveHoverState] = useState(null);
  const [tileStyle, setTileStyle] = useState('osm'); // 'osm' or 'carto'

  // Map state data aggregated from actual projects
  const stateStats = useMemo(() => {
    const statsMap = {};

    // Initialize all 35 states
    INDIA_STATE_PATHS.forEach((s) => {
      const mockStat = STATE_RISK_DATA.find(
        (m) => m.state.toLowerCase() === s.name.toLowerCase() || m.code === s.code
      );

      statsMap[s.name] = {
        name: s.name,
        code: s.code,
        centroid: s.centroid,
        lonLatCentroid: s.lonLatCentroid,
        projects: mockStat ? mockStat.projects : 15,
        critical: mockStat ? mockStat.critical : 3,
        high: mockStat ? mockStat.high : 5,
        med: mockStat ? mockStat.med : 5,
        low: mockStat ? mockStat.low : 2,
        avgRisk: mockStat ? mockStat.avgRisk : 52.0,
        avgCostRisk: mockStat ? Number((mockStat.avgRisk * 1.05).toFixed(1)) : 55.0,
        avgTimeRisk: mockStat ? Number((mockStat.avgRisk * 0.96).toFixed(1)) : 50.0
      };
    });

    // Update with live projects if matches exist
    const stateProjectGroups = {};
    allProjects.forEach((p) => {
      const pState = p.state || 'Maharashtra';
      const matchedPath = INDIA_STATE_PATHS.find(
        (s) =>
          s.name.toLowerCase() === pState.toLowerCase() ||
          pState.toLowerCase().includes(s.name.toLowerCase())
      );
      const stName = matchedPath ? matchedPath.name : pState;
      if (!stateProjectGroups[stName]) stateProjectGroups[stName] = [];
      stateProjectGroups[stName].push(p);
    });

    Object.keys(stateProjectGroups).forEach((stName) => {
      if (statsMap[stName]) {
        const group = stateProjectGroups[stName];
        const critCount = group.filter((p) => p.riskLevel === 'CRITICAL').length;
        const highCount = group.filter((p) => p.riskLevel === 'HIGH').length;
        const medCount = group.filter((p) => p.riskLevel === 'MEDIUM').length;
        const lowCount = group.filter((p) => p.riskLevel === 'LOW').length;
        const avgR = (
          group.reduce((acc, p) => acc + (Number(p.overallRisk) || 50), 0) / group.length
        ).toFixed(1);
        const avgC = (
          group.reduce((acc, p) => acc + (Number(p.costRisk) || 50), 0) / group.length
        ).toFixed(1);
        const avgT = (
          group.reduce((acc, p) => acc + (Number(p.timeRisk) || 50), 0) / group.length
        ).toFixed(1);

        statsMap[stName] = {
          ...statsMap[stName],
          projects: Math.max(statsMap[stName].projects, group.length),
          critical: Math.max(statsMap[stName].critical, critCount),
          high: Math.max(statsMap[stName].high, highCount),
          med: Math.max(statsMap[stName].med, medCount),
          low: Math.max(statsMap[stName].low, lowCount),
          avgRisk: Number(avgR),
          avgCostRisk: Number(avgC),
          avgTimeRisk: Number(avgT)
        };
      }
    });

    return statsMap;
  }, [allProjects]);

  // Filtered projects for map markers
  const filteredMapProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (selectedState !== 'ALL') {
        const matchesState = p.state && p.state.toLowerCase().includes(selectedState.toLowerCase());
        if (!matchesState) return false;
      }
      if (selectedSector !== 'ALL' && p.sector !== selectedSector) return false;
      if (selectedRisk !== 'ALL' && p.riskLevel !== selectedRisk) return false;
      return true;
    });
  }, [allProjects, selectedState, selectedSector, selectedRisk]);

  // Project marker geographic coordinates [lat, lng]
  const projectMarkers = useMemo(() => {
    return filteredMapProjects.map((p, idx) => {
      const stateObj = INDIA_STATE_PATHS.find(
        (s) =>
          s.name.toLowerCase() === (p.state || '').toLowerCase() ||
          (p.state || '').toLowerCase().includes(s.name.toLowerCase())
      );

      let lat, lng;
      if (p.lat && p.lng) {
        lat = Number(p.lat);
        lng = Number(p.lng);
      } else if (stateObj && stateObj.lonLatCentroid) {
        const [stateLon, stateLat] = stateObj.lonLatCentroid;
        // Deterministic geographic offset dispersion across state area
        const angle = (idx * 137.5 * Math.PI) / 180;
        const radius = 0.2 + (idx % 6) * 0.18; // approx 20km to 80km
        lat = Number((stateLat + Math.sin(angle) * radius).toFixed(4));
        lng = Number((stateLon + Math.cos(angle) * radius).toFixed(4));
      } else {
        lat = 20.5937 + (idx % 5) * 0.4;
        lng = 78.9629 + (idx % 5) * 0.4;
      }

      return {
        ...p,
        geoLat: lat,
        geoLng: lng
      };
    });
  }, [filteredMapProjects]);

  // Active state data for the side profile
  const activeStateData = useMemo(() => {
    const targetName = activeHoverState || (selectedState !== 'ALL' ? selectedState : 'Maharashtra');
    return stateStats[targetName] || stateStats['Maharashtra'] || Object.values(stateStats)[0];
  }, [activeHoverState, selectedState, stateStats]);

  // Choropleth style for state boundaries on light basemap
  const getStateStyle = (feature) => {
    const rawName = feature.properties.NAME_1 || feature.properties.name;
    const matchedPath = INDIA_STATE_PATHS.find(
      (s) => s.rawName === rawName || s.name.toLowerCase() === rawName.toLowerCase()
    );
    const stateName = matchedPath ? matchedPath.name : rawName;
    const data = stateStats[stateName];

    const isSelected = selectedState === stateName;
    const isHovered = activeHoverState === stateName;

    let fillColor = '#10B981'; // Low: green
    let borderColor = '#059669';

    if (data && data.avgRisk >= 68) {
      fillColor = '#EF4444'; // Critical: red
      borderColor = '#DC2626';
    } else if (data && data.avgRisk >= 58) {
      fillColor = '#F97316'; // High: orange
      borderColor = '#EA580C';
    } else if (data && data.avgRisk >= 48) {
      fillColor = '#F59E0B'; // Medium: amber
      borderColor = '#D97706';
    }

    return {
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.38 : isHovered ? 0.28 : 0.12,
      color: isSelected ? '#0284C7' : isHovered ? '#1E3A5F' : borderColor,
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      dashArray: isSelected || isHovered ? '' : '3 3',
      lineCap: 'round',
      lineJoin: 'round'
    };
  };

  const handleResetMap = () => {
    setSelectedState('ALL');
    setSelectedRisk('ALL');
    setSelectedSector('ALL');
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gov-700" />
            Geographic Risk Radar (India)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial distribution of infrastructure project risk across India on OpenStreetMap basemap.
          </p>
        </div>

        {/* Filter Controls & Basemap Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All States (National View)</option>
            {INDIA_STATE_PATHS.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({stateStats[s.name] ? stateStats[s.name].projects : 0} projects)
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Only (Overrun Prob &gt; 70%)</option>
            <option value="HIGH">High Risk (55–70%)</option>
            <option value="MEDIUM">Medium Risk (40–55%)</option>
            <option value="LOW">Low Risk (&lt; 40%)</option>
          </select>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All Sectors</option>
            <option value="Water Resources">Water Resources</option>
            <option value="Road Transport">Road Transport</option>
            <option value="Railways">Railways</option>
            <option value="Petroleum & Gas">Petroleum & Gas</option>
            <option value="Power & Renewable">Power & Renewable</option>
            <option value="Urban Development">Urban Development</option>
            <option value="Shipping & Ports">Shipping & Ports</option>
            <option value="Civil Aviation">Civil Aviation</option>
          </select>

          {/* Basemap Tile Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setTileStyle('osm')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                tileStyle === 'osm'
                  ? 'bg-white text-gov-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="OpenStreetMap Standard Light Basemap"
            >
              OSM Light
            </button>
            <button
              onClick={() => setTileStyle('carto')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                tileStyle === 'carto'
                  ? 'bg-white text-gov-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Carto Positron Clean Basemap"
            >
              Clean White
            </button>
          </div>

          {/* Reset Map Button */}
          <button
            onClick={handleResetMap}
            title="Reset Map & Filters"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Real India Light Basemap + State Spatial Profile Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Light OpenStreetMap Leaflet Container */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-2 border border-slate-200 shadow-sm relative">
          <div className="h-[580px] w-full rounded-xl overflow-hidden border border-slate-200 relative bg-white">
            <MapContainer
              center={[22.5, 82.0]}
              zoom={4.8}
              minZoom={4}
              maxZoom={12}
              scrollWheelZoom={true}
              className="w-full h-full"
              attributionControl={true}
            >
              {/* Dynamic Viewport Controller */}
              <MapViewportController selectedState={selectedState} stateStats={stateStats} />

              {/* Light OpenStreetMap Basemap Tiles */}
              {tileStyle === 'osm' ? (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxZoom={19}
                />
              ) : (
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                  maxZoom={19}
                />
              )}

              {/* Real Indian States GeoJSON Boundaries with Dynamic Choropleth */}
              <GeoJSON
                ref={geoJsonRef}
                data={indiaGeoData}
                style={getStateStyle}
                onEachFeature={(feature, layer) => {
                  const rawName = feature.properties.NAME_1 || feature.properties.name;
                  const matchedPath = INDIA_STATE_PATHS.find(
                    (s) => s.rawName === rawName || s.name.toLowerCase() === rawName.toLowerCase()
                  );
                  const stateName = matchedPath ? matchedPath.name : rawName;
                  const stat = stateStats[stateName];

                  layer.on({
                    mouseover: () => {
                      setActiveHoverState(stateName);
                    },
                    mouseout: () => {
                      setActiveHoverState(null);
                    },
                    click: () => {
                      setSelectedState((prev) => (prev === stateName ? 'ALL' : stateName));
                    }
                  });

                  if (stat) {
                    layer.bindTooltip(
                      `<div class="p-1 text-left">
                        <div class="font-bold text-xs">${stateName} (${stat.code})</div>
                        <div class="text-[10px] text-slate-300">Avg Risk: <strong>${stat.avgRisk}</strong> | Projects: <strong>${stat.projects}</strong></div>
                      </div>`,
                      { sticky: true, className: 'leaflet-tooltip' }
                    );
                  }
                }}
              />

              {/* Project Risk Markers (Real Coordinates, High-Contrast Visibility) */}
              {projectMarkers.map((p, idx) => {
                const isCrit = p.riskLevel === 'CRITICAL';
                const isHigh = p.riskLevel === 'HIGH';

                let pinColor = '#10B981'; // Green
                let markerRadius = 6;

                if (isCrit) {
                  pinColor = '#EF4444'; // Red
                  markerRadius = 8;
                } else if (isHigh) {
                  pinColor = '#F97316'; // Orange
                  markerRadius = 7;
                } else if (p.riskLevel === 'MEDIUM') {
                  pinColor = '#F59E0B'; // Yellow/Amber
                  markerRadius = 6;
                }

                return (
                  <CircleMarker
                    key={`marker-${p.projectId}-${idx}`}
                    center={[p.geoLat, p.geoLng]}
                    radius={markerRadius}
                    pathOptions={{
                      color: '#FFFFFF',
                      weight: 2,
                      fillColor: pinColor,
                      fillOpacity: 0.95
                    }}
                    eventHandlers={{
                      click: () => {
                        setDrawerProjectId(p.projectId);
                      }
                    }}
                  >
                    {/* Hover Tooltip */}
                    <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                      <span className="font-mono font-bold">#{p.projectId}</span> - {p.projectName}
                    </Tooltip>

                    {/* Interactive Click Popup */}
                    <Popup className="drishti-map-popup">
                      <div className="p-3.5 bg-white text-slate-900 rounded-xl border border-slate-200 min-w-[240px] space-y-2">
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                          <span className="font-mono text-[11px] font-bold text-gov-700 bg-gov-50 px-1.5 py-0.5 rounded border border-gov-200">
                            #{p.projectId}
                          </span>
                          <RiskBadge level={p.riskLevel} size="xs" showDot={false} />
                        </div>

                        <div>
                          <h5 className="font-bold text-xs text-slate-900 leading-snug">
                            {p.projectName}
                          </h5>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {p.sector} • {p.state}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-slate-500 block">Cost Risk</span>
                            <span className="font-bold text-red-600 font-mono text-xs">
                              {Number(p.costRisk).toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Overall Risk</span>
                            <span className="font-bold text-slate-900 font-mono text-xs">
                              {Number(p.overallRisk).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setDrawerProjectId(p.projectId)}
                          className="w-full mt-1.5 py-1.5 bg-gov-800 hover:bg-gov-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Project Intelligence
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Bottom Floating Legend on Clean White Background */}
            <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-md text-slate-800 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[9px]">
                Project Risk Intensity
              </span>
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm" />
                  <span className="text-slate-700">Critical (&gt;70)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-sm" />
                  <span className="text-slate-700">High (55–70)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm" />
                  <span className="text-slate-700">Medium (40–55)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm" />
                  <span className="text-slate-700">Low (&lt;40)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: State Spatial Profile & Active Projects */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active State Spatial Profile Card */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  State Spatial Profile
                </span>
                <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  {activeStateData.name}
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeStateData.code}
                  </span>
                </h4>
              </div>
              <RiskBadge
                level={getRiskLevel(activeStateData.avgRisk)}
                score={activeStateData.avgRisk}
                size="sm"
              />
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-medium">Total</span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {activeStateData.projects}
                </span>
              </div>
              <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
                <span className="text-[10px] text-red-700 block font-medium">Critical</span>
                <span className="font-mono font-extrabold text-red-700 text-sm">
                  {activeStateData.critical}
                </span>
              </div>
              <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-[10px] text-orange-700 block font-medium">High</span>
                <span className="font-mono font-extrabold text-orange-700 text-sm">
                  {activeStateData.high}
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-emerald-700 block font-medium">Low/Med</span>
                <span className="font-mono font-extrabold text-emerald-700 text-sm">
                  {(activeStateData.med || 0) + (activeStateData.low || 0)}
                </span>
              </div>
            </div>

            {/* Regional Overrun Risk Factors */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <IndianRupee className="w-3.5 h-3.5 text-red-600" />
                  Avg Cost Overrun Risk
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {activeStateData.avgCostRisk}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(activeStateData.avgCostRisk, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Avg Time Overrun Risk
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {activeStateData.avgTimeRisk}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(activeStateData.avgTimeRisk, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filtered Projects in View */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gov-700" />
                Active Projects in View ({filteredMapProjects.length})
              </span>
              {selectedState !== 'ALL' && (
                <button
                  onClick={() => setSelectedState('ALL')}
                  className="text-xs text-gov-700 hover:text-gov-900 font-bold hover:underline"
                >
                  Reset State Filter
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
              {filteredMapProjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No projects match the current state, sector, or risk filters.
                </div>
              ) : (
                filteredMapProjects.slice(0, 8).map((project) => (
                  <div
                    key={project.projectId}
                    onClick={() => {
                      setDrawerProjectId(project.projectId);
                    }}
                    className="p-3 bg-white rounded-lg border border-slate-200 hover:border-gov-700 hover:shadow-sm transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold text-slate-500 group-hover:text-gov-700">
                          #{project.projectId}
                        </span>
                        <RiskBadge level={project.riskLevel} size="xs" showDot={false} />
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 truncate">
                        {project.projectName}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {project.sector} • {project.state}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-mono text-xs font-extrabold text-slate-900 block">
                        {Number(project.overallRisk).toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400">Risk Score</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaRiskMap;

