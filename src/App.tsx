import React, { useState, useMemo } from 'react';
import {
  Map,
  ShieldAlert,
  BellRing,
  Sparkles,
  Database,
  History,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  LandslideZone,
  IoTSensor,
  RoadSector,
  CriticalInfra,
  CitizenReport,
  EarlyWarningAlert,
  LanguageCode,
  RiskLevel,
} from './types';
import {
  INITIAL_LANDSLIDE_ZONES,
  INITIAL_IOT_SENSORS,
  INITIAL_ROAD_SECTORS,
  INITIAL_CRITICAL_INFRA,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_EARLY_WARNINGS,
  INITIAL_HISTORICAL_LANDSLIDES,
} from './data/nerData';
import { calculateLandslideRiskScore, computeEmergencyPriorities } from './utils/aiPrediction';
import { TRANSLATIONS } from './utils/translations';
import { Navbar } from './components/Navbar';
import { KPICards } from './components/KPICards';
import { GISMap } from './components/GISMap';
import { EmergencyPriorityMatrix } from './components/EmergencyPriorityMatrix';
import { EarlyWarningSystem } from './components/EarlyWarningSystem';
import { AIImageAnalyzer } from './components/AIImageAnalyzer';
import { DataCollectionTelemetry } from './components/DataCollectionTelemetry';
import { HistoricalLandslides } from './components/HistoricalLandslides';
import { CitizenMobileApp } from './components/CitizenMobileApp';

type NavigationTab =
  | 'GIS_MAP'
  | 'EMERGENCY_MATRIX'
  | 'EARLY_WARNINGS'
  | 'AI_IMAGE_INSPECTOR'
  | 'DATA_COLLECTION'
  | 'HISTORICAL_DATA';

