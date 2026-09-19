import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Map as MapIcon,
  Maximize2,
  Filter,
  Eye,
  EyeOff,
  Navigation,
  Activity,
  Route,
  Building,
  AlertTriangle,
} from 'lucide-react';
import {
  LandslideZone,
  IoTSensor,
  RoadSector,
  CriticalInfra,
  CitizenReport,
  RiskLevel,
  StateNER,
  LanguageCode,
} from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface GISMapProps {
  zones: LandslideZone[];
  sensors: IoTSensor[];
  roads: RoadSector[];
  criticalInfra: CriticalInfra[];
  reports: CitizenReport[];
  selectedZone: LandslideZone | null;
  onSelectZone: (zone: LandslideZone) => void;
  selectedState: string;
  onSelectState: (state: string) => void;
  selectedRisk: string;
  onSelectRisk: (risk: string) => void;
  currentLang: LanguageCode;
  onTriggerAlertForZone?: (zone: LandslideZone) => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  zones,
  sensors,
  roads,
  criticalInfra,
  reports,
  selectedZone,
  onSelectZone,
  selectedState,
  onSelectState,
  selectedRisk,
  onSelectRisk,
  currentLang,
  onTriggerAlertForZone,
}) => {
  const t = TRANSLATIONS[currentLang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Basemap & Layer Toggles
  const [basemap, setBasemap] = useState<'DARK' | 'TOPO' | 'SATELLITE'>('DARK');
  const [showSensors, setShowSensors] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showInfra, setShowInfra] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered on North Eastern Region of India (approx latitude 26.0, longitude 92.5)
    const map = L.map(mapContainerRef.current, {
      center: [26.0, 92.5],
      zoom: 7,
      minZoom: 6,
      maxZoom: 17,
      attributionControl: false,
    });

    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<span class="text-[10px] text-slate-500">NER-LEWS GIS &bull; OpenStreetMap / ISRO / Sentinel</span>',
      })
      .addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update Basemap Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Find and remove old tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let maxZoom = 19;

    if (basemap === 'TOPO') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      maxZoom = 17;
    } else if (basemap === 'SATELLITE') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 18;
    }

    L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
  }, [basemap]);

  // 3. Render Vector GIS Layers (Zones, Sensors, Highways, Infra, Reports)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Filter zones
    const filteredZones = zones.filter((z) => {
      if (selectedState && selectedState !== 'ALL' && z.state !== selectedState) return false;
      if (selectedRisk && selectedRisk !== 'ALL' && z.currentRisk !== selectedRisk) return false;
      return true;
    });

    // Helper for risk colors
    const getRiskColor = (level: RiskLevel) => {
      switch (level) {
        case 'CRITICAL':
          return '#f43f5e'; // Rose-500
        case 'HIGH':
          return '#f97316'; // Orange-500
        case 'MODERATE':
          return '#eab308'; // Yellow-500
        case 'LOW':
        default:
          return '#10b981'; // Emerald-500
      }
    };

    // A. Render Landslide Zones
    filteredZones.forEach((zone) => {
      const color = getRiskColor(zone.currentRisk);

      // Polygon boundary
      if (zone.polygon && zone.polygon.length > 2) {
        const poly = L.polygon(zone.polygon, {
          color: color,
          weight: selectedZone?.id === zone.id ? 3 : 1.5,
          fillColor: color,
          fillOpacity: showHeatmap ? 0.28 : 0.08,
          dashArray: selectedZone?.id === zone.id ? undefined : '4, 4',
        });

        poly.on('click', () => onSelectZone(zone));
        layerGroup.addLayer(poly);
      }

      // Center Pulsating Circle Marker
      const circleMarker = L.circleMarker([zone.lat, zone.lng], {
        radius: zone.currentRisk === 'CRITICAL' ? 14 : zone.currentRisk === 'HIGH' ? 11 : 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.85,
      });

      const popupHtml = `
        <div class="p-1 min-w-[240px]">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
            <span class="font-bold text-sm text-white">${zone.name}</span>
            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
              zone.currentRisk === 'CRITICAL'
                ? 'bg-rose-500 text-white'
                : zone.currentRisk === 'HIGH'
                ? 'bg-orange-500 text-slate-950'
                : 'bg-yellow-500 text-slate-950'
            }">${zone.currentRisk}</span>
          </div>
          <div class="text-xs text-slate-300 space-y-1 mb-2.5">
            <div class="flex justify-between">
              <span class="text-slate-400">State / District:</span>
              <span class="font-medium text-white">${zone.district}, ${zone.state}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Failure Probability:</span>
              <span class="font-mono font-bold ${zone.probability > 75 ? 'text-rose-400' : 'text-amber-400'}">${zone.probability}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">24h Rainfall:</span>
              <span class="font-mono text-white font-medium">${zone.rainfall24h} mm</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Soil Moisture:</span>
              <span class="font-mono text-white font-medium">${zone.soilMoisture}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Slope Gradient:</span>
              <span class="font-mono text-white font-medium">${zone.slopeAngle}° (${zone.aspect})</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Population at Risk:</span>
              <span class="font-mono text-white">${zone.populationAtRisk.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button id="btn-inspect-zone-${zone.id}" class="w-full py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors text-center">
            Inspect Zone Telemetry
          </button>
        </div>
      `;

      circleMarker.bindPopup(popupHtml);
      circleMarker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-inspect-zone-${zone.id}`);
          if (btn) {
            btn.onclick = () => onSelectZone(zone);
          }
        }, 100);
      });

      circleMarker.on('click', () => onSelectZone(zone));
      layerGroup.addLayer(circleMarker);
    });

    // B. Render Road Corridors & Blockages
    if (showRoads) {
      roads.forEach((road) => {
        const isBlocked = road.status === 'CRITICALLY_BLOCKED';
        const isPartial = road.status === 'PARTIALLY_BLOCKED';
        const roadColor = isBlocked ? '#ef4444' : isPartial ? '#f59e0b' : '#38bdf8';

        const polyline = L.polyline(road.coords, {
          color: roadColor,
          weight: isBlocked ? 5 : 3.5,
          opacity: 0.9,
          dashArray: isBlocked ? '6, 6' : undefined,
        });

        polyline.bindPopup(`
          <div class="p-1 min-w-[220px]">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1 mb-1.5">
              <span class="font-bold text-xs text-white">${road.code}: ${road.name}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isBlocked ? 'bg-rose-500/20 text-rose-300' : isPartial ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }">${road.status.replace('_', ' ')}</span>
            </div>
            ${road.cause ? `<p class="text-xs text-rose-300 mb-1.5 font-medium">${road.cause}</p>` : ''}
            ${road.detourRoute ? `<p class="text-[11px] text-slate-300 bg-slate-800 p-1.5 rounded"><strong class="text-amber-400">Detour:</strong> ${road.detourRoute}</p>` : ''}
            ${road.clearingProgress ? `
              <div class="mt-2 text-[11px] text-slate-400">
                <div class="flex justify-between mb-1">
                  <span>Clearing Progress:</span>
                  <span class="font-mono text-white">${road.clearingProgress}%</span>
                </div>
                <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-amber-500 h-full" style="width: ${road.clearingProgress}%"></div>
                </div>
              </div>
            ` : ''}
          </div>
        `);

        layerGroup.addLayer(polyline);
      });
    }

    // C. Render IoT Sensors
    if (showSensors) {
      sensors.forEach((sensor) => {
        const isAlert = sensor.status === 'ALERT';
        const isWarning = sensor.status === 'WARNING';
        const sensorColor = isAlert ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';

        const sensorIcon = L.divIcon({
          className: 'custom-sensor-icon',
          html: `
            <div style="
              background: ${sensorColor};
              width: 18px;
              height: 18px;
              border-radius: 4px;
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 8px ${sensorColor};
            ">
              <span style="font-size: 9px; font-weight: bold; color: #000;">S</span>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon: sensorIcon });
        marker.bindPopup(`
          <div class="p-1 min-w-[200px]">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1 mb-1.5">
              <span class="font-bold text-xs text-white">${sensor.code}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isAlert ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200'
              }">${sensor.status}</span>
            </div>
            <p class="text-xs text-slate-300 font-medium mb-1">${sensor.name}</p>
            <div class="bg-slate-800/80 p-2 rounded text-xs space-y-1 mb-2 font-mono">
              <div class="flex justify-between">
                <span class="text-slate-400">Type:</span>
                <span class="text-slate-200">${sensor.type.replace('_', ' ')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Value:</span>
                <span class="text-amber-400 font-bold">${sensor.value} ${sensor.unit}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Battery:</span>
                <span class="text-emerald-400">${sensor.batteryPercent}%</span>
              </div>
            </div>
            <span class="text-[10px] text-slate-400">Updated: ${sensor.lastUpdated}</span>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // D. Render Critical Infrastructure
    if (showInfra) {
      criticalInfra.forEach((infra) => {
        const isThreatened = infra.status === 'THREATENED';
        const infraIcon = L.divIcon({
          className: 'custom-infra-icon',
          html: `
            <div style="
              background: ${isThreatened ? '#dc2626' : '#2563eb'};
              width: 18px;
              height: 18px;
              border-radius: 50%;
              border: 1.5px solid #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="font-size: 8px; font-weight: bold; color: #fff;">${infra.type[0]}</span>
            </div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker([infra.lat, infra.lng], { icon: infraIcon });
        marker.bindPopup(`
          <div class="p-1 min-w-[190px]">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1 mb-1">
              <span class="font-bold text-xs text-white">${infra.name}</span>
            </div>
            <p class="text-xs text-slate-300">${infra.type} &bull; ${infra.district}, ${infra.state}</p>
            <p class="text-xs mt-1 font-semibold ${isThreatened ? 'text-rose-400' : 'text-emerald-400'}">
              Status: ${infra.status}
            </p>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }

    // E. Render Citizen Reports
    if (showReports) {
      reports.forEach((rep) => {
        const isConfirmed = rep.status === 'CONFIRMED';
        const repIcon = L.divIcon({
          className: 'custom-rep-icon',
          html: `
            <div style="
              background: ${isConfirmed ? '#ef4444' : '#a855f7'};
              width: 16px;
              height: 16px;
              transform: rotate(45deg);
              border: 1.5px solid #ffffff;
              box-shadow: 0 0 6px rgba(0,0,0,0.5);
            "></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: repIcon });
        marker.bindPopup(`
          <div class="p-1 min-w-[210px]">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1 mb-1.5">
              <span class="font-bold text-xs text-white">${rep.reportType.replace('_', ' ')}</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isConfirmed ? 'bg-rose-500/20 text-rose-300' : 'bg-purple-500/20 text-purple-300'
              }">${rep.status.replace('_', ' ')}</span>
            </div>
            <p class="text-xs text-slate-300 mb-1">${rep.locationName}</p>
            <p class="text-xs text-slate-400 italic mb-2">"${rep.description}"</p>
            <div class="text-[10px] text-slate-400 flex justify-between">
              <span>Reported by: ${rep.reporterName}</span>
              <span>${rep.timestamp}</span>
            </div>
          </div>
        `);
        layerGroup.addLayer(marker);
      });
    }
  }, [
    zones,
    sensors,
    roads,
    criticalInfra,
    reports,
    selectedZone,
    selectedState,
    selectedRisk,
    showSensors,
    showRoads,
    showInfra,
    showReports,
    showHeatmap,
  ]);

  // Center on selected zone if changed
  useEffect(() => {
    if (selectedZone && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedZone.lat, selectedZone.lng], 10, {
        animate: true,
      });
    }
  }, [selectedZone]);

  // Reset view to all NER
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([26.0, 92.5], 7, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[580px] lg:h-[640px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl flex flex-col">
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* State & Risk Filters */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => onSelectState(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">{t.filters.allStates}</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Assam">Assam</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Manipur">Manipur</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Tripura">Tripura</option>
          </select>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => onSelectRisk(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">{t.filters.allRiskLevels}</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          <button
            onClick={handleResetView}
            title="Fit view to entire NER"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Basemap Switcher & Layer Controls */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          {/* Basemap toggle */}
          <div className="flex bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setBasemap('DARK')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                basemap === 'DARK' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Dark GIS
            </button>
            <button
              onClick={() => setBasemap('TOPO')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                basemap === 'TOPO' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Topography
            </button>
            <button
              onClick={() => setBasemap('SATELLITE')}
              className={`px-2 py-1 text-[11px] font-semibold rounded ${
                basemap === 'SATELLITE' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Actual Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Bottom Floating GIS Layer Toggles & Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-wrap items-end justify-between gap-3 pointer-events-none">
        {/* Layer Toggles */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 shadow-xl flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Layers:
          </span>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showSensors}
              onChange={(e) => setShowSensors(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sensors ({sensors.length})</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showRoads}
              onChange={(e) => setShowRoads(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <Route className="w-3.5 h-3.5 text-orange-400" />
            <span>Highways ({roads.length})</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showInfra}
              onChange={(e) => setShowInfra(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <Building className="w-3.5 h-3.5 text-blue-400" />
            <span>Hospitals & Bridges ({criticalInfra.length})</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showReports}
              onChange={(e) => setShowReports(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            <span>Field Reports ({reports.length})</span>
          </label>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span>Risk Polygons</span>
          </label>
        </div>

        {/* Legend */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 shadow-xl hidden md:flex items-center gap-3 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Risk Level:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-400 font-semibold">Critical (&gt;80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span className="text-orange-400 font-semibold">High (65-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
            <span className="text-yellow-400 font-semibold">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-semibold">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};
