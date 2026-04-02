import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { menuGroups } from '../types/menu';
import { Power, Settings as SettingsIcon, Bug, Home, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  isDarkMode: boolean;
  isDetailMode: boolean;
  setIsDetailMode: (value: boolean) => void;
}

const Sidebar = ({ isDarkMode, isDetailMode, setIsDetailMode }: SidebarProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleBackToHome = () => {
    setIsDetailMode(false);
    navigate('/');
  };

  // Logika sembunyi total
  const isHidden = isDetailMode && !isHovered;

  return (
    <>
      {/* 1. TRIGGER AREA: Sensor tipis di kiri layar agar bisa di-hover */}
      {isDetailMode && (
        <div 
          className="fixed inset-y-0 left-0 w-2 z-[100]"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      {/* 2. SIDEBAR UTAMA */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-0 top-0 h-screen z-[90] 
          flex flex-col border-r border-gray-800
          transition-all duration-300 ease-in-out transform
          ${isDarkMode ? 'bg-[#1a1c1e]' : 'bg-white'}
          ${isDetailMode ? 'w-64' : 'w-20'}
          ${isHidden ? '-translate-x-full shadow-none' : 'translate-x-0 shadow-2xl'}
        `}
      >
        {/* HEADER */}
        <div 
          className={`p-4 flex items-center gap-3 bg-[#16181a] border-b border-gray-800 ${isDetailMode ? 'cursor-pointer' : ''}`}
          onClick={isDetailMode ? handleBackToHome : undefined}
        >
          <div className="bg-blue-600 p-2 rounded shadow-lg shrink-0 flex items-center justify-center w-10 h-10">
            <span className="font-bold text-white text-xl font-mono">
              {isDetailMode ? 'B' : 'R'}
            </span>
          </div>
          {isDetailMode && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-bold text-white text-lg leading-none uppercase">BlueOS</h1>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Polman Edition</span>
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
          {!isDetailMode ? (
            <div className="flex flex-col items-center gap-6 py-4">
              <NavLink to="/" className={({isActive}) => `${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-400`}>
                <Home size={20} />
              </NavLink>
              <NavLink to="/live" className={({isActive}) => `${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-400`}>
                <LayoutGrid size={20} />
              </NavLink>
            </div>
          ) : (
            menuGroups.map((group, idx) => (
              <div key={idx} className="mb-4">
                <p className="px-6 text-[9px] font-black text-gray-500 mb-3 uppercase">{group.title}</p>
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-6 py-2 transition-all
                        ${isActive ? 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-600' : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'}
                      `}
                    >
                      <Icon size={16} />
                      <span className="text-[13px] font-medium">{item.title}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-[#141517] border-t border-gray-800 p-2">
          <div className="flex justify-around">
            <Power size={18} className="cursor-pointer hover:text-red-500" />
            <SettingsIcon size={18} className="cursor-pointer hover:text-blue-500" />
            <Bug size={18} className="cursor-pointer hover:text-yellow-500" />
          </div>
        </div>
      </aside>

      {/* 3. PENGGANTI RUANG (Agar konten bergeser otomatis) */}
      {!isDetailMode && <div className="w-20 shrink-0" />}
    </>
  );
};

export default Sidebar;