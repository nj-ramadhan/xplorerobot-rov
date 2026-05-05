import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, Settings, Radio, Plus, X, ChevronDown, ChevronUp, 
  SlidersHorizontal, Edit2, Trash2, FileText, Camera, AlertCircle,
  Wifi, WifiOff, RefreshCw, Maximize2, CheckCircle
} from 'lucide-react';

// ============================================================
// TIPE DATA
// ============================================================
interface VideoStreamProps {
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

interface RosMessage {
  data: string;
  format?: string;
}

// ============================================================
// HOOK: Koneksi ke ROS2 via Rosbridge WebSocket
// ============================================================
function useRosBridge(wsUrl: string, imageTopic: string, enabled: boolean) {
  const [isConnected, setIsConnected] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const fpsCounterRef = useRef(0);
  const fpsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current || !enabled) return;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsConnected(true);
        setError(null);

        const subscribeMsg = {
          op: 'subscribe',
          topic: imageTopic,
          type: 'sensor_msgs/CompressedImage',
          throttle_rate: 100,
          queue_length: 1,
          compression: 'none',
        };
        ws.send(JSON.stringify(subscribeMsg));

        fpsTimerRef.current = setInterval(() => {
          if (!mountedRef.current) return;
          setFps(fpsCounterRef.current);
          fpsCounterRef.current = 0;
        }, 1000);
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data);
          if (msg.op === 'publish' && msg.msg?.data) {
            const rosMsg: RosMessage = msg.msg;
            const format = rosMsg.format || 'jpeg';
            setImageSrc(`data:image/${format};base64,${rosMsg.data}`);
            fpsCounterRef.current += 1;
          }
        } catch {
          // abaikan pesan non-JSON
        }
      };

      ws.onerror = () => {
        if (!mountedRef.current) return;
        setError('Gagal terhubung ke rosbridge WebSocket');
        setIsConnected(false);
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsConnected(false);
        setImageSrc(null);
        if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current && enabled) connect();
        }, 3000);
      };
    } catch (err) {
      setError('URL WebSocket tidak valid');
    }
  }, [wsUrl, imageTopic, enabled]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) connect();
    return () => {
      mountedRef.current = false;
      if (wsRef.current) wsRef.current.close();
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [connect, enabled]);

  const reconnect = () => {
    if (wsRef.current) wsRef.current.close();
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    connect();
  };

  return { isConnected, imageSrc, fps, error, reconnect };
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================
const VideoStream: React.FC<VideoStreamProps> = ({ isDarkMode = true, onRefresh }) => {

  // ── Mode Sumber Video ──
  const [videoMode, setVideoMode] = useState<'gazebo' | 'espcam' | 'laptop' | 'usb'>('gazebo');

  // ── Konfigurasi ROS2 & Gazebo (web_video_server) ──
  const [rosbridgeUrl, setRosbridgeUrl] = useState('ws://localhost:9090');
  const [imageTopic, setImageTopic] = useState('/xr_rov/image/compressed');
  const [webVideoUrl, setWebVideoUrl] = useState('http://localhost:8080/stream?topic=/xr_rov/image');
  const [gazeboError, setGazeboError] = useState(false);

  // ── Konfigurasi ESP8266-CAM ──
  const [espCamUrl, setEspCamUrl] = useState('http://10.13.65.138/');
  const [espCamError, setEspCamError] = useState(false);
  const [espCamLoaded, setEspCamLoaded] = useState(false);

  // ── Referensi & State Kamera Lokal (Laptop/USB) ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [endpoints, setEndpoints] = useState([
    { id: 1, type: 'UDP', address: 'udp://192.168.2.1:5600' }
  ]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeviceControlsOpen, setIsDeviceControlsOpen] = useState(false);
  const [expandedSourceId, setExpandedSourceId] = useState<number | null>(null);
  const [showRosConfig, setShowRosConfig] = useState(false);

  // ── Hook ROS2 (Tetap dipertahankan kalau-kalau butuh rosbridge) ──
  const rosEnabled = false; // Sengaja dimatikan sementara karena pakai web_video_server
  const { isConnected, imageSrc, fps, error, reconnect: reconnectRos } = useRosBridge(
    rosbridgeUrl,
    imageTopic,
    rosEnabled
  );

  // ── Hook Kamera Lokal (WebRTC) ──
  useEffect(() => {
    const stopMediaTracks = () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    };

    if (videoMode === 'laptop' || videoMode === 'usb') {
      stopMediaTracks();
      setWebcamError(null);
      
      const constraints = {
        video: videoMode === 'laptop' 
          ? { facingMode: 'user' } 
          : { facingMode: 'environment' }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          setLocalStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Gagal mengakses webcam:", err);
          setWebcamError("Gagal mengakses kamera. Pastikan izin browser diberikan.");
        });
    } else {
      stopMediaTracks();
    }

    return stopMediaTracks;
  }, [videoMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // STATE UNTUK NOTIFIKASI SUKSES (KANAN BAWAH)
  const [showToast, setShowToast] = useState(false);

  // FUNGSI HANDLE REFRESH (NATIVE CONFIRM + CUSTOM TOAST SUKSES)
  const handleRefresh = () => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin me-refresh sumber video?");
    
    if (isConfirmed) {
      if (onRefresh) onRefresh();
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const addEndpoint = () => {
    const newId = endpoints.length ? endpoints[endpoints.length - 1].id + 1 : 1;
    setEndpoints([...endpoints, { id: newId, type: 'UDP', address: '' }]);
  };
  const removeEndpoint = (id: number) => {
    setEndpoints(endpoints.filter(ep => ep.id !== id));
  };

  const cameraSources = [
    { 
      id: 1, 
      name: "Gazebo Simulator (web_video_server)", 
      source: webVideoUrl, 
      format: "MJPEG Stream", 
      encoding: "JPEG", 
      endpoint: webVideoUrl, 
      status: videoMode === 'gazebo' ? (gazeboError ? "Error" : "Running") : "Standby", 
      isActive: videoMode === 'gazebo',
      modeId: 'gazebo' as const
    },
    { 
      id: 2, 
      name: "ESP8266-CAM", 
      source: espCamUrl, 
      format: "HTTP MJPEG Stream", 
      encoding: "JPEG", 
      endpoint: espCamUrl, 
      status: videoMode === 'espcam' ? (espCamLoaded ? "Running" : "Connecting...") : "Standby", 
      isActive: videoMode === 'espcam',
      modeId: 'espcam' as const
    },
    { 
      id: 3, 
      name: "Webcam Laptop (Internal)", 
      source: "navigator.mediaDevices", 
      format: "WebRTC Stream", 
      encoding: "YUV/H264", 
      endpoint: "localhost (User Facing)", 
      status: videoMode === 'laptop' ? (localStream ? "Running" : "Connecting...") : "Standby", 
      isActive: videoMode === 'laptop',
      modeId: 'laptop' as const
    },
    { 
      id: 4, 
      name: "Webcam USB (External)", 
      source: "/dev/videoX", 
      format: "WebRTC Stream", 
      encoding: "YUV/H264", 
      endpoint: "localhost (Environment)", 
      status: videoMode === 'usb' ? (localStream ? "Running" : "Connecting...") : "Standby", 
      isActive: videoMode === 'usb',
      modeId: 'usb' as const
    },
  ];

  // ── Warna tema ──
  const titleText = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedText = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-[#111827]/60 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const innerCardBg = isDarkMode ? 'bg-[#111827]/60 border-white/10 hover:bg-[#111827]/80' : 'bg-slate-50 border-slate-200 hover:bg-slate-100';
  const inputBg = isDarkMode ? 'bg-[#0b111a] border-white/10 text-slate-200' : 'bg-white border-slate-300 text-slate-900 shadow-sm';
  const drawerBg = isDarkMode ? 'bg-[#0b111a] border-white/10' : 'bg-slate-50 border-slate-200';
  const drawerHeaderBg = isDarkMode ? 'bg-[#111827]' : 'bg-white border-b border-slate-200';

  // ── Status koneksi untuk header badge ──
  const getHeaderStatus = () => {
    switch(videoMode) {
      case 'espcam': return { connected: espCamLoaded, label: espCamLoaded ? 'ESP-CAM Connected' : 'Connecting...' };
      case 'gazebo': return { connected: !gazeboError, label: !gazeboError ? 'Gazebo Connected' : 'Disconnected' };
      case 'laptop': return { connected: !!localStream, label: localStream ? 'Laptop Cam Active' : 'Connecting...' };
      case 'usb': return { connected: !!localStream, label: localStream ? 'USB Cam Active' : 'Connecting...' };
      default: return { connected: false, label: 'Offline' };
    }
  };
  const headerStatus = getHeaderStatus();

  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden min-h-screen pb-10 mt-2">
      <div className="max-w-7xl mx-auto w-full relative">

        {/* =========================================
            HEADER (Merged)
            ========================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-8 gap-4">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Video size={32} className="text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-black tracking-tight uppercase drop-shadow-sm ${titleText}`}>Video Streams</h1>
              <p className={`font-mono text-xs mt-1 tracking-widest uppercase drop-shadow-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                ROV Live Camera • {videoMode.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Status badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${
              headerStatus.connected
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {headerStatus.connected ? <Wifi size={14} /> : <WifiOff size={14} />}
              {headerStatus.label}
            </div>

            {/* Tombol Refresh Global */}
            <button 
              onClick={handleRefresh}
              className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-[#111827]/70 border-white/10 text-slate-400 hover:text-white hover:border-white/30' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
              title="Refresh Sources"
            >
              <RefreshCw size={24} className={`transition-transform duration-500 ${showToast ? 'animate-spin text-blue-500' : 'hover:rotate-180'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ================= LEFT COLUMN ================= */}
          <div className="flex flex-col gap-6">

            {/* ===== VIDEO PLAYER CARD ===== */}
            <div className={`border rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${cardBg}`}>
              
              {/* Viewport kamera */}
              <div className={`relative bg-black group ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}>
                
                {/* Badge LIVE */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse text-white z-10 shadow-lg shadow-red-600/20">
                  <Radio size={12} /> Live
                </div>

                {/* Badge mode sumber */}
                <div className={`absolute top-4 left-20 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono z-10 border ${
                  videoMode === 'espcam' 
                    ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' 
                    : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                }`}>
                  {videoMode === 'espcam' ? '📷 ESP-CAM' : videoMode === 'gazebo' ? '🤖 GAZEBO' : videoMode === 'laptop' ? '💻 LAPTOP' : '🔌 USB'}
                </div>

                {/* Fullscreen button */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute top-4 right-16 z-10 p-2 bg-black/40 backdrop-blur hover:bg-black/70 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  <Maximize2 size={16} />
                </button>

                {/* Local Reconnect / Refresh button */}
                <button
                  onClick={() => {
                    if (videoMode === 'espcam') {
                      setEspCamError(false);
                      setEspCamLoaded(false);
                      setEspCamUrl(prev => prev);
                    } else if (videoMode === 'gazebo') {
                      setGazeboError(false);
                      setWebVideoUrl(prev => prev);
                    } else {
                      setVideoMode(prev => prev);
                    }
                  }}
                  title="Refresh / Reconnect"
                  className="absolute top-4 right-4 z-10 p-2 bg-black/40 backdrop-blur hover:bg-black/70 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  <RefreshCw size={16} />
                </button>

                {/* ===== TAMPILAN VIDEO ===== */}

                {/* MODE: LAPTOP / USB (Webcam) */}
                {(videoMode === 'laptop' || videoMode === 'usb') && (
                  <>
                    {webcamError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                        <AlertCircle size={64} className="text-red-400/40" />
                        <p className="text-white/60 text-sm font-medium">{webcamError}</p>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${videoMode === 'laptop' ? 'scale-x-[-1]' : ''}`} // Mirror jika laptop
                      />
                    )}
                  </>
                )}

                {/* MODE: ESP8266-CAM */}
                {videoMode === 'espcam' && (
                  <>
                    {espCamError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <Camera size={64} className="text-orange-400/40" />
                        <div className="text-center">
                          <p className="text-white/60 text-sm font-medium">ESP8266-CAM tidak dapat dijangkau</p>
                          <p className="text-white/30 text-xs mt-1 font-mono">{espCamUrl}</p>
                        </div>
                        <button
                          onClick={() => { setEspCamError(false); setEspCamLoaded(false); }}
                          className="mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                        >
                          <RefreshCw size={12} /> Coba Lagi
                        </button>
                      </div>
                    ) : (
                      <>
                        {!espCamLoaded && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                            <div className="w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                            <p className="text-white/40 text-sm">Menghubungkan ke ESP-CAM...</p>
                          </div>
                        )}
                        <img
                          key={espCamUrl}
                          src={`${espCamUrl.replace(/\/$/, '')}:81/stream`}
                          className="w-full h-full object-cover"
                          onLoad={() => setEspCamLoaded(true)}
                          onError={() => { setEspCamError(true); setEspCamLoaded(false); }}
                          alt="ESP8266-CAM Live Stream"
                        />
                      </>
                    )}
                  </>
                )}

                {/* MODE: GAZEBO (web_video_server) */}
                {videoMode === 'gazebo' && (
                  <>
                    {gazeboError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                        <AlertCircle size={64} className="text-blue-400/40" />
                        <p className="text-white/60 text-sm font-medium">Gagal mengambil stream dari Gazebo</p>
                        <p className="text-white/40 text-xs font-mono">{webVideoUrl}</p>
                      </div>
                    ) : (
                      <img
                        key={webVideoUrl}
                        src={webVideoUrl}
                        alt="Gazebo Camera"
                        className="w-full h-full object-contain"
                        onError={() => setGazeboError(true)}
                      />
                    )}
                  </>
                )}

                {/* OSD Settings overlay */}
                {isSettingsOpen && (
                  <div className="absolute top-0 right-0 bottom-0 w-64 bg-black/80 backdrop-blur-md border-l border-white/10 p-4 flex flex-col z-20 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                      <span className="font-bold text-white flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Settings</span>
                      <button onClick={() => setIsSettingsOpen(false)} className="text-[10px] uppercase font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-white transition-colors">Tutup</button>
                    </div>
                    <div className="space-y-5 text-sm flex-1">
                      <div className="space-y-2">
                        <label className="text-slate-300 text-xs font-medium">Sumber Kamera</label>
                        <select 
                          value={videoMode}
                          onChange={e => setVideoMode(e.target.value as 'gazebo' | 'espcam' | 'laptop' | 'usb')}
                          className="bg-black/50 border border-white/20 rounded p-1.5 text-xs text-white outline-none w-full"
                        >
                          <option value="espcam">📷 ESP8266-CAM</option>
                          <option value="gazebo">🤖 ROV Camera (Gazebo)</option>
                          <option value="laptop">💻 Webcam Internal</option>
                          <option value="usb">🔌 Webcam USB</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-slate-300 text-xs font-medium">Grid Lines</label>
                        <input type="checkbox" className="w-8 h-4 accent-blue-500 rounded cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info bawah video */}
              <div className={`p-6 flex flex-col gap-4 border-t relative z-0 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-600 text-lg uppercase">
                      {videoMode === 'espcam' ? 'ESP8266-CAM' : videoMode === 'gazebo' ? 'Gazebo Stream' : videoMode === 'laptop' ? 'Laptop Camera' : 'USB Camera'}
                    </h3>
                    <p className={`text-xs font-mono ${mutedText}`}>
                      {videoMode === 'espcam' ? espCamUrl : videoMode === 'gazebo' ? webVideoUrl : 'WebRTC Stream Local'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`p-3 rounded-xl transition-all shadow-lg ${isSettingsOpen ? 'bg-blue-700 shadow-blue-700/20 text-white' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 text-white'}`}
                  >
                    <Settings size={20} />
                  </button>
                </div>

                {/* Tombol-tombol */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeviceControlsOpen(true)}
                    className={`flex-1 border py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm'}`}
                  >
                    <SlidersHorizontal size={14} /> Device Controls
                  </button>
                  <button
                    onClick={() => setShowRosConfig(!showRosConfig)}
                    className={`flex-1 border py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
                      showRosConfig
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm'
                    }`}
                  >
                    <Wifi size={14} /> Stream Config
                  </button>
                </div>

                {/* ===== PANEL KONFIGURASI STREAM ===== */}
                {showRosConfig && (
                  <div className={`border rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#0b111a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    
                    {/* Tab pilihan mode */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {(['gazebo', 'espcam', 'laptop', 'usb'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setVideoMode(mode)}
                          className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                            videoMode === mode
                              ? 'bg-blue-600 text-white'
                              : isDarkMode ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {mode === 'gazebo' ? '🤖 GAZEBO' : mode === 'espcam' ? '📷 ESP-CAM' : mode === 'laptop' ? '💻 LAPTOP' : '🔌 USB'}
                        </button>
                      ))}
                    </div>

                    {/* ── Konfigurasi ESP8266-CAM ── */}
                    {videoMode === 'espcam' && (
                      <div className="space-y-3">
                        <h4 className={`text-xs font-bold uppercase tracking-widest ${mutedText}`}>📷 Konfigurasi ESP8266-CAM</h4>
                        <div className="space-y-2">
                          <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>URL ESP8266-CAM</label>
                          <input
                            type="text"
                            value={espCamUrl}
                            onChange={e => { setEspCamUrl(e.target.value); setEspCamError(false); setEspCamLoaded(false); }}
                            placeholder="http://10.13.65.138"
                            className={`w-full rounded-xl p-3 text-sm font-mono outline-none border transition-all ${inputBg}`}
                          />
                        </div>
                      </div>
                    )}

                    {/* ── Konfigurasi Gazebo (web_video_server) ── */}
                    {videoMode === 'gazebo' && (
                      <div className="space-y-3">
                        <h4 className={`text-xs font-bold uppercase tracking-widest ${mutedText}`}>🔗 Konfigurasi Gazebo</h4>
                        <div className="space-y-2">
                          <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>URL web_video_server</label>
                          <input
                            type="text"
                            value={webVideoUrl}
                            onChange={e => { setWebVideoUrl(e.target.value); setGazeboError(false); }}
                            placeholder="http://localhost:8080/stream?topic=/xr_rov/image"
                            className={`w-full rounded-xl p-3 text-sm font-mono outline-none border transition-all ${inputBg}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>WebSocket URL (Cadangan)</label>
                          <input
                            type="text"
                            value={rosbridgeUrl}
                            onChange={e => setRosbridgeUrl(e.target.value)}
                            className={`w-full rounded-xl p-3 text-sm font-mono outline-none border transition-all ${inputBg}`}
                          />
                        </div>
                      </div>
                    )}

                    {(videoMode === 'laptop' || videoMode === 'usb') && (
                      <div className={`rounded-xl p-3 text-xs space-y-1 ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
                        <p className="font-bold">💡 Info WebRTC:</p>
                        <p>Kamera mengambil video dari device lokal melalui browser. Pastikan izin kamera sudah diberikan.</p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowRosConfig(false)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} /> Terapkan & Tutup
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ===== STREAMING ENDPOINTS CARD ===== */}
            <div className={`border rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-5 ${cardBg}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xs uppercase font-bold tracking-widest ${mutedText}`}>Streaming Endpoints</h2>
                <button
                  onClick={addEndpoint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-bold transition-all shadow shadow-blue-600/20"
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {endpoints.map(ep => (
                <div key={ep.id} className={`flex items-center gap-3 border rounded-2xl px-4 py-3 ${innerCardBg}`}>
                  <select
                    value={ep.type}
                    onChange={e => setEndpoints(endpoints.map(x => x.id === ep.id ? { ...x, type: e.target.value } : x))}
                    className={`text-xs font-bold rounded-lg px-2 py-1.5 border outline-none ${inputBg}`}
                  >
                    <option>UDP</option>
                    <option>TCP</option>
                    <option>RTSP</option>
                    <option>HTTP</option>
                  </select>
                  <input
                    type="text"
                    value={ep.address}
                    onChange={e => setEndpoints(endpoints.map(x => x.id === ep.id ? { ...x, address: e.target.value } : x))}
                    placeholder="udp://192.168.2.1:5600"
                    className={`flex-1 text-xs font-mono rounded-lg px-3 py-1.5 border outline-none ${inputBg}`}
                  />
                  <button
                    onClick={() => removeEndpoint(ep.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT COLUMN (CAMERA SOURCES) ================= */}
          <div className="flex flex-col gap-4">
            <h2 className={`text-xs uppercase font-bold tracking-widest ${mutedText}`}>Camera Sources</h2>
            {cameraSources.map(src => (
              <div
                key={src.id}
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${innerCardBg} ${src.isActive ? 'border-blue-500/30' : ''}`}
                onClick={() => setExpandedSourceId(expandedSourceId === src.id ? null : src.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${src.isActive ? 'bg-blue-500/20' : isDarkMode ? 'bg-white/5' : 'bg-slate-200'}`}>
                    <Camera size={18} className={src.isActive ? 'text-blue-400' : mutedText} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${titleText}`}>{src.name}</p>
                    <p className={`text-xs font-mono truncate ${mutedText}`}>{src.source}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    src.isActive
                      ? 'bg-green-500/15 text-green-400'
                      : isDarkMode ? 'bg-white/5 text-slate-500' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${src.isActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                    {src.status}
                  </div>
                </div>

                {expandedSourceId === src.id && (
                  <div className={`mt-4 pt-4 border-t space-y-2 animate-in slide-in-from-top-1 duration-150 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className={`${mutedText} uppercase tracking-wider text-[10px]`}>Format</p>
                        <p className={`font-mono ${titleText}`}>{src.format}</p>
                      </div>
                      <div>
                        <p className={`${mutedText} uppercase tracking-wider text-[10px]`}>Encoding</p>
                        <p className={`font-mono ${titleText}`}>{src.encoding}</p>
                      </div>
                      <div className="col-span-2">
                        <p className={`${mutedText} uppercase tracking-wider text-[10px]`}>Endpoint</p>
                        <p className={`font-mono truncate ${titleText}`}>{src.endpoint}</p>
                      </div>
                    </div>
                    {/* Tombol Aktifkan */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setVideoMode(src.modeId); }}
                      className={`w-full mt-2 py-2 rounded-xl text-white text-xs font-bold transition-all ${
                        src.modeId === 'gazebo' ? 'bg-blue-600 hover:bg-blue-500' :
                        src.modeId === 'espcam' ? 'bg-orange-600 hover:bg-orange-500' :
                        'bg-teal-600 hover:bg-teal-500'
                      }`}
                    >
                      Gunakan {src.name}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Panduan Setup */}
            <div className={`border rounded-2xl p-5 mt-4 space-y-3 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                <FileText size={14} /> Panduan Cepat
              </h3>
              <div className={`text-xs space-y-2 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <p className="font-bold text-orange-400">Mode ESP8266-CAM:</p>
                <p className="pl-3 border-l border-orange-500/30">1. Nyalakan hotspot HP</p>
                <p className="pl-3 border-l border-orange-500/30">2. Colok ESP8266-CAM → lihat IP di Serial Monitor</p>
                <p className="pl-3 border-l border-orange-500/30">3. Masukkan IP ke Stream Config → klik Terapkan</p>
                <p className="font-bold text-blue-400 mt-2">Mode Gazebo (ROS2):</p>
                <p className="pl-3 border-l border-blue-500/30">Pastikan <code className="bg-black/30 px-1 rounded">ros2 run web_video_server web_video_server</code> berjalan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DRAWER: DEVICE CONTROLS (TIDAK DIHAPUS) ===== */}
        {isDeviceControlsOpen && (
          <div className={`fixed inset-y-0 right-0 w-full max-w-md border-l shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-8 duration-300 ${drawerBg}`}>
            <div className={`p-6 flex justify-between items-center ${drawerHeaderBg}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${titleText}`}>
                <SlidersHorizontal size={20} className="text-blue-500" /> Device Controls
              </h2>
              <button onClick={() => setIsDeviceControlsOpen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className={`border rounded-xl p-4 flex gap-3 text-sm ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                <AlertCircle size={20} className="text-blue-500 shrink-0" />
                <p>Pengaturan ini diterapkan langsung ke hardware kamera (UVC) dan tidak membebani CPU.</p>
              </div>

              {[
                { label: 'Brightness', val: 0, min: -64, max: 64 },
                { label: 'Contrast', val: 32, min: 0, max: 64 },
                { label: 'Saturation', val: 56, min: 0, max: 128 },
                { label: 'Hue', val: 0, min: -40, max: 40 },
                { label: 'Gamma', val: 100, min: 72, max: 500 },
                { label: 'White Balance Temp', val: 4600, min: 2800, max: 6500 },
                { label: 'Sharpness', val: 3, min: 0, max: 6 },
                { label: 'Exposure (Absolute)', val: 156, min: 1, max: 5000 },
              ].map((control, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-xs font-bold tracking-wider ${mutedText}`}>{control.label}</label>
                    <span className={`text-xs font-mono px-2 py-1 rounded font-bold ${isDarkMode ? 'text-slate-200 bg-white/5' : 'text-slate-700 bg-slate-200'}`}>{control.val}</span>
                  </div>
                  <input type="range" defaultValue={control.val} min={control.min} max={control.max} className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-600 ${isDarkMode ? 'bg-white/10' : 'bg-slate-300'}`} />
                </div>
              ))}

              <div className={`pt-4 space-y-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className={`text-sm font-medium ${titleText}`}>White Balance, Auto</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className={`text-sm font-medium ${titleText}`}>Exposure, Auto Priority</span>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                </label>
              </div>
            </div>

            <div className={`p-6 border-t flex gap-4 ${drawerHeaderBg}`}>
              <button onClick={() => setIsDeviceControlsOpen(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>Tutup</button>
              <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-blue-600/30">Restore Defaults</button>
            </div>
          </div>
        )}

        {/* ================= TOAST NOTIFIKASI SUKSES (BAWAH KANAN) ================= */}
        {showToast && (
          <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-8 fade-in duration-300 ${
            isDarkMode ? 'bg-[#111827] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <CheckCircle size={20} className="text-green-500" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Refresh Successful</span>
              <span className={`text-[10px] uppercase tracking-widest ${mutedText}`}>Video sources updated</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VideoStream;