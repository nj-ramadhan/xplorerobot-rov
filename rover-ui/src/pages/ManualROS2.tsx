import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom'; 
import { AutoSliderPanel } from '../components/manual-control/AutoSliderPanel';
import { KeyboardPanel } from '../components/manual-control/KeyboardPanel';
import { ThrusterMatrixPanel } from '../components/manual-control/ThrusterMatrixPanel';
import { PreFlightChecklist } from '../components/manual-control/PreFlightChecklist';

// ── Konstanta ────────────────────────────────────────────────────────────────
const WS_URL        = 'ws://localhost:9090';
const TOPIC_PREFIX  = '/xr_rov';          
const LOOP_HZ       = 100;                
const THRUSTER_TYPE = 'std_msgs/msg/Float64';
const THRUSTER_COUNT = 6;

interface ManualROS2Props {
  isDarkMode?: boolean;
}

export const ManualROS2: React.FC<ManualROS2Props> = ({ isDarkMode = true }) => {

  // ── State ─────────────────────────────────────────────────────────────────
  const [showChecklist, setShowChecklist] = useState(() => {
    return sessionStorage.getItem('ros2_manual_ready') !== 'true';
  });
  const [connStatus, setConnStatus]   = useState<'connecting' | 'online' | 'error'>('connecting');
  const [controlMode, setControlMode] = useState<'slider' | 'keyboard'>('slider');
  const [thrusters, setThrusters]     = useState<number[]>(Array(THRUSTER_COUNT).fill(0));
  const [debugLog, setDebugLog]       = useState<string[]>([]);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const ws           = useRef<WebSocket | null>(null);
  const thrustersRef = useRef<number[]>(Array(THRUSTER_COUNT).fill(0));
  const advertised   = useRef(false);

  // Sync state → ref
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
  }, []); 

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

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-slate-200';
  
  const statusLabel = {
    connecting: { text: 'Menunggu Koneksi...', dot: 'bg-yellow-400 animate-pulse', color: isDarkMode ? 'text-yellow-400' : 'text-yellow-600' },
    online:     { text: 'Terhubung ke ROS2 Gazebo', dot: 'bg-green-400 animate-pulse', color: isDarkMode ? 'text-green-400' : 'text-emerald-600' },
    error:      { text: 'Koneksi Gagal — Cek rosbridge', dot: 'bg-red-400', color: isDarkMode ? 'text-red-400' : 'text-red-600' },
  }[connStatus];

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-6 animate-in fade-in duration-700 p-8 relative font-['Inter',sans-serif] ${textColor}`}>

      {showChecklist && createPortal(
        <PreFlightChecklist onFinish={handleFinishChecklist} isDarkMode={isDarkMode} />,
        document.body
      )}

      {/* Header */}
      <div className={`flex justify-between items-end border-b pb-4 transition-colors duration-300 ${borderColor}`}>
        <div>
          <h2 className={`font-black text-xl uppercase tracking-wider flex items-center gap-3 transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            <span className={`p-2 rounded-lg text-lg ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>⚙️</span>
            Manual Override Control
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full shadow-sm ${statusLabel.dot}`}/>
            <p className={`text-sm font-mono font-bold tracking-widest transition-colors duration-300 ${statusLabel.color}`}>
              {statusLabel.text}
            </p>
          </div>
        </div>

        {/* --- KUMPULAN TOMBOL KANAN ATAS --- */}
        <div className="flex items-center gap-3">
          {/* Tombol Refresh */}
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded font-bold transition-all border shadow-sm text-xs uppercase tracking-tighter ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-300 border-white/5 hover:bg-slate-700 hover:text-white' 
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
            title="Muat Ulang Halaman"
          >
            🔄 REFRESH
          </button>

          {/* Tombol Emergency Stop */}
          <button
            onClick={resetAll}
            className={`px-6 py-2 rounded font-bold transition-all uppercase text-xs tracking-tighter shadow-sm border ${
              isDarkMode 
                ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30' 
                : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
            }`}
          >
            🛑 Emergency Stop All
          </button>
        </div>
      </div>

      {/* Tab mode */}
      <div className={`flex gap-2 p-1 w-fit rounded border transition-colors duration-300 ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-200/50 border-slate-300'}`}>
        <button
          onClick={() => handleSwitchMode('slider')}
          className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest rounded transition-all ${
            controlMode === 'slider'
              ? 'bg-blue-600 text-white shadow-lg'
              : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')
          }`}
        >
          🎚️ Auto-Slider
        </button>
        <button
          onClick={() => handleSwitchMode('keyboard')}
          className={`px-6 py-2 font-bold text-[10px] uppercase tracking-widest rounded transition-all ${
            controlMode === 'keyboard'
              ? 'bg-purple-600 text-white shadow-lg'
              : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')
          }`}
        >
          ⌨️ Keyboard
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Panel kiri: input mode (Meneruskan isDarkMode) */}
        <div className="lg:col-span-6">
          {controlMode === 'slider' ? (
            <AutoSliderPanel currentThrusters={thrusters} onApply={setThrusters} isDarkMode={isDarkMode} />
          ) : (
            <KeyboardPanel isActive={controlMode === 'keyboard'} onUpdate={handleKeyboardUpdate} isDarkMode={isDarkMode} />
          )}
        </div>

        {/* Panel kanan: thruster matrix (Meneruskan isDarkMode) */}
        <div className="lg:col-span-6">
          <ThrusterMatrixPanel
            thrusters={thrusters}
            isLocked={controlMode === 'keyboard'}
            onChange={handleSliderChange}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Debug log */}
      <div className={`rounded-xl border p-3 h-32 overflow-y-auto custom-scrollbar transition-colors duration-300 shadow-inner ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200'}`}>
        <p className={`text-[9px] font-bold uppercase mb-2 transition-colors duration-300 ${mutedColor}`}>Connection Log</p>
        {debugLog.length === 0 && (
          <p className={`text-[9px] italic transition-colors duration-300 ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}`}>Menunggu aktivitas...</p>
        )}
        {debugLog.map((entry, i) => (
          <p key={i} className={`text-[10px] font-mono font-medium leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{entry}</p>
        ))}
      </div>

      {/* Footer */}
      <div className={`pt-4 border-t text-center transition-colors duration-300 ${borderColor}`}>
        <p className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${mutedColor}`}>
          Polman Bandung — TRIN PBL Project [ROV_AOV_SYSTEM]
        </p>
      </div>

    </div>
  );
};

export default ManualROS2;