import React, { useState } from 'react';

interface Props {
  currentThrusters: number[];
  onApply: (newThrusters: number[]) => void;
  isDarkMode?: boolean; // Tambahkan saklar tema
}

export const AutoSliderPanel: React.FC<Props> = ({ currentThrusters, onApply, isDarkMode = true }) => {
  const [autoInputs, setAutoInputs] = useState<Array<{ id: number; value: string | number }>>([{ id: 0, value: "" }]);
  
  const thrusterNames = ["Thruster 1 (Depan Kanan)", "Thruster 2 (Depan Kiri)", "Thruster 3 (Blk Kanan)", "Thruster 4 (Blk Kiri)", "Thruster 5 (Vert Kanan)", "Thruster 6 (Vert Kiri)"];

  const addRow = () => setAutoInputs([...autoInputs, { id: 0, value: "" }]);
  const removeRow = (idx: number) => { if (autoInputs.length > 1) setAutoInputs(autoInputs.filter((_, i) => i !== idx)); };
  const updateRow = (idx: number, field: 'id' | 'value', val: any) => {
    const newInputs = [...autoInputs];
    newInputs[idx][field] = val;
    setAutoInputs(newInputs);
  };

  const handleApply = () => {
    const newT = [...currentThrusters];
    autoInputs.forEach(input => {
      const parsedValue = parseFloat(input.value.toString());
      newT[input.id] = Math.max(-50, Math.min(50, isNaN(parsedValue) ? 0 : parsedValue));
    });
    onApply(newT);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const containerBg = isDarkMode ? 'bg-[#161b22] border-blue-500/20' : 'bg-blue-50/50 border-blue-200';
  const titleColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const btnAdd = isDarkMode ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30' : 'bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200';
  const rowBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200 shadow-sm';
  const inputBg = isDarkMode ? 'bg-[#111827] border-white/10 text-blue-400 focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-blue-700 focus:border-blue-500';

  return (
    <div className={`p-6 rounded-xl border shadow-lg h-full transition-colors duration-300 ${containerBg}`}>
      <div className="flex justify-between items-end mb-4">
        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 ${titleColor}`}>
          <span>⚡</span> Antrean Perintah
        </h3>
        <button 
          onClick={addRow} 
          className={`text-[10px] px-3 py-1.5 rounded border transition-colors duration-300 font-bold ${btnAdd}`}
        >
          + Tambah Target
        </button>
      </div>
      
      <div className="space-y-3">
        {autoInputs.map((input, index) => (
          <div key={index} className={`flex gap-4 items-center p-3 rounded-lg border transition-colors duration-300 ${rowBg}`}>
            <select 
              value={input.id} 
              onChange={(e) => updateRow(index, 'id', parseInt(e.target.value))} 
              className={`w-1/2 border rounded px-2 py-2 text-xs outline-none transition-colors duration-300 font-bold ${inputBg}`}
            >
              {thrusterNames.map((name, idx) => (<option key={idx} value={idx}>{name}</option>))}
            </select>
            
            <input 
              type="text" 
              value={input.value} 
              onChange={(e) => updateRow(index, 'value', e.target.value)} 
              placeholder="-50 s/d 50" 
              className={`w-1/3 border rounded px-3 py-2 text-xs outline-none transition-colors duration-300 font-bold text-center ${inputBg}`} 
            />
            
            <button 
              onClick={() => removeRow(index)} 
              disabled={autoInputs.length === 1} 
              className={`p-2 rounded transition-colors ${autoInputs.length === 1 ? 'opacity-50 cursor-not-allowed grayscale' : 'text-red-500 hover:bg-red-500/20'}`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleApply} 
        className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg text-xs tracking-widest uppercase transition-all shadow-md active:scale-95"
      >
        APPLY SEMUA
      </button>
    </div>
  );
};