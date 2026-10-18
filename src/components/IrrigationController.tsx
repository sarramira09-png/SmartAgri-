import React, { useState, useEffect } from 'react';
import { Parcel, IrrigationDecision, Language } from '../types/agri';
import { Droplet, Play, Square, Clock, Sparkles, CheckCircle2, AlertOctagon, Power, RefreshCw } from 'lucide-react';

interface IrrigationControllerProps {
  parcel: Parcel;
  decision?: IrrigationDecision;
  onToggleValve: (parcelId: string, open: boolean, doseMm?: number) => void;
  language: Language;
}

export const IrrigationController: React.FC<IrrigationControllerProps> = ({
  parcel,
  decision,
  onToggleValve,
  language,
}) => {
  const isFr = language === 'fr';
  const isOpen = parcel.valveStatus === 'OPEN';

  const [selectedDoseMm, setSelectedDoseMm] = useState<number>(decision?.suggestedVolumeMm || 15);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
  const [flowTimerSeconds, setFlowTimerSeconds] = useState<number>(0);

  // If the valve is open, simulate a ticking timer and flow rate
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen) {
      interval = setInterval(() => {
        setFlowTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setFlowTimerSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  const flowRateLpm = parcel.irrigationType === 'DRIP' ? 180 : parcel.irrigationType === 'PIVOT_SPRINKLER' ? 950 : 350;
  const currentVolumeLiters = Math.round((flowTimerSeconds / 60) * flowRateLpm);
  const currentVolumeM3 = (currentVolumeLiters / 1000).toFixed(2);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStartIrrigation = () => {
    onToggleValve(parcel.id, true, selectedDoseMm);
  };

  const handleStopIrrigation = () => {
    onToggleValve(parcel.id, false);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isOpen ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-400' : 'bg-stone-800 border border-stone-700 text-stone-300'
          }`}>
            <Droplet className={`w-4 h-4 ${isOpen ? 'animate-bounce' : ''}`} />
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base">
              {isFr ? 'Contrôleur d\'Irrigation & Actionneur' : 'Smart Irrigation Actuator & Valve Control'}
            </h2>
            <p className="text-xs text-stone-400">
              {parcel.sector} · {parcel.irrigationType === 'DRIP' ? 'Réseau Goutte-à-goutte' : 'Rampe / Pivot'}
            </p>
          </div>
        </div>

        {/* Auto vs Manual Switch */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-stone-400">
            {isFr ? 'Mode de pilotage :' : 'Pilot mode:'}
          </span>
          <button
            onClick={() => setIsAutoMode(!isAutoMode)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isAutoMode
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                : 'bg-stone-800 text-stone-300 border-stone-700'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{isAutoMode ? (isFr ? 'Automatique (IA)' : 'Autonomous (AI)') : (isFr ? 'Manuel supervisé' : 'Supervised Manual')}</span>
          </button>
        </div>
      </div>

      {/* Main Valve Status Box */}
      <div className={`rounded-xl border p-4 transition-all ${
        isOpen
          ? 'bg-gradient-to-br from-cyan-950/70 via-stone-900 to-stone-950 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
          : 'bg-stone-950/60 border-stone-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status badge & active flow animation */}
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
              isOpen
                ? 'bg-cyan-500 text-stone-950 shadow-md shadow-cyan-500/50 animate-pulse'
                : 'bg-stone-800 text-stone-400 border border-stone-700'
            }`}>
              <Power className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isOpen
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-stone-800 text-stone-400'
                }`}>
                  {isOpen ? (isFr ? 'Électrovanne Ouverte' : 'Valve Open') : (isFr ? 'Électrovanne Fermée' : 'Valve Closed')}
                </span>
                {isOpen && (
                  <span className="text-xs text-cyan-400 font-mono animate-pulse">
                    ● {formatTimer(flowTimerSeconds)}
                  </span>
                )}
              </div>
              <div className="text-sm font-semibold text-stone-200 mt-1">
                {isOpen
                  ? (isFr ? `Injection d'eau en cours sur le secteur ${parcel.sector}` : `Active water injection in sector ${parcel.sector}`)
                  : (isFr ? `Dernier apport: ${parcel.lastWateringDate}` : `Last watering: ${parcel.lastWateringDate}`)}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2.5">
            {isOpen ? (
              <button
                onClick={handleStopIrrigation}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{isFr ? 'Arrêter l\'irrigation' : 'Halt Irrigation'}</span>
              </button>
            ) : (
              <button
                onClick={handleStartIrrigation}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-950/60 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isFr ? 'Déclencher l\'irrigation' : 'Trigger Irrigation'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Flow Details if open */}
        {isOpen && (
          <div className="mt-4 pt-3 border-t border-cyan-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-stone-400 block text-[11px]">{isFr ? 'Débit mesuré' : 'Flow rate'}</span>
              <span className="text-cyan-300 font-bold text-sm">{flowRateLpm} L/min</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{isFr ? 'Volume injecté' : 'Delivered volume'}</span>
              <span className="text-cyan-300 font-bold text-sm">{currentVolumeM3} m³</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{isFr ? 'Dose cible' : 'Target dose'}</span>
              <span className="text-cyan-300 font-bold text-sm">{selectedDoseMm} mm</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">{isFr ? 'Gain humidité estimé' : 'Est. moisture gain'}</span>
              <span className="text-emerald-400 font-bold text-sm">+{Math.round(selectedDoseMm * 0.8)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendation Card */}
      {decision && (
        <div className={`p-4 rounded-xl border text-xs space-y-2 ${
          decision.recommended
            ? 'bg-amber-950/30 border-amber-600/40'
            : 'bg-stone-950/50 border-stone-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isFr ? 'Recommandation de l\'Agent Agronomique' : 'AI Agronomic Recommendation'}
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              decision.recommended
                ? 'bg-amber-950 text-amber-300 border border-amber-600/30'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-600/30'
            }`}>
              {decision.recommended
                ? (isFr ? 'IRRIGATION CONSEILLÉE' : 'IRRIGATION RECOMMENDED')
                : (isFr ? 'RÉSERVE HYDRIQUE SUFFISANTE' : 'ADEQUATE WATER RESERVE')}
            </span>
          </div>

          <p className="text-stone-300 leading-relaxed">
            {decision.justification}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono text-stone-400 border-t border-stone-800/80">
            <div>
              {isFr ? 'Dose conseillée :' : 'Suggested dose:'}{' '}
              <span className="text-amber-300 font-bold">{decision.suggestedVolumeMm} mm</span>
            </div>
            <div>·</div>
            <div>
              {isFr ? 'Durée estimée :' : 'Est. runtime:'}{' '}
              <span className="text-stone-200 font-bold">{decision.durationMinutes} min</span>
            </div>
            <div>·</div>
            <div>
              {isFr ? 'Fenêtre idéale :' : 'Optimal window:'}{' '}
              <span className="text-emerald-400 font-medium">{decision.optimalWindow}</span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Dose Presets Selector */}
      <div className="flex items-center justify-between gap-3 text-xs pt-1">
        <span className="text-stone-400">{isFr ? 'Sélectionner une dose (mm) :' : 'Select dose (mm):'}</span>
        <div className="flex items-center gap-1.5 font-mono">
          {[10, 15, 20, 25].map((dose) => (
            <button
              key={dose}
              onClick={() => setSelectedDoseMm(dose)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedDoseMm === dose
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {dose} mm
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
