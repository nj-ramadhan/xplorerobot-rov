import React, { useState, useRef } from 'react';
import { 
  Search, Save, FileUp, Cpu, 
  SlidersHorizontal, AlertTriangle, RefreshCw 
} from 'lucide-react';

interface Parameter {
  id: number;
  name: string;
  desc: string;
  value: string | boolean;
  type: 'number' | 'toggle';
  category: 'Control' | 'System' | 'Failsafe' | 'Hardware';
}

interface ParamsViewProps {
  isDarkMode?: boolean;
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

const ParamsView: React.FC<ParamsViewProps> = ({ isDarkMode = true }) => {
  const [params, setParams] = useState<Parameter[]>(INITIAL_PARAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleLoadClick = () => fileInputRef.current?.click();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedParams = JSON.parse(content);
        if (Array.isArray(parsedParams)) {
          setParams(parsedParams);
          alert("Parameters loaded!");
        }
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleToggle = (id: number) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, value: !p.value } : p));
  };

  const handleInputChange = (id: number, newValue: string) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, value: newValue } : p));
  };

  const handleRefresh = () => {
    if (window.confirm("Reset to default?")) setParams(INITIAL_PARAMS);
  };

  const handleSave = () => {
    console.log("Saving params:", params);
    alert("Changes saved to system!");
  };

  const filteredParams = params.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    param.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Styles ---
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-500' : 'text-slate-400';
  const cardBg = isDarkMode 
    ? 'bg-[#111827] border-white/5 shadow-2xl' 
    : 'bg-white border-slate-200 shadow-lg';

  return (
    <div className="animate-in fade-in duration-500 pb-10 mt-2 font-sans">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* HEADER - DISESUAIKAN DENGAN GAYA LOG BROWSER */}
        <div className="flex items-center gap-6 px-2">
          {/* Logo Box - Dibuat sedikit lebih rounded & shadow lembut */}
          <div className="p-4 bg-blue-600 rounded-[1.25rem] shadow-lg shadow-blue-500/20 text-white flex items-center justify-center">
            <Cpu size={36} strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col justify-center">
            {/* Judul Utama: Uppercase, Extra Bold, Tracking Wide */}
            <h1 className={`text-4xl md:text-4xl font-black uppercase tracking-tight ${titleColor}`}>
              System Parameters
            </h1>
            {/* Sub-judul: Uppercase, Bold, Muted blue, Monospace feel */}
            <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1.5 opacity-90">
              Manage and configure flight controller parameters
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className={`border rounded-[2rem] overflow-hidden ${cardBg}`}>
          
          {/* TOOLBAR */}
          <div className="p-6 flex items-center justify-between gap-4 border-b border-white/5">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${labelColor}`} />
              <input 
                type="text" 
                placeholder="Search parameter..." 
                className={`w-full rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none border transition-all ${isDarkMode ? 'bg-black/40 border-white/10 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 focus:border-blue-500'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl border transition-all active:scale-90 ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className={`px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] ${labelColor}`}>Parameter Name</th>
                  <th className={`px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] ${labelColor}`}>Description</th>
                  <th className={`px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em] ${labelColor}`}>Value</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                {filteredParams.length > 0 ? filteredParams.map((param) => (
                  <tr key={param.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-slate-800/40 text-slate-500 group-hover:text-blue-400 transition-colors">
                          <SlidersHorizontal size={14} />
                        </div>
                        <span className={`text-sm font-semibold tracking-wide ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                          {param.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {param.desc}
                      </p>
                    </td>
                    <td className="px-8 py-4 text-right">
                      {param.type === 'toggle' ? (
                        <button 
                          onClick={() => handleToggle(param.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all shadow-inner ${param.value ? 'bg-blue-500' : 'bg-slate-700'}`}
                        >
                          <span className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${param.value ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      ) : (
                        <input 
                          type="text" 
                          value={param.value.toString()} 
                          onChange={(e) => handleInputChange(param.id, e.target.value)}
                          className="w-24 bg-black/30 border border-white/10 rounded-lg py-1.5 px-3 text-sm font-mono text-right text-blue-400 outline-none focus:border-blue-500/50 transition-all shadow-inner"
                        />
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <AlertTriangle size={48} />
                        <p className="mt-2 text-sm font-bold uppercase tracking-widest">No Results Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER */}
          <div className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center bg-black/20 gap-6">
            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${labelColor}`}>
              System Status: Ready
            </span>
            <div className="flex gap-4 w-full md:w-auto">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button 
                onClick={handleLoadClick}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-white/10 text-slate-300 hover:bg-white/5 transition-all active:scale-95"
              >
                <FileUp size={16} /> Load File
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl text-[11px] font-black text-white uppercase tracking-[0.15em] shadow-lg shadow-blue-900/40 transition-all active:scale-95"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParamsView;