import React, { useState } from 'react';

const Failsafes = () => {
  const [heartbeatEnable, setHeartbeatEnable] = useState(true);
  const [status, setStatus] = useState('');

  const saveFailsafes = () => {
    setStatus('Failsafe configurations saved successfully.');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="p-6 text-slate-300">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-slate-200 mb-2">Failsafes Configuration</h2>
        <p className="text-sm text-slate-400 mb-8 max-w-3xl">
          Failsafe configuration exposes important autopilot failsafe features through an intuitive interface. 
          Failsafes should be set up as part of responsible operation, and can provide early warnings of problems, 
          and trigger automated safe behaviours if a critical issue occurs.
        </p>

        {/* Grid Layout 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* 1. Control Station Heartbeat Loss */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">💻 Control Station Heartbeat Loss</h3>
            <p className="text-xs text-slate-500 mb-4">Triggers when the vehicle does not receive a heartbeat from the GCS within the timeout (default 3 seconds).</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Enable</span>
                <button onClick={() => setHeartbeatEnable(!heartbeatEnable)} className={`w-10 h-5 rounded-full relative ${heartbeatEnable ? 'bg-blue-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${heartbeatEnable ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Timeout</label>
                <input type="number" defaultValue={3} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
              </div>
            </div>
          </div>

          {/* 2. Pilot Input Loss */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">🎮 Pilot Input Loss</h3>
            <p className="text-xs text-slate-500 mb-4">Triggers when the vehicle does not receive any pilot input for a given amount of time.</p>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Timeout</label>
                <input type="number" defaultValue={3} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Action</label>
                <select className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm">
                  <option>2 (Return to Home)</option>
                  <option>0 (Disabled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Leak Detection */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">💧 Leak Detection</h3>
            <p className="text-xs text-slate-500 mb-4">Triggers when a leak is detected. We recommend keeping control electronics dry.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Leak probe type</label>
                <input type="number" defaultValue={-1} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Leak 1 pin</label>
                <select className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm">
                  <option>Custom: 8</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Excess Internal Pressure */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">⚠️ Excess Internal Pressure</h3>
            <p className="text-xs text-slate-500 mb-4">Triggers when the internal pressure is too high. This helps to detect a leak, and to avoid rapid unplanned disassembly.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Max internal pressure</label>
                <input type="number" defaultValue={105000} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-1">Action</label>
                <input type="number" defaultValue={0} className="w-full bg-[#0F172A] border border-slate-600 rounded p-2 text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={saveFailsafes}
            className="bg-[#3B82F6] hover:bg-blue-500 px-8 py-2 rounded text-sm font-bold text-white transition-all shadow-lg active:scale-95"
          >
            SAVE CONFIGURATION
          </button>
        </div>

        <div className="text-center mt-4 h-6">
          {status && <p className="text-green-400 text-sm">{status}</p>}
        </div>

      </div>
    </div>
  );
};

export default Failsafes;