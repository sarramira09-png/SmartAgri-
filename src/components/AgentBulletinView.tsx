import React, { useState } from 'react';
import { AgentBulletin, Parcel, Language } from '../types/agri';
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Droplets, ShieldAlert, ArrowRight, Lightbulb } from 'lucide-react';

interface AgentBulletinViewProps {
  parcel: Parcel;
  bulletin: AgentBulletin;
  onRefreshBulletin: () => void;
  isLoading: boolean;
  onApplyIrrigation: (volumeMm: number) => void;
  language: Language;
}

export const AgentBulletinView: React.FC<AgentBulletinViewProps> = ({
  parcel,
  bulletin,
  onRefreshBulletin,
  isLoading,
  onApplyIrrigation,
  language,
}) => {
  const isFr = language === 'fr';

  const getHydricStressBadge = (stress: string) => {
    switch (stress) {
      case 'SEVERE_STRESS':
        return {
          label: isFr ? 'Stress Hydrique Sévère' : 'Severe Hydric Stress',
          classes: 'bg-red-950 text-red-300 border-red-700/60',
        };
      case 'MILD_DEFICIT':
        return {
          label: isFr ? 'Déficit Hydrique Modéré' : 'Mild Moisture Deficit',
          classes: 'bg-amber-950 text-amber-300 border-amber-700/60',
        };
      case 'SATURATED':
        return {
          label: isFr ? 'Sol Saturé (Risque Asphyxie)' : 'Saturated Soil',
          classes: 'bg-blue-950 text-blue-300 border-blue-700/60',
        };
      default:
        return {
          label: isFr ? 'Confort Hydrique Optimal' : 'Optimal Hydric Comfort',
          classes: 'bg-emerald-950 text-emerald-300 border-emerald-700/60',
        };
    }
  };

  const hydricBadge = getHydricStressBadge(bulletin.hydricStressLevel);

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-emerald-950/30 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base flex items-center gap-2">
              <span>{isFr ? 'Synthèse de l\'Agent Intelligent SmartAgri' : 'SmartAgri AI Agronomic Intelligence'}</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-bold">
                Multi-Source Fusion
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              {isFr ? 'Fusion continue : Sondes de sol + Station météo locale + Diagnostics foliaires' : 'Continuous fusion: Soil probes + local weather station + leaf pathology'}
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshBulletin}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? (isFr ? 'Calcul en cours...' : 'Synthesizing...') : (isFr ? 'Actualiser le bilan' : 'Refresh Bulletin')}</span>
        </button>
      </div>

      {/* Primary Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Hydric Stress Status */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
            {isFr ? 'État Hydrique de la Culture' : 'Crop Hydric Status'}
          </div>
          <div className="pt-1">
            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border inline-block ${hydricBadge.classes}`}>
              {hydricBadge.label}
            </span>
          </div>
          <p className="text-xs text-stone-400 pt-1">
            {isFr ? 'Calculé d\'après la tension d\'eau à 30cm et l\'ET0 du jour.' : 'Based on 30cm matric tension & daily ET0.'}
          </p>
        </div>

        {/* Fungal Disease Risk Meter */}
        <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 uppercase tracking-wider">
            <span>{isFr ? 'Indice Risque Fongique' : 'Fungal Disease Risk'}</span>
            <span className={`font-bold ${bulletin.diseaseRiskIndex > 70 ? 'text-red-400' : bulletin.diseaseRiskIndex > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {bulletin.diseaseRiskIndex}/100
            </span>
          </div>
          <div className="pt-1.5">
            <div className="h-2.5 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${
                  bulletin.diseaseRiskIndex > 70
                    ? 'bg-red-500'
                    : bulletin.diseaseRiskIndex > 40
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${bulletin.diseaseRiskIndex}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-stone-400 pt-1">
            {bulletin.diseaseRiskIndex > 70
              ? (isFr ? 'Risque sporulation critique (hygrométrie nocturne persistante)' : 'Critical spore risk due to sustained humidity')
              : (isFr ? 'Atmosphère aérée, faible risque de propagation' : 'Well aerated canopy, low spread risk')}
          </p>
        </div>

        {/* Irrigation Recommendation Callout */}
        <div className={`rounded-xl p-3.5 border flex flex-col justify-between ${
          bulletin.irrigationDecision.recommended
            ? 'bg-cyan-950/40 border-cyan-500/40'
            : 'bg-stone-950/70 border-stone-800'
        }`}>
          <div>
            <div className="text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
              {isFr ? 'Décision d\'Irrigation Prédictive' : 'Predictive Irrigation Decision'}
            </div>
            <div className="text-sm font-bold text-stone-100 mt-1">
              {bulletin.irrigationDecision.recommended ? (
                <span className="text-cyan-300">
                  {isFr ? `Irriguer ${bulletin.irrigationDecision.suggestedVolumeMm} mm (${bulletin.irrigationDecision.durationMinutes} min)` : `Irrigate ${bulletin.irrigationDecision.suggestedVolumeMm} mm`}
                </span>
              ) : (
                <span className="text-emerald-400">
                  {isFr ? 'Maintien vannes fermées' : 'Keep valves closed'}
                </span>
              )}
            </div>
          </div>

          {bulletin.irrigationDecision.recommended && (
            <button
              onClick={() => onApplyIrrigation(bulletin.irrigationDecision.suggestedVolumeMm)}
              className="mt-2 inline-flex items-center justify-between text-xs font-semibold text-cyan-300 bg-cyan-900/60 hover:bg-cyan-800/60 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>{isFr ? 'Déclencher la vanne immédiatement' : 'Trigger valve now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Executive Summary Narrative */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4">
        <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isFr ? 'Avis de l\'Agent Agronomique' : 'Agronomist Agent Executive Bulletin'}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
          {bulletin.executiveSummary}
        </p>
      </div>

      {/* Prioritized Action Alerts */}
      {bulletin.criticalAlerts.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-stone-300">
            {isFr ? 'Alertes & Actions Prioritaires Recommandées :' : 'Prioritized Field Actions & Alerts:'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {bulletin.criticalAlerts.map((alert, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  alert.level === 'DANGER'
                    ? 'bg-red-950/40 border-red-700/50 text-red-200'
                    : alert.level === 'WARNING'
                    ? 'bg-amber-950/40 border-amber-700/50 text-amber-200'
                    : 'bg-stone-950/60 border-stone-800 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold uppercase tracking-wider">{alert.type}</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40">{alert.level}</span>
                </div>
                <div className="font-semibold text-stone-100">{alert.message}</div>
                <div className="text-[11px] opacity-80">
                  <span className="font-medium text-stone-300">{isFr ? 'Action requise :' : 'Action required:'}</span> {alert.actionRequired}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agronomic Best Practices List */}
      <div className="bg-stone-950/50 border border-stone-800/80 rounded-xl p-3.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{isFr ? 'Conseils Pratiques du Jour pour l\'Exploitant :' : 'Today\'s Practical Field Guidance:'}</span>
        </div>
        <ul className="space-y-1.5 text-xs text-stone-300">
          {bulletin.agronomicAdvices.map((advice, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <span>{advice}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
