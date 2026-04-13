import React from 'react';

const PlottingTab = () => {
  return (
    <>
      <div className="text-center text-gray-400 text-sm mb-4 italic">Click to enter Plot title</div>
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-700 font-mono">
          <div className="w-4 h-0.5 bg-blue-600"></div> ATT.Roll
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 font-mono">
          <div className="w-4 h-0.5 bg-orange-500"></div> ATT.Pitch
        </div>
      </div>

      <div className="flex-1 border border-red-200 bg-red-50/10 relative flex items-end justify-center pb-8 rounded">
        {/* Y Axis Left */}
        <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-red-200 flex flex-col justify-between py-4 text-[10px] text-red-400 text-center bg-white/50 z-10">
          <span className="writing-vertical-lr rotate-180 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 font-bold tracking-widest uppercase text-xs">ATT.Roll, ATT.Pitch</span>
          <span>MANUAL</span>
        </div>
        
        {/* Y Axis Right */}
        <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-red-200 flex flex-col justify-between py-4 text-[10px] text-red-400 text-center bg-white/50 z-10">
          <span>STABILIZE</span>
          <span>MANUAL</span>
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 left-8 right-8 flex flex-col justify-between pointer-events-none py-8">
          {[...Array(6)].map((_,i) => <div key={i} className="border-b border-gray-100 w-full h-0"></div>)}
        </div>

        {/* SVG Graph Dummy */}
        <svg className="absolute inset-0 left-8 right-8 w-[calc(100%-4rem)] h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,50 L10,50 L12,20 L15,80 L20,30 L25,70 L30,45 L35,55 L40,50 L55,50 L60,10 L65,80 L70,40 L75,60 L80,50 L100,50" fill="none" stroke="#2563eb" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <path d="M0,60 L10,60 L12,30 L15,90 L20,40 L25,80 L30,55 L35,65 L40,60 L55,60 L60,20 L65,90 L70,50 L75,70 L80,60 L100,60" fill="none" stroke="#f97316" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      {/* Bottom Timeline Preview */}
      <div className="h-16 mt-6 border border-gray-200 relative rounded overflow-hidden">
        <svg className="w-full h-full bg-gray-50" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M10,50 L12,20 L15,80 L20,30 L25,70 L30,45" fill="none" stroke="#2563eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-y-0 left-[10%] right-[40%] bg-blue-500/10 border-x-2 border-blue-500 cursor-ew-resize"></div>
      </div>
      <div className="text-center text-[10px] text-gray-400 mt-2 tracking-wider">TIME (BOOT) (MS)</div>
    </>
  );
};

export default PlottingTab;