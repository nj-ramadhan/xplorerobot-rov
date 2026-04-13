import React from 'react';
import { Compass } from '../components/widgets/Compass';
import { AttitudeIndicator } from '../components/widgets/AttitudeIndicator';
import { TelemetryData } from '../types/telemetry';

interface DashboardProps {
  telemetry: TelemetryData;
  isDarkMode?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ telemetry, isDarkMode = true }) => {
  
  // ==========================================
  // LOGIKA TEMA 
  // ==========================================
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subtitleColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const valueColor = isDarkMode ? 'text-blue-400' : 'text-blue-700';

  // Card Instrumen (Bawah)
  const cardClasses = isDarkMode 
    ? 'bg-[#111827]/70 backdrop-blur-xl border-white/10 shadow-2xl' 
    : 'bg-white border-slate-200 shadow-xl';

  // Layar Video (Atas)
  const videoClasses = isDarkMode
    ? 'bg-black/40 backdrop-blur-xl border-white/10 shadow-inner'
    : 'bg-slate-50 border-slate-200 shadow-inner';

  const textLoading = isDarkMode ? 'text-slate-500' : 'text-slate-400 font-bold';
  const hudCorner = isDarkMode ? 'border-blue-400/40' : 'border-blue-500/40';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-10 mt-2 min-h-screen w-full font-['Inter',sans-serif]">
      
      {/* =========================================
          HEADER / JUDUL DASHBOARD
          ========================================= */}
      <div className="w-full">
        <h2 className={`font-heading text-3xl md:text-4xl font-black uppercase tracking-tight transition-colors duration-300 ${titleColor}`}>
          Live Telemetry
        </h2>
        <p className={`font-mono text-xs tracking-widest uppercase mt-1 font-bold transition-colors duration-300 ${subtitleColor}`}>
          Real-time ROV Monitoring & Sensor Data
        </p>
      </div>

      {/* =========================================
          1. LAYAR VIDEO STREAM (FULL ATAS)
          ========================================= */}
      <div className={`w-full rounded-3xl aspect-video lg:aspect-[21/9] flex items-center justify-center relative overflow-hidden group border transition-all duration-500 ${videoClasses}`}>
        {/* Teks Loading */}
        <p className={`italic font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] z-10 animate-pulse transition-colors duration-300 ${textLoading}`}>
          Waiting for Gazebo Stream...
        </p>
        
        {/* HUD Corners */}
        <div className={`absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 rounded-tl-xl transition-all duration-500 ${hudCorner} group-hover:border-blue-500`}></div>
        <div className={`absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 rounded-br-xl transition-all duration-500 ${hudCorner} group-hover:border-blue-500`}></div>
      </div>

      {/* =========================================
          2. PANEL INSTRUMEN (3 KOLOM DI BAWAH)
          ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
        
        {/* PANEL DEPTH */}
        <div className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden group transition-all duration-500 flex flex-col justify-center ${cardClasses}`}>
          <h3 className={`text-[11px] font-bold uppercase mb-4 tracking-widest relative z-10 transition-colors duration-300 ${labelColor}`}>
            Depth
          </h3>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className={`font-heading text-6xl font-black drop-shadow-sm transition-colors duration-300 ${valueColor}`}>
              {telemetry.depth}
            </span>
            <span className={`text-lg font-bold transition-colors duration-300 ${labelColor}`}>m</span>
          </div>
        </div>

        {/* PANEL HEADING (COMPASS) */}
        <div className={`p-6 rounded-3xl border transition-all duration-500 relative flex flex-col min-h-[220px] ${cardClasses}`}>
          <div className="w-full flex justify-between items-center mb-4 relative z-10">
            <h3 className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${labelColor}`}>
              Heading
            </h3>
            <span className={`font-heading text-2xl font-black drop-shadow-sm transition-colors duration-300 ${valueColor}`}>
              {telemetry.heading}°
            </span>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative z-0">
            <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] flex items-center justify-center transition-transform hover:scale-105 duration-500">
              <Compass heading={telemetry.heading} />
            </div>
          </div>
        </div>

        {/* PANEL PITCH & ROLL */}
        <div className={`p-6 rounded-3xl border transition-all duration-500 relative flex flex-col min-h-[220px] ${cardClasses}`}>
          <div className="w-full flex justify-between items-center mb-4 relative z-10">
            <h3 className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${labelColor}`}>
              Attitude
            </h3>
            <div className="flex gap-3">
              <span className={`font-heading text-lg font-black drop-shadow-sm transition-colors duration-300 ${valueColor}`}>
                P: {telemetry.pitch}°
              </span>
              <span className={`font-heading text-lg font-black drop-shadow-sm transition-colors duration-300 ${valueColor}`}>
                R: {telemetry.roll}°
              </span>
            </div>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative z-0">
            <div className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] flex items-center justify-center transition-transform hover:scale-105 duration-500 overflow-hidden rounded-full border border-slate-700/30">
              <AttitudeIndicator pitch={telemetry.pitch} roll={telemetry.roll} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};