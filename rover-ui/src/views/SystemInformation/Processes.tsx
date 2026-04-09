import React, { useState } from 'react';

const mockProcesses = [
  { pid: 310, name: 'ardupilot_navig', cpu: 67.0, parent: 308, status: 'Sleep', dir: '/root/.config/ardupilot-manager/firmware', cmd: '/root/.config/ardupilot-manager/firmware/ardupilot_navigator -A udp:127.0.0.1:8852' },
  { pid: 64, name: 'python3', cpu: 7.6, parent: 54, status: 'Sleep', dir: '/root', cmd: 'python3 /home/pi/services/wifi/main.py' },
  { pid: 149, name: 'mavlink2rest', cpu: 4.0, parent: 138, status: 'Sleep', dir: '/root', cmd: 'mavlink2rest --connect=udpin:127.0.0.1:14000' },
  { pid: 309, name: 'mavlink-routerd', cpu: 3.2, parent: 76, status: 'Run', dir: '/root', cmd: '/usr/bin/mavlink-routerd 127.0.0.1:8852' },
];

const columns = ['PID', 'Name', 'CPU (%)', 'Parent PID', 'Status', 'Running time', 'Memory (kB)', 'Virt. Memory (kB)', 'Working directory', 'Root directory', 'Command', 'Environment', 'Executable path'];

export const Processes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full space-y-6">
      
      {/* 1. Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">🔍</span>
        <input
          type="text"
          placeholder="Search processes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111827] border border-slate-700 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* 2. Organized Checkboxes (The Grid Layout) */}
      <div className="bg-[#111827] p-5 rounded-lg border border-slate-800">
        <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Column Visibility</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {columns.map(col => (
            <label key={col} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                defaultChecked={['PID', 'Name', 'CPU (%)', 'Parent PID', 'Status'].includes(col)}
                className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-[11px] text-slate-400 group-hover:text-slate-200 transition-colors">
                {col}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="overflow-x-auto bg-[#111827] border border-slate-800 rounded-lg flex-1">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-semibold">PID</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold text-blue-400">CPU (%)</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Command</th>
            </tr>
          </thead>
          <tbody className="text-[11px] font-mono text-slate-300">
            {mockProcesses.map((proc) => (
              <tr key={proc.pid} className="border-b border-slate-800/50 hover:bg-white/[0.02]">
                <td className="p-4">{proc.pid}</td>
                <td className="p-4 font-semibold">{proc.name}</td>
                <td className="p-4 text-green-400">{proc.cpu.toFixed(1)}%</td>
                <td className="p-4">{proc.status}</td>
                <td className="p-4 text-slate-500 truncate max-w-[200px]">{proc.cmd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};