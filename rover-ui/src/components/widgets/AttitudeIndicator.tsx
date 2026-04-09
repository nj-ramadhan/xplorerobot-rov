import React from 'react';

interface Props {
  pitch: number;
  roll: number;
}

export const AttitudeIndicator: React.FC<Props> = ({ pitch, roll }) => {
  return (
    <div className="bg-[#111827] p-5 rounded-xl border border-white/5 shadow-lg flex flex-col items-center">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 self-start">Attitude (Pitch/Roll)</h3>
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-700 bg-blue-900">
        {/* Pitch & Roll Overlay */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `rotate(${-roll}deg) translateY(${pitch * 2}px)` 
          }}
        >
          {/* Garis Horizon */}
          <div className="absolute top-1/2 w-full h-1 bg-white/50"></div>
          {/* Area Tanah (Simulasi) */}
          <div className="absolute top-1/2 w-full h-full bg-amber-900/40"></div>
        </div>
        
        {/* Crosshair Tengah */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-[2px] bg-green-500"></div>
          <div className="w-[2px] h-8 bg-green-500"></div>
        </div>
      </div>
      <div className="flex gap-4 mt-4 text-[10px] font-mono">
        <span className="text-slate-400">P: <span className="text-white">{pitch}°</span></span>
        <span className="text-slate-400">R: <span className="text-white">{roll}°</span></span>
      </div>
    </div>
  );
};