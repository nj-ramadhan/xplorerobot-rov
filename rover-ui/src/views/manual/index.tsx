import React, { useState, useEffect } from 'react';
import { TelemetryData } from '../../types/telemetry';

interface ManualProps {
  telemetry: TelemetryData;
  isArmed: boolean;
  toggleArm: () => void;
  sendRC: (channels: Record<number, number>) => void;
  isDarkMode?: boolean;
}

export const Manual: React.FC<ManualProps> = ({ telemetry, isArmed, toggleArm, sendRC, isDarkMode = true }) => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [checks, setChecks] = useState([false, false, false]);
  
  const isAllChecked = checks.every(Boolean);

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const [controls, setControls] = useState({
    forward: 1500, lateral: 1500, vertical: 1500, roll: 1500, pitch: 1500, yaw: 1500
  });
  const [missionTime, setMissionTime] = useState(0);
  const [lights, setLights] = useState(false);
  const [gripper, setGripper] = useState(0); 

  useEffect(() => {
    let interval: any;
    if (isArmed) {
      interval = setInterval(() => setMissionTime(t => t + 1), 1000);
    } else {
      setMissionTime(0);
    }
    return () => clearInterval(interval);
  }, [isArmed]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value);
    
    if (!isNaN(numericValue)) {
      const constrainedValue = Math.max(1100, Math.min(1900, numericValue));
      const updated = { ...controls, [name]: constrainedValue };
      setControls(updated);
      
      const channelMap = { pitch: 1, roll: 2, vertical: 3, yaw: 4, forward: 5, lateral: 6 };
      sendRC({
        [channelMap.pitch]: updated.pitch,
        [channelMap.roll]: updated.roll,
        [channelMap.vertical]: updated.vertical,
        [channelMap.yaw]: updated.yaw,
        [channelMap.forward]: updated.forward,
        [channelMap.lateral]: updated.lateral
      });
    }
  };

  const resetControls = () => {
    const neutral = { forward: 1500, lateral: 1500, vertical: 1500, roll: 1500, pitch: 1500, yaw: 1500 };
    setControls(neutral);
    sendRC({ 1: 1500, 2: 1500, 3: 1500, 4: 1500, 5: 1500, 6: 1500 });
  };

  const resetSingleAxis = (axis: keyof typeof controls) => {
    const updated = { ...controls, [axis]: 1500 };
    setControls(updated);
    
    const channelMap: Record<string, number> = { pitch: 1, roll: 2, vertical: 3, yaw: 4, forward: 5, lateral: 6 };
    sendRC({ [channelMap[axis]]: 1500 });
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  
  const cardClasses = isDarkMode 
    ? 'bg-[#111827]/80 backdrop-blur-xl border-white/10 shadow-2xl' 
    : 'bg-white border-slate-200 shadow-xl';

  const boxBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200';
  const inputBg = isDarkMode ? 'bg-black/60 border-white/10 text-blue-400' : 'bg-white border-slate-300 text-blue-700 shadow-inner';
  
  const terminalBg = isDarkMode ? 'bg-black/60 border-white/5' : 'bg-slate-100 border-slate-200 shadow-inner';
  const terminalText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const terminalVal = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className={`space-y-6 animate-in fade-in duration-700 relative font-['Inter',sans-serif] ${textColor}`}>
      
      {/* =========================================================
          MODAL PRE-FLIGHT CHECKLIST (DIJAMIN GAK NABRAK ATAP!)
          ========================================================= */}
      {showTutorial && (
        <div className={`fixed inset-0 z-[100] flex p-6 md:p-12 backdrop-blur-md animate-in fade-in duration-300 ${isDarkMode ? 'bg-[#0b0e11]/80' : 'bg-slate-900/40'}`}>
          
          {/* Card Wrapper dengan m-auto dan max-h-full biar aman 100% */}
          <div className={`m-auto flex flex-col border rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-full shadow-2xl transition-colors duration-300 ${isDarkMode ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-slate-200'}`}>
            
            {/* 1. HEADER (TETAP DIAM) */}
            <div className="shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <span className={`p-2 rounded-lg text-xl ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>📋</span>
                <h2 className={`text-xl sm:text-2xl font-black uppercase tracking-wider ${textColor}`}>Pre-Flight Checklist</h2>
              </div>
              <p className={`text-sm mb-5 border-b pb-4 ${subtitleColor} ${isDarkMode ? 'border-[#30363d]' : 'border-slate-200'}`}>
                Selesaikan langkah inisialisasi ArduSub SITL berikut sebelum mengambil alih kendali Manual Override.
              </p>
            </div>

            {/* 2. KONTEN (BISA SCROLL) */}
            <div className="overflow-y-auto custom-scrollbar pr-2 mb-2 space-y-3">
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checks[0] ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200') : (isDarkMode ? 'bg-black/20 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}`}>
                <input type="checkbox" checked={checks[0]} onChange={() => handleCheck(0)} className="mt-1 w-4 h-4 rounded border-slate-400 text-blue-600 cursor-pointer" />
                <div>
                  <h3 className={`text-sm font-bold ${checks[0] ? 'text-blue-600' : textColor}`}>1. Aktifkan Environment & Simulator Ubuntu</h3>
                  <p className={`text-[11px] mt-1 mb-2 ${mutedColor}`}>Buka terminal WSL/Ubuntu kamu, lalu jalankan perintah ini secara berurutan:</p>
                  <div className={`p-3 rounded text-[10px] font-mono leading-relaxed border ${isDarkMode ? 'bg-black/60 text-green-400 border-white/5' : 'bg-slate-800 text-emerald-400 border-slate-700 shadow-inner'}`}>
                    cd ardupilot<br/>
                    . ~/.profile<br/>
                    cd ArduSub<br/>
                    sim_vehicle.py -v ArduSub -L RATBeach --out=udp:127.0.0.1:14550 --console
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checks[1] ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200') : (isDarkMode ? 'bg-black/20 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}`}>
                <input type="checkbox" checked={checks[1]} onChange={() => handleCheck(1)} className="mt-1 w-4 h-4 rounded border-slate-400 text-blue-600 cursor-pointer" />
                <div>
                  <h3 className={`text-sm font-bold ${checks[1] ? 'text-blue-600' : textColor}`}>2. Buka QGroundControl (Opsional)</h3>
                  <p className={`text-[11px] mt-1 ${mutedColor}`}>Buka aplikasi QGroundControl di Windows untuk memastikan 3D model ROV muncul dan terhubung ke UDP 14550.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${checks[2] ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200') : (isDarkMode ? 'bg-black/20 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')}`}>
                <input type="checkbox" checked={checks[2]} onChange={() => handleCheck(2)} className="mt-1 w-4 h-4 rounded border-slate-400 text-blue-600 cursor-pointer" />
                <div>
                  <h3 className={`text-sm font-bold ${checks[2] ? 'text-blue-600' : textColor}`}>3. Nyalakan Backend FastAPI</h3>
                  <p className={`text-[11px] mt-1 ${mutedColor}`}>Pastikan terminal backend Python sudah menyala (<code>uvicorn main:app --reload</code>) dan status di atas menunjukkan <span className="text-emerald-500 font-bold">Terhubung 🟢</span>.</p>
                </div>
              </label>
            </div>

            {/* 3. TOMBOL BAWAH (TETAP DIAM DI BAWAH KARTU) */}
            <div className={`shrink-0 mt-3 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <button 
                onClick={() => setShowTutorial(false)}
                disabled={!isAllChecked}
                className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                  isAllChecked 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg cursor-pointer transform hover:-translate-y-0.5' 
                    : (isDarkMode ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed')
                }`}
              >
                {isAllChecked ? '🚀 Masuk ke Flight Deck' : 'Selesaikan Checklist'}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ========================================================= */}


      {/* HEADER & TOP STATS */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 gap-4 transition-colors duration-300 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <div>
          <h2 className={`font-black text-xl uppercase tracking-wider flex items-center gap-3 transition-colors duration-300 ${textColor}`}>
            <span className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">🕹️</span>
            Manual Override (6-DOF)
          </h2>
          <p className={`text-[11px] font-mono mt-2 uppercase tracking-widest font-bold transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {telemetry.status === 'CONNECTED' ? "Terhubung 🟢" : "Terputus 🔴"} · ArduSub SITL Backend
          </p>
        </div>

        <div className="flex gap-4 font-mono text-[10px]">
          <div className={`px-3 py-1.5 rounded border transition-colors duration-300 ${boxBg}`}>
            <span className={`block font-bold transition-colors duration-300 ${mutedColor}`}>MISSION_CLOCK</span>
            <span className={`text-sm font-bold transition-colors duration-300 ${textColor}`}>{formatTime(missionTime)}</span>
          </div>
          <div className={`px-3 py-1.5 rounded border transition-colors duration-300 ${boxBg}`}>
            <span className={`block font-bold transition-colors duration-300 ${mutedColor}`}>REAL_PITCH</span>
            <span className="text-purple-500 text-sm font-bold drop-shadow-sm">{telemetry.pitch}°</span>
          </div>
          
          <button 
            onClick={toggleArm}
            className={`px-6 py-2 rounded font-bold transition-all border shadow-sm ${
              isArmed 
                ? (isDarkMode ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-red-100 text-red-600 border-red-300')
                : (isDarkMode ? 'bg-slate-800 text-slate-400 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200')
            }`}
          >
            {isArmed ? '🛑 DISARM MOTORS' : '⚙️ ARM VEHICLE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: 6-DOF CONTROL MATRIX */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`p-8 rounded-3xl border transition-colors duration-300 relative overflow-hidden ${cardClasses}`}>
            <div className="flex justify-between items-center mb-10">
              <h3 className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${mutedColor}`}>Manual Setpoints (PWM)</h3>
              <button onClick={resetControls} className={`text-[10px] px-4 py-1.5 rounded font-black uppercase transition-all border ${isDarkMode ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30' : 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 shadow-sm'}`}>
                EMERGENCY NEUTRAL (ALL)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* Linear Section */}
              <div className="space-y-8">
                <p className={`text-[10px] font-bold uppercase border-b pb-2 transition-colors duration-300 ${isDarkMode ? 'text-blue-500 border-white/5' : 'text-blue-600 border-slate-200'}`}>Linear Axis (Ch 5, 6, 3)</p>
                {['forward', 'lateral', 'vertical'].map((axis) => (
                  <div key={axis} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <label className={`text-[10px] font-mono font-bold uppercase transition-colors duration-300 ${mutedColor}`}>{axis}</label>
                        <button 
                          onClick={() => resetSingleAxis(axis as keyof typeof controls)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-blue-100 text-slate-600 border border-slate-300 shadow-sm'}`}
                          title="Reset ke Netral (1500)"
                        >
                          ↺
                        </button>
                      </div>
                      <input 
                        type="number" name={axis} value={controls[axis as keyof typeof controls]} onChange={handleInputChange}
                        className={`w-16 rounded px-2 py-1 text-xs font-mono font-bold text-center outline-none transition-colors duration-300 ${inputBg}`}
                      />
                    </div>
                    <input 
                      type="range" name={axis} min="1100" max="1900" 
                      value={controls[axis as keyof typeof controls]} 
                      onChange={handleInputChange} 
                      onDoubleClick={() => resetSingleAxis(axis as keyof typeof controls)}
                      className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-500 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} 
                    />
                  </div>
                ))}
              </div>

              {/* Rotational Section */}
              <div className="space-y-8">
                <p className={`text-[10px] font-bold uppercase border-b pb-2 transition-colors duration-300 ${isDarkMode ? 'text-purple-500 border-white/5' : 'text-purple-600 border-slate-200'}`}>Angular Axis (Ch 2, 1, 4)</p>
                {['roll', 'pitch', 'yaw'].map((axis) => (
                  <div key={axis} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <label className={`text-[10px] font-mono font-bold uppercase transition-colors duration-300 ${mutedColor}`}>{axis}</label>
                        <button 
                          onClick={() => resetSingleAxis(axis as keyof typeof controls)}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white' : 'bg-slate-200 hover:bg-purple-100 text-slate-600 border border-slate-300 shadow-sm'}`}
                        >
                          ↺
                        </button>
                      </div>
                      <input 
                        type="number" name={axis} value={controls[axis as keyof typeof controls]} onChange={handleInputChange}
                        className={`w-16 rounded px-2 py-1 text-xs font-mono font-bold text-center outline-none transition-colors duration-300 focus:border-purple-500 ${isDarkMode ? 'bg-black/60 border-white/10 text-purple-400' : 'bg-white border-slate-300 text-purple-700 shadow-inner'}`}
                      />
                    </div>
                    <input 
                      type="range" name={axis} min="1100" max="1900" 
                      value={controls[axis as keyof typeof controls]} 
                      onChange={handleInputChange} 
                      onDoubleClick={() => resetSingleAxis(axis as keyof typeof controls)}
                      className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-500 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VEHICLE ACTIONS PANEL */}
          <div className={`p-6 rounded-3xl border flex flex-wrap gap-4 transition-colors duration-300 ${cardClasses}`}>
            <button onClick={() => setLights(!lights)} className={`flex-1 py-3.5 rounded-xl font-bold text-[10px] uppercase border transition-all ${
              lights 
                ? (isDarkMode ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-yellow-50 border-yellow-300 text-yellow-600 shadow-sm')
                : (isDarkMode ? 'bg-slate-800 border-white/5 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200 shadow-sm')
            }`}>
              💡 Lights {lights ? 'ON' : 'OFF'}
            </button>
            <div className={`flex-[2] p-3 rounded-xl border flex items-center gap-4 px-5 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50 border-slate-300 shadow-sm'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase transition-colors duration-300 ${mutedColor}`}>Gripper</span>
                <button onClick={() => setGripper(0)} className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-600 shadow-sm'}`}>↺</button>
              </div>
              <input type="range" min="0" max="100" value={gripper} onChange={(e) => setGripper(parseInt(e.target.value))} className={`flex-1 h-1.5 rounded-lg appearance-none transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 accent-white' : 'bg-slate-300 accent-slate-700'}`} />
              <span className={`text-[10px] font-mono font-bold transition-colors duration-300 ${textColor}`}>{gripper}%</span>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: MONITORING LOGS */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`p-6 rounded-3xl border font-mono text-[10px] font-bold flex flex-col justify-between transition-colors duration-300 ${terminalBg}`}>
             <div className="space-y-3">
               <div className={`border-b pb-2 mb-4 font-black tracking-widest transition-colors duration-300 ${isDarkMode ? 'text-blue-500/80 border-white/10' : 'text-blue-700 border-slate-300'}`}>
                 TELEMETRY_DATA
               </div>
               <div className="flex justify-between"><span className={terminalText}>ROLL:</span> <span className={terminalVal}>{telemetry.roll}°</span></div>
               <div className="flex justify-between"><span className={terminalText}>PITCH:</span> <span className={terminalVal}>{telemetry.pitch}°</span></div>
               <div className="flex justify-between"><span className={terminalText}>HEADING:</span> <span className={terminalVal}>{telemetry.heading}°</span></div>
               
               <div className={`border-b pb-2 mt-8 mb-4 font-black tracking-widest transition-colors duration-300 ${isDarkMode ? 'text-blue-500/80 border-white/10' : 'text-blue-700 border-slate-300'}`}>
                 ACTIVE_CHANNELS (PWM)
               </div>
               <div className={terminalText}>CH1 (Pitch): <span className={terminalVal}>{controls.pitch}</span></div>
               <div className={terminalText}>CH2 (Roll) : <span className={terminalVal}>{controls.roll}</span></div>
               <div className={terminalText}>CH3 (Vert) : <span className={terminalVal}>{controls.vertical}</span></div>
               <div className={terminalText}>CH4 (Yaw)  : <span className={terminalVal}>{controls.yaw}</span></div>
               <div className={terminalText}>CH5 (Fwd)  : <span className={terminalVal}>{controls.forward}</span></div>
               <div className={terminalText}>CH6 (Lat)  : <span className={terminalVal}>{controls.lateral}</span></div>
             </div>

             {isArmed && (
               <div className="text-red-500 animate-pulse flex items-center gap-2 font-black mt-8 tracking-wider">
                 <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span>
                 MOTORS_ARMED & TRANSMITTING...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;