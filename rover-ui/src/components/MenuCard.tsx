import React from 'react';

interface MenuCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, description, icon, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#111827] hover:bg-[#1a2333] p-6 rounded-xl border border-white/5 transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[160px] active:scale-95 z-10"
  >
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-slate-100 text-lg leading-tight w-2/3">{title}</h3>
      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors text-xl">
        {icon}
      </div>
    </div>
    <p className="text-[11px] text-slate-500 mt-4 line-clamp-2 font-light">{description}</p>
  </div>
);