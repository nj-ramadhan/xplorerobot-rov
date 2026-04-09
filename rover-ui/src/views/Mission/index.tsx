import React, { useState } from 'react';
import { 
  Rocket, RefreshCw, Plus, Folder, Edit2, Trash2, 
  Search, MapPin, Play, Save, Terminal, Pause, 
  Square, ListOrdered, ChevronDown, Map, Target
} from 'lucide-react';

const MissionControl = () => {
  // --- EMPTY STATE DATA ---
  const categories = [
    { id: 1, name: 'Default', count: 0 },
  ];

  const availableGoals: any[] = []; // Kosong
  const currentSequence: any[] = []; // Kosong
  const savedMissions: any[] = []; // Kosong

  const [activeCategory, setActiveCategory] = useState(1);

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-10">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
            <Rocket size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mission Control</h1>
            <p className="text-slate-400 font-medium text-xs mt-1 uppercase tracking-widest">
              Create, manage, and execute navigation missions
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 font-bold text-sm transition-colors flex items-center gap-2">
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
          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 flex flex-col backdrop-blur-xl shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Folder size={16} className="text-slate-400" /> Categories 
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full ml-1">1</span>
              </h2>
              <button className="text-slate-400 hover:text-white transition-colors"><Plus size={16} /></button>
            </div>
            
            <div className="space-y-2">
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex justify-between items-center p-3.5 rounded-xl cursor-pointer transition-all border ${activeCategory === cat.id ? 'bg-white/5 border-white/10 text-white' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Folder size={16} className={activeCategory === cat.id ? 'text-slate-200' : 'text-slate-500'} fill={activeCategory === cat.id ? 'currentColor' : 'none'} />
                    {cat.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white border border-white/10 bg-black/20"><Edit2 size={12} /></button>
                    <button className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-500/70 hover:text-red-400 border border-red-500/20 bg-red-500/10"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Goals Card */}
          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 flex flex-col backdrop-blur-xl shadow-xl flex-1 min-h-[350px]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Target size={16} className="text-slate-400" /> Available Goals 
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full ml-1">0</span>
              </h2>
            </div>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-slate-500" size={16} />
              <input type="text" placeholder="Search" className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:border-indigo-500 outline-none transition-colors" />
            </div>

            {/* Empty State Goals */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                <Target className="text-slate-600" size={32} />
              </div>
              <p className="text-sm text-slate-400 font-medium">No goals available</p>
              <button className="mt-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-xl text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
                <Map size={16}/> Go to Planning
              </button>
            </div>
          </div>

        </div>

        {/* --- COLUMN 2: Mission Builder (Wider) --- */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-6 flex flex-col backdrop-blur-xl shadow-xl h-full">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ListOrdered size={20} className="text-slate-400" /> Mission Builder
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full ml-1">0</span>
              </h2>
              <div className="flex gap-2.5">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-slate-300 text-xs font-bold transition-colors flex items-center gap-2">
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
                <label className="text-[11px] text-slate-500 font-medium">Mission Name</label>
                <input type="text" placeholder="Enter mission name" className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-sm focus:border-indigo-500 outline-none text-slate-200 placeholder-slate-600 transition-colors" />
              </div>
              <div className="space-y-2 relative">
                <label className="text-[11px] text-slate-500 font-medium">Category</label>
                <div className="relative">
                  <select className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-sm focus:border-indigo-500 outline-none text-slate-600 appearance-none transition-colors">
                    <option value="" disabled selected>Select Category</option>
                    <option value="default">Default</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-[11px] text-slate-500 font-medium">Description</label>
              <textarea rows={3} placeholder="Describe your mission..." className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-sm focus:border-indigo-500 outline-none text-slate-200 placeholder-slate-600 resize-none transition-colors"></textarea>
            </div>

            {/* Mission Sequence Area */}
            <div className="flex-1 flex flex-col min-h-[200px]">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-200">Mission Sequence</label>
                <div className="flex gap-4">
                  <button className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors font-medium">
                    <Trash2 size={14} /> Clear
                  </button>
                  <button className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors font-medium">
                    <Edit2 size={14} /> Optimize
                  </button>
                </div>
              </div>
              
              {/* Empty Sequence State */}
              <div className="flex-1 bg-black/20 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                <ListOrdered size={32} className="text-slate-700 mb-4" />
                <p className="text-xs text-slate-500 font-medium max-w-[200px] leading-relaxed">
                  No goals in sequence. Add goals from the left panel.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* --- COLUMN 3: Saved Missions & Execution --- */}
        <div className="flex flex-col gap-6 lg:col-span-1 h-full">
          
          {/* Saved Missions Card */}
          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 flex flex-col backdrop-blur-xl shadow-xl min-h-[250px]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Rocket size={16} className="text-slate-400" /> Missions 
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full ml-1">0</span>
              </h2>
              <div className="relative">
                <select className="bg-transparent text-xs text-slate-400 outline-none appearance-none pr-4 cursor-pointer hover:text-slate-300">
                  <option>All</option>
                </select>
                <ChevronDown size={12} className="absolute right-0 top-1 text-slate-500 pointer-events-none" />
              </div>
            </div>
            
            {/* Empty State Missions */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
              <Rocket className="text-slate-700 mb-1" size={32} />
              <p className="text-xs text-slate-500 font-medium">No missions created yet</p>
              <button className="mt-2 px-4 py-2 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl text-slate-300 text-[11px] font-bold flex items-center gap-2 transition-colors">
                <Plus size={14}/> Create Mission
              </button>
            </div>
          </div>

          {/* Execution Panel */}
          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Play size={16} className="text-slate-400" /> Execution 
                <span className="text-[10px] text-slate-500 font-medium ml-1 bg-white/5 px-2 py-0.5 rounded">Idle</span>
              </h2>
            </div>

            {/* Progress Bar (0%) */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>Progress</span>
                <span>0%</span>
              </div>
              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className="w-[0%] h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            {/* Status Grid (0/0) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Step</div>
                <div className="text-xl font-bold text-white font-mono">0<span className="text-slate-600">/0</span></div>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1">
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Completed</div>
                <div className="text-xl font-bold text-white font-mono">0<span className="text-slate-600">/0</span></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400/50 rounded-xl font-bold text-xs flex justify-center items-center gap-2 cursor-not-allowed">
                <Play size={14} fill="currentColor" /> Run All Missions
              </button>
              
              <div className="grid grid-cols-3 gap-3">
                <button className="py-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/50 rounded-lg flex justify-center items-center transition-colors cursor-not-allowed">
                  <Pause size={14} fill="currentColor" /> <span className="text-[10px] ml-1 font-bold">Pause</span>
                </button>
                <button className="py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500/50 rounded-lg flex justify-center items-center transition-colors cursor-not-allowed">
                  <Play size={14} fill="currentColor" /> <span className="text-[10px] ml-1 font-bold">Resume</span>
                </button>
                <button className="py-2.5 bg-red-500/10 border border-red-500/20 text-red-500/50 rounded-lg flex justify-center items-center transition-colors cursor-not-allowed">
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