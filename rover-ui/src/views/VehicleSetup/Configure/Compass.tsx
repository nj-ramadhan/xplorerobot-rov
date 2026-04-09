import React, { useState } from 'react';

const Compass = () => {
  const [autoDeclination, setAutoDeclination] = useState(true);
  const [activeTab, setActiveTab] = useState('full');
  const [status, setStatus] = useState('');

  const handleStartCalibration = () => {
    setStatus('Calibrating... please rotate the vehicle in all axes.');
    setTimeout(() => setStatus('Calibration finished.'), 5000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 text-slate-300">
      
      {/* Kolom Kiri: Visual & Status Sensor */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Visual Compass Rose */}
        <div className="bg-[#1A2332] border border-slate-700 rounded-lg p-6 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            {/* SVG Compass Rose */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1" />
              <text x="50" y="12" className="fill-blue-400 text-[8px] font-bold" textAnchor="middle" transform="rotate(90 50 12)">N</text>
              <text x="88" y="50" className="fill-slate-500 text-[8px]" textAnchor="middle" transform="rotate(90 88 50)">E</text>
              <text x="50" y="88" className="fill-slate-500 text-[8px]" textAnchor="middle" transform="rotate(90 50 88)">S</text>
              <text x="12" y="50" className="fill-slate-500 text-[8px]" textAnchor="middle" transform="rotate(90 12 50)">W</text>
              {/* Needle Simulation */}
              <line x1="50" y1="50" x2="80" y2="50" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-orange-400 font-mono">LSM303D</span>
              <span className="text-[10px] text-blue-400 font-mono">UAVCAN</span>
            </div>
          </div>

          {/* Declination Settings */}
          <div className="w-full border-t border-slate-700 pt-4">
            <h3 className="text-sm font-semibold mb-3">Declination</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs">Auto Declination</span>
              <button 
                onClick={() => setAutoDeclination(!autoDeclination)}
                className={`w-10 h-5 rounded-full transition-colors relative ${autoDeclination ? 'bg-blue-600' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoDeclination ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Current Declination</span>
              <span className="font-mono">0.00</span>
            </div>
          </div>
        </div>

        {/* Sensor Status List */}
        <div className="space-y-2">
          {[
            { id: 1, name: 'UAVCAN', type: 'EXTERNAL', status: 'CALIBRATED (QUICK)' },
            { id: 2, name: 'LSM303D', type: 'INTERNAL', status: 'CALIBRATED (QUICK)' },
            { id: 3, name: 'AK8963', type: 'INTERNAL', status: 'CALIBRATED (QUICK)' },
          ].map((sensor) => (
            <div key={sensor.id} className="bg-[#1A2332] border border-slate-700 p-3 rounded flex items-center gap-3">
              <div className="w-1 h-10 bg-orange-500 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-blue-400 font-bold uppercase">{sensor.name}</span>
                  <span className="text-[9px] bg-yellow-900/40 text-yellow-500 px-1.5 rounded">{sensor.status}</span>
                </div>
                <div className="text-[10px] text-slate-500">{sensor.id}ST ({sensor.type})</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom Kanan: Calibration Controls */}
      <div className="flex-1 space-y-4">
        <div className="bg-[#1A2332] border border-slate-700 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Compass Calibration</h2>
          </div>

          {/* Accordion Items */}
          <div className="divide-y divide-slate-700">
            {/* Full Calibration */}
            <div className="p-4">
              <button 
                onClick={() => setActiveTab(activeTab === 'full' ? '' : 'full')}
                className="flex justify-between w-full text-sm font-medium mb-2"
              >
                Full (Onboard) Calibration
                <span>{activeTab === 'full' ? '−' : '+'}</span>
              </button>
              {activeTab === 'full' && (
                <div className="pt-2">
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    This does a full calibration of the compasses. It requires you to spin the vehicle around manually multiple times. 
                    You need to move the vehicle around in all 3 axis.
                  </p>
                  <button 
                    onClick={handleStartCalibration}
                    className="bg-[#3B82F6] hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                  >
                    START FULL CALIBRATION
                  </button>
                </div>
              )}
            </div>

            {/* Other Options (Placeholder) */}
            {['Large Vehicle Calibration', 'Compass Learn', 'Log-based Calibration (Coming soon)'].map((label) => (
              <div key={label} className="p-4">
                <button className="flex justify-between w-full text-sm font-medium text-slate-500 cursor-not-allowed">
                  {label}
                  <span>+</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status Text Area */}
        <div className="h-8 flex items-center justify-center">
          {status && (
            <div className="bg-slate-800/50 px-4 py-1 rounded-full border border-slate-700">
              <span className={`text-xs font-medium ${status.includes('Calibrating') ? 'text-blue-400 animate-pulse' : 'text-green-400'}`}>
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Settings Table */}
        <div className="bg-[#1A2332] border border-slate-700 rounded-lg p-4">
           <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-blue-400">UAVCAN Settings</h3>
           <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="pb-2">Name</th>
                  <th className="pb-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="text-slate-400 font-mono">
                {['COMPASS_DIA_X', 'COMPASS_DIA_Y', 'COMPASS_DIA_Z'].map((param) => (
                  <tr key={param} className="border-b border-slate-800/50">
                    <td className="py-2">{param}</td>
                    <td className="py-2 text-right">1.00</td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Compass;