import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuGroups } from '../types/menu'; 
import { Power, Settings as SettingsIcon, Bug, Github, MessageSquare, Users, Download, Trash2, RotateCcw, Rocket, AlertCircle, RefreshCw, HardDriveDownload, LogOut } from 'lucide-react';

// 🔥 Import Logo
// @ts-ignore
import LogoXploreSimple from '../assets/logo_xplore_robot_simple.png';
// @ts-ignore
import LogoXploreFull from '../assets/logo_xplore_robot_full.png';

interface SidebarProps {
  isDarkMode: boolean;
  isDetailMode: boolean;
  setIsDetailMode: (value: boolean) => void;
}

const Sidebar = ({ isDarkMode, isDetailMode, setIsDetailMode }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPowerModalOpen, setIsPowerModalOpen] = useState(false); // 🔥 Tambah state Power

  const isHidden = isDetailMode && !isHovered;
  const isWide = isHovered;

  // Reusable Component untuk tombol di dalam modal agar rapi
  const ModalButton = ({ children, icon: Icon, onClick, disabled = false, iconColor = "" }: any) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-3 w-full py-3 px-4 rounded shadow-sm transition-all duration-150
        uppercase text-[11px] font-bold tracking-widest
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.98]'}
        ${isDarkMode 
          ? 'bg-slate-800 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border-slate-700' 
          : 'bg-white text-slate-800 border border-gray-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'}
      `}
    >
      {Icon && <Icon size={16} className={iconColor} />}
      {children}
    </button>
  );

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
          fixed left-0 top-0 h-screen z-[90] flex flex-col border-r 
          transition-all duration-300 ease-in-out
          ${isDarkMode ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-slate-200 shadow-[2px_0_20px_rgba(0,0,0,0.05)]'}
          ${isWide ? 'w-64' : 'w-24'} 
          ${isHidden ? '-translate-x-full shadow-none' : 'translate-x-0'}
        `}
      >
        {/* HEADER */}
        <div
          className={`p-4 flex items-center justify-center border-b cursor-pointer transition-colors h-[72px] ${
            isDarkMode ? 'bg-[#16181a] border-gray-800 hover:bg-gray-800/50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
          }`}
          onClick={() => setIsDetailMode(!isDetailMode)}
        >
          <div className="flex justify-center items-center h-full w-full">
             <img 
               src={isWide ? LogoXploreFull : LogoXploreSimple} 
               alt="Xplore Robot Logo" 
               className={`object-contain transition-all duration-300 ${
                 isDarkMode ? 'brightness-0 invert opacity-90' : 'brightness-0 opacity-80'
               } ${isWide ? 'h-10 w-48' : 'h-8 w-8'}`} 
             />
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden [&::-webkit-scrollbar]:hidden">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <p className={`px-6 text-[9px] font-black mb-3 uppercase tracking-wider transition-all duration-300 ${
                isDarkMode ? 'text-gray-500' : 'text-slate-400'
              } ${isWide ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}>
                {group.title}
              </p>

              <div className="flex flex-col w-full px-2">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  
                  // 🔥 PENGALIH OTOMATIS: Kalau path-nya "/", paksa ganti ke "/home"
                  const targetPath = item.path === '/' ? '/home' : item.path;

                  return (
                    <NavLink
                      key={itemIdx}
                      to={targetPath}
                      title={!isWide ? item.title : undefined}
                      className={({ isActive }) => `
                        flex items-center transition-all duration-200 my-1 rounded-xl
                        ${isWide ? 'px-4 py-2.5' : 'justify-center py-3 mx-1'}
                        ${isActive
                          ? (isDarkMode ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-600' : 'bg-blue-50 text-blue-600 border-r-4 border-blue-500 shadow-sm')
                          : (isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100')}
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
        <div className={`border-t p-4 ${isDarkMode ? 'bg-[#141517] border-gray-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex flex-row justify-center items-center gap-4">
            {/* 🔥 Trigger Power Modal */}
            <Power 
              size={18} 
              onClick={() => setIsPowerModalOpen(true)}
              className={`cursor-pointer transition-colors ${isDarkMode ? 'text-gray-500 hover:text-red-500' : 'text-slate-400 hover:text-red-500'}`} 
            />
            <SettingsIcon 
              size={18} 
              onClick={() => setIsSettingsModalOpen(true)}
              className={`cursor-pointer transition-colors ${isDarkMode ? 'text-gray-500 hover:text-blue-500' : 'text-slate-400 hover:text-blue-500'}`} 
            />
            <Bug 
              size={18} 
              onClick={() => setIsBugModalOpen(true)}
              className={`cursor-pointer transition-colors ${isDarkMode ? 'text-gray-500 hover:text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`} 
            />
          </div>
        </div>
      </aside>

      {/* MODAL POWER (Ref: image_28d0a1.png) */}
      {isPowerModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`rounded-lg shadow-2xl w-[380px] overflow-hidden ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div className={`px-6 py-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
              <h2 className="text-xl font-medium">Power</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <ModalButton icon={RotateCcw} iconColor="text-orange-500">Restart Autopilot</ModalButton>
              <ModalButton icon={RefreshCw} iconColor="text-orange-500">Soft Restart</ModalButton>
              <ModalButton icon={RotateCcw} iconColor="text-orange-500">Reboot</ModalButton>
              <ModalButton icon={Power} iconColor="text-red-500">Power Off</ModalButton>
            </div>
            <div onClick={() => setIsPowerModalOpen(false)} className={`py-4 text-center cursor-pointer text-sm font-medium border-t ${isDarkMode ? 'bg-slate-800/50 border-slate-800 hover:bg-slate-800' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
              Close
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setIsPowerModalOpen(false)}></div>
        </div>
      )}

      {/* MODAL BUG REPORT (Ref: image_448a77.png) */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`rounded-lg shadow-2xl w-[400px] overflow-hidden ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div className={`px-6 py-5 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
              <h2 className="text-xl font-medium">Bug report / Feature request</h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <ModalButton icon={Github}>With GitHub</ModalButton>
              <ModalButton icon={MessageSquare}>With Simple Report</ModalButton>
              <ModalButton icon={Users}>On Blue Robotics Forum</ModalButton>
            </div>
            <div onClick={() => setIsBugModalOpen(false)} className={`py-4 text-center cursor-pointer text-sm font-medium border-t ${isDarkMode ? 'bg-slate-800/50 border-slate-800 hover:bg-slate-800' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
              Close
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setIsBugModalOpen(false)}></div>
        </div>
      )}

      {/* MODAL SETTINGS (Ref: image_1de099.png) */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`rounded-lg shadow-2xl w-[450px] max-w-[95%] overflow-hidden ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
            <div className="bg-[#f44336] text-white px-4 py-3 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-medium text-white">Error: Request failed with status code 502</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                <h3 className="text-lg font-normal mb-4 text-inherit opacity-90">Settings</h3>
                <div className="w-48"><ModalButton icon={RotateCcw}>Reset Settings</ModalButton></div>
              </div>
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                <h3 className="text-lg font-normal mb-4 text-inherit opacity-90">System Log Files ()</h3>
                <div className="flex gap-3">
                  <ModalButton icon={Download}>Download</ModalButton>
                  <ModalButton icon={Trash2} disabled>Remove</ModalButton>
                </div>
              </div>
              <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                <h3 className="text-lg font-normal mb-4 text-inherit opacity-90">MAVLink Log Files ()</h3>
                <div className="flex gap-3">
                  <ModalButton icon={Download}>Download</ModalButton>
                  <ModalButton icon={Trash2} disabled>Remove</ModalButton>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-normal mb-4 text-inherit opacity-90">Run Vehicle Configuration Wizard</h3>
                <div className="w-40"><ModalButton icon={Rocket}>Enable</ModalButton></div>
              </div>
            </div>
            <div onClick={() => setIsSettingsModalOpen(false)} className={`py-4 text-center cursor-pointer text-sm font-medium border-t ${isDarkMode ? 'bg-slate-800/50 border-slate-800 hover:bg-slate-800' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
              Close
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setIsSettingsModalOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export default Sidebar;