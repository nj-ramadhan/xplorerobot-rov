import { useState } from 'react';
// Pastikan semua komponen di-import di sini
import { Monitor } from './Monitor';
import { Processes } from './Processes';
import { Network } from './Network';
import { Kernel } from './Kernel';
import { Firmware } from './Firmware';
import { About } from './About';

const tabs = ['Monitor', 'Processes', 'Network', 'Kernel', 'Firmware', 'About'];

export const SystemInformation = () => {
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

  return (
    <div className="bg-[#0b111a] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Konten yang berubah dinamis */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};