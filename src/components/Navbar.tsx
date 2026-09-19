import React from 'react';
import {
  AlertTriangle,
  Radio,
  Wifi,
  WifiOff,
  Smartphone,
  ShieldAlert,
  Languages,
  Clock,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  appMode: 'COMMAND' | 'MOBILE';
  onModeChange: (mode: 'COMMAND' | 'MOBILE') => void;
  activeAlertCount: number;
  offlineQueueCount: number;
  onManualSync: () => void;
  isSyncing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  isOffline,
  onToggleOffline,
  appMode,
  onModeChange,
  activeAlertCount,
  offlineQueueCount,
  onManualSync,
  isSyncing,
}) => {
  const t = TRANSLATIONS[currentLang];
  const currentTime = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Platform Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white sm:text-lg">
                NER-LEWS
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                AI Early Warning
              </span>
              <span className="hidden md:inline-block text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                NER 8 States
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Mode Selector & Status Indicators */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Emergency Hotlines Quick Call Button */}
          <div className="hidden lg:flex items-center gap-1.5 bg-rose-950/40 border border-rose-600/40 px-2.5 py-1 rounded-lg text-xs">
            <Phone className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider">Hotlines:</span>
            <a
              href="tel:9080684668"
              className="font-mono text-[11px] text-rose-200 hover:text-white font-bold underline decoration-rose-500/50 hover:decoration-white"
            >
              9080684668
            </a>
            <span className="text-slate-500 text-xs">|</span>
            <a
              href="tel:9787537821"
              className="font-mono text-[11px] text-rose-200 hover:text-white font-bold underline decoration-rose-500/50 hover:decoration-white"
            >
              9787537821
            </a>
          </div>
          {/* Role / View Mode Switcher */}
          <div className="flex rounded-lg bg-slate-800/90 p-1 border border-slate-700/80">
            <button
              onClick={() => onModeChange('COMMAND')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                appMode === 'COMMAND'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{t.commandCenter}</span>
            </button>
            <button
              onClick={() => onModeChange('MOBILE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                appMode === 'MOBILE'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.mobileFieldApp}</span>
              {offlineQueueCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono">
                  {offlineQueueCount}
                </span>
              )}
            </button>
          </div>

          {/* Network Mode (Offline simulation toggle) */}
          <button
            onClick={onToggleOffline}
            title={isOffline ? 'Switch to Online Live mode' : 'Simulate Low-Bandwidth / Remote Offline mode'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isOffline
                ? 'bg-rose-950/40 border-rose-600/40 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-600/30 text-emerald-300'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden md:inline font-mono text-[11px]">{t.offline}</span>
                <span className="md:hidden">Offline</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline font-mono text-[11px]">{t.online}</span>
              </>
            )}
          </button>

          {/* Sync Trigger if offline queue has items */}
          {offlineQueueCount > 0 && (
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-[11px]">Sync ({offlineQueueCount})</span>
            </button>
          )}

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 rounded-lg p-1">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900 text-slate-100">English</option>
              <option value="hi" className="bg-slate-900 text-slate-100">हिन्दी (Hindi)</option>
              <option value="as" className="bg-slate-900 text-slate-100">অসমীয়া (Assamese)</option>
              <option value="bn" className="bg-slate-900 text-slate-100">বাংলা (Bengali)</option>
            </select>
          </div>

          {/* Clock IST */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-800/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentTime} IST</span>
          </div>
        </div>
      </div>

      {/* Offline banner warning if offline mode enabled */}
      {isOffline && (
        <div className="bg-amber-950/90 border-b border-amber-600/30 px-4 py-1 text-center text-xs text-amber-200 font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.offlineNotice}</span>
        </div>
      )}
    </header>
  );
};
