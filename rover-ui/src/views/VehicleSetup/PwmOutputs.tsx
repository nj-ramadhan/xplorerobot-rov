import React, { useState, useEffect } from 'react';

interface PwmOutputsProps {
  isDarkMode?: boolean;
}

export default function PwmOutputs({ isDarkMode = true }: PwmOutputsProps) {
  // State menyimpan data 8 channel PWM (Default 1500 = Netral)
  const [motorValues, setMotorValues] = useState<number[]>(Array(8).fill(1500));
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    // 🔥 DINAMIS: Menggunakan hostname saat ini
    const wsUrl = `ws://${window.location.hostname}:8001/ws/telemetry`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Menangkap data output PWM asli dari MAVLink SERVO_OUTPUT_RAW
        if (data.type === 'SERVO_OUTPUT') {
          setMotorValues([
            data.ch1, data.ch2, data.ch3, data.ch4, 
            data.ch5, data.ch6, data.ch7, data.ch8
          ]);
        }
        
        if (data.type === 'HEARTBEAT') {
          setIsArmed(data.armed);
        }
      } catch (err) {
        console.error("Gagal memproses data PWM:", err);
      }
    };

    return () => socket.close();
  }, []);

  // Konfigurasi Tema
  const cardBg = isDarkMode ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-lg' : 'bg-white border-slate-200 shadow-md';
  const viewportBg = isDarkMode ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200 shadow-inner';
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const valueColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="p-2 w-full animate-in fade-in duration-500 font-['Inter',sans-serif]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Visualizer */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
          <div className={`border rounded-3xl p-6 min-h-[350px] flex items-center justify-center transition-colors duration-300 ${viewportBg}`}>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Thruster Visualization Viewport</span>
          </div>

          <div className={`border rounded-3xl p-8 transition-colors duration-300 ${cardBg}`}>
            <div className="flex justify-between items-center mb-10 border-b pb-6 border-slate-500/10">
              <h3 className={`font-heading text-xl font-black uppercase flex items-center gap-3 ${titleColor}`}>
                <span className={`w-3 h-3 rounded-full ${isArmed ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : 'bg-slate-500'}`}></span>
                Real-Time Thruster Load
              </h3>
              <span className={`text-[10px] font-mono font-bold px-4 py-1.5 rounded-full border transition-all ${isArmed ? 'text-red-500 border-red-500/30' : 'text-slate-500 border-slate-700'}`}>
                {isArmed ? 'MOTORS ARMED' : 'MOTORS DISARMED'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {motorValues.slice(0, 6).map((val, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className={labelColor}>Thruster {i + 1}</span>
                    <span className={isArmed ? 'text-blue-500' : 'text-slate-500'}>{val} PWM</span>
                  </div>
                  <div className={`w-full h-3 rounded-full overflow-hidden flex transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    {/* Progress Bar: Menghitung persentase dari jangkauan 1100-1900 */}
                    <div 
                      style={{ width: `${((val - 1100) / 800) * 100}%` }}
                      className={`h-full transition-all duration-150 ${isArmed ? 'bg-blue-600 shadow-[0_0_10px_#2563eb]' : 'bg-slate-600'}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: All Channels Raw */}
        <div className="col-span-1 lg:col-span-4">
          <div className={`border rounded-3xl p-6 transition-colors duration-300 ${cardBg}`}>
            <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${labelColor}`}>All Output Channels</h3>
            <div className="space-y-1 h-[550px] overflow-y-auto pr-2 custom-scrollbar">
              {motorValues.map((val, i) => (
                <div key={i} className={`flex justify-between items-center py-3 border-b last:border-0 transition-colors ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                  <span className={`text-[11px] font-bold ${labelColor}`}>Channel {i + 1}</span>
                  <span className={`text-xs font-mono font-bold ${isArmed ? 'text-blue-500' : valueColor}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}