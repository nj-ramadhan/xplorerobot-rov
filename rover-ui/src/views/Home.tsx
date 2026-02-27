import React from 'react';
import { MenuCard } from '../components/MenuCard';

const menus = [
  { title: 'Autopilot Firmware',   desc: 'Update flight controller firmware to latest stable release.', icon: '🚀' },
  { title: 'Autopilot Parameters', desc: 'View and modify all vehicle parameters in real-time.',         icon: '📑' },
  { title: 'System Information',   desc: 'CPU, memory usage, temperature and network diagnostics.',      icon: '📊' },
  { title: 'Video Streams',        desc: 'Manage and configure all video input devices.',                icon: '📹' },
  { title: 'Vehicle Setup',        desc: 'Sensor calibrations, ESC mapping and motor tests.',            icon: '⚙️' },
];

export const Home: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div>
      <h2 className="font-display font-black text-lg text-white uppercase tracking-wide">System Menu</h2>
      <p className="text-[11px] font-mono text-slate-500 mt-1">
        ROV POLMAN BANDUNG · Industrial Informatics Ground Station
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {menus.map((m, i) => (
        <MenuCard key={i} icon={m.icon} title={m.title} description={m.desc} />
      ))}
    </div>
  </div>
);