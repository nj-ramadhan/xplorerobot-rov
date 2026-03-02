import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuCard } from '../components/MenuCard';

const menus = [
  { path: '/simulation', title: 'Autopilot Firmware',  desc: 'Update flight controller firmware.', icon: '🚀' },
  { path: '/params',   title: 'Autopilot Parameters',desc: 'Modify vehicle parameters in real-time.', icon: '📑' },
  { path: '/live',     title: 'Live Telemetry',      desc: 'Real-time sensor data and video stream.', icon: '📊' },
  { path: '/video',    title: 'Video Streams',       desc: 'Configure all video input devices.',      icon: '📹' },
  { path: '/setup',    title: 'Vehicle Setup',       desc: 'Sensor calibrations and motor tests.',    icon: '⚙️' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">ROV Ground Station</h2>
        <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest">Main Control Menu</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menus.map((m) => (
          <MenuCard 
            key={m.path} 
            icon={m.icon} 
            title={m.title} 
            description={m.desc} 
            onClick={() => navigate(m.path)} // Pindah ke alamat path
          />
        ))}
      </div>
    </div>
  );
};