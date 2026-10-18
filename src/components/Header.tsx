import React from 'react';
import { Sprout, Activity, Wifi, CloudSun, Sparkles, Sliders, Droplets, Bell, ClipboardList } from 'lucide-react';
import { Language, WeatherScenario } from '../types/agri';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeScenario: WeatherScenario;
  onOpenSimulator: () => void;
  totalWaterSavedM3: number;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenRecords: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeScenario,
  onOpenSimulator,
  totalWaterSavedM3,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenRecords,
}) => {
  const isFr = language === 'fr';

  return (
    <header className="border-b border-stone-800 bg-stone-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/30 flex-shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  SmartAgri <span className="text-emerald-400 font-extrabold">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate hidden sm:block">
                {isFr
                  ? "Interface Agent-Exploitant : Surveillance, Alertes & Registre de plaine"
                  : "Agent-Farmer Interface: Crop Monitoring, Alerts & Records"}
              </p>
            </div>
          </div>

          {/* Telemetry Status Ticker */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-stone-400 border-x border-stone-800/80 px-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-stone-300 font-medium">12 Sondes Sol</span>
              <span className="text-stone-500">· LoRaWAN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-stone-300 font-medium">Station Météo</span>
              <span className="text-stone-500">· 4G Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">{totalWaterSavedM3.toLocaleString()} m³</span>
              <span className="text-stone-500">{isFr ? 'économisés' : 'saved'}</span>
            </div>
          </div>

          {/* Actions & Alerts */}
          <div className="flex items-center gap-2">
            {/* Quick Alert Bell with counter */}
            <button
              onClick={onOpenAlerts}
              className={`relative p-2 rounded-lg border transition-all ${
                unreadAlertsCount > 0
                  ? 'bg-red-950/80 text-red-300 border-red-700/60 hover:bg-red-900/80'
                  : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border-stone-700'
              }`}
              title={isFr ? "Consulter les alertes prioritaires" : "View priority alerts"}
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Quick Logbook Button */}
            <button
              onClick={onOpenRecords}
              className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 border border-stone-700 transition-colors"
              title={isFr ? "Ouvrir le registre de plaine (traçabilité)" : "Open field records & logbook"}
            >
              <ClipboardList className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Environment Scenario Trigger */}
            <button
              onClick={onOpenSimulator}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                activeScenario !== 'standard'
                  ? 'bg-amber-950/70 text-amber-300 border-amber-600/50 hover:bg-amber-900/60 shadow-xs'
                  : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-200 border-stone-700'
              }`}
              title={isFr ? "Simuler des conditions météo extrêmes" : "Simulate extreme weather conditions"}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{isFr ? 'Scénario' : 'Scenario'}</span>
              {activeScenario !== 'standard' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-800/90 rounded-lg p-0.5 border border-stone-700 text-xs">
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'fr'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
