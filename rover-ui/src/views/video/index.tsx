import React from 'react';
import { Video, Settings, Play, Radio, MonitorPlay } from 'lucide-react';

const VideoStream = () => {
  return (
    <div className="animate-in fade-in duration-500">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111827]/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="aspect-video bg-black flex items-center justify-center relative group">
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase animate-pulse text-white">
              <Radio size={12} /> Live
            </div>
            <Video size={64} className="text-white/10" />
          </div>
          <div className="p-6 flex justify-between items-center border-t border-white/10 bg-white/5">
            <div><h3 className="font-bold text-blue-400 text-lg">Primary Forward Cam</h3><p className="text-xs text-slate-500 font-mono">/dev/video0 | 1080p 30fps</p></div>
            <button className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20"><Settings size={20} className="text-white" /></button>
          </div>
        </div>

        <div className="bg-[#111827]/50 border border-white/10 rounded-3xl p-8 flex flex-col justify-between backdrop-blur-sm">
          <div className="space-y-6 text-white">
            <h3 className="font-bold text-xl flex items-center gap-3"><Settings size={24} className="text-blue-400" /> Stream Setup</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Resolution</label>
                <select className="w-full bg-[#0b111a] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 outline-none">
                  <option>1920 x 1080 (Full HD)</option><option>1280 x 720 (HD)</option>
                </select>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-white uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-900/40">
            Restart Video Stream
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoStream;