import React, { useState } from 'react';
import { Crosshair } from 'lucide-react'; // Tambahkan ikon biar selaras sama Parameters

// 1. Tambahkan interface untuk menerima saklar isDarkMode
interface GyroscopeProps {
  isDarkMode?: boolean;
}

const Gyroscope: React.FC<GyroscopeProps> = ({ isDarkMode = true }) => {
  const [autoCalibrate, setAutoCalibrate] = useState('Never');
  const [isCalibrating, setIsCalibrating] = useState(false);
  
  // REVISI: Status awal dikosongkan agar tidak muncul saat halaman baru dimuat
  const [calibrationStatus, setCalibrationStatus] = useState('');

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setCalibrationStatus('Calibrating...');
    
    // Simulasi proses kalibrasi (2 detik)
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationStatus('Calibration done.');
    }, 2000);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const tableHeaderBorder = isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-800';
  const tableRowBorder = isDarkMode ? 'border-slate-700/50 hover:bg-slate-800/50 text-slate-300' : 'border-slate-100 hover:bg-slate-50 text-slate-700';
  
  const selectBg = isDarkMode 
    ? 'bg-[#0F172A] border-slate-600 text-slate-200 focus:border-blue-500 hover:border-slate-500' 
    : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-blue-500 hover:border-slate-400';

  return (
    <div className={`flex justify-center items-start pt-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      <div className={`p-8 rounded-2xl transition-colors duration-300 flex flex-col items-center w-full max-w-3xl border ${cardBg}`}>
        
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Crosshair size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide">Calibrate Gyroscopes</h2>
        </div>
        
        <p className={`text-xs md:text-sm mb-8 text-center max-w-2xl leading-relaxed transition-colors duration-300 ${mutedColor}`}>
          A calibrated gyro should display a value of <strong className={`font-bold ${textColor}`}>0</strong> on all axes when the vehicle is stationary. 
          Symptoms of a mis-calibrated gyro include yaw drift and small attitude offsets.
        </p>

        {/* Data Table */}
        <div className="w-full mb-8 overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className={`border-b transition-colors duration-300 ${tableHeaderBorder}`}>
                <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">IMU</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">
                  Angular speed <br/>
                  <span className={`text-[9px] font-medium tracking-normal transition-colors duration-300 ${mutedColor}`}>(mrad/s)</span>
                </th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">
                  Offsets <br/>
                  <span className={`text-[9px] font-medium tracking-normal transition-colors duration-300 ${mutedColor}`}>(mrad/s)</span>
                </th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">
                  Calibration <br/>
                  <span className={`text-[9px] font-medium tracking-normal transition-colors duration-300 ${mutedColor}`}>temperature (°C)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b transition-colors duration-200 ${tableRowBorder}`}>
                <td className="py-4 font-mono text-xs font-bold text-blue-500">GYR_MPU6000</td>
                <td className="py-4 font-medium">-1, 0, 0</td>
                <td className="py-4 font-medium">33.60, 58.80, -12.00</td>
                <td className="py-4 font-medium">47.3</td>
              </tr>
              <tr className={`border-b transition-colors duration-200 ${tableRowBorder}`}>
                <td className="py-4 font-mono text-xs font-bold text-blue-500">GYR_L3GD20</td>
                <td className="py-4 font-medium">-1, 2, 1</td>
                <td className="py-4 font-medium">0.00, 0.00, 0.00</td>
                <td className="py-4 font-medium">49.3</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Notes & Select */}
        <div className="w-full max-w-2xl flex flex-col items-center">
          <p className={`text-xs md:text-sm mb-6 text-center leading-relaxed transition-colors duration-300 ${mutedColor}`}>
            The Gyroscopes can be automatically calibrated at startup. Be mindful that this is not 
            recommended for vehicles that start up on moving platforms (such as boats).
          </p>

          <div className="mb-10 flex flex-col items-center">
            <label className={`text-[10px] mb-2 uppercase font-bold tracking-widest transition-colors duration-300 ${mutedColor}`}>
              Calibrate gyroscopes automatically
            </label>
            <select 
              value={autoCalibrate}
              onChange={(e) => setAutoCalibrate(e.target.value)}
              className={`border text-sm font-bold rounded-lg block w-64 p-3 outline-none cursor-pointer transition-colors duration-300 shadow-sm ${selectBg}`}
            >
              <option value="Never">Never</option>
              <option value="Always">Always</option>
            </select>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleCalibrate}
          disabled={isCalibrating}
          className={`px-8 py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 mb-4 shadow-lg flex items-center justify-center gap-2
            ${isCalibrating 
              ? 'bg-blue-800 cursor-not-allowed opacity-75' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.98]'
            }`}
        >
          {isCalibrating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              CALIBRATING...
            </>
          ) : (
            'CALIBRATE GYROSCOPES'
          )}
        </button>

        {/* Status Text */}
        <div className="h-6 flex items-center justify-center">
          {calibrationStatus && (
            <p className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-300 ${
              isCalibrating ? 'text-blue-500 animate-pulse' : 'text-emerald-500'
            }`}>
              {calibrationStatus}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Gyroscope;