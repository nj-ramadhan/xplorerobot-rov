import React from 'react';
import { useNavigate } from 'react-router-dom';

const System: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative text-white overflow-x-hidden font-['Nunito',sans-serif] antialiased selection:bg-cyan-500 selection:text-black min-h-screen bg-[#060b19]">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&family=Quicksand:wght@500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Quicksand', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        /* Custom Scrollbar untuk Card */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER / NAVBAR KECIL */}
      <nav className="relative z-10 border-b border-white/5 bg-[#0b111a]/80 backdrop-blur-xl px-8 py-4">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div>
              <h1 className="font-heading text-xl font-bold text-white tracking-wide">System Exploration</h1>
              <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Core Capabilities</p>
            </div>
          </div>
          
          <button onClick={() => navigate('/home')} className="px-5 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 font-heading text-sm font-bold">
            Launch GCS
          </button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="relative z-10 container mx-auto max-w-7xl px-8 py-16">
        
        {/* HEADER / JUDUL UTAMA */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            System Exploration
          </h2>
          <p className="text-slate-400 text-base md:text-lg font-light max-w-2xl leading-relaxed mb-6">
            Eksplorasi mendalam mengenai arsitektur kontrol, navigasi otonom, dan sistem telemetri yang menggerakkan kinerja presisi Xplore ROV.
          </p>
          <a href="#" className="text-cyan-500 font-semibold text-sm hover:text-cyan-400 transition-colors">
            System Architecture
          </a>
        </div>

        {/* === 3 CARD BAWAH DENGAN SCROLL === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Autonomous Mode */}
          <div className="bg-[#0b111a]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group flex flex-col h-[450px]">
            <div className="shrink-0 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 flex items-center justify-center text-3xl mb-4 shadow-[0_0_15px_rgba(34,211,238,0.1)]">🎯</div>
              <h3 className="font-heading text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Autonomous Mode</h3>
            </div>
            
            {/* Area Konten Scrollable */}
            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar text-sm text-slate-400 leading-relaxed space-y-4">
              <p>
                Dilengkapi dengan algoritma path-planning canggih. Operator dapat menentukan titik koordinat misi pada peta, dan sistem akan mengkalkulasi rute paling efisien secara otomatis.
              </p>
              <div>
                <strong className="text-white block mb-1 text-xs uppercase tracking-wider">Mekanisme Kerja:</strong>
                <p>Sistem menggunakan kontroler PID untuk menjaga kestabilan posisi bawah air. Navigasi mengandalkan fusi data sensor (seperti IMU dan DVL) untuk estimasi pergerakan presisi di area tanpa sinyal GPS, digabungkan dengan algoritma penghindaran rintangan dinamis.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Waypoint Navigation</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Auto Depth / Heading Hold</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Dynamic Obstacle Avoidance</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Sensor Fusion Estimation</li>
              </ul>
            </div>
          </div>

          {/* Card 2: MAVLink Protocol */}
          <div className="bg-[#0b111a]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group flex flex-col h-[450px]">
            <div className="shrink-0 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 flex items-center justify-center text-3xl mb-4 shadow-[0_0_15px_rgba(34,211,238,0.1)]">🕹️</div>
              <h3 className="font-heading text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">MAVLink Protocol</h3>
            </div>
            
            {/* Area Konten Scrollable */}
            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar text-sm text-slate-400 leading-relaxed space-y-4">
              <p>
                Tulang punggung komunikasi sistem. Mengirimkan data telemetri (suhu, tekanan, kedalaman, status baterai) dengan latensi sangat rendah antara ROV dan antarmuka web.
              </p>
              <div>
                <strong className="text-white block mb-1 text-xs uppercase tracking-wider">Mekanisme Kerja:</strong>
                <p>Pesan dienkode menjadi paket byte ringan (serialization) dan dikirim melalui koneksi UDP/TCP. Backend GCS bertindak sebagai jembatan *router*, menerjemahkan paket serial MAVLink menjadi aliran data WebSocket berkecepatan tinggi agar dapat dirender secara *real-time* di *dashboard* React.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Real-time Telemetry</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Heartbeat Monitoring</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> UDP/WebSocket Routing</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Packet Loss Handling</li>
              </ul>
            </div>
          </div>

          {/* Card 3: Manual Control */}
          <div className="bg-[#0b111a]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group flex flex-col h-[450px]">
            <div className="shrink-0 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 flex items-center justify-center text-3xl mb-4 shadow-[0_0_15px_rgba(34,211,238,0.1)]">⌨️</div>
              <h3 className="font-heading text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Manual Control</h3>
            </div>
            
            {/* Area Konten Scrollable */}
            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar text-sm text-slate-400 leading-relaxed space-y-4">
              <p>
                Kendali penuh di tangan Anda. Dukungan input dari keyboard maupun gamepad eksternal untuk manuver observasi yang membutuhkan tingkat presisi tinggi.
              </p>
              <div>
                <strong className="text-white block mb-1 text-xs uppercase tracking-wider">Mekanisme Kerja:</strong>
                <p>Input analog dari gamepad dibaca oleh *browser* melalui Gamepad API. Koordinat input difilter menggunakan sistem *deadzone* untuk mencegah pergerakan tak disengaja (drift). Algoritma *Thruster Allocation Matrix* kemudian memetakan sumbu gerak langsung ke sinyal PWM untuk masing-masing pendorong ROV.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Gamepad Support</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Adjustable Gain/Speed</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Deadzone Filtering</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Thruster Allocation Matrix</li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default System;