import React, { useState } from 'react';

const Gyroscope = () => {
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

  return (
    <div className="flex justify-center items-start pt-6">
      <div className="bg-[#1A2332] p-8 rounded-lg shadow-sm border border-slate-700 w-full max-w-3xl flex flex-col items-center">
        
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">Calibrate Gyroscopes</h2>
        
        <p className="text-sm text-slate-400 mb-8 text-center max-w-2xl leading-relaxed">
          A calibrated gyro should display a value of 0 on all axes when the vehicle is stationary. 
          Symptoms of a mis-calibrated gyro include yaw drift and small attitude offsets.
        </p>

        {/* Data Table */}
        <div className="w-full mb-8 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="pb-3 font-semibold">IMU</th>
                <th className="pb-3 font-semibold">
                  Angular speed <br/>
                  <span className="text-xs font-normal text-slate-500">(mrad/s)</span>
                </th>
                <th className="pb-3 font-semibold">
                  Offsets <br/>
                  <span className="text-xs font-normal text-slate-500">(mrad/s)</span>
                </th>
                <th className="pb-3 font-semibold">
                  Calibration <br/>
                  <span className="text-xs font-normal text-slate-500">temperature (°C)</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 font-mono text-sm">GYR_MPU6000</td>
                <td className="py-4">-1, 0, 0</td>
                <td className="py-4">33.60, 58.80, -12.00</td>
                <td className="py-4">47.3</td>
              </tr>
              <tr className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <td className="py-4 font-mono text-sm">GYR_L3GD20</td>
                <td className="py-4">-1, 2, 1</td>
                <td className="py-4">0.00, 0.00, 0.00</td>
                <td className="py-4">49.3</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Notes & Select */}
        <div className="w-full max-w-2xl">
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The Gyroscopes can be automatically calibrated at startup. Be mindful that this is not 
            recommended for vehicles that start up on moving platforms (such as boats).
          </p>

          <div className="mb-10 flex flex-col items-start">
            <label className="text-xs text-slate-500 mb-2 uppercase font-semibold tracking-wider">
              Calibrate gyroscopes automatically
            </label>
            <select 
              value={autoCalibrate}
              onChange={(e) => setAutoCalibrate(e.target.value)}
              className="bg-[#0F172A] border border-slate-600 text-slate-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-64 p-2.5 outline-none cursor-pointer hover:border-slate-500 transition-colors"
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
          className={`px-6 py-2.5 rounded text-sm font-bold text-white transition-all duration-200 mb-4 
            ${isCalibrating 
              ? 'bg-blue-800 cursor-not-allowed opacity-75' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/20'
            }`}
        >
          {isCalibrating ? 'CALIBRATING...' : 'CALIBRATE GYROSCOPES'}
        </button>

        {/* REVISI: Status Text hanya muncul jika calibrationStatus tidak kosong */}
        {calibrationStatus && (
          <p className={`text-sm transition-opacity duration-300 ${isCalibrating ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`}>
            {calibrationStatus}
          </p>
        )}

      </div>
    </div>
  );
};

export default Gyroscope;