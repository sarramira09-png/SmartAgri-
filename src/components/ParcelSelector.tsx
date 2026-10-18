import React from 'react';
import { Parcel, Language } from '../types/agri';
import { MapPin, Droplet, ShieldCheck, AlertTriangle, Layers } from 'lucide-react';

interface ParcelSelectorProps {
  parcels: Parcel[];
  selectedParcelId: string;
  onSelectParcel: (id: string) => void;
  language: Language;
}

export const ParcelSelector: React.FC<ParcelSelectorProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  language,
}) => {
  const isFr = language === 'fr';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-stone-400 px-1">
        <span className="font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          {isFr ? 'Parcelles & Cultures Monitorées' : 'Monitored Fields & Crops'}
        </span>
        <span className="text-stone-500">
          {parcels.length} {isFr ? 'zones actives' : 'active zones'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {parcels.map((p) => {
          const isSelected = p.id === selectedParcelId;
          const avgMoisture = Math.round((p.soil.depth10cm + p.soil.depth30cm + p.soil.depth60cm) / 3);
          const isIrrigating = p.valveStatus === 'OPEN';

          return (
            <button
              key={p.id}
              onClick={() => onSelectParcel(p.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-stone-900 border-emerald-500/80 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                  : 'bg-stone-900/60 hover:bg-stone-800/70 border-stone-800 hover:border-stone-700 text-stone-300'
              }`}
            >
              {/* Active parcel indicator bar */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-500" />
              )}

              {/* Header info */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-emerald-400/90 font-medium tracking-wide truncate">
                    {p.sector} · {p.areaHectares} ha
                  </div>
                  <h3 className="font-semibold text-stone-100 text-sm truncate mt-0.5">
                    {p.name}
                  </h3>
                </div>

                {/* Health score badge */}
                <div
                  className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                    p.healthScore >= 85
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                      : p.healthScore >= 70
                      ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                      : 'bg-red-950/60 text-red-300 border-red-700/50'
                  }`}
                  title={`${isFr ? 'Indice de santé global' : 'Overall health score'}: ${p.healthScore}/100`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{p.healthScore}%</span>
                </div>
              </div>

              {/* Phenological BBCH stage */}
              <div className="text-xs text-stone-400 mb-3 truncate flex items-center gap-1.5">
                <span className="font-mono text-emerald-400 text-[11px] bg-stone-800 px-1.5 py-0.5 rounded">
                  {p.growthStageBBCH}
                </span>
                <span className="truncate">{p.stageName}</span>
              </div>

              {/* Moisture & Valve footer */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-800/80">
                <div className="flex items-center gap-1.5">
                  <Droplet className={`w-3.5 h-3.5 ${avgMoisture < 30 ? 'text-amber-400' : 'text-cyan-400'}`} />
                  <span className="text-stone-300 font-mono font-medium">{avgMoisture}%</span>
                  <span className="text-stone-500 text-[11px]">{isFr ? 'humidité sol' : 'soil moist.'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isIrrigating ? (
                    <span className="flex items-center gap-1 text-cyan-400 text-[11px] font-medium animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      {isFr ? 'Arrosage en cours' : 'Irrigating'}
                    </span>
                  ) : (
                    <span className="text-stone-500 text-[11px] font-mono">
                      {p.irrigationType === 'DRIP' ? 'Goutte-à-goutte' : p.irrigationType === 'PIVOT_SPRINKLER' ? 'Pivot' : 'Micro-asp.'}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
