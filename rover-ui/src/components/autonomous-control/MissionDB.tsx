import React, { useState, useEffect, useCallback } from 'react';
import { PathGoal } from './PathMapPanel';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface WaypointGoal {
  id:    number;
  rosX:  number;
  rosY:  number;
  depth: number;
}

type MissionMode = 'waypoint' | 'path';

interface DBMission {
  id:        number;
  label:     string;
  mode:      MissionMode;
  waypoints: Array<WaypointGoal & { yawDeg?: number }>;
  saved_at:  string;
  wp_count:  number;
}

interface MissionDBProps {
  missionMode:      MissionMode;
  goals:            WaypointGoal[];
  pathGoals:        PathGoal[];
  isMissionRunning: boolean;
  onLoad: (
    mode:      MissionMode,
    waypoints: WaypointGoal[],
    pathGoals: PathGoal[],
  ) => void;
}

// ══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:8000';

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return raw; }
}

function modeColor(mode: MissionMode) {
  return mode === 'waypoint'
    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    : 'bg-purple-500/20 text-purple-300 border-purple-500/30';
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export const MissionDB: React.FC<MissionDBProps> = ({
  missionMode, goals, pathGoals, isMissionRunning, onLoad,
}) => {

  // ── State ─────────────────────────────────────────────────────────────────
  const [missions,      setMissions]      = useState<DBMission[]>([]);
  const [label,         setLabel]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [deletingId,    setDeletingId]    = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [expandedId,    setExpandedId]    = useState<number | null>(null);
  const [toast,         setToast]         = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [tab,           setTab]           = useState<'save' | 'load'>('save');

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch semua misi ──────────────────────────────────────────────────────
  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/missions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DBMission[] = await res.json();
      setMissions(data);
    } catch (e) {
      showToast('err', `Gagal memuat: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch otomatis saat tab "load" dibuka
  useEffect(() => {
    if (tab === 'load') fetchMissions();
  }, [tab, fetchMissions]);

  // ── Simpan misi ke DB ─────────────────────────────────────────────────────
  const handleSave = async () => {
    const activeGoals = missionMode === 'waypoint' ? goals : pathGoals;
    if (activeGoals.length === 0) {
      showToast('err', 'Tidak ada waypoint untuk disimpan!');
      return;
    }

    const missionLabel = label.trim() || `Misi ${new Date().toLocaleTimeString('id-ID')}`;

    // Normalisasi waypoints — pastikan selalu ada field yawDeg
    const waypoints = activeGoals.map(g => ({
      id:     g.id,
      rosX:   g.rosX,
      rosY:   g.rosY,
      depth:  g.depth,
      yawDeg: (g as any).yawDeg ?? 0,
    }));

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/missions`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ label: missionLabel, mode: missionMode, waypoints }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? `HTTP ${res.status}`);
      }
      const saved: DBMission = await res.json();
      showToast('ok', `✓ Tersimpan: "${saved.label}" (${saved.wp_count} WP)`);
      setLabel('');
      // Refresh list jika tab load sedang aktif
      if (tab === 'load') fetchMissions();
    } catch (e) {
      showToast('err', `Gagal simpan: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Load misi dari DB ke peta ─────────────────────────────────────────────
  const handleLoad = (mission: DBMission) => {
    const base = Date.now();
    if (mission.mode === 'waypoint') {
      const wps = mission.waypoints.map((w, i) => ({
        id: base + i, rosX: w.rosX, rosY: w.rosY, depth: w.depth,
      }));
      onLoad('waypoint', wps, []);
    } else {
      const pgs: PathGoal[] = mission.waypoints.map((w, i) => ({
        id: base + i, rosX: w.rosX, rosY: w.rosY, depth: w.depth,
        yawDeg: w.yawDeg ?? 0,
      }));
      onLoad('path', [], pgs);
    }
    showToast('ok', `✓ "${mission.label}" dimuat ke peta!`);
  };

  // ── Hapus misi ────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/missions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMissions(prev => prev.filter(m => m.id !== id));
      showToast('ok', 'Misi dihapus');
    } catch (e) {
      showToast('err', `Gagal hapus: ${(e as Error).message}`);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeCount = missionMode === 'waypoint' ? goals.length : pathGoals.length;

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden flex flex-col">

      {/* ── Header + Tab ──────────────────────────────────────────────────── */}
      <div className="flex items-center border-b border-white/5">
        <div className="flex items-center gap-2 px-4 py-3 flex-1">
          <span className="text-base">🗄️</span>
          <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Mission Database
          </h3>
        </div>
        {/* Tab switcher */}
        <div className="flex border-l border-white/5">
          {(['save', 'load'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                tab === t
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'save' ? '💾 Simpan' : '📂 Load'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">

        {/* ════════════════════════════════════════════════════════════════
            TAB: SIMPAN
        ════════════════════════════════════════════════════════════════ */}
        {tab === 'save' && (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Nama Misi (opsional)
              </label>
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isMissionRunning && handleSave()}
                placeholder={`Misi ${missionMode === 'waypoint' ? 'Waypoint' : 'Path'} #1`}
                maxLength={60}
                disabled={isMissionRunning || saving}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors disabled:opacity-40"
              />
            </div>

            {/* Info mode + jumlah WP */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${modeColor(missionMode)}`}>
                {missionMode === 'waypoint' ? '📍 Waypoint' : '🖱️ Path'}
              </span>
              <span className="text-[9px] text-slate-500">
                {activeCount > 0 ? `${activeCount} waypoint siap disimpan` : 'Belum ada waypoint'}
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={isMissionRunning || saving || activeCount === 0}
              className="w-full py-2.5 bg-blue-600/80 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>⬆</span>
                  <span>Simpan ke Database {activeCount > 0 ? `(${activeCount} WP)` : ''}</span>
                </>
              )}
            </button>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB: LOAD
        ════════════════════════════════════════════════════════════════ */}
        {tab === 'load' && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-500">
                {missions.length} misi tersimpan
              </span>
              <button
                onClick={fetchMissions}
                disabled={loading}
                className="text-[9px] text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-40"
              >
                {loading
                  ? <span className="w-3 h-3 border border-blue-400/50 border-t-blue-400 rounded-full animate-spin"/>
                  : <span>↻</span>
                }
                Refresh
              </button>
            </div>

            {/* List misi */}
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-0.5">
              {loading && missions.length === 0 && (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
                  <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin"/>
                  <span className="text-[10px]">Memuat...</span>
                </div>
              )}

              {!loading && missions.length === 0 && (
                <div className="text-center py-8 text-slate-600 text-[10px] italic">
                  Belum ada misi tersimpan di database
                </div>
              )}

              {missions.map(mission => (
                <div
                  key={mission.id}
                  className="rounded-lg border border-white/5 bg-white/[0.02] overflow-hidden"
                >
                  {/* Baris utama */}
                  <div className="flex items-center gap-2 p-2.5">
                    {/* Toggle expand */}
                    <button
                      onClick={() => setExpandedId(expandedId === mission.id ? null : mission.id)}
                      className="text-slate-600 hover:text-slate-400 text-[10px] w-4 flex-shrink-0 text-center"
                    >
                      {expandedId === mission.id ? '▾' : '▸'}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
                          {mission.label}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border flex-shrink-0 ${modeColor(mission.mode)}`}>
                          {mission.mode === 'waypoint' ? '📍 WP' : '🖱️ Path'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-mono text-slate-500">
                          #{mission.id} · {mission.wp_count} WP
                        </span>
                        <span className="text-[8px] text-slate-600">
                          {formatDate(mission.saved_at)}
                        </span>
                      </div>
                    </div>

                    {/* Tombol aksi */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {confirmDelete === mission.id ? (
                        // Konfirmasi hapus
                        <>
                          <button
                            onClick={() => handleDelete(mission.id)}
                            disabled={deletingId === mission.id}
                            className="px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white text-[9px] font-bold rounded transition-all disabled:opacity-50"
                          >
                            {deletingId === mission.id ? '...' : 'Hapus?'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-400 text-[9px] font-bold rounded transition-all"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleLoad(mission)}
                            disabled={isMissionRunning}
                            title="Load ke peta"
                            className="px-2.5 py-1.5 bg-green-600/80 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[9px] font-black rounded transition-all"
                          >
                            ▶ Load
                          </button>
                          <button
                            onClick={() => setConfirmDelete(mission.id)}
                            title="Hapus misi"
                            className="p-1.5 text-slate-600 hover:text-red-400 transition-colors text-[10px]"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Detail expanded — daftar waypoints */}
                  {expandedId === mission.id && (
                    <div className="border-t border-white/5 bg-black/20 px-3 py-2 flex flex-col gap-1">
                      <p className="text-[8px] font-bold uppercase text-slate-600 mb-1 tracking-wider">
                        Waypoints
                      </p>
                      {mission.waypoints.slice(0, 8).map((wp, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                          <span className="text-slate-600 w-3 text-right flex-shrink-0">{i + 1}</span>
                          <span className="text-slate-400">X:{wp.rosX.toFixed(2)}</span>
                          <span className="text-slate-400">Y:{wp.rosY.toFixed(2)}</span>
                          <span className="text-blue-400/70">Z:{wp.depth.toFixed(1)}m</span>
                          {wp.yawDeg !== undefined && wp.yawDeg !== 0 && (
                            <span className="text-purple-400/70">{wp.yawDeg.toFixed(0)}°</span>
                          )}
                        </div>
                      ))}
                      {mission.waypoints.length > 8 && (
                        <p className="text-[8px] text-slate-600 italic">
                          +{mission.waypoints.length - 8} waypoint lainnya...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Toast ───────────────────────────────────────────────────────── */}
        {toast && (
          <div className={`rounded-lg px-3 py-2 text-[10px] font-bold flex items-center gap-2 transition-all ${
            toast.type === 'ok'
              ? 'bg-green-500/15 border border-green-500/30 text-green-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}>
            <span>{toast.type === 'ok' ? '✓' : '✕'}</span>
            <span className="truncate">{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionDB;