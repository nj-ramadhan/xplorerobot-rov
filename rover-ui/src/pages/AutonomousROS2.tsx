import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPanel } from '../components/autonomous-control/MapPanel';
import { DepthControl } from '../components/autonomous-control/DepthControl';

interface Goal {
  id: number;
  rosX: number;
  rosY: number;
}

// Status tiap waypoint di mode sequential
type WaypointStatus = 'pending' | 'active' | 'done';

interface RovPos {
  rosX: number;
  rosY: number;
  z: number;
  yaw: number;
}

const ARRIVAL_THRESHOLD = 0.5; // meter
const LOOP_HZ           = 100; // ms per tick (10 Hz)
const KP_XY             = 0.8;
const KP_Z              = 0.5;
const MAX_VEL           = 1.0;

const AutonomousROS2: React.FC = () => {
  const [isConnected, setIsConnected]   = useState(false);
  const [goals, setGoals]               = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);
  const [targetDepth, setTargetDepth]   = useState(-2.0);
  const [rovPos, setRovPos]             = useState<RovPos>({ rosX: 0, rosY: 0, z: 0, yaw: 0 });
  const [rovPath, setRovPath]           = useState<Array<{ rosX: number; rosY: number }>>([]);
  const [debugLog, setDebugLog]         = useState<string[]>([]);

  // Sequential mission state
  const [isMissionRunning, setIsMissionRunning] = useState(false);
  const [wpStatus, setWpStatus] = useState<Record<number, WaypointStatus>>({});

  // Refs
  const ws            = useRef<WebSocket | null>(null);
  const goalsRef      = useRef<Goal[]>([]);
  const activeGoalRef = useRef<number | null>(null);
  const rovPosRef     = useRef<RovPos>({ rosX: 0, rosY: 0, z: 0, yaw: 0 });
  const depthRef      = useRef(-2.0);
  const seqIndexRef   = useRef<number>(-1);
  const isMissionRef  = useRef(false);

  useEffect(() => { goalsRef.current      = goals;            }, [goals]);
  useEffect(() => { activeGoalRef.current = activeGoalId;     }, [activeGoalId]);
  useEffect(() => { rovPosRef.current     = rovPos;           }, [rovPos]);
  useEffect(() => { depthRef.current      = targetDepth;      }, [targetDepth]);
  useEffect(() => { isMissionRef.current  = isMissionRunning; }, [isMissionRunning]);

  const log = useCallback((msg: string) => {
    setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 29)]);
  }, []);

  // Kirim TwistStamped
  const sendVel = useCallback((vx: number, vy: number, vz: number) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const now     = Date.now();
    const sec     = Math.floor(now / 1000);
    const nanosec = (now % 1000) * 1_000_000;
    ws.current.send(JSON.stringify({
      op: 'publish',
      topic: '/xr_rov/cmd_vel',
      msg: {
        header: { stamp: { sec, nanosec }, frame_id: 'base_link' },
        twist: {
          linear:  { x: vx, y: vy, z: vz },
          angular: { x: 0,  y: 0,  z: 0  },
        },
      },
    }));
  }, []);

  // Pindah ke waypoint berikutnya dalam antrian
  const advanceSequential = useCallback(() => {
    const currentGoals = goalsRef.current;
    const nextIdx = seqIndexRef.current + 1;

    if (nextIdx >= currentGoals.length) {
      sendVel(0, 0, 0);
      activeGoalRef.current = null;
      isMissionRef.current  = false;
      seqIndexRef.current   = -1;
      setActiveGoalId(null);
      setIsMissionRunning(false);
      log('🏁 Seluruh misi selesai!');
      return;
    }

    const nextGoal = currentGoals[nextIdx];
    seqIndexRef.current   = nextIdx;
    activeGoalRef.current = nextGoal.id;
    setActiveGoalId(nextGoal.id);
    setWpStatus(prev => ({ ...prev, [nextGoal.id]: 'active' }));
    log(`➡️ Waypoint ${nextIdx + 1} / ${currentGoals.length}`);
  }, [sendVel, log]);

  // Setup WebSocket + control loop
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:9090');

    socket.onopen = () => {
      setIsConnected(true);
      log('rosbridge terhubung');
      socket.send(JSON.stringify({ op: 'advertise', topic: '/xr_rov/cmd_vel', type: 'geometry_msgs/msg/TwistStamped' }));
      socket.send(JSON.stringify({ op: 'subscribe', topic: '/xr_rov/odom',    type: 'nav_msgs/msg/Odometry' }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.topic === '/xr_rov/odom') {
          const p = data.msg.pose.pose.position;
          const q = data.msg.pose.pose.orientation;
          const yawRad = Math.atan2(2*(q.w*q.z+q.x*q.y), 1-2*(q.y*q.y+q.z*q.z));
          const newPos: RovPos = { rosX: p.x, rosY: p.y, z: p.z, yaw: yawRad*(180/Math.PI) };
          rovPosRef.current = newPos;
          setRovPos(newPos);
          setRovPath(prev => [...prev.slice(-150), { rosX: p.x, rosY: p.y }]);
        }
      } catch (e) { console.error(e); }
    };

    socket.onerror = () => log('WebSocket error');
    socket.onclose = () => { setIsConnected(false); log('rosbridge putus'); };
    ws.current = socket;

    // Control loop 10 Hz
    const timer = setInterval(() => {
      const goalId = activeGoalRef.current;
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN || goalId === null) return;

      const target = goalsRef.current.find(g => g.id === goalId);
      if (!target) return;

      const cur    = rovPosRef.current;
      const dx     = target.rosX - cur.rosX;
      const dy     = target.rosY - cur.rosY;
      const dz     = depthRef.current - cur.z;
      const distXY = Math.hypot(dx, dy);

      if (distXY < ARRIVAL_THRESHOLD && Math.abs(dz) < ARRIVAL_THRESHOLD) {
        sendVel(0, 0, 0);
        if (isMissionRef.current) {
          // Sequential: tandai done, tunggu 500ms lalu lanjut
          setWpStatus(prev => ({ ...prev, [goalId]: 'done' }));
          activeGoalRef.current = null;
          setActiveGoalId(null);
          setTimeout(() => advanceSequential(), 500);
        } else {
          activeGoalRef.current = null;
          setActiveGoalId(null);
          log(`✅ Sampai! (dist=${distXY.toFixed(2)}m)`);
        }
        return;
      }

      const yawRad = cur.yaw * (Math.PI / 180);
      const localX =  dx * Math.cos(yawRad) + dy * Math.sin(yawRad);
      const localY = -dx * Math.sin(yawRad) + dy * Math.cos(yawRad);
      const clamp  = (v: number) => Math.max(Math.min(v, MAX_VEL), -MAX_VEL);
      sendVel(clamp(localX*KP_XY), clamp(localY*KP_XY), clamp(dz*KP_Z));
    }, LOOP_HZ);

    return () => { clearInterval(timer); socket.close(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Controls ──────────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    sendVel(0, 0, 0);
    activeGoalRef.current = null;
    isMissionRef.current  = false;
    seqIndexRef.current   = -1;
    setActiveGoalId(null);
    setIsMissionRunning(false);
    setWpStatus(prev => {
      const r: Record<number, WaypointStatus> = {};
      Object.keys(prev).forEach(k => { r[Number(k)] = 'pending'; });
      return r;
    });
    log('🛑 Emergency stop!');
  }, [sendVel, log]);

  const startSingle = (goalId: number) => {
    if (isMissionRunning) return;
    setActiveGoalId(goalId);
    activeGoalRef.current = goalId;
    log(`🚀 Menuju waypoint (single)`);
  };

  const startSequentialMission = () => {
    if (goals.length === 0) { log('⚠️ Tidak ada waypoint!'); return; }
    const initStatus: Record<number, WaypointStatus> = {};
    goals.forEach(g => { initStatus[g.id] = 'pending'; });
    setWpStatus(initStatus);
    setRovPath([]);
    seqIndexRef.current  = -1;
    isMissionRef.current = true;
    setIsMissionRunning(true);
    log(`🗺️ Sequential mission — ${goals.length} waypoint`);
    setTimeout(() => advanceSequential(), 0);
  };

  const addGoal = (rosX: number, rosY: number) => {
    if (isMissionRunning) return;
    const id = Date.now();
    setGoals(prev => [...prev, { id, rosX, rosY }]);
    setWpStatus(prev => ({ ...prev, [id]: 'pending' }));
    log(`📍 Waypoint: X=${rosX.toFixed(2)} Y=${rosY.toFixed(2)}`);
  };

  const removeGoal = (id: number) => {
    if (isMissionRunning) return;
    if (activeGoalId === id) stopAll();
    setGoals(prev => prev.filter(g => g.id !== id));
    setWpStatus(prev => { const s = { ...prev }; delete s[id]; return s; });
  };

  const clearAll = () => {
    stopAll();
    setGoals([]);
    setWpStatus({});
    setRovPath([]);
  };

  // Helpers styling
  const cardStyle = (id: number) => {
    const s = wpStatus[id];
    if (s === 'active') return 'bg-blue-600/20 border-blue-500/50';
    if (s === 'done')   return 'bg-green-600/10 border-green-500/30';
    return 'bg-white/5 border-white/5';
  };

  const completedCount = Object.values(wpStatus).filter(s => s === 'done').length;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#0b111a] text-white">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-blue-500 uppercase tracking-tighter">
            Autonomous Mission Control
          </h1>
          {isMissionRunning && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"/>
              <span className="text-[10px] font-bold text-blue-400 uppercase">
                Misi Berjalan — {completedCount}/{goals.length}
              </span>
            </div>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}/>
          {isConnected ? 'BRIDGE ONLINE' : 'BRIDGE OFFLINE'}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-6 flex-1">

        {/* Map */}
        <div className="col-span-8 bg-black/20 rounded-xl border border-white/5 overflow-hidden relative min-h-[500px]">
          <MapPanel goals={goals} rovPos={rovPos} rovPath={rovPath} activeGoalId={activeGoalId} onMapClick={addGoal} />
          {isMissionRunning && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[9px] text-slate-400 border border-white/5">
              Klik peta dinonaktifkan saat misi berjalan
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="col-span-4 flex flex-col gap-4">
          <DepthControl targetDepth={targetDepth} setTargetDepth={setTargetDepth} />

          {/* Telemetry */}
          <div className="bg-slate-900/50 rounded-xl border border-white/5 p-3">
            <p className="text-[9px] font-bold uppercase text-slate-500 mb-2">ROV Telemetry</p>
            <div className="grid grid-cols-4 gap-1 font-mono text-[9px]">
              {[
                { label: 'X',   val: rovPos.rosX.toFixed(2)     },
                { label: 'Y',   val: rovPos.rosY.toFixed(2)     },
                { label: 'Z',   val: rovPos.z.toFixed(2)        },
                { label: 'Yaw', val: `${rovPos.yaw.toFixed(0)}°` },
              ].map(({ label, val }) => (
                <div key={label} className="flex flex-col items-center bg-white/5 rounded p-1">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-blue-300">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {isMissionRunning && goals.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl border border-blue-500/20 p-3">
              <div className="flex justify-between text-[9px] mb-1.5">
                <span className="font-bold uppercase text-blue-400">Progress Misi</span>
                <span className="text-slate-400">{completedCount} / {goals.length} waypoint</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / goals.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Waypoint list */}
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col gap-3 min-h-0">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-bold uppercase text-slate-400">
                Waypoints ({goals.length})
              </h3>
              <button
                onClick={clearAll}
                disabled={isMissionRunning}
                className="text-[10px] text-red-400 hover:text-red-300 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {goals.length === 0 && (
                <div className="text-center py-8 text-slate-600 text-xs italic">
                  Klik di peta untuk menambah waypoint...
                </div>
              )}
              {goals.map((g, index) => (
                <div
                  key={g.id}
                  className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${cardStyle(g.id)}`}
                >
                  <div className="flex items-center gap-2">
                    {/* Badge nomor / status */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border flex-shrink-0 transition-all ${
                      wpStatus[g.id] === 'done'   ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                      wpStatus[g.id] === 'active' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse' :
                      'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                      {wpStatus[g.id] === 'done' ? '✓' : index + 1}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-300">WP {index + 1}</span>
                        {wpStatus[g.id] === 'active' && <span className="text-[9px] text-blue-400 animate-pulse font-bold">● AKTIF</span>}
                        {wpStatus[g.id] === 'done'   && <span className="text-[9px] text-green-400 font-bold">✓ SELESAI</span>}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">
                        X:{g.rosX.toFixed(2)} Y:{g.rosY.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {!isMissionRunning && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {activeGoalId === g.id ? (
                        <button onClick={stopAll} className="px-2 py-1 bg-red-500 hover:bg-red-400 text-white text-[9px] font-bold rounded animate-pulse">
                          STOP
                        </button>
                      ) : (
                        <button onClick={() => startSingle(g.id)} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[9px] font-bold rounded">
                          GO
                        </button>
                      )}
                      <button onClick={() => removeGoal(g.id)} className="text-slate-600 hover:text-red-400 text-xs">✕</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tombol utama */}
            <div className="border-t border-white/5 pt-3 space-y-2">
              {!isMissionRunning ? (
                <button
                  onClick={startSequentialMission}
                  disabled={goals.length === 0 || !isConnected}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20"
                >
                  ▶ Start Sequential Mission
                </button>
              ) : (
                <>
                  <button
                    onClick={stopAll}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-red-600/20"
                  >
                    ⏹ Emergency Stop
                  </button>
                  <p className="text-center text-[9px] text-slate-600">
                    ROV otomatis lanjut ke waypoint berikutnya
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Mission log */}
          <div className="bg-black/40 rounded-xl border border-white/5 p-3 h-40 overflow-y-auto">
            <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Mission Log</p>
            {debugLog.length === 0 && (
              <p className="text-[9px] text-slate-700 italic">Menunggu aktivitas...</p>
            )}
            {debugLog.map((entry, i) => (
              <p key={i} className="text-[9px] font-mono text-slate-400 leading-relaxed">{entry}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousROS2;