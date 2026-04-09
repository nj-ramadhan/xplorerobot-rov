import React from 'react';

// Data informasi sistem
const systemInfo = [
  { label: 'OS Type', value: 'Debian GNU/Linux 12' },
  { label: 'Kernel', value: '5.10.33-v7l+' },
  { label: 'Model', value: 'Raspberry Pi 4 Model B Rev 1.4' },
  { label: 'Hostname', value: 'blueos' },
  { label: 'Time', value: '05:13:55 GMT+1000' },
];

export const About = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      
      {/* Logo/Icon Area */}
      <div className="mb-8 p-4 bg-slate-900 rounded-full border border-slate-800 shadow-xl">
        {/* Kamu bisa ganti SVG ini dengan tag <img src="/logo-debian.png" /> jika ada file gambarnya */}
        <div className="w-16 h-16 flex items-center justify-center bg-blue-500/10 rounded-full text-blue-500 text-3xl font-bold">
          OS
        </div>
      </div>

      {/* Info Card */}
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="space-y-4">
          {systemInfo.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <span className="text-slate-500 text-sm">{item.label}</span>
              <span className="text-slate-200 text-sm font-mono font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-[10px] text-slate-600 uppercase tracking-widest">
        ROV Ground Station © 2026
      </div>
    </div>
  );
};