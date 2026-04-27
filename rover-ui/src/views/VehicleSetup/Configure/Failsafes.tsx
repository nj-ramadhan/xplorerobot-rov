import React, { useState } from 'react';
import { ShieldAlert, ActivitySquare, Gamepad2, Droplets, GaugeCircle } from 'lucide-react';

// Tambahkan interface untuk menerima saklar isDarkMode
interface FailsafesProps {
  isDarkMode?: boolean;
}

const Failsafes: React.FC<FailsafesProps> = ({ isDarkMode = true }) => {
  const [heartbeatEnable, setHeartbeatEnable] = useState(true);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const saveFailsafes = () => {
    setIsSaving(true);
    setStatus('Saving configurations...');
    setTimeout(() => {
      setIsSaving(false);
      setStatus('Failsafe configurations saved successfully.');
      setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const subtitleColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const inputCardBg = isDarkMode
    ? 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
    : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm';

  const inputFieldBg = isDarkMode
    ? 'bg-[#1A2332] border-slate-700 focus:border-red-500 text-white'
    : 'bg-white border-slate-300 focus:border-red-500 text-slate-900 shadow-inner';

  return (
    <div className={`p-4 md:p-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      <div className={`max-w-6xl mx-auto rounded-2xl border p-6 md:p-8 transition-colors duration-300 ${cardBg}`}>
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl shrink-0 ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-1">Failsafes Configuration</h2>
            <p className={`text-xs leading-relaxed max-w-3xl transition-colors duration-300 ${subtitleColor}`}>
              Failsafe configuration exposes important autopilot failsafe features through an intuitive interface. 
              Failsafes should be set up as part of responsible operation, and can provide early warnings of problems, 
              and trigger automated safe behaviours if a critical issue occurs.
            </p>
          </div>
        </div>

        {/* Grid Layout 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 items-stretch">
          
          {/* 1. Control Station Heartbeat Loss */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className={`font-black uppercase tracking-wider mb-2 flex items-center gap-2.5 text-[13px] ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              <ActivitySquare size={16} />
              Control Station Heartbeat Loss
            </h3>
            <p className={`text-[11px] mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              Triggers when the vehicle does not receive a heartbeat from the GCS within the timeout (default 3 seconds).
            </p>
            <div className="space-y-5 mt-auto pt-4 border-t border-slate-700/30">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>Enable Failsafe</span>
                <button onClick={() => setHeartbeatEnable(!heartbeatEnable)} className={`w-11 h-6 rounded-full relative transition-colors shadow-inner ${heartbeatEnable ? 'bg-red-500' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${heartbeatEnable ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Timeout (Seconds)</label>
                <input type="number" defaultValue={3} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
              </div>
            </div>
          </div>

          {/* 2. Pilot Input Loss */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className={`font-black uppercase tracking-wider mb-2 flex items-center gap-2.5 text-[13px] ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              <Gamepad2 size={16} />
              Pilot Input Loss
            </h3>
            <p className={`text-[11px] mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              Triggers when the vehicle does not receive any pilot input for a given amount of time.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-700/30">
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Timeout</label>
                <input type="number" defaultValue={3} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Action</label>
                <select className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none cursor-pointer transition-colors duration-300 ${inputFieldBg}`}>
                  <option>2 (Return to Home)</option>
                  <option>0 (Disabled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Leak Detection */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className={`font-black uppercase tracking-wider mb-2 flex items-center gap-2.5 text-[13px] ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              <Droplets size={16} />
              Leak Detection
            </h3>
            <p className={`text-[11px] mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              Triggers when a leak is detected. We recommend keeping control electronics dry.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-700/30">
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Leak probe type</label>
                <input type="number" defaultValue={-1} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Leak 1 pin</label>
                <select className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none cursor-pointer transition-colors duration-300 ${inputFieldBg}`}>
                  <option>Custom: 8</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Excess Internal Pressure */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className={`font-black uppercase tracking-wider mb-2 flex items-center gap-2.5 text-[13px] ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              <GaugeCircle size={16} />
              Excess Internal Pressure
            </h3>
            <p className={`text-[11px] mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              Triggers when the internal pressure is too high. This helps to detect a leak, and to avoid rapid unplanned disassembly.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-700/30">
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Max internal pressure</label>
                <input type="number" defaultValue={105000} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
              </div>
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Action</label>
                <input type="number" defaultValue={0} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
              </div>
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="flex flex-col items-center gap-4 border-t border-slate-700/30 pt-8">
          <button 
            onClick={saveFailsafes}
            disabled={isSaving}
            className={`px-12 py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
              ${isSaving 
                ? 'bg-blue-800 cursor-not-allowed opacity-75' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.98]'
              }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SAVING...
              </>
            ) : (
              'SAVE CONFIGURATION'
            )}
          </button>
          
          <div className="h-6">
            {status && (
              <p className={`text-[11px] font-bold uppercase tracking-widest transition-all ${isSaving ? 'text-blue-400 animate-pulse' : 'text-emerald-500'}`}>
                {isSaving ? '⏳ ' : '✅ '}{status}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Failsafes;