import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react'; // Tambahan ikon biar seragam

// Tambahkan interface untuk menerima saklar isDarkMode
interface LightsProps {
  isDarkMode?: boolean;
}

const Lights: React.FC<LightsProps> = ({ isDarkMode = true }) => {
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

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';

  const inputCardBg = isDarkMode
    ? 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
    : 'bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm';

  const inputFieldBg = isDarkMode
    ? 'bg-[#1A2332] border-slate-700 focus:border-blue-500 text-white'
    : 'bg-white border-slate-300 focus:border-blue-500 text-slate-900 shadow-inner';

  return (
    <div className={`p-4 md:p-6 animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      <div className={`max-w-6xl mx-auto rounded-2xl border p-6 md:p-8 transition-colors duration-300 ${cardBg}`}>
        
        {/* Header Title */}
        <div className="flex flex-col items-center justify-center gap-3 mb-10">
          <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
            <Lightbulb size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide">Lights Configuration</h2>
        </div>
        
        {/* Grid Container untuk 3 Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
          
          {/* Card 1: Lights 1 */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-blue-500">Lights 1 (RCIN9)</h3>
            <p className={`text-xs mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              Here you can configure what pin outputs the signal for the first set of lights.
            </p>
            <div className="mt-auto">
              <label className={`text-[10px] uppercase font-bold tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Lights 1 Setup</label>
              <select 
                value={lights1}
                onChange={(e) => setLights1(e.target.value)}
                className={`w-full text-sm font-bold rounded-lg p-3 outline-none transition-colors duration-300 cursor-pointer ${inputFieldBg}`}
              >
                <option value="Servo 11 (RCIN9)">Servo 11 (RCIN9)</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Card 2: Lights 2 */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-blue-500">Lights 2 (RCIN10)</h3>
            <p className={`text-xs mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              What pin outputs the signal for the second set of lights.
            </p>
            <div className="mt-auto">
              <label className={`text-[10px] uppercase font-bold tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Lights 2 Setup</label>
              <select 
                value={lights2}
                onChange={(e) => setLights2(e.target.value)}
                className={`w-full text-sm font-bold rounded-lg p-3 outline-none transition-colors duration-300 cursor-pointer ${inputFieldBg}`}
              >
                <option value="Servo 12 (RCIN10)">Servo 12 (RCIN10)</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Card 3: Joystick Steps */}
          <div className={`border p-6 rounded-xl flex flex-col transition-all duration-300 ${inputCardBg}`}>
            <h3 className="text-sm font-black uppercase tracking-widest mb-3 text-purple-500">Joystick steps</h3>
            <p className={`text-xs mb-6 leading-relaxed flex-1 transition-colors duration-300 ${mutedColor}`}>
              How many button presses it takes to go from 0% to 100% brightness. 8 steps result in a 12.5% increase per button press.
            </p>
            <div className="mt-auto">
              <label className={`text-[10px] uppercase font-bold tracking-widest block mb-2 transition-colors duration-300 ${mutedColor}`}>Brightness Increments</label>
              <input 
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className={`w-full text-sm font-bold rounded-lg p-3 outline-none transition-colors duration-300 ${inputFieldBg}`}
              />
            </div>
          </div>

        </div>

        {/* Action Button & Status */}
        <div className="flex flex-col items-center gap-4 border-t border-slate-700/30 pt-8">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`px-12 py-3.5 rounded-xl text-xs tracking-widest uppercase font-bold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2
              ${isSaving 
                ? 'bg-blue-800 cursor-not-allowed opacity-75' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 active:scale-[0.98]'
              }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SAVING SETTINGS...
              </>
            ) : (
              'SAVE CONFIGURATION'
            )}
          </button>

          <div className="h-6">
            {status && (
              <p className={`text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${isSaving ? 'text-blue-500 animate-pulse' : 'text-emerald-500'}`}>
                {isSaving ? '⏳ ' : '✅ '}{status}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lights;