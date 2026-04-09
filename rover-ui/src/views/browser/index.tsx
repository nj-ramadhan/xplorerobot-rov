import React, { useState } from 'react';
import { 
  Database, Search, Play, Download, Trash2, Info, 
  LineChart, Plus, Save, X, ChevronDown
} from 'lucide-react';

// Import komponen tab yang baru saja dibuat
import PlottingTab from './PlottingTab';
import EventsTab from './EventsTab';
import EventsParamsTab from './EventsParamsTab';

const LogBrowser = () => {
  const [activeTab, setActiveTab] = useState('plotting');

  const logs = [
    { name: '00000001.BIN', size: '225.9 kB', type: '.BIN', modified: '2026-03-05 10:20:47' },
    { name: 'mission_telemetry.tlog', size: '12.4 MB', type: '.tlog', modified: '2026-03-05 11:45:18' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex items-center gap-5 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Database size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Log Browser</h1>
          <p className="text-slate-500 font-mono text-sm mt-1 tracking-widest uppercase">
            Manage and download Telemetry (.tlog) and Binary (.bin) logs
          </p>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-slate-300 mb-6">
        <div className="flex gap-2">
          <Info size={18} className="text-blue-400 shrink-0" />
          <ul className="list-disc ml-4 space-y-1">
            <li>Download telemetry logs for analysis in UAV LogViewer.</li>
            <li>Use the green play button to visualize data in real-time.</li>
          </ul>
        </div>
      </div>

      {/* ================= TABLE LOGS SECTION ================= */}
      <div className="bg-[#111827]/80 border border-white/10 rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input type="text" placeholder="Search logs..." className="bg-[#0b111a] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 w-80 focus:border-blue-500 outline-none" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500 border-b border-white/5 uppercase text-[10px] font-bold tracking-widest bg-white/5">
            <tr>
              <th className="p-4">Name</th><th className="p-4">Size</th><th className="p-4">Type</th><th className="p-4">Modified ↓</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-blue-500/5 transition-colors">
                <td className="p-4 font-mono text-slate-200">{log.name}</td>
                <td className="p-4 text-slate-400 font-mono">{log.size}</td>
                <td className="p-4 text-slate-400 font-mono">{log.type}</td>
                <td className="p-4 text-slate-400">{log.modified}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><Play size={18} fill="currentColor" /></button>
                  <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Download size={18} /></button>
                  <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= VIEWER SECTION ================= */}
      <div className="border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px] bg-[#0b111a] shadow-2xl">
        
        {/* === Sidebar Left === */}
        <div className="w-full md:w-72 bg-[#111827] border-r border-white/10 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <LineChart size={18} className="text-blue-500"/> UAV Log Viewer
            </span>
          </div>
          
          <div className="p-4 border-b border-white/10">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Plots Setup</h3>
            <div className="space-y-2 mb-4">
              <select className="w-full bg-[#0b111a] border border-white/10 rounded-lg p-2 text-sm text-slate-300 outline-none focus:border-blue-500 appearance-none">
                <option>ATT.Roll</option>
              </select>
              <select className="w-full bg-[#0b111a] border border-white/10 rounded-lg p-2 text-sm text-slate-300 outline-none focus:border-blue-500 appearance-none">
                <option>ATT.Pitch</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"><Plus size={14}/> Add</button>
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"><Save size={14}/> Save</button>
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-colors"><X size={14}/> clear</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider p-2 mb-1">Presets</div>
            <div className="space-y-1">
              <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg flex justify-between items-center cursor-pointer text-sm border border-blue-500/20">
                <span className="font-medium">Attitude</span> <ChevronDown size={16} />
              </div>
              <div className="pl-4 py-2 space-y-3 text-sm text-slate-400 border-l border-white/5 ml-2">
                <div className="hover:text-slate-200 cursor-pointer text-blue-400 font-medium">Roll and Pitch</div>
                <div className="hover:text-slate-200 cursor-pointer">RP Comparison</div>
                <div className="hover:text-slate-200 cursor-pointer">Attitude Control</div>
                <div className="hover:text-slate-200 cursor-pointer">Circular Angle</div>
              </div>
              <div className="hover:bg-white/5 text-slate-300 p-2 rounded-lg flex justify-between items-center cursor-pointer text-sm transition-colors mt-1">
                <span>Sensors</span> <ChevronDown size={16} className="transform -rotate-90 text-slate-500"/>
              </div>
              <div className="hover:bg-white/5 text-slate-300 p-2 rounded-lg flex justify-between items-center cursor-pointer text-sm transition-colors mt-1">
                <span>Servos</span> <ChevronDown size={16} className="transform -rotate-90 text-slate-500"/>
              </div>
            </div>
          </div>
        </div>

        {/* === Content Area Right === */}
        <div className="flex-1 bg-white flex flex-col relative overflow-hidden">
          
          {/* Top Nav Tabs */}
          <div className="flex justify-center gap-2 p-3 bg-white border-b border-gray-200 shadow-sm z-10">
            <button 
              onClick={() => setActiveTab('plotting')}
              className={`px-5 py-1.5 text-sm font-medium rounded transition-colors ${activeTab === 'plotting' ? 'bg-gray-200 text-gray-800 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'}`}
            >
              Plotting
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`px-5 py-1.5 text-sm font-medium rounded transition-colors ${activeTab === 'events' ? 'bg-gray-200 text-gray-800 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'}`}
            >
              Events
            </button>
            <button 
              onClick={() => setActiveTab('events-params')}
              className={`px-5 py-1.5 text-sm font-medium rounded transition-colors ${activeTab === 'events-params' ? 'bg-gray-200 text-gray-800 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'}`}
            >
              Events + Params
            </button>
          </div>

          {/* === DYNAMIC TAB CONTENT === */}
          <div className="flex-1 p-6 flex flex-col overflow-hidden">
            {activeTab === 'plotting' && <PlottingTab />}
            {activeTab === 'events' && <EventsTab />}
            {activeTab === 'events-params' && <EventsParamsTab />}
          </div>
        </div>
      </div>

    </div>
  );
};

export default LogBrowser;