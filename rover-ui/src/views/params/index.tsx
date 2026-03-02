import React, { useState } from 'react';
// Pastikan sudah install: npm install lucide-react
import { Search, Save, FolderOpen, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Definisi struktur data parameter
interface Parameter {
  name: string;
  description: string;
  value: number | string;
}

const ParamsView = () => {
  const navigate = useNavigate();

  // 1. State untuk menyimpan data parameter (Mock Data)
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: 'ACRO_RP_P', description: 'Acro roll/pitch P gain', value: 4.50 },
    { name: 'CH7_OPT', description: 'Channel 7 option', value: 0 },
    { name: 'EK3_ENABLE', description: 'Enable EKF3', value: 1 },
    { name: 'MOT_TBP_THST', description: 'Thrust to boost pressure', value: 0.5 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // 2. Fungsi untuk mengubah nilai parameter saat diketik
  const handleValueChange = (name: string, newValue: string) => {
    setParameters(prev =>
      prev.map(p => (p.name === name ? { ...p, value: newValue } : p))
    );
  };

  // 3. Logika Pencarian
  const filteredParams = parameters.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0b111e] min-h-screen text-gray-300 p-8 font-sans">
      {/* Tombol Back ke Home */}
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors text-sm"
      >
        <ArrowLeft size={16} /> KEMBALI KE MENU UTAMA
      </button>

      {/* Search Bar ala BlueOS */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Cari parameter..."
          className="block w-full bg-[#161b22] border-b border-gray-700 py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabel Parameter */}
      <div className="bg-[#111827] rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        {/* Header Tabel */}
        <div className="grid grid-cols-12 gap-4 bg-black/40 py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">
          <div className="col-span-3">Name</div>
          <div className="col-span-7">Description</div>
          <div className="col-span-2 text-right">Value</div>
        </div>

        {/* Isi Tabel */}
        <div className="divide-y divide-white/5">
          {filteredParams.length > 0 ? (
            filteredParams.map((param) => (
              <div key={param.name} className="grid grid-cols-12 gap-4 py-4 px-6 hover:bg-white/[0.02] transition-colors items-center">
                <div className="col-span-3 font-mono text-blue-400 text-sm font-bold">{param.name}</div>
                <div className="col-span-7 text-sm text-slate-400">{param.description}</div>
                <div className="col-span-2 text-right">
                  <input 
                    type="text" 
                    value={param.value}
                    onChange={(e) => handleValueChange(param.name, e.target.value)}
                    className="bg-transparent border-b border-gray-700 text-right focus:outline-none focus:border-blue-500 w-24 px-1 text-white font-mono"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-600 italic">Tidak ada parameter ditemukan...</div>
          )}
        </div>
      </div>

      {/* Footer Actions & Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-blue-900/20">
            <Save size={14} /> SAVE TO VEHICLE
          </button>
          <button className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white px-5 py-2 rounded-lg text-xs font-bold transition">
            <FolderOpen size={14} /> LOAD FROM FILE
          </button>
        </div>

        <div className="flex items-center gap-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select className="bg-transparent border-none focus:ring-0 text-white cursor-pointer">
              <option value="10">10</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>1-{filteredParams.length} of {filteredParams.length}</span>
            <div className="flex gap-1">
              <button className="p-1 hover:text-white opacity-50 cursor-not-allowed"><ChevronLeft size={18} /></button>
              <button className="p-1 hover:text-white opacity-50 cursor-not-allowed"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParamsView;