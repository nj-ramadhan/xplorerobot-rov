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

interface MissionLoaderProps {
  isMissionRunning: boolean;
  onLoad: (
    mode:      MissionMode,
    waypoints: WaypointGoal[],
    pathGoals: PathGoal[],
  ) => void;
}

const API_BASE = 'http://localhost:8000';

function formatDate(raw: string) {
  try {
    return new Date(raw).toLocaleString('id-ID', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return raw; }
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export const MissionLoader: React.FC<MissionLoaderProps> = ({
  isMissionRunning, onLoad,
}) => {

  const [missions,    setMissions]    = useState<DBMission[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [selectedId,  setSelectedId]  = useState<number | null>(null);
  const [toast,       setToast]       = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch misi dari DB ────────────────────────────────────────────────────
  const fetchMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/missions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DBMission[] = await res.json();
      setMissions(data);
      // Auto-select misi pertama kalau ada
      if (data.length > 0 && selectedId === null) setSelectedId(data[0].id);
    } catch (e) {
      showToast('err', `DB offline: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { fetchMissions(); }, []);

  // ── Load misi yang dipilih ke Autonomous ──────────────────────────────────
  const handleLoad = () => {
    const mission = missions.find(m => m.id === selectedId);
    if (!mission) { showToast('err', 'Pilih misi dulu'); return; }

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
    showToast('ok', `✓ "${mission.label}" dimuat — ${mission.wp_count} WP siap`);
  };

  const selectedMission = missions.find(m => m.id === selectedId) ?? null;

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🗄️</span>
          <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Load Misi dari DB</h3>
        </div>
        <button
          onClick={fetchMissions}
          disabled={loading || isMissionRunning}
          className="text-[9px] text-blue-400 hover:text-blue-300 flex items-center gap-1 disabled:opacity-40"
        >
          {loading
            ? <span className="w-3 h-3 border border-blue-400/40 border-t-blue-400 rounded-full animate-spin"/>
            : '↻'
          }
          {' '}Refresh
        </button>
      </div>

      {/* Dropdown pilih misi */}
      {missions.length === 0 && !loading ? (
        <div className="text-center py-3 text-[10px] text-slate-600 italic">
          Belum ada misi di database.<br/>
          <span className="text-slate-500">Buat misi di halaman Mission Control.</span>
        </div>
      ) : (
        <select
          value={selectedId ?? ''}
          onChange={e => setSelectedId(Number(e.target.value))}
          disabled={isMissionRunning || loading}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none focus:border-blue-500/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="" disabled>-- Pilih Misi --</option>
          {missions.map(m => (
            <option key={m.id} value={m.id}>
              [{m.mode === 'waypoint' ? 'WP' : 'Path'}] {m.label} ({m.wp_count} WP)
            </option>
          ))}
        </select>
      )}

      {/* Info misi yang dipilih */}
      {selectedMission && (
        <div className="bg-black/30 rounded-lg px-3 py-2 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-white">{selectedMission.label}</span>
            <span className="text-[8px] font-mono text-slate-500">
              {selectedMission.wp_count} waypoint · {formatDate(selectedMission.saved_at)}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${
            selectedMission.mode === 'waypoint'
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
          }`}>
            {selectedMission.mode === 'waypoint' ? '📍 WP' : '🖱️ Path'}
          </span>
        </div>
      )}

      {/* Tombol Load */}
      <button
        onClick={handleLoad}
        disabled={isMissionRunning || !selectedId || missions.length === 0}
        className="w-full py-2.5 bg-green-600/80 hover:bg-green-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <span>⬇</span>
        <span>Load ke Peta</span>
      </button>

      {/* Hint */}
      <p className="text-[9px] text-slate-600 text-center">
        Setelah load, klik <span className="text-blue-400">▶️ Start Mission</span> untuk jalankan
      </p>

      {/* Toast */}
      {toast && (
        <div className={`rounded-lg px-3 py-2 text-[10px] font-bold flex items-center gap-2 ${
          toast.type === 'ok'
            ? 'bg-green-500/15 border border-green-500/30 text-green-400'
            : 'bg-red-500/15 border border-red-500/30 text-red-400'
        }`}>
          <span>{toast.type === 'ok' ? '✓' : '✕'}</span>
          <span className="truncate">{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default MissionLoader;