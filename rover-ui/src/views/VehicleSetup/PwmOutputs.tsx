import React, { useState } from 'react';

// Tambahkan interface agar bisa menerima saklar 'isDarkMode' dari index.tsx
interface PwmOutputsProps {
  isDarkMode?: boolean;
}

export default function PwmOutputs({ isDarkMode = true }: PwmOutputsProps) {
  const [motorValues, setMotorValues] = useState([1500, 1644, 1500]);
  const [armed, setArmed] = useState(false);

  const handleSliderChange = (index: number, val: number) => {
    const newValues = [...motorValues];
    newValues[index] = val;
    setMotorValues(newValues);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const valueColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  
  // Background Cards (Putih solid untuk Light Mode)
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-lg' 
    : 'bg-white border-slate-200 shadow-md';
    
  // Background untuk Viewport (Lebih gelap dari card)
  const viewportBg = isDarkMode
    ? 'bg-black/40 border-white/10'
    : 'bg-slate-50 border-slate-200 shadow-inner';

  // Background untuk input angka slider
  const inputBg = isDarkMode
    ? 'bg-black/30 border-white/10 text-slate-300'
    : 'bg-white border-slate-300 text-slate-800 shadow-sm';

  // List Item Status
  const listItemBorder = isDarkMode ? 'border-slate-800/50' : 'border-slate-100';
  const listHoverBg = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50';

  return (
    <div className="p-2 w-full animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: 3D Model Viewer & Controls */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
          
          {/* 3D Viewport */}
          <div className={`border rounded-3xl p-6 min-h-[400px] flex flex-col items-center justify-center relative transition-colors duration-300 ${viewportBg}`}>
            <p className={`font-mono text-sm tracking-widest uppercase transition-colors duration-300 ${mutedColor}`}>
              [ 3D Model Viewport ]
            </p>
          </div>

          {/* Motor Test Controls */}
          <div className={`border rounded-3xl p-8 transition-colors duration-300 ${cardBg}`}>
            <div className="flex justify-between items-center mb-8 border-b pb-6 border-slate-500/20">
              <h3 className={`font-heading text-xl font-bold flex items-center gap-3 transition-colors duration-300 ${titleColor}`}>
                <span className={`w-3 h-3 rounded-full animate-pulse ${armed ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-400'}`}></span>
                Motor Test
              </h3>
              <button 
                onClick={() => setArmed(!armed)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border tracking-widest uppercase shadow-sm ${
                  armed 
                    ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20' 
                    : (isDarkMode ? 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200')
                }`}
              >
                {armed ? 'Armed (System Live)' : 'System Disarmed'}
              </button>
            </div>

            <div className="space-y-8">
              {motorValues.map((val, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <span className={`w-20 text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${labelColor}`}>
                    Motor {i + 1}
                  </span>
                  
                  {/* Slider */}
                  <input 
                    type="range" 
                    min="1100" 
                    max="1900" 
                    value={val} 
                    disabled={!armed}
                    onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all focus:outline-none 
                      ${!armed ? 'opacity-40 cursor-not-allowed grayscale' : 'opacity-100'} 
                      ${isDarkMode ? 'bg-slate-700 accent-blue-500' : 'bg-slate-200 accent-blue-600'}
                    `}
                  />
                  
                  {/* Output Value */}
                  <span className={`w-24 text-center font-mono text-sm font-bold p-2.5 rounded-xl border transition-colors duration-300 ${
                    !armed 
                      ? (isDarkMode ? 'text-slate-500 border-slate-700/50 bg-black/20' : 'text-slate-400 border-slate-200 bg-slate-50')
                      : (isDarkMode ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-blue-700 border-blue-300 bg-blue-50')
                  }`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Status */}
        <div className="col-span-1 lg:col-span-4">
          <div className={`border rounded-3xl p-8 h-full transition-colors duration-300 ${cardBg}`}>
            <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-6 pb-4 border-b border-slate-500/20 transition-colors duration-300 ${labelColor}`}>
              Channel Status
            </h3>
            
            {/* Scrollable list area */}
            <div className="space-y-1 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {[...Array(15)].map((_, i) => (
                <div key={i} className={`flex justify-between items-center py-3.5 border-b last:border-0 px-3 rounded-xl transition-colors duration-200 cursor-default ${listItemBorder} ${listHoverBg}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${labelColor}`}>
                    Output {i + 1}
                  </span>
                  <span className={`text-sm font-mono font-bold transition-colors duration-300 ${valueColor}`}>
                    1500
                  </span>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}