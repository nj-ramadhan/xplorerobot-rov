import React, { useState } from 'react';
import { Move3d, CheckCircle2, ThermometerSun } from 'lucide-react'; // Tambahan icon biar modern

// Tambahkan interface untuk menerima saklar isDarkMode
interface AccelerometerProps {
  isDarkMode?: boolean;
}

const Accelerometer: React.FC<AccelerometerProps> = ({ isDarkMode = true }) => {
  const [status, setStatus] = useState('');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const startCalibration = (type: 'Full' | 'Quick') => {
    setIsCalibrating(true);
    setStatus(`Calibrating (${type})...`);
    
    // Simulasi proses kalibrasi
    setTimeout(() => {
      setIsCalibrating(false);
      setStatus(`Calibration (${type}) done.`);
    }, 3000);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const infoBoxBg = isDarkMode 
    ? 'bg-[#0F172A] border-slate-800' 
    : 'bg-slate-50 border-slate-200 shadow-inner';

  const tableHeaderBorder = isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-800';
  const tableRowBorder = isDarkMode ? 'border-slate-700/50 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50';
  
  const calibText = isDarkMode ? 'text-emerald-400' : 'text-emerald-600';

  return (
    <div className={`flex justify-center items-start pt-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      <div className={`p-8 rounded-2xl transition-colors duration-300 flex flex-col items-center w-full max-w-3xl border ${cardBg}`}>
        
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Move3d size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide">Accelerometer Calibration</h2>
        </div>
        
        {/* Deskripsi berdasarkan referensi gambar */}
        <div className={`text-xs md:text-sm mb-8 space-y-4 max-w-2xl text-center transition-colors duration-300 ${mutedColor}`}>
          <p className="leading-relaxed">
            Accelerometer calibration affects the detected gravity direction, as well as speed estimates.
          </p>
          <div className={`text-left p-5 rounded-xl border transition-colors duration-300 ${infoBoxBg}`}>
            <ul className="list-disc ml-5 space-y-2.5">
              <li><span className={`font-bold ${textColor}`}>Full calibration</span> is a detailed calibration of all three axes, and requires rotating the vehicle.</li>
              <li><span className={`font-bold ${textColor}`}>Quick calibration</span> is a simplified, lower-quality calibration which only requires placing the vehicle on a level surface.</li>
            </ul>
          </div>
        </div>

        {/* Tabel IMU */}
        <div className="w-full mb-10 overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors duration-300 ${tableHeaderBorder}`}>
                <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">IMU</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[11px] text-right">Calibration Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b transition-colors duration-200 ${tableRowBorder}`}>
                <td className="py-4 font-mono text-xs font-bold text-blue-500">ACC_MPU6000</td>
                <td className="py-4 text-right">
                  <div className={`flex items-center justify-end gap-2 ${calibText}`}>
                    <CheckCircle2 size={16} className="shrink-0" /> 
                    <span className="font-bold text-[11px] tracking-widest uppercase">Calibrated</span>
                    <ThermometerSun size={14} className="ml-1 opacity-80 shrink-0" />
                  </div>
                </td>
              </tr>
              <tr className={`border-b transition-colors duration-200 ${tableRowBorder}`}>
                <td className="py-4 font-mono text-xs font-bold text-blue-500">ACC_LSM303D</td>
                <td className="py-4 text-right">
                  <div className={`flex items-center justify-end gap-2 ${calibText}`}>
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span className="font-bold text-[11px] tracking-widest uppercase">Calibrated</span>
                    <ThermometerSun size={14} className="ml-1 opacity-80 shrink-0" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full sm:w-auto">
          <button 
            onClick={() => startCalibration('Full')}
            disabled={isCalibrating}
            className={`px-8 py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
              ${isCalibrating 
                ? 'bg-blue-800 cursor-not-allowed opacity-75' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.98]'
              }`}
          >
            {isCalibrating ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> FULL CALIB...</>
            ) : 'FULL CALIBRATION'}
          </button>
          
          <button 
            onClick={() => startCalibration('Quick')}
            disabled={isCalibrating}
            className={`px-8 py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
              ${isCalibrating 
                ? 'bg-sky-800 cursor-not-allowed opacity-75' 
                : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/30 active:scale-[0.98]'
              }`}
          >
            {isCalibrating ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> QUICK CALIB...</>
            ) : 'QUICK CALIBRATION'}
          </button>
        </div>

        {/* Status Text - Hanya muncul setelah tombol diklik */}
        <div className="h-6 flex items-center justify-center"> 
          {status && (
            <p className={`text-xs font-bold uppercase tracking-widest transition-all ${isCalibrating ? 'text-blue-500 animate-pulse' : 'text-emerald-500'}`}>
              {status}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Accelerometer;