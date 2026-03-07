import React, { useState } from 'react';
import { 
  Search, Save, FileUp, Cpu, ChevronLeft, 
  SlidersHorizontal, AlertTriangle
} from 'lucide-react';

// Definisi Interface
interface Parameter {
  id: number;
  name: string;
  desc: string;
  value: string | boolean;
  type: 'number' | 'toggle';
  category: 'Control' | 'System' | 'Failsafe' | 'Hardware';
}

const INITIAL_PARAMS: Parameter[] = [
  { id: 1, name: 'ATC_ANG_PIT_P', desc: 'Pitch axis angular response gain', value: '4.500', type: 'number', category: 'Control' },
  { id: 2, name: 'CH7_OPT', desc: 'Channel 7 option configuration', value: '0', type: 'number', category: 'System' },
  { id: 3, name: 'EK3_ENABLE', desc: 'Enable Extended Kalman Filter v3', value: true, type: 'toggle', category: 'System' },
  { id: 4, name: 'MOT_TBP_THST', desc: 'Thrust to boost pressure ratio', value: '0.500', type: 'number', category: 'Hardware' },
  { id: 5, name: 'LEAK_ENABLE', desc: 'Enable leak detector sensor', value: false, type: 'toggle', category: 'Failsafe' },
  { id: 6, name: 'BATT_MONITOR', desc: 'Battery monitoring configuration', value: '4', type: 'number', category: 'Hardware' },
  { id: 7, name: 'FS_GCS_ENABLE', desc: 'Ground Control Station failsafe enable', value: true, type: 'toggle', category: 'Failsafe' },
];

const ParamsView = () => {
  const [params, setParams] = useState<Parameter[]>(INITIAL_PARAMS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (id: number) => {
    setParams(prevParams => 
      prevParams.map(p => p.id === id ? { ...p, value: !p.value } : p)
    );
  };

  const handleInputChange = (id: number, newValue: string) => {
    setParams(prevParams => 
      prevParams.map(p => p.id === id ? { ...p, value: newValue } : p)
    );
  };

  const handleSave = () => {
    console.log("Saving Parameters to ROV...", params);
    // You can replace this with a beautiful toast notification later
    alert("Parameters successfully staged for upload!");
  };

  const filteredParams = params.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    param.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-10 relative overflow-hidden">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 px-4 sm:px-6 lg:px-8">
        
        {/* ================= NAVIGATION & STATUS ================= */}
        <div className="flex items-center justify-between pt-4">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 transition-all border border-white/5">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-emerald-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Connected | SITL</span>
          </div>
        </div>

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
            <Cpu size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">System Parameters</h1>
            <p className="text-slate-400 font-mono text-sm mt-1 tracking-widest uppercase">
              Configure vehicle flight controller settings
            </p>
          </div>
        </div>

        {/* ================= MAIN TABLE CARD ================= */}
        <div className="bg-[#111827]/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col">
          
          {/* TOOLBAR */}
          <div className="p-6 border-b border-white/5 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-5">
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search by name, description, or category..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl text-xs font-bold border border-white/10 transition-all text-slate-300">
                <FileUp size={16} /> Load File
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-6 py-3 rounded-xl text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95 tracking-widest uppercase"
              >
                <Save size={16} /> Save to Vehicle
              </button>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/4">Parameter Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-auto">Description & Category</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/4">Assigned Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredParams.length > 0 ? (
                  filteredParams.map((param) => (
                    <tr key={param.id} className="group hover:bg-white/[0.02] transition-colors">
                      
                      {/* Column 1: Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-black/30 rounded-lg border border-white/5 text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                            <SlidersHorizontal size={14} />
                          </div>
                          <span className="text-sm font-mono font-bold text-slate-200 group-hover:text-white transition-colors">
                            {param.name}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Description & Category */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
                            {param.desc}
                          </p>
                          <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-white/5 text-slate-500 border border-white/5">
                            {param.category}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Value Control */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end items-center">
                          {param.type === 'toggle' ? (
                            
                            /* --- MODERN TOGGLE SWITCH --- */
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${param.value ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {param.value ? 'Enabled' : 'Disabled'}
                              </span>
                              <button 
                                onClick={() => handleToggle(param.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${param.value ? 'bg-emerald-500' : 'bg-slate-700'}`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${param.value ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>

                          ) : (
                            
                            /* --- MODERN NUMBER INPUT --- */
                            <div className="relative group/input">
                              <input 
                                type="text" 
                                value={param.value.toString()} 
                                onChange={(e) => handleInputChange(param.id, e.target.value)}
                                className="w-28 bg-[#0b111a] border border-white/10 hover:border-white/20 rounded-lg py-2 px-3 text-sm font-mono text-right text-indigo-300 focus:border-indigo-500 focus:bg-[#111827] outline-none transition-all shadow-inner"
                              />
                            </div>

                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty State if search finds nothing */
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                        <AlertTriangle size={32} className="text-slate-600" />
                        <p className="text-sm font-medium">No parameters match your search criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER */}
          <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            <span>Showing {filteredParams.length} parameters</span>
            <span>Autopilot Version: V4.3.0</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParamsView;