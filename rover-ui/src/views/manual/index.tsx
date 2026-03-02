import React, { useState, useEffect } from 'react';

export const Manual: React.FC = () => {
  // 1. State Kendali 6-DOF
  const [controls, setControls] = useState({
    surge: 0, sway: 0, heave: 0, roll: 0, pitch: 0, yaw: 0
  });

  // 2. State Fitur Pendukung
  const [isLive, setIsLive] = useState(false);
  const [missionTime, setMissionTime] = useState(0);
  const [lights, setLights] = useState(false);
  const [gripper, setGripper] = useState(0); // 0: Closed, 100: Open
  const [isRecording, setIsRecording] = useState(false);

  // 3. Efek Timer Misi (Hanya jalan kalau Live)
  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => setMissionTime(t => t + 1), 1000);
    } else {
      setMissionTime(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Format Waktu ke MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handler Input (Slider & Textbox)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || value === "-") {
      setControls(prev => ({ ...prev, [name]: value as any }));
      return;
    }
    const numericValue = parseInt(value);
    if (!isNaN(numericValue)) {
      const constrainedValue = Math.max(-100, Math.min(100, numericValue));
      setControls(prev => ({ ...prev, [name]: constrainedValue }));
    }
  };

  const resetControls = () => {
    setControls({ surge: 0, sway: 0, heave: 0, roll: 0, pitch: 0, yaw: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* HEADER & TOP STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-3">
            <span className="bg-blue-600 p-2 rounded-lg">🕹️</span>
            Manual Manual (6-DOF)
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-2 uppercase tracking-widest">
            SITL Environment · ROS 2 Jazzy Jalisco
          </p>
        </div>

        <div className="flex gap-4 font-mono text-[10px]">
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/5">
            <span className="text-slate-500 block">MISSION_CLOCK</span>
            <span className="text-white text-sm font-bold">{formatTime(missionTime)}</span>
          </div>
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/5">
            <span className="text-slate-500 block">EST_DEPTH</span>
            <span className="text-blue-400 text-sm font-bold">{(12.5 + (controls.heave * -0.05)).toFixed(1)} m</span>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-6 py-2 rounded font-bold transition-all border ${
              isLive ? 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-slate-800 text-slate-500 border-white/5'
            }`}
          >
            {isLive ? '● DISENGAGE SITL' : '○ INITIALIZE SITL'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: 6-DOF CONTROL MATRIX */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#111827] p-8 rounded-xl border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manual Setpoints (Direct Drive)</h3>
              <button onClick={resetControls} className="text-[9px] text-red-500 font-black hover:underline uppercase">Emergency Cutoff</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Linear Section */}
              <div className="space-y-8">
                <p className="text-[9px] font-bold text-blue-500 uppercase border-b border-white/5 pb-2">Linear Axis</p>
                {['surge', 'sway', 'heave'].map((axis) => (
                  <div key={axis} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">{axis}</label>
                      <input 
                        type="number" name={axis} value={controls[axis as keyof typeof controls]} onChange={handleInputChange}
                        className="w-16 bg-black/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-center text-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <input type="range" name={axis} min="-100" max="100" value={controls[axis as keyof typeof controls]} onChange={handleInputChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                ))}
              </div>

              {/* Rotational Section */}
              <div className="space-y-8">
                <p className="text-[9px] font-bold text-purple-500 uppercase border-b border-white/5 pb-2">Angular Axis</p>
                {['roll', 'pitch', 'yaw'].map((axis) => (
                  <div key={axis} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">{axis}</label>
                      <input 
                        type="number" name={axis} value={controls[axis as keyof typeof controls]} onChange={handleInputChange}
                        className="w-16 bg-black/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-center text-purple-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <input type="range" name={axis} min="-100" max="100" value={controls[axis as keyof typeof controls]} onChange={handleInputChange} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NEW: VEHICLE ACTIONS PANEL */}
          <div className="bg-[#111827] p-6 rounded-xl border border-white/5 flex flex-wrap gap-4">
            <button onClick={() => setLights(!lights)} className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase border transition-all ${lights ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
              💡 Lights {lights ? 'ON' : 'OFF'}
            </button>
            <div className="flex-[2] bg-slate-800/50 p-2 rounded-lg border border-white/5 flex items-center gap-4 px-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gripper</span>
              <input type="range" min="0" max="100" value={gripper} onChange={(e) => setGripper(parseInt(e.target.value))} className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none accent-white" />
              <span className="text-[10px] font-mono text-white">{gripper}%</span>
            </div>
            <button onClick={() => setIsRecording(!isRecording)} className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-slate-800 border-white/5 text-slate-500'}`}>
              ⏺ {isRecording ? 'Recording' : 'Record'}
            </button>
          </div>
        </div>

        {/* PANEL KANAN: MONITORING */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] p-5 rounded-xl border border-white/5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Thruster Monitor</h3>
            <div className="grid grid-cols-2 gap-3">
              {['T1', 'T2', 'T3', 'T4', 'T5', 'T6'].map((id) => (
                <div key={id} className="bg-black/40 p-3 rounded border border-white/5">
                  <span className="text-[8px] font-bold text-slate-600 block">{id} MOTOR</span>
                  <div className="text-lg font-light text-blue-400/80">0.0</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black/60 p-5 rounded-xl border border-white/5 h-64 font-mono text-[9px] flex flex-col justify-between">
             <div className="space-y-1">
               <div className="text-blue-500/70 border-b border-white/10 pb-1 mb-2">SYSTEM_HEALTH</div>
               <div className="flex justify-between text-slate-500"><span>CPU_TEMP:</span> <span className="text-white">42.5°C</span></div>
               <div className="flex justify-between text-slate-500"><span>LATENCY:</span> <span className="text-green-500">12ms</span></div>
               <div className="text-blue-500/70 border-b border-white/10 pb-1 mt-4 mb-2">CMD_VEL_OUT</div>
               <div className="text-slate-400">lin: [{Number(controls.surge/100).toFixed(2)}, {Number(controls.sway/100).toFixed(2)}, {Number(controls.heave/100).toFixed(2)}]</div>
               <div className="text-slate-400">ang: [{Number(controls.roll/100).toFixed(2)}, {Number(controls.pitch/100).toFixed(2)}, {Number(controls.yaw/100).toFixed(2)}]</div>
             </div>
             {isLive && Object.values(controls).some(v => Number(v) !== 0) && (
               <div className="text-green-500 animate-pulse flex items-center gap-2 font-bold mt-4">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                 STREAMING_TOPICS...
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manual;