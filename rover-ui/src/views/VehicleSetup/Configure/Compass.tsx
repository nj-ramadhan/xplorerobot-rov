import React, { useState } from 'react';
import { Navigation } from 'lucide-react'; // Tambahan ikon biar seragam

// Tambahkan interface untuk menerima saklar isDarkMode
interface CompassProps {
  isDarkMode?: boolean;
}

const Compass: React.FC<CompassProps> = ({ isDarkMode = true }) => {
  const [autoDeclination, setAutoDeclination] = useState(true);
  const [activeTab, setActiveTab] = useState('full');
  const [status, setStatus] = useState('');

  const handleStartCalibration = () => {
    setStatus('Calibrating... please rotate the vehicle in all axes.');
    setTimeout(() => setStatus('Calibration finished.'), 5000);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-200';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const innerBoxBg = isDarkMode 
    ? 'bg-[#0F172A] border-slate-800' 
    : 'bg-slate-50 border-slate-200 shadow-sm';

  const svgGridColor = isDarkMode ? '#334155' : '#cbd5e1';
  const divideColor = isDarkMode ? 'divide-slate-700' : 'divide-slate-200';
  
  const tableHeaderBorder = isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500';
  const tableRowBorder = isDarkMode ? 'border-slate-800/50 text-slate-400' : 'border-slate-100 text-slate-600';

  return (
    <div className={`flex flex-col lg:flex-row gap-6 pt-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      
      {/* =========================================================
          KOLOM KIRI: Visual & Status Sensor
          ========================================================= */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Visual Compass Rose */}
        <div className={`rounded-2xl border p-6 flex flex-col items-center transition-colors duration-300 ${cardBg}`}>
          <div className="relative w-48 h-48 mb-6">
            {/* SVG Compass Rose (Warna dinamis) */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke={svgGridColor} strokeWidth="1" className="transition-colors duration-300" />
              <text x="50" y="12" className="fill-blue-500 text-[8px] font-bold" textAnchor="middle" transform="rotate(90 50 12)">N</text>
              <text x="88" y="50" className={`text-[8px] transition-colors duration-300 ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`} textAnchor="middle" transform="rotate(90 88 50)">E</text>
              <text x="50" y="88" className={`text-[8px] transition-colors duration-300 ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`} textAnchor="middle" transform="rotate(90 50 88)">S</text>
              <text x="12" y="50" className={`text-[8px] transition-colors duration-300 ${isDarkMode ? 'fill-slate-500' : 'fill-slate-400'}`} textAnchor="middle" transform="rotate(90 12 50)">W</text>
              {/* Needle Simulation */}
              <line x1="50" y1="50" x2="80" y2="50" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-orange-500 font-mono font-bold tracking-widest drop-shadow-sm">LSM303D</span>
              <span className="text-[10px] text-blue-500 font-mono font-bold tracking-widest drop-shadow-sm">UAVCAN</span>
            </div>
          </div>

          {/* Declination Settings */}
          <div className={`w-full border-t pt-5 transition-colors duration-300 ${borderColor}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Declination</h3>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[11px] font-bold transition-colors duration-300 ${mutedColor}`}>Auto Declination</span>
              <button 
                onClick={() => setAutoDeclination(!autoDeclination)}
                className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${
                  autoDeclination 
                    ? 'bg-blue-600' 
                    : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')
                }`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm ${autoDeclination ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className={`flex justify-between items-center text-[11px] font-bold transition-colors duration-300 ${mutedColor}`}>
              <span>Current Declination</span>
              <span className={`font-mono transition-colors duration-300 ${textColor}`}>0.00</span>
            </div>
          </div>
        </div>

        {/* Sensor Status List */}
        <div className="space-y-3">
          {[
            { id: 1, name: 'UAVCAN', type: 'EXTERNAL', status: 'CALIBRATED (QUICK)' },
            { id: 2, name: 'LSM303D', type: 'INTERNAL', status: 'CALIBRATED (QUICK)' },
            { id: 3, name: 'AK8963', type: 'INTERNAL', status: 'CALIBRATED (QUICK)' },
          ].map((sensor) => (
            <div key={sensor.id} className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition-colors duration-300 ${innerBoxBg}`}>
              <div className="w-1.5 h-10 bg-orange-500 rounded-full shadow-sm" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[11px] text-blue-500 font-black uppercase tracking-widest">{sensor.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider transition-colors duration-300 ${isDarkMode ? 'bg-yellow-900/40 text-yellow-500' : 'bg-yellow-100 text-yellow-700'}`}>
                    {sensor.status}
                  </span>
                </div>
                <div className={`text-[10px] font-bold tracking-widest transition-colors duration-300 ${mutedColor}`}>
                  {sensor.id}ST ({sensor.type})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          KOLOM KANAN: Calibration Controls
          ========================================================= */}
      <div className="flex-1 space-y-6">
        
        {/* Accordion Card */}
        <div className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${cardBg}`}>
          <div className={`p-5 border-b flex justify-between items-center transition-colors duration-300 ${borderColor}`}>
            <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <Navigation size={18} />
              </div>
              Compass Calibration
            </h2>
          </div>

          {/* Accordion Items */}
          <div className={`divide-y transition-colors duration-300 ${divideColor}`}>
            {/* Full Calibration */}
            <div className="p-5">
              <button 
                onClick={() => setActiveTab(activeTab === 'full' ? '' : 'full')}
                className="flex justify-between items-center w-full text-sm font-bold tracking-wide mb-2 hover:text-blue-500 transition-colors"
              >
                FULL (ONBOARD) CALIBRATION
                <span className={`text-xl transition-transform duration-300 ${activeTab === 'full' ? 'rotate-45 text-red-500' : 'text-blue-500'}`}>+</span>
              </button>
              
              <div className={`grid transition-all duration-300 ease-in-out ${activeTab === 'full' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className={`text-xs leading-relaxed mb-5 font-medium transition-colors duration-300 ${mutedColor}`}>
                    This does a full calibration of the compasses. It requires you to spin the vehicle around manually multiple times. 
                    You need to move the vehicle around in all 3 axis.
                  </p>
                  <button 
                    onClick={handleStartCalibration}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-widest uppercase py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                  >
                    START FULL CALIBRATION
                  </button>
                </div>
              </div>
            </div>

            {/* Other Options (Placeholder) */}
            {['Large Vehicle Calibration', 'Compass Learn', 'Log-based Calibration (Coming soon)'].map((label) => (
              <div key={label} className="p-5">
                <button className={`flex justify-between items-center w-full text-sm font-bold tracking-wide cursor-not-allowed transition-colors duration-300 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                  {label.toUpperCase()}
                  <span className="text-xl">+</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status Text Area */}
        <div className="h-10 flex items-center justify-center">
          {status && (
            <div className={`px-5 py-2 rounded-full border shadow-sm transition-all duration-300 ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'}`}>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${status.includes('Calibrating') ? 'text-blue-500 animate-pulse' : 'text-emerald-500'}`}>
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Settings Table */}
        <div className={`rounded-2xl border p-6 transition-colors duration-300 ${cardBg}`}>
           <h3 className="text-xs font-black mb-5 uppercase tracking-widest text-blue-500">UAVCAN Settings</h3>
           <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-xs text-left">
                <thead>
                  <tr className={`border-b transition-colors duration-300 ${tableHeaderBorder}`}>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Name</th>
                    <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-right">Value</th>
                  </tr>
                </thead>
                <tbody className={`font-mono transition-colors duration-300 ${tableRowBorder}`}>
                  {['COMPASS_DIA_X', 'COMPASS_DIA_Y', 'COMPASS_DIA_Z'].map((param) => (
                    <tr key={param} className={`border-b transition-colors duration-200 ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`}>
                      <td className="py-3.5 font-bold text-blue-500">{param}</td>
                      <td className="py-3.5 text-right font-medium">1.00</td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Compass;