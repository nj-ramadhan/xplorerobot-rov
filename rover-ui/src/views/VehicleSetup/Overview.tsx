import React, { useState, useEffect } from 'react';

interface OverviewProps {
  isDarkMode?: boolean;
}

export default function Overview({ isDarkMode = true }: OverviewProps) {
  
  // ==========================================
  // STATE UNTUK DATA REAL-TIME DARI MAVLINK
  // ==========================================
  const [batteryVolt, setBatteryVolt] = useState<string>('--.- V');
  const [isArmed, setIsArmed] = useState<boolean>(false);
  const [wsStatus, setWsStatus] = useState<string>('Connecting...');

  useEffect(() => {
    // 🔥 DINAMIS: Menggunakan hostname saat ini (localhost atau IP Robot)
    const wsUrl = `ws://${window.location.hostname}:8001/ws/telemetry`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => setWsStatus('Connected');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Menangkap data Baterai dari MAVLink SYS_STATUS
        if (data.type === 'BATTERY') {
          setBatteryVolt(`${data.voltage.toFixed(1)} V`);
        }
        // Menangkap status Armed dari MAVLink HEARTBEAT
        if (data.type === 'HEARTBEAT') {
          setIsArmed(data.armed);
        }
      } catch (err) {
        console.error("Gagal memproses data telemetry:", err);
      }
    };

    socket.onclose = () => setWsStatus('Disconnected');

    return () => socket.close();
  }, []);

  // ==========================================
  // LOGIKA TEMA
  // ==========================================
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-lg' 
    : 'bg-white border-slate-200 shadow-md'; 
    
  const placeholderBg = isDarkMode
    ? 'bg-black/40 border-white/10'
    : 'bg-slate-50 border-slate-200 shadow-inner';

  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const valueColor = isDarkMode ? 'text-slate-200' : 'text-slate-800';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 font-['Inter',sans-serif]">
      
      {/* Kolom Kiri: Viewport Placeholder */}
      <div className={`lg:col-span-2 border rounded-3xl p-6 flex flex-col items-center justify-center min-h-[300px] transition-colors duration-300 relative ${placeholderBg}`}>
        
        {/* Connection Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${wsStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
           <span className={`text-[9px] font-bold tracking-widest uppercase ${mutedColor}`}>{wsStatus}</span>
        </div>

        <span className={`font-mono text-sm tracking-widest uppercase transition-colors duration-300 ${mutedColor}`}>
          [ 3D ROV MODEL VIEWPORT ]
        </span>
      </div>

      {/* Kolom Kanan: System Info & Sensors */}
      <div className="space-y-6">
        <div className={`border rounded-3xl p-6 transition-colors duration-300 ${cardBg}`}>
          <h2 className={`text-[11px] font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${labelColor}`}>
            System Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${labelColor}`}>Flight Controller</span>
              <span className={`font-bold font-mono text-xs transition-colors duration-300 ${valueColor}`}>Pixhawk / SITL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${labelColor}`}>Status</span>
              <span className={`font-bold font-mono text-xs ${isArmed ? 'text-red-500' : 'text-blue-500'}`}>
                {isArmed ? 'ARMED' : 'DISARMED'}
              </span>
            </div>
          </div>
        </div>

        <div className={`border rounded-3xl p-6 transition-colors duration-300 ${cardBg}`}>
          <h2 className={`text-[11px] font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${labelColor}`}>
            Autopilot Sensors
          </h2>
          <div className="space-y-3">
             {['ACC_MPU6000', 'LSM303D', 'MS5611'].map((sensor) => (
                <div key={sensor} className="flex justify-between items-center text-sm">
                    <span className={`font-mono text-xs font-bold transition-colors duration-300 ${valueColor}`}>{sensor}</span>
                    <span className={`flex items-center text-[10px] font-bold tracking-widest uppercase ${wsStatus === 'Connected' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${wsStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                      {wsStatus === 'Connected' ? 'OK' : 'WAIT'}
                    </span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Cards */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className={`border p-6 rounded-3xl transition-colors duration-300 ${cardBg}`}>
          <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${labelColor}`}>BATTERY</p>
          <p className={`text-2xl md:text-3xl font-black ${batteryVolt === '--.- V' ? 'text-slate-500' : titleColor}`}>
            {batteryVolt}
          </p>
          <p className={`text-[10px] mt-4 flex items-center font-bold tracking-widest uppercase ${batteryVolt !== '--.- V' ? 'text-emerald-500' : 'text-slate-500'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${batteryVolt !== '--.- V' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-500'}`}></span> 
            {batteryVolt !== '--.- V' ? 'HEALTHY' : 'NO DATA'}
          </p>
        </div>

        {[
          { label: 'LEAK SENSOR', value: 'Dry', status: 'OK' },
          { label: 'LIGHTS', value: 'Active', status: 'OK' },
          { label: 'VIDEO', value: 'Online', status: 'OK' },
        ].map((item) => (
          <div key={item.label} className={`border p-6 rounded-3xl transition-colors duration-300 ${cardBg}`}>
            <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${labelColor}`}>{item.label}</p>
            <p className={`text-2xl md:text-3xl font-black ${titleColor}`}>{item.value}</p>
            <p className="text-[10px] mt-4 flex items-center font-bold tracking-widest uppercase text-emerald-500">
              <span className="w-2 h-2 rounded-full mr-2 bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span> 
              {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}