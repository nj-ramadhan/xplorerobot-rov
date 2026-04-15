import React, { useRef, useState } from 'react';
import { PathGoal } from './PathMapPanel';

// ── Types ──────────────────────────────────────────────────────────────────

interface WaypointGoal {
  id: number;
  rosX: number;
  rosY: number;
  depth: number;
}

type MissionMode = 'waypoint' | 'path';

interface MissionFile {
  version: '1.0';
  mode: MissionMode;
  savedAt: string;         // ISO string
  label: string;           // nama file / deskripsi
  waypoints?: WaypointGoal[];
  pathGoals?: PathGoal[];
}

interface MissionIOProps {
  missionMode: MissionMode;
  goals: WaypointGoal[];
  pathGoals: PathGoal[];
  isMissionRunning: boolean;

  /** Called after a valid file is imported */
  onImport: (mode: MissionMode, waypoints: WaypointGoal[], pathGoals: PathGoal[]) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

function buildFilename(label: string) {
  const safe = label.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 40) || 'mission';
  const ts   = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  return `${safe}_${ts}.json`;
}

// ── Component ──────────────────────────────────────────────────────────────

export const MissionIO: React.FC<MissionIOProps> = ({
  missionMode, goals, pathGoals, isMissionRunning, onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [label,         setLabel]         = useState('');
  const [toast,         setToast]         = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
  const [preview,       setPreview]       = useState<MissionFile | null>(null);
  const [isDragOver,    setIsDragOver]    = useState(false);

  // ── Toast helper ────────────────────────────────────────────────────────

  const showToast = (type: 'ok' | 'err', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Export ──────────────────────────────────────────────────────────────

  const handleExport = () => {
    const activeGoals = missionMode === 'waypoint' ? goals : pathGoals;
    if (activeGoals.length === 0) { showToast('err', 'Tidak ada waypoint untuk disimpan!'); return; }

    const missionLabel = label.trim() || `Misi ${new Date().toLocaleTimeString('id-ID')}`;

    const data: MissionFile = {
      version:  '1.0',
      mode:     missionMode,
      savedAt:  new Date().toISOString(),
      label:    missionLabel,
      ...(missionMode === 'waypoint' ? { waypoints: goals }     : {}),
      ...(missionMode === 'path'     ? { pathGoals: pathGoals } : {}),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = buildFilename(missionLabel);
    a.click();
    URL.revokeObjectURL(url);

    showToast('ok', `✓ Tersimpan: ${a.download}`);
  };

  // ── Parse & validate file ───────────────────────────────────────────────

  const parseFile = (text: string): MissionFile | string => {
    try {
      const d = JSON.parse(text) as MissionFile;
      if (d.version !== '1.0')              return 'Versi file tidak didukung (bukan 1.0)';
      if (d.mode !== 'waypoint' && d.mode !== 'path') return 'Field "mode" tidak valid';
      if (d.mode === 'waypoint' && (!Array.isArray(d.waypoints) || d.waypoints.length === 0))
        return 'File waypoint tidak memiliki data waypoints';
      if (d.mode === 'path' && (!Array.isArray(d.pathGoals) || d.pathGoals.length === 0))
        return 'File path tidak memiliki data pathGoals';
      return d;
    } catch {
      return 'File bukan JSON yang valid';
    }
  };

  // ── Import from file input ──────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    readFile(file);
  };

  const readFile = (file: File) => {
    if (!file.name.endsWith('.json')) { showToast('err', 'Hanya file .json yang didukung'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = parseFile(ev.target?.result as string);
      if (typeof result === 'string') { showToast('err', result); return; }
      setPreview(result);
    };
    reader.readAsText(file);
  };

  // ── Drag-and-drop ───────────────────────────────────────────────────────

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  // ── Confirm import ──────────────────────────────────────────────────────

  const confirmImport = () => {
    if (!preview) return;

    // Re-assign IDs so they don't collide with existing state
    const base = Date.now();
    const waypoints: WaypointGoal[] = (preview.waypoints ?? []).map((w, i) => ({
      ...w, id: base + i,
    }));
    const pGoals: PathGoal[] = (preview.pathGoals ?? []).map((g, i) => ({
      ...g, id: base + i,
    }));

    onImport(preview.mode, waypoints, pGoals);
    setPreview(null);
    showToast('ok', `✓ ${preview.label} — ${(waypoints.length || pGoals.length)} waypoint dimuat`);
  };

  const cancelImport = () => setPreview(null);

  // ── Derived ─────────────────────────────────────────────────────────────

  const activeCount = missionMode === 'waypoint' ? goals.length : pathGoals.length;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        <span className="text-base">💾</span>
        <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Save / Load Mission</h3>
      </div>

      {/* ── EXPORT SECTION ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Nama Misi (opsional)</label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder={`Misi ${missionMode === 'waypoint' ? 'Waypoint' : 'Path'} #1`}
          maxLength={60}
          disabled={isMissionRunning}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60 focus:bg-black/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleExport}
          disabled={isMissionRunning || activeCount === 0}
          className="w-full py-2.5 bg-blue-600/80 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <span>⬇</span>
          <span>Export {activeCount > 0 ? `(${activeCount} WP)` : '— Tidak ada WP'}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-white/5"/>
        <span className="text-[9px] text-slate-600 uppercase tracking-widest">atau</span>
        <div className="flex-1 h-px bg-white/5"/>
      </div>

      {/* ── IMPORT SECTION ─────────────────────────────────────────────────── */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isMissionRunning && fileInputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed p-5 text-center cursor-pointer transition-all duration-200 ${
          isMissionRunning
            ? 'border-white/5 opacity-40 cursor-not-allowed'
            : isDragOver
              ? 'border-blue-400/60 bg-blue-500/10'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
          disabled={isMissionRunning}
        />
        <div className="flex flex-col items-center gap-1.5 pointer-events-none">
          <span className={`text-2xl transition-transform duration-200 ${isDragOver ? 'scale-125' : ''}`}>
            {isDragOver ? '📂' : '📁'}
          </span>
          <p className="text-[10px] font-bold text-slate-400">
            {isDragOver ? 'Lepaskan untuk import' : 'Klik atau drag file .json'}
          </p>
          <p className="text-[9px] text-slate-600">Import waypoint dari file misi sebelumnya</p>
        </div>
      </div>

      {/* ── PREVIEW MODAL (inline) ─────────────────────────────────────────── */}
      {preview && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 overflow-hidden">

          {/* Preview header */}
          <div className="px-4 py-3 border-b border-yellow-500/20 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"/>
                <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">Preview Import</span>
              </div>
              <p className="text-[11px] font-bold text-white">{preview.label}</p>
              <p className="text-[9px] font-mono text-slate-500 mt-0.5">{formatDate(preview.savedAt)}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-[9px] font-black uppercase flex-shrink-0 ${
              preview.mode === 'waypoint' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
            }`}>
              {preview.mode === 'waypoint' ? '📍 Waypoint' : '🖱️ Path'}
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 py-3 grid grid-cols-2 gap-2">
            {[
              {
                label: 'Jumlah WP',
                val: ((preview.waypoints ?? preview.pathGoals) ?? []).length,
              },
              {
                label: 'Mode',
                val: preview.mode === 'waypoint' ? 'Waypoint' : 'Path Drawing',
              },
            ].map(({ label: l, val }) => (
              <div key={l} className="bg-black/30 rounded-lg p-2">
                <p className="text-[8px] text-slate-500 uppercase tracking-wider">{l}</p>
                <p className="text-[11px] font-bold text-white mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Waypoint list preview (max 5) */}
          <div className="px-4 pb-3 flex flex-col gap-1 max-h-32 overflow-y-auto">
            {(preview.waypoints ?? preview.pathGoals ?? []).slice(0, 5).map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-slate-400 bg-black/20 rounded px-2 py-1">
                <span className="text-slate-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                <span>X:{g.rosX.toFixed(2)}</span>
                <span>Y:{g.rosY.toFixed(2)}</span>
                <span className="text-blue-400/70">Z:{g.depth.toFixed(1)}m</span>
                {'yawDeg' in g && (
                  <span className="text-purple-400/70">{(g as PathGoal).yawDeg.toFixed(0)}°</span>
                )}
              </div>
            ))}
            {((preview.waypoints ?? preview.pathGoals) ?? []).length > 5 && (
              <p className="text-[9px] text-slate-600 text-center italic">
                +{((preview.waypoints ?? preview.pathGoals) ?? []).length - 5} waypoint lainnya...
              </p>
            )}
          </div>

          {/* Warning if mode mismatch */}
          {preview.mode !== missionMode && (
            <div className="mx-4 mb-3 px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-[9px] text-orange-400 font-bold">
                ⚠️ Mode berbeda — file ini adalah mode <strong>{preview.mode}</strong>,
                panel akan otomatis beralih setelah import.
              </p>
            </div>
          )}

          {/* Confirm buttons */}
          <div className="flex border-t border-yellow-500/20">
            <button
              onClick={cancelImport}
              className="flex-1 py-3 text-[10px] font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              ✕ Batal
            </button>
            <div className="w-px bg-white/5"/>
            <button
              onClick={confirmImport}
              className="flex-1 py-3 text-[10px] font-bold text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
            >
              ✓ Muat Misi
            </button>
          </div>
        </div>
      )}

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
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
  );
};

export default MissionIO;