export default function App() {
  // Global App States
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [appMode, setAppMode] = useState<'COMMAND' | 'MOBILE'>('COMMAND');
  const [activeTab, setActiveTab] = useState<NavigationTab>('GIS_MAP');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filters
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<LandslideZone | null>(INITIAL_LANDSLIDE_ZONES[0]);

  // Simulation State: Rainfall Multiplier (1.0 = Normal, 2.0 = Heavy Cloudburst)
  const [rainfallMultiplier, setRainfallMultiplier] = useState<number>(1.0);

  // Real-time Data Collections
  const [zonesBase, setZonesBase] = useState<LandslideZone[]>(INITIAL_LANDSLIDE_ZONES);
  const [sensors] = useState<IoTSensor[]>(INITIAL_IOT_SENSORS);
  const [roads] = useState<RoadSector[]>(INITIAL_ROAD_SECTORS);
  const [criticalInfra] = useState<CriticalInfra[]>(INITIAL_CRITICAL_INFRA);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [offlineQueue, setOfflineQueue] = useState<CitizenReport[]>([]);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(INITIAL_EARLY_WARNINGS);

  const t = TRANSLATIONS[currentLang];

  // Dynamic AI Recalculation based on live rainfall multiplier
  const activeZones = useMemo(() => {
    return zonesBase.map((zone) => {
      const adjustedRf24 = Math.round(zone.rainfall24h * rainfallMultiplier);
      const adjustedRf7d = Math.round(zone.rainfall7d * rainfallMultiplier);
      const adjustedMoisture = Math.min(98, Math.round(zone.soilMoisture * (1 + (rainfallMultiplier - 1) * 0.3)));

      const { riskScore, probability, riskLevel } = calculateLandslideRiskScore({
        rainfall24h: adjustedRf24,
        rainfall7d: adjustedRf7d,
        rainfallAnomaly: zone.rainfallAnomaly,
        soilMoisture: adjustedMoisture,
        slopeAngle: zone.slopeAngle,
        drainageDensity: zone.drainageDensity,
      });

      return {
        ...zone,
        rainfall24h: adjustedRf24,
        rainfall7d: adjustedRf7d,
        soilMoisture: adjustedMoisture,
        riskScore,
        probability,
        currentRisk: riskLevel,
      };
    });
  }, [zonesBase, rainfallMultiplier]);

  // Blocked road zones set
  const blockedRoadZoneIds = useMemo(() => {
    return new Set(
      roads
        .filter((r) => r.status !== 'CLEAR' && r.connectedZoneId)
        .map((r) => r.connectedZoneId as string)
    );
  }, [roads]);

  // Dynamic Emergency Response Priorities
  const emergencyPriorities = useMemo(() => {
    return computeEmergencyPriorities(activeZones, blockedRoadZoneIds);
  }, [activeZones, blockedRoadZoneIds]);

  // Real-time KPI Counts
  const criticalCount = useMemo(() => {
    return activeZones.filter((z) => z.currentRisk === 'CRITICAL' || z.currentRisk === 'HIGH').length;
  }, [activeZones]);

  const blockedRoadsCount = useMemo(() => {
    return roads.filter((r) => r.status !== 'CLEAR').length;
  }, [roads]);

  const pendingReportsCount = useMemo(() => {
    return reports.filter((r) => r.status === 'PENDING_VERIFICATION').length;
  }, [reports]);

  // Handlers
  const handleAddReport = (report: CitizenReport) => {
    if (isOffline) {
      setOfflineQueue((prev) => [report, ...prev]);
    } else {
      setReports((prev) => [report, ...prev]);
    }
  };

  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);
    setTimeout(() => {
      setReports((prev) => [...offlineQueue, ...prev]);
      setOfflineQueue([]);
      setIsSyncing(false);
    }, 1200);
  };

  const handleVerifyReport = (reportId: string, status: 'CONFIRMED' | 'REJECTED') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status } : r))
    );
  };

  const handleDispatchAlert = (newAlert: EarlyWarningAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleConfirmIncidentFromAI = (reportData: any) => {
    const confirmedReport: CitizenReport = {
      id: `rep-ai-${Date.now()}`,
      timestamp: 'Just now',
      reporterName: 'AI Vision & Geotechnical Inspector',
      contactPhone: 'EOC Direct API',
      locationName: reportData.location,
      lat: 27.29 + (Math.random() - 0.5) * 0.05,
      lng: 88.59 + (Math.random() - 0.5) * 0.05,
      reportType: 'SLOPE_MOVEMENT',
      severity: reportData.risk,
      description: reportData.summary,
      status: 'CONFIRMED',
    };
    setReports((prev) => [confirmedReport, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        appMode={appMode}
        onModeChange={setAppMode}
        activeAlertCount={alerts.length}
        offlineQueueCount={offlineQueue.length}
        onManualSync={handleSyncOfflineQueue}
        isSyncing={isSyncing}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6">
        {/* Realistic Project Disclaimer / Principle Reminder */}
        <div className="mb-3 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3.5 py-2 text-[11px] text-slate-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Scientific Notice:</strong> Landslide prediction models estimate continuous geotechnical hazard susceptibility and identify high-risk sectors across NER colluvium to enable timely preventive response; exact micro-temporal collapse seconds are stochastic.
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-slate-500 shrink-0">
            ISRO-NESAC &bull; GSI &bull; NDMA
          </span>
        </div>

        {appMode === 'MOBILE' ? (
          /* Mobile Citizen & Field Officer Simulation View */
          <CitizenMobileApp
            currentLang={currentLang}
            isOffline={isOffline}
            onToggleOffline={() => setIsOffline(!isOffline)}
            zones={activeZones}
            roads={roads}
            reports={reports}
            offlineQueue={offlineQueue}
            onAddReport={handleAddReport}
            onSyncOfflineQueue={handleSyncOfflineQueue}
            isSyncing={isSyncing}
            onVerifyReport={handleVerifyReport}
          />
        ) : (
          /* Authority Command Center Full Experience */
          <div>
            {/* Real-time KPI Counters */}
            <KPICards
              currentLang={currentLang}
              totalZones={activeZones.length}
              criticalZonesCount={criticalCount}
              activeAlertsCount={alerts.length}
              blockedRoadsCount={blockedRoadsCount}
              activeSensorsCount={sensors.length}
              citizenReportsCount={reports.length}
              pendingReportsCount={pendingReportsCount}
            />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin border-b border-slate-800">
              <button
                onClick={() => setActiveTab('GIS_MAP')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'GIS_MAP'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>{t.tabs.gisMap}</span>
              </button>

              <button
                onClick={() => setActiveTab('EMERGENCY_MATRIX')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'EMERGENCY_MATRIX'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>{t.tabs.emergencyMatrix}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                  {emergencyPriorities.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('EARLY_WARNINGS')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'EARLY_WARNINGS'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>{t.tabs.earlyWarnings}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                  {alerts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('AI_IMAGE_INSPECTOR')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'AI_IMAGE_INSPECTOR'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.tabs.aiImageInspector}</span>
              </button>

              <button
                onClick={() => setActiveTab('DATA_COLLECTION')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'DATA_COLLECTION'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.tabs.dataCollection}</span>
              </button>

              <button
                onClick={() => setActiveTab('HISTORICAL_DATA')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'HISTORICAL_DATA'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{t.tabs.historicalData}</span>
              </button>
            </div>

            {/* TAB CONTENT PANELS */}
            {activeTab === 'GIS_MAP' && (
              <div className="space-y-4">
                <GISMap
                  zones={activeZones}
                  sensors={sensors}
                  roads={roads}
                  criticalInfra={criticalInfra}
                  reports={reports}
                  selectedZone={selectedZone}
                  onSelectZone={(z) => setSelectedZone(z)}
                  selectedState={selectedState}
                  onSelectState={setSelectedState}
                  selectedRisk={selectedRisk}
                  onSelectRisk={setSelectedRisk}
                  currentLang={currentLang}
                />

                {/* Bottom Inspector for Selected Zone */}
                {selectedZone && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-white">
                            {selectedZone.name}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              selectedZone.currentRisk === 'CRITICAL'
                                ? 'bg-rose-500 text-white'
                                : selectedZone.currentRisk === 'HIGH'
                                ? 'bg-orange-500 text-slate-950 font-bold'
                                : 'bg-yellow-500 text-slate-950 font-bold'
                            }`}
                          >
                            {selectedZone.currentRisk} RISK
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {selectedZone.district}, {selectedZone.state} &bull; Terrain: {selectedZone.terrainType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Failure Probability:</span>
                          <span className="text-rose-400 font-bold text-sm">
                            {selectedZone.probability}%
                          </span>
                        </div>
                        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Pop. Exposed:</span>
                          <span className="text-slate-200 font-bold text-sm">
                            {selectedZone.populationAtRisk.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px] uppercase">24h Rainfall</span>
                        <span className="font-mono text-cyan-400 font-bold text-sm">
                          {selectedZone.rainfall24h} mm
                        </span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px] uppercase">Soil Saturation</span>
                        <span className="font-mono text-blue-400 font-bold text-sm">
                          {selectedZone.soilMoisture}%
                        </span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px] uppercase">Slope Gradient</span>
                        <span className="font-mono text-amber-400 font-bold text-sm">
                          {selectedZone.slopeAngle}° ({selectedZone.aspect})
                        </span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px] uppercase">Road Connectivity</span>
                        <span className="font-mono text-orange-400 font-bold text-xs">
                          {selectedZone.roadConnectivityIndex.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                      <span className="text-slate-300">
                        <strong className="text-amber-400">Designated Evacuation Corridor:</strong>{' '}
                        {selectedZone.evacuationRoute}
                      </span>
                      <button
                        onClick={() => setActiveTab('EARLY_WARNINGS')}
                        className="py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                      >
                        Draft Warning Bulletin &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'EMERGENCY_MATRIX' && (
              <EmergencyPriorityMatrix
                priorities={emergencyPriorities}
                zones={activeZones}
                onSelectZone={(zone) => {
                  setSelectedZone(zone);
                  setActiveTab('GIS_MAP');
                }}
                currentLang={currentLang}
              />
            )}

            {activeTab === 'EARLY_WARNINGS' && (
              <EarlyWarningSystem
                alerts={alerts}
                zones={activeZones}
                currentLang={currentLang}
                onDispatchAlert={handleDispatchAlert}
              />
            )}

            {activeTab === 'AI_IMAGE_INSPECTOR' && (
              <AIImageAnalyzer
                currentLang={currentLang}
                onConfirmIncidentToGIS={handleConfirmIncidentFromAI}
              />
            )}

            {activeTab === 'DATA_COLLECTION' && (
              <DataCollectionTelemetry
                zones={activeZones}
                sensors={sensors}
                currentLang={currentLang}
                onSimulateRainfallIncrease={setRainfallMultiplier}
                rainfallMultiplier={rainfallMultiplier}
              />
            )}

            {activeTab === 'HISTORICAL_DATA' && (
              <HistoricalLandslides
                records={INITIAL_HISTORICAL_LANDSLIDES}
                currentLang={currentLang}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            NER Landslide Early Warning System (NER-LEWS) &bull; Designed for North Eastern Region of India (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura)
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            v2.4 &bull; Powered by Gemini 3.8 & Geotechnical GIS
          </span>
        </div>
      </footer>
    </div>
  );
}
