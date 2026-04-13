import React from 'react';
import { List } from 'lucide-react';

// Data dummy dipindah ke dalam komponen yang memang menggunakannya
const dummyEvents = [
  { time: '10:20:47.123', type: 'MODE', message: 'STABILIZE' },
  { time: '10:20:48.500', type: 'ARMED', message: 'System Armed' },
  { time: '10:22:15.000', type: 'WARNING', message: 'EKF3 lane switch 1' },
  { time: '10:35:10.222', type: 'DISARMED', message: 'System Disarmed' },
];

const EventsTab = () => {
  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-gray-700 font-semibold">
        <List size={18} /> System Events Log
      </div>
      <div className="overflow-auto flex-1 p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 sticky top-0 border-b border-gray-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Timestamp</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyEvents.map((evt, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-mono text-gray-500">{evt.time}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    evt.type === 'WARNING' ? 'bg-orange-100 text-orange-700' : 
                    evt.type === 'ARMED' ? 'bg-green-100 text-green-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {evt.type}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-700">{evt.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTab;