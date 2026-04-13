import React from 'react';
import { RotateCcw, FileDown, AlertTriangle } from 'lucide-react';

// Tambahkan interface untuk menerima saklar isDarkMode
interface ParametersProps {
  isDarkMode?: boolean;
}

export default function Parameters({ isDarkMode = true }: ParametersProps) {
  
  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const warningBg = isDarkMode 
    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
    : 'bg-red-50 border-red-200 text-red-600';

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      
      {/* ==================================================
          Card 1: Reset Parameters (Zona Berbahaya / Merah)
          ================================================== */}
      <div className={`p-6 md:p-8 rounded-2xl border transition-colors duration-300 flex flex-col h-full ${cardBg}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
            <RotateCcw size={22} />
          </div>
          <h3 className="font-black text-lg md:text-xl uppercase tracking-wide">Reset Parameters</h3>
        </div>
        
        {/* Kotak Peringatan */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border mb-6 flex-1 transition-colors duration-300 ${warningBg}`}>
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <p className="text-[11px] md:text-xs font-medium leading-relaxed">
            This will effectively wipe your <strong className="font-black tracking-wider">"EEPROM"</strong>. You will lose all your parameters, vehicle setup, and calibrations. 
            Use this if you don't know which parameters you changed and need a clean start.
          </p>
        </div>

        <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg shadow-red-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
          <RotateCcw size={16} />
          Reset All Parameters
        </button>
      </div>

      {/* ==================================================
          Card 2: Load Recommended (Zona Aman / Biru)
          ================================================== */}
      <div className={`p-6 md:p-8 rounded-2xl border transition-colors duration-300 flex flex-col h-full ${cardBg}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FileDown size={22} />
          </div>
          <h3 className="font-black text-lg md:text-xl uppercase tracking-wide">Load Recommended</h3>
        </div>
        
        <p className={`text-xs md:text-sm font-medium leading-relaxed mb-6 flex-1 transition-colors duration-300 ${mutedColor}`}>
          These are the recommended parameter sets for your vehicle and firmware version. Curated by <strong className={`font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Blue Robotics</strong>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
            <FileDown size={16} />
            Standard
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3.5 rounded-xl text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2">
            <FileDown size={16} />
            Heavy
          </button>
        </div>
      </div>

    </div>
  );
}