import React, { useState, useEffect } from 'react';

interface Props {
  isActive: boolean;
  onUpdate: (newThrusters: number[]) => void;
}

export const KeyboardPanel: React.FC<Props> = ({ isActive, onUpdate }) => {
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

  return (
    <div className="bg-[#161b22] p-6 rounded-xl border border-purple-500/20 shadow-lg h-full">
      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <span>⌨️</span> 6-DOF Full Combinational
      </h3>
      
      <div className="flex flex-col items-center gap-6">
        {/* Visualizer Utama: QWASDE */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] text-slate-500 font-bold uppercase">Horizontal Control (Surge/Sway/Yaw)</span>
          <div className="flex gap-2">
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${activeKeys.has('q') ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>Q</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${activeKeys.has('w') ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>W</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${activeKeys.has('e') ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>E</kbd>
          </div>
          <div className="flex gap-2">
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${activeKeys.has('a') ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>A</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${activeKeys.has('s') ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>S</kbd>
            <kbd className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${activeKeys.has('d') ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'}`}>D</kbd>
          </div>
        </div>

        {/* Visualizer Sumbu Lainnya */}
        <div className="grid grid-cols-3 gap-4 w-full border-t border-white/5 pt-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] text-slate-500 uppercase font-bold">Pitch</span>
            <div className="flex flex-col gap-1">
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${activeKeys.has('i') ? 'bg-cyan-600' : 'bg-slate-800'}`}>I</kbd>
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${activeKeys.has('k') ? 'bg-cyan-600' : 'bg-slate-800'}`}>K</kbd>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] text-slate-500 uppercase font-bold">Heave</span>
            <div className="flex flex-col gap-1">
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${activeKeys.has('b') ? 'bg-green-600' : 'bg-slate-800'}`}>B</kbd>
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${activeKeys.has(' ') ? 'bg-red-600' : 'bg-slate-800'}`}>SP</kbd>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[8px] text-slate-500 uppercase font-bold">Roll</span>
            <div className="flex flex-col gap-1">
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${activeKeys.has('j') ? 'bg-yellow-600' : 'bg-slate-800'}`}>J</kbd>
              <kbd className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xs ${activeKeys.has('l') ? 'bg-yellow-600' : 'bg-slate-800'}`}>L</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};