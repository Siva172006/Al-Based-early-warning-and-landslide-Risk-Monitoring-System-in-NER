import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Building,
  Route,
  Activity,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { EmergencyPriorityItem, LandslideZone, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface EmergencyPriorityMatrixProps {
  priorities: EmergencyPriorityItem[];
  zones: LandslideZone[];
  onSelectZone: (zone: LandslideZone) => void;
  currentLang: LanguageCode;
}

export const EmergencyPriorityMatrix: React.FC<EmergencyPriorityMatrixProps> = ({
  priorities,
  zones,
  onSelectZone,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [deployedUnits, setDeployedUnits] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'RANKED' | 'FORMULA'>('RANKED');

  const handleDeploy = (zoneId: string) => {
    setDeployedUnits((prev) => ({
      ...prev,
      [zoneId]: true,
    }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
      {/* Header with Title & Formula Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              {t.tabs.emergencyMatrix}
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/30">
              Automated Decision Support
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Algorithmic dispatch prioritization synthesizing hazard probability, population vulnerability, arterial road cutoff, and lifeline facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveTab('RANKED')}
              className={`px-3 py-1 font-semibold rounded ${
                activeTab === 'RANKED' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Priority Action Queue
            </button>
            <button
              onClick={() => setActiveTab('FORMULA')}
              className={`px-3 py-1 font-semibold rounded ${
                activeTab === 'FORMULA' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Weighting Logic & Formula
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'FORMULA' ? (
        /* Mathematical Formula Explanation */
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 mb-4 text-xs text-slate-300 space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg font-mono text-amber-300 text-sm">
            Emergency Priority Score = (Risk Probability &times; 30%) + (Population Exposure &times; 25%) +
            (Critical Infrastructure &times; 20%) + (Road Connectivity & Isolation &times; 15%) + (Incident Severity &times; 10%)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> 1. Hazard Risk (30%)
              </div>
              <p className="text-[11px] text-slate-400">
                Composite of 24h & 7d rainfall thresholds, pore pressure, and IoT slope angular displacement.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> 2. Exposure (25%)
              </div>
              <p className="text-[11px] text-slate-400">
                Census population residing in vulnerable slope footings and downhill mudflow drainage chutes.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> 3. Infrastructure (20%)
              </div>
              <p className="text-[11px] text-slate-400">
                District hospitals, blood banks, power substations, and critical river bridge approaches.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="font-bold text-orange-400 mb-1 flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5" /> 4. Isolation (15%)
              </div>
              <p className="text-[11px] text-slate-400">
                Penalizes sectors where single-access National Highway cuts completely sever regional rescue routes.
              </p>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> 5. Severity (10%)
              </div>
              <p className="text-[11px] text-slate-400">
                Live field-verified structural cracks, toe bulging, or ongoing debris slides reported.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Prioritization Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-3">Priority Rank</th>
              <th className="py-2.5 px-3">Target Location & State</th>
              <th className="py-2.5 px-3">Composite Score</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Factor Contributions</th>
              <th className="py-2.5 px-3">Direct Action Required</th>
              <th className="py-2.5 px-3 text-right">Deployment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {priorities.map((item, index) => {
              const matchedZone = zones.find((z) => z.id === item.zoneId);
              const isDeployed = deployedUnits[item.zoneId];

              return (
                <tr
                  key={item.zoneId}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-mono font-black text-xs ${
                        index === 0
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-1 ring-rose-400'
                          : index === 1
                          ? 'bg-orange-500 text-slate-950 font-bold'
                          : index === 2
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </td>

                  {/* Location & State */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() => matchedZone && onSelectZone(matchedZone)}
                      className="text-left group-hover:text-amber-400 transition-colors"
                    >
                      <span className="font-bold text-sm text-white block">
                        {item.zoneName}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        {item.district}, {item.state}
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </span>
                    </button>
                  </td>

                  {/* Composite Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span
                        className={`text-base font-black font-mono ${
                          item.compositeScore >= 80
                            ? 'text-rose-400'
                            : item.compositeScore >= 60
                            ? 'text-orange-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {item.compositeScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
                    </div>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          item.compositeScore >= 80
                            ? 'bg-rose-500'
                            : item.compositeScore >= 60
                            ? 'bg-orange-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.compositeScore}%` }}
                      />
                    </div>
                  </td>

                  {/* Breakdown pill tags */}
                  <td className="py-3 px-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-[10px] text-rose-300 font-mono">
                        Risk: {item.riskContribution}/30
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-[10px] text-blue-300 font-mono">
                        Pop: {item.populationContribution}/25
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-[10px] text-purple-300 font-mono">
                        Infra: {item.infrastructureContribution}/20
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-orange-950/60 border border-orange-800/40 text-[10px] text-orange-300 font-mono">
                        Road: {item.isolationContribution}/15
                      </span>
                    </div>
                  </td>

                  {/* Recommended Action & Units */}
                  <td className="py-3 px-3 max-w-xs">
                    <p className="font-medium text-slate-200 text-xs mb-1">
                      {item.actionRequired}
                    </p>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1">
                      {item.recommendedUnits.map((unit, i) => (
                        <span key={i} className="text-slate-300 bg-slate-800/80 px-1.5 py-0.2 rounded">
                          &bull; {unit}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Dispatch Button */}
                  <td className="py-3 px-3 text-right">
                    {isDeployed ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/50 border border-emerald-700/50 px-2.5 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Dispatched
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeploy(item.zoneId)}
                        className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-md shadow-rose-600/20 active:scale-95"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Mobilise Units
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
