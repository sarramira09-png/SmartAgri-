export type Language = 'fr' | 'en';

export type CropType = 'tomato' | 'wheat' | 'grape' | 'apple' | 'corn';

export interface SoilTelemetry {
  depth10cm: number; // percentage % (e.g. 28%)
  depth30cm: number; // percentage % (e.g. 35%)
  depth60cm: number; // percentage % (e.g. 48%)
  temp10cm: number;  // °C
  temp30cm: number;  // °C
  ec: number;        // dS/m (Electrical Conductivity / Salinity)
  ph: number;        // pH level (e.g. 6.8)
  nitrogen: number;  // mg/kg
  phosphorus: number;// mg/kg
  potassium: number; // mg/kg
  fieldCapacity: number; // % (Capacité au champ)
  wiltingPoint: number;  // % (Point de flétrissement)
}

export interface WeatherTelemetry {
  ambientTemp: number;     // °C
  airHumidity: number;     // %
  solarRadiation: number;  // W/m²
  windSpeed: number;       // km/h
  windDirection: string;   // e.g. "N-NO"
  rainLast24h: number;     // mm
  rainForecast24h: number; // mm
  rainForecast72h: number; // mm
  et0: number;             // mm/day (Penman-Monteith reference evapotranspiration)
  vaporPressureDeficit: number; // kPa
}

export interface Parcel {
  id: string;
  name: string;
  cropName: string;
  variety: string;
  areaHectares: number;
  soilType: string;
  growthStageBBCH: string;
  stageName: string;
  irrigationType: 'DRIP' | 'PIVOT_SPRINKLER' | 'MICRO_SPRAY';
  sector: string;
  kcCoefficient: number; // Crop coefficient for ETc = ET0 * Kc
  valveStatus: 'CLOSED' | 'OPEN' | 'SCHEDULED';
  lastWateringDate: string;
  healthScore: number; // 0 - 100
  soil: SoilTelemetry;
  weather: WeatherTelemetry;
}

export interface PlantDiagnosis {
  healthStatus: 'HEALTHY' | 'EARLY_STRESS' | 'DISEASED' | 'DEFICIENCY' | 'PEST';
  primaryDiagnosis: string;
  pathogenType: 'FUNGAL' | 'BACTERIAL' | 'VIRAL' | 'NUTRITIONAL' | 'PEST' | 'NONE' | 'ABIOTIC';
  confidence: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  symptomsIdentified: string[];
  probableCauses: string[];
  organicTreatment: string;
  conventionalTreatment?: string;
  culturalActions: string[];
  irrigationImpact: string;
  summaryReasoning: string;
  urgencyLevel: 'IMMEDIATE' | 'WITHIN_48H' | 'MONITOR';
}

export interface CriticalAlert {
  type: 'WATER' | 'DISEASE' | 'WEATHER' | 'SOIL';
  level: 'INFO' | 'WARNING' | 'DANGER';
  message: string;
  actionRequired: string;
}

export interface IrrigationDecision {
  recommended: boolean;
  suggestedVolumeMm: number;
  durationMinutes: number;
  optimalWindow: string;
  triggerMethod: string;
  justification: string;
}

export interface AgentBulletin {
  executiveSummary: string;
  hydricStressLevel: 'OPTIMAL' | 'MILD_DEFICIT' | 'SEVERE_STRESS' | 'SATURATED';
  diseaseRiskIndex: number; // 0 - 100
  irrigationDecision: IrrigationDecision;
  criticalAlerts: CriticalAlert[];
  agronomicAdvices: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface LeafSample {
  id: string;
  title: string;
  crop: string;
  category: string;
  description: string;
  imageUri: string;
  defaultDiagnosis: PlantDiagnosis;
}

export type WeatherScenario = 'standard' | 'drought_heatwave' | 'heavy_rain' | 'mildew_high_humidity';

// 2. RECEIVE ALERTS DATA MODEL
export interface FarmerAlert {
  id: string;
  parcelId: string;
  parcelName: string;
  category: 'DROUGHT' | 'DISEASE' | 'TEMPERATURE' | 'EQUIPMENT';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  recommendedAction: string;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
  relatedValue?: string;
}

// 3. KEEP RECORDS (LOGBOOK) DATA MODEL
export type RecordType = 'MEASUREMENT' | 'DIAGNOSIS' | 'DISEASE' | 'IRRIGATION' | 'FIELD_NOTE';

export interface HistoricalRecord {
  id: string;
  timestamp: string;
  parcelId: string;
  parcelName: string;
  type: RecordType;
  title: string;
  summary: string;
  details: {
    soilMoisture10?: number;
    soilMoisture30?: number;
    soilMoisture60?: number;
    soilTemp?: number;
    airTemp?: number;
    et0?: number;
    diseaseDiagnosis?: string;
    pathogenType?: string;
    confidence?: number;
    severity?: string;
    imageThumbnail?: string;
    irrigationVolumeMm?: number;
    durationMinutes?: number;
    operator?: 'AI_AGENT' | 'FARMER';
    notes?: string;
  };
}
