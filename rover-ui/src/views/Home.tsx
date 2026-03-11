import React from 'react';
import { useNavigate } from 'react-router-dom';
// Pastikan path ke MenuCard ini sesuai dengan folder kamu
import { MenuCard } from '../components/MenuCard';

// Gabungan menu dari kedua branch, diurutkan secara logis
const menus = [
  { 
    path: '/manual', 
    title: 'Manual Simulation (MAVLink)', 
    desc: 'Override and control vehicle movements via ArduSub SITL.', 
    icon: '🎮'
  },
  { 
    path: '/manualros2', 
<<<<<<< HEAD
    title: 'Manual Simulation ROS2', 
    desc: 'Manual control specifically optimized for ROS2 environments.', 
    icon: '🕹️'
=======
    title: 'Manual Simulation (ROS 2)', 
    desc: 'Direct Thruster Control Matrix within Gazebo ROS 2 environment.', 
    icon: '⚙️'
>>>>>>> mahen
  },
  { 
    path: '/autonomous', 
    title: 'Autonomous Simulation (ROS 2)', 
    desc: 'Point & Go tactical navigation map via ROS 2 Bridge.', 
    icon: '🛰️'
  },
  { 
    path: '/Mission', 
    title: 'Mission Control', 
    desc: 'Create, manage, and execute navigation missions with real-time updates.', 
    icon: '🎯' 
  },
  { 
    path: '/simulation', 
    title: 'Autopilot Firmware',  
    desc: 'Update and manage flight controller firmware.', 
    icon: '🚀' 
  },
  { 
    path: '/params',   
    title: 'Autopilot Parameters',
    desc: 'Modify vehicle parameters in real-time.', 
    icon: '📑' 
  },
  { 
    path: '/live',     
    title: 'Live Telemetry',      
    desc: 'Real-time sensor data and video stream.', 
    icon: '📊' 
  },
  { 
    path: '/video',    
    title: 'Video Streams',       
<<<<<<< HEAD
    desc: 'Configure and manage all video input devices.',      
=======
    desc: 'Configure all video input devices.',       
>>>>>>> mahen
    icon: '📹' 
  },
  { 
    path: '/setup',    
    title: 'Vehicle Setup',       
    desc: 'Sensor calibrations and motor tests.',    
<<<<<<< HEAD
    icon: '⚙️' 
  },
  { 
    path: '/browser',    
    title: 'Log Browser',          
    desc: 'Browse Telemetry (.tlog) and Binary (.bin) logs.', 
    icon: '📁' 
  },
  { 
    path: '/ping',       
    title: 'Ping Sonar Devices',   
    desc: 'Manage detected Ping family sonar devices.', 
    icon: '📡' 
=======
    icon: '🔧' 
>>>>>>> mahen
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="font-display font-black text-xl text-white uppercase tracking-wider">
          ROV Ground Station
        </h2>
        <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
          Main Control Menu
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {menus.map((m) => (
          <MenuCard 
            key={m.path} 
            icon={m.icon} 
            title={m.title} 
            description={m.desc} 
<<<<<<< HEAD
            onClick={() => navigate(m.path)} 
=======
            onClick={() => navigate(m.path)}
>>>>>>> mahen
          />
        ))}
      </div>
    </div>
  );
};

export default Home;