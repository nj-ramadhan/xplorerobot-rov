import React from 'react';
import { 
  LayoutGrid, Target, RefreshCw, Plus, Folder, 
  Search, Trash2, Edit3, Play, Pause, Square, 
  Navigation, ClipboardList, CheckCircle2, AlertCircle 
} from 'lucide-react';

const DUMMY_LOGS = [
  { id: 1, type: 'success', time: '11:53:45 PM', msg: 'All data loaded successfully' },
  { id: 2, type: 'error', time: '11:53:45 PM', msg: 'Failed to load goals: Failed to fetch' },
  { id: 3, type: 'error', time: '11:53:45 PM', msg: 'Failed to load missions: Failed to fetch' },
  { id: 4, type: 'error', time: '11:53:45 PM', msg: 'Failed to load goal sets: Failed to fetch' },
  { id: 5, type: 'error', time: '11:53:45 PM', msg: 'Failed to load categories: Failed to fetch' },
  { id: 6, type: 'success', time: '11:53:42 PM', msg: 'ROS topics initialized' },
];

const MissionControl = () => {
  return (
    /* h-[calc(100vh-180px)] memastikan konten tidak melebihi tinggi layar dikurangi navbar/footer */
    <div className="flex flex-col h-[calc(100vh-180px)] gap-4 animate-in fade-in duration-500">
      
      {/* HEADER - Dibuat lebih ramping */}
      <div className="flex-none flex items-center justify-between bg-white/[0.03] p-4 rounded-xl border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">Mission Control</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Navigation Control System & Planner</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-slate-300 transition-all">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-xs text-white font-medium shadow-lg shadow-indigo-500/20 transition-all">
            <Plus size={14} /> New Mission
          </button>
        </div>
      </div>

      {/* DASHBOARD GRID - flex-1 agar mengisi sisa ruang */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* KOLOM 1: Categories & Available Goals */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <Card title="Categories" badge="1" height="h-auto">
            <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2 text-sm">
                <Folder size={16} className="text-indigo-400" />
                <span className="truncate">Default</span>
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-slate-500 hover:text-indigo-400"><Edit3 size={12} /></button>
                <button className="p-1 text-slate-500 hover:text-red-400"><Trash2 size={12} /></button>
              </div>
            </div>
          </Card>

          <Card title="Available Goals" badge="0" height="flex-1" scrollable>
            <div className="relative mb-3">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search..." className="w-full bg-black/20 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[11px] focus:border-indigo-500 outline-none" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-slate-600 p-4">
              <Target size={24} className="mb-2 opacity-20" />
              <p className="text-[10px] text-center">No goals available</p>
            </div>
          </Card>
        </div>

        {/* KOLOM 2: Mission Builder & Sequence */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0">
          <Card title="Mission Builder" height="h-auto" extra={<button className="text-[9px] bg-indigo-600 px-3 py-1 rounded-full font-bold uppercase">Start</button>}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-slate-500 font-bold">Mission Name</label>
                <input type="text" placeholder="Mission Alpha" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs focus:border-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase text-slate-500 font-bold">Category</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs outline-none">
                  <option>Default</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase text-slate-500 font-bold">Description</label>
              <textarea placeholder="Objectives..." className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs h-14 resize-none focus:border-indigo-500 outline-none"></textarea>
            </div>
          </Card>

          <Card title="Mission Sequence" height="flex-1" scrollable>
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-slate-600 italic p-4 text-center">
              <p className="text-[10px]">Add goals here to build a sequence</p>
            </div>
          </Card>
        </div>

        {/* KOLOM 3: Execution & Logs */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <Card title="Execution" height="h-auto" extra={<span className="text-[9px] text-slate-500 uppercase">Idle</span>}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[9px] mb-1.5 font-bold text-slate-500 uppercase tracking-tighter">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="w-0 h-full bg-indigo-500 transition-all duration-500"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/20 p-2 rounded-lg border border-white/5 text-center">
                  <p className="text-[8px] text-slate-500 uppercase">Step</p>
                  <p className="text-sm font-mono font-bold">0/0</p>
                </div>
                <div className="bg-black/20 p-2 rounded-lg border border-white/5 text-center">
                  <p className="text-[8px] text-slate-500 uppercase">Completed</p>
                  <p className="text-sm font-mono font-bold text-indigo-400">0/0</p>
                </div>
              </div>
              <button className="w-full bg-indigo-600/10 text-indigo-400 py-2 rounded-lg border border-indigo-500/20 text-[10px] font-bold opacity-50 cursor-not-allowed hover:bg-indigo-600/20 transition-all">
                RUN ALL MISSIONS
              </button>
              <div className="flex gap-1.5">
                <button className="flex-1 py-1.5 rounded bg-white/5 border border-white/5 text-amber-500 flex justify-center hover:bg-white/10"><Pause size={12} /></button>
                <button className="flex-1 py-1.5 rounded bg-white/5 border border-white/5 text-emerald-500 flex justify-center hover:bg-white/10"><Play size={12} /></button>
                <button className="flex-1 py-1.5 rounded bg-white/5 border border-white/5 text-red-500 flex justify-center hover:bg-white/10"><Square size={12} /></button>
              </div>
            </div>
          </Card>

          <Card title="Logs" badge="6" height="flex-1" scrollable icon={<ClipboardList size={14} className="text-slate-500" />}>
            <div className="space-y-1.5">
              {DUMMY_LOGS.map(log => (
                <div key={log.id} className={`flex items-start gap-2 p-2 rounded-lg border-l-2 bg-black/30 transition-all hover:bg-white/[0.02] ${
                  log.type === 'success' ? 'border-emerald-500/50' : 'border-red-500/50'
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-200 leading-tight break-words">{log.msg}</p>
                    <p className="text-[8px] font-mono text-slate-500 mt-1 uppercase">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

// Sub-komponen Card yang Fleksibel
const Card = ({ title, children, badge, extra, icon, height = "h-auto", scrollable = false }: any) => (
  <div className={`bg-[#111827]/40 border border-white/5 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm flex flex-col min-h-0 ${height}`}>
    <div className="flex-none px-4 py-2.5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">{title}</h3>
        {badge && <span className="bg-indigo-500/20 text-indigo-400 text-[8px] px-1.5 py-0.5 rounded-full border border-indigo-500/30 font-mono">{badge}</span>}
      </div>
      {extra}
    </div>
    <div className={`p-4 flex-1 flex flex-col min-h-0 ${scrollable ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>
      {children}
    </div>
  </div>
);

export default MissionControl;