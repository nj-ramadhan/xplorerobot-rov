import React, { useState } from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

// Import komponen internal
import { Monitor } from './Monitor';
import { Processes } from './Processes';
import { Network } from './Network';
import { Kernel } from './Kernel';
import { Firmware } from './Firmware';
import { About } from './About';

const tabs = ['Monitor', 'Processes', 'Network', 'Kernel', 'Firmware', 'About'];

interface SystemInformationProps {
  isDarkMode?: boolean;
}

export const SystemInformation: React.FC<SystemInformationProps> = ({ isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState('Monitor');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Monitor': return <Monitor />;
      case 'Processes': return <Processes />;
      case 'Network': return <Network />;
      case 'Kernel': return <Kernel />;
      case 'Firmware': return <Firmware />;
      case 'About': return <About />;
      default: return <Monitor />;
    }
  };

  const textColor = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/80 border-slate-800 shadow-2xl backdrop-blur-md' 
    : 'bg-white border-slate-200 shadow-xl';
  const headerBorder = isDarkMode ? 'border-slate-800' : 'border-slate-200';

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-['Inter',sans-serif] w-full min-h-screen ${textColor}`}>
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-5 mb-8 w-full px-2">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 shrink-0">
          <Cpu size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            System Information
          </h2>
          <p className={`font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase mt-1 font-bold ${subtitleColor}`}>
            Hardware, Network & OS Diagnostics
          </p>
        </div>
      </div>

      {/* KOTAK KONTEN & TAB */}
      <div className={`rounded-2xl overflow-hidden border ${cardBg}`}>
        
        {/* TAB BAR + REFRESH ICON ONLY */}
        <div className={`flex items-center justify-between border-b ${headerBorder}`}>
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              const activeStyle = isDarkMode 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' 
                : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50';
              const idleStyle = isDarkMode
                ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50';

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap ${
                    isActive ? activeStyle : idleStyle
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* REFRESH ICON ONLY (Cuma Ikon di kanan atas card) */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-6 py-5 flex items-center justify-center group border-l border-transparent hover:bg-white/5 transition-all text-slate-500 hover:text-blue-400"
            style={{ borderColor: isDarkMode ? 'rgb(30 41 59 / 0.5)' : 'rgb(226 232 240)' }}
            title="Refresh Data"
          >
            <RefreshCw 
              size={18} 
              className={`transition-transform duration-500 ${isRefreshing ? 'animate-spin text-blue-400' : 'group-hover:rotate-180'}`} 
            />
          </button>
        </div>

        <div className={`p-6 md:p-10 min-h-[400px] transition-opacity duration-500 ${isRefreshing ? 'opacity-30' : 'opacity-100'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};