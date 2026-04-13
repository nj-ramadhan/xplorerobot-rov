import React from 'react';

interface Props {
  thrusters: number[];
  isLocked: boolean;
  onChange: (index: number, val: number) => void;
  isDarkMode?: boolean; // Saklar tema
}

export const ThrusterMatrixPanel: React.FC<Props> = ({ thrusters, isLocked, onChange, isDarkMode = true }) => {
  const names = ["T1 (Depan Kanan)", "T2 (Depan Kiri)", "T3 (Blk Kanan)", "T4 (Blk Kiri)", "T5 (Vert Kanan)", "T6 (Vert Kiri)"];

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const containerBg = isDarkMode ? 'bg-[#111827] border-white/5' : 'bg-white border-slate-200 shadow-xl';
  const headerColor = isDarkMode ? 'text-slate-400 border-white/5' : 'text-slate-600 border-slate-200';
  const valueBoxBg = isDarkMode ? 'bg-black/60 text-slate-300 border-transparent' : 'bg-slate-50 text-slate-700 border-slate-200 shadow-inner';
  
  // Warna track slider
  const trackLocked = isDarkMode ? 'bg-slate-700 accent-purple-500' : 'bg-slate-300 accent-purple-600';
  const trackUnlocked = isDarkMode ? 'bg-slate-800 accent-blue-500' : 'bg-slate-300 accent-blue-600';

  return (
    <div className={`p-6 rounded-xl border shadow-2xl relative transition-colors duration-300 ${containerBg}`}>
      
      {isLocked && (
        <div className="absolute top-2 right-4 bg-purple-600 text-white text-[9px] font-bold px-2 py-1 rounded animate-pulse shadow-md">
          LOCKED BY KEYBOARD
        </div>
      )}
      
      <h3 className={`font-bold mb-6 uppercase tracking-widest text-xs border-b pb-2 transition-colors duration-300 ${headerColor}`}>
        Direct Thruster Matrix
      </h3>
      
      <div className="grid grid-cols-1 gap-y-6">
        {thrusters.map((val, idx) => {
          const isActive = val !== 0;
          
          // Logika warna teks label berdasarkan state & tema
          let labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
          if (isActive) {
            if (isLocked) labelColor = isDarkMode ? 'text-purple-400' : 'text-purple-600';
            else labelColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
          }

          return (
            <div key={idx} className={`space-y-2 transition-all duration-300 ${isLocked && isActive ? 'opacity-100 scale-[1.02]' : 'opacity-90'}`}>
              <div className="flex justify-between items-center">
                <label className={`text-[11px] font-bold transition-colors duration-300 ${labelColor}`}>
                  {names[idx]}
                </label>
                <div className={`w-16 border rounded px-2 py-1 text-xs text-center font-mono font-bold transition-colors duration-300 ${valueBoxBg}`}>
                  {val.toFixed(1)}
                </div>
              </div>
              <input 
                type="range" min="-50.0" max="50.0" step="0.5" value={val} 
                onChange={(e) => onChange(idx, parseFloat(e.target.value))} 
                onDoubleClick={() => onChange(idx, 0)}
                disabled={isLocked}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${isLocked ? trackLocked : trackUnlocked}`} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};