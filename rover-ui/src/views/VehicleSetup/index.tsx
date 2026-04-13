import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import Overview from './Overview';
import PwmOutputs from './PwmOutputs'; 
import Configure from './Configure';

interface VehicleSetupProps {
  isDarkMode?: boolean;
}

export default function VehicleSetup({ isDarkMode = true }: VehicleSetupProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'pwm', label: 'PWM OUTPUTS' },
    { id: 'configure', label: 'CONFIGURE' },
  ];

  // LOGIKA TEMA
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const accentColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-slate-200';

  return (
    <div className="animate-in fade-in duration-500 mt-2 font-['Inter',sans-serif] w-full max-w-7xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-5 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Wrench size={32} className="text-white" />
        </div>
        <div>
          <h1 className={`font-heading text-3xl md:text-4xl font-black tracking-tight uppercase transition-colors duration-300 ${titleColor}`}>
            Vehicle Setup
          </h1>
          <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold transition-colors duration-300 ${accentColor}`}>
            Sensor calibrations and motor tests
          </p>
        </div>
      </div>

      {/* TAB HEADER */}
      <div className={`flex space-x-8 border-b transition-colors duration-300 mb-8 ${borderColor}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 border-b-[3px] font-bold tracking-widest text-xs uppercase transition-all duration-300 ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-500' 
                : `border-transparent ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DYNAMIC CONTENT */}
      {/* Nah, di sini bagian pentingnya! Kita ngoper isDarkMode ke Overview */}
      <div className="mt-4 transition-colors duration-300">
        {activeTab === 'overview' && <Overview isDarkMode={isDarkMode} />}
        {activeTab === 'pwm' && <PwmOutputs isDarkMode={isDarkMode} />}
        {activeTab === 'configure' && <Configure isDarkMode={isDarkMode} />}
      </div>
      
    </div>
  );
}