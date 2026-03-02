import React, { useState } from 'react';
import { Search, Save, FolderOpen, ChevronLeft, ChevronRight, ArrowLeft, Info, Cpu, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Parameter {
  name: string;
  description: string;
  value: number;
  type: 'numeric' | 'boolean';
}

const ParamsView = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [parameters, setParameters] = useState<Parameter[]>([
    { name: 'ATC_ANG_PIT_P', description: 'Pitch axis angular response gain', value: 4.50, type: 'numeric' },
    { name: 'CH7_OPT', description: 'Channel 7 option configuration', value: 0, type: 'numeric' },
    { name: 'EK3_ENABLE', description: 'Enable Extended Kalman Filter v3', value: 1, type: 'boolean' },
    { name: 'MOT_TBP_THST', description: 'Thrust to boost pressure ratio', value: 0.5, type: 'numeric' },
    { name: 'LEAK_ENABLE', description: 'Enable leak detector sensor', value: 0, type: 'boolean' },
  ]);

  const handleValueChange = (name: string, newValue: number) => {
    setParameters(prev => prev.map(p => (p.name === name ? { ...p, value: newValue } : p)));
  };

  const toggleBoolean = (name: string, currentValue: number) => {
    handleValueChange(name, currentValue === 1 ? 0 : 1);
  };

  const filteredParams = parameters.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-300 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-all text-xs font-bold tracking-widest uppercase mb-2"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Command Center
          </button>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Cpu className="text-blue-500" /> SYSTEM PARAMETERS
          </h1>
        </div>
        
        <div className="hidden md:block text-right bg-[#111827] p-3 px-5 rounded-2xl border border-white/5">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">ROV Status</div>
          <div className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> CONNECTED (SITL)
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-5">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or description..."
            className="block w-full bg-[#111827]/80 backdrop-blur-sm border border-white/5 rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-[#111827]/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 bg-black/30 py-5 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
            <div className="col-span-4 lg:col-span-3">Parameter Name</div>
            <div className="col-span-6 lg:col-span-7">Description</div>
            <div className="col-span-2 text-right">Value</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredParams.map((param) => (
              <div key={param.name} className="grid grid-cols-12 gap-4 py-5 px-8 hover:bg-blue-500/[0.03] transition-colors items-center group">
                <div className="col-span-4 lg:col-span-3">
                  <span className="font-mono text-blue-400 text-sm font-bold group-hover:text-blue-300 transition-colors">
                    {param.name}
                  </span>
                </div>
                <div className="col-span-6 lg:col-span-7 flex items-center gap-2">
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
                    {param.description}
                  </span>
                  <Info size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-help flex-shrink-0" />
                </div>
                <div className="col-span-2 text-right">
                  {param.type === 'boolean' ? (
                    <button 
                      onClick={() => toggleBoolean(param.name, param.value)}
                      className={`flex items-center gap-2 ml-auto p-1.5 px-3 rounded-full transition-all ${
                        param.value === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold">{param.value === 1 ? 'ENABLED' : 'DISABLED'}</span>
                      {param.value === 1 ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                    </button>
                  ) : (
                    <input 
                      type="number" 
                      step="0.01"
                      value={param.value}
                      onChange={(e) => handleValueChange(param.name, parseFloat(e.target.value) || 0)}
                      className="bg-black/30 border border-white/5 text-white text-right focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-full lg:w-28 px-3 py-1.5 font-mono font-bold rounded-xl transition-all"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-5 pb-10">
          <div className="flex gap-4">
            <button className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full text-xs font-black transition-all shadow-lg shadow-blue-900/40 active:scale-95">
              <Save size={16} className="group-hover:rotate-12 transition-transform" />
              SAVE TO VEHICLE
            </button>
            <button className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-3.5 rounded-full text-xs font-black transition-all active:scale-95">
              <FolderOpen size={16} />
              LOAD FILE
            </button>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-bold text-slate-600 tracking-widest uppercase bg-[#111827] p-3 px-6 rounded-full border border-white/5">
            <div className="flex items-center gap-3">
              <span>View:</span>
              <select className="bg-transparent border-none focus:ring-0 text-blue-400 cursor-pointer text-xs p-0 pr-5">
                <option value="10">10 Rows</option>
                <option value="50">50 Rows</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span>{filteredParams.length} Parameters</span>
              <div className="flex gap-1.5">
                <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20" disabled><ChevronLeft size={16} /></button>
                <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20" disabled><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParamsView;