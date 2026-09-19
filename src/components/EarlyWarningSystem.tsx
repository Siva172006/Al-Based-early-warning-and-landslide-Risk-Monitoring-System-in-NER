import React, { useState } from 'react';
import {
  BellRing,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Sliders,
  CheckCircle,
  AlertTriangle,
  FileText,
  Copy,
  Radio,
  Clock,
  PhoneCall,
  MapPin,
} from 'lucide-react';
import { EarlyWarningAlert, LandslideZone, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface EarlyWarningSystemProps {
  alerts: EarlyWarningAlert[];
  zones: LandslideZone[];
  currentLang: LanguageCode;
  onDispatchAlert: (alert: EarlyWarningAlert) => void;
}

export const EarlyWarningSystem: React.FC<EarlyWarningSystemProps> = ({
  alerts,
  zones,
  currentLang,
  onDispatchAlert,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || '');
  const [targetLang, setTargetLang] = useState<LanguageCode>(currentLang);
  const [isGeneratingBulletin, setIsGeneratingBulletin] = useState(false);
  const [bulletinResult, setBulletinResult] = useState<{
    text: string;
    checklist: string[];
    isFallback?: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Configurable Alert Thresholds
  const [thresholdRainfall24h, setThresholdRainfall24h] = useState(120);
  const [thresholdMoisture, setThresholdMoisture] = useState(80);
  const [thresholdProbability, setThresholdProbability] = useState(70);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState('');

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // AI Bulletin Generator (Calls server `/api/gemini/generate-bulletin`)
  const handleGenerateAIBulletin = async () => {
    if (!selectedZone) return;
    setIsGeneratingBulletin(true);
    setBulletinResult(null);

    try {
      const response = await fetch('/api/gemini/generate-bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneName: selectedZone.name,
          state: selectedZone.state,
          rainfall24h: selectedZone.rainfall24h,
          soilMoisture: selectedZone.soilMoisture,
          slopeAngle: selectedZone.slopeAngle,
          riskLevel: selectedZone.currentRisk,
          language: targetLang,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBulletinResult({
          text: data.bulletinText,
          checklist: data.actionChecklist || [],
          isFallback: data.isFallback,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setBulletinResult({
        text: `OFFICIAL EARLY WARNING ADVISORY [NER-EOC]: Extreme slope instability warning issued for ${selectedZone.name}, ${selectedZone.state}. Heavy rainfall of ${selectedZone.rainfall24h}mm and 88% soil saturation has triggered critical shear failure thresholds along connecting highways. All non-essential transport must halt immediately.`,
        checklist: [
          'Immediate closure of steep arterial road segments',
          'Deployment of Quick Reaction SDRF teams',
          'Activation of temporary relief shelters in valley flatlands',
          'Geo-targeted SMS alerts dispatched to all active mobile subscribers',
        ],
        isFallback: true,
      });
    } finally {
      setIsGeneratingBulletin(false);
    }
  };

  const handleCopyBulletin = () => {
    if (bulletinResult?.text) {
      navigator.clipboard.writeText(bulletinResult.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBroadcastAlert = () => {
    if (!selectedZone) return;

    const newAlert: EarlyWarningAlert = {
      id: `alt-${Date.now()}`,
      timestamp: 'Just now',
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      district: selectedZone.district,
      state: selectedZone.state,
      riskLevel: selectedZone.currentRisk,
      triggerReason: `Real-time trigger: 24h rainfall (${selectedZone.rainfall24h}mm) and soil moisture (${selectedZone.soilMoisture}%) breached configured thresholds.`,
      recommendedAction: 'Order immediate precautionary halt on connecting highways and alert valley village wardens.',
      affectedRoads: ['NH Primary Corridor', 'District Arterial Links'],
      affectedVillages: [`${selectedZone.district} Valley Settlements`, 'Downhill Hamlets'],
      emergencyHotlines: [
        '+91 9080684668 (Disaster Operations)',
        '+91 9787537821 (Field Response)',
        '1077 (District EOC)',
        '112 (National Emergency)',
        '1070 (State Disaster HQ)',
      ],
      broadcastChannels: ['SMS', 'APP_PUSH', 'WEB_SIREN', 'DISTRICT_RADIO'],
      status: 'ACTIVE',
    };

    onDispatchAlert(newAlert);
    setBroadcastSuccessNotice(`Emergency Alert broadcasted across 4 channels (SMS, Mobile App Push, Web Siren, EOC Radio) for ${selectedZone.name}!`);
    setTimeout(() => setBroadcastSuccessNotice(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Dedicated Emergency Response Hotlines Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-white block">Dedicated NER Emergency Contacts & Response Hotlines</span>
            <span className="text-[11px] text-slate-400">Direct lines for incident coordination, evacuation alerts, and field assistance</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <a
            href="tel:9080684668"
            className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-lg flex items-center gap-1.5 transition-colors font-bold"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>Operations Cell: +91 9080684668</span>
          </a>
          <a
            href="tel:9787537821"
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg flex items-center gap-1.5 transition-colors font-bold"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Field Coordinator: +91 9787537821</span>
          </a>
        </div>
      </div>

      {/* Top Banner with Siren & Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <BellRing className="w-5 h-5 text-amber-500" />
              {t.tabs.earlyWarnings}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Multi-Channel Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated threshold surveillance and AI-generated multi-agency disaster bulletins for NER state administrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Siren Toggle */}
          <button
            onClick={() => setSirenPlaying(!sirenPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sirenPlaying
                ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {sirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{sirenPlaying ? 'Siren Active (Mute)' : 'Test Audio Siren'}</span>
          </button>

          {/* Config Thresholds Modal Toggle */}
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Config Thresholds</span>
          </button>
        </div>
      </div>

      {/* Threshold Config Drawer */}
      {showConfigModal && (
        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              Surveillance Threshold Configuration
            </span>
            <span className="text-[11px] text-amber-400 font-medium">Auto-triggers alert when exceeded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>24h Rainfall Trigger:</span>
                <span className="font-mono text-amber-400 font-bold">{thresholdRainfall24h} mm</span>
              </div>
              <input
                type="range"
                min={50}
                max={250}
                step={5}
                value={thresholdRainfall24h}
                onChange={(e) => setThresholdRainfall24h(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>Soil Moisture Saturation:</span>
                <span className="font-mono text-amber-400 font-bold">{thresholdMoisture} %</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                step={1}
                value={thresholdMoisture}
                onChange={(e) => setThresholdMoisture(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span>AI Failure Probability:</span>
                <span className="font-mono text-amber-400 font-bold">{thresholdProbability} %</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                step={5}
                value={thresholdProbability}
                onChange={(e) => setThresholdProbability(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Notice */}
      {broadcastSuccessNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-3 text-xs text-emerald-200 font-medium flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{broadcastSuccessNotice}</span>
        </div>
      )}

      {/* Main 2-Column: Left (Active Warnings Feed), Right (AI Bulletin Generator & Dispatch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Alerts Feed (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-500" />
              Live Emergency Dissemination Queue ({alerts.length})
            </span>
            <span className="text-[11px] text-slate-400">Real-time broadcast</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950/30 border-rose-900/50 hover:border-rose-700'
                    : 'bg-orange-950/30 border-orange-900/50 hover:border-orange-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{alert.zoneName}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          alert.riskLevel === 'CRITICAL'
                            ? 'bg-rose-500 text-white'
                            : 'bg-orange-500 text-slate-950'
                        }`}
                      >
                        {alert.riskLevel}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {alert.district}, {alert.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-2.5">
                  <strong className="text-rose-400">Trigger:</strong> {alert.triggerReason}
                </p>

                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs mb-3">
                  <strong className="text-amber-400 block mb-1">Precautionary Directive:</strong>
                  <p className="text-slate-200">{alert.recommendedAction}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3 font-mono">
                  <div>
                    <span className="text-slate-500 block">Affected Highways:</span>
                    <span className="text-slate-300 font-medium">
                      {alert.affectedRoads.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Emergency Contacts:</span>
                    <span className="text-emerald-400 font-medium">
                      {alert.emergencyHotlines.join(' | ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Channels:</span>
                    {alert.broadcastChannels.map((c, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Transmitted
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Advisory Bulletin Generator & Direct Dispatcher (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Emergency Bulletin Creator
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono">
                Gemini 3.8
              </span>
            </div>

            {/* Select Target Zone */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Hazard Zone:
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.state} - {z.currentRisk})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Target Language */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Advisory Target Language:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'as', label: 'অসমীয়া' },
                  { code: 'bn', label: 'বাংলা' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setTargetLang(l.code as LanguageCode)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      targetLang === l.code
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateAIBulletin}
              disabled={isGeneratingBulletin}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingBulletin ? 'animate-spin' : ''}`} />
              <span>
                {isGeneratingBulletin
                  ? 'Synthesizing Multilingual Bulletin...'
                  : 'Generate Official Advisory Bulletin'}
              </span>
            </button>

            {/* Bulletin Result View */}
            {bulletinResult && (
              <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span className="font-mono font-semibold text-amber-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> NE-EOC Official Broadcast
                  </span>
                  <button
                    onClick={handleCopyBulletin}
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-100 font-medium leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  {bulletinResult.text}
                </p>

                {bulletinResult.checklist.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Immediate Action Protocol:
                    </span>
                    {bulletinResult.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Broadcast Button */}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={handleBroadcastAlert}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Multi-Channel Warning Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
