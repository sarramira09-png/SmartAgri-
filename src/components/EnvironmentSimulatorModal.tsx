import React from 'react';
import { WeatherScenario, Language } from '../types/agri';
import { SCENARIO_PRESETS } from '../data/agriData';
import { X, Sun, CloudRain, Flame, CloudFog, Check } from 'lucide-react';

interface EnvironmentSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario: WeatherScenario;
  onSelectScenario: (scenario: WeatherScenario) => void;
  language: Language;
}

export const EnvironmentSimulatorModal: React.FC<EnvironmentSimulatorModalProps> = ({
  isOpen,
  onClose,
  activeScenario,
  onSelectScenario,
  language,
}) => {
  if (!isOpen) return null;
  const isFr = language === 'fr';

  const scenarios: { id: WeatherScenario; icon: React.ReactNode; color: string }[] = [
    {
      id: 'standard',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      color: 'border-emerald-600/40 bg-emerald-950/20',
    },
    {
      id: 'drought_heatwave',
      icon: <Flame className="w-5 h-5 text-red-500" />,
      color: 'border-red-600/40 bg-red-950/20',
    },
    {
      id: 'heavy_rain',
      icon: <CloudRain className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-600/40 bg-blue-950/20',
    },
    {
      id: 'mildew_high_humidity',
      icon: <CloudFog className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-600/40 bg-teal-950/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="font-bold text-stone-100 text-lg">
              {isFr ? 'Simulateur d\'Environnement & Stress Climatique' : 'Climate & Environmental Stress Simulator'}
            </h3>
            <p className="text-xs text-stone-400">
              {isFr
                ? 'Testez la réactivité de l\'agent IA face à des ruptures météorologiques réelles'
                : 'Test how SmartAgri AI reacts to rapid environmental shifts'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="space-y-2.5">
          {scenarios.map(({ id, icon, color }) => {
            const data = SCENARIO_PRESETS[id];
            const isSelected = activeScenario === id;

            return (
              <button
                key={id}
                onClick={() => {
                  onSelectScenario(id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? `${color} ring-1 ring-emerald-400/50 shadow-md`
                    : 'bg-stone-950/60 border-stone-800 hover:bg-stone-800/60 text-stone-300'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-100">
                      {isFr ? data.nameFr : data.nameEn}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        {isFr ? 'Actif' : 'Active'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    {isFr ? data.descriptionFr : data.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[10px] font-mono text-stone-400 mt-2">
                    <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                      Sol: {data.soilDelta.depth30cm}% (30cm)
                    </span>
                    <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                      Air: {data.weatherDelta.ambientTemp}°C
                    </span>
                    <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                      Hygro: {data.weatherDelta.airHumidity}%
                    </span>
                    <span className="bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
                      ET0: {data.weatherDelta.et0} mm/j
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
