import React, { useState, useEffect, useCallback } from 'react';
import {
  Rocket, RefreshCw, Plus, Edit2, Trash2,
  Search, MapPin, Save, ListOrdered, Map,
  ChevronDown, X, Check, Database, Eye,
} from 'lucide-react';

import { MapPanel } from '../../components/autonomous-control/MapPanel';
import { PathMapPanel, PathGoal } from '../../components/autonomous-control/PathMapPanel';
import { DepthControl } from '../../components/autonomous-control/DepthControl';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface WaypointGoal {
  id:     number;
  rosX:   number;
  rosY:   number;
  depth:  number;
  yawDeg?: number;
}

type MissionMode = 'waypoint' | 'path';

interface DBMission {
  id:        number;
  label:     string;
  mode:      MissionMode;
  waypoints: WaypointGoal[];
  saved_at:  string;
  wp_count:  number;
}

interface MissionControlProps {
  isDarkMode?: boolean;
}

const API_BASE = 'http://localhost:8000';
const ROV_DUMMY = { rosX: 0, rosY: 0, yaw: 0 };

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return raw; }
}

const MissionControl: React.FC<MissionControlProps> = ({ isDarkMode = true }) => {

  const titleColor    = isDarkMode ? 'text-white'     : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const mutedColor    = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const cardBg        = isDarkMode ? 'bg-[#111827]/80 border-white/10 backdrop-blur-xl shadow-xl' : 'bg-white border-slate-200 shadow-md';
  const inputBg       = isDarkMode ? 'bg-black/30 border-white/10 text-slate-200 focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600';
  const innerBoxBg    = isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200';
  const divider       = isDarkMode ? 'border-white/5' : 'border-slate-200';

  const [missions,    setMissions]    = useState<DBMission[]>([]);
  const [dbLoading,   setDbLoading]   = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [deletingId,  setDeletingId]  = useState<number | null>(null);
  const [confirmDel,  setConfirmDel]  = useState<number | null>(null);

  const [editingId,     setEditingId]     = useState<number | null>(null); 
  const [missionName,   setMissionName]   = useState('');
  const [missionMode,   setMissionMode]   = useState<MissionMode>('waypoint');
  
  const [goals,         setGoals]         = useState<WaypointGoal[]>([]);
  const [pathGoals,     setPathGoals]     = useState<PathGoal[]>([]);
  
  const [targetDepth,   setTargetDepth]   = useState(-2.0);
  const [searchQuery,   setSearchQuery]   = useState('');

  const [previewMission, setPreviewMission] = useState<DBMission | null>(null);
  const [toast,     setToast]     = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [modeFilter, setModeFilter] = useState<'all' | MissionMode>('all');

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMissions = useCallback(async () => {
    setDbLoading(true);
    try {
      const res = await fetch(`${API_BASE}/missions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMissions(await res.json());
    } catch (e) {
      showToast('err', `DB Error: ${(e as Error).message}`);
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => { fetchMissions(); }, [fetchMissions]);

  const resetEditor = () => {
    setEditingId(null);
    setMissionName('');
    setMissionMode('waypoint');
    setGoals([]);
    setPathGoals([]);
    setPreviewMission(null);
    showToast('ok', '✨ Area Peta Dibersihkan! Silakan buat misi baru.');
  };

  const handleSave = async () => {
    const activeGoals = missionMode === 'waypoint' ? goals : pathGoals;
    
    if (!missionName.trim()) { showToast('err', 'Nama misi tidak boleh kosong!'); return; }
    if (activeGoals.length === 0) { showToast('err', 'Tambahkan waypoint di peta dulu!'); return; }
    
    const waypoints = activeGoals.map((g, index) => ({ 
      id: index + 1, 
      rosX: g.rosX, 
      rosY: g.rosY, 
      depth: g.depth, 
      yawDeg: (g as any).yawDeg ?? 0 
    }));

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/missions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: missionName.trim(), mode: missionMode, waypoints }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('ok', `✓ Misi "${missionName}" Berhasil Disimpan`);
      resetEditor();
      fetchMissions();
    } catch (e) { showToast('err', `Gagal simpan: ${(e as Error).message}`); } 
    finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const activeGoals = missionMode === 'waypoint' ? goals : pathGoals;
    if (!missionName.trim() || activeGoals.length === 0) return;
    
    const waypoints = activeGoals.map((g, index) => ({ 
      id: index + 1, 
      rosX: g.rosX, 
      rosY: g.rosY, 
      depth: g.depth, 
      yawDeg: (g as any).yawDeg ?? 0 
    }));

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/missions/${editingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: missionName.trim(), mode: missionMode, waypoints }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('ok', `✓ Misi Diperbarui`);
      resetEditor();
      fetchMissions();
    } catch (e) { showToast('err', `Gagal update: ${(e as Error).message}`); } 
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`${API_BASE}/missions/${id}`, { method: 'DELETE' });
      setMissions(prev => prev.filter(m => m.id !== id));
      showToast('ok', 'Misi dihapus');
    } catch (e) { showToast('err', `Gagal hapus: ${(e as Error).message}`); } 
    finally { setDeletingId(null); setConfirmDel(null); }
  };

  const handleEdit = (mission: DBMission) => {
    const base = Date.now();
    setEditingId(mission.id); setMissionName(mission.label); setMissionMode(mission.mode); setPreviewMission(null);
    if (mission.mode === 'waypoint') {
      setGoals(mission.waypoints.map((w, i) => ({ ...w, id: base + i }))); setPathGoals([]);
    } else {
      setPathGoals(mission.waypoints.map((w, i) => ({ ...w, id: base + i, yawDeg: w.yawDeg ?? 0 }))); setGoals([]);
    }
    showToast('ok', `Misi "${mission.label}" siap diedit`);
  };

  const handleMapClick = (rosX: number, rosY: number) => {
    if (previewMission) return;
    setGoals(prev => [...prev, { id: Date.now(), rosX, rosY, depth: targetDepth }]);
  };

  const removeGoal = (id: number) => setGoals(prev => prev.filter(g => g.id !== id));
  const removePathGoal = (id: number) => setPathGoals(prev => prev.filter(g => g.id !== id));

  const activeGoals = missionMode === 'waypoint' ? goals : pathGoals;
  const isEditing = editingId !== null;
  const isPreviewing = previewMission !== null;
  
  const mapGoals = isPreviewing ? previewMission!.waypoints : goals;
  const mapPGoals = isPreviewing ? previewMission!.waypoints.map(w => ({ ...w, yawDeg: w.yawDeg ?? 0 })) : pathGoals;
  const mapMode = isPreviewing ? previewMission!.mode : missionMode;
  
  const filteredMissions = missions.filter(m => (modeFilter === 'all' || m.mode === modeFilter) && m.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-10 font-['Inter',sans-serif]">

      {/* FIX TOAST: Dipindah ke pojok kanan BAWAH agar tidak tertutup header */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[999] px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border transition-all ${
          toast.type === 'ok' ? 'bg-green-600 border-green-400 text-white' : 'bg-red-600 border-red-400 text-white'
        }`}>
          {toast.type === 'ok' ? <Check size={18}/> : <X size={18}/>} {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${titleColor}`}>Mission Control</h1>
            <p className={`font-medium text-xs mt-1 uppercase tracking-widest ${mutedColor}`}>Buat, kelola & simpan misi waypoint ROV</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchMissions} disabled={dbLoading} className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-white text-slate-700'}`}>
            <RefreshCw size={16} className={dbLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={resetEditor} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 rounded-xl text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Plus size={18} /> New Mission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* KOLOM 1: Library Misi Tersimpan */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className={`border rounded-2xl p-5 flex flex-col gap-4 h-full ${cardBg}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-sm font-bold flex items-center gap-2 ${subtitleColor}`}>
                <Database size={16} className={mutedColor} /> Saved Missions
              </h2>
            </div>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari misi..." className={`w-full border rounded-xl p-2 text-xs outline-none ${inputBg}`} />
            
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredMissions.map(m => (
                <div key={m.id} className={`rounded-xl border p-3 ${editingId === m.id ? 'bg-indigo-500/10 border-indigo-500/40' : previewMission?.id === m.id ? 'bg-yellow-500/5 border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-white">{m.label}</span> 
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${m.mode === 'waypoint' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                      {m.mode}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 mb-2">{m.wp_count} WP · {formatDate(m.saved_at)}</p>
                  <div className="flex gap-1">
                    <button onClick={() => setPreviewMission(previewMission?.id === m.id ? null : m)} className={`flex-1 py-1 rounded border text-[9px] font-bold ${previewMission?.id === m.id ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-white/5 text-slate-400'}`}>Preview</button>
                    <button onClick={() => handleEdit(m)} className={`flex-1 py-1 rounded border text-[9px] font-bold ${editingId === m.id ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-white/5 text-slate-400'}`}>Edit</button>
                    <button onClick={() => setConfirmDel(m.id)} className="px-2 py-1 rounded border bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 text-[9px]"><Trash2 size={10}/></button>
                  </div>
                  {confirmDel === m.id && (
                     <div className="mt-2 flex gap-1"><button onClick={() => handleDelete(m.id)} className="flex-1 text-[9px] font-bold bg-red-600 text-white rounded py-1 border border-red-500">Ya, Hapus</button></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM 2+3: Builder Peta */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className={`border rounded-2xl p-6 flex flex-col h-full ${cardBg}`}>
            <div className={`flex justify-between items-center mb-5 pb-4 border-b ${divider}`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${subtitleColor}`}>
                <ListOrdered size={20} className={mutedColor}/> {isEditing ? `Edit Misi #${editingId}` : 'Mission Builder'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">Nama Misi *</label>
                <input type="text" value={missionName} onChange={e => setMissionName(e.target.value)} placeholder="Misal: Inspeksi A" disabled={isPreviewing} className={`w-full border rounded-xl p-3 text-sm ${inputBg}`} />
              </div>
              
              <div>
                <label className="text-[10px] text-slate-400 mb-1 block">Mode Navigasi</label>
                <div className="relative">
                  <select value={missionMode} onChange={e => { if (!isPreviewing) { setMissionMode(e.target.value as MissionMode); setGoals([]); setPathGoals([]); } }} disabled={isPreviewing} className={`w-full border rounded-xl p-3 text-sm appearance-none cursor-pointer ${inputBg}`}>
                    <option value="waypoint">📍 Waypoint (Klik Peta)</option>
                    <option value="path">🖱️ Path Drawing (Tahan & Drag)</option>
                  </select>
                  <ChevronDown size={14} className={`absolute right-4 top-4 pointer-events-none ${mutedColor}`}/>
                </div>
              </div>
            </div>

            {/* FIX MAP CONTAINER: Diberi tinggi fix h-[480px] agar bisa diklik dan tidak error */}
            <div className={`rounded-xl border overflow-hidden relative w-full h-[480px] flex-shrink-0 ${isPreviewing ? 'border-yellow-500/50 bg-black/40' : 'border-white/10 bg-black/20'}`}>
              
              {/* Banner Penanda bahwa ini mode Read-Only */}
              {isPreviewing && (
                <div className="absolute top-0 left-0 w-full bg-yellow-500/20 text-yellow-300 text-center text-xs font-bold py-2 z-50 backdrop-blur-md border-b border-yellow-500/30">
                  👁️ MODE PREVIEW AKTIF — PETA READ-ONLY
                  <br />
                  <span className="text-[10px] font-normal text-yellow-400/80">Klik tombol "New Mission" di atas untuk membuat misi baru.</span>
                </div>
              )}

              {(mapMode === 'waypoint') ? (
                <MapPanel goals={mapGoals} activeGoalId={null} rovPos={ROV_DUMMY} rovPath={[]} onMapClick={handleMapClick} disabled={isPreviewing} />
              ) : (
                <PathMapPanel 
                  pathGoals={mapPGoals} 
                  setPathGoals={isPreviewing ? (() => {}) as any : setPathGoals} 
                  activeGoalId={null} 
                  rovPos={ROV_DUMMY} 
                  rovPath={[]} 
                  defaultDepth={targetDepth} 
                  disabled={isPreviewing} 
                />
              )}
            </div>
          </div>
        </div>

        {/* KOLOM 4: Sequence List & Tombol Save */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className={`border rounded-2xl p-5 flex flex-col gap-4 h-full ${cardBg}`}>
            <div className="flex justify-between items-center">
              <h2 className={`text-sm font-bold flex items-center gap-2 ${subtitleColor}`}>
                <MapPin size={16} className={mutedColor}/> Sequence
              </h2>
            </div>

            {/* Kedalaman Default */}
            {!isPreviewing && (
              <div className="bg-black/30 border border-white/5 rounded-xl">
                 <DepthControl targetDepth={targetDepth} setTargetDepth={setTargetDepth} isDefault />
              </div>
            )}

            {/* List Koordinat */}
            <div className={`flex-1 border rounded-2xl overflow-hidden ${innerBoxBg}`}>
               <div className="overflow-y-auto max-h-[300px]">
                  {(isPreviewing ? previewMission!.waypoints : activeGoals).length === 0 && (
                    <div className="p-5 text-center text-xs text-slate-500 italic mt-10">Belum ada titik waypoint</div>
                  )}
                  
                  {(isPreviewing ? previewMission!.waypoints : activeGoals).map((g, i) => (
                    <div key={g.id} className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400">{i + 1}</div>
                      <div className="flex-1">
                        <p className="text-[9px] text-slate-300 font-mono">X:{g.rosX.toFixed(2)} Y:{g.rosY.toFixed(2)}</p>
                        <p className="text-[8px] text-blue-400 font-mono">Z:{g.depth.toFixed(1)}m {(g as any).yawDeg !== undefined && (g as any).yawDeg !== 0 ? ` · ${(g as any).yawDeg.toFixed(0)}°` : ''}</p>
                      </div>
                      {!isPreviewing && <button onClick={() => missionMode === 'waypoint' ? removeGoal(g.id) : removePathGoal(g.id)} className="text-slate-500 hover:text-red-400 text-xs font-bold">✕</button>}
                    </div>
                  ))}
               </div>
            </div>

            {/* Tombol Simpan */}
            {!isPreviewing && (
              <button onClick={isEditing ? handleUpdate : handleSave} disabled={saving || !missionName.trim() || activeGoals.length === 0} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                <Save size={14}/> {isEditing ? 'Update Misi' : 'Simpan ke Database'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;