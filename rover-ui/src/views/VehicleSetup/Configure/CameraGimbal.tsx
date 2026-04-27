import React, { useState } from 'react';
import { Camera, AlertTriangle } from 'lucide-react'; // Tambahan ikon

// Tambahkan interface untuk menerima saklar isDarkMode
interface CameraGimbalProps {
  isDarkMode?: boolean;
}

const CameraGimbal: React.FC<CameraGimbalProps> = ({ isDarkMode = true }) => {
  const [maxPwm, setMaxPwm] = useState(1900);
  const [minPwm, setMinPwm] = useState(1100);
  const [maxAngle, setMaxAngle] = useState(60);
  const [minAngle, setMinAngle] = useState(-60);
  const [stabilize, setStabilize] = useState(true);

  // Perhitungan sederhana PWM per derajat
  const calculatedPwmPerDegree = ((maxPwm - minPwm) / (maxAngle - minAngle)).toFixed(2);

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const subtitleColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const inputCardBg = isDarkMode
    ? 'bg-[#0F172A] border-slate-800'
    : 'bg-slate-50 border-slate-200 shadow-sm';

  const inputFieldBg = isDarkMode
    ? 'bg-[#1A2332] border-slate-700 focus:border-blue-500 text-white'
    : 'bg-white border-slate-300 focus:border-blue-500 text-slate-900 shadow-inner';

  const warningBg = isDarkMode
    ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
    : 'bg-yellow-50 border-yellow-200 text-yellow-700';

  return (
    <div className={`p-4 md:p-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      <div className={`max-w-4xl mx-auto rounded-2xl border p-6 md:p-8 transition-colors duration-300 ${cardBg}`}>
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <div className={`p-3 rounded-xl shrink-0 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <Camera size={28} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-1">Camera Gimbal Configuration</h2>
            <p className={`text-xs leading-relaxed max-w-2xl transition-colors duration-300 ${subtitleColor}`}>
              Pitch control for the camera gimbal requires specifying the PWM limits of the gimbal servo motor, 
              and their relationship with its tilt angle range.
            </p>
          </div>
        </div>

        {/* Base Configuration */}
        <div className={`border p-6 rounded-xl mb-6 transition-all duration-300 ${inputCardBg}`}>
          <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Mount 1 Pitch Servo</label>
          <select className={`w-full text-sm font-bold rounded-lg p-3 outline-none cursor-pointer transition-colors duration-300 mb-6 ${inputFieldBg}`}>
            <option>Servo 16 (Mount1Pitch)</option>
          </select>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer sr-opacity w-5 h-5 opacity-0 absolute cursor-pointer" />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isDarkMode ? 'border-slate-500 peer-checked:bg-blue-500 peer-checked:border-blue-500' : 'border-slate-300 peer-checked:bg-blue-600 peer-checked:border-blue-600'}`}>
                  <svg className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span className={`transition-colors duration-300 group-hover:text-blue-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Reverse servo direction</span>
            </label>

            <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={stabilize} 
                  onChange={() => setStabilize(!stabilize)} 
                  className="peer sr-opacity w-5 h-5 opacity-0 absolute cursor-pointer" 
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isDarkMode ? 'border-slate-500 peer-checked:bg-blue-500 peer-checked:border-blue-500' : 'border-slate-300 peer-checked:bg-blue-600 peer-checked:border-blue-600'}`}>
                  <svg className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <span className={`transition-colors duration-300 group-hover:text-blue-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Stabilize mount</span>
            </label>
          </div>
        </div>

        {/* Step 1: Physical Limits */}
        <div className={`border p-6 rounded-xl mb-6 transition-all duration-300 ${inputCardBg}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>1</span>
            <h3 className="font-black uppercase tracking-wider text-sm">Find the physical limits</h3>
          </div>
          <p className={`text-[11px] mb-5 leading-relaxed transition-colors duration-300 ${mutedColor}`}>
            Move the camera to the minimum and maximum positions, then adjust the minimum/maximum PWMs 
            until it reaches the furthest it can move without hitting other components.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Max PWM</label>
              <input type="number" value={maxPwm} onChange={(e) => setMaxPwm(Number(e.target.value))} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Min PWM</label>
              <input type="number" value={minPwm} onChange={(e) => setMinPwm(Number(e.target.value))} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
            </div>
          </div>
          <div className={`flex items-start gap-2.5 p-3.5 rounded-lg border transition-colors duration-300 ${warningBg}`}>
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              The gimbal will move to the new PWM values as you adjust them.
            </p>
          </div>
        </div>

        {/* Step 2: Measure Angles */}
        <div className={`border p-6 rounded-xl transition-all duration-300 ${inputCardBg}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>2</span>
            <h3 className="font-black uppercase tracking-wider text-sm">Measure the actual angles</h3>
          </div>
          <p className={`text-[11px] mb-5 leading-relaxed transition-colors duration-300 ${mutedColor}`}>
            Measure the found limits and input them below. This will allow ArduPilot to know how to convert PWM to angle.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Max Angle (deg)</label>
              <input type="number" value={maxAngle} onChange={(e) => setMaxAngle(Number(e.target.value))} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
            </div>
            <div>
              <label className={`text-[10px] font-bold uppercase tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Min Angle (deg)</label>
              <input type="number" value={minAngle} onChange={(e) => setMinAngle(Number(e.target.value))} className={`w-full text-sm font-bold rounded-lg p-2.5 outline-none transition-colors duration-300 ${inputFieldBg}`} />
            </div>
          </div>
          <div className={`text-[11px] font-bold uppercase tracking-widest pt-4 border-t border-slate-700/30 transition-colors duration-300 ${mutedColor}`}>
            Calculated PWM/degree: <span className={`font-mono text-sm ml-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{calculatedPwmPerDegree}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CameraGimbal;