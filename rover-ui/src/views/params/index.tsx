import React, { useState, useRef } from 'react';
import { 
  Search, Save, FileUp, Cpu, 
  SlidersHorizontal, AlertTriangle
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
          alert("Yeay! Parameter berhasil di-load dari file.");
        } else {
          alert("Format file salah. Pastikan isi file berbentuk JSON Array.");
        }
      } catch (error) {
        alert("Gagal membaca file. Pastikan itu adalah file JSON yang valid.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleToggle = (id: number) => {
    setParams(prevParams => prevParams.map(p => p.id === id ? { ...p, value: !p.value } : p));
  };

  const handleInputChange = (id: number, newValue: string) => {
    setParams(prevParams => prevParams.map(p => p.id === id ? { ...p, value: newValue } : p));
  };

  const handleSave = () => {
    alert("Parameters successfully staged for upload!");
  };

  const filteredParams = params.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    param.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // LOGIKA WARNA KONTRAS TINGGI (PUTIH BERSIH DI LIGHT MODE)
  // ==========================================
  const titleText = isDarkMode ? 'text-white' : 'text-slate-900';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const mutedText = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/70 backdrop-blur-xl border-white/10 shadow-2xl' 
    : 'bg-white border-slate-200 shadow-xl';
    
  const headerBg = isDarkMode ? 'bg-white/5' : 'bg-slate-50 border-b border-slate-200';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-slate-200';
  const rowHover = isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-50';
  const tableTextHover = isDarkMode ? 'group-hover:text-white' : 'group-hover:text-blue-700';
  
  const searchBg = isDarkMode 
    ? 'bg-black/50 border-white/10 text-white placeholder:text-slate-500' 
    : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 shadow-inner';

  const inputBg = isDarkMode
    ? 'bg-black/50 border-white/10 text-blue-400'
    : 'bg-slate-50 border-slate-300 text-blue-700 shadow-inner';

  const badgeBg = isDarkMode 
    ? 'bg-white/10 text-slate-300 border-white/5' 
    : 'bg-slate-100 border-slate-300 text-slate-700 font-bold';
    
  const iconBoxBg = isDarkMode 
    ? 'bg-black/30 border-white/10' 
    : 'bg-slate-50 border-slate-200 shadow-sm';

  return (
    <div className="animate-in fade-in duration-500 pb-10 mt-2 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* ================= STATUS (Back Button Removed) ================= */}
        <div className="flex justify-end">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border shadow-sm ${isDarkMode ? 'bg-black/40 border-emerald-500/20 backdrop-blur-md' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest drop-shadow-sm">Connected | SITL</span>
          </div>
        </div>

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
            <Cpu size={32} />
          </div>
          <div>
            <h1 className={`font-heading text-3xl md:text-4xl font-black tracking-tight uppercase drop-shadow-sm transition-colors duration-300 ${titleText}`}>System Parameters</h1>
            <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold drop-shadow-sm transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Configure vehicle flight controller settings
            </p>
          </div>
        </div>

        {/* ================= MAIN TABLE CARD ================= */}
        <div className={`border rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${cardBg}`}>
          
          {/* TOOLBAR */}
          <div className={`p-6 flex flex-col md:flex-row items-center justify-between gap-5 transition-colors duration-300 ${headerBg}`}>
            <div className="relative w-full md:w-96">
              <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedText}`} />
              <input 
                type="text" 
                placeholder="Search parameter..." 
                className={`w-full rounded-xl py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all border ${searchBg}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button 
                onClick={handleLoadClick}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold border uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}
              >
                <FileUp size={16} /> Load File
              </button>

              <button 
                onClick={handleSave}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-xs font-black text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95 tracking-widest uppercase"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className={`${borderColor} border-b transition-colors duration-300 ${isDarkMode ? '' : 'bg-slate-50/50'}`}>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest w-1/4 ${mutedText}`}>Parameter Name</th>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest w-auto ${mutedText}`}>Description & Category</th>
                  <th className={`px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest w-1/4 ${mutedText}`}>Assigned Value</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-300 ${isDarkMode ? 'divide-white/10' : 'divide-slate-200'}`}>
                {filteredParams.length > 0 ? (
                  filteredParams.map((param) => (
                    <tr key={param.id} className={`group transition-colors duration-200 ${rowHover}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border transition-colors duration-300 ${iconBoxBg} ${mutedText} group-hover:text-blue-500 group-hover:border-blue-500/30`}>
                            <SlidersHorizontal size={14} />
                          </div>
                          <span className={`text-sm font-mono font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} ${tableTextHover}`}>
                            {param.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <p className={`text-sm transition-colors duration-300 line-clamp-1 ${subText}`}>
                            {param.desc}
                          </p>
                          <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border transition-colors duration-300 ${badgeBg}`}>
                            {param.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center">
                          {param.type === 'toggle' ? (
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${param.value ? 'text-emerald-600' : mutedText}`}>
                                {param.value ? 'Enabled' : 'Disabled'}
                              </span>
                              <button 
                                onClick={() => handleToggle(param.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${param.value ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${param.value ? 'translate-x-6' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          ) : (
                            <div className="relative group/input">
                              <input 
                                type="text" 
                                value={param.value.toString()} 
                                onChange={(e) => handleInputChange(param.id, e.target.value)}
                                className={`w-28 border focus:border-blue-500 rounded-lg py-2 px-3 text-sm font-mono font-bold text-right outline-none transition-all duration-300 ${inputBg}`}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className={`flex flex-col items-center justify-center gap-3 ${mutedText}`}>
                        <AlertTriangle size={32} className="opacity-50" />
                        <p className="text-sm font-medium">No parameters match your search criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className={`p-4 border-t flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} ${mutedText}`}>
            <span>Showing {filteredParams.length} parameters</span>
            <span>Autopilot Version: V4.3.0</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParamsView;