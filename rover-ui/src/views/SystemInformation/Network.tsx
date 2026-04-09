import React from 'react';

// Data Mockup untuk Network Interfaces
const interfaces = [
  { id: 'veth995fca9', ip: '172.18.0.1/16', status: 'Enabled', mac: '02:42:AC:11:00:01', rxP: 150, txP: 284, rxB: '22,489', txB: '31,544' },
  { id: 'wlan0', ip: '10.0.0.21/24', status: 'Enabled', mac: 'B8:27:EB:12:34:56', rxP: 89969, txP: 31783, rxB: '132,872,704', txB: '3,012,598' },
  { id: 'lo', ip: '127.0.0.1/8', status: 'Enabled', mac: '00:00:00:00:00:00', rxP: 12, txP: 12, rxB: '768', txB: '768' },
  { id: 'docker0', ip: '172.17.0.1/16', status: 'Enabled', mac: '02:42:BD:1E:58:A5', rxP: 0, txP: 0, rxB: '0', txB: '0' },
];

const NetworkCard = ({ data }: { data: typeof interfaces[0] }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 hover:border-blue-500/30 transition-all duration-300">
    <div className="mb-4 border-b border-slate-800 pb-3">
      <h3 className="text-blue-400 font-bold text-sm tracking-wide">{data.id}</h3>
      <p className="text-white font-mono text-[12px]">{data.ip}</p>
    </div>
    
    <div className="space-y-2 text-[11px] font-mono">
      <div className="flex justify-between"><span className="text-slate-500">Status</span> <span className="text-green-400">{data.status}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">MAC</span> <span className="text-slate-300">{data.mac}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">RX Packets</span> <span className="text-slate-300">{data.rxP}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">TX Packets</span> <span className="text-slate-300">{data.txP}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">Bytes Received</span> <span className="text-slate-300">{data.rxB}</span></div>
      <div className="flex justify-between"><span className="text-slate-500">Bytes Transmitted</span> <span className="text-slate-300">{data.txB}</span></div>
    </div>
  </div>
);

export const Network = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interfaces.map((intf) => (
          <NetworkCard key={intf.id} data={intf} />
        ))}
      </div>
    </div>
  );
};