import React, { useState } from 'react';
import { Server, RefreshCw } from 'lucide-react'; 

interface BlueOSVersionProps {
  isDarkMode?: boolean;
}

const BlueOSVersion: React.FC<BlueOSVersionProps> = ({ isDarkMode = true }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-400';
  
  const cardBg = isDarkMode ? 'bg-[#111827]/80 border-slate-800 shadow-2xl backdrop-blur-md' : 'bg-white border-slate-200 shadow-xl';
  const innerCardBg = isDarkMode ? 'bg-[#0F172A] border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm';
  
  const inputBg = isDarkMode 
    ? 'bg-[#0F172A] border-slate-700 focus:border-blue-500 text-white' 
    : 'bg-white border-slate-300 focus:border-blue-500 text-slate-800 shadow-inner';

  return (
    <div className={`p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500 font-['Inter',sans-serif] ${textColor}`}>
      
      {/* HEADER */}
      <div className="flex items-center gap-5 mb-10 w-full">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 shrink-0">
          <Server size={32} className="text-white" />
        </div>
        <div>
          <h2 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter transition-colors duration-300 ${textColor}`}>
            Xplore Robot Version
          </h2>
          <p className={`font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase mt-1 font-bold transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            System Firmware & Software Management
          </p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Local Versions Card */}
        <div className={`rounded-xl border transition-colors duration-300 overflow-hidden ${cardBg}`}>
          <div className="flex justify-between items-center p-6 pb-0">
            <h3 className={`font-mono font-bold uppercase tracking-[0.2em] text-xs ${textColor}`}>Local Versions</h3>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-blue-400"
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
          
          <div className="p-6 pt-4 space-y-4">
            {[
              { version: '1.4.0', status: 'Running', active: true },
              { version: '1.3.1', status: 'Inactive', active: false },
              { version: 'factory', status: 'Inactive', active: false },
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border gap-4 transition-colors duration-300 hover:-translate-y-0.5 ${innerCardBg}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shrink-0 ${item.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')}`} />
                  <div>
                    <p className={`font-bold font-mono text-lg transition-colors duration-300 ${textColor}`}>{item.version}</p>
                    <p className={`text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 ${mutedColor}`}>dc8b6a7ec - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {item.active && <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>RUNNING</span>}
                  {!item.active && <button className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>DELETE</button>}
                  <button className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded transition-all flex-1 md:flex-none text-white ${item.active ? (isDarkMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-amber-500 hover:bg-amber-600') : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}>
                    {item.active ? 'UPDATE BOOTSTRAP' : 'APPLY'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Versions Card */}
        <div className={`rounded-xl border transition-colors duration-300 overflow-hidden ${cardBg}`}>
          <div className="flex justify-between items-center p-6 pb-0">
            <h3 className={`font-mono font-bold uppercase tracking-[0.2em] text-xs ${textColor}`}>Remote Versions</h3>
            <div className="flex items-center gap-2">
              <button className={`text-[9px] font-bold tracking-widest uppercase transition-colors underline mr-2 ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>DOCKER LOGIN</button>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-blue-400"
              >
                <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
              </button>
            </div>
          </div>
          
          <div className="p-6 pt-4">
            <input 
              type="text" 
              placeholder="custom-user/blueos-core" 
              className={`w-full border rounded-lg p-3.5 text-sm mb-6 outline-none transition-colors duration-300 font-mono font-bold ${inputBg}`}
            />
            <div className="space-y-3">
              <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border gap-3 transition-colors duration-300 hover:-translate-y-0.5 ${innerCardBg}`}>
                <span className={`text-sm font-bold font-mono transition-colors duration-300 ${textColor}`}>master <span className={`text-[10px] uppercase tracking-widest ${mutedColor}`}>(a2e96468)</span></span>
                <button className="text-[10px] font-mono font-bold tracking-widest uppercase bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md w-full md:w-auto">DOWNLOAD AND APPLY</button>
              </div>
              <div className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border gap-3 transition-colors duration-300 hover:-translate-y-0.5 ${innerCardBg}`}>
                <span className={`text-sm font-bold font-mono transition-colors duration-300 ${textColor}`}>1.4.0-beta.15</span>
                <button className="text-[10px] font-mono font-bold tracking-widest uppercase bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md w-full md:w-auto">DOWNLOAD AND APPLY</button>
              </div>
            </div>
            {/* Pagination */}
            <div className="flex gap-2 justify-center mt-8">
              {[1, 2, 3, 4, 5].map(num => (
                <button key={num} className={`w-8 h-8 rounded-md font-mono font-bold text-xs transition-colors duration-300 ${num === 1 ? 'bg-blue-600 text-white shadow-md' : (isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700')}`}>{num}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Upload Card */}
        <div className={`rounded-xl border transition-colors duration-300 overflow-hidden ${cardBg}`}>
          <div className="flex justify-between items-center p-6 pb-0">
            <div>
              <h3 className={`font-mono font-bold uppercase tracking-[0.2em] text-xs ${textColor}`}>Manual Upload</h3>
              <p className={`text-[9px] uppercase tracking-widest mt-1 ${subtitleColor}`}>Use this to upload a .tar docker image.</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-blue-400"
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
          
          <div className="p-6 pt-4">
            <div className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group ${isDarkMode ? 'border-slate-700 hover:border-blue-500 hover:bg-blue-500/5' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'}`}>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${isDarkMode ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}>Click or drag file here</span>
            </div>
            <button className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-[10px] tracking-[0.2em] uppercase font-mono font-bold shadow-lg active:scale-[0.98] transition-transform">
              UPLOAD IMAGE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlueOSVersion;