import React, { useState } from 'react';
import { Cpu } from 'lucide-react'; // Tambahkan import ikon ini!

// Pastikan semua komponen di-import di sini
import { Monitor } from './Monitor';
import { Processes } from './Processes';
import { Network } from './Network';
import { Kernel } from './Kernel';
import { Firmware } from './Firmware';
import { About } from './About';

const tabs = ['Monitor', 'Processes', 'Network', 'Kernel', 'Firmware', 'About'];

// Tambahkan interface untuk menerima saklar isDarkMode
interface SystemInformationProps {
  isDarkMode?: boolean;
}

export const SystemInformation: React.FC<SystemInformationProps> = ({ isDarkMode = true }) => {
  const [activeTab, setActiveTab] = useState('Monitor');

  // Fungsi untuk memilih komponen mana yang akan ditampilkan
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

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  
  // Card Tab Container
  const cardBg = isDarkMode 
    ? 'bg-[#1A2332] border-slate-700 shadow-lg' 
    : 'bg-white border-slate-200 shadow-xl';
    
  const headerBorder = isDarkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 font-['Inter',sans-serif] w-full min-h-screen ${textColor}`}>
      
      {/* === HEADER YANG SUDAH DISELARASKAN === */}
      <div className="flex items-center gap-5 mb-8 w-full">
        {/* Kotak Ikon Biru */}
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 shrink-0">
          <Cpu size={32} className="text-white" />
        </div>
        
        {/* Teks Judul & Subtitle */}
        <div>
          <h2 className={`font-heading text-3xl md:text-4xl font-black uppercase tracking-tight transition-colors duration-300 ${textColor}`}>
            System Information
          </h2>
          <p className={`font-mono text-[11px] md:text-xs tracking-widest uppercase mt-1 font-bold transition-colors duration-300 ${subtitleColor}`}>
            Hardware, Network & OS Diagnostics
          </p>
        </div>
      </div>

      {/* === KOTAK KONTEN & TAB (BUNGLON) === */}
      <div className={`rounded-xl overflow-hidden border transition-colors duration-300 ${cardBg}`}>
        
        {/* Tab Navigation */}
        <div className={`flex border-b overflow-x-auto custom-scrollbar transition-colors duration-300 ${headerBorder}`}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            
            // Warna tab saat aktif (Biru nyala) dan saat diam
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
                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  isActive ? activeStyle : idleStyle
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Konten yang berubah dinamis */}
        <div className="p-6 md:p-8">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};