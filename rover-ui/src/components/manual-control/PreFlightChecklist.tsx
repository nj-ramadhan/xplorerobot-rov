import React, { useState } from 'react';

interface Props {
  onFinish: () => void;
  isDarkMode?: boolean; // Saklar tema ditambahkan
}

export const PreFlightChecklist: React.FC<Props> = ({ onFinish, isDarkMode = true }) => {
  const [checks, setChecks] = useState([false, false]);
  const isAllChecked = checks.every(Boolean);

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-500 ${isDarkMode ? 'bg-[#0b0e11]/80' : 'bg-slate-900/30'}`}>
      <div className={`border rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl transition-colors duration-300 ${isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}`}>
        
        <div className="flex items-center gap-3 mb-2">
          <span className={`p-2 rounded-lg text-xl ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>📋</span>
          <h2 className={`text-2xl font-black uppercase tracking-wider ${textColor}`}>ROS 2 Pre-Flight Checklist</h2>
        </div>
        <p className={`text-sm mb-8 border-b pb-4 uppercase ${subtitleColor} ${isDarkMode ? 'border-[#30363d]' : 'border-slate-200'}`}>
          Pastikan semua sistem simulator di Ubuntu sudah siap sebelum memulai.
        </p>

        <div className="space-y-4 mb-8">
          
          {/* CHECKLIST 1 */}
          <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[0] ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200') : (isDarkMode ? 'bg-black/20 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}`}>
            <input type="checkbox" checked={checks[0]} onChange={() => handleCheck(0)} className="mt-1 w-5 h-5 rounded border-slate-400 text-blue-600 cursor-pointer" />
            <div className="flex-1">
              <h3 className={`font-bold ${checks[0] ? 'text-blue-600' : textColor}`}>1. Gazebo & ROSBridge Aktif</h3>
              <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Terminal 1 & 2 harus sudah running tanpa error.</p>
            </div>
          </label>

          {/* CHECKLIST 2 */}
          <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[1] ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200') : (isDarkMode ? 'bg-black/20 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}`}>
            <input type="checkbox" checked={checks[1]} onChange={() => handleCheck(1)} className="mt-1 w-5 h-5 rounded border-slate-400 text-blue-600 cursor-pointer" />
            <div className="flex-1">
              <h3 className={`font-bold ${checks[1] ? 'text-blue-600' : textColor}`}>2. Thruster Manager Standby</h3>
              <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Node python thruster_manager.py sudah menunggu perintah.</p>
            </div>
          </label>

        </div>

        {/* TOMBOL OK / MULAI */}
        <button 
          onClick={onFinish}
          disabled={!isAllChecked}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
            isAllChecked 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg cursor-pointer' 
              : (isDarkMode ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed')
          }`}
        >
          {isAllChecked ? '🚀 Mulai Kendali ROV' : 'Selesaikan Checklist'}
        </button>

      </div>
    </div>
  );
};