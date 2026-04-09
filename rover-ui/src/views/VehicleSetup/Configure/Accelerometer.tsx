import React, { useState } from 'react';

const Accelerometer = () => {
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

  return (
    <div className="flex justify-center items-start pt-6">
      <div className="bg-[#1A2332] p-8 rounded-lg shadow-sm border border-slate-700 w-full max-w-3xl flex flex-col items-center text-slate-300">
        
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">Accelerometer Calibration</h2>
        
        {/* Deskripsi berdasarkan referensi gambar */}
        <div className="text-sm text-slate-400 mb-8 space-y-4 max-w-2xl text-center">
          <p>
            Accelerometer calibration affects the detected gravity direction, as well as speed estimates.
          </p>
          <div className="text-left bg-[#0F172A] p-4 rounded border border-slate-800">
            <ul className="list-disc ml-5 space-y-2">
              <li><span className="text-slate-200 font-semibold">Full calibration</span> is a detailed calibration of all three axes, and requires rotating the vehicle.</li>
              <li><span className="text-slate-200 font-semibold">Quick calibration</span> is a simplified, lower-quality calibration which only requires placing the vehicle on a level surface.</li>
            </ul>
          </div>
        </div>

        {/* Tabel IMU */}
        <div className="w-full mb-10">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500 uppercase text-xs tracking-widest">
                <th className="pb-3 font-semibold">IMU</th>
                <th className="pb-3 font-semibold text-right">Calibration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="py-4 font-mono">ACC_MPU6000</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-green-500">
                    <span>😊</span> 
                    <span className="font-medium">Calibrated</span>
                    <span className="opacity-80">🌡️✔️</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="py-4 font-mono">ACC_LSM303D</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-green-500">
                    <span>😊</span>
                    <span className="font-medium">Calibrated</span>
                    <span className="opacity-80">🌡️✔️</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => startCalibration('Full')}
            disabled={isCalibrating}
            className={`px-6 py-2.5 rounded text-sm font-bold text-white transition-all 
              ${isCalibrating ? 'bg-blue-900/50 cursor-not-allowed text-slate-400' : 'bg-[#3B82F6] hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/20'}`}
          >
            FULL CALIBRATION
          </button>
          
          <button 
            onClick={() => startCalibration('Quick')}
            disabled={isCalibrating}
            className={`px-6 py-2.5 rounded text-sm font-bold text-white transition-all 
              ${isCalibrating ? 'bg-sky-900/50 cursor-not-allowed text-slate-400' : 'bg-sky-500 hover:bg-sky-400 active:scale-95 shadow-lg shadow-sky-900/20'}`}
          >
            QUICK CALIBRATION
          </button>
        </div>

        {/* Status Text - Hanya muncul setelah tombol diklik */}
        <div className="h-6"> 
          {status && (
            <p className={`text-sm font-medium transition-all ${isCalibrating ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`}>
              {status}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Accelerometer;