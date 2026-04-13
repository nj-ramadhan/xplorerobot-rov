import React, { useState } from 'react';
import { Radio, Eye, Settings2, Info, Activity } from 'lucide-react';

interface PingSonarProps {
  isDarkMode?: boolean;
}

const PingSonarView: React.FC<PingSonarProps> = ({ isDarkMode = true }) => {
  const [mavlinkEnabled, setMavlinkEnabled] = useState(true);

  // KUNCI KONTRAS TINGGI:
  // Di Light mode, teks harus hitam pekat (slate-900) dan background harus putih solid (bg-white)
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-slate-300' : 'text-slate-700'; // Dipergelap untuk Light Mode
  const accentTextColor = isDarkMode ? 'text-blue-400' : 'text-blue-800'; // Biru yang lebih tua agar kontras
  
  const cardBg = isDarkMode ? 'bg-[#111827]/60 border-white/10' : 'bg-white border-slate-300 shadow-xl';
  const infoBg = isDarkMode ? 'bg-[#111827]/40 border-white/5' : 'bg-white border-blue-200 shadow-md'; // Paksa putih solid
  const innerBoxBg = isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-300';
  
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600'; // Label dipergelap
  const valueColor = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2">
      <div className="max-w-6xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Radio size={32} className="text-white" />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight uppercase ${titleColor}`}>
              Ping Sonar Devices
            </h1>
            <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold ${accentTextColor}`}>
              Manage detected Ping family sonar devices
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className={`border rounded-2xl p-6 mb-10 w-full ${infoBg}`}>
          <div className="flex gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg h-fit border border-blue-500/20">
              <Info className="text-blue-600" size={20} />
            </div>
            <div className="space-y-3">
              <p className={`text-sm leading-relaxed font-semibold ${subTextColor}`}>
                The Ping Sonar Devices page shows any detected sonars from the Ping family,
                including ethernet-configured Ping360s visible on the local network.
              </p>
              <div className={`flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider font-bold ${labelColor}`}>
                <span>Based On: <span className="text-blue-600 underline cursor-pointer font-black">Ping Service</span></span>
                <span>|</span>
                <span>Port: 9110</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-300 font-black">New in 1.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">

          {/* Card Ping1D */}
          <div className={`border rounded-3xl overflow-hidden transition-all duration-300 group ${cardBg}`}>
            <div className={`p-8 flex flex-col items-center border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
               <div className="p-4 bg-blue-600/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Radio className="text-blue-600 w-10 h-10" />
               </div>
               <h2 className={`text-2xl font-black tracking-tighter uppercase ${titleColor}`}>Ping1D</h2>
               <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full mt-2 animate-pulse">Connected</span>
            </div>

            <div className="p-6 space-y-4">
              <div className={`flex justify-between items-center text-[11px] font-bold tracking-widest uppercase ${labelColor}`}>
                <span>Bridge</span> <span className="font-mono text-blue-700">UDP 9090</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className={`text-[11px] font-bold tracking-widest uppercase ${labelColor}`}>MAVLink Distances</span>
                <button
                  onClick={() => setMavlinkEnabled(!mavlinkEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${mavlinkEnabled ? 'bg-blue-600 shadow-md' : 'bg-slate-400'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${mavlinkEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className={`p-3 rounded-xl border ${innerBoxBg}`}>
                  <p className={`text-[9px] uppercase font-bold mb-1 ${labelColor}`}>FW Version</p>
                  <p className={`font-mono font-bold ${valueColor}`}>3.29.0</p>
                </div>
                <div className={`p-3 rounded-xl border ${innerBoxBg}`}>
                  <p className={`text-[9px] uppercase font-bold mb-1 ${labelColor}`}>Device ID</p>
                  <p className={`font-mono font-bold ${valueColor}`}>1</p>
                </div>
              </div>

              <div className={`flex justify-between items-center p-4 rounded-2xl border transition-colors ${
                isDarkMode ? 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}>
                <div className="flex flex-col">
                  <span className="text-[9px] text-blue-700 uppercase font-black tracking-tighter">System Port</span>
                  <span className={`font-mono text-xs font-bold ${valueColor}`}>/dev/ttyUSB0</span>
                </div>
                <Eye className="text-blue-500 hover:text-blue-700 w-5 h-5 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          {/* Card Ping360 */}
          <div className={`border rounded-3xl overflow-hidden transition-all duration-300 group ${cardBg}`}>
            <div className={`p-8 flex flex-col items-center border-b ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
               <div className="p-4 bg-blue-600/10 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Settings2 className="text-blue-600 w-10 h-10 rotate-90" />
               </div>
               <h2 className={`text-2xl font-black tracking-tighter uppercase ${titleColor}`}>Ping360</h2>
               <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full mt-2 italic border ${
                 isDarkMode ? 'text-slate-400 bg-white/5 border-white/10' : 'text-slate-700 bg-slate-200 border-slate-400'
               }`}>Scanning...</span>
            </div>
            <div className="p-6">
              <p className={`text-[10px] uppercase font-bold mb-2 tracking-widest ${labelColor}`}>Network Interface</p>
              <div className={`font-mono font-bold text-sm p-4 rounded-2xl border flex justify-between items-center shadow-inner ${
                isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-800 border-blue-300'
              }`}>
                <span>192.168.2.4:12345</span>
                <Activity size={16} className="animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PingSonarView;