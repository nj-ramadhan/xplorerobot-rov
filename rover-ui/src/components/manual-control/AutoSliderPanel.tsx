import React, { useState } from 'react';

interface Props {
  currentThrusters: number[];
  onApply: (newThrusters: number[]) => void;
}

export const AutoSliderPanel: React.FC<Props> = ({ currentThrusters, onApply }) => {
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

  return (
    <div className="bg-[#161b22] p-6 rounded-xl border border-blue-500/20 shadow-lg h-full">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><span>⚡</span> Antrean Perintah</h3>
        <button onClick={addRow} className="text-[10px] bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded border border-blue-500/30">+ Tambah Target</button>
      </div>
      <div className="space-y-3">
        {autoInputs.map((input, index) => (
          <div key={index} className="flex gap-4 items-center bg-black/40 p-3 rounded-lg border border-white/5">
            <select value={input.id} onChange={(e) => updateRow(index, 'id', parseInt(e.target.value))} className="w-1/2 bg-[#111827] border border-white/10 rounded px-2 py-2 text-xs text-blue-400">
              {thrusterNames.map((name, idx) => (<option key={idx} value={idx}>{name}</option>))}
            </select>
            <input type="text" value={input.value} onChange={(e) => updateRow(index, 'value', e.target.value)} placeholder="-50 s/d 50" className="w-1/3 bg-[#111827] border border-white/10 rounded px-3 py-2 text-xs text-blue-400" />
            <button onClick={() => removeRow(index)} disabled={autoInputs.length === 1} className="p-2 text-red-500 hover:bg-red-500/20 rounded">🗑️</button>
          </div>
        ))}
      </div>
      <button onClick={handleApply} className="mt-5 w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-xs tracking-widest">APPLY SEMUA</button>
    </div>
  );
};