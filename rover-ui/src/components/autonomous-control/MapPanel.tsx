import React, { useRef, useState } from 'react';

interface MapPanelProps {
  goals: Array<{ id: number; uiX: number; uiY: number; rosX: number; rosY: number }>;
  onAddGoal: (goal: any) => void;
  onClearGoals: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ goals, onAddGoal, onClearGoals }) => {
  const [interactionMode, setInteractionMode] = useState<'add' | 'view'>('view');
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (interactionMode !== 'add' || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const resolution = 0.05; 
    const rosX = ((x - rect.width / 2) * resolution).toFixed(2);
    const rosY = (-(y - rect.height / 2) * resolution).toFixed(2);

    onAddGoal({
      id: Date.now(),
      uiX: x, uiY: y,
      rosX: parseFloat(rosX), rosY: parseFloat(rosY)
    });
  };

  return (
    <div className="bg-[#111827] rounded-xl border border-white/5 p-6 shadow-2xl h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded text-[10px]">🗺️</div>
          <h3 className="text-[11px] font-bold text-white uppercase tracking-wider">Navigation Map</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button onClick={() => setInteractionMode('add')} className={`py-2 rounded text-[10px] font-bold border transition-all ${interactionMode === 'add' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-white/5 text-slate-400'}`}>✓ Add Goal</button>
        <button onClick={() => setInteractionMode('view')} className={`py-2 rounded text-[10px] font-bold border transition-all ${interactionMode === 'view' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-white/5 text-slate-400'}`}>👁 View Only</button>
        <button onClick={onClearGoals} className="py-2 rounded text-[10px] font-bold bg-red-900/20 border border-red-500/20 text-red-500 hover:bg-red-500/10">🗑 Clear All</button>
      </div>

      <div ref={mapRef} onClick={handleMapClick} className={`w-full aspect-video bg-[#0b0e11] rounded-lg border border-white/10 relative overflow-hidden transition-colors ${interactionMode === 'add' ? 'cursor-crosshair' : 'cursor-grab'}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:30px_30px]"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10 pointer-events-none"></div>

        {goals.map((goal, idx) => (
          <div key={goal.id} className="absolute text-2xl -translate-x-1/2 -translate-y-full z-10" style={{ left: goal.uiX, top: goal.uiY }}>
            📍<span className="absolute top-1 right-0 bg-white text-purple-700 text-[9px] rounded-full w-4 h-4 flex items-center justify-center translate-x-1/2 -translate-y-1/2 font-black border-2 border-purple-600">{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};