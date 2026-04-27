import React, { useState } from 'react';

// Import semua komponen sub-tab
import Parameters from './Parameters';
import Gyroscope from './Gyroscope';
import Accelerometer from './Accelerometer';
import Compass from './Compass';
import Baro from './Baro';
import Lights from './Lights';
import Failsafes from './Failsafes';
import CameraGimbal from './CameraGimbal';

// 1. Tambahkan interface untuk menerima saklar isDarkMode
interface ConfigureProps {
  isDarkMode?: boolean;
}

export default function Configure({ isDarkMode = true }: ConfigureProps) {
  const [activeSubTab, setActiveSubTab] = useState('parameters');

  // 2. DAFTAR TAB: Pastikan isDarkMode dioper ke semua komponen anak!
  const subTabs = [
    { id: 'parameters', label: 'PARAMETERS', component: <Parameters isDarkMode={isDarkMode} /> },
    { id: 'gyroscope', label: 'GYROSCOPE', component: <Gyroscope isDarkMode={isDarkMode} /> },
    { id: 'accelerometer', label: 'ACCELEROMETER', component: <Accelerometer isDarkMode={isDarkMode} /> },
    { id: 'compass', label: 'COMPASS', component: <Compass isDarkMode={isDarkMode} /> },
    { id: 'baro', label: 'BARO', component: <Baro isDarkMode={isDarkMode} /> },
    { id: 'lights', label: 'LIGHTS', component: <Lights isDarkMode={isDarkMode} /> },
    { id: 'failsafes', label: 'FAILSAFES', component: <Failsafes isDarkMode={isDarkMode} /> },
    { id: 'camera', label: 'CAMERA GIMBAL', component: <CameraGimbal isDarkMode={isDarkMode} /> },
  ];

  // ==========================================
  // LOGIKA TEMA BUNGLON UNTUK NAVIGASI TAB
  // ==========================================
  const borderBottom = isDarkMode ? 'border-slate-700/50' : 'border-slate-200';
  
  const getTabStyle = (isActive: boolean) => {
    if (isActive) {
      return isDarkMode 
        ? 'border-blue-500 text-blue-400' 
        : 'border-blue-600 text-blue-600';
    } else {
      return isDarkMode 
        ? 'border-transparent text-slate-500 hover:text-slate-300' 
        : 'border-transparent text-slate-500 hover:text-slate-800';
    }
  };

  return (
    <div className="w-full font-['Inter',sans-serif]">
      
      {/* Sub Tab Header */}
      <div className={`flex flex-wrap gap-6 border-b mb-8 transition-colors duration-300 ${borderBottom}`}>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-3 border-b-[3px] transition-all text-[11px] font-bold tracking-widest uppercase ${getTabStyle(activeSubTab === tab.id)}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Komponen Aktif */}
      <div className="mt-4 animate-in fade-in duration-500">
        {subTabs.find((tab) => tab.id === activeSubTab)?.component}
      </div>
      
    </div>
  );
}