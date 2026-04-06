import React, { useState, useEffect, useRef } from 'react';
import { TelemetryData } from '../types/telemetry';

// Import gambar logo dari folder assets
import LogoXplore from '../assets/logo_xplore_robot_simple.png';

interface NavbarProps {
  telemetry: TelemetryData;
  isDarkMode: boolean;
  toggleMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ telemetry, isDarkMode, toggleMode }) => {
  const isConnected = telemetry.status.toUpperCase() === 'CONNECTED';
  
  // State untuk melacak dropdown mana yang terbuka
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown kalau user klik di luar area navbar kanan
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Helper untuk styling panel dropdown biar seragam
  const dropdownClass = `absolute top-full right-0 mt-4 w-56 rounded-md shadow-xl border z-50 overflow-hidden transform origin-top-right transition-all 
    ${isDarkMode ? 'bg-[#1e293b] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`;

  return (
    <header className={`h-16 border-b transition-colors duration-500 flex items-center justify-between px-6 z-40 flex-shrink-0
      ${isDarkMode ? 'bg-[#111827] border-white/10 text-white' : 'bg-white border-black/10 text-slate-900'}
    `}>
      
      {/* --- BAGIAN KIRI: Logo & Teks --- */}
      <div className="flex items-center gap-3">
        {/* Logo Xplore */}
        <img 
          src={LogoXplore} 
          alt="Xplore Robot Logo" 
          className={`h-10 w-auto object-contain transition-all duration-500 ${isDarkMode ? 'invert opacity-90' : 'opacity-90'}`}
        />
        
        {/* Teks ROV */}
        <div className="flex flex-col border-l-2 pl-3 border-slate-300 dark:border-slate-700 transition-colors">
          <h1 className="text-sm font-black tracking-tighter uppercase flex items-center gap-2">
            XR-ROV<span className="text-blue-500">CONTROL</span>
          </h1>
          <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest mt-0.5">
            Industrial Informatics - TRIN
          </p>
        </div>
      </div>

      {/* --- BAGIAN KANAN: Ikon Interactive (Koneksi & Kontrol) --- */}
      <div className="flex items-center gap-4 md:gap-5 opacity-90" ref={menuRef}>
        
        {/* 1. Status Heartbeat */}
        <div className="relative">
          <button onClick={() => toggleMenu('status')} className="focus:outline-none hover:scale-110 transition-transform">
            {isConnected ? (
              <svg className="w-5 h-5 text-red-500 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                <line x1="12" y1="5.67" x2="12" y2="21.23"></line>
                <path d="M12 5.67l-2 3h4l-4 5h4l-2 3"></path>
              </svg>
            )}
          </button>
          {activeMenu === 'status' && (
            <div className={dropdownClass}>
              <div className={`px-4 py-2 border-b text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>MAVLink Connection</div>
              <div className="p-4 text-xs space-y-2">
                <div className="flex justify-between"><span>Status:</span> <span className={isConnected ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{telemetry.status}</span></div>
                <div className="flex justify-between"><span>Ping / Latency:</span> <span className="font-mono text-green-400">12 ms</span></div>
                <div className="flex justify-between"><span>Packet Loss:</span> <span className="font-mono">0.02 %</span></div>
                <div className="flex justify-between"><span>Uptime:</span> <span className="font-mono">01:24:10</span></div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Toggle Dark/Light Mode */}
        <button onClick={toggleMode} className="hover:opacity-70 hover:scale-110 transition-all" title="Toggle Theme">
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
          )}
        </button>

        {/* 3. Ikon Robot (Autopilot) */}
        <div className="relative">
          <button onClick={() => toggleMenu('robot')} className="focus:outline-none hover:scale-110 transition-transform">
            <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2v2h2a4 4 0 0 1 4 4v5a2 2 0 0 1-2 2h-1v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2H6a2 2 0 0 1-2-2v-5a4 4 0 0 1 4-4h2V4a2 2 0 0 1 2-2zm0 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
          </button>
          {activeMenu === 'robot' && (
            <div className={dropdownClass}>
              <div className={`px-4 py-2 border-b text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>Flight Controller</div>
              <div className="p-4 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span>Current Mode:</span> 
                  <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">{telemetry.mode}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Arming State:</span> 
                  <span className="bg-red-500/20 text-red-500 border border-red-500 px-2 py-0.5 rounded text-[10px] font-bold">DISARMED</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Ikon Globe (GPS/Position) */}
        <div className="relative">
          <button onClick={() => toggleMenu('globe')} className="focus:outline-none hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </button>
          {activeMenu === 'globe' && (
            <div className={dropdownClass}>
              <div className={`px-4 py-2 border-b text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>Positioning (GPS/DVL)</div>
              <div className="p-4 text-xs space-y-2">
                <div className="flex justify-between"><span>Lock Type:</span> <span className="font-bold text-green-500">3D Fix</span></div>
                <div className="flex justify-between"><span>Satellites:</span> <span className="font-mono">14</span></div>
                <div className="flex justify-between"><span>HDOP:</span> <span className="font-mono text-green-400">0.8</span></div>
                <div className="flex justify-between"><span>Acoustic:</span> <span className="font-mono opacity-50">N/A</span></div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Ikon WiFi (Telemetry/Video Link) */}
        <div className="relative">
          <button onClick={() => toggleMenu('wifi')} className="focus:outline-none hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>
          </button>
          {activeMenu === 'wifi' && (
            <div className={dropdownClass}>
              <div className={`px-4 py-2 border-b text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>Network Links</div>
              <div className="p-4 text-xs space-y-3">
                <div>
                  <div className="flex justify-between mb-1"><span>Tether Signal</span> <span className="font-mono">98%</span></div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: '98%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span>Video Bitrate</span> <span className="font-mono">4.2 Mbps</span></div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '45%' }}></div></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Ikon Komputer/GCS (System Resources) */}
        <div className="relative">
          <button onClick={() => toggleMenu('monitor')} className="focus:outline-none hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </button>
          {activeMenu === 'monitor' && (
            <div className={dropdownClass}>
              <div className={`px-4 py-2 border-b text-xs font-bold ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>Companion Computer</div>
              <div className="p-4 text-xs space-y-2">
                <div className="flex justify-between"><span>CPU Usage:</span> <span className="font-mono text-yellow-500">45%</span></div>
                <div className="flex justify-between"><span>RAM:</span> <span className="font-mono">2.1 / 8 GB</span></div>
                <div className="flex justify-between"><span>Core Temp:</span> <span className="font-mono text-orange-500">58°C</span></div>
                <div className="flex justify-between"><span>Storage:</span> <span className="font-mono">14GB Free</span></div>
              </div>
            </div>
          )}
        </div>

        {/* 7. Lonceng Notifikasi */}
        <div className="relative">
          <button onClick={() => toggleMenu('bell')} className="relative ml-1 cursor-pointer hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
            <span className={`absolute -top-1.5 -right-2 bg-[#ff3b3b] text-white text-[9px] font-bold px-[5px] py-[1px] rounded-full shadow-sm border ${isDarkMode ? 'border-[#111827]' : 'border-white'}`}>
              3
            </span>
          </button>
          {activeMenu === 'bell' && (
            <div className={`${dropdownClass} w-64`}>
              <div className={`px-4 py-2 border-b text-xs font-bold flex justify-between ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                <span>System Alerts</span>
                <span className="text-[10px] text-blue-400 cursor-pointer">Clear All</span>
              </div>
              <div className="flex flex-col text-xs">
                <div className={`p-3 border-b border-slate-700/50 flex gap-2 items-start ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1"></div>
                  <div>
                    <p className="font-bold">Leak Sensor Not Calibrated</p>
                    <p className="opacity-70 text-[10px]">12 mins ago</p>
                  </div>
                </div>
                <div className={`p-3 border-b border-slate-700/50 flex gap-2 items-start ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
                  <div>
                    <p className="font-bold">Mission Upload Success</p>
                    <p className="opacity-70 text-[10px]">45 mins ago</p>
                  </div>
                </div>
                <div className={`p-3 flex gap-2 items-start ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1"></div>
                  <div>
                    <p className="font-bold">System Boot Sequence OK</p>
                    <p className="opacity-70 text-[10px]">1 hr ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};