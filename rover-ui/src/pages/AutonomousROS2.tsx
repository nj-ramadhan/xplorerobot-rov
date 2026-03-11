import React, { useState, useEffect, useRef } from 'react';
import { MapPanel } from '../components/autonomous-control/MapPanel';

const AutonomousROS2: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [goals, setGoals] = useState<Array<{ id: number; rosX: number; rosY: number }>>([]);
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const activeGoalIdRef = useRef(activeGoalId);
  const goalsRef = useRef(goals);

  // Sync refs agar terbaca di dalam setInterval
  useEffect(() => { activeGoalIdRef.current = activeGoalId; }, [activeGoalId]);
  useEffect(() => { goalsRef.current = goals; }, [goals]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:9090');
    
    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ op: 'advertise', topic: '/xr_rov/cmd_pose', type: 'geometry_msgs/msg/PoseStamped' }));
    };

    socket.onclose = () => setIsConnected(false);
    ws.current = socket;

    // Loop Pengiriman Data (10Hz)
    const timer = setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN || activeGoalIdRef.current === null) return;

      const target = goalsRef.current.find(g => g.id === activeGoalIdRef.current);
      if (!target) return;

      // Kirim koordinat target ke ROS
      ws.current.send(JSON.stringify({
        op: 'publish',
        topic: '/xr_rov/cmd_pose',
        msg: {
          header: { frame_id: 'odom' },
          pose: {
            position: { x: target.rosX, y: target.rosY, z: -2.0 },
            orientation: { x: 0, y: 0, z: 0, w: 1 } // Orientasi lurus default
          }
        }
      }));
    }, 100);

    return () => {
      socket.close();
      clearInterval(timer);
    };
  }, []);

  const addGoal = (rosX: number, rosY: number) => {
    setGoals(prev => [...prev, { id: Date.now(), rosX, rosY }]);
  };

  return (
    <div className="flex flex-col gap-6 p-8 h-screen bg-[#030712] text-white">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-blue-500 uppercase">Mission Dispatcher</h1>
        <div className={`px-4 py-1 rounded-md text-[10px] font-bold ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isConnected ? '● SYSTEM CONNECTED' : '○ SYSTEM OFFLINE'}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* MAP PANEL */}
        <div className="col-span-8 bg-black/40 rounded-2xl border border-white/5 p-4">
          <MapPanel 
            goals={goals} 
            activeGoalId={activeGoalId}
            onMapClick={addGoal} 
          />
        </div>

        {/* LIST DISPATCHER */}
        <div className="col-span-4 flex flex-col bg-[#111827] rounded-2xl border border-white/5 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Waypoints</h3>
            <button onClick={() => {setGoals([]); setActiveGoalId(null);}} className="text-[10px] text-red-500 hover:text-red-400">Clear All</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {goals.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-20 italic text-xs text-center">
                <p>Belum ada target.</p>
                <p>Silakan klik pada peta...</p>
              </div>
            )}
            
            {goals.map((g, index) => (
              <div key={g.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${activeGoalId === g.id ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/5'}`}>
                <div>
                  <p className="text-[10px] font-black text-blue-400">TARGET #{index + 1}</p>
                  <p className="text-[9px] font-mono text-slate-500">X: {g.rosX.toFixed(2)} | Y: {g.rosY.toFixed(2)}</p>
                </div>
                
                <div className="flex gap-2">
                  {activeGoalId === g.id ? (
                    <button onClick={() => setActiveGoalId(null)} className="px-4 py-2 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600">STOP</button>
                  ) : (
                    <button onClick={() => setActiveGoalId(g.id)} className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg hover:bg-blue-500">START</button>
                  )}
                  <button onClick={() => setGoals(goals.filter(item => item.id !== g.id))} className="text-slate-600 hover:text-white text-lg">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousROS2;