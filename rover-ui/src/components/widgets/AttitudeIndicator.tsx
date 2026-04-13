import React from 'react';

interface Props {
  pitch: number;
  roll: number;
}

export const AttitudeIndicator: React.FC<Props> = ({ pitch, roll }) => {
  return (
    // Dibuat bersih tanpa background/border luar, ukurannya full (100%) mengikuti bungkusnya
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-slate-700 bg-blue-900 shadow-inner">
        
        {/* Pitch & Roll Overlay */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `rotate(${-roll}deg) translateY(${pitch * 2}px)` 
          }}
        >
          {/* Garis Horizon */}
          <div className="absolute top-1/2 w-full h-[2px] bg-white/70 shadow-sm"></div>
          {/* Area Tanah (Simulasi) */}
          <div className="absolute top-1/2 w-full h-full bg-[#3d2c40]/80"></div>
        </div>
        
        {/* Crosshair Tengah */}
        <div className="absolute inset-0 flex items-center justify-center drop-shadow-md">
          <div className="w-[30%] h-[3px] bg-green-500 rounded-full"></div>
          <div className="w-[3px] h-[30%] bg-green-500 rounded-full"></div>
        </div>
        
      </div>
    </div>
  );
};