import React, { useState } from 'react';
import { HistoricalRecord, RecordType, Language, Parcel } from '../types/agri';
import { ClipboardList, Download, Plus, Filter, Search, Stethoscope, Droplets, Gauge, FileText, Check, Calendar, ArrowDownUp } from 'lucide-react';

interface RecordsLogbookProps {
  records: HistoricalRecord[];
  parcels: Parcel[];
  onAddRecord: (newRecord: Omit<HistoricalRecord, 'id' | 'timestamp'>) => void;
  language: Language;
}

export const RecordsLogbook: React.FC<RecordsLogbookProps> = ({
  records,
  parcels,
  onAddRecord,
  language,
}) => {
  const isFr = language === 'fr';

  const [activeTab, setActiveTab] = useState<'ALL' | RecordType>('ALL');
  const [selectedParcelFilter, setSelectedParcelFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form State for manual note/record
  const [newTitle, setNewTitle] = useState<string>('');
  const [newParcelId, setNewParcelId] = useState<string>(parcels[0]?.id || '');
  const [newType, setNewType] = useState<RecordType>('FIELD_NOTE');
  const [newSummary, setNewSummary] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newIrrigationDose, setNewIrrigationDose] = useState<string>('15');

  // Filtered records
  const filteredRecords = records.filter((r) => {
    if (activeTab !== 'ALL' && r.type !== activeTab) return false;
    if (selectedParcelFilter !== 'ALL' && r.parcelId !== selectedParcelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.parcelName.toLowerCase().includes(q) ||
        (r.details.notes && r.details.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const parcelObj = parcels.find((p) => p.id === newParcelId);

    onAddRecord({
      parcelId: newParcelId,
      parcelName: parcelObj ? parcelObj.name : 'Parcelle Générale',
      type: newType,
      title: newTitle.trim(),
      summary: newSummary.trim(),
      details: {
        operator: 'FARMER',
        notes: newNotes.trim() || undefined,
        irrigationVolumeMm: newType === 'IRRIGATION' ? parseFloat(newIrrigationDose) : undefined,
      },
    });

    // Reset
    setNewTitle('');
    setNewSummary('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Parcelle', 'Type', 'Titre', 'Resume', 'Details'];
    const rows = filteredRecords.map((r) => [
      `"${r.timestamp}"`,
      `"${r.parcelName}"`,
      `"${r.type}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.summary.replace(/"/g, '""')}"`,
      `"${JSON.stringify(r.details).replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartAgri_Registre_Parcellaire_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRecordIcon = (type: RecordType) => {
    switch (type) {
      case 'DISEASE':
        return <Stethoscope className="w-4 h-4 text-amber-400" />;
      case 'IRRIGATION':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'MEASUREMENT':
        return <Gauge className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-stone-300" />;
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-base flex items-center gap-2">
              <span>{isFr ? 'Registre Agricole & Traçabilité (Carnet de Plaine)' : 'Agricultural Logbook & Action Records'}</span>
              <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-bold">
                {records.length} {isFr ? 'enregistrements' : 'records'}
              </span>
            </h2>
            <p className="text-xs text-stone-400">
              {isFr
                ? 'Stockage continu des mesures de capteurs, diagnostics foliaires et interventions d\'irrigation'
                : 'Permanent storage of sensor measurements, disease diagnoses and irrigation actions'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Add note & Export */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFr ? 'Ajouter une note' : 'New Record'}</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition-colors"
            title={isFr ? "Exporter l'historique complet en fichier CSV" : "Export full records as CSV"}
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFr ? 'Exporter CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Type Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-950/80 rounded-lg border border-stone-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
              activeTab === 'ALL' ? 'bg-stone-800 text-stone-100 shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isFr ? 'Tous les types' : 'All Types'} ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('MEASUREMENT')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'MEASUREMENT' ? 'bg-stone-800 text-stone-100 shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isFr ? 'Mesures Sondes' : 'Sensor Telemetry'}</span>
          </button>
          <button
            onClick={() => setActiveTab('DISEASE')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'DISEASE' ? 'bg-stone-800 text-stone-100 shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
            <span>{isFr ? 'Diagnostics' : 'Diagnoses'}</span>
          </button>
          <button
            onClick={() => setActiveTab('IRRIGATION')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'IRRIGATION' ? 'bg-stone-800 text-stone-100 shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isFr ? 'Irrigations' : 'Irrigations'}</span>
          </button>
          <button
            onClick={() => setActiveTab('FIELD_NOTE')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'FIELD_NOTE' ? 'bg-stone-800 text-stone-100 shadow-xs' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-stone-300" />
            <span>{isFr ? 'Notes de Plaine' : 'Field Notes'}</span>
          </button>
        </div>

        {/* Parcel Filter & Search Input */}
        <div className="flex items-center gap-2">
          <select
            value={selectedParcelFilter}
            onChange={(e) => setSelectedParcelFilter(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="ALL">{isFr ? 'Toutes les parcelles' : 'All Fields'}</option>
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isFr ? 'Rechercher...' : 'Search records...'}
              className="bg-stone-950 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-emerald-500 w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Records Timeline / Table */}
      <div className="space-y-2.5">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 bg-stone-950/40 rounded-xl border border-stone-800/60 text-stone-400 space-y-1">
            <ClipboardList className="w-8 h-8 text-stone-600 mx-auto" />
            <div className="text-sm font-semibold text-stone-300">
              {isFr ? 'Aucun enregistrement correspondant' : 'No matching records found'}
            </div>
            <p className="text-xs text-stone-500">
              {isFr ? 'Ajustez vos filtres ou ajoutez une nouvelle note de plaine.' : 'Adjust search filters or add a manual field record.'}
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-stone-950/70 border border-stone-800/80 hover:border-stone-700/80 rounded-xl p-3.5 transition-all text-xs space-y-2"
            >
              {/* Top metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center flex-shrink-0">
                    {getRecordIcon(rec.type)}
                  </div>
                  <span className="font-bold text-stone-200">{rec.title}</span>
                  <span className="text-stone-600">·</span>
                  <span className="text-stone-400 font-mono text-[11px]">{rec.parcelName}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500">
                  <Calendar className="w-3 h-3 text-stone-600" />
                  <span>{rec.timestamp}</span>
                  {rec.details.operator && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      rec.details.operator === 'AI_AGENT'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40'
                        : 'bg-stone-800 text-stone-300'
                    }`}>
                      {rec.details.operator === 'AI_AGENT' ? 'Agent IA' : 'Exploitant'}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary text */}
              <p className="text-stone-300 leading-relaxed pl-9">
                {rec.summary}
              </p>

              {/* Details pills */}
              <div className="pl-9 flex flex-wrap gap-2 text-[11px] font-mono text-stone-400 pt-1">
                {rec.details.soilMoisture30 !== undefined && (
                  <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-emerald-400">
                    Sonde 30cm: {rec.details.soilMoisture30}% (10cm: {rec.details.soilMoisture10}%, 60cm: {rec.details.soilMoisture60}%)
                  </span>
                )}
                {rec.details.irrigationVolumeMm !== undefined && (
                  <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-cyan-400">
                    Volume: {rec.details.irrigationVolumeMm} mm ({rec.details.durationMinutes || Math.round(rec.details.irrigationVolumeMm * 14)} min)
                  </span>
                )}
                {rec.details.diseaseDiagnosis && (
                  <span className="bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-amber-400">
                    Pathogène: {rec.details.diseaseDiagnosis} ({rec.details.confidence}% certitude)
                  </span>
                )}
                {rec.details.notes && (
                  <span className="text-stone-400 italic">
                    Note: "{rec.details.notes}"
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add new manual record / field note */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-bold text-stone-100 text-base">
                {isFr ? 'Ajouter une Note au Registre de Plaine' : 'Add New Field Logbook Entry'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {isFr ? 'Parcelle concernée :' : 'Target Parcel:'}
                </label>
                <select
                  value={newParcelId}
                  onChange={(e) => setNewParcelId(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    {isFr ? 'Type d\'entrée :' : 'Entry Type:'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as RecordType)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200"
                  >
                    <option value="FIELD_NOTE">{isFr ? 'Note de plaine' : 'Field Note'}</option>
                    <option value="IRRIGATION">{isFr ? 'Action d\'irrigation' : 'Irrigation Action'}</option>
                    <option value="DISEASE">{isFr ? 'Observation sanitaire' : 'Sanitary Observation'}</option>
                    <option value="MEASUREMENT">{isFr ? 'Mesure manuelle' : 'Manual Measurement'}</option>
                  </select>
                </div>

                {newType === 'IRRIGATION' && (
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      {isFr ? 'Dose apportée (mm) :' : 'Delivered Dose (mm):'}
                    </label>
                    <input
                      type="number"
                      value={newIrrigationDose}
                      onChange={(e) => setNewIrrigationDose(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 font-mono"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {isFr ? 'Titre de l\'enregistrement :' : 'Record Title:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isFr ? "ex: Observation floraison & contrôle ravageurs" : "e.g. Flowering inspection & pest scouting"}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {isFr ? 'Résumé de l\'action ou de la mesure :' : 'Summary of observation/action:'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder={isFr ? "Décrivez ce qui a été réalisé ou mesuré sur la parcelle..." : "Describe observations or actions performed on the parcel..."}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  {isFr ? 'Remarques agronomiques complémentaires :' : 'Additional agronomic notes:'}
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={isFr ? "ex: Pas d'adjuvant, pulvérisateur étalonné, vent nul" : "e.g. Calibrated sprayer, zero wind drift"}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                >
                  {isFr ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs"
                >
                  {isFr ? 'Enregistrer dans le carnet' : 'Save to Logbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
