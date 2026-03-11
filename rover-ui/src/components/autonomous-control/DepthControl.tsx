import React from 'react';

interface DepthControlProps {
  targetDepth: number;
  setTargetDepth: (val: number) => void;
}

export const DepthControl: React.FC<DepthControlProps> = ({ targetDepth, setTargetDepth }) => {
  return (
    <div className="mb-6 p-4 bg-black/40 rounded-lg border border-blue-500/20">
      <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-2">
        Target Depth (Z): <span className="text-white font-mono">{targetDepth.toFixed(1)} m</span>
      </label>
      <input 
        type="range" min="-10" max="0" step="0.5" 
        value={targetDepth} 
        onChange={(e) => setTargetDepth(parseFloat(e.target.value))} 
        className="w-full accent-blue-500" 
      />
    </div>
  );
};