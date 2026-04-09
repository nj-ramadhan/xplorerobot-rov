import React from 'react';

const FirmwareSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-lg p-6 hover:border-blue-500/30 transition-all duration-300">
    <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-[13px] border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className="text-slate-300 font-mono">{value}</span>
  </div>
);

export const Firmware = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* Raspberry Firmware Card */}
      <FirmwareSection title="Raspberry Firmware">
        <InfoRow label="From" value="Jan 20 2022 13:59:16" />
        <InfoRow label="Version" value="bd88f66f8952d34e4e0613a85c7a6d3da49e13e2" />
      </FirmwareSection>

      {/* Bootloader Version Card */}
      <FirmwareSection title="Bootloader Version">
        <InfoRow label="From" value="Up to date" />
        <InfoRow label="VL085 Firmware (USB Controller)" value="Up to date" />
      </FirmwareSection>

    </div>
  );
};