import React, { useState, useEffect } from 'react';
import { TelemetryData } from '../../types/telemetry';

interface ManualProps {
  telemetry: TelemetryData;
  isArmed: boolean;
  toggleArm: () => void;
  sendRC: (channels: Record<number, number>) => void;
}

export const Manual: React.FC<ManualProps> = ({ telemetry, isArmed, toggleArm, sendRC }) => {
  // --- 1. STATE UNTUK TUTORIAL / PRE-FLIGHT CHECKLIST ---
  const [showTutorial, setShowTutorial] = useState(true);
  const [checks, setChecks] = useState([false, false, false]);
  
  // Mengecek apakah SEMUA checklist sudah bernilai 'true'
  const isAllChecked = checks.every(Boolean);

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  // --- 2. STATE KENDALI & FITUR PENDUKUNG ---
  const [controls, setControls] = useState({
    forward: 1500, lateral: 1500, vertical: 1500, roll: 1500, pitch: 1500, yaw: 1500
  });
  const [missionTime, setMissionTime] = useState(0);
  const [lights, setLights] = useState(false);
  const [gripper, setGripper] = useState(0); 

  // --- 3. MISSION TIMER ---
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

  // --- 4. HANDLER KONTROL ---
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

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative">
      
      {/* =========================================================
          MODAL PRE-FLIGHT CHECKLIST (EFEK AWAN / GLASSMORPHISM)
          ========================================================= */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/70 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] mx-4">
            
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-xl">📋</span>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">Pre-Flight Checklist</h2>
            </div>
            <p className="text-slate-400 text-sm mb-8 border-b border-[#30363d] pb-4">
              Selesaikan langkah inisialisasi ArduSub SITL berikut sebelum mengambil alih kendali Manual Override.
            </p>

            <div className="space-y-4 mb-8">
              
              {/* CHECKLIST 1 */}
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[0] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                <input type="checkbox" checked={checks[0]} onChange={() => handleCheck(0)} className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 bg-gray-700 cursor-pointer" />
                <div>
                  <h3 className={`font-bold ${checks[0] ? 'text-blue-400' : 'text-slate-200'}`}>1. Aktifkan Environment & Simulator Ubuntu</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-2">Buka terminal WSL/Ubuntu kamu, lalu jalankan perintah ini secara berurutan:</p>
                  <div className="bg-black/60 p-3 rounded text-[11px] font-mono text-green-400 border border-white/5 leading-relaxed">
                    cd ardupilot<br/>
                    . ~/.profile<br/>
                    cd ArduSub<br/>
                    sim_vehicle.py -v ArduSub -L RATBeach --out=udp:127.0.0.1:14550 --console
                  </div>
                </div>
              </label>

              {/* CHECKLIST 2 */}
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[1] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                <input type="checkbox" checked={checks[1]} onChange={() => handleCheck(1)} className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 bg-gray-700 cursor-pointer" />
                <div>
                  <h3 className={`font-bold ${checks[1] ? 'text-blue-400' : 'text-slate-200'}`}>2. Buka QGroundControl (Opsional tapi disarankan)</h3>
                  <p className="text-xs text-slate-500 mt-1">Buka aplikasi QGroundControl di Windows untuk memastikan 3D model ROV muncul dan terhubung ke UDP 14550.</p>
                </div>
              </label>

              {/* CHECKLIST 3 */}
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[2] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                <input type="checkbox" checked={checks[2]} onChange={() => handleCheck(2)} className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 bg-gray-700 cursor-pointer" />
                <div>
                  <h3 className={`font-bold ${checks[2] ? 'text-blue-400' : 'text-slate-200'}`}>3. Nyalakan Backend FastAPI</h3>
                  <p className="text-xs text-slate-500 mt-1">Pastikan terminal backend Python sudah menyala (<code>uvicorn main:app --reload</code>) dan status di pojok kanan atas layar menunjukkan <span className="text-green-500">Terhubung 🟢</span>.</p>
                </div>
              </label>

            </div>

            {/* TOMBOL OK / MULAI */}
            <button 
              onClick={() => setShowTutorial(false)}
              disabled={!isAllChecked}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                isAllChecked 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer translate-y-0' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isAllChecked ? '🚀 Masuk ke Flight Deck' : 'Selesaikan Checklist Untuk Memulai'}
            </button>

          </div>
        </div>
      )}
      {/* ========================================================= */}


      {/* HEADER & TOP STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-3">
            <span className="bg-blue-600 p-2 rounded-lg">🕹️</span>
            Manual Override (6-DOF)
          </h2>
          <p className="text-[11px] font-mono mt-2 uppercase tracking-widest text-blue-400">
            {telemetry.status === 'CONNECTED' ? "Terhubung 🟢" : "Terputus 🔴"} · ArduSub SITL Backend
          </p>
        </div>

        <div className="flex gap-4 font-mono text-[10px]">
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/5">
            <span className="text-slate-500 block">MISSION_CLOCK</span>
            <span className="text-white text-sm font-bold">{formatTime(missionTime)}</span>
          </div>
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/5">
            <span className="text-slate-500 block">REAL_PITCH</span>
            <span className="text-purple-400 text-sm font-bold">{telemetry.pitch}°</span>
          </div>
          
          <button 
            onClick={toggleArm}
            className={`px-6 py-2 rounded font-bold transition-all border ${
              isArmed ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-slate-800 text-slate-500 border-white/5'
            }`}
          >
            {isArmed ? '🛑 DISARM MOTORS' : '⚙️ ARM VEHICLE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: 6-DOF CONTROL MATRIX */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#111827] p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Setpoints (PWM)</h3>
              <button onClick={resetControls} className="text-[10px] bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded font-black hover:bg-yellow-500/40 uppercase transition-all">
                EMERGENCY NEUTRAL (ALL)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* Linear Section */}
              <div className="space-y-8">
                <p className="text-[9px] font-bold text-blue-500 uppercase border-b border-white/5 pb-2">Linear Axis (Ch 5, 6, 3)</p>
                {['forward', 'lateral', 'vertical'].map((axis) => (
                  <div key={axis} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">{axis}</label>
                        <button 
                          onClick={() => resetSingleAxis(axis as keyof typeof controls)}
                          className="bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded px-1.5 py-0.5 text-[10px] transition-colors"
                          title="Reset ke Netral (1500)"
                        >
                          ↺
                        </button>
                      </div>
                      <input 
                        type="number" name={axis} value={controls[axis as keyof typeof controls]} onChange={handleInputChange}
                        className="w-16 bg-black/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-center text-blue-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <input 
                      type="range" name={axis} min="1100" max="1900" 
                      value={controls[axis as keyof typeof controls]} 
                      onChange={handleInputChange} 
                      onDoubleClick={() => resetSingleAxis(axis as keyof typeof controls)}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                    />
                  </div>
                ))}
              </div>

              {/* Rotational Section */}
              <div className="space-y-8">
                <p className="text-[9px] font-bold text-purple-500 uppercase border-b border-white/5 pb-2">Angular Axis (Ch 2, 1, 4)</p>
                {['roll', 'pitch', 'yaw'].map((axis) => (
                  <div key={axis} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-mono text-slate-400 uppercase">{axis}</label>
                        <button 
                          onClick={() => resetSingleAxis(axis as keyof typeof controls)}
                          className="bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white rounded px-1.5 py-0.5 text-[10px] transition-colors"
                        >
                          ↺
                        </button>
                      </div>
                      <input 
                        type="number" name={axis} value={controls[axis as keyof typeof controls]} onChange={handleInputChange}
                        className="w-16 bg-black/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-center text-purple-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <input 
                      type="range" name={axis} min="1100" max="1900" 
                      value={controls[axis as keyof typeof controls]} 
                      onChange={handleInputChange} 
                      onDoubleClick={() => resetSingleAxis(axis as keyof typeof controls)}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* VEHICLE ACTIONS PANEL */}
          <div className="bg-[#111827] p-6 rounded-xl border border-white/5 flex flex-wrap gap-4">
            <button onClick={() => setLights(!lights)} className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase border transition-all ${lights ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
              💡 Lights {lights ? 'ON' : 'OFF'}
            </button>
            <div className="flex-[2] bg-slate-800/50 p-2 rounded-lg border border-white/5 flex items-center gap-4 px-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Gripper</span>
                <button onClick={() => setGripper(0)} className="bg-slate-800 hover:bg-slate-700 text-slate-400 rounded px-1.5 py-0.5 text-[10px]">↺</button>
              </div>
              <input type="range" min="0" max="100" value={gripper} onChange={(e) => setGripper(parseInt(e.target.value))} className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none accent-white" />
              <span className="text-[10px] font-mono text-white">{gripper}%</span>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: MONITORING */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-black/60 p-5 rounded-xl border border-white/5 font-mono text-[10px] flex flex-col justify-between">
             <div className="space-y-2">
               <div className="text-blue-500/70 border-b border-white/10 pb-1 mb-3">TELEMETRY_DATA</div>
               <div className="flex justify-between text-slate-500"><span>ROLL:</span> <span className="text-white">{telemetry.roll}°</span></div>
               <div className="flex justify-between text-slate-500"><span>PITCH:</span> <span className="text-white">{telemetry.pitch}°</span></div>
               <div className="flex justify-between text-slate-500"><span>HEADING:</span> <span className="text-white">{telemetry.heading}°</span></div>
               <div className="text-blue-500/70 border-b border-white/10 pb-1 mt-6 mb-3">ACTIVE_CHANNELS (PWM)</div>
               <div className="text-slate-400">CH1 (Pitch): {controls.pitch}</div>
               <div className="text-slate-400">CH2 (Roll) : {controls.roll}</div>
               <div className="text-slate-400">CH3 (Vert) : {controls.vertical}</div>
               <div className="text-slate-400">CH4 (Yaw)  : {controls.yaw}</div>
               <div className="text-slate-400">CH5 (Fwd)  : {controls.forward}</div>
               <div className="text-slate-400">CH6 (Lat)  : {controls.lateral}</div>
             </div>

             {isArmed && (
               <div className="text-red-500 animate-pulse flex items-center gap-2 font-bold mt-6">
                 <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span>
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