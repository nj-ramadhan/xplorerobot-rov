import React, { useState } from 'react';
import { 
  Video, Settings, Radio, Plus, X, ChevronDown, ChevronUp, 
  SlidersHorizontal, Edit2, Trash2, FileText, Camera, AlertCircle 
} from 'lucide-react';

const VideoStream = () => {
  // State untuk Stream Creation
  const [endpoints, setEndpoints] = useState([
    { id: 1, type: 'UDP', address: 'udp://192.168.2.1:5600' }
  ]);
  const [showExtraConfig, setShowExtraConfig] = useState(false);
  
  // State untuk Panel & Pengaturan
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeviceControlsOpen, setIsDeviceControlsOpen] = useState(false);

  // State BARU: Untuk melacak kamera mana yang sedang "terbuka" (Accordion)
  // Default null agar awalnya terlipat semua.
  const [expandedSourceId, setExpandedSourceId] = useState<number | null>(null);

  // Fungsi bawaan
  const addEndpoint = () => {
    const newId = endpoints.length ? endpoints[endpoints.length - 1].id + 1 : 1;
    setEndpoints([...endpoints, { id: newId, type: 'UDP', address: '' }]);
  };
  const removeEndpoint = (id: number) => {
    setEndpoints(endpoints.filter(ep => ep.id !== id));
  };

  // Fungsi untuk buka-tutup list kamera
  const toggleSource = (id: number) => {
    setExpandedSourceId(expandedSourceId === id ? null : id);
  };

  // Data Dummy untuk Daftar Kamera
  const cameraSources = [
    {
      id: 1,
      name: "Fake source",
      source: "ball",
      format: "960 x 720 px @ 10 fps",
      encoding: "H264",
      endpoint: "udp://192.168.2.1:5602",
      status: "Running",
      isActive: true,
      hasPreview: true
    },
    {
      id: 2,
      name: "H264 USB Camera",
      source: "/dev/video2",
      format: "1920 x 1080 px @ 30 fps",
      encoding: "H264",
      endpoint: "udp://192.168.2.1:5600",
      status: "Running",
      isActive: true,
      hasPreview: true
    },
    {
      id: 3,
      name: "Redirect source",
      source: "Redirect",
      format: "-",
      encoding: "-",
      endpoint: "-",
      status: "Stopped",
      isActive: false,
      hasPreview: false
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden min-h-screen pb-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-5 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Video size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Video Streams</h1>
          <p className="text-slate-500 font-mono text-sm mt-1 tracking-widest uppercase">
            Manage your video devices and video streams
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col gap-6">
          
          {/* 1. VIDEO PLAYER CARD */}
          <div className="bg-[#111827]/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm relative">
            
            <div className="aspect-video bg-black flex items-center justify-center relative group overflow-hidden">
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse text-white z-10">
                <Radio size={12} /> Live
              </div>
              <Video size={64} className="text-white/10" />

              {/* OVERLAY SETTINGS OSD */}
              {isSettingsOpen && (
                <div className="absolute top-0 right-0 bottom-0 w-64 bg-[#111827]/95 backdrop-blur-md border-l border-white/10 p-4 flex flex-col z-20 animate-in slide-in-from-right-8 duration-300">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                    <span className="font-bold text-slate-200 flex items-center gap-2"><Settings size={16} className="text-blue-400" /> Settings</span>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-[10px] uppercase font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-slate-300 transition-colors">Close</button>
                  </div>
                  <div className="space-y-5 text-sm flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <label className="text-slate-400 text-xs font-medium">Camera</label>
                      <select className="bg-[#0b111a] border border-white/10 rounded p-1.5 text-xs text-slate-200 outline-none w-full"><option>Fake source</option><option>H264 USB Camera</option></select>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-slate-400 text-xs font-medium">Video Grid Lines</label>
                      <input type="checkbox" className="w-8 h-4 accent-blue-500 rounded cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-4 border-t border-white/10 bg-white/5 relative z-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-blue-400 text-lg">H264 USB Camera</h3>
                  <p className="text-xs text-slate-500 font-mono">/dev/video2 | 1080p 30fps</p>
                </div>
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-3 rounded-xl transition-all shadow-lg ${isSettingsOpen ? 'bg-blue-700 shadow-blue-700/20 text-white' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 text-white'}`}>
                  <Settings size={20} />
                </button>
              </div>
              
              {/* TOMBOL DEVICE CONTROLS */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeviceControlsOpen(true)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal size={16} className="text-blue-400"/> Device Controls
                </button>
                <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-3 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                  <Plus size={16} className="text-blue-400"/> Add Stream
                </button>
              </div>
            </div>
          </div>

          {/* 2. CAMERA SOURCES LIST (SEKARANG BISA DIBUKA-TUTUP) */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2 mb-4">
              <Camera size={16} /> Detected Sources
            </h2>
            
            {cameraSources.map((cam) => {
              const isExpanded = expandedSourceId === cam.id;
              
              return (
                <div key={cam.id} className="bg-[#111827]/60 border border-white/10 rounded-2xl overflow-hidden hover:bg-[#111827]/80 transition-colors">
                  
                  {/* BARIS JUDUL (Selalu Terlihat, Klik untuk buka) */}
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer select-none"
                    onClick={() => toggleSource(cam.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cam.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`}></span>
                      <h3 className="font-bold text-slate-200 text-base">{cam.name}</h3>
                      <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">({cam.source})</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Kalau ditekuk, tampilin status singkatnya aja */}
                      {cam.isActive && !isExpanded && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-green-500 bg-green-500/10 px-2 py-1 rounded">
                          Running
                        </span>
                      )}
                      <button className="text-slate-400 hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* AREA DETAIL (Hanya terlihat kalau diklik) */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-white/5 mt-1 flex flex-col sm:flex-row gap-5 animate-in slide-in-from-top-2 duration-300">
                      
                      {/* Thumbnail Area */}
                      <div className="w-full sm:w-40 aspect-video mt-4 bg-black rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0">
                        {cam.hasPreview ? (
                          <Video size={32} className="text-white/20" />
                        ) : (
                          <span className="text-[10px] text-slate-600 text-center px-4 uppercase tracking-wider border border-slate-700 border-dashed p-2 rounded">Preview not available</span>
                        )}
                      </div>

                      {/* Info & Tombol Area */}
                      <div className="flex-1 flex flex-col justify-between mt-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="grid grid-cols-1 gap-y-2 text-xs">
                            <div className="flex gap-2"><span className="text-slate-500 w-16">Format:</span><span className="text-slate-300 font-mono">{cam.format}</span></div>
                            <div className="flex gap-2"><span className="text-slate-500 w-16">Encoding:</span><span className="text-slate-300 font-mono">{cam.encoding}</span></div>
                            <div className="flex gap-2"><span className="text-slate-500 w-16">Endpoint:</span><span className="text-slate-300 font-mono truncate">{cam.endpoint}</span></div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 shrink-0">
                            <button className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"><Edit2 size={14} /></button>
                            <button className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 size={14} /></button>
                            <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"><FileText size={12}/> SDP</button>
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
        {/* STREAM SETUP CARD (TETAP SAMA SEPERTI SEBELUMNYA) */}
        <div className="bg-[#111827]/50 border border-white/10 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm sticky top-8">
          <div className="space-y-5 text-white">
            <h3 className="font-bold text-xl flex items-center gap-3 mb-6">
              <Settings size={24} className="text-blue-400" /> Stream creation
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Stream nickname</label>
                <div className="relative">
                  <input type="text" defaultValue="Stream ball" className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-slate-200" />
                  <span className="absolute right-3 top-3.5 text-[10px] text-slate-500">11 / 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Encoding</label>
                <select className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-slate-200 appearance-none">
                  <option>H264</option><option>MJPG</option><option>YUYV</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Size & Framerate</label>
                <select className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-slate-200 appearance-none mb-2">
                  <option>1920 x 1080</option><option>1280 x 720</option>
                </select>
                <select className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-slate-200 appearance-none">
                  <option>30 FPS</option><option>60 FPS</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                {endpoints.map((ep, index) => (
                  <div key={ep.id} className="flex gap-3 items-end">
                    <div className="w-1/3 space-y-2">
                      {index === 0 && <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Type</label>}
                      <select className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-slate-200 appearance-none"><option value="UDP">UDP</option><option value="RTSP">RTSP</option></select>
                    </div>
                    <div className="flex-1 space-y-2">
                      {index === 0 && <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Endpoint</label>}
                      <div className="flex items-center gap-2">
                        <input type="text" defaultValue={ep.address} className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none text-slate-200 font-mono" />
                        <button onClick={() => removeEndpoint(ep.id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
                        {index === endpoints.length - 1 && <button onClick={addEndpoint} className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-500 transition-colors"><Plus size={20} /></button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden mt-4">
                <button onClick={() => setShowExtraConfig(!showExtraConfig)} className="w-full p-4 bg-white/5 flex justify-between items-center hover:bg-white/10 transition-colors text-sm font-medium">
                  Extra configuration {showExtraConfig ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                </button>
                {showExtraConfig && (
                  <div className="p-4 bg-[#0b111a] space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-blue-500" /><span className="text-sm text-slate-300">Thermal camera</span></label>
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-blue-500" /><span className="text-sm text-slate-300">Disable Mavlink</span></label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
            <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-slate-300 uppercase tracking-widest text-sm transition-all">Cancel</button>
            <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-900/40">Create</button>
          </div>
        </div>

      </div>

      {/* ================= MODAL DRAWER: DEVICE CONTROLS ================= */}
      {isDeviceControlsOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0b111a] border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-8 duration-300">
          
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111827]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-blue-400"/> Device Controls
            </h2>
            <button onClick={() => setIsDeviceControlsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 text-sm text-blue-200 mb-4">
              <AlertCircle size={20} className="text-blue-400 shrink-0" />
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
                  <label className="text-xs font-bold text-slate-400 tracking-wider">{control.label}</label>
                  <span className="text-xs font-mono text-slate-200 bg-white/5 px-2 py-1 rounded">{control.val}</span>
                </div>
                <input type="range" defaultValue={control.val} min={control.min} max={control.max} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
            ))}

            <div className="pt-4 space-y-4 border-t border-white/10">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-300">White Balance, Auto</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-500 rounded bg-white/10 border-white/20" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-300">Exposure, Auto Priority</span>
                <input type="checkbox" className="w-5 h-5 accent-blue-500 rounded bg-white/10 border-white/20" />
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-white/10 bg-[#111827] flex gap-4">
            <button onClick={() => setIsDeviceControlsOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-slate-300 text-sm transition-all">Close</button>
            <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-blue-900/40">Restore Defaults</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default VideoStream;