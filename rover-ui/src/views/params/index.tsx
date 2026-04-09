import React, { useState, useRef } from 'react'; // Tambah useRef di sini
import { 
  Search, Save, FileUp, Cpu, ChevronLeft, 
  SlidersHorizontal, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Definisi Interface
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
  const navigate = useNavigate();
  const [params, setParams] = useState<Parameter[]>(INITIAL_PARAMS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // ==========================================
  // FITUR LOAD FILE BARU
  // ==========================================
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk trigger klik ke input file yang disembunyikan
  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  // Fungsi untuk membaca isi file yang dipilih
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedParams = JSON.parse(content);
        
        // Cek simpel apakah file yang di-upload beneran format array
        if (Array.isArray(parsedParams)) {
          setParams(parsedParams);
          alert("Yeay! Parameter berhasil di-load dari file.");
        } else {
          alert("Format file salah. Pastikan isi file berbentuk JSON Array.");
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Gagal membaca file. Pastikan itu adalah file JSON yang valid.");
      }
    };
    reader.readAsText(file);
    
    // Reset nilai input biar bisa upload file yang sama berkali-kali
    event.target.value = '';
  };

  // ==========================================
  // FITUR EDIT & SAVE
  // ==========================================
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
    alert("Parameters successfully staged for upload!");
  };

  const filteredParams = params.filter(param => 
    param.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    param.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // LOGIKA WARNA BUNGLON
  // ==========================================
  const titleText = isDarkMode ? 'text-white' : 'text-slate-800';
  const subText = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const mutedText = isDarkMode ? 'text-slate-500' : 'text-slate-400';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1e293b]/50 backdrop-blur-md border-slate-700/50 shadow-2xl' 
    : 'bg-white/70 backdrop-blur-md border-slate-300 shadow-xl';
    
  const headerBg = isDarkMode ? 'bg-[#0f172a]/40' : 'bg-slate-50/50';
  const borderColor = isDarkMode ? 'border-slate-700/50' : 'border-slate-200';
  const rowHover = isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-800/[0.03]';
  
  const searchBg = isDarkMode 
    ? 'bg-black/40 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500' 
    : 'bg-white/60 border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500';

  const inputBg = isDarkMode
    ? 'bg-black/40 border-slate-700 text-indigo-300 focus:bg-[#111827]/80'
    : 'bg-white/60 border-slate-300 text-indigo-700 focus:bg-white';

  const badgeBg = isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-200/50 border-slate-300';
  const iconBoxBg = isDarkMode ? 'bg-black/30 border-white/5' : 'bg-white/60 border-slate-200';

  return (
    <div className="animate-in fade-in duration-500 pb-10 mt-2">
      <div className="space-y-8">
        
        {/* ================= NAVIGATION & STATUS ================= */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/home')}
            className={`flex items-center gap-2 transition-colors group ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <div className={`p-1.5 rounded-lg transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-indigo-500/20' : 'bg-white/50 border-slate-200 group-hover:bg-indigo-100'}`}>
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-sm">Back to Dashboard</span>
          </button>
          
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)] ${isDarkMode ? 'bg-black/40 border-emerald-500/20' : 'bg-white/60 border-emerald-500/30'}`}>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest drop-shadow-sm">Connected | SITL</span>
          </div>
        </div>

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
            <Cpu size={32} />
          </div>
          <div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight uppercase drop-shadow-sm ${titleText}`}>System Parameters</h1>
            <p className={`font-mono text-xs mt-1 tracking-widest uppercase drop-shadow-sm ${subText}`}>
              Configure vehicle flight controller settings
            </p>
          </div>
        </div>

        {/* ================= MAIN TABLE CARD ================= */}
        <div className={`border rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${cardBg}`}>
          
          {/* TOOLBAR */}
          <div className={`p-6 border-b flex flex-col md:flex-row items-center justify-between gap-5 ${headerBg} ${borderColor}`}>
            
            <div className="relative w-full md:w-96">
              <Search size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${mutedText}`} />
              <input 
                type="text" 
                placeholder="Search parameter..." 
                className={`w-full rounded-xl py-3 pl-12 pr-4 text-sm outline-none transition-all ${searchBg}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              
              {/* INPUT FILE TERSEMBUNYI */}
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              
              {/* TOMBOL LOAD FILE (Memicu input tersembunyi) */}
              <button 
                onClick={handleLoadClick}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold border transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white/50 hover:bg-white border-slate-300 text-slate-700 shadow-sm'}`}
              >
                <FileUp size={16} /> Load File
              </button>

              <button 
                onClick={handleSave}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-6 py-3 rounded-xl text-xs font-black text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95 tracking-widest uppercase"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className={`${borderColor} border-b`}>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest w-1/4 ${mutedText}`}>Parameter Name</th>
                  <th className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest w-auto ${mutedText}`}>Description & Category</th>
                  <th className={`px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest w-1/4 ${mutedText}`}>Assigned Value</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50' : 'divide-slate-200'}`}>
                {filteredParams.length > 0 ? (
                  filteredParams.map((param) => (
                    <tr key={param.id} className={`group transition-colors ${rowHover}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border transition-colors ${iconBoxBg} ${mutedText} group-hover:text-indigo-500 group-hover:border-indigo-500/30`}>
                            <SlidersHorizontal size={14} />
                          </div>
                          <span className={`text-sm font-mono font-bold transition-colors ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                            {param.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <p className={`text-sm transition-colors line-clamp-1 ${subText}`}>
                            {param.desc}
                          </p>
                          <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${badgeBg} ${mutedText}`}>
                            {param.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center">
                          {param.type === 'toggle' ? (
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${param.value ? 'text-emerald-500' : mutedText}`}>
                                {param.value ? 'Enabled' : 'Disabled'}
                              </span>
                              <button 
                                onClick={() => handleToggle(param.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${param.value ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-300')}`}
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
                                className={`w-28 border hover:border-indigo-400 rounded-lg py-2 px-3 text-sm font-mono text-right outline-none transition-all shadow-inner ${inputBg}`}
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
          
          <div className={`p-4 border-t flex justify-between items-center text-[10px] font-mono uppercase tracking-widest ${headerBg} ${borderColor} ${mutedText}`}>
            <span>Showing {filteredParams.length} parameters</span>
            <span>Autopilot Version: V4.3.0</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParamsView;