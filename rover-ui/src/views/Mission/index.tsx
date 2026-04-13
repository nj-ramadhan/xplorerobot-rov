import React, { useState } from 'react';
import { 
  Rocket, RefreshCw, Plus, Folder, Edit2, Trash2, 
  Search, MapPin, Play, Save, Terminal, Pause, 
  Square, ListOrdered, ChevronDown, Map, Target
} from 'lucide-react';

// 1. Tambahkan interface untuk menerima saklar isDarkMode
interface MissionControlProps {
  isDarkMode?: boolean;
}

const MissionControl: React.FC<MissionControlProps> = ({ isDarkMode = true }) => {
  // --- EMPTY STATE DATA ---
  const categories = [
    { id: 1, name: 'Default', count: 0 },
  ];

  const availableGoals: any[] = []; // Kosong
  const currentSequence: any[] = []; // Kosong
  const savedMissions: any[] = []; // Kosong

  const [activeCategory, setActiveCategory] = useState(1);

  // ==========================================
  // LOGIKA TEMA BUNGLON (Otomatis Putih di Light Mode)
  // ==========================================
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  
  // Warna Card Utama
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/80 border-white/10 backdrop-blur-xl shadow-xl' 
    : 'bg-white border-slate-200 shadow-md'; // Putih Solid
    
  // Warna Input & Textarea
  const inputBg = isDarkMode 
    ? 'bg-black/30 border-white/10 text-slate-200 placeholder-slate-600 focus:border-indigo-500' 
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-600';
    
  // Warna kotak kosong (Empty State) / Status Grid
  const innerBoxBg = isDarkMode 
    ? 'bg-black/20 border-white/5' 
    : 'bg-slate-50 border-slate-200';
    
  // Warna item aktif / tidak aktif di list kategori
  const activeItemBg = isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-900';
  const inactiveItemBg = isDarkMode ? 'bg-transparent border-transparent text-slate-400 hover:bg-white/5' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50';

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-10 font-['Inter',sans-serif]">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${titleColor}`}>Mission Control</h1>
            <p className={`font-medium text-xs mt-1 uppercase tracking-widest transition-colors duration-300 ${mutedColor}`}>
              Create, manage, and execute navigation missions
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 border ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'}`}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <Plus size={18} /> New Mission
          </button>
        </div>
      </div>

      {/* ================= MAIN GRID (3 COLUMNS: 1 - 2 - 1) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start h-full">
        
        {/* --- COLUMN 1: Categories & Goals --- */}
        <div className="flex flex-col gap-6 lg:col-span-1 h-full">
          
          {/* Categories Card */}
          <div className={`border rounded-2xl p-5 flex flex-col transition-colors duration-300 ${cardBg}`}>
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-sm font-bold flex items-center gap-2 transition-colors duration-300 ${subtitleColor}`}>
                <Folder size={16} className={mutedColor} /> Categories 
                <span className="bg-blue-500/20 text-blue-500 text-[10px] px-2 py-0.5 rounded-full ml-1">1</span>
              </h2>
              <button className={`${mutedColor} hover:text-blue-500 transition-colors`}><Plus size={16} /></button>
            </div>
            
            <div className="space-y-2">
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex justify-between items-center p-3.5 rounded-xl cursor-pointer transition-all border ${activeCategory === cat.id ? activeItemBg : inactiveItemBg}`}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Folder size={16} className={activeCategory === cat.id ? 'text-blue-500' : mutedColor} fill={activeCategory === cat.id ? 'currentColor' : 'none'} />
                    {cat.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`p-1.5 rounded-lg border transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-500 hover:text-white border-white/10 bg-black/20' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800 border-slate-300 bg-white'}`}><Edit2 size={12} /></button>
                    <button className={`p-1.5 rounded-lg border transition-colors ${isDarkMode ? 'hover:bg-red-500/20 text-red-500/70 hover:text-red-400 border-red-500/20 bg-red-500/10' : 'hover:bg-red-100 text-red-600 border-red-200 bg-red-50'}`}><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Goals Card */}
          <div className={`border rounded-2xl p-5 flex flex-col transition-colors duration-300 flex-1 min-h-[350px] ${cardBg}`}>
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-sm font-bold flex items-center gap-2 transition-colors duration-300 ${subtitleColor}`}>
                <Target size={16} className={mutedColor} /> Available Goals 
                <span className="bg-blue-500/20 text-blue-500 text-[10px] px-2 py-0.5 rounded-full ml-1">0</span>
              </h2>
            </div>
            
            <div className="relative mb-6">
              <Search className={`absolute left-3 top-3 ${mutedColor}`} size={16} />
              <input type="text" placeholder="Search" className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${inputBg}`} />
            </div>

            {/* Empty State Goals */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <Target className={mutedColor} size={32} />
              </div>
              <p className={`text-sm font-medium transition-colors duration-300 ${mutedColor}`}>No goals available</p>
              <button className="mt-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
                <Map size={16}/> Go to Planning
              </button>
            </div>
          </div>

        </div>

        {/* --- COLUMN 2: Mission Builder (Wider) --- */}
        <div className="flex flex-col gap-6 lg:col-span-2 h-full">
          
          <div className={`border rounded-2xl p-6 flex flex-col transition-colors duration-300 h-full ${cardBg}`}>
            
            {/* Header */}
            <div className={`flex justify-between items-center mb-6 pb-4 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
              <h2 className={`text-base font-bold flex items-center gap-2 transition-colors duration-300 ${subtitleColor}`}>
                <ListOrdered size={20} className={mutedColor} /> Mission Builder
                <span className="bg-blue-500/20 text-blue-500 text-[10px] px-2 py-0.5 rounded-full ml-1">0</span>
              </h2>
              <div className="flex gap-2.5">
                <button className={`px-4 py-2 rounded-lg border text-xs font-bold transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm'}`}>
                  <Save size={14} /> Save
                </button>
                <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-xs font-bold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                  <Play size={14} fill="currentColor" /> Start
                </button>
              </div>
            </div>

            {/* Form Inputs (Empty Placeholders) */}
            <div className="grid grid-cols-2 gap-5 mb-6">
              <div className="space-y-2">
                <label className={`text-[11px] font-medium transition-colors duration-300 ${mutedColor}`}>Mission Name</label>
                <input type="text" placeholder="Enter mission name" className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-colors ${inputBg}`} />
              </div>
              <div className="space-y-2 relative">
                <label className={`text-[11px] font-medium transition-colors duration-300 ${mutedColor}`}>Category</label>
                <div className="relative">
                  <select className={`w-full border rounded-xl p-3.5 text-sm outline-none appearance-none transition-colors ${inputBg}`}>
                    <option value="" disabled selected>Select Category</option>
                    <option value="default">Default</option>
                  </select>
                  <ChevronDown size={16} className={`absolute right-4 top-4 pointer-events-none ${mutedColor}`} />
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-8">
              <label className={`text-[11px] font-medium transition-colors duration-300 ${mutedColor}`}>Description</label>
              <textarea rows={3} placeholder="Describe your mission..." className={`w-full border rounded-xl p-3.5 text-sm outline-none resize-none transition-colors ${inputBg}`}></textarea>
            </div>

            {/* Mission Sequence Area */}
            <div className="flex-1 flex flex-col min-h-[200px]">
              <div className="flex justify-between items-center mb-3">
                <label className={`text-sm font-bold transition-colors duration-300 ${subtitleColor}`}>Mission Sequence</label>
                <div className="flex gap-4">
                  <button className={`text-[11px] hover:text-red-500 flex items-center gap-1.5 transition-colors font-medium ${mutedColor}`}>
                    <Trash2 size={14} /> Clear
                  </button>
                  <button className={`text-[11px] hover:text-blue-500 flex items-center gap-1.5 transition-colors font-medium ${mutedColor}`}>
                    <Edit2 size={14} /> Optimize
                  </button>
                </div>
              </div>
              
              {/* Empty Sequence State */}
              <div className={`flex-1 border rounded-2xl flex flex-col items-center justify-center text-center p-8 transition-colors duration-300 ${innerBoxBg}`}>
                <ListOrdered size={32} className={`mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}`} />
                <p className={`text-xs font-medium max-w-[200px] leading-relaxed transition-colors duration-300 ${mutedColor}`}>
                  No goals in sequence. Add goals from the left panel.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* --- COLUMN 3: Saved Missions & Execution --- */}
        <div className="flex flex-col gap-6 lg:col-span-1 h-full">
          
          {/* Saved Missions Card */}
          <div className={`border rounded-2xl p-5 flex flex-col transition-colors duration-300 min-h-[250px] ${cardBg}`}>
            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-sm font-bold flex items-center gap-2 transition-colors duration-300 ${subtitleColor}`}>
                <Rocket size={16} className={mutedColor} /> Missions 
                <span className="bg-blue-500/20 text-blue-500 text-[10px] px-2 py-0.5 rounded-full ml-1">0</span>
              </h2>
              <div className="relative">
                <select className={`bg-transparent text-xs outline-none appearance-none pr-4 cursor-pointer transition-colors ${mutedColor} hover:text-blue-500`}>
                  <option>All</option>
                </select>
                <ChevronDown size={12} className={`absolute right-0 top-1 pointer-events-none ${mutedColor}`} />
              </div>
            </div>
            
            {/* Empty State Missions */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <Rocket className={isDarkMode ? 'text-slate-700 mb-1' : 'text-slate-400 mb-1'} size={32} />
              <p className={`text-xs font-medium transition-colors duration-300 ${mutedColor}`}>No missions created yet</p>
              <button className={`mt-2 px-4 py-2 border rounded-xl text-[11px] font-bold flex items-center gap-2 transition-colors ${isDarkMode ? 'bg-transparent border-white/10 hover:bg-white/5 text-slate-300' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm'}`}>
                <Plus size={14}/> Create Mission
              </button>
            </div>
          </div>

          {/* Execution Panel */}
          <div className={`border rounded-2xl p-6 relative overflow-hidden flex-1 transition-colors duration-300 ${cardBg}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-sm font-bold flex items-center gap-2 transition-colors duration-300 ${subtitleColor}`}>
                <Play size={16} className={mutedColor} /> Execution 
                <span className={`text-[10px] font-medium ml-1 px-2 py-0.5 rounded transition-colors ${isDarkMode ? 'text-slate-500 bg-white/5' : 'text-slate-600 bg-slate-100'}`}>Idle</span>
              </h2>
            </div>

            {/* Progress Bar (0%) */}
            <div className="mb-6 space-y-2">
              <div className={`flex justify-between text-[11px] font-medium transition-colors duration-300 ${mutedColor}`}>
                <span>Progress</span>
                <span>0%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden border transition-colors duration-300 ${isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-200 border-slate-300'}`}>
                <div className="w-[0%] h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            {/* Status Grid (0/0) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${innerBoxBg}`}>
                <div className={`text-[10px] font-medium uppercase tracking-widest transition-colors duration-300 ${mutedColor}`}>Step</div>
                <div className={`text-xl font-bold font-mono transition-colors duration-300 ${titleColor}`}>0<span className={mutedColor}>/0</span></div>
              </div>
              <div className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${innerBoxBg}`}>
                <div className={`text-[10px] font-medium uppercase tracking-widest transition-colors duration-300 ${mutedColor}`}>Completed</div>
                <div className={`text-xl font-bold font-mono transition-colors duration-300 ${titleColor}`}>0<span className={mutedColor}>/0</span></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className={`w-full py-3.5 border rounded-xl font-bold text-xs flex justify-center items-center gap-2 cursor-not-allowed transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400/50' : 'bg-indigo-50 border-indigo-200 text-indigo-400'}`}>
                <Play size={14} fill="currentColor" /> Run All Missions
              </button>
              
              <div className="grid grid-cols-3 gap-3">
                <button className={`py-2.5 border rounded-lg flex justify-center items-center transition-colors cursor-not-allowed ${isDarkMode ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500/50' : 'bg-yellow-50 border-yellow-200 text-yellow-500'}`}>
                  <Pause size={14} fill="currentColor" /> <span className="text-[10px] ml-1 font-bold">Pause</span>
                </button>
                <button className={`py-2.5 border rounded-lg flex justify-center items-center transition-colors cursor-not-allowed ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500/50' : 'bg-emerald-50 border-emerald-200 text-emerald-500'}`}>
                  <Play size={14} fill="currentColor" /> <span className="text-[10px] ml-1 font-bold">Resume</span>
                </button>
                <button className={`py-2.5 border rounded-lg flex justify-center items-center transition-colors cursor-not-allowed ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-500/50' : 'bg-red-50 border-red-200 text-red-400'}`}>
                  <Square size={14} fill="currentColor" /> <span className="text-[10px] ml-1 font-bold">Stop</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MissionControl;