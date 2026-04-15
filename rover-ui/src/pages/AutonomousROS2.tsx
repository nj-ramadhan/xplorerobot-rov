import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPanel } from '../components/autonomous-control/MapPanel';
import { PathMapPanel, PathGoal } from '../components/autonomous-control/PathMapPanel';
import { MissionPanel } from '../components/autonomous-control/MissionPanel';
import { OrientationModal, OrientationOption } from '../components/autonomous-control/OrientationModal';
import { DepthControl } from '../components/autonomous-control/DepthControl';
// ── [1] IMPORT MISSION IO ──────────────────────────────────────────────────
import { MissionIO } from '../components/autonomous-control/MissionIO';

// ── Types ──────────────────────────────────────────────────────────────────

type MissionMode = 'waypoint' | 'path';

interface Goal {
  id: number;
  rosX: number;
  rosY: number;
  depth: number; // target Z per waypoint
}

type WaypointStatus =
  | 'pending'
  | 'active'
  | 'rotating'
  | 'waiting_orientation'
  | 'arrival_orientation'
  | 'done';

type ControlPhase = 'waiting' | 'rotate' | 'travel' | 'arrival_rotate';

interface RovPos {
  rosX: number;
  rosY: number;
  z: number;
  yaw: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const ARRIVAL_THRESHOLD = 0.5;
const YAW_THRESHOLD     = 5.0;
const KP_XY             = 0.8;
const KP_Z              = 0.5;
const KP_YAW            = 0.03;
const MAX_VEL           = 1.0;
const MAX_YAW_VEL       = 0.8;
const LOOP_HZ           = 100;

// ── Helpers ────────────────────────────────────────────────────────────────

function angleDiff(target: number, current: number): number {
  let d = target - current;
  while (d >  180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function yawToCompass(yaw: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(((yaw % 360) + 360) / 45) % 8];
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

const AutonomousROS2: React.FC = () => {

  // ── Mode ───────────────────────────────────────────────────────────────────
  const [missionMode, setMissionMode] = useState<MissionMode>('waypoint');

  // ── Shared State ───────────────────────────────────────────────────────────
  const [isConnected, setIsConnected]           = useState(false);
  const [targetDepth, setTargetDepth]           = useState(-2.0);
  const [rovPos, setRovPos]                     = useState<RovPos>({ rosX: 0, rosY: 0, z: 0, yaw: 0 });
  const [rovPath, setRovPath]                   = useState<Array<{ rosX: number; rosY: number }>>([]);
  const [debugLog, setDebugLog]                 = useState<string[]>([]);
  const [isMissionRunning, setIsMissionRunning] = useState(false);
  const [activeGoalId, setActiveGoalId]         = useState<number | null>(null);
  const [wpStatus, setWpStatus]                 = useState<Record<number, WaypointStatus>>({});

  // ── Mode 1 State ───────────────────────────────────────────────────────────
  const [goals, setGoals] = useState<Goal[]>([]);

  const [orientModal, setOrientModal] = useState<{
    visible: boolean; forGoalId: number | null;
    waypointIndex: number; rosX: number; rosY: number;
  }>({ visible: false, forGoalId: null, waypointIndex: 1, rosX: 0, rosY: 0 });

  const [arrivalModal, setArrivalModal] = useState<{
    visible: boolean; forGoalId: number | null;
    waypointIndex: number; rosX: number; rosY: number;
  }>({ visible: false, forGoalId: null, waypointIndex: 1, rosX: 0, rosY: 0 });

  // ── Mode 2 State ───────────────────────────────────────────────────────────
  const [pathGoals, setPathGoals] = useState<PathGoal[]>([]);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const ws             = useRef<WebSocket | null>(null);
  const goalsRef       = useRef<Goal[]>([]);
  const pathGoalsRef   = useRef<PathGoal[]>([]);
  const rovPosRef      = useRef<RovPos>({ rosX: 0, rosY: 0, z: 0, yaw: 0 });
  const depthRef       = useRef(-2.0);
  const seqIndexRef    = useRef(-1);
  const isMissionRef   = useRef(false);
  const missionModeRef = useRef<MissionMode>('waypoint');

  const phaseRef        = useRef<ControlPhase>('travel');
  const travelGoalRef   = useRef<number | null>(null);
  const targetYawRef    = useRef<number | null>(null);
  const holdYawRef      = useRef<number | null>(null);

  useEffect(() => { goalsRef.current      = goals;           }, [goals]);
  useEffect(() => { pathGoalsRef.current  = pathGoals;       }, [pathGoals]);
  useEffect(() => { rovPosRef.current     = rovPos;          }, [rovPos]);
  useEffect(() => { depthRef.current      = targetDepth;     }, [targetDepth]);
  useEffect(() => { isMissionRef.current  = isMissionRunning; }, [isMissionRunning]);
  useEffect(() => { missionModeRef.current = missionMode;    }, [missionMode]);

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

  // ── Mode 1: orientation modal helpers ──────────────────────────────────────

  const showOrientModalFor = useCallback((
    goalId: number, wpDisplayIndex: number, rosX: number, rosY: number
  ) => {
    sendVel(0, 0, 0, 0);
    phaseRef.current = 'waiting';
    travelGoalRef.current = null;
    targetYawRef.current  = null;
    holdYawRef.current    = null;
    setActiveGoalId(goalId);
    setWpStatus(prev => ({ ...prev, [goalId]: 'waiting_orientation' }));
    setOrientModal({ visible: true, forGoalId: goalId, waypointIndex: wpDisplayIndex, rosX, rosY });
    log(`⏸️ Pilih orientasi AWAL untuk WP ${wpDisplayIndex}...`);
  }, [sendVel, log]);

  const showArrivalModalFor = useCallback((
    goalId: number, wpDisplayIndex: number, rosX: number, rosY: number
  ) => {
    sendVel(0, 0, 0, 0);
    phaseRef.current = 'waiting';
    travelGoalRef.current = null;
    targetYawRef.current  = null;
    setWpStatus(prev => ({ ...prev, [goalId]: 'arrival_orientation' }));
    setArrivalModal({ visible: true, forGoalId: goalId, waypointIndex: wpDisplayIndex, rosX, rosY });
    log(`🎯 Tiba di WP ${wpDisplayIndex}! Pilih orientasi akhir...`);
  }, [sendVel, log]);

  const startRotateThenTravel = useCallback((goalId: number, yawDeg: number) => {
    targetYawRef.current  = yawDeg;
    holdYawRef.current    = yawDeg;
    travelGoalRef.current = goalId;
    phaseRef.current      = 'rotate';
    setWpStatus(prev => ({ ...prev, [goalId]: 'rotating' }));
    log(`🔄 Rotate ke ${yawDeg}° (${yawToCompass(yawDeg)})`);
  }, [log]);

  const startArrivalRotate = useCallback((goalId: number, yawDeg: number) => {
    targetYawRef.current  = yawDeg;
    holdYawRef.current    = yawDeg;
    travelGoalRef.current = goalId;
    phaseRef.current      = 'arrival_rotate';
    setWpStatus(prev => ({ ...prev, [goalId]: 'rotating' }));
    log(`🔄 Rotate orientasi akhir ke ${yawDeg}° (${yawToCompass(yawDeg)})`);
  }, [log]);

  const startTravelTo = useCallback((goalId: number) => {
    travelGoalRef.current = goalId;
    holdYawRef.current    = null;
    phaseRef.current      = 'travel';
    setActiveGoalId(goalId);
    setWpStatus(prev => ({ ...prev, [goalId]: 'active' }));
    log(`🚀 Menuju WP... (tanpa yaw hold)`);
  }, [log]);

  // ── advanceSequential — works for both modes ───────────────────────────────

  const advanceSequential = useCallback(() => {
    const mode        = missionModeRef.current;
    const currentGoals = mode === 'waypoint' ? goalsRef.current : pathGoalsRef.current;
    const nextIdx     = seqIndexRef.current + 1;

    if (nextIdx >= currentGoals.length) {
      sendVel(0, 0, 0, 0);
      phaseRef.current      = 'travel';
      travelGoalRef.current = null;
      targetYawRef.current  = null;
      holdYawRef.current    = null;
      seqIndexRef.current   = -1;
      isMissionRef.current  = false;
      setActiveGoalId(null);
      setIsMissionRunning(false);
      log('🏁 Seluruh misi selesai!');
      return;
    }

    seqIndexRef.current = nextIdx;
    const nextGoal = currentGoals[nextIdx];

    if (mode === 'waypoint') {
      // Mode 1: show orientation popup
      showOrientModalFor(nextGoal.id, nextIdx + 1, nextGoal.rosX, nextGoal.rosY);
    } else {
      // Mode 2: rotate immediately to pre-set yaw from drag, then travel
      const pg = nextGoal as PathGoal;
      holdYawRef.current    = pg.yawDeg;
      targetYawRef.current  = pg.yawDeg;
      travelGoalRef.current = pg.id;
      phaseRef.current      = 'rotate';
      setActiveGoalId(pg.id);
      setWpStatus(prev => ({ ...prev, [pg.id]: 'rotating' }));
      log(`🔄 [Path] WP ${nextIdx + 1} — Rotate ke ${pg.yawDeg.toFixed(0)}° (${yawToCompass(pg.yawDeg)})...`);
    }
  }, [sendVel, showOrientModalFor, log]);

  // ── Mode 1 confirm/skip handlers ──────────────────────────────────────────

  const handleOrientConfirm = useCallback((opt: OrientationOption) => {
    const goalId = orientModal.forGoalId;
    setOrientModal(prev => ({ ...prev, visible: false }));
    if (goalId === null) return;
    startRotateThenTravel(goalId, opt.yawDeg);
  }, [orientModal.forGoalId, startRotateThenTravel]);

  const handleOrientSkip = useCallback(() => {
    const goalId = orientModal.forGoalId;
    setOrientModal(prev => ({ ...prev, visible: false }));
    if (goalId === null) return;
    log('⏩ Orientasi awal dilewati (tanpa yaw hold)');
    startTravelTo(goalId);
  }, [orientModal.forGoalId, startTravelTo, log]);

  const handleArrivalConfirm = useCallback((opt: OrientationOption) => {
    const goalId = arrivalModal.forGoalId;
    setArrivalModal(prev => ({ ...prev, visible: false }));
    if (goalId === null) return;
    startArrivalRotate(goalId, opt.yawDeg);
    log(`🔄 Rotate ke orientasi akhir ${opt.yawDeg}° (${opt.dir})`);
  }, [arrivalModal.forGoalId, startArrivalRotate, log]);

  const handleArrivalSkip = useCallback(() => {
    const goalId = arrivalModal.forGoalId;
    setArrivalModal(prev => ({ ...prev, visible: false }));
    if (goalId === null) return;
    setWpStatus(prev => ({ ...prev, [goalId]: 'done' }));
    log('⏩ Orientasi akhir dilewati — lanjut ke WP berikutnya');
    setTimeout(() => advanceSequential(), 300);
  }, [arrivalModal.forGoalId, advanceSequential, log]);

  // ── WebSocket + Control Loop ───────────────────────────────────────────────

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

    // ── Control loop ────────────────────────────────────────────────────────
    const timer = setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      const phase  = phaseRef.current;
      const goalId = travelGoalRef.current;
      const clamp  = (v: number, mx: number) => Math.max(Math.min(v, mx), -mx);

      if (phase === 'waiting') { sendVel(0, 0, 0, 0); return; }
      if (goalId === null) return;

      const allGoals = missionModeRef.current === 'waypoint' ? goalsRef.current : pathGoalsRef.current;
      const target   = allGoals.find(g => g.id === goalId);
      if (!target) return;

      const cur = rovPosRef.current;

      // ROTATE (awal)
      if (phase === 'rotate') {
        const tYaw = targetYawRef.current;
        if (tYaw === null) { phaseRef.current = 'travel'; return; }
        const diff = angleDiff(tYaw, cur.yaw);
        if (Math.abs(diff) < YAW_THRESHOLD) {
          sendVel(0, 0, 0, 0);
          log(`✅ Rotate selesai (${yawToCompass(tYaw)}) → mulai travel`);
          targetYawRef.current = null;
          phaseRef.current     = 'travel';
          setActiveGoalId(goalId);
          setWpStatus(prev => ({ ...prev, [goalId]: 'active' }));
          return;
        }
        sendVel(0, 0, 0, clamp(diff * KP_YAW, MAX_YAW_VEL));
        return;
      }

      // ARRIVAL_ROTATE (orientasi akhir — Mode 1 only)
      if (phase === 'arrival_rotate') {
        const tYaw = targetYawRef.current;
        if (tYaw === null) return;
        const diff = angleDiff(tYaw, cur.yaw);
        if (Math.abs(diff) < YAW_THRESHOLD) {
          sendVel(0, 0, 0, 0);
          targetYawRef.current  = null;
          travelGoalRef.current = null;
          phaseRef.current      = 'waiting';
          log(`✅ Orientasi akhir selesai (${yawToCompass(tYaw)}) → lanjut WP berikutnya`);
          setWpStatus(prev => ({ ...prev, [goalId]: 'done' }));
          setTimeout(() => advanceSequential(), 300);
          return;
        }
        sendVel(0, 0, 0, clamp(diff * KP_YAW, MAX_YAW_VEL));
        return;
      }

      // TRAVEL
      const dx     = target.rosX - cur.rosX;
      const dy     = target.rosY - cur.rosY;
      // Fix F: gunakan depth per waypoint, fallback ke depthRef (global slider)
      const targetZ = ('depth' in target && typeof (target as any).depth === 'number')
        ? (target as any).depth
        : depthRef.current;
      const dz = targetZ - cur.z;
      const distXY = Math.hypot(dx, dy);

      if (distXY < ARRIVAL_THRESHOLD && Math.abs(dz) < ARRIVAL_THRESHOLD) {
        sendVel(0, 0, 0, 0);
        travelGoalRef.current = null;
        setActiveGoalId(null);
        log(`✅ Sampai WP! (${distXY.toFixed(2)}m, Z=${targetZ.toFixed(1)}m)`);

        if (isMissionRef.current) {
          if (missionModeRef.current === 'waypoint') {
            // Mode 1: show arrival orientation modal
            const currentIdx = seqIndexRef.current;
            setTimeout(() => showArrivalModalFor(goalId, currentIdx + 1, target.rosX, target.rosY), 300);
          } else {
            // Mode 2: no arrival modal, just mark done and advance
            setWpStatus(prev => ({ ...prev, [goalId]: 'done' }));
            setTimeout(() => advanceSequential(), 300);
          }
        } else {
          setWpStatus(prev => ({ ...prev, [goalId]: 'done' }));
        }
        return;
      }

      // Yaw hold during travel
      const holdYaw = holdYawRef.current;
      const yawErr  = holdYaw !== null ? angleDiff(holdYaw, cur.yaw) : 0;
      const wz      = holdYaw !== null ? clamp(yawErr * KP_YAW, MAX_YAW_VEL) : 0;

      const yawRad = cur.yaw * (Math.PI / 180);
      const localX =  dx * Math.cos(yawRad) + dy * Math.sin(yawRad);
      const localY = -dx * Math.sin(yawRad) + dy * Math.cos(yawRad);
      sendVel(
        clamp(localX * KP_XY, MAX_VEL),
        clamp(localY * KP_XY, MAX_VEL),
        clamp(dz * KP_Z, MAX_VEL),
        wz,
      );
    }, LOOP_HZ);

    return () => { clearInterval(timer); socket.close(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Mission Controls ───────────────────────────────────────────────────────

  const stopAll = useCallback(() => {
    sendVel(0, 0, 0, 0);
    phaseRef.current      = 'travel';
    travelGoalRef.current = null;
    targetYawRef.current  = null;
    holdYawRef.current    = null;
    seqIndexRef.current   = -1;
    isMissionRef.current  = false;
    setActiveGoalId(null);
    setIsMissionRunning(false);
    setOrientModal(prev => ({ ...prev, visible: false }));
    setArrivalModal(prev => ({ ...prev, visible: false }));
    setWpStatus(prev => {
      const r: Record<number, WaypointStatus> = {};
      Object.keys(prev).forEach(k => { r[Number(k)] = 'pending'; });
      return r;
    });
    log('🛑 Emergency stop!');
  }, [sendVel, log]);

  // Mode 1 start
  const startSequentialMission = () => {
    if (goals.length === 0) { log('⚠️ Tidak ada waypoint!'); return; }
    const initStatus: Record<number, WaypointStatus> = {};
    goals.forEach(g => { initStatus[g.id] = 'pending'; });
    setWpStatus(initStatus);
    setRovPath([]);
    seqIndexRef.current  = -1;
    isMissionRef.current = true;
    setIsMissionRunning(true);
    log(`🗺️ Mode Waypoint — ${goals.length} waypoint (orientasi awal & akhir aktif)`);
    setTimeout(() => advanceSequential(), 0);
  };

  // Mode 2 start
  const startPathMission = () => {
    if (pathGoals.length === 0) { log('⚠️ Tidak ada waypoint!'); return; }
    const initStatus: Record<number, WaypointStatus> = {};
    pathGoals.forEach(g => { initStatus[g.id] = 'pending'; });
    setWpStatus(initStatus);
    setRovPath([]);
    seqIndexRef.current  = -1;
    isMissionRef.current = true;
    setIsMissionRunning(true);
    log(`🗺️ Mode Path — ${pathGoals.length} waypoint (orientasi dari drag)`);
    setTimeout(() => advanceSequential(), 0);
  };

  const addGoal = (rosX: number, rosY: number) => {
    if (isMissionRunning) return;
    const id = Date.now();
    // Fix F: simpan depth saat ini sebagai default per waypoint
    setGoals(prev => [...prev, { id, rosX, rosY, depth: targetDepth }]);
    setWpStatus(prev => ({ ...prev, [id]: 'pending' }));
    log(`📍 WP ditambah: X=${rosX.toFixed(2)} Y=${rosY.toFixed(2)} Z=${targetDepth.toFixed(1)}m`);
  };

  const removeGoal = (id: number) => {
    if (isMissionRunning) return;
    setGoals(prev => prev.filter(g => g.id !== id));
    setWpStatus(prev => { const s = { ...prev }; delete s[id]; return s; });
  };

  const removePathGoal = (id: number) => {
    if (isMissionRunning) return;
    setPathGoals(prev => prev.filter(g => g.id !== id));
    setWpStatus(prev => { const s = { ...prev }; delete s[id]; return s; });
  };

  const clearAll = () => {
    stopAll();
    setGoals([]);
    setPathGoals([]);
    setWpStatus({});
    setRovPath([]);
  };

  // ── [2] HANDLER UNTUK MISSION IO ───────────────────────────────────────────
  const handleMissionImport = useCallback((
    mode: MissionMode,
    waypoints: Goal[],
    importedPathGoals: PathGoal[],
  ) => {
    // Reset misi yang sedang berjalan
    stopAll();

    // Terapkan mode sesuai file
    setMissionMode(mode);

    if (mode === 'waypoint') {
      setGoals(waypoints);
      const initStatus: Record<number, WaypointStatus> = {};
      waypoints.forEach(g => { initStatus[g.id] = 'pending'; });
      setWpStatus(initStatus);
    } else {
      setPathGoals(importedPathGoals);
      const initStatus: Record<number, WaypointStatus> = {};
      importedPathGoals.forEach(g => { initStatus[g.id] = 'pending'; });
      setWpStatus(initStatus);
    }

    setRovPath([]);
    log(`📂 Misi dimuat: ${waypoints.length || importedPathGoals.length} waypoint (mode: ${mode})`);
  }, [stopAll, log]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const activeGoals    = missionMode === 'waypoint' ? goals : pathGoals;
  const completedCount = Object.values(wpStatus).filter(s => s === 'done').length;

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#0b111a] text-white">

      {/* Mode 1: Orientation modals */}
      {orientModal.visible && (
        <OrientationModal
          title={`Waypoint ${orientModal.waypointIndex} — Orientasi Awal`}
          subtitle="Pilih arah hadap ROV sebelum bergerak ke waypoint ini."
          badgeLabel="Orientasi Awal"
          badgeColor="yellow"
          waypointIndex={orientModal.waypointIndex}
          waypointX={orientModal.rosX}
          waypointY={orientModal.rosY}
          onConfirm={handleOrientConfirm}
          onSkip={handleOrientSkip}
          onStop={stopAll}
        />
      )}
      {arrivalModal.visible && (
        <OrientationModal
          title={`Waypoint ${arrivalModal.waypointIndex} — Orientasi Akhir`}
          subtitle="ROV telah tiba. Pilih arah hadap setelah berhenti di titik ini."
          badgeLabel="Orientasi Akhir"
          badgeColor="orange"
          waypointIndex={arrivalModal.waypointIndex}
          waypointX={arrivalModal.rosX}
          waypointY={arrivalModal.rosY}
          onConfirm={handleArrivalConfirm}
          onSkip={handleArrivalSkip}
          onStop={stopAll}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black text-blue-500 uppercase tracking-tighter">
            Autonomous Mission Control
          </h1>
          {isMissionRunning && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"/>
              <span className="text-[10px] font-bold text-blue-400 uppercase">
                Misi — {completedCount}/{activeGoals.length}
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

      {/* ── Mode Switcher ───────────────────────────────────────────────────── */}
      <div className="flex gap-0 rounded-xl border border-white/10 bg-black/30 p-1 w-fit">
        <button
          onClick={() => { if (!isMissionRunning) setMissionMode('waypoint'); }}
          disabled={isMissionRunning}
          className={`px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
            missionMode === 'waypoint'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-500 hover:text-slate-300 disabled:cursor-not-allowed'
          }`}
        >
          📍 Mode 1 — Waypoint + Orientasi
        </button>
        <button
          onClick={() => { if (!isMissionRunning) setMissionMode('path'); }}
          disabled={isMissionRunning}
          className={`px-5 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
            missionMode === 'path'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-500 hover:text-slate-300 disabled:cursor-not-allowed'
          }`}
        >
          🖱️ Mode 2 — Path Drawing
        </button>
      </div>

      {/* Mode description */}
      <div className={`rounded-lg px-4 py-2 text-[10px] border flex items-center gap-2 w-fit ${
        missionMode === 'waypoint'
          ? 'bg-blue-600/10 border-blue-500/20 text-blue-300'
          : 'bg-purple-600/10 border-purple-500/20 text-purple-300'
      }`}>
        {missionMode === 'waypoint' ? (
          <>
            <span>📍</span>
            <span>Klik peta untuk menambah waypoint → orientasi dipilih via popup sebelum &amp; sesudah tiba</span>
          </>
        ) : (
          <>
            <span>🖱️</span>
            <span><strong>Klik &amp; tahan</strong> di peta → <strong>putar/drag</strong> untuk arah hadap → <strong>lepas</strong> untuk simpan waypoint</span>
          </>
        )}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6 flex-1">

        {/* Map */}
        <div className={`col-span-8 rounded-xl border overflow-hidden relative min-h-[500px] ${
          missionMode === 'waypoint' ? 'bg-black/20 border-white/5' : 'bg-black/20 border-purple-500/10'
        }`}>
          {missionMode === 'waypoint' ? (
            <MapPanel
              goals={goals}
              rovPos={rovPos}
              rovPath={rovPath}
              activeGoalId={activeGoalId}
              onMapClick={addGoal}
              disabled={isMissionRunning}
            />
          ) : (
            <PathMapPanel
              pathGoals={pathGoals}
              setPathGoals={setPathGoals}
              activeGoalId={activeGoalId}
              rovPos={rovPos}
              rovPath={rovPath}
              defaultDepth={targetDepth}
              disabled={isMissionRunning}
            />
          )}

          {isMissionRunning && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[9px] text-slate-400 border border-white/5">
              Klik peta dinonaktifkan saat misi berjalan
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="col-span-4 flex flex-col gap-4">
          <DepthControl targetDepth={targetDepth} setTargetDepth={setTargetDepth} isDefault />

          {/* ── [3] MISSION IO COMPONENT ─────────────────────────────────────── */}
          <MissionIO
            missionMode={missionMode}
            goals={goals}
            pathGoals={pathGoals}
            isMissionRunning={isMissionRunning}
            onImport={handleMissionImport}
          />

          {/* Telemetry */}
          <div className="bg-slate-900/50 rounded-xl border border-white/5 p-3">
            <p className="text-[9px] font-bold uppercase text-slate-500 mb-2">ROV Telemetry</p>
            <div className="grid grid-cols-5 gap-1 font-mono text-[9px]">
              {[
                { label: 'X',     val: rovPos.rosX.toFixed(2) },
                { label: 'Y',     val: rovPos.rosY.toFixed(2) },
                { label: 'Z',     val: rovPos.z.toFixed(2) },
                { label: 'Yaw',   val: `${rovPos.yaw.toFixed(0)}°` },
                { label: 'Hadap', val: yawToCompass(rovPos.yaw) },
              ].map(({ label, val }) => (
                <div key={label} className="flex flex-col items-center bg-white/5 rounded p-1">
                  <span className="text-slate-500">{label}</span>
                  <span className={label === 'Hadap' ? 'text-yellow-300 font-black' : 'text-blue-300'}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yaw hold indicator */}
          {isMissionRunning && (
            <div className="bg-slate-900/50 rounded-xl border border-purple-500/20 p-3">
              <p className="text-[9px] font-bold uppercase text-purple-400 mb-1">Yaw Hold Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  holdYawRef.current !== null ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
                }`}/>
                <span className="text-[10px] font-mono text-slate-300">
                  {holdYawRef.current !== null
                    ? `Aktif: ${holdYawRef.current.toFixed(0)}° (${yawToCompass(holdYawRef.current)})`
                    : 'Tidak aktif'}
                </span>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isMissionRunning && activeGoals.length > 0 && (
            <div className="bg-slate-900/50 rounded-xl border border-blue-500/20 p-3">
              <div className="flex justify-between text-[9px] mb-1.5">
                <span className="font-bold uppercase text-blue-400">Progress Misi</span>
                <span className="text-slate-400">{completedCount} / {activeGoals.length} waypoint</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${(completedCount / activeGoals.length) * 100}%` }}/>
              </div>
            </div>
          )}

          {/* Waypoint list + mission buttons */}
          <div className="flex-1 bg-slate-900/50 rounded-xl border border-white/5 p-4 flex flex-col gap-3 min-h-0">
            <MissionPanel
              missionMode={missionMode}
              goals={goals}
              removeGoal={removeGoal}
              pathGoals={pathGoals}
              removePathGoal={removePathGoal}
              wpStatus={wpStatus}
              activeGoalId={activeGoalId}
              isMissionRunning={isMissionRunning}
              isConnected={isConnected}
              startMission={missionMode === 'waypoint' ? startSequentialMission : startPathMission}
              stopMission={stopAll}
              clearAll={clearAll}
            />
          </div>

          {/* Mission Log */}
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