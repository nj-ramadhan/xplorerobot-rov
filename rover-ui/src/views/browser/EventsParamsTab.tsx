import React from 'react';
import { Settings } from 'lucide-react';

const dummyParams = [
  { time: '10:20:47.123', type: 'MODE', name: 'STABILIZE', value: '-' },
  { time: '10:21:05.400', type: 'PARAM', name: 'ATC_RAT_RLL_P', value: '0.135 -> 0.150' },
  { time: '10:21:20.100', type: 'PARAM', name: 'MOT_PWM_MIN', value: '1100 -> 1150' },
  { time: '10:22:15.000', type: 'WARNING', name: 'EKF3', value: 'lane switch 1' },
];

const EventsParamsTab = () => {
  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-semibold">
        <Settings size={18} /> Events & Parameter Changes
      </div>
      <div className="overflow-auto flex-1 p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 sticky top-0 border-b border-gray-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Name / Event</th>
              <th className="px-6 py-3">Value (Old -{">"} New)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyParams.map((param, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-mono text-gray-500">{param.time}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${param.type === 'PARAM' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {param.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-800 font-medium">{param.name}</td>
                <td className="px-6 py-3 font-mono text-gray-600">{param.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsParamsTab;