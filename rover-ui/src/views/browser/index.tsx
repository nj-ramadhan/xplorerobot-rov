import React from 'react';
import { Database, Search, Play, Download, Trash2, Info } from 'lucide-react';

const LogBrowser = () => {
  const logs = [
    { name: '00000001.BIN', size: '225.9 kB', type: '.BIN', modified: '2026-03-05 10:20:47' },
    { name: 'mission_telemetry.tlog', size: '12.4 MB', type: '.tlog', modified: '2026-03-05 11:45:18' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-5 mb-8">
        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
          <Database size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Log Browser</h1>
          <p className="text-slate-500 font-mono text-sm mt-1 tracking-widest uppercase">
            Manage and download Telemetry (.tlog) and Binary (.bin) logs
          </p>
        </div>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-slate-300 mb-6">
        <div className="flex gap-2">
          <Info size={18} className="text-blue-400 shrink-0" />
          <ul className="list-disc ml-4 space-y-1">
            <li>Download telemetry logs for analysis in UAV LogViewer.</li>
            <li>Use the green play button to visualize data in real-time.</li>
          </ul>
        </div>
      </div>

      <div className="bg-[#111827]/80 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input type="text" placeholder="Search logs..." className="bg-[#0b111a] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 w-80 focus:border-blue-500 outline-none" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500 border-b border-white/5 uppercase text-[10px] font-bold tracking-widest bg-white/5">
            <tr>
              <th className="p-4">Name</th><th className="p-4">Size</th><th className="p-4">Type</th><th className="p-4">Modified ↓</th><th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-blue-500/5 transition-colors">
                <td className="p-4 font-mono text-slate-200">{log.name}</td>
                <td className="p-4 text-slate-400 font-mono">{log.size}</td>
                <td className="p-4 text-slate-400 font-mono">{log.type}</td>
                <td className="p-4 text-slate-400">{log.modified}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><Play size={18} fill="currentColor" /></button>
                  <button className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Download size={18} /></button>
                  <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogBrowser;