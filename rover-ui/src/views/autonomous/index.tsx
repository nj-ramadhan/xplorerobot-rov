import React, { useState } from 'react';

export const Autonomous: React.FC = () => {
  const [interactionMode, setInteractionMode] = useState<'add' | 'view'>('view');
  const [goals, setGoals] = useState<any[]>([]);
  const [mapName, setMapName] = useState('polman_underwater_lab');

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-4 gap-4">
        <div>
          <h2 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-3">
            <span className="bg-purple-600 p-2 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)]">📍</span>
            Goal Planning
          </h2>
          <p className="text-[11px] font-mono text-slate-400 mt-2 uppercase tracking-widest">
            Navigation Control System · NAV2 Integrated
          </p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-800 text-white text-[10px] font-bold rounded border border-white/5 hover:bg-slate-700 transition-all uppercase">Export Goals</button>
           <button className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded shadow-lg hover:bg-blue-500 transition-all uppercase">Import Goals</button>
        </div>
      </div>

      {/* MODUL GOAL PLANNING (INFO BOX) */}
      <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-xl flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-lg text-xl">🎯</div>
        <div>
          <h3 className="text-white font-bold text-sm">Goal Planning</h3>
          <p className="text-slate-400 text-xs mt-1">Click on the map to place navigation goals. Set waypoints for your robot's mission.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL KIRI: NAVIGATION MAP (8 Kolom) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#111827] rounded-xl border border-white/5 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 rounded text-[10px]">🗺️</div>
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Navigation Map</h3>
               </div>
               <span className="text-[9px] font-mono text-slate-500 italic">Interactive map for goal placement</span>
            </div>

            {/* Interaction Mode Buttons - SEKARANG KEDUANYA UNGU JIKA AKTIF */}
            <div className="grid grid-cols-3 gap-2 mb-4">
               <button 
                  onClick={() => setInteractionMode('add')}
                  className={`py-2 rounded text-[10px] font-bold border transition-all ${
                    interactionMode === 'add' 
                    ? 'bg-purple-600 border-purple-500 text-white' // Aktif: Ungu
                    : 'bg-slate-800 border-white/5 text-slate-400 hover:border-purple-500/30 hover:text-purple-300' // Tidak Aktif: Gelap (Hover Ungu Tipis)
                  }`}
               >
                  ✓ Add Goal
               </button>
               <button 
                  onClick={() => setInteractionMode('view')}
                  className={`py-2 rounded text-[10px] font-bold border transition-all ${
                    interactionMode === 'view' 
                    ? 'bg-purple-600 border-purple-500 text-white' // Aktif: SEKARANG UNGU JUGAAAA!
                    : 'bg-slate-800 border-white/5 text-slate-400 hover:border-purple-500/30 hover:text-purple-300' // Tidak Aktif: Gelap (Hover Ungu Tipis)
                  }`}
               >
                  👁 View Only
               </button>
               <button 
                  onClick={() => setGoals([])}
                  className="py-2 rounded text-[10px] font-bold bg-red-900/20 border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-all"
               >
                  🗑 Clear All
               </button>
            </div>

            {/* CANVAS MAP PLACEHOLDER */}
            <div className="w-full aspect-video bg-black/50 rounded-lg border border-white/5 relative flex items-center justify-center overflow-hidden">
               {/* Grid Pattern Background */}
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>
               
               {/* Legend Mock */}
               <div className="absolute top-4 left-4 bg-black/80 p-3 rounded border border-white/10 space-y-2 text-[9px] font-mono">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white rounded-sm"></div> Free Space</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-700 rounded-sm"></div> Obstacle</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-900 rounded-sm"></div> Unknown</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-sm shadow-[0_0_5px_#22c55e]"></div> Goal Point</div>
               </div>

               <div className="text-center z-10">
                  <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest">Waiting for ROS Bridge Map Data...</p>
                  <p className="text-[9px] text-slate-700 mt-1">Topic: /map</p>
               </div>

               {/* Map Controls Mock */}
               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                  <button className="w-8 h-8 bg-slate-800 rounded border border-white/10 text-white hover:bg-slate-700">+</button>
                  <button className="w-8 h-8 bg-slate-800 rounded border border-white/10 text-white hover:bg-slate-700">-</button>
                  <button className="w-8 h-8 bg-slate-800 rounded border border-white/10 text-white hover:bg-slate-700">target</button>
               </div>
            </div>

            {/* Map Stats Bottom */}
            <div className="grid grid-cols-4 gap-4 mt-6">
               {[
                 { label: 'Map Dimensions', val: '0 x 0 px', icon: '📐' },
                 { label: 'Resolution', val: '0.000 m/px', icon: '💠' },
                 { label: 'Origin', val: '{0, 0}', icon: '🧿' },
                 { label: 'Cursor Position', val: 'Hover over map', icon: '↖️' },
               ].map((stat, i) => (
                 <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="text-[8px] text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                       <span>{stat.icon}</span> {stat.label}
                    </div>
                    <div className="text-[10px] font-mono text-white font-bold">{stat.val}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* PANEL KANAN (4 Kolom) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Planned Goals List */}
          <div className="bg-[#111827] p-6 rounded-xl border border-white/5 shadow-lg">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-600 rounded text-[10px]">📋</div>
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Planned Goals</h3>
               </div>
               <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black text-white">{goals.length} GOALS</span>
            </div>

            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-white/5 rounded-xl">
               <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 mb-4 text-xl">📍</div>
               <h4 className="text-xs font-bold text-white">No Goals Set</h4>
               <p className="text-[9px] text-slate-500 mt-2 max-w-[150px]">Click on the map in "Add Goal" mode to place your first waypoint.</p>
               <button className="mt-6 px-4 py-2 border border-white/10 hover:border-white/20 rounded text-[9px] font-bold text-white transition-all">🖋 Add Sample Goals</button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
               <button className="p-2 bg-slate-800 rounded text-[8px] font-bold text-slate-400 border border-white/5">Save to DB</button>
               <button className="p-2 bg-slate-800 rounded text-[8px] font-bold text-slate-400 border border-white/5">Load from DB</button>
               <button className="p-2 bg-slate-800 rounded text-[8px] font-bold text-slate-400 border border-white/5">Export JSON</button>
            </div>
          </div>

          {/* QUICK ACTIONS PANEL (Sesuai gambar referensi) */}
          <div className="bg-[#111827] p-6 rounded-xl border border-white/5 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
               <div className="p-1.5 bg-blue-600 rounded text-[10px]">⚡</div>
               <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Quick Actions</h3>
            </div>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-2">Map Name:</label>
                  <input 
                     type="text" 
                     value={mapName}
                     onChange={(e) => setMapName(e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[8px] text-slate-600 mt-1.5">File extensions (.yaml, .pgm) will be added automatically</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Center Map', desc: 'Reset map view', icon: '🎯' },
                    { label: 'Test Connection', desc: 'Verify ROS bridge', icon: '🌐' },
                    { label: 'Save Map', desc: 'Save as PGM/YAML', icon: '💾' },
                    { label: 'Help', desc: 'View documentation', icon: '❓' },
                  ].map((action, i) => (
                    <button key={i} className="bg-black/30 p-3 rounded-xl border border-white/5 text-center hover:bg-blue-600/10 hover:border-blue-500/30 transition-all group">
                       <div className="text-lg mb-1.5">{action.icon}</div>
                       <div className="text-[10px] font-bold text-white group-hover:text-blue-400">{action.label}</div>
                       <div className="text-[8px] text-slate-600 mt-0.5">{action.desc}</div>
                    </button>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Autonomous;