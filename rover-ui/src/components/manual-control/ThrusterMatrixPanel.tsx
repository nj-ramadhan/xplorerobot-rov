import React from 'react';

interface Props {
  thrusters: number[];
  isLocked: boolean;
  onChange: (index: number, val: number) => void;
}

export const ThrusterMatrixPanel: React.FC<Props> = ({ thrusters, isLocked, onChange }) => {
  const names = ["T1 (Depan Kanan)", "T2 (Depan Kiri)", "T3 (Blk Kanan)", "T4 (Blk Kiri)", "T5 (Vert Kanan)", "T6 (Vert Kiri)"];

  return (
    <div className="bg-[#111827] p-6 rounded-xl border border-white/5 shadow-2xl relative">
      {isLocked && <div className="absolute top-2 right-4 bg-purple-600 text-white text-[9px] font-bold px-2 py-1 rounded animate-pulse">LOCKED BY KEYBOARD</div>}
      <h3 className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-xs border-b border-white/5 pb-2">Direct Thruster Matrix</h3>
      <div className="grid grid-cols-1 gap-y-6">
        {thrusters.map((val, idx) => (
          <div key={idx} className={`space-y-2 ${isLocked && val !== 0 ? 'opacity-100 scale-[1.02]' : 'opacity-80'}`}>
            <div className="flex justify-between items-center">
              <label className={`text-[11px] font-bold ${val !== 0 ? (isLocked ? 'text-purple-400' : 'text-blue-400') : 'text-slate-300'}`}>{names[idx]}</label>
              <div className="w-16 bg-black/60 rounded px-2 py-1 text-xs text-center text-slate-300">{val.toFixed(1)}</div>
            </div>
            <input 
              type="range" min="-50.0" max="50.0" step="0.5" value={val} 
              onChange={(e) => onChange(idx, parseFloat(e.target.value))} onDoubleClick={() => onChange(idx, 0)}
              disabled={isLocked}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${isLocked ? 'bg-slate-700 accent-purple-500' : 'bg-slate-800 accent-blue-500'}`} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};