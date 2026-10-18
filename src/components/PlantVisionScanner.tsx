import React, { useState } from 'react';
import { LeafSample, PlantDiagnosis, Language } from '../types/agri';
import { LEAF_SAMPLES } from '../data/agriData';
import { Camera, Sparkles, Upload, AlertTriangle, ShieldCheck, Check, Bug, Zap, Stethoscope, Droplets, ArrowRight } from 'lucide-react';

interface PlantVisionScannerProps {
  currentCropName: string;
  parcelName: string;
  language: Language;
  onApplyIrrigationInstruction?: (instruction: string) => void;
}

export const PlantVisionScanner: React.FC<PlantVisionScannerProps> = ({
  currentCropName,
  parcelName,
  language,
  onApplyIrrigationInstruction,
}) => {
  const isFr = language === 'fr';

  const [selectedSample, setSelectedSample] = useState<LeafSample>(LEAF_SAMPLES[0]);
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<PlantDiagnosis | null>(LEAF_SAMPLES[0].defaultDiagnosis);
  const [notes, setNotes] = useState<string>('');

  const currentActiveImage = customImageUri || selectedSample.imageUri;

  const handleSelectSample = (sample: LeafSample) => {
    setCustomImageUri(null);
    setSelectedSample(sample);
    setDiagnosis(sample.defaultDiagnosis);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomImageUri(result);
      runAiScan(result);
    };
    reader.readAsDataURL(file);
  };

  const runAiScan = async (imageToScan: string) => {
    setIsScanning(true);
    setDiagnosis(null);

    try {
      const response = await fetch('/api/diagnose-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageToScan,
          cropType: currentCropName,
          parcelName: parcelName,
          notes: notes,
          language: language,
        }),
      });

      const data = await response.json();
      if (data.success && data.diagnosis) {
        setDiagnosis(data.diagnosis);
      } else {
        // Fallback
        setDiagnosis(selectedSample.defaultDiagnosis);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setDiagnosis(selectedSample.defaultDiagnosis);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-700/60';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-700/60';
      case 'MODERATE':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-600/30 flex items-center justify-center text-emerald-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base flex items-center gap-2">
              <span>{isFr ? 'Vision IA & Diagnostic Pathologique Foliaire' : 'AI Plant Vision & Leaf Pathology'}</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded font-bold">
                Gemini 3.8 Flash
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              {isFr ? 'Détection précoce des maladies cryptogamiques, carences et stress foliaires' : 'Early detection of fungal pathogens, nutrient deficiencies & foliar stress'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFr ? 'Importer une photo' : 'Upload photo'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Image Viewer with HUD & Scanning Laser */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-950 aspect-[4/3] flex items-center justify-center group">
            {/* The Leaf Image */}
            <img
              src={currentActiveImage}
              alt="Leaf diagnostic target"
              className="w-full h-full object-cover"
            />

            {/* Neural HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="text-[10px] font-mono bg-stone-900/90 text-emerald-400 px-2 py-0.5 rounded border border-stone-700">
                  AI-VISION: ONLINE
                </div>
                <div className="text-[10px] font-mono bg-stone-900/90 text-stone-400 px-2 py-0.5 rounded border border-stone-700">
                  {currentCropName}
                </div>
              </div>

              {/* Center Crosshairs */}
              <div className="self-center flex items-center justify-center">
                <div className="w-24 h-24 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>

              <div className="flex justify-between items-end text-[10px] font-mono text-stone-400">
                <span>PARCELLE: {parcelName.slice(0, 15)}...</span>
                <span className="text-emerald-400">RGB 512x512</span>
              </div>
            </div>

            {/* Scanning Laser Line when scanning */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/80 animate-scanline pointer-events-none" />
            )}
          </div>

          {/* Trigger Scan Button */}
          <button
            onClick={() => runAiScan(currentActiveImage)}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>
              {isScanning
                ? (isFr ? 'Analyse phytopathologique en cours...' : 'Running AI neural pathology scan...')
                : (isFr ? 'Lancer le diagnostic IA par Gemini 3.8 Flash' : 'Run Gemini 3.8 Flash Diagnostic')}
            </span>
          </button>

          {/* Field Sample Selector Cards */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs text-stone-400 font-medium">
              {isFr ? 'Ou tester un cas d\'étude foliaire pré-chargé :' : 'Or test a pre-loaded field leaf sample:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              {LEAF_SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSample(s)}
                  className={`text-left p-2 rounded-lg border text-[11px] transition-all flex items-center gap-2 ${
                    !customImageUri && selectedSample.id === s.id
                      ? 'bg-stone-800 border-emerald-500 text-white'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <img src={s.imageUri} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 border border-stone-700" />
                  <span className="truncate font-medium">{s.title.split('—')[1] || s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnostic Dossier */}
        <div className="lg:col-span-7 space-y-4">
          {isScanning ? (
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
              <div className="font-semibold text-stone-200 text-sm">
                {isFr ? 'Gemini 3.8 Flash examine les tissus foliaires...' : 'Gemini 3.8 Flash examining foliar tissues...'}
              </div>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                {isFr
                  ? 'Analyse spectrale du limbe, détection des hyphes mycéliens, calcul des chloroses et corrélation avec l\'humidité ambiante.'
                  : 'Foliar spectral analysis, mycelial hyphae detection, chlorosis quantification and humidity correlation.'}
              </p>
            </div>
          ) : diagnosis ? (
            <div className="space-y-4">
              {/* Primary Header Card */}
              <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                      {diagnosis.pathogenType}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadge(diagnosis.severity)}`}>
                      {isFr ? `SÉVÉRITÉ : ${diagnosis.severity}` : `SEVERITY: ${diagnosis.severity}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{diagnosis.confidence}% {isFr ? 'confiance' : 'confidence'}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>{diagnosis.primaryDiagnosis}</span>
                </h3>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {diagnosis.summaryReasoning}
                </p>
              </div>

              {/* Observed Symptoms List */}
              <div className="bg-stone-950/50 border border-stone-800/80 rounded-xl p-3.5">
                <span className="text-xs font-semibold text-stone-200 block mb-2">
                  {isFr ? 'Symptômes foliaires identifiés par la vision :' : 'Visible symptoms detected:'}
                </span>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {diagnosis.symptomsIdentified.map((sym, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Treatment Protocols (Biocontrol & Conventional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Organic / Biocontrol */}
                <div className="bg-emerald-950/20 border border-emerald-600/30 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isFr ? 'Protocole Biocontrôle / Bio' : 'Biocontrol / Organic Solution'}</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {diagnosis.organicTreatment}
                  </p>
                </div>

                {/* Cultural Practices */}
                <div className="bg-stone-950/50 border border-stone-800 rounded-xl p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200 mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isFr ? 'Mesures Culturales Immédiates' : 'Cultural Preventative Actions'}</span>
                  </div>
                  <ul className="text-xs text-stone-300 space-y-1">
                    {diagnosis.culturalActions.slice(0, 2).map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-stone-500">·</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CRITICAL: Direct Irrigation Impact Box */}
              <div className="bg-gradient-to-r from-cyan-950/70 via-stone-950/90 to-blue-950/60 border border-cyan-500/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    {isFr ? 'Impact direct sur la stratégie d\'irrigation' : 'Direct Impact on Irrigation Scheduling'}
                  </span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-medium">
                  {diagnosis.irrigationImpact}
                </p>

                {onApplyIrrigationInstruction && (
                  <button
                    onClick={() => onApplyIrrigationInstruction(diagnosis.irrigationImpact)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>{isFr ? 'Appliquer cette consigne au contrôleur d\'arrosage' : 'Apply to irrigation controller'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
