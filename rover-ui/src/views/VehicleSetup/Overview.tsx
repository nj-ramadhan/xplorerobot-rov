import React from 'react';

// Tambahkan interface agar komponen ini bisa menerima saklar 'isDarkMode' dari index.tsx
interface OverviewProps {
  isDarkMode?: boolean;
}

export default function Overview({ isDarkMode = true }: OverviewProps) {
  
  // ==========================================
  // LOGIKA TEMA BUNGLON (Otomatis Putih di Light Mode)
  // ==========================================
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-lg' 
    : 'bg-white border-slate-200 shadow-md'; // Putih Solid
    
  const placeholderBg = isDarkMode
    ? 'bg-black/40 border-white/10'
    : 'bg-slate-50 border-slate-200 shadow-inner';

  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const valueColor = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      
      {/* Kolom Kiri: 3D Model Placeholder */}
      <div className={`lg:col-span-2 border rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px] transition-colors duration-300 ${placeholderBg}`}>
        <span className={`font-mono text-sm tracking-widest uppercase transition-colors duration-300 ${mutedColor}`}>
          [ 3D Model / Image Placeholder ]
        </span>
      </div>

      {/* Kolom Kanan: System Info & Sensors */}
      <div className="space-y-6">
        {/* System Info */}
        <div className={`border rounded-3xl p-6 transition-colors duration-300 ${cardBg}`}>
          <h2 className={`text-[11px] font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${labelColor}`}>
            System Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${labelColor}`}>Flight Controller</span>
              <span className={`font-bold font-mono text-xs transition-colors duration-300 ${valueColor}`}>Pixhawk1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${labelColor}`}>Firmware</span>
              <span className={`font-bold font-mono text-xs transition-colors duration-300 ${valueColor}`}>ArduSub 4.5.0</span>
            </div>
          </div>
        </div>

        {/* Sensors */}
        <div className={`border rounded-3xl p-6 transition-colors duration-300 ${cardBg}`}>
          <h2 className={`text-[11px] font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${labelColor}`}>
            Autopilot Sensors
          </h2>
          <div className="space-y-3">
             {['ACC_MPU6000', 'LSM303D', 'MS5611'].map((sensor) => (
                <div key={sensor} className="flex justify-between items-center text-sm">
                    <span className={`font-mono text-xs font-bold transition-colors duration-300 ${valueColor}`}>{sensor}</span>
                    <span className="flex items-center text-emerald-500 text-[10px] font-bold tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                      OK
                    </span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Status Cards */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'BATTERY', value: '15.8 V', status: 'OK' },
          { label: 'LEAK SENSOR', value: 'Dry', status: 'OK' },
          { label: 'LIGHTS', value: 'On', status: 'WARN' },
          { label: 'VIDEO', value: 'Active', status: 'OK' },
        ].map((item) => (
          <div key={item.label} className={`border p-6 rounded-3xl transition-colors duration-300 group ${cardBg}`}>
            <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 transition-colors duration-300 ${labelColor}`}>
              {item.label}
            </p>
            <p className={`text-2xl md:text-3xl font-black font-heading transition-colors duration-300 ${titleColor}`}>
              {item.value}
            </p>
            <p className={`text-[10px] mt-4 flex items-center font-bold tracking-widest uppercase ${item.status === 'OK' ? 'text-emerald-500' : 'text-amber-500'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${item.status === 'OK' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'}`}></span> 
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}