import React, { useState } from 'react';

interface Props {
  onFinish: () => void;
}

export const PreFlightChecklist: React.FC<Props> = ({ onFinish }) => {
  const [checks, setChecks] = useState([false, false]);
  const isAllChecked = checks.every(Boolean);

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] mx-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-xl">📋</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">ROS 2 Pre-Flight Checklist</h2>
        </div>
        <p className="text-slate-400 text-sm mb-8 border-b border-[#30363d] pb-4 uppercase">
          Pastikan semua sistem simulator di Ubuntu sudah siap sebelum memulai.
        </p>

        <div className="space-y-4 mb-8">
          <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[0] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
            <input type="checkbox" checked={checks[0]} onChange={() => handleCheck(0)} className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700" />
            <div className="flex-1">
              <h3 className={`font-bold ${checks[0] ? 'text-blue-400' : 'text-slate-200'}`}>1. Gazebo & ROSBridge Aktif</h3>
              <p className="text-[10px] text-slate-500 mt-1">Terminal 1 & 2 harus sudah running tanpa error.</p>
            </div>
          </label>

          <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[1] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
            <input type="checkbox" checked={checks[1]} onChange={() => handleCheck(1)} className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700" />
            <div className="flex-1">
              <h3 className={`font-bold ${checks[1] ? 'text-blue-400' : 'text-slate-200'}`}>2. Thruster Manager Standby</h3>
              <p className="text-[10px] text-slate-500 mt-1">Node python thruster_manager.py sudah menunggu perintah.</p>
            </div>
          </label>
        </div>

        <button 
          onClick={onFinish}
          disabled={!isAllChecked}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all ${isAllChecked ? 'bg-blue-600 text-white shadow-lg cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
        >
          {isAllChecked ? '🚀 Mulai Kendali ROV' : 'Selesaikan Checklist'}
        </button>
      </div>
    </div>
  );
};