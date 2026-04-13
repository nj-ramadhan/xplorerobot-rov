import React from 'react';
import { List } from 'lucide-react';

// Interface untuk menerima properti tema
interface EventsTabProps {
  isDarkMode?: boolean;
}

const dummyEvents = [
  { time: '10:20:47.123', type: 'MODE', message: 'STABILIZE' },
  { time: '10:20:48.500', type: 'ARMED', message: 'System Armed' },
  { time: '10:22:15.000', type: 'WARNING', message: 'EKF3 lane switch 1' },
  { time: '10:35:10.222', type: 'DISARMED', message: 'System Disarmed' },
];

const EventsTab: React.FC<EventsTabProps> = ({ isDarkMode = true }) => {

  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const containerBg = isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white border-slate-200 shadow-sm';
  const headerBg = isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const titleColor = isDarkMode ? 'text-slate-200' : 'text-slate-700';
  const textColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const rowHover = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50';
  const tableDivide = isDarkMode ? 'divide-white/5' : 'divide-slate-100';

  return (
    <div className={`flex-1 flex flex-col rounded-xl overflow-hidden border transition-colors duration-300 ${containerBg} animate-in fade-in duration-500`}>
      
      {/* Header Panel */}
      <div className={`p-5 border-b flex items-center gap-3 font-bold transition-colors duration-300 ${headerBg} ${titleColor}`}>
        <List size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} /> System Events Log
      </div>
      
      {/* Table Content */}
      <div className="overflow-auto flex-1 p-0 custom-scrollbar">
        <table className="w-full text-left text-sm">
          
          <thead className={`sticky top-0 border-b text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${headerBg} ${mutedText}`}>
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Message</th>
            </tr>
          </thead>
          
          <tbody className={`divide-y transition-colors duration-300 ${tableDivide}`}>
            {dummyEvents.map((evt, idx) => (
              <tr key={idx} className={`transition-colors duration-200 ${rowHover}`}>
                <td className={`px-6 py-4 font-mono font-medium transition-colors duration-300 ${mutedText}`}>
                  {evt.time}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                    evt.type === 'WARNING' 
                      ? (isDarkMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200') : 
                    evt.type === 'ARMED' 
                      ? (isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200') : 
                      (isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200')
                  }`}>
                    {evt.type}
                  </span>
                </td>
                <td className={`px-6 py-4 font-medium transition-colors duration-300 ${textColor}`}>
                  {evt.message}
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
};

export default EventsTab;