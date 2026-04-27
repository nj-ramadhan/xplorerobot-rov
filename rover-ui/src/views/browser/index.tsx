import React, { useState } from 'react';
import { 
  Database, Search, Play, Download, Trash2, Info, 
  LineChart, Plus, Save, X, ChevronDown
} from 'lucide-react';

// Import komponen tab yang baru saja dibuat
import PlottingTab from './PlottingTab';
import EventsTab from './EventsTab';
import EventsParamsTab from './EventsParamsTab';

// Tambahkan interface saklar isDarkMode
interface LogBrowserProps {
  isDarkMode?: boolean;
}

const LogBrowser: React.FC<LogBrowserProps> = ({ isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState('plotting');

  const logs = [
    { name: '00000001.BIN', size: '225.9 kB', type: '.BIN', modified: '2026-03-05 10:20:47' },
    { name: 'mission_telemetry.tlog', size: '12.4 MB', type: '.tlog', modified: '2026-03-05 11:45:18' },
  ];

  // ==========================================
  // LOGIKA TEMA BUNGLON (Otomatis Putih di Light Mode)
  // ==========================================
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const textColor = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  
  // Card Utama
  const cardClasses = isDarkMode 
    ? 'bg-[#111827]/70 backdrop-blur-xl border-white/10 shadow-2xl' 
    : 'bg-white border-slate-200 shadow-xl';
    
  // Sidebar dan Inner Header
  const sidebarBg = isDarkMode ? 'bg-[#111827]/50' : 'bg-slate-50';
  const headerInnerBg = isDarkMode ? 'bg-white/5' : 'bg-slate-100/50';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-slate-200';
  const rowHover = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-blue-50';

  // Input & Button
  const inputBg = isDarkMode 
    ? 'bg-black/30 border-white/10 text-slate-200 placeholder-slate-500 focus:border-blue-500' 
    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-600 shadow-inner';
    
  const btnClasses = isDarkMode 
    ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent' 
    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm';

  return (
    <div className="animate-in fade-in duration-500 pb-10 mt-2 font-['Inter',sans-serif]">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex items-center gap-5 mb-8 w-full max-w-7xl mx-auto">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Database size={32} className="text-white" />
        </div>
        <div>
          <h1 className={`font-heading text-3xl md:text-4xl font-black tracking-tight uppercase transition-colors duration-300 ${titleColor}`}>
            Log Browser
          </h1>
          <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold transition-colors duration-300 ${subtitleColor}`}>
            Manage and download Telemetry (.tlog) and Binary (.bin) logs
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className={`border rounded-xl p-4 text-sm mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/20 text-slate-300' : 'bg-blue-50 border-blue-200 text-blue-800 shadow-sm'}`}>
          <div className="flex gap-2 items-start">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <ul className="list-disc ml-4 space-y-1 font-medium">
              <li>Download telemetry logs for analysis in UAV LogViewer.</li>
              <li>Use the green play button to visualize data in real-time.</li>
            </ul>
          </div>
        </div>

        {/* ================= TABLE LOGS SECTION ================= */}
        <div className={`border rounded-3xl overflow-hidden mb-8 transition-colors duration-300 ${cardClasses}`}>
          <div className={`p-5 border-b flex justify-between items-center transition-colors duration-300 ${borderColor} ${headerInnerBg}`}>
            <div className="relative w-full md:w-80">
              <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
              <input type="text" placeholder="Search logs..." className={`w-full rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors duration-300 ${inputBg}`} />
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className={`border-b transition-colors duration-300 uppercase text-[10px] font-bold tracking-widest ${borderColor} ${headerInnerBg} ${labelColor}`}>
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Size</th>
                  <th className="p-5">Type</th>
                  <th className="p-5">Modified ↓</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-white/5' : 'divide-slate-200'}`}>
                {logs.map((log, i) => (
                  <tr key={i} className={`transition-colors duration-200 ${rowHover}`}>
                    <td className={`p-5 font-mono font-bold transition-colors duration-300 ${textColor}`}>{log.name}</td>
                    <td className={`p-5 font-mono font-medium transition-colors duration-300 ${labelColor}`}>{log.size}</td>
                    <td className={`p-5 font-mono font-medium transition-colors duration-300 ${labelColor}`}>{log.type}</td>
                    <td className={`p-5 font-medium transition-colors duration-300 ${labelColor}`}>{log.modified}</td>
                    <td className="p-5 flex justify-center gap-2">
                      <button className={`p-2.5 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors ${!isDarkMode && 'hover:text-emerald-600'}`}><Play size={16} fill="currentColor" /></button>
                      <button className={`p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors ${!isDarkMode && 'hover:text-blue-600'}`}><Download size={16} /></button>
                      <button className={`p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors ${!isDarkMode && 'hover:text-red-600'}`}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= VIEWER SECTION ================= */}
        <div className={`border rounded-3xl overflow-hidden flex flex-col md:flex-row h-[600px] transition-colors duration-300 ${cardClasses}`}>
          
          {/* === Sidebar Left === */}
          <div className={`w-full md:w-72 border-r flex flex-col flex-shrink-0 transition-colors duration-300 ${borderColor} ${sidebarBg}`}>
            <div className={`p-5 border-b flex justify-between items-center transition-colors duration-300 ${borderColor} ${headerInnerBg}`}>
              <span className={`font-bold flex items-center gap-2 transition-colors duration-300 ${textColor}`}>
                <LineChart size={18} className="text-blue-500"/> UAV Log Viewer
              </span>
            </div>
            
            <div className={`p-5 border-b transition-colors duration-300 ${borderColor}`}>
              <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors duration-300 ${labelColor}`}>Plots Setup</h3>
              <div className="space-y-3 mb-5">
                <div className="relative">
                  <select className={`w-full rounded-xl p-3 text-sm outline-none appearance-none transition-colors duration-300 ${inputBg}`}>
                    <option>ATT.Roll</option>
                  </select>
                  <ChevronDown size={14} className={`absolute right-4 top-3.5 pointer-events-none ${labelColor}`} />
                </div>
                <div className="relative">
                  <select className={`w-full rounded-xl p-3 text-sm outline-none appearance-none transition-colors duration-300 ${inputBg}`}>
                    <option>ATT.Pitch</option>
                  </select>
                  <ChevronDown size={14} className={`absolute right-4 top-3.5 pointer-events-none ${labelColor}`} />
                </div>
              </div>
              <div className="flex gap-2">
                <button className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1 text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${btnClasses}`}><Plus size={14}/> Add</button>
                <button className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1 text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${btnClasses}`}><Save size={14}/> Save</button>
                <button className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1 text-[11px] uppercase tracking-widest font-bold transition-colors duration-300 ${btnClasses}`}><X size={14}/> Clear</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className={`text-[10px] font-bold uppercase tracking-widest p-1 mb-2 transition-colors duration-300 ${labelColor}`}>Presets</div>
              <div className="space-y-1.5">
                <div className={`p-3 rounded-xl flex justify-between items-center cursor-pointer text-sm border font-bold transition-colors duration-300 ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  <span>Attitude</span> <ChevronDown size={16} />
                </div>
                <div className={`pl-5 py-2 space-y-3 text-sm border-l ml-3 transition-colors duration-300 ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <div className={`cursor-pointer font-bold transition-colors duration-300 ${isDarkMode ? 'text-blue-400 hover:text-white' : 'text-blue-600 hover:text-slate-900'}`}>Roll and Pitch</div>
                  <div className={`cursor-pointer font-medium transition-colors duration-300 hover:text-blue-500`}>RP Comparison</div>
                  <div className={`cursor-pointer font-medium transition-colors duration-300 hover:text-blue-500`}>Attitude Control</div>
                  <div className={`cursor-pointer font-medium transition-colors duration-300 hover:text-blue-500`}>Circular Angle</div>
                </div>
                <div className={`p-3 rounded-xl flex justify-between items-center cursor-pointer text-sm font-bold transition-colors duration-300 mt-2 ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                  <span>Sensors</span> <ChevronDown size={16} className={`transform -rotate-90 ${labelColor}`}/>
                </div>
                <div className={`p-3 rounded-xl flex justify-between items-center cursor-pointer text-sm font-bold transition-colors duration-300 mt-1 ${isDarkMode ? 'hover:bg-white/5 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
                  <span>Servos</span> <ChevronDown size={16} className={`transform -rotate-90 ${labelColor}`}/>
                </div>
              </div>
            </div>
          </div>

          {/* === Content Area Right === */}
          <div className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0a0f18]' : 'bg-slate-50/50'}`}>
            
            {/* Top Nav Tabs */}
            <div className={`flex justify-center gap-3 p-4 border-b z-10 transition-colors duration-300 ${borderColor} ${isDarkMode ? 'bg-[#111827]/80 backdrop-blur-md' : 'bg-white'}`}>
              <button 
                onClick={() => setActiveTab('plotting')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 border ${
                  activeTab === 'plotting' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                    : (isDarkMode ? 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm')
                }`}
              >
                Plotting
              </button>
              <button 
                onClick={() => setActiveTab('events')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 border ${
                  activeTab === 'events' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                    : (isDarkMode ? 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm')
                }`}
              >
                Events
              </button>
              <button 
                onClick={() => setActiveTab('events-params')}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 border ${
                  activeTab === 'events-params' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                    : (isDarkMode ? 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm')
                }`}
              >
                Events + Params
              </button>
            </div>

            {/* === DYNAMIC TAB CONTENT === */}
            {/* Supaya tab di dalamnya tahu lagi mode terang atau gelap, kita over isDarkMode-nya juga */}
            {/* === DYNAMIC TAB CONTENT === */}
<div className="flex-1 p-6 flex flex-col overflow-hidden">
  {activeTab === 'plotting' && <PlottingTab isDarkMode={isDarkMode} />}
  {activeTab === 'events' && <EventsTab isDarkMode={isDarkMode} />}
  {activeTab === 'events-params' && <EventsParamsTab isDarkMode={isDarkMode} />}
</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogBrowser;