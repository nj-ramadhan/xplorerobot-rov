import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AutoSliderPanel } from '../components/manual-control/AutoSliderPanel';
import { KeyboardPanel } from '../components/manual-control/KeyboardPanel';
import { ThrusterMatrixPanel } from '../components/manual-control/ThrusterMatrixPanel';
import { PreFlightChecklist } from '../components/manual-control/PreFlightChecklist';

// ── Konstanta ────────────────────────────────────────────────────────────────
const WS_URL        = 'ws://localhost:9090';
const TOPIC_PREFIX  = '/xr_rov';          // FIX: dulu /bluerov2, sekarang /xr_rov
const LOOP_HZ       = 100;                // ms per tick (10 Hz)
const THRUSTER_TYPE = 'std_msgs/msg/Float64';
const THRUSTER_COUNT = 6;

export const ManualROS2: React.FC = () => {

  // ── State ─────────────────────────────────────────────────────────────────
  const [showChecklist, setShowChecklist] = useState(() => {
    return sessionStorage.getItem('ros2_manual_ready') !== 'true';
  });
  const [connStatus, setConnStatus]   = useState<'connecting' | 'online' | 'error'>('connecting');
  const [controlMode, setControlMode] = useState<'slider' | 'keyboard'>('slider');
  const [thrusters, setThrusters]     = useState<number[]>(Array(THRUSTER_COUNT).fill(0));
  const [debugLog, setDebugLog]       = useState<string[]>([]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  // FIX: pakai WebSocket native, bukan ROSLIB
  // ROSLIB kadang gagal negotiate koneksi dengan rosbridge versi tertentu
  const ws           = useRef<WebSocket | null>(null);
  const thrustersRef = useRef<number[]>(Array(THRUSTER_COUNT).fill(0));
  const advertised   = useRef(false);

  // Sync state → ref (supaya interval selalu baca nilai terbaru)
  useEffect(() => {
    thrustersRef.current = thrusters;
  }, [thrusters]);

  // ── Helper: log ───────────────────────────────────────────────────────────
  const log = useCallback((msg: string) => {
    setDebugLog(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 19),
    ]);
  }, []);

  // ── Helper: advertise semua topic thruster ────────────────────────────────
  const advertiseThrusterTopics = useCallback((socket: WebSocket) => {
    if (advertised.current) return;
    for (let i = 1; i <= THRUSTER_COUNT; i++) {
      socket.send(JSON.stringify({
        op:   'advertise',
        topic: `${TOPIC_PREFIX}/cmd_thruster${i}`,
        type:  THRUSTER_TYPE,
      }));
    }
    advertised.current = true;
    log('Semua topic thruster di-advertise');
  }, [log]);

  // ── Setup WebSocket + publish loop ────────────────────────────────────────
  useEffect(() => {
    advertised.current = false;
    const socket = new WebSocket(WS_URL);
    ws.current = socket;

    socket.onopen = () => {
      setConnStatus('online');
      log('rosbridge terhubung');
      advertiseThrusterTopics(socket);
    };

    socket.onerror = () => {
      setConnStatus('error');
      log('WebSocket error — pastikan rosbridge jalan');
    };

    socket.onclose = () => {
      setConnStatus('error');
      log('rosbridge putus');
    };

    // Publish thruster values 10 Hz
    const interval = setInterval(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

      thrustersRef.current.forEach((val, i) => {
        ws.current!.send(JSON.stringify({
          op:    'publish',
          topic: `${TOPIC_PREFIX}/cmd_thruster${i + 1}`,
          msg:   { data: val },
        }));
      });
    }, LOOP_HZ);

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  const resetAll = useCallback(() => {
    const neutral = Array(THRUSTER_COUNT).fill(0);
    setThrusters(neutral);
    thrustersRef.current = neutral;
    log('🛑 Emergency stop — semua thruster = 0');
  }, [log]);

  const handleSwitchMode = (mode: 'slider' | 'keyboard') => {
    setControlMode(mode);
    resetAll();
  };

  // ── Status label ──────────────────────────────────────────────────────────
  const statusLabel = {
    connecting: { text: 'Menunggu Koneksi...', dot: 'bg-yellow-400 animate-pulse', color: 'text-yellow-400' },
    online:     { text: 'Terhubung ke ROS2 Gazebo', dot: 'bg-green-400 animate-pulse', color: 'text-green-400' },
    error:      { text: 'Koneksi Gagal — Cek rosbridge', dot: 'bg-red-400', color: 'text-red-400' },
  }[connStatus];

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-8 text-white relative">

      {/* Pre-flight checklist modal */}
      {showChecklist && <PreFlightChecklist onFinish={handleFinishChecklist} />}

      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-black text-xl text-blue-400 uppercase tracking-wider flex items-center gap-3">
            <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-lg">⚙️</span>
            Manual Override Control
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${statusLabel.dot}`}/>
            <p className={`text-sm font-mono tracking-widest ${statusLabel.color}`}>
              {statusLabel.text}
            </p>
          </div>
        </div>
        <button
          onClick={resetAll}
          className="bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30 px-6 py-2 rounded font-bold transition-all uppercase text-xs tracking-tighter"
        >
          🛑 Emergency Stop All
        </button>
      </div>

      {/* Tab mode */}
      <div className="flex gap-2 p-1 bg-black/40 w-fit rounded border border-white/5">
        <button
          onClick={() => handleSwitchMode('slider')}
          className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest rounded transition-all ${
            controlMode === 'slider'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          🎚️ Auto-Slider
        </button>
        <button
          onClick={() => handleSwitchMode('keyboard')}
          className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest rounded transition-all ${
            controlMode === 'keyboard'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          ⌨️ Keyboard
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Panel kiri: input mode */}
        <div className="lg:col-span-6">
          {controlMode === 'slider' ? (
            <AutoSliderPanel currentThrusters={thrusters} onApply={setThrusters} />
          ) : (
            <KeyboardPanel isActive={controlMode === 'keyboard'} onUpdate={handleKeyboardUpdate} />
          )}
        </div>

        {/* Panel kanan: thruster matrix */}
        <div className="lg:col-span-6">
          <ThrusterMatrixPanel
            thrusters={thrusters}
            isLocked={controlMode === 'keyboard'}
            onChange={handleSliderChange}
          />
        </div>
      </div>

      {/* Debug log */}
      <div className="bg-black/40 rounded-xl border border-white/5 p-3 h-32 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Connection Log</p>
        {debugLog.length === 0 && (
          <p className="text-[9px] text-slate-700 italic">Menunggu aktivitas...</p>
        )}
        {debugLog.map((entry, i) => (
          <p key={i} className="text-[9px] font-mono text-slate-400 leading-relaxed">{entry}</p>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
          Polman Bandung — TRIN PBL Project [ROV_AOV_SYSTEM]
        </p>
      </div>

    </div>
  );
};

export default ManualROS2;