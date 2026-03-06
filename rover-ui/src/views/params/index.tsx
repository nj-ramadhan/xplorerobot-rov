import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, Search, Save, FileUp, Info, Cpu, 
  ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

// Definisi Interface
interface Parameter {
  id: number;
  name: string;
  desc: string;
  value: string | boolean;
  type: 'number' | 'toggle';
}

const INITIAL_PARAMS: Parameter[] = [
  { id: 1, name: 'ATC_ANG_PIT_P', desc: 'Pitch axis angular response gain', value: '4.5', type: 'number' },
  { id: 2, name: 'CH7_OPT', desc: 'Channel 7 option configuration', value: '0', type: 'number' },
  { id: 3, name: 'EK3_ENABLE', desc: 'Enable Extended Kalman Filter v3', value: true, type: 'toggle' },
  { id: 4, name: 'MOT_TBP_THST', desc: 'Thrust to boost pressure ratio', value: '0.5', type: 'number' },
  { id: 5, name: 'LEAK_ENABLE', desc: 'Enable leak detector sensor', value: false, type: 'toggle' },
  { id: 6, name: 'BATT_MONITOR', desc: 'Battery monitoring configuration', value: '4', type: 'number' },
  { id: 7, name: 'FS_GCS_ENABLE', desc: 'Ground Control Station failsafe enable', value: true, type: 'toggle' },
];

const ParamsView = () => {
  // 1. PINDAHKAN DATA KE STATE AGAR BISA DIUBAH
  const [params, setParams] = useState<Parameter[]>(INITIAL_PARAMS);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. FUNGSI UNTUK MENGUBAH TOGGLE (ENABLED/DISABLED)
  const handleToggle = (id: number) => {
    setParams(prevParams => 
      prevParams.map(p => 
        p.id === id ? { ...p, value: !p.value } : p
      )
    );
  };

  // 3. FUNGSI UNTUK MENGUBAH ANGKA
  const handleInputChange = (id: number, newValue: string) => {
    setParams(prevParams => 
      prevParams.map(p => 
        p.id === id ? { ...p, value: newValue } : p
      )
    );
  };

  // 4. FUNGSI SAVE (UNTUK TESTING)
  const handleSave = () => {
    console.log("Saving Parameters to ROV...", params);
    alert("Parameters successfully sent to Vehicle!");
  };

  const filteredParams = params.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    param.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 transition-all">
            <ChevronLeft size={16} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Connected | SITL</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30 text-white">
          <Cpu size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Parameters</h1>
          <p className="text-xs text-slate-400 font-medium">Configure vehicle flight controller settings</p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-[#111827]/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col">
        
        {/* HEADER TABLE */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search parameters..." 
              className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/10 transition-all text-slate-300">
              <FileUp size={16} /> Load File
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Save size={16} /> Save to Vehicle
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredParams.map((param) => (
                <tr key={param.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-indigo-400">{param.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300">{param.desc}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {param.type === 'toggle' ? (
                      /* BUTTON TOGGLE YANG BISA DIKLIK */
                      <button 
                        onClick={() => handleToggle(param.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black transition-all active:scale-90 ${
                          param.value 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${param.value ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-600'}`}></div>
                        {param.value ? 'ENABLED' : 'DISABLED'}
                      </button>
                    ) : (
                      /* INPUT ANGKA YANG BISA DIEDIT */
                      <input 
                        type="text" 
                        value={param.value.toString()} 
                        onChange={(e) => handleInputChange(param.id, e.target.value)}
                        className="w-20 bg-black/40 border border-white/10 rounded-lg py-1.5 px-3 text-sm font-mono text-right text-white focus:border-indigo-400 outline-none transition-all"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Component Pagination (Disederhanakan)
const PaginationBtn = ({ icon, disabled = false }: { icon: any, disabled?: boolean }) => (
  <button className={`p-2 rounded-lg border border-white/10 text-slate-400 ${disabled ? 'opacity-20' : 'hover:bg-white/5'}`}>{icon}</button>
);

export default ParamsView;