import React, { useState } from 'react';
import { FarmerAlert, Language } from '../types/agri';
import { Bell, AlertTriangle, ShieldAlert, Droplets, Stethoscope, CheckCircle, Flame, Check, Plus, Volume2, VolumeX } from 'lucide-react';

interface AlertsCenterProps {
  alerts: FarmerAlert[];
  onResolveAlert: (id: string) => void;
  onTriggerIrrigationForAlert: (parcelId: string) => void;
  onOpenVisionForAlert: () => void;
  onAddSimulatedAlert: (category: 'DROUGHT' | 'DISEASE') => void;
  language: Language;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({
  alerts,
  onResolveAlert,
  onTriggerIrrigationForAlert,
  onOpenVisionForAlert,
  onAddSimulatedAlert,
  language,
}) => {
  const isFr = language === 'fr';

  const [filter, setFilter] = useState<'ALL' | 'UNRESOLVED' | 'DROUGHT' | 'DISEASE'>('UNRESOLVED');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'UNRESOLVED') return !a.isResolved;
    if (filter === 'DROUGHT') return a.category === 'DROUGHT';
    if (filter === 'DISEASE') return a.category === 'DISEASE';
    return true;
  });

  const unresolvedCount = alerts.filter((a) => !a.isResolved).length;
  const droughtAlertsCount = alerts.filter((a) => a.category === 'DROUGHT' && !a.isResolved).length;
  const diseaseAlertsCount = alerts.filter((a) => a.category === 'DISEASE' && !a.isResolved).length;

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext may be restricted by browser policy before user gesture
    }
  };

  const handleSimulate = (cat: 'DROUGHT' | 'DISEASE') => {
    playChime();
    onAddSimulatedAlert(cat);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400 relative">
            <Bell className="w-5 h-5" />
            {unresolvedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                {unresolvedCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base flex items-center gap-2">
              <span>{isFr ? 'Centre d\'Alertes Prioritaires de l\'Exploitant' : 'Farmer Alert Center & Early Warning System'}</span>
              {unresolvedCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-700/50 px-2 py-0.5 rounded">
                  {unresolvedCount} {isFr ? 'actives' : 'active'}
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-400">
              {isFr
                ? 'Détection instantanée : sol trop sec (stress hydrique) et suspicions de maladies foliaires'
                : 'Instant alerts: soil critically dry (drought stress) and suspected foliar diseases'}
            </p>
          </div>
        </div>

        {/* Quick Simulator Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 transition-colors"
            title={soundEnabled ? (isFr ? 'Désactiver le son' : 'Mute chime') : (isFr ? 'Activer le son' : 'Enable chime')}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleSimulate('DROUGHT')}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/70 text-red-300 border border-red-700/40 transition-colors shadow-xs"
            title={isFr ? "Simuler une alerte de sol trop sec" : "Simulate soil too dry alert"}
          >
            <Plus className="w-3.5 h-3.5 text-red-400" />
            <Droplets className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">{isFr ? '+ Alerte Sol Sec' : '+ Dry Soil Alert'}</span>
          </button>

          <button
            onClick={() => handleSimulate('DISEASE')}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/70 text-amber-300 border border-amber-700/40 transition-colors shadow-xs"
            title={isFr ? "Simuler une alerte de maladie suspectée" : "Simulate disease suspicion alert"}
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">{isFr ? '+ Alerte Maladie' : '+ Disease Alert'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Soil Too Dry Card */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
          droughtAlertsCount > 0 ? 'bg-red-950/30 border-red-600/40' : 'bg-stone-950/60 border-stone-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              droughtAlertsCount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-stone-800 text-stone-400'
            }`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-300">
                {isFr ? 'Alertes Sol Trop Sec' : 'Soil Too Dry Alerts'}
              </div>
              <div className="text-lg font-bold font-mono text-stone-100">
                {droughtAlertsCount}
              </div>
            </div>
          </div>
          {droughtAlertsCount > 0 && (
            <span className="text-[10px] font-mono text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-700/50">
              URGENT
            </span>
          )}
        </div>

        {/* Disease Suspected Card */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
          diseaseAlertsCount > 0 ? 'bg-amber-950/30 border-amber-600/40' : 'bg-stone-950/60 border-stone-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              diseaseAlertsCount > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-800 text-stone-400'
            }`}>
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-300">
                {isFr ? 'Suspicions de Maladies' : 'Suspected Diseases'}
              </div>
              <div className="text-lg font-bold font-mono text-stone-100">
                {diseaseAlertsCount}
              </div>
            </div>
          </div>
          {diseaseAlertsCount > 0 && (
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-700/50">
              RISQUE ÉLEVÉ
            </span>
          )}
        </div>

        {/* Resolved Total */}
        <div className="p-3.5 rounded-xl border bg-stone-950/60 border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-stone-300">
                {isFr ? 'Alertes Traitées' : 'Resolved Alerts'}
              </div>
              <div className="text-lg font-bold font-mono text-stone-100">
                {alerts.filter((a) => a.isResolved).length}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            100% SÉCURISÉ
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-950/80 rounded-lg border border-stone-800 text-xs overflow-x-auto">
        <button
          onClick={() => setFilter('UNRESOLVED')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            filter === 'UNRESOLVED'
              ? 'bg-stone-800 text-stone-100 shadow-xs'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {isFr ? 'En cours d\'action' : 'Pending Action'} ({unresolvedCount})
        </button>
        <button
          onClick={() => setFilter('DROUGHT')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            filter === 'DROUGHT'
              ? 'bg-stone-800 text-stone-100 shadow-xs'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {isFr ? 'Sol trop sec' : 'Soil Too Dry'}
        </button>
        <button
          onClick={() => setFilter('DISEASE')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            filter === 'DISEASE'
              ? 'bg-stone-800 text-stone-100 shadow-xs'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {isFr ? 'Maladies suspectées' : 'Diseases Suspected'}
        </button>
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-stone-800 text-stone-100 shadow-xs'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {isFr ? 'Toutes les alertes' : 'All Alerts'} ({alerts.length})
        </button>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 bg-stone-950/40 rounded-xl border border-stone-800/60 text-stone-400 space-y-1">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-stone-200">
              {isFr ? 'Aucune alerte non résolue' : 'No unresolved alerts'}
            </div>
            <p className="text-xs text-stone-500">
              {isFr ? 'Toutes les parcelles sont dans les seuils hydriques et sanitaires nominaux.' : 'All parcels are operating within safe moisture and sanitary limits.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isDrought = alert.category === 'DROUGHT';
            const isDisease = alert.category === 'DISEASE';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.isResolved
                    ? 'bg-stone-950/40 border-stone-800/60 opacity-60'
                    : alert.severity === 'CRITICAL'
                    ? 'bg-gradient-to-r from-red-950/40 via-stone-900 to-stone-900 border-red-700/60 shadow-md shadow-red-950/20'
                    : 'bg-gradient-to-r from-amber-950/30 via-stone-900 to-stone-900 border-amber-700/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Left: Icon & Description */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      alert.isResolved
                        ? 'bg-stone-800 text-stone-400'
                        : isDrought
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                        : isDisease
                        ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                        : 'bg-stone-800 text-stone-300'
                    }`}>
                      {isDrought ? <Droplets className="w-5 h-5" /> : isDisease ? <Stethoscope className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-stone-400">
                          {alert.parcelName}
                        </span>
                        <span className="text-stone-600">·</span>
                        <span className="text-[11px] font-mono text-stone-500">
                          {alert.timestamp}
                        </span>
                        {alert.relatedValue && (
                          <span className="text-[10px] font-mono font-semibold bg-stone-950 px-2 py-0.5 rounded border border-stone-800 text-stone-300">
                            {alert.relatedValue}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-100 text-sm">
                        {alert.title}
                      </h4>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="pt-1.5 flex items-start gap-1.5 text-xs">
                        <span className="font-semibold text-emerald-400 flex-shrink-0">
                          {isFr ? 'Action recommandée :' : 'Recommended action:'}
                        </span>
                        <span className="text-stone-200">{alert.recommendedAction}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0 pt-2 md:pt-0">
                    {!alert.isResolved ? (
                      <>
                        {isDrought && (
                          <button
                            onClick={() => onTriggerIrrigationForAlert(alert.parcelId)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                          >
                            <Droplets className="w-3.5 h-3.5 fill-white" />
                            <span>{isFr ? 'Irriguer' : 'Irrigate'}</span>
                          </button>
                        )}

                        {isDisease && (
                          <button
                            onClick={onOpenVisionForAlert}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>{isFr ? 'Scanner' : 'Scan'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-lg border border-stone-700 transition-colors"
                          title={isFr ? "Marquer cette alerte comme résolue" : "Mark alert as resolved"}
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{isFr ? 'Acquitter' : 'Acknowledge'}</span>
                        </button>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-700/40">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isFr ? 'Alerte Traitée' : 'Resolved'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
