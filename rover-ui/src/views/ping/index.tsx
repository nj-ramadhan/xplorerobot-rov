import React, { useState } from 'react';
import { Radio, Eye, Settings2, Info, Link as LinkIcon, Activity } from 'lucide-react';

const PingSonarView = () => {
  const [mavlinkEnabled, setMavlinkEnabled] = useState(true);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Style Gazebo Simulation */}
      <div className="flex items-center gap-5 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Radio size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Ping Sonar Devices</h1>
          <p className="text-slate-500 font-mono text-sm mt-1 tracking-widest uppercase">
            Manage detected Ping family sonar devices
          </p>
        </div>
      </div>

      {/* Info Section - Dibuat lebih transparan agar menyatu */}
      <div className="bg-[#111827]/40 border border-white/5 rounded-2xl p-6 mb-10 backdrop-blur-md max-w-5xl">
        <div className="flex gap-4">
          <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
            <Info className="text-blue-400" size={20} />
          </div>
          <div className="space-y-3">
            <p className="text-slate-300 text-sm leading-relaxed">
              The Ping Sonar Devices page shows any detected sonars from the Ping family, 
              including ethernet-configured Ping360s visible on the local network.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <span>Based On: <span className="text-blue-400 underline cursor-pointer">Ping Service</span></span>
              <span>|</span>
              <span>Port: 9110</span>
              <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold">New in 1.1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Container Tanpa Kotak Biru Besar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        {/* Card Ping1D - Dark Version */}
        <div className="bg-[#111827]/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-blue-500/50 transition-all duration-300 group">
          <div className="p-8 flex flex-col items-center border-b border-white/5 bg-white/5">
             <div className="p-4 bg-blue-600/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Radio className="text-blue-500 w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Ping1D</h2>
             <span className="text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full mt-2 animate-pulse">Connected</span>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              <span>Bridge</span> <span className="font-mono text-blue-400">UDP 9090</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">MAVLink Distances</span>
              <button 
                onClick={() => setMavlinkEnabled(!mavlinkEnabled)} 
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${mavlinkEnabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${mavlinkEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">FW Version</p>
                <p className="text-white font-mono font-bold">3.29.0</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Device ID</p>
                <p className="text-white font-mono font-bold">1</p>
              </div>
            </div>

            <div className="flex justify-between items-center bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
              <div className="flex flex-col">
                <span className="text-[9px] text-blue-400 uppercase font-black tracking-tighter">System Port</span>
                <span className="font-mono text-white text-xs font-bold">/dev/ttyUSB0</span>
              </div>
              <Eye className="text-slate-500 group-hover:text-blue-400 w-5 h-5 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Card Ping360 - Dark Version */}
        <div className="bg-[#111827]/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-blue-500/50 transition-all duration-300 group">
          <div className="p-8 flex flex-col items-center border-b border-white/5 bg-white/5">
             <div className="p-4 bg-blue-600/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Settings2 className="text-blue-500 w-10 h-10 rotate-90" />
             </div>
             <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Ping360</h2>
             <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-full mt-2 italic">Scanning...</span>
          </div>
          <div className="p-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Network Interface</p>
            <div className="bg-blue-600/10 text-blue-400 font-mono text-sm p-4 rounded-2xl border border-blue-500/20 flex justify-between items-center">
              <span>192.168.2.4:12345</span>
              <Activity size={14} className="animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PingSonarView;