import React, { useState } from 'react';

const PwmOutputs = () => {
  const [motorValues, setMotorValues] = useState([1500, 1644, 1500]);
  const [armed, setArmed] = useState(false);

  const handleSliderChange = (index: number, val: number) => {
    const newValues = [...motorValues];
    newValues[index] = val;
    setMotorValues(newValues);
  };

  return (
    <div className="p-8 text-slate-200 max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Section: 3D Model Viewer */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-[#0F172A] border border-slate-700 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center relative shadow-inner">
            <p className="text-slate-500 font-medium tracking-widest text-sm uppercase">3D Model Viewport</p>
          </div>

          {/* Motor Test Controls */}
          <div className="mt-8 bg-[#1A2332] rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${armed ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`}></span>
                Motor Test
              </h3>
              <button 
                onClick={() => setArmed(!armed)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all border ${armed 
                  ? 'bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20' 
                  : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-700'}`}
              >
                {armed ? 'ARMED (SYSTEM LIVE)' : 'SYSTEM DISARMED'}
              </button>
            </div>

            <div className="space-y-8">
              {motorValues.map((val, i) => (
                <div key={i} className="flex items-center gap-6">
                  <span className="w-16 text-sm font-semibold text-slate-300">Motor {i + 1}</span>
                  
                  {/* Slider yang lebih menonjol */}
                  <input 
                    type="range" 
                    min="1100" 
                    max="1900" 
                    value={val} 
                    disabled={!armed} // Logic disabled
                    onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                    className={`w-full h-3 rounded-lg appearance-none cursor-pointer transition-all 
                      ${!armed ? 'opacity-30 cursor-not-allowed grayscale' : 'opacity-100'} 
                      bg-slate-700 accent-blue-500 hover:accent-blue-400`}
                  />
                  
                  <span className={`w-20 text-right font-mono text-sm font-bold p-2 rounded bg-[#0F172A] border ${!armed ? 'text-slate-600 border-slate-800' : 'text-blue-400 border-blue-900/50'}`}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Status */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#1A2332] rounded-2xl border border-slate-700 p-6 h-full">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Channel Status</h3>
            <div className="space-y-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0 px-2 rounded hover:bg-slate-800/50 transition-colors">
                  <span className="text-xs text-slate-500">Output {i + 1}</span>
                  <span className="text-sm font-mono text-slate-300">1500</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PwmOutputs;