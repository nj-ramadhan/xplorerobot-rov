import React, { useState, useEffect } from 'react';

interface Props {
  isActive: boolean;
  onUpdate: (newThrusters: number[]) => void;
  isDarkMode?: boolean; // Saklar tema
}

export const KeyboardPanel: React.FC<Props> = ({ isActive, onUpdate, isDarkMode = true }) => {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  // 1. DAFTAR TOMBOL (Ditambah Q dan E untuk Sway)
  const allowedKeys = ['w', 's', 'a', 'd', 'q', 'e', ' ', 'b', 'j', 'l', 'i', 'k'];

  useEffect(() => {
    if (!isActive) { setActiveKeys(new Set()); return; }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (allowedKeys.includes(key)) {
        e.preventDefault();
        setActiveKeys(prev => new Set(prev).add(key));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKeys(prev => { 
        const n = new Set(prev); 
        n.delete(key); 
        return n; 
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { 
      window.removeEventListener('keydown', handleKeyDown); 
      window.removeEventListener('keyup', handleKeyUp); 
    };
  }, [isActive]);

  // --- 2. LOGIKA KINEMATIKA KOMBINASIONAL 6-DOF ---
  useEffect(() => {
    if (!isActive) return;
    
    const speed = 35.0; 
    let newT = [0, 0, 0, 0, 0, 0];

    // SURGE (Maju/Mundur) - W/S
    if (activeKeys.has('w')) { 
      newT[0]+=speed; newT[1]+=speed; newT[2]+=speed; newT[3]+=speed; 
      if (activeKeys.has('i')) { newT[4]-=20; newT[5]-=20; } // Bonus gaya selam jika nungging
    }
    if (activeKeys.has('s')) { newT[0]-=speed; newT[1]-=speed; newT[2]-=speed; newT[3]-=speed; }

    // YAW (Belok) - A/D
    if (activeKeys.has('a')) { newT[0]+=speed; newT[1]-=speed; newT[2]+=speed; newT[3]-=speed; }
    if (activeKeys.has('d')) { newT[0]-=speed; newT[1]+=speed; newT[2]-=speed; newT[3]+=speed; }

    // SWAY (Geser Samping) - Q/E (Logika Vectored)
    if (activeKeys.has('q')) { newT[0]+=speed; newT[1]-=speed; newT[2]-=speed; newT[3]+=speed; }
    if (activeKeys.has('e')) { newT[0]-=speed; newT[1]+=speed; newT[2]+=speed; newT[3]-=speed; }

    // HEAVE (Naik/Turun) - B/Space
    if (activeKeys.has('b')) { newT[4]+=speed; newT[5]-=speed; }
    if (activeKeys.has(' ')) { newT[4]-=speed; newT[5]+=speed; }

    // ROLL (Guling) - J/L
    if (activeKeys.has('j')) { newT[4]+=speed; newT[5]+=speed; }
    if (activeKeys.has('l')) { newT[4]+=speed; newT[5]+=speed; }

    // PITCH (Nungging) - I/K
    if (activeKeys.has('i')) { newT[4]-=15; newT[5]+=15; } 
    if (activeKeys.has('k')) { newT[4]+=15; newT[5]-=15; }

    onUpdate(newT.map(v => Math.max(-50, Math.min(50, v))));
  }, [activeKeys, isActive, onUpdate]);

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const containerBg = isDarkMode ? 'bg-[#161b22] border-purple-500/20' : 'bg-purple-50/50 border-purple-200';
  const borderColor = isDarkMode ? 'border-white/5' : 'border-slate-200';
  const labelColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  
  // Style Tuts Keyboard (Default Idle)
  const keyIdle = isDarkMode 
    ? 'bg-slate-800 text-slate-400 border border-slate-700 shadow-md' 
    : 'bg-white text-slate-500 border border-slate-200 shadow-md';

  return (
    <div className={`p-6 rounded-xl border shadow-lg h-full transition-colors duration-300 ${containerBg}`}>
      <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-6 border-b pb-4 transition-colors duration-300 ${isDarkMode ? 'text-purple-400 border-white/5' : 'text-purple-600 border-slate-200'}`}>
        <span>⌨️</span> 6-DOF Full Combinational
      </h3>
      
      <div className="flex flex-col items-center gap-6">
        {/* Visualizer Utama: QWASDE */}
        <div className="flex flex-col items-center gap-2">
          <span className={`text-[9px] font-bold uppercase transition-colors duration-300 ${labelColor}`}>Horizontal Control (Surge/Sway/Yaw)</span>
          <div className="flex gap-2">
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-black transition-all ${activeKeys.has('q') ? 'bg-blue-600 text-white shadow-inner scale-95' : keyIdle}`}>Q</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-black transition-all ${activeKeys.has('w') ? 'bg-purple-600 text-white shadow-inner scale-95' : keyIdle}`}>W</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-black transition-all ${activeKeys.has('e') ? 'bg-blue-600 text-white shadow-inner scale-95' : keyIdle}`}>E</kbd>
          </div>
          <div className="flex gap-2">
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-black transition-all ${activeKeys.has('a') ? 'bg-purple-600 text-white shadow-inner scale-95' : keyIdle}`}>A</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-black transition-all ${activeKeys.has('s') ? 'bg-purple-600 text-white shadow-inner scale-95' : keyIdle}`}>S</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-black transition-all ${activeKeys.has('d') ? 'bg-purple-600 text-white shadow-inner scale-95' : keyIdle}`}>D</kbd>
          </div>
        </div>

        {/* Visualizer Sumbu Lainnya */}
        <div className={`grid grid-cols-3 gap-4 w-full border-t pt-4 transition-colors duration-300 ${borderColor}`}>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-[8px] uppercase font-bold transition-colors duration-300 ${labelColor}`}>Pitch</span>
            <div className="flex flex-col gap-1">
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${activeKeys.has('i') ? 'bg-cyan-600 text-white shadow-inner scale-95' : keyIdle}`}>I</kbd>
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${activeKeys.has('k') ? 'bg-cyan-600 text-white shadow-inner scale-95' : keyIdle}`}>K</kbd>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-[8px] uppercase font-bold transition-colors duration-300 ${labelColor}`}>Heave</span>
            <div className="flex flex-col gap-1">
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${activeKeys.has('b') ? 'bg-green-600 text-white shadow-inner scale-95' : keyIdle}`}>B</kbd>
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-black text-[10px] transition-all ${activeKeys.has(' ') ? 'bg-red-600 text-white shadow-inner scale-95' : keyIdle}`}>SP</kbd>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-[8px] uppercase font-bold transition-colors duration-300 ${labelColor}`}>Roll</span>
            <div className="flex flex-col gap-1">
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${activeKeys.has('j') ? 'bg-yellow-500 text-white shadow-inner scale-95' : keyIdle}`}>J</kbd>
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-black text-xs transition-all ${activeKeys.has('l') ? 'bg-yellow-500 text-white shadow-inner scale-95' : keyIdle}`}>L</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};