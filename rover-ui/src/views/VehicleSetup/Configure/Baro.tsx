import React, { useState } from 'react';
import { Gauge } from 'lucide-react'; // Tambahan ikon biar seragam

// Tambahkan interface untuk menerima saklar isDarkMode
interface BaroProps {
  isDarkMode?: boolean;
}

const Baro: React.FC<BaroProps> = ({ isDarkMode = true }) => {
  const [status, setStatus] = useState('');
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setStatus('Calibrating Barometer... please keep the vehicle still.');
    
    // Simulasi proses kalibrasi barometer (biasanya lebih cepat dari sensor lain)
    setTimeout(() => {
      setIsCalibrating(false);
      setStatus('Barometer calibrated successfully.');
    }, 2500);
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
  const tableRowBorder = isDarkMode ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50';
  const highlightText = isDarkMode ? 'text-blue-400' : 'text-blue-600';

  return (
    <div className={`flex justify-center items-start pt-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      <div className={`p-8 rounded-2xl transition-colors duration-300 flex flex-col items-center w-full max-w-4xl border ${cardBg}`}>
        
        {/* Header Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Gauge size={22} />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide">Calibrate Barometer</h2>
        </div>
        
        {/* Deskripsi */}
        <div className={`text-xs md:text-sm mb-8 text-center max-w-3xl leading-relaxed transition-colors duration-300 ${mutedColor}`}>
          <p className="mb-2">
            Barometer calibration sets the reference pressure for altitude/depth measurements, 
            and the internal pressure for vehicles with enclosed electronics.
          </p>
          <p className={`italic font-medium ${isDarkMode ? 'text-blue-400/80' : 'text-blue-600/80'}`}>
            * It should generally be performed at the start of each dive/flight.
          </p>
        </div>

        {/* Data Table */}
        <div className="w-full mb-10 overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className={`border-b transition-colors duration-300 ${tableHeaderBorder}`}>
                <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Sensor</th>
                <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Type</th>
                <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Bus</th>
                <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Address</th>
                <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Status</th>
                <th className="pb-3 font-bold uppercase tracking-widest text-[10px]">Calibrated at</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className={`border-b transition-colors duration-200 ${tableRowBorder}`}>
                <td className={`py-4 font-bold ${textColor}`}>MS5611</td>
                <td className={`py-4 font-medium ${mutedColor}`}>Barometric Pressure</td>
                <td className="py-4 font-medium">SPI 1</td>
                <td className="py-4 font-medium">0x03</td>
                <td className={`py-4 font-bold ${highlightText}`}>1025.88 hPa</td>
                <td className="py-4 font-medium">1029.77 hPa</td>
              </tr>
              <tr className={`border-b transition-colors duration-200 ${tableRowBorder}`}>
                <td className={`py-4 font-bold ${textColor}`}>MS5837</td>
                <td className={`py-4 font-medium ${mutedColor}`}>Freshwater Pressure</td>
                <td className="py-4 font-medium">I2C 1</td>
                <td className="py-4 font-medium">0x76</td>
                <td className={`py-4 font-bold ${highlightText}`}>1058.80 hPa</td>
                <td className="py-4 font-medium">1029.68 hPa</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleCalibrate}
          disabled={isCalibrating}
          className={`px-8 py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mb-6
            ${isCalibrating 
              ? 'bg-blue-800 cursor-not-allowed opacity-75' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.98]'
            }`}
        >
          {isCalibrating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              CALIBRATING...
            </>
          ) : (
            'CALIBRATE BAROMETER'
          )}
        </button>

        {/* Status Display Area */}
        <div className="h-6 flex items-center justify-center">
          {status && (
            <p className={`text-xs font-bold uppercase tracking-widest transition-all ${isCalibrating ? 'text-blue-500 animate-pulse' : 'text-emerald-500'}`}>
              {isCalibrating ? '⏳ ' : '✅ '}{status}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Baro;