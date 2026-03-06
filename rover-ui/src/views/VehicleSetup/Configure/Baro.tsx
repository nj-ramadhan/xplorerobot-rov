import React, { useState } from 'react';

const Baro = () => {
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

  return (
    <div className="flex justify-center items-start pt-6">
      <div className="bg-[#1A2332] p-8 rounded-lg shadow-sm border border-slate-700 w-full max-w-4xl flex flex-col items-center">
        
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">Calibrate Barometer</h2>
        
        {/* Deskripsi berdasarkan referensi gambar */}
        <div className="text-sm text-slate-400 mb-8 text-center max-w-3xl leading-relaxed">
          <p className="mb-2">
            Barometer calibration sets the reference pressure for altitude/depth measurements, 
            and the internal pressure for vehicles with enclosed electronics.
          </p>
          <p className="italic text-blue-400/80">
            * It should generally be performed at the start of each dive/flight.
          </p>
        </div>

        {/* Data Table */}
        <div className="w-full mb-10 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500 uppercase text-[11px] tracking-widest">
                <th className="pb-3 font-semibold">Sensor</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Bus</th>
                <th className="pb-3 font-semibold">Address</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Calibrated at</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 font-mono text-xs">
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="py-4 font-bold text-slate-200">MS5611</td>
                <td className="py-4 text-slate-400">Barometric Pressure</td>
                <td className="py-4">SPI 1</td>
                <td className="py-4">0x03</td>
                <td className="py-4 text-blue-400">1025.88 hPa</td>
                <td className="py-4">1029.77 hPa</td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="py-4 font-bold text-slate-200">MS5837</td>
                <td className="py-4 text-slate-400">Freshwater Pressure</td>
                <td className="py-4">I2C 1</td>
                <td className="py-4">0x76</td>
                <td className="py-4 text-blue-400">1058.80 hPa</td>
                <td className="py-4">1029.68 hPa</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleCalibrate}
          disabled={isCalibrating}
          className={`px-8 py-2.5 rounded text-sm font-bold text-white transition-all duration-200 mb-6 
            ${isCalibrating 
              ? 'bg-blue-800 cursor-not-allowed opacity-70' 
              : 'bg-[#3B82F6] hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/20'
            }`}
        >
          {isCalibrating ? 'CALIBRATING...' : 'CALIBRATE'}
        </button>

        {/* Status Display Area */}
        <div className="h-6">
          {status && (
            <p className={`text-sm font-medium transition-all ${isCalibrating ? 'text-blue-400 animate-pulse' : 'text-green-400'}`}>
              {isCalibrating ? '⏳ ' : '✅ '}{status}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Baro;