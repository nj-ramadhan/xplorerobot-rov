import React, { useState, useRef, useEffect } from 'react';
import { MapPanel } from '../components/autonomous-control/MapPanel';
import { DepthControl } from '../components/autonomous-control/DepthControl';
import { MissionPanel } from '../components/autonomous-control/MissionPanel';

export const AutonomousROS2: React.FC = () => {
  const [goals, setGoals] = useState<Array<{ id: number; uiX: number; uiY: number; rosX: number; rosY: number }>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMissionRunning, setIsMissionRunning] = useState(false);
  const [targetDepth, setTargetDepth] = useState(-2.0);

  const wsRef = useRef<WebSocket | null>(null);
  const publishIntervalRef = useRef<number | null>(null);

  // Menyimpan data terbaru ke Ref agar bisa dibaca di dalam setInterval
  const goalsRef = useRef(goals);
  const depthRef = useRef(targetDepth);

  useEffect(() => { goalsRef.current = goals; }, [goals]);
  useEffect(() => { depthRef.current = targetDepth; }, [targetDepth]);

  // --- 1. INISIALISASI KONEKSI WEBSOCKET MURNI ---
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9090');

    ws.onopen = () => {
      console.log('✅ Pintu ROSbridge Terbuka (Native)!');
      setIsConnected(true);

      const advertiseMsg = {
        op: 'advertise',
        topic: '/xr_rov/cmd_pose',
        type: 'geometry_msgs/msg/PoseStamped'
      };
      ws.send(JSON.stringify(advertiseMsg));
      console.log('✅ Izin PoseStamped dikirim ke ROSbridge!');
    };

    ws.onerror = (error) => {
      console.error('❌ Error koneksi WebSocket:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 Koneksi terputus.');
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      if (publishIntervalRef.current) {
        window.clearInterval(publishIntervalRef.current);
      }
    };
  }, []);

  // --- 2. LOGIKA KENDALI MISI ---
  const startMission = () => {
    if (goalsRef.current.length === 0) {
      alert("Tambahkan waypoint di peta terlebih dahulu!");
      return;
    }
    if (!isConnected || !wsRef.current) {
      alert("ROS belum terkoneksi! Pastikan rosbridge berjalan.");
      return;
    }

    setIsMissionRunning(true);
    console.log("🚀 Misi Dimulai: Menembak data langsung ke socket...");

    publishIntervalRef.current = window.setInterval(() => {
      if (goalsRef.current.length === 0) return;
      
      const currentGoal = goalsRef.current[0]; 

      const payload = {
        op: 'publish',
        topic: '/xr_rov/cmd_pose',
        msg: {
          header: { stamp: { sec: 0, nanosec: 0 }, frame_id: "map" },
          pose: {
            position: {
              x: currentGoal.rosX,
              y: currentGoal.rosY,
              z: depthRef.current 
            },
            orientation: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 }
          }
        }
      };

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      }
    }, 100); 
  };

  const stopMission = () => {
    setIsMissionRunning(false);
    if (publishIntervalRef.current) {
      window.clearInterval(publishIntervalRef.current);
    }
    console.log("⏹️ Misi Dihentikan.");
  };

  // --- 3. HANDLER UNTUK MAP ---
  const handleAddGoal = (goal: any) => {
    setGoals([...goals, goal]);
  };

  const handleRemoveGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-8 text-white relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="font-black text-xl text-purple-400 uppercase tracking-wider flex items-center gap-3">
            <span className="bg-purple-600/20 p-2 rounded-lg text-lg text-purple-400">📍</span>
            Autonomous Navigation
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              ROS 2 Bridge: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </p>
          </div>
        </div>
      </div>

      {/* GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAP PANEL */}
        <div className="lg:col-span-8">
          <MapPanel 
            goals={goals} 
            onAddGoal={handleAddGoal} 
            onClearGoals={() => setGoals([])} 
          />
        </div>

        {/* DEPTH & MISSION PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-[#111827] p-6 rounded-xl border border-white/5 shadow-lg flex flex-col h-full min-h-[400px]">
            <DepthControl 
              targetDepth={targetDepth} 
              setTargetDepth={setTargetDepth} 
            />
            <MissionPanel 
              goals={goals} 
              removeGoal={handleRemoveGoal} 
              isMissionRunning={isMissionRunning} 
              startMission={startMission} 
              stopMission={stopMission} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AutonomousROS2;