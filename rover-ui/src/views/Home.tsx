import React from 'react';
import { useNavigate } from 'react-router-dom';
// Import Icons
import { 
  Cpu, Activity, Navigation, Target, Radio, Video, 
  Waves, Settings, Sliders, HardDrive, FileSearch, 
  Info, ShieldCheck, Users, LucideIcon 
} from 'lucide-react';

// @ts-ignore
import rovModel from '../assets/rov-model.png';
// @ts-ignore
import exploreGif from '../assets/Logo XploreRobot.gif'; 

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

  return (
    <div className="relative w-full flex flex-col space-y-12 animate-in fade-in duration-700 font-sans">
      
      {/* HERO SECTION (Tata letak Gambar 1) */}
      <div className="group flex flex-col md:flex-row h-auto md:h-auto items-center pt-4">
        <div className="w-full md:w-1/2 flex flex-col justify-center z-10 ">
          <h1 className={`text-5xl md:text-6xl font-extrabold tracking-tight leading-[1] mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            XPLORE ROBOT <br /> 
            <span className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>GROUND STATION</span>
          </h1>
          <p className={`text-sm font-medium tracking-[0.15em] uppercase opacity-70 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Industrial Informatics — TRIN
          </p>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center relative hidden md:flex">
          <img src={exploreGif} alt="Logo" className={`absolute w-48 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isDarkMode ? 'invert' : ''}`} />
          <img src={rovModel} alt="ROV" className="absolute w-72 z-20 transition-transform duration-700 group-hover:translate-x-42" />
        </div>
      </div>

      {/* GRID CARDS (Style Font Gambar 2 + Layout Gambar 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-10">
        {menus.map((m) => (
          <div 
            key={m.path} 
            onClick={() => { navigate(m.path); onCardClick?.(); }}
            className={`group relative rounded-xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[190px]
              ${isDarkMode 
                ? 'bg-slate-900/50 border-white/10 hover:border-blue-500/50 hover:bg-slate-800' 
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400'}`}
          >
            {/* Header: Subtitle & Icon */}
            <div className="flex justify-between items-start mb-4 ">
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-blue-400/80' : 'text-blue-600'}`}>
                {m.subtitle}
              </span>
              <m.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            </div>

            {/* Content: Simple Professional Font */}
            <div className="flex-1">
              <h3 className={`text-[15px] font-semibold mb-2 tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                {m.title}
              </h3>
              <p className={`text-[11px] leading-relaxed line-clamp-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {m.desc}
              </p>
            </div>

            {/* Footer: Status Indicator */}
            <div className="mt-4 pt-3 border-t border-slate-500/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-500/90">
                System Ready
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};