import React from 'react';
import {
  MapPin,
  AlertOctagon,
  BellRing,
  Route,
  Activity,
  FileCheck,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface KPICardsProps {
  currentLang: LanguageCode;
  totalZones: number;
  criticalZonesCount: number;
  activeAlertsCount: number;
  blockedRoadsCount: number;
  activeSensorsCount: number;
  citizenReportsCount: number;
  pendingReportsCount: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  currentLang,
  totalZones,
  criticalZonesCount,
  activeAlertsCount,
  blockedRoadsCount,
  activeSensorsCount,
  citizenReportsCount,
  pendingReportsCount,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* 1. Monitored Zones */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {t.kpis.monitoredZones}
          </span>
          <div className="p-1 rounded-md bg-blue-500/10 text-blue-400">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white font-mono">{totalZones}</span>
          <span className="text-[11px] text-slate-400 font-medium">8 NER States</span>
        </div>
      </div>

      {/* 2. Critical & High Risk Zones */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-3 flex flex-col justify-between hover:border-rose-700/60 transition-all shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between text-rose-300 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {t.kpis.highRiskZones}
          </span>
          <div className="p-1 rounded-md bg-rose-500/20 text-rose-400 animate-pulse">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-400 font-mono">{criticalZonesCount}</span>
          <span className="text-[11px] text-rose-300/80 font-medium">Immediate Action</span>
        </div>
      </div>

      {/* 3. Active Emergency Alerts */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl p-3 flex flex-col justify-between hover:border-amber-700/60 transition-all shadow-sm">
        <div className="flex items-center justify-between text-amber-300 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {t.kpis.activeAlerts}
          </span>
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
            <BellRing className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-amber-400 font-mono">{activeAlertsCount}</span>
          <span className="text-[11px] text-amber-300/80 font-medium">Live Broadcast</span>
        </div>
      </div>

      {/* 4. Blocked Highways */}
      <div className="bg-slate-900/90 border border-orange-900/40 rounded-xl p-3 flex flex-col justify-between hover:border-orange-700/60 transition-all shadow-sm">
        <div className="flex items-center justify-between text-orange-300 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {t.kpis.blockedRoads}
          </span>
          <div className="p-1 rounded-md bg-orange-500/20 text-orange-400">
            <Route className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-orange-400 font-mono">{blockedRoadsCount}</span>
          <span className="text-[11px] text-orange-300/80 font-medium">NH Corridors</span>
        </div>
      </div>

      {/* 5. Active IoT Sensors */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {t.kpis.activeSensors}
          </span>
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400 font-mono">{activeSensorsCount}</span>
          <span className="text-[11px] text-emerald-400/80 font-medium">100% Online</span>
        </div>
      </div>

      {/* 6. Citizen & Field Reports */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {t.kpis.citizenReports}
          </span>
          <div className="p-1 rounded-md bg-purple-500/10 text-purple-400">
            <FileCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-purple-300 font-mono">{citizenReportsCount}</span>
          <span className="text-[11px] text-amber-400 font-medium">
            {pendingReportsCount} pending verif.
          </span>
        </div>
      </div>
    </div>
  );
};
