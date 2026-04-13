import React from 'react';
import { useNavigate } from 'react-router-dom';

const Data: React.FC = () => {
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
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"></div>
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
              <h1 className="font-heading text-xl font-bold text-white tracking-wide">Engineering Data</h1>
              <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Tech Specs & Kinematics</p>
            </div>
          </div>
          
          <button onClick={() => navigate('/home')} className="px-5 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 font-heading text-sm font-bold">
            Launch GCS
          </button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="relative z-10 container mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 6-DOF Explanation Area */}
          <div className="bg-gradient-to-br from-[#0b111a] to-[#080d14] p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 font-heading text-8xl font-black text-cyan-400 pointer-events-none">6</div>
            <h3 className="font-heading text-2xl font-bold text-cyan-400 mb-4">6-DOF Maneuverability</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 font-light">
              Konfigurasi penempatan thruster memungkinkan ROV bergerak secara bebas dalam 6 sumbu pergerakan (Degrees of Freedom) di ruang 3D bawah air.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2">Translational</h4>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>Surge (Maju/Mundur)</li>
                  <li>Sway (Kanan/Kiri)</li>
                  <li>Heave (Naik/Turun)</li>
                </ul>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="text-white font-bold text-sm mb-2">Rotational</h4>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>Roll (Miring Kanan/Kiri)</li>
                  <li>Pitch (Mendongak/Menunduk)</li>
                  <li>Yaw (Belok Kanan/Kiri)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Thruster Kinematics Area */}
          <div className="bg-[#0b111a]/80 p-8 rounded-3xl border border-white/5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <h3 className="font-heading text-2xl font-bold text-white">Thruster Kinematics</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
              Distribusi daya dan matriks pergerakan propulsi berdasarkan konfigurasi ROV.
            </p>
            
            {/* Widget Area */}
            <div className="w-full h-48 border border-dashed border-cyan-500/30 rounded-xl bg-cyan-500/5 flex flex-col items-center justify-center text-cyan-500/60 font-mono text-xs">
              <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              [ Kinematics Data Widget / Formula Placeholder ]
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Data; // <--- WAJIB ADA INI