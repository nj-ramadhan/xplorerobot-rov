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

  const bg = isDarkMode ? 'bg-[#1a1c1e]' : 'bg-white';
  const text = isDarkMode ? 'text-gray-400' : 'text-gray-700';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  // Lebar sidebar
  const sidebarWidth = isDetailMode ? 'w-64' : 'w-20';
  
  // Efek sembunyi saat mode detail dan mouse tidak di atas sidebar
  const visibilityClass = (isDetailMode && !isHovered) ? '-translate-x-[85%] opacity-50' : 'translate-x-0 opacity-100';

  return (
    <>
      {/* AREA SENSITIF: Untuk trigger hover saat sidebar tersembunyi */}
      {isDetailMode && (
        <div 
          className="fixed inset-y-0 left-0 w-4 z-50"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed left-0 top-0 h-screen ${sidebarWidth} ${bg} ${text} 
          flex flex-col border-r ${border} z-50 
          transition-all duration-500 ease-in-out transform
          ${visibilityClass}
        `}
      >
        {/* --- HEADER --- */}
        <div 
          className={`p-4 flex items-center gap-3 border-b ${border} bg-[#16181a] ${isDetailMode ? 'cursor-pointer' : ''}`}
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

        {/* --- MENU LIST --- */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
          {!isDetailMode ? (
            <div className="flex flex-col items-center gap-6 py-4">
              <NavLink to="/" className={({isActive}) => `${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-400`}>
                <div className="flex flex-col items-center gap-1">
                  <Home size={20} />
                  <span className="text-[8px] font-bold uppercase">Home</span>
                </div>
              </NavLink>
              <NavLink to="/live" className={({isActive}) => `${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-400`}>
                <div className="flex flex-col items-center gap-1">
                  <LayoutGrid size={20} />
                  <span className="text-[8px] font-bold uppercase">Live</span>
                </div>
              </NavLink>
            </div>
          ) : (
            menuGroups.map((group, idx) => (
              <div key={idx} className="mb-4">
                <p className="px-6 text-[9px] font-black text-gray-500 tracking-[1.5px] mb-3 uppercase">
                  {group.title}
                </p>
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center justify-between px-6 py-2 transition-all group
                        ${isActive 
                          ? 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-600' 
                          : 'hover:bg-gray-800/50 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className={`bg-[#141517] border-t ${border} transition-opacity duration-300 ${!isDetailMode || isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-around py-2 border-b border-gray-800">
            <button className="p-2 hover:text-red-500 transition-colors"><Power size={18} /></button>
            <button className="p-2 hover:text-blue-500 transition-colors"><SettingsIcon size={18} /></button>
            <button className="p-2 hover:text-yellow-500 transition-colors"><Bug size={18} /></button>
          </div>
          {isDetailMode && (
             <div className="p-4">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-gray-500 uppercase">CPU</span>
                  <span className="text-white">29 %</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[29%]"></div>
                </div>
             </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;