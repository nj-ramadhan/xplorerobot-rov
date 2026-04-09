import React from 'react';

// Data simulasi log kernel
const kernelLogs = [
  "[0] (0.000000): Booting Linux on physical CPU 0x0",
  "[1] (0.000000): Linux version 5.15.76-v7l+ (dom@buildbot) (arm-linux-gnueabihf-gcc-8)",
  "[2] (0.000000): CPU: ARMv7 Processor [410fd083] revision 3 (ARMv7), cr=30c5383d",
  "[3] (0.000000): CPU: div instructions available: patching division code",
  "[4] (0.000000): CPU: PIPT / VIPT nonaliasing data cache, PIPT instruction cache",
  "[5] (0.000000): OF: fdt: Machine model: Raspberry Pi 4 Model B Rev 1.4",
  "[6] (0.000000): random: crng init done",
  "[7] (0.000000): Memory policy: Data cache writealloc",
  "[8] (0.000000): Reserved memory: created CMA memory pool at 0x00000001ac00000, size 320 MiB",
  "[9] (0.000000): OF: reserved mem: initialized node linux,cma, compatible id shared-dma-pool",
  "[10] (0.000000): Zone ranges:",
  "[24] (0.000000): Kernel command line: coherent_pool=1M 8250.nr_uarts=1 snd_bcm2835.enable_compat_alsa=0",
  "[25] (0.000000): cgroup: Enabling cpuset control group subsystem",
  "[26] (0.000000): cgroup: Enabling memory control group subsystem",
  "[27] (0.000000): Unknown kernel command line parameters \"cgroup_memory=1\", will be passed to user space.",
  "[28] (0.000000): Dentry cache hash table entries: 131072 (order: 7, 524288 bytes, linear)",
  "[32] (0.000000): Memory: 7758764K/8245248K available (10240K kernel code, 1386K rwdata, 3308K rodata, 2048K init, 591K bss)",
];

export const Kernel = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Container untuk Log */}
      <div className="bg-[#111827] border border-slate-800 rounded-lg p-2 h-[500px] overflow-y-auto">
        <div className="font-mono text-[10px] text-slate-300">
          {kernelLogs.map((log, index) => (
            <div 
              key={index} 
              className={`px-3 py-1.5 border-b border-slate-800/30 transition-colors ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'
              } hover:bg-blue-500/10`}
            >
              <span className="text-blue-400 mr-2">{log.split('):')[0] + '):'}</span>
              <span className="text-slate-400">{log.split('):')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};