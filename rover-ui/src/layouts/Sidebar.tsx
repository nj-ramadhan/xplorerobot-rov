import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuGroups } from '../types/menu'; 
// 🔥 IMPORT IKON BARU: Navigation (Buat gantiin kotak biru R/B)
import { Power, Settings as SettingsIcon, Bug, Navigation } from 'lucide-react';

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
          fixed left-0 top-0 h-screen z-[90] flex flex-col border-r border-gray-800
          transition-all duration-300 ease-in-out
          ${isDarkMode ? 'bg-[#1a1c1e]' : 'bg-white'}
          ${isWide ? 'w-64' : 'w-24'} 
          ${isHidden ? '-translate-x-full shadow-none' : 'translate-x-0 shadow-2xl'}
        `}
      >
        {/* HEADER */}
        <div
          className="p-4 flex items-center bg-[#16181a] border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors h-[72px]"
          onClick={() => setIsDetailMode(!isDetailMode)}
        >
          {/* 🔥 LOGO SAKTI BARU: Pakai ikon Navigation + Efek Glow Hologram */}
          <div className={`flex items-center justify-center shrink-0 w-8 h-8 transition-all ${!isWide ? 'mx-auto' : ''}`}>
             <div className="relative">
                {/* Bayangan Glow Biru di Belakang (Efek Hologram) */}
                <Navigation size={20} className="absolute inset-0 text-blue-500/50 blur-[2px]" />
                {/* Ikon Utama Putih Serong */}
                <Navigation size={20} className="text-white drop-shadow-[0_0_8px_#3b82f6]" />
             </div>
          </div>
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isWide ? 'opacity-100 w-full ml-3' : 'opacity-0 w-0 ml-0'}`}>
            <h1 className="font-bold text-white text-lg leading-none uppercase tracking-wide">BlueOS</h1>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Polman Edition</span>
          </div>
        </div>

        {/* MENU KOMPLIT */}
        <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              
              <p className={`px-6 text-[9px] font-black text-gray-500 mb-3 uppercase tracking-wider transition-all duration-300 ${isWide ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}>
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
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
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
        <div className="bg-[#141517] border-t border-gray-800 p-4">
          <div className="flex flex-row justify-center items-center gap-4">
            <Power size={18} className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors shrink-0" />
            <SettingsIcon size={18} className="cursor-pointer text-gray-500 hover:text-blue-500 transition-colors shrink-0" />
            <Bug size={18} className="cursor-pointer text-gray-500 hover:text-yellow-500 transition-colors shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;