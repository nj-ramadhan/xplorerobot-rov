import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Activity, Navigation, Target, Radio, Video, 
  Waves, Settings, Sliders, HardDrive, FileSearch, 
  Info, ShieldCheck, Users, LucideIcon 
} from 'lucide-react';

// Import Assets
// @ts-ignore
import rovModel from '../assets/rov-model.png';
// @ts-ignore
import exploreGif from '../assets/Logo XploreRobot.gif'; 
// @ts-ignore
import rovBg from '../assets/rov-bg.jpg'; // Import foto baru di sini

interface MenuItem {
  path: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: LucideIcon;
}

const menus: MenuItem[] = [
  { path: '/manual',     title: 'Manual Simulation', subtitle: 'MAVLINK_CORE', icon: Cpu, desc: 'Override and control vehicle movements via ArduSub SITL.' },
  { path: '/manualros2', title: 'ROS 2 Simulation', subtitle: 'ROS2_GAZEBO', icon: Activity, desc: 'Direct Thruster Control Matrix within Gazebo environment.' },
  { path: '/autonomous', title: 'Autonomous Mode', subtitle: 'TACTICAL_NAV', icon: Navigation, desc: 'Point & Go tactical navigation map via ROS 2 Bridge.' },
  { path: '/mission',    title: 'Mission Control', subtitle: 'EXEC_PLAN', icon: Target, desc: 'Create, manage, and execute navigation missions.' },
  { path: '/live',       title: 'Live Telemetry', subtitle: 'SENSOR_DATA', icon: Radio, desc: 'Real-time sensor data and video stream.' },
  { path: '/video',      title: 'Video Streams', subtitle: 'MEDIA_MGMT', icon: Video, desc: 'Manage your video devices and video streams.' },
  { path: '/ping',       title: 'Ping Sonar', subtitle: 'AC_SCAN', icon: Waves, desc: 'Manage detected Ping family sonar devices.' },
  { path: '/setup',      title: 'Vehicle Setup', subtitle: 'CALIBRATION', icon: Settings, desc: 'Sensor calibrations and motor tests.' },
  { path: '/params',     title: 'Autopilot Params', subtitle: 'CONFIG_INT', icon: Sliders, desc: 'Modify vehicle parameters in real-time.' },
  { path: '/simulation', title: 'Firmware Update', subtitle: 'SYS_UPDATE', icon: HardDrive, desc: 'Update flight controller firmware.' },
  { path: '/browser',    title: 'Log Browser', subtitle: 'DATA_ANALYSIS', icon: FileSearch, desc: 'Browse Telemetry (.tlog) and Binary (.bin) logs.' },
  { path: '/system-info',title: 'System Info', subtitle: 'KERNEL_STAT', icon: Info, desc: 'Monitor system, processes, and kernel.' },
  { path: '/blueos',     title: 'System Version', subtitle: 'REPO_MGMT', icon: ShieldCheck, desc: 'Manage system firmware and updates.' },
  { path: '/kami',       title: 'Team Archive', subtitle: 'TEAM_ARCHIVE', icon: Users, desc: 'Documentation about the development team.' },
];

export const Home: React.FC<{ isDarkMode?: boolean; onCardClick?: () => void }> = ({ isDarkMode = true, onCardClick }) => {
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    if (onCardClick) onCardClick();
    navigate(path);
  };

  return (
    <div className="relative w-full flex flex-col space-y-12 animate-in fade-in duration-700 font-sans p-6">
      
      {/* HERO SECTION */}
      <div className="group flex flex-col md:flex-row h-auto items-center pt-4">
        <div className="w-full md:w-1/2 flex flex-col justify-center z-10 ">
          <h1 className={`text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            XPLORE ROBOT <br /> 
            <span className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>GROUND STATION</span>
          </h1>
          <p className={`text-sm font-medium tracking-[0.15em] uppercase opacity-70 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Industrial Informatics — TRIN
          </p>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center relative hidden md:flex h-48">
          <img src={exploreGif} alt="Logo" className={`absolute w-48 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'invert' : ''}`} />
          <img src={rovModel} alt="ROV" className="absolute w-72 z-20 transition-transform duration-700 group-hover:translate-x-40" />
        </div>
      </div>

      {/* GRID CARDS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pb-6">
        {menus.map((m) => {
          
          const cardBorderClasses = isDarkMode 
            ? 'border-slate-700/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]' 
            : 'border-slate-200 hover:border-blue-500 hover:shadow-[0_8px_20px_rgba(59,130,246,0.2)] shadow-md';

          const titleColor = isDarkMode ? 'text-white' : 'text-slate-900 group-hover:text-white';
          const descColor = isDarkMode ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-200';
          const subtitleColor = isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-300';
          const readyColor = isDarkMode ? 'text-emerald-400/90' : 'text-emerald-600 font-bold group-hover:text-emerald-400/90';

          return (
            <div 
              key={m.path} 
              onClick={() => handleMenuClick(m.path)}
              className={`relative rounded-xl p-4 flex flex-col justify-between border transition-all duration-500 cursor-pointer min-h-[180px] overflow-hidden group ${cardBorderClasses}`}
            >
              {/* LAYER 1: Background Base */}
              <div className={`absolute inset-0 transition-opacity duration-500 z-0 ${
                isDarkMode ? 'bg-slate-800/60 backdrop-blur-md group-hover:opacity-0' : 'bg-white group-hover:opacity-0'
              }`}></div>

              {/* LAYER 2: Image Reveal - Updated with rovBg */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-40 transition-all duration-500 scale-110 group-hover:scale-100 z-0"
                style={{ backgroundImage: `url(${rovBg})` }} 
              ></div>

              {/* LAYER 3: Gradient Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t z-0 ${
                isDarkMode ? 'from-slate-950 via-slate-900/80 to-transparent' : 'from-blue-900 via-blue-900/60 to-transparent'
              }`}></div>

              {/* CONTENT */}
              <div className="relative z-10">
                <span className={`text-[10px] uppercase tracking-wider transition-colors duration-300 ${subtitleColor}`}>
                  {m.subtitle}
                </span>
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <m.icon className="w-5 h-5 text-blue-500" />
                  <h3 className={`font-bold text-sm transition-colors duration-300 ${titleColor}`}>
                    {m.title}
                  </h3>
                </div>
                <p className={`text-[11px] leading-relaxed transition-colors duration-300 line-clamp-3 ${descColor}`}>
                  {m.desc}
                </p>
              </div>

              {/* STATUS INDICATOR */}
              <div className="relative z-10 flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className={`text-[10px] tracking-wide uppercase transition-colors duration-300 ${readyColor}`}>
                  Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};