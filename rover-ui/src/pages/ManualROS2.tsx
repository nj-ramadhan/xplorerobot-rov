import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as ROSLIB from 'roslib';
import { AutoSliderPanel } from '../components/manual-control/AutoSliderPanel';
import { KeyboardPanel } from '../components/manual-control/KeyboardPanel';
import { ThrusterMatrixPanel } from '../components/manual-control/ThrusterMatrixPanel';
import { PreFlightChecklist } from '../components/manual-control/PreFlightChecklist';

export const ManualROS2: React.FC = () => {
  // --- 1. STATE UNTUK MODAL CHECKLIST ---
  // Menggunakan sessionStorage agar checklist hanya muncul 1x per sesi browser
  const [showChecklist, setShowChecklist] = useState(() => {
    return sessionStorage.getItem('ros2_manual_ready') !== 'true';
  });

  const [connStatus, setConnStatus] = useState("Menunggu Koneksi... ⏳");
  const [controlMode, setControlMode] = useState<'slider' | 'keyboard'>('slider');
  const [thrusters, setThrusters] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  
  const ros = useRef<ROSLIB.Ros | null>(null);
  const thrustersRef = useRef<number[]>([0, 0, 0, 0, 0, 0]);

  // Update Reference setiap state berubah (untuk loop setInterval)
  useEffect(() => { 
    thrustersRef.current = thrusters; 
  }, [thrusters]);

  // --- 2. KONEKSI ROS 2 & CONTROL LOOP ---
  useEffect(() => {
    ros.current = new ROSLIB.Ros({ url: 'ws://localhost:9090' });
    
    ros.current.on('connection', () => setConnStatus("Terhubung ke ROS2 Gazebo 🟢"));
    ros.current.on('error', () => setConnStatus("Error Koneksi 🔴"));
    ros.current.on('close', () => setConnStatus("Terputus 🔴"));
    
    // Interval pengiriman data thruster (10Hz)
    const interval = setInterval(() => {
      if (ros.current?.isConnected) {
        thrustersRef.current.forEach((val, i) => {
          const topic = new ROSLIB.Topic({ 
            ros: ros.current!, 
            name: `/bluerov2/cmd_thruster${i + 1}`, 
            messageType: 'std_msgs/msg/Float64' 
          });
          topic.publish({ data: val } as any);
        });
      }
    }, 100);

    return () => { 
      clearInterval(interval); 
      ros.current?.close(); 
    };
  }, []);

  // --- 3. HANDLERS ---
  const handleFinishChecklist = () => {
    sessionStorage.setItem('ros2_manual_ready', 'true');
    setShowChecklist(false);
  };

  const handleSliderChange = (idx: number, val: number) => {
    const newT = [...thrusters]; 
    newT[idx] = val; 
    setThrusters(newT);
  };

  const handleKeyboardUpdate = useCallback((newT: number[]) => { 
    setThrusters(newT); 
  }, []);

  const resetAll = () => {
    const neutral = [0, 0, 0, 0, 0, 0];
    setThrusters(neutral);
    thrustersRef.current = neutral;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-8 text-white relative">
      
      {/* 🛡️ MODAL PRE-FLIGHT CHECKLIST */}
      {showChecklist && <PreFlightChecklist onFinish={handleFinishChecklist} />}

      {/* HEADER UTAMA */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-black text-xl text-blue-400 uppercase tracking-wider flex items-center gap-3">
            <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-lg">⚙️</span>
            Manual Override Control
          </h2>
          <p className="text-sm font-mono mt-2 tracking-widest">{connStatus}</p>
        </div>
        <button 
          onClick={resetAll} 
          className="bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 px-6 py-2 rounded font-bold transition-all uppercase text-xs tracking-tighter"
        >
          🛑 EMERGENCY STOP ALL
        </button>
      </div>

      {/* TAB NAVIGASI MODE */}
      <div className="flex gap-2 p-1 bg-black/40 w-fit rounded border border-white/5">
        <button 
          onClick={() => { setControlMode('slider'); resetAll(); }} 
          className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest rounded transition-all ${
            controlMode === 'slider' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          🎚️ Auto-Slider
        </button>
        <button 
          onClick={() => { setControlMode('keyboard'); resetAll(); }} 
          className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest rounded transition-all ${
            controlMode === 'keyboard' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          ⌨️ Keyboard
        </button>
      </div>

      {/* CONTENT AREA: 2 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: INPUT MODE */}
        <div className="lg:col-span-6">
          {controlMode === 'slider' ? (
            <AutoSliderPanel currentThrusters={thrusters} onApply={setThrusters} />
          ) : (
            <KeyboardPanel isActive={controlMode === 'keyboard'} onUpdate={handleKeyboardUpdate} />
          )}
        </div>

        {/* PANEL KANAN: STATUS MATRIX (SLIDERS) */}
        <div className="lg:col-span-6">
          <ThrusterMatrixPanel 
            thrusters={thrusters} 
            isLocked={controlMode === 'keyboard'} 
            onChange={handleSliderChange} 
          />
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
          Polman Bandung - TRIN PBL Project [ROV_AOV_SYSTEM]
        </p>
      </div>

    </div>
  );
};

export default ManualROS2;