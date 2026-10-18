import React, { useState, useEffect } from 'react';
import { Parcel, WeatherScenario, Language, AgentBulletin, FarmerAlert, HistoricalRecord, RecordType } from './types/agri';
import { INITIAL_PARCELS, INITIAL_ALERTS, INITIAL_RECORDS, SCENARIO_PRESETS } from './data/agriData';
import { Header } from './components/Header';
import { ParcelSelector } from './components/ParcelSelector';
import { SoilSensorMonitor } from './components/SoilSensorMonitor';
import { WeatherStation } from './components/WeatherStation';
import { IrrigationController } from './components/IrrigationController';
import { PlantVisionScanner } from './components/PlantVisionScanner';
import { AgentBulletinView } from './components/AgentBulletinView';
import { AgriChatAdvisor } from './components/AgriChatAdvisor';
import { AlertsCenter } from './components/AlertsCenter';
import { RecordsLogbook } from './components/RecordsLogbook';
import { EnvironmentSimulatorModal } from './components/EnvironmentSimulatorModal';
import {
  Activity,
  Bell,
  ClipboardList,
  Layers,
  Droplet,
  Camera,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Thermometer,
  Flame,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('fr');
  const isFr = language === 'fr';

  const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);
  const [selectedParcelId, setSelectedParcelId] = useState<string>(INITIAL_PARCELS[0].id);
  const [activeScenario, setActiveScenario] = useState<WeatherScenario>('standard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [totalWaterSavedM3, setTotalWaterSavedM3] = useState<number>(1420);

  // Core 3 Pillars Navigation Tabs:
  // 1. 'monitor' (Monitor crops: soil humidity, temperature, crop conditions)
  // 2. 'alerts'  (Receive alerts: soil too dry, disease suspected)
  // 3. 'records' (Keep records: measurements, diagnoses, previous actions)
  // + 'vision', 'irrigation', 'chat'
  const [activeNavTab, setActiveNavTab] = useState<'monitor' | 'alerts' | 'records' | 'vision' | 'irrigation' | 'chat'>('monitor');

  // Currently selected parcel
  const currentParcel = parcels.find((p) => p.id === selectedParcelId) || parcels[0];

  // Dynamic Agent Bulletin
  const [bulletin, setBulletin] = useState<AgentBulletin | null>(null);
  const [isLoadingBulletin, setIsLoadingBulletin] = useState<boolean>(false);

  // 2. Alerts state with persistent memory
  const [alerts, setAlerts] = useState<FarmerAlert[]>(() => {
    try {
      const saved = localStorage.getItem('smartagri_alerts');
      return saved ? JSON.parse(saved) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  // 3. Records state with persistent memory
  const [records, setRecords] = useState<HistoricalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('smartagri_records');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  // Save alerts and records
  useEffect(() => {
    try {
      localStorage.setItem('smartagri_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('Could not save alerts to localStorage', e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('smartagri_records', JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save records to localStorage', e);
    }
  }, [records]);

  // Fetch Agent Bulletin
  const fetchAgentBulletin = async (parcelToAnalyze: Parcel) => {
    setIsLoadingBulletin(true);
    try {
      const response = await fetch('/api/agent-bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcel: {
            id: parcelToAnalyze.id,
            name: parcelToAnalyze.name,
            crop: parcelToAnalyze.cropName,
            variety: parcelToAnalyze.variety,
            stage: `${parcelToAnalyze.growthStageBBCH} - ${parcelToAnalyze.stageName}`,
            sector: parcelToAnalyze.sector,
            irrigationType: parcelToAnalyze.irrigationType,
            area: parcelToAnalyze.areaHectares,
          },
          soilTelemetry: parcelToAnalyze.soil,
          weatherTelemetry: parcelToAnalyze.weather,
          language: language,
        }),
      });

      const data = await response.json();
      if (data.success && data.bulletin) {
        setBulletin(data.bulletin);
      }
    } catch (err) {
      console.error('Failed to fetch bulletin:', err);
    } finally {
      setIsLoadingBulletin(false);
    }
  };

  useEffect(() => {
    fetchAgentBulletin(currentParcel);
  }, [selectedParcelId, language]);

  // Scenario Simulator
  const handleSelectScenario = (scenario: WeatherScenario) => {
    setActiveScenario(scenario);
    const preset = SCENARIO_PRESETS[scenario];

    setParcels((prev) =>
      prev.map((p) => ({
        ...p,
        soil: {
          ...p.soil,
          depth10cm: Math.max(10, Math.min(80, preset.soilDelta.depth10cm)),
          depth30cm: Math.max(14, Math.min(75, preset.soilDelta.depth30cm)),
          depth60cm: Math.max(20, Math.min(85, preset.soilDelta.depth60cm)),
          temp10cm: preset.soilDelta.temp10cm,
        },
        weather: {
          ...p.weather,
          ambientTemp: preset.weatherDelta.ambientTemp,
          airHumidity: preset.weatherDelta.airHumidity,
          solarRadiation: preset.weatherDelta.solarRadiation,
          rainForecast24h: preset.weatherDelta.rainForecast24h,
          et0: preset.weatherDelta.et0,
        },
      }))
    );

    // If drought scenario, push a new high-priority alert!
    if (scenario === 'drought_heatwave') {
      const newDroughtAlert: FarmerAlert = {
        id: `alert-drought-${Date.now()}`,
        parcelId: currentParcel.id,
        parcelName: currentParcel.name,
        category: 'DROUGHT',
        severity: 'CRITICAL',
        title: isFr ? 'ALERTE CANICULE : Sol excessivement sec (< 20%)' : 'HEATWAVE ALERT: Soil critically dry (< 20%)',
        description: isFr
          ? 'Température de l\'air à 35.8°C et humidité 28%. La réserve utile racinaire est presque tarie. Risque de flétrissement permanent.'
          : 'Air temperature 35.8°C with 28% RH. Readily available water almost depleted. Risk of permanent wilting.',
        recommendedAction: isFr ? 'Déclencher d\'urgence un tour d\'eau de 20 mm ce soir à la fraîche' : 'Trigger urgent 20mm night-time irrigation',
        timestamp: isFr ? 'À l\'instant' : 'Just now',
        isRead: false,
        isResolved: false,
        relatedValue: 'Humidité 30cm: 20%',
      };
      setAlerts((prev) => [newDroughtAlert, ...prev]);
    } else if (scenario === 'mildew_high_humidity') {
      const newMildewAlert: FarmerAlert = {
        id: `alert-mildew-${Date.now()}`,
        parcelId: currentParcel.id,
        parcelName: currentParcel.name,
        category: 'DISEASE',
        severity: 'CRITICAL',
        title: isFr ? 'ALERTE MALADIE : Risque Mildiou Imminent (Hygrométrie 93%)' : 'DISEASE ALERT: Imminent Mildew Risk (Humidity 93%)',
        description: isFr
          ? 'Humectation foliaire prolongée favorisant la germination des spores. Interdiction de tout arrosage par aspersion.'
          : 'Prolonged leaf wetness favoring spore germination. Prohibit overhead sprinkler irrigation.',
        recommendedAction: isFr ? 'Inspection foliaire avec SmartAgri Vision & traitement préventif bio' : 'Foliar inspection with SmartAgri Vision & bio treatment',
        timestamp: isFr ? 'À l\'instant' : 'Just now',
        isRead: false,
        isResolved: false,
        relatedValue: 'Risque cryptogamique: 94/100',
      };
      setAlerts((prev) => [newMildewAlert, ...prev]);
    }

    // Automatically store measurement snapshot in records
    const newMeasurementRecord: HistoricalRecord = {
      id: `rec-meas-${Date.now()}`,
      timestamp: isFr ? 'À l\'instant' : 'Just now',
      parcelId: currentParcel.id,
      parcelName: currentParcel.name,
      type: 'MEASUREMENT',
      title: isFr ? `Mesures de sol & météo actualisées (${preset.nameFr})` : `Updated soil & weather telemetry (${preset.nameEn})`,
      summary: isFr
        ? `Sonde 10cm: ${preset.soilDelta.depth10cm}%, 30cm: ${preset.soilDelta.depth30cm}%, Air: ${preset.weatherDelta.ambientTemp}°C, ET0: ${preset.weatherDelta.et0} mm/j.`
        : `Probe 10cm: ${preset.soilDelta.depth10cm}%, 30cm: ${preset.soilDelta.depth30cm}%, Air: ${preset.weatherDelta.ambientTemp}°C, ET0: ${preset.weatherDelta.et0} mm/day.`,
      details: {
        soilMoisture10: preset.soilDelta.depth10cm,
        soilMoisture30: preset.soilDelta.depth30cm,
        soilMoisture60: preset.soilDelta.depth60cm,
        soilTemp: preset.soilDelta.temp10cm,
        airTemp: preset.weatherDelta.ambientTemp,
        et0: preset.weatherDelta.et0,
      },
    };
    setRecords((prev) => [newMeasurementRecord, ...prev]);
  };

  // Toggle Valve & Automatically log to records
  const handleToggleValve = (parcelId: string, open: boolean, doseMm: number = 15) => {
    setParcels((prev) =>
      prev.map((p) => {
        if (p.id === parcelId) {
          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          return {
            ...p,
            valveStatus: open ? 'OPEN' : 'CLOSED',
            lastWateringDate: open ? `${isFr ? 'Aujourd\'hui à' : 'Today at'} ${timeString} (${doseMm} mm)` : p.lastWateringDate,
            soil: {
              ...p.soil,
              depth10cm: open ? Math.min(65, p.soil.depth10cm + 6) : p.soil.depth10cm,
              depth30cm: open ? Math.min(60, p.soil.depth30cm + Math.round(doseMm * 0.7)) : p.soil.depth30cm,
            },
          };
        }
        return p;
      })
    );

    if (open) {
      setTotalWaterSavedM3((prev) => prev + 12);

      // Automatically store in Records logbook!
      const targetParcel = parcels.find((p) => p.id === parcelId) || currentParcel;
      const newActionRecord: HistoricalRecord = {
        id: `rec-irr-${Date.now()}`,
        timestamp: isFr ? 'À l\'instant' : 'Just now',
        parcelId: targetParcel.id,
        parcelName: targetParcel.name,
        type: 'IRRIGATION',
        title: isFr ? `Déclenchement d'irrigation (${doseMm} mm)` : `Irrigation cycle triggered (${doseMm} mm)`,
        summary: isFr
          ? `Électrovanne ouverte sur le secteur ${targetParcel.sector} pour un apport de ${doseMm} mm (${Math.round(doseMm * 14)} min). Réserve utile en reconstitution.`
          : `Valve opened on sector ${targetParcel.sector} for ${doseMm} mm (${Math.round(doseMm * 14)} min). Moisture being replenished.`,
        details: {
          irrigationVolumeMm: doseMm,
          durationMinutes: Math.round(doseMm * 14),
          operator: 'FARMER',
          notes: isFr ? `Piloté depuis l'interface SmartAgri` : `Triggered via SmartAgri dashboard`,
        },
      };
      setRecords((prev) => [newActionRecord, ...prev]);

      // Resolve any drought alert for this parcel
      setAlerts((prev) =>
        prev.map((a) => (a.parcelId === parcelId && a.category === 'DROUGHT' ? { ...a, isResolved: true } : a))
      );
    }
  };

  // Add simulated alert
  const handleAddSimulatedAlert = (category: 'DROUGHT' | 'DISEASE') => {
    if (category === 'DROUGHT') {
      const newAlert: FarmerAlert = {
        id: `alert-${Date.now()}`,
        parcelId: currentParcel.id,
        parcelName: currentParcel.name,
        category: 'DROUGHT',
        severity: 'CRITICAL',
        title: isFr ? `Sol trop sec : Déficit racinaire à 30cm (${currentParcel.name})` : `Soil too dry: Root moisture deficit (${currentParcel.name})`,
        description: isFr
          ? `L'humidité mesurée par la sonde capacitive est tombée à ${currentParcel.soil.depth30cm}%, proche du point de flétrissement permanent.`
          : `Soil capacitive probe reached ${currentParcel.soil.depth30cm}%, nearing permanent wilting point.`,
        recommendedAction: isFr ? 'Déclencher une irrigation de 16 mm sans attendre' : 'Trigger 16mm irrigation without delay',
        timestamp: isFr ? 'À l\'instant' : 'Just now',
        isRead: false,
        isResolved: false,
        relatedValue: `Humidité: ${currentParcel.soil.depth30cm}%`,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    } else {
      const newAlert: FarmerAlert = {
        id: `alert-${Date.now()}`,
        parcelId: currentParcel.id,
        parcelName: currentParcel.name,
        category: 'DISEASE',
        severity: 'CRITICAL',
        title: isFr ? `Suspicion de Mildiou / Risque Cryptogamique Élevé` : `Suspected Disease / High Fungal Risk Alert`,
        description: isFr
          ? `Hygrométrie persistante > 88% et feuillage mouillé. Risque de contamination des grappes ou folioles.`
          : `Persistent humidity > 88% and wet foliage. Contamination risk for leaves or fruit clusters.`,
        recommendedAction: isFr ? 'Proscrire l\'aspersion et réaliser un scan foliaire' : 'Halt overhead sprinkling & inspect leaves',
        timestamp: isFr ? 'À l\'instant' : 'Just now',
        isRead: false,
        isResolved: false,
        relatedValue: 'Indice risque: 92/100',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a)));
  };

  const handleAddManualRecord = (record: Omit<HistoricalRecord, 'id' | 'timestamp'>) => {
    const newRec: HistoricalRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      timestamp: isFr ? 'Aujourd\'hui' : 'Today',
    };
    setRecords((prev) => [newRec, ...prev]);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isResolved).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased">
      {/* Top Application Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        activeScenario={activeScenario}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        totalWaterSavedM3={totalWaterSavedM3}
        unreadAlertsCount={unreadAlertsCount}
        onOpenAlerts={() => setActiveNavTab('alerts')}
        onOpenRecords={() => setActiveNavTab('records')}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Parcel Selector Bar */}
        <ParcelSelector
          parcels={parcels}
          selectedParcelId={selectedParcelId}
          onSelectParcel={setSelectedParcelId}
          language={language}
        />

        {/* 3 Core Pillars Navigation Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 min-w-max">
            {/* 1. MONITOR CROPS */}
            <button
              onClick={() => setActiveNavTab('monitor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNavTab === 'monitor'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-300" />
              <span>{isFr ? '1. Surveiller les cultures' : '1. Monitor Crops'}</span>
            </button>

            {/* 2. RECEIVE ALERTS */}
            <button
              onClick={() => setActiveNavTab('alerts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activeNavTab === 'alerts'
                  ? 'bg-red-700 text-white shadow-md'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{isFr ? '2. Recevoir les alertes' : '2. Receive Alerts'}</span>
              {unreadAlertsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-[11px] font-bold text-white flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* 3. KEEP RECORDS */}
            <button
              onClick={() => setActiveNavTab('records')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNavTab === 'records'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300'
              }`}
            >
              <ClipboardList className="w-4 h-4 text-cyan-400" />
              <span>{isFr ? '3. Registre & Historique' : '3. Keep Records'}</span>
              <span className="text-[10px] font-mono bg-stone-800 px-1.5 py-0.5 rounded text-stone-300">
                {records.length}
              </span>
            </button>

            {/* Divider */}
            <div className="h-5 w-px bg-stone-800 mx-1" />

            {/* Plant Vision */}
            <button
              onClick={() => setActiveNavTab('vision')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNavTab === 'vision'
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? 'Scan Foliaire' : 'Leaf Vision'}</span>
            </button>

            {/* Irrigation Actuator */}
            <button
              onClick={() => setActiveNavTab('irrigation')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNavTab === 'irrigation'
                  ? 'bg-stone-800 text-cyan-400 border border-cyan-500/40 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Droplet className={`w-3.5 h-3.5 ${currentParcel.valveStatus === 'OPEN' ? 'text-cyan-400 animate-bounce' : ''}`} />
              <span>{isFr ? 'Vanne & Arrosage' : 'Irrigation Valve'}</span>
            </button>

            {/* AI Agronomist Chat */}
            <button
              onClick={() => setActiveNavTab('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNavTab === 'chat'
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFr ? 'Conseiller IA' : 'AI Chat'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 1: MONITOR CROPS (Soil humidity, temperature, crop conditions)   */}
        {/* ========================================================================= */}
        {activeNavTab === 'monitor' && (
          <div className="space-y-6">
            {/* Quick Vital Cards: Soil Humidity, Temperatures, Crop Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Soil Humidity (3 depths) */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold flex items-center gap-1.5 text-cyan-400">
                    <Droplet className="w-4 h-4" />
                    {isFr ? 'Humidité du Sol' : 'Soil Humidity'}
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">Sondes FDR</span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-100 flex items-baseline gap-2">
                  <span>{currentParcel.soil.depth30cm}%</span>
                  <span className="text-xs font-normal text-stone-400">
                    ({isFr ? 'racine 30cm' : '30cm root'})
                  </span>
                </div>
                <div className="text-[11px] font-mono text-stone-400 flex justify-between pt-1 border-t border-stone-800">
                  <span>10cm: {currentParcel.soil.depth10cm}%</span>
                  <span className="text-emerald-400 font-bold">30cm: {currentParcel.soil.depth30cm}%</span>
                  <span>60cm: {currentParcel.soil.depth60cm}%</span>
                </div>
              </div>

              {/* Card 2: Temperatures (Soil & Ambient) */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold flex items-center gap-1.5 text-amber-400">
                    <Thermometer className="w-4 h-4" />
                    {isFr ? 'Températures' : 'Temperatures'}
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">Sol & Air</span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-100 flex items-baseline gap-2">
                  <span>{currentParcel.weather.ambientTemp}°C</span>
                  <span className="text-xs font-normal text-stone-400">
                    ({isFr ? 'Air ambiant' : 'Air temp'})
                  </span>
                </div>
                <div className="text-[11px] font-mono text-stone-400 flex justify-between pt-1 border-t border-stone-800">
                  <span>Sol 10cm: {currentParcel.soil.temp10cm}°C</span>
                  <span>Sol 30cm: {currentParcel.soil.temp30cm}°C</span>
                </div>
              </div>

              {/* Card 3: Crop Conditions & Vigor */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    {isFr ? 'État de la Culture' : 'Crop Conditions'}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">{currentParcel.growthStageBBCH}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-100 flex items-baseline gap-2">
                  <span>{currentParcel.healthScore}%</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {currentParcel.healthScore >= 80 ? (isFr ? 'Végétation saine' : 'Healthy canopy') : (isFr ? 'Stress détecté' : 'Stress detected')}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800 truncate">
                  {currentParcel.stageName}
                </div>
              </div>

              {/* Card 4: Water Balance & ET0 */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-semibold flex items-center gap-1.5 text-blue-400">
                    <Activity className="w-4 h-4" />
                    {isFr ? 'Besoins Hydriques' : 'Hydric Balance'}
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">Penman-Monteith</span>
                </div>
                <div className="text-2xl font-bold font-mono text-stone-100 flex items-baseline gap-2">
                  <span>{currentParcel.weather.et0}</span>
                  <span className="text-xs font-normal text-stone-400">mm/jour (ET0)</span>
                </div>
                <div className="text-[11px] font-mono text-stone-400 flex justify-between pt-1 border-t border-stone-800">
                  <span>ETc: {(currentParcel.weather.et0 * currentParcel.kcCoefficient).toFixed(1)} mm</span>
                  <span>Pluie 24h: {currentParcel.weather.rainForecast24h} mm</span>
                </div>
              </div>
            </div>

            {/* AI Agent Synthesis Bulletin */}
            {bulletin && (
              <AgentBulletinView
                parcel={currentParcel}
                bulletin={bulletin}
                onRefreshBulletin={() => fetchAgentBulletin(currentParcel)}
                isLoading={isLoadingBulletin}
                onApplyIrrigation={(vol) => {
                  handleToggleValve(currentParcel.id, true, vol);
                  setActiveNavTab('irrigation');
                }}
                language={language}
              />
            )}

            {/* Detailed Soil Telemetry & Weather Stations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <SoilSensorMonitor
                  soil={currentParcel.soil}
                  language={language}
                  parcelName={currentParcel.name}
                />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <WeatherStation
                  weather={currentParcel.weather}
                  kcCoefficient={currentParcel.kcCoefficient}
                  cropName={currentParcel.cropName}
                  language={language}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 2: RECEIVE ALERTS (Soil too dry, disease suspected)                */}
        {/* ========================================================================= */}
        {activeNavTab === 'alerts' && (
          <div className="space-y-6">
            <AlertsCenter
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onTriggerIrrigationForAlert={(pId) => {
                handleToggleValve(pId, true, 18);
                setActiveNavTab('irrigation');
              }}
              onOpenVisionForAlert={() => setActiveNavTab('vision')}
              onAddSimulatedAlert={handleAddSimulatedAlert}
              language={language}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 3: KEEP RECORDS (Store measurements, diagnoses, previous actions) */}
        {/* ========================================================================= */}
        {activeNavTab === 'records' && (
          <div className="space-y-6">
            <RecordsLogbook
              records={records}
              parcels={parcels}
              onAddRecord={handleAddManualRecord}
              language={language}
            />
          </div>
        )}

        {/* Additional Features: Leaf Pathology Vision Scanner */}
        {activeNavTab === 'vision' && (
          <div className="space-y-6">
            <PlantVisionScanner
              currentCropName={currentParcel.cropName}
              parcelName={currentParcel.name}
              language={language}
              onApplyIrrigationInstruction={() => {
                handleToggleValve(currentParcel.id, false);
                setActiveNavTab('irrigation');
              }}
            />
          </div>
        )}

        {/* Additional Features: Irrigation Actuator Controller */}
        {activeNavTab === 'irrigation' && (
          <div className="space-y-6">
            <IrrigationController
              parcel={currentParcel}
              decision={bulletin?.irrigationDecision}
              onToggleValve={handleToggleValve}
              language={language}
            />
          </div>
        )}

        {/* Additional Features: AI Consultant Chat */}
        {activeNavTab === 'chat' && (
          <div className="space-y-6">
            <AgriChatAdvisor
              currentParcel={currentParcel}
              language={language}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-900/60 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-400">SmartAgri AI</span>
            <span>·</span>
            <span>{isFr ? 'Interface Agent-Exploitant : Surveillance, Alertes & Registre' : 'Farmer-Agent Interface: Monitoring, Alerts & Records'}</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>LoRaWAN 868MHz</span>
            <span>·</span>
            <span>FAO-56 Penman-Monteith</span>
            <span>·</span>
            <span className="text-emerald-400">Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Climate & Weather Scenario Simulator Modal */}
      <EnvironmentSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        language={language}
      />
    </div>
  );
}
