import React, { useState } from 'react';
import { SoilTelemetry, Language } from '../types/agri';
import { Layers, Thermometer, Zap, Beaker, TrendingUp, Info, HelpCircle } from 'lucide-react';

interface SoilSensorMonitorProps {
  soil: SoilTelemetry;
  language: Language;
  parcelName: string;
}

export const SoilSensorMonitor: React.FC<SoilSensorMonitorProps> = ({
  soil,
  language,
  parcelName,
}) => {
  const isFr = language === 'fr';
  const [activeTab, setActiveTab] = useState<'profile' | 'chemistry' | 'trends'>('profile');

  // Calculate RFU (Réserve Facilement Utilisable) status for active 30cm root zone
  const rfuRange = soil.fieldCapacity - soil.wiltingPoint;
  const currentAvailableWater = Math.max(0, soil.depth30cm - soil.wiltingPoint);
  const rfuPercentage = Math.min(100, Math.round((currentAvailableWater / (rfuRange * 0.67)) * 100));

  const getMoistureColor = (val: number, fc: number, wp: number) => {
    if (val < wp + 4) return 'bg-red-500 text-red-400';
    if (val < (wp + fc) / 2) return 'bg-amber-500 text-amber-400';
    if (val > fc + 10) return 'bg-blue-600 text-blue-400';
    return 'bg-emerald-500 text-emerald-400';
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-100 text-base">
                {isFr ? 'Sondes Capacitives & Profil de Sol IoT' : 'Soil Probes & IoT Multi-Depth Telemetry'}
              </h2>
              <p className="text-xs text-stone-400">
                {isFr ? 'Sonde FDR tri-horizons à haute fréquence (10cm, 30cm, 60cm)' : 'Tri-depth FDR capacitive sensors (10cm, 30cm, 60cm)'}
              </p>
            </div>
          </div>
        </div>

        {/* View toggle tabs */}
        <div className="flex items-center bg-stone-950/80 p-1 rounded-lg border border-stone-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-stone-800 text-emerald-300 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isFr ? 'Horizons & RFU' : 'Horizons & RFU'}
          </button>
          <button
            onClick={() => setActiveTab('chemistry')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'chemistry'
                ? 'bg-stone-800 text-emerald-300 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isFr ? 'Salinité & Chimie' : 'Salinity & EC'}
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'trends'
                ? 'bg-stone-800 text-emerald-300 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isFr ? 'Dynamique 24h' : '24h Dynamics'}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          {/* RFU Status Alert bar */}
          <div className="bg-stone-950/70 border border-stone-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                  rfuPercentage > 60
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                    : rfuPercentage > 30
                    ? 'bg-amber-950 text-amber-400 border border-amber-700/50'
                    : 'bg-red-950 text-red-400 border border-red-700/50'
                }`}
              >
                {rfuPercentage}%
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                  <span>{isFr ? 'Réserve Facilement Utilisable (RFU)' : 'Readily Available Water (RAW)'}</span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    ({isFr ? 'Horizon racinaire 30cm' : 'Root zone 30cm'})
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  {rfuPercentage > 60
                    ? isFr ? 'Confort hydrique optimal. Aucune irrigation requise pour l\'instant.' : 'Optimal moisture comfort. No irrigation needed now.'
                    : rfuPercentage > 30
                    ? isFr ? 'Déficit modéré. Déclenchement recommandé sous 24h selon ET0.' : 'Moderate deficit. Triggering advised within 24h depending on ET0.'
                    : isFr ? 'Stress hydrique critique ! Point de flétrissement proche, irriguer sans attendre.' : 'Critical hydric stress! Near wilting point, irrigate immediately.'}
                </p>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-stone-400">
              <div>Capacité au champ: <span className="text-cyan-400 font-semibold">{soil.fieldCapacity}%</span></div>
              <div>Point flétrissement: <span className="text-red-400 font-semibold">{soil.wiltingPoint}%</span></div>
            </div>
          </div>

          {/* Three Depth Layers Visualization */}
          <div className="space-y-3">
            {/* 10cm Horizon */}
            <div className="bg-stone-950/50 border border-stone-800/60 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="font-semibold text-stone-200">
                    {isFr ? 'Horizon Surface (10 cm)' : 'Surface Horizon (10 cm)'}
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    · {isFr ? 'Évaporation directe & lit de semence' : 'Direct evaporation layer'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-stone-400 text-[11px]">{soil.temp10cm}°C</span>
                  <span className="font-bold text-stone-100">{soil.depth10cm}%</span>
                </div>
              </div>

              {/* Progress bar with markers */}
              <div className="relative h-3 w-full bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    getMoistureColor(soil.depth10cm, soil.fieldCapacity, soil.wiltingPoint).split(' ')[0]
                  }`}
                  style={{ width: `${Math.min(100, (soil.depth10cm / 70) * 100)}%` }}
                />
              </div>
            </div>

            {/* 30cm Horizon - CRITICAL ROOT ABSORPTION */}
            <div className="bg-stone-950/80 border-2 border-emerald-500/40 rounded-xl p-3 relative">
              <div className="absolute top-2 right-2 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/30">
                {isFr ? 'ZONE RACINAIRE ACTIVE' : 'ACTIVE ROOT ZONE'}
              </div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-emerald-200">
                    {isFr ? 'Horizon Médian (30 cm)' : 'Core Root Zone (30 cm)'}
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    · {isFr ? 'Absorption principale d\'eau et nutriments' : 'Primary water & nutrient uptake'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-stone-400 text-[11px]">{soil.temp30cm}°C</span>
                  <span className="font-extrabold text-emerald-400 text-sm">{soil.depth30cm}%</span>
                </div>
              </div>

              <div className="relative h-3.5 w-full bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (soil.depth30cm / 70) * 100)}%` }}
                />
              </div>
            </div>

            {/* 60cm Horizon */}
            <div className="bg-stone-950/50 border border-stone-800/60 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  <span className="font-semibold text-stone-200">
                    {isFr ? 'Horizon Profond (60 cm)' : 'Deep Horizon (60 cm)'}
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    · {isFr ? 'Réserve profonde & drainage gravitaire' : 'Deep reserve & gravitational drainage'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-stone-400 text-[11px]">17.8°C</span>
                  <span className="font-bold text-stone-100">{soil.depth60cm}%</span>
                </div>
              </div>

              <div className="relative h-3 w-full bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (soil.depth60cm / 70) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chemistry & Salinity Tab */}
      {activeTab === 'chemistry' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* EC Electrical Conductivity */}
          <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {isFr ? 'Conductivité (EC)' : 'Electrical Cond.'}
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">{isFr ? 'Salinité basse' : 'Low salinity'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-stone-100">
              {soil.ec} <span className="text-xs text-stone-400 font-normal">dS/m</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {isFr ? 'Idéal pour l\'absorption osmotique racinaire sans blocage.' : 'Optimal root osmotic uptake.'}
            </p>
          </div>

          {/* pH Sol */}
          <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Beaker className="w-3.5 h-3.5 text-cyan-400" />
                {isFr ? 'pH du Sol' : 'Soil pH'}
              </span>
              <span className="font-mono text-cyan-400 text-[11px]">{isFr ? 'Neutre' : 'Neutral'}</span>
            </div>
            <div className="text-xl font-bold font-mono text-stone-100">
              {soil.ph} <span className="text-xs text-stone-400 font-normal">pH</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {isFr ? 'Disponibilité maximale du phosphore et oligo-éléments.' : 'Maximum P & trace mineral bioavailability.'}
            </p>
          </div>

          {/* Température Sol */}
          <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                {isFr ? 'Température Sol' : 'Soil Temp'}
              </span>
              <span className="font-mono text-stone-400 text-[11px]">10 cm</span>
            </div>
            <div className="text-xl font-bold font-mono text-stone-100">
              {soil.temp10cm}° <span className="text-xs text-stone-400 font-normal">C</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {isFr ? 'Activité biologique et mycorhizienne intense.' : 'Intense microbiological activity.'}
            </p>
          </div>

          {/* NPK Summary */}
          <div className="bg-stone-950/70 border border-stone-800 p-3.5 rounded-xl">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>NPK (mg/kg)</span>
              <span className="text-emerald-400 text-[11px]">Équilibré</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs pt-1">
              <div className="bg-stone-900 rounded p-1 border border-stone-800">
                <div className="text-stone-400 text-[10px]">N</div>
                <div className="font-bold text-stone-100">{soil.nitrogen}</div>
              </div>
              <div className="bg-stone-900 rounded p-1 border border-stone-800">
                <div className="text-stone-400 text-[10px]">P</div>
                <div className="font-bold text-stone-100">{soil.phosphorus}</div>
              </div>
              <div className="bg-stone-900 rounded p-1 border border-stone-800">
                <div className="text-stone-400 text-[10px]">K</div>
                <div className="font-bold text-stone-100">{soil.potassium}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Dynamics Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span>{isFr ? 'Évolution de l\'humidité horaire (% volumique)' : 'Hourly moisture dynamics (% vol)'}</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> 10cm</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> 30cm (Racine)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> 60cm</span>
            </div>
          </div>

          {/* Interactive SVG Sparkline Chart */}
          <div className="bg-stone-950/90 rounded-xl p-3 border border-stone-800/80">
            <svg viewBox="0 0 500 120" className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="curve10Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.2" />
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.0" />
                </linearGradient>
                <linearGradient id="curve30Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#292524" stroke-dasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#292524" stroke-dasharray="3 3" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#292524" stroke-dasharray="3 3" />

              {/* Threshold indicator: Capacité au champ (50%) */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="4 2" opacity="0.6" />
              <text x="6" y="32" fill="#0ea5e9" font-size="9" font-family="monospace">Capacité au champ (52%)</text>

              {/* Threshold indicator: Point flétrissement (22%) */}
              <line x1="0" y1="88" x2="500" y2="88" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 2" opacity="0.6" />
              <text x="6" y="85" fill="#ef4444" font-size="9" font-family="monospace">Point flétrissement (22%)</text>

              {/* 60cm Curve */}
              <path
                d="M 0,40 Q 120,41 240,43 T 500,45"
                fill="none"
                stroke="#0284c7"
                stroke-width="2"
                opacity="0.7"
              />

              {/* 30cm Root Zone Curve */}
              <path
                d="M 0,55 Q 120,58 240,65 T 500,68"
                fill="none"
                stroke="#10b981"
                stroke-width="2.5"
              />

              {/* 10cm Surface Curve (More dynamic) */}
              <path
                d="M 0,65 Q 80,72 160,82 T 320,78 T 500,72"
                fill="none"
                stroke="#f59e0b"
                stroke-width="2"
              />

              {/* Current Points */}
              <circle cx="500" cy="45" r="4" fill="#0284c7" />
              <circle cx="500" cy="68" r="4" fill="#10b981" />
              <circle cx="500" cy="72" r="4" fill="#f59e0b" />
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-stone-500 pt-1">
              <span>-24h (Hier 10:00)</span>
              <span>-18h (16:00)</span>
              <span>-12h (22:00)</span>
              <span>-6h (04:00)</span>
              <span className="text-emerald-400 font-bold">{isFr ? 'Maintenant' : 'Now'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
