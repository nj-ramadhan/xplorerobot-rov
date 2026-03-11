import React from 'react';

interface MissionPanelProps {
  goals: Array<any>;
  removeGoal: (id: number) => void;
  isMissionRunning: boolean;
  startMission: () => void;
  stopMission: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ goals, removeGoal, isMissionRunning, startMission, stopMission }) => {
  return (
    <>
      {/* Daftar List Waypoint */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-6 min-h-[150px]">
        {goals.map((goal, idx) => (
          <div key={goal.id} className="bg-black/40 p-3 rounded-lg border border-white/10 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-purple-600/20 text-purple-400 text-[10px] font-bold flex items-center justify-center border border-purple-500/30">{idx + 1}</div>
              <div>
                <div className="text-[10px] font-bold text-slate-300">Waypoint {idx + 1}</div>
                <div className="text-[9px] font-mono text-slate-500">
                  X: <span className="text-blue-400">{goal.rosX}</span> | Y: <span className="text-green-400">{goal.rosY}</span>
                </div>
              </div>
            </div>
            <button onClick={() => removeGoal(goal.id)} className="text-slate-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all">✕</button>
          </div>
        ))}
      </div>

      {/* Tombol Eksekusi Misi */}
      <div className="mt-auto border-t border-white/10 pt-4">
        {!isMissionRunning ? (
          <button onClick={startMission} className="w-full p-4 bg-green-600 hover:bg-green-500 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all uppercase tracking-widest">
            ▶️ Start Mission
          </button>
        ) : (
          <button onClick={stopMission} className="w-full p-4 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all uppercase tracking-widest animate-pulse">
            ⏹️ Stop (Emergency)
          </button>
        )}
      </div>
    </>
  );
};