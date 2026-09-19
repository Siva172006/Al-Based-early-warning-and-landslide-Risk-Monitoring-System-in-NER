import React, { useState } from 'react';
import {
  History,
  Search,
  Calendar,
  AlertTriangle,
  CloudRain,
  Skull,
  Route,
  Users,
} from 'lucide-react';
import { HistoricalLandslide, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HistoricalLandslidesProps {
  records: HistoricalLandslide[];
  currentLang: LanguageCode;
}

export const HistoricalLandslides: React.FC<HistoricalLandslidesProps> = ({
  records,
  currentLang,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const filtered = records.filter((r) => {
    if (selectedState !== 'ALL' && r.state !== selectedState) return false;
    if (selectedSeverity !== 'ALL' && r.severity !== selectedSeverity) return false;
    if (
      searchTerm &&
      !r.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.district.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !r.geologicalFailureType.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-500" />
              {t.tabs.historicalData}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              GSI / SDMA Historical Archive
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical geotechnical inventory utilized by ML ensemble models to baseline susceptibility thresholds.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search location, failure mode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 w-52"
            />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">All States</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Assam">Assam</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Manipur">Manipur</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Tripura">Tripura</option>
          </select>

          {/* Severity */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CATASTROPHIC">Catastrophic</option>
            <option value="SEVERE">Severe</option>
            <option value="MODERATE">Moderate</option>
          </select>
        </div>
      </div>

      {/* Historical Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-bold text-sm text-white block">
                    {item.title}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.district}, {item.state}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    item.severity === 'CATASTROPHIC'
                      ? 'bg-rose-500 text-white'
                      : item.severity === 'SEVERE'
                      ? 'bg-orange-500 text-slate-950'
                      : 'bg-yellow-500 text-slate-950'
                  }`}
                >
                  {item.severity}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-3">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>{item.date}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <div className="flex items-start gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-200">24h Rain Trigger:</strong> {item.triggerRainfall24h} mm
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-200">Failure Mode:</strong> {item.geologicalFailureType}
                  </span>
                </div>
                {item.roadBlockedDays && item.roadBlockedDays > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Route className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">Road Severed:</strong> {item.roadBlockedDays} days
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" /> {item.affectedPeople.toLocaleString('en-IN')} affected
              </span>
              {item.casualties !== undefined && (
                <span className="text-rose-400 font-bold font-mono flex items-center gap-1">
                  <Skull className="w-3 h-3" /> {item.casualties} casualties
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
