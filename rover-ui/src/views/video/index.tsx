import React, { useState } from 'react';
import { 
  Video, Settings, Radio, Plus, X, ChevronDown, ChevronUp, 
  SlidersHorizontal, Edit2, Trash2, FileText, Camera, AlertCircle,
  RefreshCw, CheckCircle // Tambah CheckCircle
} from 'lucide-react';

interface VideoStreamProps {
  isDarkMode?: boolean;
  onRefresh?: () => void;
}

const VideoStream: React.FC<VideoStreamProps> = ({ isDarkMode = true, onRefresh }) => {
  const [endpoints, setEndpoints] = useState([
    { id: 1, type: 'UDP', address: 'udp://192.168.2.1:5600' }
  ]);
  const [showExtraConfig, setShowExtraConfig] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeviceControlsOpen, setIsDeviceControlsOpen] = useState(false);
  const [expandedSourceId, setExpandedSourceId] = useState<number | null>(null);

  // STATE UNTUK NOTIFIKASI SUKSES (KANAN BAWAH)
  const [showToast, setShowToast] = useState(false);

  // FUNGSI HANDLE REFRESH (NATIVE CONFIRM + CUSTOM TOAST SUKSES)
  const handleRefresh = () => {
    // 1. Munculin konfirmasi bawaan browser dari atas
    const isConfirmed = window.confirm("Apakah Anda yakin ingin me-refresh sumber video?");
    
    // 2. Kalau di-klik "OK"
    if (isConfirmed) {
      if (onRefresh) onRefresh();
      
      // Munculin notifikasi toast di kanan bawah
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
  const toggleSource = (id: number) => {
    setExpandedSourceId(expandedSourceId === id ? null : id);
  };

  const cameraSources = [
    { id: 1, name: "Fake source", source: "ball", format: "960 x 720 px @ 10 fps", encoding: "H264", endpoint: "udp://192.168.2.1:5602", status: "Running", isActive: true, hasPreview: true },
    { id: 2, name: "H264 USB Camera", source: "/dev/video2", format: "1920 x 1080 px @ 30 fps", encoding: "H264", endpoint: "udp://192.168.2.1:5600", status: "Running", isActive: true, hasPreview: true },
    { id: 3, name: "Redirect source", source: "Redirect", format: "-", encoding: "-", endpoint: "-", status: "Stopped", isActive: false, hasPreview: false }
  ];

  // ==========================================
  // LOGIKA WARNA KONTRAS TINGGI
  // ==========================================
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
      <div className="max-w-7xl mx-auto w-full relative">

        {/* =========================================
            HEADER 
            ========================================= */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Video size={32} className="text-white" />
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-black tracking-tight uppercase drop-shadow-sm ${titleText}`}>Video Streams</h1>
              <p className={`font-mono text-xs mt-1 tracking-widest uppercase drop-shadow-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Manage your video devices and video streams
              </p>
            </div>
          </div>

          {/* Tombol Refresh */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="flex flex-col gap-6">
            
            {/* 1. VIDEO PLAYER CARD */}
            <div className={`border rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${cardBg}`}>
              <div className="aspect-video bg-black flex items-center justify-center relative group overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse text-white z-10 shadow-lg shadow-red-600/20">
                  <Radio size={12} /> Live
                </div>
                <Video size={64} className="text-white/20" />

                {/* OVERLAY SETTINGS OSD */}
                {isSettingsOpen && (
                  <div className="absolute top-0 right-0 bottom-0 w-64 bg-black/80 backdrop-blur-md border-l border-white/10 p-4 flex flex-col z-20 animate-in slide-in-from-right-8 duration-300">
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                      <span className="font-bold text-white flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Settings</span>
                      <button onClick={() => setIsSettingsOpen(false)} className="text-[10px] uppercase font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-white transition-colors">Close</button>
                    </div>
                    <div className="space-y-5 text-sm flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <label className="text-slate-300 text-xs font-medium">Camera</label>
                        <select className="bg-black/50 border border-white/20 rounded p-1.5 text-xs text-white outline-none w-full"><option>Fake source</option><option>H264 USB Camera</option></select>
                      </div>
                      <div className="flex justify-between items-center">
                        <label className="text-slate-300 text-xs font-medium">Video Grid Lines</label>
                        <input type="checkbox" className="w-8 h-4 accent-blue-500 rounded cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-6 flex flex-col gap-4 border-t relative z-0 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-blue-600 text-lg">H264 USB Camera</h3>
                    <p className={`text-xs font-mono ${mutedText}`}>/dev/video2 | 1080p 30fps</p>
                  </div>
                  <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-3 rounded-xl transition-all shadow-lg ${isSettingsOpen ? 'bg-blue-700 shadow-blue-700/20 text-white' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 text-white'}`}>
                    <Settings size={20} />
                  </button>
                </div>
                
                {/* TOMBOL DEVICE CONTROLS */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsDeviceControlsOpen(true)}
                    className={`flex-1 border py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm'}`}
                  >
                    <SlidersHorizontal size={16} className="text-blue-500"/> Device Controls
                  </button>
                  <button className={`flex-1 border py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-sm'}`}>
                    <Plus size={16} className="text-blue-500"/> Add Stream
                  </button>
                </div>
              </div>
            </div>

            {/* 2. CAMERA SOURCES LIST */}
            <div className="space-y-3">
              <h2 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 ml-2 mb-4 ${mutedText}`}>
                <Camera size={16} /> Detected Sources
              </h2>
              
              {cameraSources.map((cam) => {
                const isExpanded = expandedSourceId === cam.id;
                return (
                  <div key={cam.id} className={`border rounded-2xl overflow-hidden transition-colors ${innerCardBg}`}>
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer select-none"
                      onClick={() => toggleSource(cam.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cam.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-400'}`}></span>
                        <h3 className={`font-bold text-base ${titleText}`}>{cam.name}</h3>
                        <span className={`text-xs font-mono hidden sm:inline-block ${mutedText}`}>({cam.source})</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {cam.isActive && !isExpanded && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-100 border border-green-200 px-2 py-1 rounded">
                            Running
                          </span>
                        )}
                        <button className={`${mutedText} hover:text-blue-500 transition-colors`}>
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={`p-4 pt-0 border-t flex flex-col sm:flex-row gap-5 animate-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
                        <div className="w-full sm:w-40 aspect-video mt-4 bg-black rounded-lg border border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0">
                          {cam.hasPreview ? (
                            <Video size={32} className="text-white/20" />
                          ) : (
                            <span className="text-[10px] text-slate-500 text-center px-4 uppercase tracking-wider border border-slate-700 border-dashed p-2 rounded">Preview not available</span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between mt-4">
                          <div className="flex justify-between items-start mb-4">
                            <div className="grid grid-cols-1 gap-y-2 text-xs">
                              <div className="flex gap-2"><span className={`w-16 ${mutedText}`}>Format:</span><span className={`font-mono ${titleText}`}>{cam.format}</span></div>
                              <div className="flex gap-2"><span className={`w-16 ${mutedText}`}>Encoding:</span><span className={`font-mono ${titleText}`}>{cam.encoding}</span></div>
                              <div className="flex gap-2"><span className={`w-16 ${mutedText}`}>Endpoint:</span><span className={`font-mono truncate ${titleText}`}>{cam.endpoint}</span></div>
                            </div>
                            
                            <div className="flex gap-2 shrink-0">
                              <button className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"><Edit2 size={14} /></button>
                              <button className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-sm"><Trash2 size={14} /></button>
                              <button className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold shadow-sm ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}><FileText size={12}/> SDP</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className={`border rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl sticky top-28 ${cardBg}`}>
            <div className="space-y-5">
              <h3 className={`font-bold text-xl flex items-center gap-3 mb-6 ${titleText}`}>
                <Settings size={24} className="text-blue-500" /> Stream creation
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>Stream nickname</label>
                  <div className="relative">
                    <input type="text" defaultValue="Stream ball" className={`w-full rounded-xl p-3 text-sm outline-none transition-all ${inputBg}`} />
                    <span className={`absolute right-3 top-3.5 text-[10px] ${mutedText}`}>11 / 100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>Encoding</label>
                  <select className={`w-full rounded-xl p-3 text-sm outline-none appearance-none transition-all ${inputBg}`}>
                    <option>H264</option><option>MJPG</option><option>YUYV</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>Size & Framerate</label>
                  <select className={`w-full rounded-xl p-3 text-sm outline-none appearance-none mb-2 transition-all ${inputBg}`}>
                    <option>1920 x 1080</option><option>1280 x 720</option>
                  </select>
                  <select className={`w-full rounded-xl p-3 text-sm outline-none appearance-none transition-all ${inputBg}`}>
                    <option>30 FPS</option><option>60 FPS</option>
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  {endpoints.map((ep, index) => (
                    <div key={ep.id} className="flex gap-3 items-end">
                      <div className="w-1/3 space-y-2">
                        {index === 0 && <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>Type</label>}
                        <select className={`w-full rounded-xl p-3 text-sm outline-none appearance-none transition-all ${inputBg}`}><option value="UDP">UDP</option><option value="RTSP">RTSP</option></select>
                      </div>
                      <div className="flex-1 space-y-2">
                        {index === 0 && <label className={`text-[10px] uppercase font-bold tracking-widest ${mutedText}`}>Endpoint</label>}
                        <div className="flex items-center gap-2">
                          <input type="text" defaultValue={ep.address} className={`w-full rounded-xl p-3 text-sm font-mono outline-none transition-all ${inputBg}`} />
                          <button onClick={() => removeEndpoint(ep.id)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-red-100 text-slate-500 hover:text-red-600'}`}><X size={20} /></button>
                          {index === endpoints.length - 1 && <button onClick={addEndpoint} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-blue-500/20 text-blue-500' : 'hover:bg-blue-100 text-blue-600'}`}><Plus size={20} /></button>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`border rounded-xl overflow-hidden mt-4 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <button onClick={() => setShowExtraConfig(!showExtraConfig)} className={`w-full p-4 flex justify-between items-center transition-colors text-sm font-bold ${titleText} ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'}`}>
                    Extra configuration {showExtraConfig ? <ChevronUp size={18} className={mutedText}/> : <ChevronDown size={18} className={mutedText}/>}
                  </button>
                  {showExtraConfig && (
                    <div className={`p-4 space-y-4 ${isDarkMode ? 'bg-[#0b111a]' : 'bg-white'}`}>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-blue-600" /><span className={`text-sm font-medium ${titleText}`}>Thermal camera</span></label>
                      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-blue-600" /><span className={`text-sm font-medium ${titleText}`}>Disable Mavlink</span></label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex gap-4 mt-8 pt-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <button className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700 shadow-sm'}`}>Cancel</button>
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all shadow-lg shadow-blue-600/30">Create</button>
            </div>
          </div>
        </div>

        {/* ================= MODAL DRAWER: DEVICE CONTROLS ================= */}
        {isDeviceControlsOpen && (
          <div className={`fixed inset-y-0 right-0 w-full max-w-md border-l shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-8 duration-300 ${drawerBg}`}>
            
            <div className={`p-6 flex justify-between items-center ${drawerHeaderBg}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${titleText}`}>
                <SlidersHorizontal size={20} className="text-blue-500"/> Device Controls
              </h2>
              <button onClick={() => setIsDeviceControlsOpen(false)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className={`border rounded-xl p-4 flex gap-3 text-sm mb-4 shadow-sm ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                <AlertCircle size={20} className="text-blue-500 shrink-0" />
                <p>These settings are applied directly to the camera hardware (UVC) and do not consume CPU resources.</p>
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
              <button onClick={() => setIsDeviceControlsOpen(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}>Close</button>
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