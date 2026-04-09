import React from 'react';

// Komponen Card yang reusable agar kodenya rapi
const MetricCard = ({ title, value, children }: { title: string, value: string, children: React.ReactNode }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 hover:border-blue-500/50 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-blue-400 font-bold text-[10px] uppercase tracking-wider">{title}</h3>
      <span className="text-xl font-mono font-bold text-white">{value}</span>
    </div>
    <div className="text-[11px] text-slate-400 font-mono space-y-1">
      {children}
    </div>
  </div>
);

export const Monitor = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
      
      {/* CPU Card */}
      <MetricCard title="CPU Usage" value="8.5%">
        <p>ARMv7 Processor rev 3 (v7l)</p>
        <p className="text-slate-500">cpu0: 11% | cpu1: 7%</p>
        <p className="text-slate-500">cpu2: 6% | cpu3: 10%</p>
      </MetricCard>

      {/* Memory Card */}
      <MetricCard title="Memory" value="6.8%">
        <p>RAM: 549.3 MB / 7.9 GB</p>
        <p>SWAP: 0.0 kB / 102.4 MB</p>
      </MetricCard>

      {/* Disk Card */}
      <MetricCard title="Disk Space" value="19.7%">
        <p>/dev/root 5.7GB / 29GB</p>
        <p className="text-slate-500 text-[9px]">Mounted: / (ext4)</p>
      </MetricCard>

      {/* Temp Card */}
      <MetricCard title="Temperature" value="54.0°C">
        <p>CPU Core Temp</p>
        <p className="text-slate-500">Status: Stable</p>
      </MetricCard>

    </div>
  );
};