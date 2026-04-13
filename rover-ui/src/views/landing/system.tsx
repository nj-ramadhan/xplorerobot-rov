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
      <main className="relative z-10 container mx-auto max-w-7xl px-8 py-12">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-black text-white mb-2">Detailed System Features</h2>
          <p className="text-slate-400 text-sm font-light max-w-2xl leading-relaxed">
            Penjelasan mendalam mengenai layanan sistem utama yang menggerakkan Xplore Robot ROV.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#0b111a]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)]">🎯</div>
            <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Autonomous Mode</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Dilengkapi dengan algoritma path-planning canggih. Operator dapat menentukan titik koordinat misi pada peta, dan sistem akan mengkalkulasi rute paling efisien secara otomatis.
            </p>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Waypoint Navigation</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Auto Depth / Heading Hold</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0b111a]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)]">🕹️</div>
            <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">MAVLink Protocol</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Tulang punggung komunikasi sistem. Mengirimkan data telemetri (suhu, tekanan, kedalaman, status baterai) dengan latensi sangat rendah antara ROV dan antarmuka web.
            </p>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Real-time Telemetry</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Heartbeat Monitoring</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0b111a]/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/5 flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(34,211,238,0.1)]">⌨️</div>
            <h3 className="font-heading text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Manual Control</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Kendali penuh di tangan Anda. Dukungan input dari keyboard maupun gamepad eksternal untuk manuver observasi yang membutuhkan tingkat presisi tinggi.
            </p>
            <ul className="space-y-2 text-xs font-mono text-slate-300">
              <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Gamepad Support</li>
              <li className="flex items-center gap-2"><span className="text-cyan-400">▹</span> Adjustable Gain/Speed</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default System; // <--- WAJIB ADA INI