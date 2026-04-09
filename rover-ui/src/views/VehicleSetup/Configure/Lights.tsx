import React, { useState } from 'react';

const Lights = () => {
  const [lights1, setLights1] = useState('Servo 11 (RCIN9)');
  const [lights2, setLights2] = useState('Servo 12 (RCIN10)');
  const [steps, setSteps] = useState(8);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setStatus('Saving light configurations...');
    
    // Simulasi penyimpanan data
    setTimeout(() => {
      setIsSaving(false);
      setStatus('Settings saved successfully.');
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-slate-200 mb-8 text-center">Lights Configuration</h2>
        
        {/* Grid Container untuk 3 Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Lights 1 */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg flex flex-col">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Lights 1 (RCIN9)</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Here you can configure what pin outputs the signal for the first set of lights.
            </p>
            <div className="mt-auto">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">Lights 1</label>
              <select 
                value={lights1}
                onChange={(e) => setLights1(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-600 text-slate-200 text-sm rounded p-2.5 outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Servo 11 (RCIN9)">Servo 11 (RCIN9)</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Card 2: Lights 2 */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg flex flex-col">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Lights 2 (RCIN10)</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              What pin outputs the signal for the second set of lights.
            </p>
            <div className="mt-auto">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">Lights 2</label>
              <select 
                value={lights2}
                onChange={(e) => setLights2(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-600 text-slate-200 text-sm rounded p-2.5 outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Servo 12 (RCIN10)">Servo 12 (RCIN10)</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Card 3: Joystick Steps */}
          <div className="bg-[#1A2332] border border-slate-700 p-6 rounded-lg flex flex-col">
            <h3 className="text-lg font-medium text-slate-200 mb-3">Joystick steps</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              How many button presses it takes to go from 0% to 100% brightness. 8 steps result in a 12.5% increase per button press.
            </p>
            <div className="mt-auto">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-2">Joystick steps</label>
              <input 
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-slate-600 text-slate-200 text-sm rounded p-2.5 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

        </div>

        {/* Action Button & Status */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-10 py-2.5 rounded text-sm font-bold text-white transition-all 
              ${isSaving ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-500 shadow-lg shadow-blue-900/20 active:scale-95'}`}
          >
            {isSaving ? 'SAVING...' : 'SAVE SETTINGS'}
          </button>

          <div className="h-6">
            {status && (
              <p className={`text-sm font-medium ${isSaving ? 'text-blue-400 animate-pulse' : 'text-green-400'}`}>
                {status}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lights;