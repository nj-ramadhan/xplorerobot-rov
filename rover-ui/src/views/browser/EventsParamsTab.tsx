import React from 'react';
import { Settings } from 'lucide-react';

// 1. Interface untuk menerima properti tema
interface EventsParamsTabProps {
  isDarkMode?: boolean;
}

const dummyParams = [
  { time: '10:20:47.123', type: 'MODE', name: 'STABILIZE', value: '-' },
  { time: '10:21:05.400', type: 'PARAM', name: 'ATC_RAT_RLL_P', value: '0.135 -> 0.150' },
  { time: '10:21:20.100', type: 'PARAM', name: 'MOT_PWM_MIN', value: '1100 -> 1150' },
  { time: '10:22:15.000', type: 'WARNING', name: 'EKF3', value: 'lane switch 1' },
];

const EventsParamsTab: React.FC<EventsParamsTabProps> = ({ isDarkMode = true }) => {
  
  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const containerBg = isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white border-slate-200 shadow-sm';
  const headerBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const titleColor = isDarkMode ? 'text-slate-200' : 'text-slate-700';
  const textColor = isDarkMode ? 'text-slate-300' : 'text-slate-800';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const rowHover = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50';
  const tableDivide = isDarkMode ? 'divide-white/5' : 'divide-slate-100';

  return (
    <div className={`flex-1 flex flex-col rounded-xl overflow-hidden border transition-colors duration-300 ${containerBg} animate-in fade-in duration-500`}>
      
      {/* Header Panel */}
      <div className={`p-5 border-b flex items-center gap-3 font-bold transition-colors duration-300 ${headerBg} ${titleColor}`}>
        <Settings size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} /> Events & Parameter Changes
      </div>
      
      {/* Table Content */}
      <div className="overflow-auto flex-1 p-0 custom-scrollbar">
        <table className="w-full text-left text-sm">
          
          <thead className={`sticky top-0 border-b text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${headerBg} ${mutedText}`}>
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Name / Event</th>
              <th className="px-6 py-4">Value (Old -{">"} New)</th>
            </tr>
          </thead>
          
          <tbody className={`divide-y transition-colors duration-300 ${tableDivide}`}>
            {dummyParams.map((param, idx) => (
              <tr key={idx} className={`transition-colors duration-200 ${rowHover}`}>
                <td className={`px-6 py-4 font-mono font-medium transition-colors duration-300 ${mutedText}`}>
                  {param.time}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 border ${
                    param.type === 'PARAM' 
                      ? (isDarkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200')
                      : param.type === 'WARNING'
                      ? (isDarkMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-100 text-orange-700 border-orange-200')
                      : (isDarkMode ? 'bg-slate-500/20 text-slate-300 border-slate-500/30' : 'bg-slate-100 text-slate-700 border-slate-200')
                  }`}>
                    {param.type}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold transition-colors duration-300 ${textColor}`}>
                  {param.name}
                </td>
                <td className={`px-6 py-4 font-mono font-medium transition-colors duration-300 ${mutedText}`}>
                  {param.value}
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
};

export default EventsParamsTab;