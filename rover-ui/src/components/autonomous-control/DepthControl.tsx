import React from 'react';

interface DepthControlProps {
  targetDepth: number;
  setTargetDepth: (val: number) => void;
}

export const DepthControl: React.FC<DepthControlProps> = ({ targetDepth, setTargetDepth }) => {
  return (
    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
          Target Depth (Z)
        </label>
        <span className="text-[11px] font-mono text-white bg-white/10 px-2 py-0.5 rounded">
          {targetDepth.toFixed(1)} m
        </span>
      </div>
      <input
        type="range"
        min="-10"
        max="0"
        step="0.5"
        value={targetDepth}
        onChange={(e) => setTargetDepth(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
      />
      <div className="flex justify-between text-[9px] text-slate-600 mt-1">
        <span>−10 m</span>
        <span>0 m (permukaan)</span>
      </div>
    </div>
  );
};