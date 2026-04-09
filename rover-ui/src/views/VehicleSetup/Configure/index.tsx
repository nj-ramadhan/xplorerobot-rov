import { useState } from 'react';

// Import semua komponen sub-tab
import Parameters from './Parameters';
import Gyroscope from './Gyroscope';
import Accelerometer from './Accelerometer';
import Compass from './Compass';
import Baro from './Baro';
import Lights from './Lights';
import Failsafes from './Failsafes';
import CameraGimbal from './CameraGimbal';

export default function Configure() {
  const [activeSubTab, setActiveSubTab] = useState('parameters');

  // Daftar tab untuk memudahkan looping
  const subTabs = [
    { id: 'parameters', label: 'PARAMETERS', component: <Parameters /> },
    { id: 'gyroscope', label: 'GYROSCOPE', component: <Gyroscope /> },
    { id: 'accelerometer', label: 'ACCELEROMETER', component: <Accelerometer /> },
    { id: 'compass', label: 'COMPASS', component: <Compass /> },
    { id: 'baro', label: 'BARO', component: <Baro /> },
    { id: 'lights', label: 'LIGHTS', component: <Lights /> },
    { id: 'failsafes', label: 'FAILSAFES', component: <Failsafes /> },
    { id: 'camera', label: 'CAMERA GIMBAL', component: <CameraGimbal /> },
  ];

  return (
    <div className="w-full">
      {/* Sub Tab Header */}
      <div className="flex flex-wrap gap-6 border-b border-slate-700/50 mb-6">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`pb-2 border-b-2 transition-all text-xs font-semibold ${
              activeSubTab === tab.id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Komponen Aktif */}
      <div className="mt-4">
        {subTabs.find((tab) => tab.id === activeSubTab)?.component}
      </div>
    </div>
  );
}