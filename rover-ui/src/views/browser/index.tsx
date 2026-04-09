import React, { useState } from 'react';
import { 
  Database, Search, Play, Download, Trash2, Info, 
  LineChart, Plus, Save, X, ChevronDown, List, Settings 
} from 'lucide-react';

const LogBrowser = () => {
  // State untuk navigasi tab di Log Viewer
  const [activeTab, setActiveTab] = useState('plotting');

  const logs = [
    { name: '00000001.BIN', size: '225.9 kB', type: '.BIN', modified: '2026-03-05 10:20:47' },
    { name: 'mission_telemetry.tlog', size: '12.4 MB', type: '.tlog', modified: '2026-03-05 11:45:18' },
  ];

  // Dummy data untuk Events
  const dummyEvents = [
    { time: '10:20:47.123', type: 'MODE', message: 'STABILIZE' },
    { time: '10:20:48.500', type: 'ARMED', message: 'System Armed' },
    { time: '10:22:15.000', type: 'WARNING', message: 'EKF3 lane switch 1' },
    { time: '10:35:10.222', type: 'DISARMED', message: 'System Disarmed' },
  ];

  // Dummy data untuk Events + Params
  const dummyParams = [
    { time: '10:20:47.123', type: 'MODE', name: 'STABILIZE', value: '-' },
    { time: '10:21:05.400', type: 'PARAM', name: 'ATC_RAT_RLL_P', value: '0.135 -> 0.150' },
    { time: '10:21:20.100', type: 'PARAM', name: 'MOT_PWM_MIN', value: '1100 -> 1150' },
    { time: '10:22:15.000', type: 'WARNING', name: 'EKF3', value: 'lane switch 1' },
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

        {/* === Content Area Right (Light Theme) === */}
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
            
            {/* 1. PLOTTING TAB */}
            {activeTab === 'plotting' && (
              <>
                <div className="text-center text-gray-400 text-sm mb-4 italic">Click to enter Plot title</div>
                <div className="flex justify-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-mono">
                    <div className="w-4 h-0.5 bg-blue-600"></div> ATT.Roll
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-mono">
                    <div className="w-4 h-0.5 bg-orange-500"></div> ATT.Pitch
                  </div>
                </div>

                <div className="flex-1 border border-red-200 bg-red-50/10 relative flex items-end justify-center pb-8 rounded">
                  {/* Y Axis Left */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-red-200 flex flex-col justify-between py-4 text-[10px] text-red-400 text-center bg-white/50 z-10">
                    <span className="writing-vertical-lr rotate-180 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold tracking-widest uppercase text-xs">ATT.Roll, ATT.Pitch</span>
                    <span>MANUAL</span>
                  </div>
                  
                  {/* Y Axis Right */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-red-200 flex flex-col justify-between py-4 text-[10px] text-red-400 text-center bg-white/50 z-10">
                    <span>STABILIZE</span>
                    <span>MANUAL</span>
                  </div>

                  {/* Grid Lines */}
                  <div className="absolute inset-0 left-8 right-8 flex flex-col justify-between pointer-events-none py-8">
                    {[...Array(6)].map((_,i) => <div key={i} className="border-b border-gray-100 w-full h-0"></div>)}
                  </div>

                  {/* SVG Graph Dummy */}
                  <svg className="absolute inset-0 left-8 right-8 w-[calc(100%-4rem)] h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,50 L10,50 L12,20 L15,80 L20,30 L25,70 L30,45 L35,55 L40,50 L55,50 L60,10 L65,80 L70,40 L75,60 L80,50 L100,50" fill="none" stroke="#2563eb" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                    <path d="M0,60 L10,60 L12,30 L15,90 L20,40 L25,80 L30,55 L35,65 L40,60 L55,60 L60,20 L65,90 L70,50 L75,70 L80,60 L100,60" fill="none" stroke="#f97316" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>

                {/* Bottom Timeline Preview */}
                <div className="h-16 mt-6 border border-gray-200 relative rounded overflow-hidden">
                  <svg className="w-full h-full bg-gray-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M10,50 L12,20 L15,80 L20,30 L25,70 L30,45" fill="none" stroke="#2563eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="absolute inset-y-0 left-[10%] right-[40%] bg-blue-500/10 border-x-2 border-blue-500 cursor-ew-resize"></div>
                </div>
                <div className="text-center text-[10px] text-gray-400 mt-2 tracking-wider">TIME (BOOT) (MS)</div>
              </>
            )}

            {/* 2. EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-semibold">
                  <List size={18} /> System Events Log
                </div>
                <div className="overflow-auto flex-1 p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0 border-b border-gray-200 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dummyEvents.map((evt, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-mono text-gray-500">{evt.time}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${evt.type === 'WARNING' ? 'bg-orange-100 text-orange-700' : evt.type === 'ARMED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {evt.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-700">{evt.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. EVENTS + PARAMS TAB */}
            {activeTab === 'events-params' && (
              <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-semibold">
                  <Settings size={18} /> Events & Parameter Changes
                </div>
                <div className="overflow-auto flex-1 p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0 border-b border-gray-200 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Name / Event</th>
                        <th className="px-6 py-3">Value (Old -{">"} New)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dummyParams.map((param, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-mono text-gray-500">{param.time}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${param.type === 'PARAM' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                              {param.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-800 font-medium">{param.name}</td>
                          <td className="px-6 py-3 font-mono text-gray-600">{param.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default LogBrowser;