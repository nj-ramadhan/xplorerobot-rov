import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Video, Settings, Radio, Plus, X, ChevronDown, ChevronUp, 
  SlidersHorizontal, Edit2, Trash2, FileText, Camera, AlertCircle,
  Wifi, WifiOff, RefreshCw, Maximize2
} from 'lucide-react';

// ============================================================
// TIPE DATA
// ============================================================
interface VideoStreamProps {
  isDarkMode?: boolean;
}

interface RosMessage {
  data: string; // base64 encoded image data
  format?: string;
}

// ============================================================
// HOOK: Koneksi ke ROS2 via Rosbridge WebSocket
// ============================================================
function useRosBridge(wsUrl: string, imageTopic: string) {
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
    if (!mountedRef.current) return;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsConnected(true);
        setError(null);

        // Subscribe ke topic /xr_rov/image (sensor_msgs/CompressedImage)
        // Rosbridge protocol: subscribe message
        const subscribeMsg = {
          op: 'subscribe',
          topic: imageTopic,
          type: 'sensor_msgs/CompressedImage',
          throttle_rate: 100,    // minimal 100ms antar frame (~10fps max dari rosbridge)
          queue_length: 1,        // hanya ambil frame terbaru
          compression: 'none',
        };
        ws.send(JSON.stringify(subscribeMsg));

        // FPS counter
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
          // msg.msg.data adalah base64 dari image bytes
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
        // Auto-reconnect setelah 3 detik
        reconnectTimerRef.current = setTimeout(() => {
          if (mountedRef.current) connect();
        }, 3000);
      };
    } catch (err) {
      setError('URL WebSocket tidak valid');
    }
  }, [wsUrl, imageTopic]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (wsRef.current) wsRef.current.close();
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [connect]);

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
const VideoStream: React.FC<VideoStreamProps> = ({ isDarkMode = true }) => {
  // -- State: Konfigurasi koneksi ROS --
  // Sesuaikan dengan IP komputer yang menjalankan ROS2 Anda
  const [rosbridgeUrl, setRosbridgeUrl] = useState('ws://localhost:9090');
  // Gunakan /xr_rov/image/compressed jika ada, atau /xr_rov/image
  // Untuk CompressedImage langsung dari topic /xr_rov/image, tipe harus sensor_msgs/CompressedImage
  // Jika topic Anda sensor_msgs/Image (raw), perlu web_video_server (lihat catatan di bawah)
  const [imageTopic, setImageTopic] = useState('/xr_rov/image/compressed');
  const [useWebVideoServer, setUseWebVideoServer] = useState(false);
  const [webVideoUrl, setWebVideoUrl] = useState('http://localhost:8080/stream?topic=/xr_rov/image');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [endpoints, setEndpoints] = useState([
    { id: 1, type: 'UDP', address: 'udp://192.168.2.1:5600' }
  ]);
  const [showExtraConfig, setShowExtraConfig] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeviceControlsOpen, setIsDeviceControlsOpen] = useState(false);
  const [expandedSourceId, setExpandedSourceId] = useState<number | null>(null);
  const [showRosConfig, setShowRosConfig] = useState(false);

  // -- Hook koneksi rosbridge --
  const { isConnected, imageSrc, fps, error, reconnect } = useRosBridge(
    rosbridgeUrl,
    imageTopic
  );

  const addEndpoint = () => {
    const newId = endpoints.length ? endpoints[endpoints.length - 1].id + 1 : 1;
    setEndpoints([...endpoints, { id: newId, type: 'UDP', address: '' }]);
  };
  const removeEndpoint = (id: number) => {
    setEndpoints(endpoints.filter(ep => ep.id !== id));
  };

  const cameraSources = [
    { id: 1, name: "ROV Camera (ROS2)", source: "/xr_rov/image", format: "Live via Rosbridge", encoding: "JPEG", endpoint: rosbridgeUrl, status: isConnected ? "Running" : "Connecting...", isActive: isConnected },
    { id: 2, name: "H264 USB Camera", source: "/dev/video2", format: "1920 x 1080 px @ 30 fps", encoding: "H264", endpoint: "udp://192.168.2.1:5600", status: "Stopped", isActive: false },
  ];

  // -- Warna tema --
  const titleText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const mutedText = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-[#111827]/60 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const innerCardBg = isDarkMode ? 'bg-[#111827]/60 border-white/10 hover:bg-[#111827]/80' : 'bg-slate-50 border-slate-200 hover:bg-slate-100';
  const inputBg = isDarkMode ? 'bg-[#0b111a] border-white/10 text-slate-200' : 'bg-white border-slate-300 text-slate-900 shadow-sm';
  const drawerBg = isDarkMode ? 'bg-[#0b111a] border-white/10' : 'bg-slate-50 border-slate-200';
  const drawerHeaderBg = isDarkMode ? 'bg-[#111827]' : 'bg-white border-b border-slate-200';

  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden min-h-screen pb-10 mt-2">
      <div className="max-w-7xl mx-auto w-full">

        {/* HEADER */}
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Video size={32} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight uppercase drop-shadow-sm ${titleText}`}>Video Streams</h1>
            <p className={`font-mono text-xs mt-1 tracking-widest uppercase drop-shadow-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              ROV Live Camera • ROS2 Rosbridge
            </p>
          </div>
          {/* Status koneksi */}
          <div className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border ${
            isConnected 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {isConnected ? 'ROS2 Connected' : 'Disconnected'}
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

                {/* FPS Badge */}
                {isConnected && (
                  <div className="absolute top-4 left-20 flex items-center gap-1 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono text-green-400 z-10 border border-green-500/20">
                    {fps} fps
                  </div>
                )}

                {/* Fullscreen button */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute top-4 right-16 z-10 p-2 bg-black/40 backdrop-blur hover:bg-black/70 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  <Maximize2 size={16} />
                </button>

                {/* Reconnect button */}
                <button
                  onClick={reconnect}
                  title="Reconnect ke ROS2"
                  className="absolute top-4 right-4 z-10 p-2 bg-black/40 backdrop-blur hover:bg-black/70 rounded-lg text-white/70 hover:text-white transition-all"
                >
                  <RefreshCw size={16} />
                </button>

                {/* ===== GAMBAR KAMERA ROV ===== */}
                {useWebVideoServer ? (
                  // Mode: web_video_server (untuk raw sensor_msgs/Image)
                  <img
                    src={webVideoUrl}
                    alt="ROV Camera"
                    className="w-full h-full object-contain"
                    onError={() => {}} 
                  />
                ) : imageSrc ? (
                  // Mode: rosbridge CompressedImage (base64)
                  <img
                    src={imageSrc}
                    alt="ROV Camera Live"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // Placeholder saat belum ada gambar
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Camera size={64} className="text-white/20" />
                    <div className="text-center">
                      <p className="text-white/40 text-sm font-medium">
                        {error ?? (isConnected ? 'Menunggu frame dari /xr_rov/image...' : 'Menghubungkan ke ROS2...')}
                      </p>
                      {!isConnected && (
                        <p className="text-white/25 text-xs mt-1 font-mono">{rosbridgeUrl}</p>
                      )}
                    </div>
                    {error && (
                      <button
                        onClick={reconnect}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
                      >
                        <RefreshCw size={12} /> Coba Lagi
                      </button>
                    )}
                  </div>
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
                        <select className="bg-black/50 border border-white/20 rounded p-1.5 text-xs text-white outline-none w-full">
                          <option>ROV Camera (ROS2)</option>
                          <option>H264 USB Camera</option>
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
                    <h3 className="font-bold text-blue-600 text-lg">ROV Camera</h3>
                    <p className={`text-xs font-mono ${mutedText}`}>
                      {imageTopic} | {isConnected ? `${fps} fps` : 'Offline'}
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
                    <Wifi size={14} /> ROS Config
                  </button>
                </div>

                {/* ===== PANEL KONFIGURASI ROS2 ===== */}
                {showRosConfig && (
                  <div className={`border rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-[#0b111a] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className={`text-xs font-bold uppercase tracking-widest ${mutedText}`}>🔗 Konfigurasi ROS2 Rosbridge</h4>

                    <div className="space-y-2">
                      <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>WebSocket URL Rosbridge</label>
                      <input
                        type="text"
                        value={rosbridgeUrl}
                        onChange={e => setRosbridgeUrl(e.target.value)}
                        placeholder="ws://localhost:9090"
                        className={`w-full rounded-xl p-3 text-sm font-mono outline-none border transition-all ${inputBg}`}
                      />
                      <p className={`text-[10px] ${mutedText}`}>
                        Jalankan: <code className="bg-black/30 px-1 rounded">ros2 launch rosbridge_server rosbridge_websocket_launch.xml</code>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>Topic Gambar ROS2</label>
                      <input
                        type="text"
                        value={imageTopic}
                        onChange={e => setImageTopic(e.target.value)}
                        placeholder="/xr_rov/image/compressed"
                        className={`w-full rounded-xl p-3 text-sm font-mono outline-none border transition-all ${inputBg}`}
                      />
                      <p className={`text-[10px] ${mutedText}`}>
                        Gunakan <code className="bg-black/30 px-1 rounded">/xr_rov/image/compressed</code> (sensor_msgs/CompressedImage) untuk efisiensi. Jika hanya ada <code className="bg-black/30 px-1 rounded">/xr_rov/image</code> (raw), aktifkan mode web_video_server di bawah.
                      </p>
                    </div>

                    {/* Mode web_video_server */}
                    <div className={`border rounded-xl p-4 space-y-3 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useWebVideoServer}
                          onChange={e => setUseWebVideoServer(e.target.checked)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className={`text-sm font-medium ${titleText}`}>
                          Gunakan web_video_server (untuk raw Image)
                        </span>
                      </label>
                      {useWebVideoServer && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={webVideoUrl}
                            onChange={e => setWebVideoUrl(e.target.value)}
                            placeholder="http://localhost:8080/stream?topic=/xr_rov/image"
                            className={`w-full rounded-xl p-3 text-sm font-mono outline-none border transition-all ${inputBg}`}
                          />
                          <p className={`text-[10px] ${mutedText}`}>
                            Install: <code className="bg-black/30 px-1 rounded">sudo apt install ros-humble-web-video-server</code><br/>
                            Jalankan: <code className="bg-black/30 px-1 rounded">ros2 run web_video_server web_video_server</code>
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={reconnect}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} /> Terapkan & Reconnect
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Cancel/Create */}
            <div className={`flex gap-4 mt-2 pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <button className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm'}`}>Cancel</button>
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-600/30">Save Config</button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Camera Sources ================= */}
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
                <p className="font-bold text-blue-400">Terminal 1 – Simulasi ROV:</p>
                <p className="pl-3 border-l border-blue-500/30">ros2 launch xr_rov_description world_launch.py spawn:=True</p>
                <p className="font-bold text-blue-400 mt-2">Terminal 2 – Kontroler:</p>
                <p className="pl-3 border-l border-blue-500/30">ros2 launch xr_rov_control cascaded_pids_launch.py sliders:=false</p>
                <p className="font-bold text-blue-400 mt-2">Terminal 3 – WebSocket:</p>
                <p className="pl-3 border-l border-blue-500/30">ros2 launch rosbridge_server rosbridge_websocket_launch.xml</p>
                <p className="font-bold text-green-400 mt-2">Opsional – Jika topic raw Image:</p>
                <p className="pl-3 border-l border-green-500/30">ros2 run web_video_server web_video_server</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== DRAWER: DEVICE CONTROLS ===== */}
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

      </div>
    </div>
  );
};

export default VideoStream;