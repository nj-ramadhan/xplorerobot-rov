import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuGroups } from '../types/menu'; 
import { Power, Settings as SettingsIcon, Bug } from 'lucide-react';

// 🔥 Import KEDUA Logo
import LogoXploreSimple from '../assets/logo_xplore_robot_simple.png';
import LogoXploreFull from '../assets/logo_xplore_robot_full.png';

interface SidebarProps {
  isDarkMode: boolean;
  isDetailMode: boolean;
  setIsDetailMode: (value: boolean) => void;
}

const Sidebar = ({ isDarkMode, isDetailMode, setIsDetailMode }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isHidden = isDetailMode && !isHovered;
  const isWide = isHovered;

  return (
    <>
      {/* SENSOR HOVER KIRI */}
      {isDetailMode && (
        <div
          className="fixed inset-y-0 left-0 w-3 z-[100]"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-0 top-0 h-screen z-[90] flex flex-col transition-all duration-300 ease-in-out
          ${isDarkMode ? 'bg-[#1a1c1e] border-r border-gray-800' : 'bg-white border-r border-gray-200'}
          ${isWide ? 'w-64' : 'w-24'} 
          ${isHidden ? '-translate-x-full shadow-none' : 'translate-x-0 shadow-2xl'}
        `}
      >
        {/* HEADER */}
        <div
          className={`p-4 flex items-center justify-center border-b cursor-pointer transition-colors h-[72px]
            ${isDarkMode ? 'bg-[#16181a] border-gray-800 hover:bg-gray-800/50' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}
          `}
          onClick={() => setIsDetailMode(!isDetailMode)}
        >
          <div className="flex justify-center items-center h-full w-full">
             <img 
               src={isWide ? LogoXploreFull : LogoXploreSimple} 
               alt="Xplore Robot Logo" 
               // 🔥 LOGIKA BARU: Jika Gelap di-invert (jadi putih), jika Terang normal (tetap hitam)
               className={`object-contain transition-all duration-300 opacity-90 
                 ${isDarkMode ? 'invert' : ''} 
                 ${isWide ? 'h-10 w-48' : 'h-8 w-8'}
               `} 
             />
          </div>
        </div>

        {/* MENU KOMPLIT */}
        <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              
              <p className={`px-6 text-[9px] font-black mb-3 uppercase tracking-wider transition-all duration-300 
                ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                ${isWide ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}>
                {group.title}
              </p>

              <div className="flex flex-col w-full px-2">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      title={!isWide ? item.title : undefined}
                      className={({ isActive }) => `
                        flex items-center transition-all duration-200 my-1 rounded-xl
                        ${isWide ? 'px-4 py-2.5' : 'justify-center py-3 mx-1'}
                        ${isActive
                          ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-600' 
                          : isDarkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                      `}
                    >
                      <Icon size={isWide ? 18 : 22} className="shrink-0" />
                      <span className={`text-[13px] font-medium whitespace-nowrap transition-all duration-300 ${isWide ? 'opacity-100 w-full ml-3' : 'opacity-0 w-0 hidden ml-0'}`}>
                        {item.title}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={`border-t transition-colors p-4 
          ${isDarkMode ? 'bg-[#141517] border-gray-800' : 'bg-gray-100 border-gray-200'}
        `}>
          <div className="flex flex-row justify-center items-center gap-4">
            <Power size={18} className={`cursor-pointer transition-colors shrink-0 ${isDarkMode ? 'text-gray-500 hover:text-red-500' : 'text-gray-400 hover:text-red-600'}`} />
            <SettingsIcon size={18} className={`cursor-pointer transition-colors shrink-0 ${isDarkMode ? 'text-gray-500 hover:text-blue-500' : 'text-gray-400 hover:text-blue-600'}`} />
            <Bug size={18} className={`cursor-pointer transition-colors shrink-0 ${isDarkMode ? 'text-gray-500 hover:text-yellow-500' : 'text-gray-400 hover:text-yellow-600'}`} />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;