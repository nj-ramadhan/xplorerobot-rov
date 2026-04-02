import React from 'react';
import { TelemetryData } from '../types/telemetry';

interface NavbarProps {
  telemetry: TelemetryData;
  isDarkMode: boolean;
  toggleMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ telemetry, isDarkMode, toggleMode }) => {
  return (
    <header className={`h-16 border-b transition-colors duration-500 flex items-center justify-between px-6 z-40 flex-shrink-0
      ${isDarkMode ? 'bg-[#111827] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'}
    `}>
      {/* Brand & Judul Kelompok */}
      <div className="flex flex-col">
        <h1 className="text-sm font-black tracking-tighter uppercase flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
          ROV <span className="text-blue-500">POLMAN</span> BANDUNG
        </h1>
        <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest mt-0.5">Industrial Informatics - TRIN</p>
      </div>
      {/* Area Kanan (Koneksi & Kontrol) */}
      <div className="flex items-center gap-6">
        
        {/* Status IP (Sembunyi di layar kecil) */}
        <div className="hidden md:flex items-center gap-3 border-r border-white/10 pr-6">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          <span className="text-[10px] font-mono font-bold tracking-wider text-green-500 uppercase">{telemetry.status}</span>
          <span className="text-[10px] font-mono opacity-40">| 172.16.25.104</span>
        </div>

        {/* Toggle Mode */}
        <button onClick={toggleMode} className="p-2 hover:bg-slate-500/20 rounded-full transition-all text-lg">
          {isDarkMode ? '🌙' : '☀️'}
        </button>
        
        {/* Indikator */}
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-[10px] font-bold font-mono ${isDarkMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-100 text-yellow-700'}`}>
            {telemetry.voltage}V
          </div>
          <div className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            {telemetry.mode}
          </div>
        </div>

      </div>
    </header>
  );
};