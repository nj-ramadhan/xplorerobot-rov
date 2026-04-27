import React from 'react';
import { PathGoal } from './PathMapPanel';

type WaypointStatus = 'pending' | 'active' | 'rotating' | 'waiting_orientation' | 'arrival_orientation' | 'done';
type MissionMode = 'waypoint' | 'path';

function yawToCompass(yaw: number): string {
  const dirs = ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE']; // E=-90°, W=+90°
  return dirs[Math.round(((yaw % 360) + 360) / 45) % 8];
}

// ── Mode 1 Props ────────────────────────────────────────────────────────────

interface WaypointGoal {
  id: number;
  rosX: number;
  rosY: number;
}

interface MissionPanelProps {
  missionMode: MissionMode;

  // Mode 1
  goals: WaypointGoal[];
  removeGoal: (id: number) => void;

  // Mode 2
  pathGoals: PathGoal[];
  removePathGoal: (id: number) => void;

  // Shared
  wpStatus: Record<number, WaypointStatus>;
  activeGoalId: number | null;
  isMissionRunning: boolean;
  isConnected: boolean;
  startMission: () => void;
  stopMission: () => void;
  clearAll: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  missionMode,
  goals, removeGoal,
  pathGoals, removePathGoal,
  wpStatus, activeGoalId,
  isMissionRunning, isConnected,
  startMission, stopMission, clearAll,
}) => {

  const activeGoals = missionMode === 'waypoint' ? goals : pathGoals;

  // ── Status badge (Mode 1) ─────────────────────────────────────────────────
  const statusBadge = (id: number) => {
    const s = wpStatus[id];
    if (s === 'active')              return <span className="text-[9px] text-blue-400 animate-pulse font-bold">● MENUJU</span>;
    if (s === 'rotating')            return <span className="text-[9px] text-purple-400 font-bold">↻ ROTATE</span>;
    if (s === 'waiting_orientation') return <span className="text-[9px] text-yellow-400 animate-pulse font-bold">⏸ ORIENTASI AWAL</span>;
    if (s === 'arrival_orientation') return <span className="text-[9px] text-orange-400 animate-pulse font-bold">🎯 ORIENTASI AKHIR</span>;
    if (s === 'done')                return <span className="text-[9px] text-green-400 font-bold">✓ SELESAI</span>;
    return null;
  };

  // ── Card style ────────────────────────────────────────────────────────────
  const cardStyle = (id: number) => {
    const s = wpStatus[id];
    if (s === 'active')              return 'bg-blue-600/20 border-blue-500/50';
    if (s === 'rotating')            return 'bg-purple-600/20 border-purple-500/50';
    if (s === 'waiting_orientation') return 'bg-yellow-600/20 border-yellow-500/50';
    if (s === 'arrival_orientation') return 'bg-orange-600/20 border-orange-500/50';
    if (s === 'done')                return 'bg-green-600/10 border-green-500/30';
    return 'bg-white/5 border-white/5';
  };

  // ── Number badge color ────────────────────────────────────────────────────
  const numBadgeClass = (id: number) => {
    const s = wpStatus[id];
    if (s === 'done')                return 'bg-green-500/20 border-green-500/40 text-green-400';
    if (s === 'active')              return 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse';
    if (s === 'rotating')            return 'bg-purple-500/20 border-purple-500/40 text-purple-400';
    if (s === 'waiting_orientation') return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 animate-pulse';
    if (s === 'arrival_orientation') return 'bg-orange-500/20 border-orange-500/40 text-orange-400 animate-pulse';
    return 'bg-white/5 border-white/10 text-slate-500';
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-2">
        <h3 className="text-[10px] font-bold uppercase text-slate-400">
          {missionMode === 'waypoint' ? 'Waypoints' : 'Path Goals'} ({activeGoals.length})
        </h3>
        <button
          onClick={clearAll}
          disabled={isMissionRunning}
          className="text-[10px] text-red-400 hover:text-red-300 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">

        {activeGoals.length === 0 && (
          <div className="text-center py-8 text-slate-600 text-xs italic">
            {missionMode === 'waypoint'
              ? 'Klik di peta untuk menambah waypoint...'
              : 'Klik & tahan di peta, drag untuk orientasi...'}
          </div>
        )}

        {/* ── MODE 1 LIST ─────────────────────────────────────────────────── */}
        {missionMode === 'waypoint' && goals.map((g, index) => (
          <div key={g.id}
            className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${cardStyle(g.id)}`}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border flex-shrink-0 ${numBadgeClass(g.id)}`}>
                {wpStatus[g.id] === 'done' ? '✓' : index + 1}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-300">WP {index + 1}</span>
                  {statusBadge(g.id)}
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  X:{g.rosX.toFixed(2)} Y:{g.rosY.toFixed(2)}
                  {'depth' in g && <span className="text-blue-400/70"> Z:{(g as any).depth.toFixed(1)}</span>}
                </span>
              </div>
            </div>
            {!isMissionRunning && (
              <button onClick={() => removeGoal(g.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
            )}
          </div>
        ))}

        {/* ── MODE 2 LIST ─────────────────────────────────────────────────── */}
        {missionMode === 'path' && pathGoals.map((g, index) => {
          const isActive = activeGoalId === g.id;
          const s = wpStatus[g.id];
          return (
            <div key={g.id}
              className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${
                s === 'done'     ? 'bg-green-600/10 border-green-500/30' :
                s === 'rotating' ? 'bg-blue-600/20 border-blue-500/50' :
                isActive         ? 'bg-purple-600/20 border-purple-500/50' :
                'bg-white/5 border-white/5'
              }`}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border flex-shrink-0 ${
                  s === 'done'     ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                  s === 'rotating' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse' :
                  isActive         ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' :
                  'bg-white/5 border-white/10 text-slate-500'
                }`}>
                  {s === 'done' ? '✓' : index + 1}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-300">Path WP {index + 1}</span>
                    {s === 'done'     && <span className="text-[9px] text-green-400 font-bold">✓ SELESAI</span>}
                    {s === 'rotating' && <span className="text-[9px] text-blue-400 font-bold animate-pulse">↻ ROTATE</span>}
                    {isActive && s === 'active' && <span className="text-[9px] text-purple-400 font-bold animate-pulse">● MENUJU</span>}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    X:{g.rosX.toFixed(2)} Y:{g.rosY.toFixed(2)}
                    {'depth' in g && <span className="text-blue-400/70"> Z:{(g as any).depth.toFixed(1)}</span>}
                    {' '}
                    <span className={g.yawDeg !== 0 ? 'text-purple-400' : 'text-slate-600'}>
                      | {yawToCompass(g.yawDeg)} ({g.yawDeg.toFixed(0)}°)
                    </span>
                  </span>
                </div>
              </div>
              {!isMissionRunning && (
                <button onClick={() => removePathGoal(g.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Mission button */}
      <div className="border-t border-white/10 pt-4">
        {!isMissionRunning ? (
          <button
            onClick={startMission}
            disabled={activeGoals.length === 0 || !isConnected}
            className={`w-full p-4 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-white transition-all uppercase tracking-widest ${
              missionMode === 'waypoint'
                ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.35)]'
            }`}
          >
            {missionMode === 'waypoint' ? '▶️ Start Waypoint Mission' : '▶️ Start Path Mission'}
          </button>
        ) : (
          <button
            onClick={stopMission}
            className="w-full p-4 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all uppercase tracking-widest animate-pulse"
          >
            ⏹️ Stop (Emergency)
          </button>
        )}
      </div>
    </>
  );
};