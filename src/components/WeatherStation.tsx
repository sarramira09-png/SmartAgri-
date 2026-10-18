import React from 'react';
import { WeatherTelemetry, Language } from '../types/agri';
import { CloudSun, Sun, Wind, Droplets, CloudRain, Gauge, Compass } from 'lucide-react';

interface WeatherStationProps {
  weather: WeatherTelemetry;
  kcCoefficient: number;
  cropName: string;
  language: Language;
}

export const WeatherStation: React.FC<WeatherStationProps> = ({
  weather,
  kcCoefficient,
  cropName,
  language,
}) => {
  const isFr = language === 'fr';

  // Calculate Crop Evapotranspiration ETc
  const etc = parseFloat((weather.et0 * kcCoefficient).toFixed(1));
  const dailyBalance = parseFloat((weather.rainLast24h - etc).toFixed(1));

  // Determine spray drift risk based on French phytosanitary regulation (< 19 km/h permissible)
  const isWindAcceptableForSpraying = weather.windSpeed <= 19;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Station Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-600/30 flex items-center justify-center text-sky-400">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base">
              {isFr ? 'Station Météo Hyperlocale & Évapotranspiration' : 'Hyperlocal Weather & Evapotranspiration'}
            </h2>
            <p className="text-xs text-stone-400">
              {isFr ? 'Modèle FAO Penman-Monteith (ET0 & ETc en temps réel)' : 'FAO Penman-Monteith reference ET0 & crop ETc'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono bg-stone-950/80 px-2.5 py-1 rounded-lg border border-stone-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Station Météo #4G-AGRI</span>
        </div>
      </div>

      {/* Main Hydric Balance Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-stone-950/80 to-emerald-950/40 border border-sky-700/30 rounded-xl p-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-800">
          {/* ET0 Reference */}
          <div className="text-center sm:text-left sm:pr-3">
            <div className="text-[11px] font-mono text-stone-400">ET0 Référence (Gazon standard)</div>
            <div className="text-2xl font-bold font-mono text-stone-100 mt-0.5">
              {weather.et0} <span className="text-xs font-normal text-stone-400">mm/jour</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Rayonnement: <span className="text-amber-400 font-mono font-medium">{weather.solarRadiation} W/m²</span>
            </div>
          </div>

          {/* ETc Crop adjusted */}
          <div className="pt-2 sm:pt-0 sm:px-3 text-center sm:text-left">
            <div className="text-[11px] font-mono text-emerald-400">
              ETc Culture (Kc {kcCoefficient})
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
              {etc} <span className="text-xs font-normal text-emerald-500">mm/jour</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1 truncate">
              {isFr ? 'Besoin hydrique net de la plante' : 'Net plant transpiration need'}
            </div>
          </div>

          {/* Daily Hydric Balance */}
          <div className="pt-2 sm:pt-0 sm:pl-3 text-center sm:text-left">
            <div className="text-[11px] font-mono text-stone-400">
              {isFr ? 'Bilan Hydrique Journalier' : 'Daily Hydric Balance'}
            </div>
            <div className={`text-2xl font-bold font-mono mt-0.5 ${dailyBalance < -3 ? 'text-amber-400' : 'text-cyan-400'}`}>
              {dailyBalance > 0 ? `+${dailyBalance}` : dailyBalance}{' '}
              <span className="text-xs font-normal text-stone-400">mm</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              {dailyBalance < -3
                ? isFr ? 'Déficit accentué par le vent et le soleil' : 'Deficit amplified by wind & heat'
                : isFr ? 'Perte hydrique compensée' : 'Hydric loss balanced'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Microclimate Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Air Temp & VPD */}
        <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              {isFr ? 'Air Ambiant' : 'Air Temp'}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-stone-100">
            {weather.ambientTemp}° <span className="text-xs font-normal text-stone-400">C</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1 font-mono">
            VPD: <span className="text-amber-400">{weather.vaporPressureDeficit} kPa</span>
          </div>
        </div>

        {/* Humidity & Dew Point */}
        <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              {isFr ? 'Hygrométrie' : 'Humidity'}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-stone-100">
            {weather.airHumidity}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {weather.airHumidity > 85 ? (
              <span className="text-red-400 font-semibold">{isFr ? 'Risque mildiou élevé' : 'High mildew risk'}</span>
            ) : (
              <span className="text-emerald-400">{isFr ? 'Feuillage sec' : 'Dry canopy'}</span>
            )}
          </div>
        </div>

        {/* Wind & Drift status */}
        <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              {isFr ? 'Vent & Dérive' : 'Wind & Drift'}
            </span>
            <span className="font-mono text-[10px] text-stone-400">{weather.windDirection}</span>
          </div>
          <div className="text-xl font-bold font-mono text-stone-100">
            {weather.windSpeed} <span className="text-xs font-normal text-stone-400">km/h</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {isWindAcceptableForSpraying ? (
              <span className="text-emerald-400">{isFr ? 'Dérive faible (aspersion OK)' : 'Low drift (spraying OK)'}</span>
            ) : (
              <span className="text-red-400">{isFr ? 'Vent fort (> 19 km/h)' : 'High wind drift (>19km/h)'}</span>
            )}
          </div>
        </div>

        {/* Precipitation Radar */}
        <div className="bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
          <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              {isFr ? 'Pluie Prévue' : 'Rain Forecast'}
            </span>
            <span className="font-mono text-[10px] text-stone-400">24h / 72h</span>
          </div>
          <div className="text-xl font-bold font-mono text-stone-100">
            {weather.rainForecast24h} <span className="text-xs font-normal text-stone-400">mm (24h)</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {isFr ? 'Total 72h:' : '72h total:'} <span className="text-sky-300 font-mono font-medium">{weather.rainForecast72h} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
