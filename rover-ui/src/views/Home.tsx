import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import aset
// @ts-ignore
import rovModel from '../assets/rov-model.png';
// @ts-ignore
import bgTeam from '../assets/rov-bg.jpg'; 
// @ts-ignore
import exploreGif from '../assets/Logo XploreRobot.gif'; 

// Gabungan properti untuk Home (isDarkMode & onCardClick)
interface HomeProps {
  isDarkMode?: boolean;
  onCardClick?: () => void;
}

// Gabungan menu yang sudah DIBERSIHKAN dari duplikat
const menus = [
  // 🎮 KELOMPOK SIMULASI & KONTROL
  { 
    path: '/manual', 
    title: 'Manual Simulation (MAVLink)', 
    desc: 'Override and control vehicle movements via ArduSub SITL.', 
    icon: '🎮'
  },
  { 
    path: '/manualros2', 
    title: 'Manual Simulation (ROS 2)', 
    desc: 'Direct Thruster Control Matrix within Gazebo ROS 2 environment.', 
    icon: '⚙️'
  },
  { 
    path: '/autonomous', 
    title: 'Autonomous Simulation (ROS 2)', 
    desc: 'Point & Go tactical navigation map via ROS 2 Bridge.', 
    icon: '🛰️'
  },
  { 
    path: '/mission', 
    title: 'Mission Control', 
    desc: 'Create, manage, and execute navigation missions with real-time updates.', 
    icon: '🎯' 
  },

  // 📊 KELOMPOK MONITORING & TELEMETRI
  { 
    path: '/live',     
    title: 'Live Telemetry',      
    desc: 'Real-time sensor data and video stream.', 
    icon: '📊' 
  },
  { 
    path: '/video',    
    title: 'Video Streams',       
    desc: 'Manage your video devices and video streams.', 
    icon: '🎥' 
  },
  { 
    path: '/ping',       
    title: 'Ping Sonar Devices',   
    desc: 'Manage detected Ping family sonar devices connected to the network.', 
    icon: '📡' 
  },

  // 🔧 KELOMPOK PENGATURAN & SISTEM
  { 
    path: '/setup',    
    title: 'Vehicle Setup',       
    desc: 'Sensor calibrations and motor tests.',    
    icon: '🔧' 
  },
  { 
    path: '/params',   
    title: 'Autopilot Parameters',
    desc: 'Modify vehicle parameters in real-time.', 
    icon: '📑' 
  },
  { 
    path: '/simulation', 
    title: 'Autopilot Firmware', 
    desc: 'Update flight controller firmware.', 
    icon: '🚀' 
  },
  { 
    path: '/browser',    
    title: 'Log Browser',          
    desc: 'Allow browsing the Telemetry (.tlog) and Binary (.bin) logs.', 
    icon: '📁' 
  },
  { 
    path: '/system-info', 
    title: 'System Information', 
    desc: 'Monitor system, processes, and kernel.', 
    icon: '🖥️' 
  },
  { 
    path: '/blueos',      
    title: 'BlueOS Version',      
    desc: 'Manage system firmware and updates.', 
    icon: '📦' 
  },

  // 👥 KELOMPOK INFORMASI TIM
  { 
    path: '/kami',      
    title: 'Dokumentasi Team',      
    desc: 'Informasi dan dokumentasi tentang tim pengembang.', 
    icon: '👥' 
  },
];

export const Home: React.FC<HomeProps> = ({ isDarkMode = true, onCardClick }) => {
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    // 1. Jalankan navigasi ke halaman yang dituju
    navigate(path);
    
    // 2. Jalankan fungsi untuk mengubah sidebar ke mode detail (panjang)
    if (onCardClick) {
      onCardClick();
    }
  };

  return (
    <div className="relative w-full flex flex-col space-y-10 animate-in fade-in duration-500">
      
      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <div className="group flex flex-col md:flex-row h-auto md:h-[220px] items-center pt-2">
        <div className="w-full md:w-1/2 flex flex-col justify-center drop-shadow-xl z-10">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-2 tracking-wide ${
            isDarkMode ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]' : 'text-slate-800 drop-shadow-sm'
          }`}>
            EXPLOR ROBOT <br /> GROUND STATION
          </h1>
          <h2 className={`text-sm md:text-base font-bold tracking-widest uppercase ${
            isDarkMode ? 'text-blue-300 drop-shadow-md' : 'text-blue-700'
          }`}>
            Initialize System & Telemetry Control
          </h2>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center relative mt-10 md:mt-0 z-10 hidden md:flex">
          <img 
            src={exploreGif} 
            alt="Explore Team" 
            className={`absolute w-56 h-auto z-10 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-500 delay-150 ${
              isDarkMode ? 'invert drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'drop-shadow-md'
            }`}
          />
          <img 
            src={rovModel} 
            alt="ROV" 
            className={`absolute w-64 h-auto z-20 transform transition-transform duration-700 ease-in-out group-hover:translate-x-40 ${
              isDarkMode ? 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]' : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]'
            }`}
          />
        </div>
      </div>

      {/* =========================================
          2. GRID CARDS SECTION
          ========================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pb-6">
        {menus.map((m) => {
          
          // 1. Warna Border Kartu
          const cardBorderClasses = isDarkMode 
            ? 'border-slate-700/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]' 
            : 'border-slate-300 hover:border-blue-500 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] shadow-sm';

          // 2. Transisi Warna Teks
          const titleColor = isDarkMode ? 'text-white' : 'text-slate-800 group-hover:text-white';
          const descColor = isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-200';
          const subtitleColor = isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-300';
          const readyColor = isDarkMode ? 'text-emerald-400/90' : 'text-emerald-600 group-hover:text-emerald-400/90';

          return (
            <div 
              key={m.path} 
              onClick={() => handleMenuClick(m.path)}
              className={`relative rounded-xl p-4 flex flex-col justify-between border transition-all duration-500 cursor-pointer min-h-[140px] overflow-hidden group ${cardBorderClasses}`}
            >
              {/* LAYER 1: Latar Kaca Default. */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                isDarkMode ? 'bg-[#1e293b]/50 backdrop-blur-md group-hover:opacity-0' : 'bg-white/70 backdrop-blur-md group-hover:opacity-0'
              }`}></div>

              {/* LAYER 2: Gambar Background Tersembunyi. */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-40 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500 scale-105 group-hover:scale-100"
                style={{ backgroundImage: `url(${bgTeam})` }}
              ></div>

              {/* LAYER 3: Gradien Penyelamat Teks. */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t ${
                isDarkMode ? 'from-[#060b19] via-[#060b19]/80 to-transparent' : 'from-[#060b19]/70 via-[#060b19]/40 to-transparent'
              }`}></div>

              {/* KONTEN TEKS */}
              <div className="relative z-10">
                <span className={`text-[10px] uppercase tracking-wider drop-shadow-sm transition-colors duration-300 ${subtitleColor}`}>
                  Pratinjau Koneksi
                </span>
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <span className="text-blue-500 text-lg drop-shadow-sm">{m.icon}</span> 
                  <h3 className={`font-bold text-sm drop-shadow-sm transition-colors duration-300 ${titleColor}`}>
                    {m.title}
                  </h3>
                </div>
                <p className={`text-[11px] leading-relaxed drop-shadow-sm transition-colors duration-300 ${descColor}`}>
                  {m.desc}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className={`text-[11px] font-medium tracking-wide transition-colors duration-300 ${readyColor}`}>
                  Ready to Connect
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Home;