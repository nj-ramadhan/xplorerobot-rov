import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPanel } from '../components/autonomous-control/MapPanel';
import { DepthControl } from '../components/autonomous-control/DepthControl';
import { OrientationModal, OrientationOption } from '../components/autonomous-control/OrientationModal';

// ── Interfaces ────────────────────────────────────────────────────────────────
interface Goal {
  id: number;
  rosX: number;
  rosY: number;
}

type WaypointStatus = 'pending' | 'active' | 'rotating' | 'waiting_orientation' | 'done';

// Phase kontrol ROV
// 'waiting'  → diam, tunggu user pilih orientasi
// 'rotate'   → sedang putar ke yaw target
// 'travel'   → sedang jalan ke waypoint
type ControlPhase = 'waiting' | 'rotate' | 'travel';

interface RovPos {
  rosX: number;
  rosY: number;
  z: number;
  yaw: number;
}

// ── Konstanta ─────────────────────────────────────────────────────────────────
const ARRIVAL_THRESHOLD = 0.5;
const YAW_THRESHOLD     = 5.0;   // derajat toleransi rotate selesai
const KP_XY             = 0.8;
const KP_Z              = 0.5;
const KP_YAW            = 0.03;
const MAX_VEL           = 1.0;
const MAX_YAW_VEL       = 0.8;
const LOOP_HZ           = 100;

function angleDiff(target: number, current: number): number {
  let d = target - current;
  while (d >  180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function yawToCompass(yaw: number): string {
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(((yaw % 360) + 360) / 45) % 8];
}

// ─────────────────────────────────────────────────────────────────────────────
const AutonomousROS2: React.FC = () => {

  // ── State ──────────────────────────────────────────────────────────────────
  const [isConnected, setIsConnected]           = useState(false);
  const [goals, setGoals]                       = useState<Goal[]>([]);
  const [activeGoalId, setActiveGoalId]         = useState<number | null>(null);
  const [targetDepth, setTargetDepth]           = useState(-2.0);
  const [rovPos, setRovPos]                     = useState<RovPos>({ rosX: 0, rosY: 0, z: 0, yaw: 0 });
  const [rovPath, setRovPath]                   = useState<Array<{ rosX: number; rosY: number }>>([]);
  const [debugLog, setDebugLog]                 = useState<string[]>([]);
  const [isMissionRunning, setIsMissionRunning] = useState(false);
  const [wpStatus, setWpStatus]                 = useState<Record<number, WaypointStatus>>({});

  // Modal state
  const [orientModal, setOrientModal] = useState<{
    visible: boolean;
    forGoalId: number | null;   // waypoint yang akan DITUJU setelah rotate
    waypointIndex: number;      // nomor urut (1-based) untuk ditampilkan
    rosX: number;
    rosY: number;
  }>({ visible: false, forGoalId: null, waypointIndex: 1, rosX: 0, rosY: 0 });

  // ── Refs ───────────────────────────────────────────────────────────────────
  const ws              = useRef<WebSocket | null>(null);
  const goalsRef        = useRef<Goal[]>([]);
  const rovPosRef       = useRef<RovPos>({ rosX: 0, rosY: 0, z: 0, yaw: 0 });
  const depthRef        = useRef(-2.0);
  const seqIndexRef     = useRef(-1);
  const isMissionRef    = useRef(false);

  // Refs untuk phase & target — dibaca langsung di timer tanpa stale closure
  const phaseRef        = useRef<ControlPhase>('travel');
  const travelGoalRef   = useRef<number | null>(null);  // id goal yang sedang dituju saat travel
  const targetYawRef    = useRef<number | null>(null);  // yaw target saat rotate

  useEffect(() => { goalsRef.current   = goals;            }, [goals]);
  useEffect(() => { rovPosRef.current  = rovPos;           }, [rovPos]);
  useEffect(() => { depthRef.current   = targetDepth;      }, [targetDepth]);
  useEffect(() => { isMissionRef.current = isMissionRunning; }, [isMissionRunning]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const log = useCallback((msg: string) => {
    setDebugLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 29)]);
  }, []);

  const sendVel = useCallback((vx: number, vy: number, vz: number, wz = 0) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const now = Date.now();
    ws.current.send(JSON.stringify({
      op: 'publish',
      topic: '/xr_rov/cmd_vel',
      msg: {
        header: {
          stamp: { sec: Math.floor(now / 1000), nanosec: (now % 1000) * 1_000_000 },
          frame_id: 'base_link',
        },
        twist: {
          linear:  { x: vx, y: vy, z: vz },
          angular: { x: 0,  y: 0,  z: wz },
        },
      },
    }));
  }, []);

  // ── Tampilkan modal orientasi sebelum menuju goalId ───────────────────────
  // FIX #2: dipanggil SEBELUM mulai travel, termasuk waypoint pertama
  const showOrientModalFor = useCallback((goalId: number, wpDisplayIndex: number, rosX: number, rosY: number) => {
    sendVel(0, 0, 0, 0);
    phaseRef.current      = 'waiting';
    travelGoalRef.current = null;
    targetYawRef.current  = null;

    setActiveGoalId(goalId);
    setWpStatus(prev => ({ ...prev, [goalId]: 'waiting_orientation' }));
    setOrientModal({ visible: true, forGoalId: goalId, waypointIndex: wpDisplayIndex, rosX, rosY });
    log(`⏸️ Pilih orientasi untuk WP ${wpDisplayIndex}...`);
  }, [sendVel, log]);

  // ── Mulai rotate ke yaw target, lalu setelah selesai travel ke goalId ─────
  // FIX #1: travelGoalRef tetap berisi goalId selama rotate,
  //         sehingga timer bisa ambil target dengan benar
  const startRotateThenTravel = useCallback((goalId: number, yawDeg: number) => {
    targetYawRef.current  = yawDeg;
    travelGoalRef.current = goalId;           // ← kunci fix: simpan goalId di ref
    phaseRef.current      = 'rotate';

    setWpStatus(prev => ({ ...prev, [goalId]: 'rotating' }));
    log(`🔄 Rotate ke ${yawDeg}° (${yawToCompass(yawDeg)})`);
  }, [log]);

  // ── Mulai travel langsung ke goalId (tanpa rotate) ────────────────────────
  const startTravelTo = useCallback((goalId: number) => {
    travelGoalRef.current = goalId;
    phaseRef.current      = 'travel';
    setActiveGoalId(goalId);
    setWpStatus(prev => ({ ...prev, [goalId]: 'active' }));
    log(`🚀 Menuju WP...`);
  }, [log]);

  // ── Advance sequential: tampilkan modal dulu sebelum jalan ───────────────
  const advanceSequential = useCallback(() => {
    const currentGoals = goalsRef.current;
    const nextIdx      = seqIndexRef.current + 1;

    if (nextIdx >= currentGoals.length) {
      // Semua waypoint selesai
      sendVel(0, 0, 0, 0);
      phaseRef.current      = 'travel';
      travelGoalRef.current = null;
      targetYawRef.current  = null;
      seqIndexRef.current   = -1;
      isMissionRef.current  = false;
      setActiveGoalId(null);
      setIsMissionRunning(false);
      log('🏁 Seluruh misi selesai!');
      return;
    }

    seqIndexRef.current = nextIdx;
    const nextGoal = currentGoals[nextIdx];
    // Selalu tampilkan modal orientasi sebelum jalan ke waypoint manapun
    showOrientModalFor(nextGoal.id, nextIdx + 1, nextGoal.rosX, nextGoal.rosY);
  }, [sendVel, showOrientModalFor, log]);

  // ── Handler: user konfirmasi orientasi ────────────────────────────────────
  const handleOrientConfirm = useCallback((opt: OrientationOption) => {
    const goalId = orientModal.forGoalId;
    setOrientModal(prev => ({ ...prev, visible: false }));
    if (goalId === null) return;
    startRotateThenTravel(goalId, opt.yawDeg);
  }, [orientModal.forGoalId, startRotateThenTravel]);

  // ── Handler: user skip orientasi ─────────────────────────────────────────
  const handleOrientSkip = useCallback(() => {
    const goalId = orientModal.forGoalId;
    setOrientModal(prev => ({ ...prev, visible: false }));
    if (goalId === null) return;
    log('⏩ Orientasi dilewati');
    startTravelTo(goalId);
  }, [orientModal.forGoalId, startTravelTo, log]);

  // ── Setup WebSocket + control loop ────────────────────────────────────────
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

    // ── Control loop 10 Hz ────────────────────────────────────────────────
    const timer = setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      const phase   = phaseRef.current;
      const goalId  = travelGoalRef.current;
      const clamp   = (v: number, mx: number) => Math.max(Math.min(v, mx), -mx);

      // ── WAITING: diam ──────────────────────────────────────────────────
      if (phase === 'waiting') {
        sendVel(0, 0, 0, 0);
        return;
      }

      if (goalId === null) return;
      const target = goalsRef.current.find(g => g.id === goalId);
      if (!target) return;

      const cur = rovPosRef.current;

      // ── ROTATE: putar ke yaw target ────────────────────────────────────
      if (phase === 'rotate') {
        const tYaw = targetYawRef.current;
        if (tYaw === null) { phaseRef.current = 'travel'; return; }

        const diff = angleDiff(tYaw, cur.yaw);

        if (Math.abs(diff) < YAW_THRESHOLD) {
          // Rotate selesai → mulai travel
          sendVel(0, 0, 0, 0);
          log(`✅ Rotate selesai (${yawToCompass(tYaw)}) → mulai jalan`);
          targetYawRef.current = null;
          // Langsung switch ke travel phase
          phaseRef.current = 'travel';
          setActiveGoalId(goalId);
          setWpStatus(prev => ({ ...prev, [goalId]: 'active' }));
          return;
        }

        // Kirim angular velocity
        const wz = clamp(diff * KP_YAW, MAX_YAW_VEL);
        sendVel(0, 0, 0, wz);
        return;
      }

      // ── TRAVEL: menuju waypoint ────────────────────────────────────────
      const dx     = target.rosX - cur.rosX;
      const dy     = target.rosY - cur.rosY;
      const dz     = depthRef.current - cur.z;
      const distXY = Math.hypot(dx, dy);

      if (distXY < ARRIVAL_THRESHOLD && Math.abs(dz) < ARRIVAL_THRESHOLD) {
        // Sampai!
        sendVel(0, 0, 0, 0);
        setWpStatus(prev => ({ ...prev, [goalId]: 'done' }));
        travelGoalRef.current = null;
        setActiveGoalId(null);
        log(`✅ Sampai WP! (${distXY.toFixed(2)}m)`);

        if (isMissionRef.current) {
          // Advance ke waypoint berikutnya (akan tampilkan modal orientasi lagi)
          setTimeout(() => advanceSequential(), 500);
        }
        return;
      }

      // Holonomic travel
      const yawRad = cur.yaw * (Math.PI / 180);
      const localX =  dx * Math.cos(yawRad) + dy * Math.sin(yawRad);
      const localY = -dx * Math.sin(yawRad) + dy * Math.cos(yawRad);
      sendVel(
        clamp(localX * KP_XY, MAX_VEL),
        clamp(localY * KP_XY, MAX_VEL),
        clamp(dz * KP_Z, MAX_VEL),
        0
      );
    }, LOOP_HZ);

    return () => { clearInterval(timer); socket.close(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mission controls ───────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    sendVel(0, 0, 0, 0);
    phaseRef.current      = 'travel';
    travelGoalRef.current = null;
    targetYawRef.current  = null;
    seqIndexRef.current   = -1;
    isMissionRef.current  = false;
    setActiveGoalId(null);
    setIsMissionRunning(false);
    setOrientModal(prev => ({ ...prev, visible: false }));
    setWpStatus(prev => {
      const r: Record<number, WaypointStatus> = {};
      Object.keys(prev).forEach(k => { r[Number(k)] = 'pending'; });
      return r;
    });
    log('🛑 Emergency stop!');
  }, [sendVel, log]);

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
    // FIX #2: langsung tampilkan modal orientasi untuk WP1
    setTimeout(() => advanceSequential(), 0);
  };

  const startSingle = (goalId: number) => {
    if (isMissionRunning) return;
    startTravelTo(goalId);
  };

  const addGoal = (rosX: number, rosY: number) => {
    if (isMissionRunning) return;
    const id = Date.now();
    setGoals(prev => [...prev, { id, rosX, rosY }]);
    setWpStatus(prev => ({ ...prev, [id]: 'pending' }));
    log(`📍 WP ditambah: X=${rosX.toFixed(2)} Y=${rosY.toFixed(2)}`);
  };

  const removeGoal = (id: number) => {
    if (isMissionRunning) return;
    setGoals(prev => prev.filter(g => g.id !== id));
    setWpStatus(prev => { const s = { ...prev }; delete s[id]; return s; });
  };

  const clearAll = () => {
    stopAll();
    setGoals([]);
    setWpStatus({});
    setRovPath([]);
  };

  // ── Styling helpers ────────────────────────────────────────────────────────
  const cardStyle = (id: number) => {
    const s = wpStatus[id];
    if (s === 'active')              return 'bg-blue-600/20 border-blue-500/50';
    if (s === 'rotating')            return 'bg-purple-600/20 border-purple-500/50';
    if (s === 'waiting_orientation') return 'bg-yellow-600/20 border-yellow-500/50';
    if (s === 'done')                return 'bg-green-600/10 border-green-500/30';
    return 'bg-white/5 border-white/5';
  };

  const statusBadge = (id: number) => {
    const s = wpStatus[id];
    if (s === 'active')              return <span className="text-[9px] text-blue-400 animate-pulse font-bold">● MENUJU</span>;
    if (s === 'rotating')            return <span className="text-[9px] text-purple-400 font-bold">↻ ROTATE</span>;
    if (s === 'waiting_orientation') return <span className="text-[9px] text-yellow-400 animate-pulse font-bold">⏸ ORIENTASI</span>;
    if (s === 'done')                return <span className="text-[9px] text-green-400 font-bold">✓ SELESAI</span>;
    return null;
  };

  const completedCount = Object.values(wpStatus).filter(s => s === 'done').length;

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#0b111a] text-white">

      {/* Orientation modal */}
      {orientModal.visible && (
        <OrientationModal
          waypointIndex={orientModal.waypointIndex}
          waypointX={orientModal.rosX}
          waypointY={orientModal.rosY}
          onConfirm={handleOrientConfirm}
          onSkip={handleOrientSkip}
          onStop={stopAll}
        />
      )}

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
                Misi — {completedCount}/{goals.length}
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
            <div className="grid grid-cols-5 gap-1 font-mono text-[9px]">
              {[
                { label: 'X',     val: rovPos.rosX.toFixed(2)      },
                { label: 'Y',     val: rovPos.rosY.toFixed(2)      },
                { label: 'Z',     val: rovPos.z.toFixed(2)         },
                { label: 'Yaw',   val: `${rovPos.yaw.toFixed(0)}°` },
                { label: 'Hadap', val: yawToCompass(rovPos.yaw)    },
              ].map(({ label, val }) => (
                <div key={label} className="flex flex-col items-center bg-white/5 rounded p-1">
                  <span className="text-slate-500">{label}</span>
                  <span className={label === 'Hadap' ? 'text-yellow-300 font-black' : 'text-blue-300'}>{val}</span>
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
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / goals.length) * 100}%` }}/>
              </div>
            </div>
          )}

          {/* Waypoint list */}
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col gap-3 min-h-0">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-[10px] font-bold uppercase text-slate-400">Waypoints ({goals.length})</h3>
              <button onClick={clearAll} disabled={isMissionRunning}
                className="text-[10px] text-red-400 hover:text-red-300 hover:underline disabled:opacity-30 disabled:cursor-not-allowed">
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
                <div key={g.id} className={`p-3 rounded-lg border flex items-center justify-between transition-all duration-300 ${cardStyle(g.id)}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border flex-shrink-0 ${
                      wpStatus[g.id] === 'done'                ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                      wpStatus[g.id] === 'active'              ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse' :
                      wpStatus[g.id] === 'rotating'            ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' :
                      wpStatus[g.id] === 'waiting_orientation' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 animate-pulse' :
                      'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                      {wpStatus[g.id] === 'done' ? '✓' : index + 1}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-300">WP {index + 1}</span>
                        {statusBadge(g.id)}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">
                        X:{g.rosX.toFixed(2)} Y:{g.rosY.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {!isMissionRunning && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {travelGoalRef.current === g.id ? (
                        <button onClick={stopAll} className="px-2 py-1 bg-red-500 hover:bg-red-400 text-white text-[9px] font-bold rounded animate-pulse">STOP</button>
                      ) : (
                        <button onClick={() => startSingle(g.id)} className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[9px] font-bold rounded">GO</button>
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
                <button onClick={startSequentialMission} disabled={goals.length === 0 || !isConnected}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-blue-600/20">
                  ▶ Start Sequential Mission
                </button>
              ) : (
                <>
                  <button onClick={stopAll}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-red-600/20">
                    ⏹ Emergency Stop
                  </button>
                  <p className="text-center text-[9px] text-slate-600">
                    ROV rotate dulu sebelum menuju tiap waypoint
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Mission log */}
          <div className="bg-black/40 rounded-xl border border-white/5 p-3 h-40 overflow-y-auto">
            <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Mission Log</p>
            {debugLog.length === 0 && <p className="text-[9px] text-slate-700 italic">Menunggu aktivitas...</p>}
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