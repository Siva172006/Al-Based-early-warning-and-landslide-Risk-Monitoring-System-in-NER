import React, { useState } from 'react';
import {
  CloudRain,
  Activity,
  Mountain,
  Satellite,
  Database,
  Sliders,
  TrendingUp,
  RefreshCw,
  Droplets,
  Layers,
} from 'lucide-react';
import { LandslideZone, IoTSensor, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface DataCollectionTelemetryProps {
  zones: LandslideZone[];
  sensors: IoTSensor[];
  currentLang: LanguageCode;
  onSimulateRainfallIncrease: (factor: number) => void;
  rainfallMultiplier: number;
}

export const DataCollectionTelemetry: React.FC<DataCollectionTelemetryProps> = ({
  zones,
  sensors,
  currentLang,
  onSimulateRainfallIncrease,
  rainfallMultiplier,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || '');
  const zone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const zoneSensors = sensors.filter((s) => s.zoneId === zone?.id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Scenario Simulation Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              {t.tabs.dataCollection}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Multi-Source Ingestion Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization across IMD Weather Radar, IoT capacitive moisture probes, Digital Elevation Models (DEM), and Sentinel-1/2 remote sensing.
          </p>
        </div>

        {/* Live Simulation Slider for Monsoon Surge */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-xs">
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Simulate Extreme Rainfall Surge:</span>
              <span className="font-mono text-amber-400 font-bold ml-2">
                +{Math.round((rainfallMultiplier - 1) * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={2.5}
                step={0.1}
                value={rainfallMultiplier}
                onChange={(e) => onSimulateRainfallIncrease(Number(e.target.value))}
                className="w-36 sm:w-48 accent-amber-500 cursor-pointer"
              />
              <button
                onClick={() => onSimulateRainfallIncrease(1)}
                className="text-[10px] text-slate-400 hover:text-white underline ml-1"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Zone Selector */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <span className="text-xs font-semibold text-slate-300">Select Monitored Sector:</span>
        <select
          value={selectedZoneId}
          onChange={(e) => setSelectedZoneId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name} ({z.district}, {z.state}) &bull; Risk: {z.currentRisk}
            </option>
          ))}
        </select>
      </div>

      {/* 4 Multi-Source Data Ingestion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Rainfall Telemetry (IMD & Rain Gauges) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              A. Rainfall Dynamics (IMD)
            </span>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
              Live AWS
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">24-Hour Cumulative:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {Math.round(zone.rainfall24h * rainfallMultiplier)} mm
              </span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">7-Day Cumulative:</span>
              <span className="font-mono text-cyan-300 font-bold">
                {Math.round(zone.rainfall7d * rainfallMultiplier)} mm
              </span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Precipitation Anomaly:</span>
              <span className="font-mono text-rose-400 font-bold">
                +{zone.rainfallAnomaly}% vs normal
              </span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Forecast (Next 24h):</span>
              <span className="font-mono text-amber-400 font-bold">
                {zone.shortTermForecast.predictedRainfall24h} mm expected
              </span>
            </div>
          </div>
        </div>

        {/* 2. Soil Moisture & Pore Pressure (IoT Sensors) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              B. IoT Soil Moisture Nodes
            </span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">
              Capacitive Probe
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Volumetric Saturation:</span>
              <span className="font-mono text-blue-400 font-bold">{zone.soilMoisture}%</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Saturation Duration:</span>
              <span className="font-mono text-slate-200 font-medium">48h continuous &gt;75%</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Pore Pressure Trend:</span>
              <span className="font-mono text-rose-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Rising (+4.2 kPa/hr)
              </span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Active IoT Nodes in Zone:</span>
              <span className="font-mono text-emerald-400 font-bold">{zoneSensors.length} active</span>
            </div>
          </div>
        </div>

        {/* 3. Terrain & Slope (DEM GIS Data) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-amber-400" />
              C. Terrain & DEM Geometry
            </span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono">
              30m SRTM
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Slope Gradient:</span>
              <span className="font-mono text-amber-400 font-bold">{zone.slopeAngle}° (Very Steep)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Elevation (AMSL):</span>
              <span className="font-mono text-slate-200 font-medium">{zone.elevation} m</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Aspect Orientation:</span>
              <span className="font-mono text-slate-200 font-medium">{zone.aspect}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Drainage Density:</span>
              <span className="font-mono text-slate-200 font-medium">{zone.drainageDensity}</span>
            </div>
          </div>
        </div>

        {/* 4. Satellite Imagery (Sentinel & ISRO) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <Satellite className="w-4 h-4 text-purple-400" />
              D. Remote Sensing Radar & NDVI
            </span>
            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-mono">
              Sentinel-1/2
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">InSAR Surface Displacement:</span>
              <span className="font-mono text-rose-400 font-bold">-18.4 mm/week</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">NDVI Vegetation Change:</span>
              <span className="font-mono text-amber-400 font-bold">-0.32 (Scar exposed)</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Land Cover Disturbance:</span>
              <span className="font-mono text-slate-200 font-medium">Hill Cutting / Roadworks</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400">Last Orbital Overpass:</span>
              <span className="font-mono text-slate-400">Yesterday 18:40 UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* IoT Sensors Live Readings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Zone Sensor Telemetry Grid ({zoneSensors.length} Nodes in {zone.name})
            </span>
            <span className="text-xs text-slate-400">
              MQTT / LoRaWAN edge gateway reporting at 60-second intervals
            </span>
          </div>
        </div>

        {zoneSensors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {zoneSensors.map((s) => (
              <div
                key={s.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold text-xs text-white block">{s.code}</span>
                    <span className="text-[11px] text-slate-400">{s.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      s.status === 'ALERT'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : s.status === 'WARNING'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Reading:</span>
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      {s.value} {s.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Battery:</span>
                    <span className="font-mono text-emerald-400 font-bold">{s.batteryPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No dedicated IoT sensors deployed in this specific polygon. Surveillance relies on IMD radar grid and satellite InSAR telemetry.
          </div>
        )}
      </div>
    </div>
  );
};
