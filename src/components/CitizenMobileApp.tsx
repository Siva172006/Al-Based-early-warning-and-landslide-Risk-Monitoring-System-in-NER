import React, { useState } from 'react';
import {
  Smartphone,
  MapPin,
  Camera,
  AlertTriangle,
  Phone,
  ShieldCheck,
  CheckCircle,
  WifiOff,
  CloudUpload,
  RefreshCw,
  Send,
  Radio,
  FileCheck,
  Compass,
  Volume2,
} from 'lucide-react';
import { CitizenReport, LandslideZone, RoadSector, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface CitizenMobileAppProps {
  currentLang: LanguageCode;
  isOffline: boolean;
  onToggleOffline: () => void;
  zones: LandslideZone[];
  roads: RoadSector[];
  reports: CitizenReport[];
  offlineQueue: CitizenReport[];
  onAddReport: (report: CitizenReport) => void;
  onSyncOfflineQueue: () => void;
  isSyncing: boolean;
  onVerifyReport: (reportId: string, status: 'CONFIRMED' | 'REJECTED') => void;
}

export const CitizenMobileApp: React.FC<CitizenMobileAppProps> = ({
  currentLang,
  isOffline,
  onToggleOffline,
  zones,
  roads,
  reports,
  offlineQueue,
  onAddReport,
  onSyncOfflineQueue,
  isSyncing,
  onVerifyReport,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [userRole, setUserRole] = useState<'CITIZEN' | 'FIELD_OFFICER'>('CITIZEN');
  const [activeScreen, setActiveScreen] = useState<'HOME' | 'REPORT' | 'ROADS' | 'SOS' | 'VERIFY'>('HOME');

  // Form State for Report
  const [reportType, setReportType] = useState<CitizenReport['reportType']>('GROUND_CRACK');
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || '');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Local Resident / Volunteer');
  const [contactPhone, setContactPhone] = useState('9080684668');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [reportSuccessMsg, setReportSuccessMsg] = useState('');

  const currentZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newReport: CitizenReport = {
      id: `rep-${Date.now()}`,
      timestamp: 'Just now',
      reporterName,
      contactPhone,
      locationName: `${currentZone.name}, ${currentZone.district}`,
      lat: currentZone.lat + (Math.random() - 0.5) * 0.02,
      lng: currentZone.lng + (Math.random() - 0.5) * 0.02,
      reportType,
      severity: 'HIGH',
      description,
      photoUrl: hasPhoto
        ? 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80'
        : undefined,
      isOfflineQueued: isOffline,
      status: 'PENDING_VERIFICATION',
    };

    onAddReport(newReport);
    setDescription('');
    if (isOffline) {
      setReportSuccessMsg('Offline Mode Active: Report saved to local encrypted cache on your device. It will upload automatically once cellular link is restored.');
    } else {
      setReportSuccessMsg('Report transmitted successfully to District Disaster Management EOC!');
    }
    setTimeout(() => {
      setReportSuccessMsg('');
      setActiveScreen('HOME');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Role Switcher & Offline Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-sm font-black text-white">
              {t.mobileFieldApp}
            </h2>
            <p className="text-[11px] text-slate-400">
              Field telemetry & emergency reporting with local storage queue
            </p>
          </div>
        </div>

        {/* User Role Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => {
                setUserRole('CITIZEN');
                setActiveScreen('HOME');
              }}
              className={`px-3 py-1 font-semibold rounded ${
                userRole === 'CITIZEN'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Citizen View
            </button>
            <button
              onClick={() => {
                setUserRole('FIELD_OFFICER');
                setActiveScreen('VERIFY');
              }}
              className={`px-3 py-1 font-semibold rounded ${
                userRole === 'FIELD_OFFICER'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Field Officer View
            </button>
          </div>

          {/* Sync Trigger button */}
          {offlineQueue.length > 0 && (
            <button
              onClick={onSyncOfflineQueue}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync {offlineQueue.length} Cached</span>
            </button>
          )}
        </div>
      </div>

      {/* Phone Mockup Frame */}
      <div className="mx-auto max-w-sm rounded-[36px] bg-slate-950 border-[6px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[680px]">
        {/* Phone Top Notch & Status Bar */}
        <div className="bg-slate-900 px-6 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>09:41</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full" />
          <div className="flex items-center gap-1.5">
            {isOffline ? (
              <span className="flex items-center gap-1 text-rose-400 font-bold text-[10px]">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                4G LTE
              </span>
            )}
            <div className="w-4 h-2 rounded border border-slate-400 bg-emerald-400/80" />
          </div>
        </div>

        {/* Inner App Header */}
        <div className="bg-slate-900/90 backdrop-blur p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs">
              NL
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block">NER-LEWS Mobile</span>
              <span className="text-[10px] text-slate-400">
                {userRole === 'CITIZEN' ? 'Citizen Emergency App' : 'Field Officer Terminal'}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleOffline}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              isOffline
                ? 'bg-rose-950/60 border-rose-600/60 text-rose-300'
                : 'bg-emerald-950/60 border-emerald-600/60 text-emerald-300'
            }`}
          >
            {isOffline ? 'Low Network' : 'Cloud Sync'}
          </button>
        </div>

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {reportSuccessMsg && (
            <div className="bg-emerald-950 border border-emerald-500/50 rounded-xl p-3 text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{reportSuccessMsg}</span>
            </div>
          )}

          {/* SCREEN 1: HOME (Current Location GPS Risk & Alerts) */}
          {activeScreen === 'HOME' && (
            <div className="space-y-4">
              {/* GPS Slope Risk Tile */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    {t.mobile.myLocationRisk}
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    GPS: &plusmn;4m
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-bold text-sm text-white block">
                      {currentZone.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {currentZone.district}, {currentZone.state}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${
                      currentZone.currentRisk === 'CRITICAL'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : currentZone.currentRisk === 'HIGH'
                        ? 'bg-orange-500 text-slate-950 font-bold'
                        : 'bg-yellow-500 text-slate-950 font-bold'
                    }`}
                  >
                    {currentZone.currentRisk}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="bg-slate-950 p-1.5 rounded">
                    <span className="text-slate-500 block text-[10px]">24h Rain:</span>
                    <span className="text-cyan-400 font-bold">{currentZone.rainfall24h} mm</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded">
                    <span className="text-slate-500 block text-[10px]">Failure Prob:</span>
                    <span className="text-rose-400 font-bold">{currentZone.probability}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 italic pt-1">
                  &bull; Advisory: {currentZone.evacuationRoute}
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setActiveScreen('REPORT')}
                  className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-left transition-colors flex flex-col justify-between h-24"
                >
                  <Camera className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-xs text-white block">
                      Report Crack
                    </span>
                    <span className="text-[10px] text-slate-400">Photo & GPS</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveScreen('ROADS')}
                  className="p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-left transition-colors flex flex-col justify-between h-24"
                >
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="font-bold text-xs text-white block">
                      Road Status
                    </span>
                    <span className="text-[10px] text-slate-400">Highway Passability</span>
                  </div>
                </button>
              </div>

              {/* SOS Banner */}
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveScreen('SOS')}
                  className="w-full p-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-xl text-white font-black text-xs transition-all shadow-md shadow-rose-600/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 animate-pulse" />
                    <span>{t.mobile.sosEmergency}</span>
                  </div>
                  <span className="text-[10px] bg-rose-950 px-2 py-0.5 rounded font-mono">9080684668 / 9787537821</span>
                </button>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <a
                    href="tel:9080684668"
                    className="p-1.5 bg-rose-950/60 border border-rose-800/60 rounded-lg text-rose-300 text-center hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5" /> 9080684668
                  </a>
                  <a
                    href="tel:9787537821"
                    className="p-1.5 bg-rose-950/60 border border-rose-800/60 rounded-lg text-rose-300 text-center hover:bg-rose-900/60 transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5" /> 9787537821
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: REPORT LANDSLIDE / CRACK */}
          {activeScreen === 'REPORT' && (
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-white">
                  Report Ground Crack or Landslide
                </span>
                <button
                  type="button"
                  onClick={() => setActiveScreen('HOME')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Incident Type:</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium"
                >
                  <option value="GROUND_CRACK">Ground / Crown Tension Crack</option>
                  <option value="ROCKFALL">Rockfall / Falling Boulders</option>
                  <option value="SLOPE_MOVEMENT">Slope Bulge / Subsidence</option>
                  <option value="ROAD_BLOCKAGE">Highway Blockage / Debris</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Sector:</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-medium"
                >
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Description / Observations:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe crack length, mud outflow, tree tilt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white resize-none"
                />
              </div>

              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] text-slate-300">Attach Field Photo</span>
                </div>
                <input
                  type="checkbox"
                  checked={hasPhoto}
                  onChange={(e) => setHasPhoto(e.target.checked)}
                  className="accent-amber-500 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isOffline ? 'Save to Offline Queue' : 'Submit Report Immediately'}</span>
              </button>
            </form>
          )}

          {/* SCREEN 3: HIGHWAY PASSABILITY CHECK */}
          {activeScreen === 'ROADS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-white">
                  Highway Passability Status
                </span>
                <button
                  onClick={() => setActiveScreen('HOME')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Back
                </button>
              </div>

              <div className="space-y-2">
                {roads.map((r) => (
                  <div key={r.id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{r.code}: {r.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          r.status === 'CRITICALLY_BLOCKED'
                            ? 'bg-rose-500/20 text-rose-300'
                            : r.status === 'PARTIALLY_BLOCKED'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {r.status.replace('_', ' ')}
                      </span>
                    </div>
                    {r.cause && <p className="text-[11px] text-rose-300 mb-1">{r.cause}</p>}
                    {r.detourRoute && (
                      <p className="text-[10px] text-slate-400">
                        <strong className="text-amber-400">Detour:</strong> {r.detourRoute}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 4: SOS EMERGENCY */}
          {activeScreen === 'SOS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-rose-400">
                  SOS Emergency Hotlines
                </span>
                <button
                  onClick={() => setActiveScreen('HOME')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Back
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Disaster Operations Hotline', num: '9080684668', desc: 'Direct 24/7 Field & Incident Cell' },
                  { name: 'Field Emergency Coordinator', num: '9787537821', desc: 'Evacuation & Rescue Coordination' },
                  { name: 'National Emergency Helpline', num: '112', desc: 'Police, Fire, Ambulance' },
                  { name: 'District Disaster EOC', num: '1077', desc: 'District Magistrate Control Room' },
                  { name: 'State Disaster Management', num: '1070', desc: 'State HQ & SDRF Dispatch' },
                  { name: '1st Bn NDRF Guwahati', num: '0361-2840284', desc: 'NER Mountain Rescue Wing' },
                ].map((hl, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">{hl.name}</span>
                      <span className="text-[10px] text-slate-400">{hl.desc}</span>
                    </div>
                    <a
                      href={`tel:${hl.num}`}
                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3 h-3" />
                      {hl.num}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 5: FIELD OFFICER VERIFICATION QUEUE */}
          {activeScreen === 'VERIFY' && userRole === 'FIELD_OFFICER' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  Field Officer Verification Queue
                </span>
                <span className="text-[10px] text-slate-400">
                  {reports.length} pending
                </span>
              </div>

              <div className="space-y-2.5">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="font-bold text-xs text-white block">
                          {rep.reportType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">{rep.locationName}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          rep.status === 'CONFIRMED'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 italic">"{rep.description}"</p>

                    {rep.photoUrl && (
                      <img
                        src={rep.photoUrl}
                        alt="Field observation"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    )}

                    {rep.status !== 'CONFIRMED' && (
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                        <button
                          onClick={() => onVerifyReport(rep.id, 'CONFIRMED')}
                          className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded"
                        >
                          Verify & Confirm
                        </button>
                        <button
                          onClick={() => onVerifyReport(rep.id, 'REJECTED')}
                          className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Bottom Navigation Bar */}
        <div className="bg-slate-900 p-2 border-t border-slate-800 flex items-center justify-around text-[10px] text-slate-400">
          <button
            onClick={() => setActiveScreen('HOME')}
            className={`flex flex-col items-center gap-1 ${activeScreen === 'HOME' ? 'text-amber-400 font-bold' : ''}`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveScreen('REPORT')}
            className={`flex flex-col items-center gap-1 ${activeScreen === 'REPORT' ? 'text-amber-400 font-bold' : ''}`}
          >
            <Camera className="w-4 h-4" />
            <span>Report</span>
          </button>
          <button
            onClick={() => setActiveScreen('ROADS')}
            className={`flex flex-col items-center gap-1 ${activeScreen === 'ROADS' ? 'text-amber-400 font-bold' : ''}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Roads</span>
          </button>
          <button
            onClick={() => setActiveScreen('SOS')}
            className={`flex flex-col items-center gap-1 ${activeScreen === 'SOS' ? 'text-rose-400 font-bold' : ''}`}
          >
            <Phone className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
