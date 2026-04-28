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
        
        @keyframes float-slow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
      `}</style>

      {/* BACKGROUND GLOW (Subtle & Clean) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* HEADER / NAVBAR */}
      <nav className="relative z-20 border-b border-white/5 bg-[#060b19]/80 backdrop-blur-xl px-6 lg:px-12 py-4">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')} 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div>
              <h1 className="font-heading text-lg lg:text-xl font-bold text-white tracking-wide">System Exploration</h1>
              <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Core Capabilities</p>
            </div>
          </div>
          
          <button onClick={() => navigate('/home')} className="px-6 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 rounded-full hover:bg-cyan-400 hover:text-[#060b19] hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 font-heading text-sm font-bold">
            Launch GCS
          </button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="relative z-10 w-full flex flex-col items-center pb-32">
        
        {/* HERO SECTION (Clean & Spacious) */}
        <div className="container mx-auto max-w-7xl px-6 lg:px-12 pt-20 pb-24 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Bagian Kiri: Teks */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-slate-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ROV ARCHITECTURE
            </div>

            <h1 className="font-heading text-5xl lg:text-6xl font-extrabold text-white leading-[1.1]">
              Deep Dive Into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">System Core.</span>
            </h1>

            <p className="text-slate-400 text-base lg:text-lg font-light leading-relaxed max-w-lg">
              Eksplorasi mendalam mengenai arsitektur kontrol, navigasi otonom, dan sistem telemetri yang menggerakkan kinerja presisi Xplore ROV di bawah air.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button className="px-8 py-3.5 bg-white text-[#060b19] rounded-full font-bold text-sm hover:bg-cyan-400 transition-colors duration-300">
                Explore Features
              </button>
            </div>
          </div>

          {/* Bagian Kanan: Visual High-Tech Clean */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="absolute w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10 w-full max-w-md bg-[#0b111a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-float-slow">
              <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold font-heading text-sm">System Status</h3>
                    <p className="text-slate-500 text-xs font-mono">All diagnostics nominal</p>
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Online
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Telemetri Link</span>
                  <span className="text-cyan-400">98%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-cyan-400 rounded-full"></div>
                </div>

                <div className="flex justify-between text-xs font-mono pt-2">
                  <span className="text-slate-400">Motor Allocation</span>
                  <span className="text-blue-400">Active</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ZIG-ZAG SERVICES SECTION (Clean & Minimalist) */}
        <div className="w-full border-t border-white/5 pt-24 pb-16">
          <div className="container mx-auto max-w-6xl px-6 lg:px-12">
            
            {/* Judul Seksi */}
            <div className="mb-24 flex flex-col items-center text-center">
              <span className="text-cyan-400 font-mono text-sm font-bold tracking-widest uppercase mb-3">Capabilities</span>
              <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-white">
                Core Systems
              </h2>
            </div>

            {/* ITEM 1: Autonomous Mode */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32">
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="font-heading text-3xl font-bold text-white">Autonomous Mode</h3>
                <p className="text-slate-400 leading-relaxed font-light text-[15px]">
                  Dilengkapi dengan algoritma <span className="text-cyan-400 font-semibold">path-planning</span> canggih. Operator dapat menentukan titik koordinat misi pada peta, dan sistem akan mengkalkulasi rute paling efisien secara otomatis.
                </p>
                <div className="pt-2">
                  <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Mekanisme Kerja
                  </span>
                  <p className="text-slate-400 text-sm font-light leading-relaxed border-l-2 border-white/10 pl-4 ml-2">
                    Sistem menggunakan kontroler PID untuk menjaga kestabilan posisi. Navigasi mengandalkan fusi data sensor (IMU & DVL) untuk estimasi pergerakan presisi di area tanpa sinyal GPS, digabungkan dengan algoritma penghindaran rintangan dinamis.
                  </p>
                </div>
              </div>

              {/* Graphic 1 */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[320px] aspect-square bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5"></div>
                  {/* Minimalist target/radar circles */}
                  <div className="absolute w-3/4 h-3/4 border border-cyan-500/20 rounded-full"></div>
                  <div className="absolute w-1/2 h-1/2 border border-cyan-500/40 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
                  <svg className="w-16 h-16 text-cyan-400 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
              </div>
            </div>

            {/* ITEM 2: MAVLink Protocol */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-16 mb-32">
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="font-heading text-3xl font-bold text-white">MAVLink Protocol</h3>
                <p className="text-slate-400 leading-relaxed font-light text-[15px]">
                  Tulang punggung komunikasi sistem. Mengirimkan data telemetri (suhu, tekanan, kedalaman, status baterai) dengan <span className="text-blue-400 font-semibold">latensi sangat rendah</span> antara ROV dan antarmuka web.
                </p>
                <div className="pt-2">
                  <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Mekanisme Kerja
                  </span>
                  <p className="text-slate-400 text-sm font-light leading-relaxed border-l-2 border-white/10 pl-4 ml-2">
                    Pesan dienkode menjadi paket byte ringan (serialization) dan dikirim melalui koneksi UDP/TCP. Backend GCS bertindak sebagai jembatan router, menerjemahkan paket serial menjadi aliran data WebSocket berkecepatan tinggi agar dirender real-time.
                  </p>
                </div>
              </div>

              {/* Graphic 2 */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <div className="relative w-full max-w-[320px] aspect-square bg-gradient-to-tr from-white/5 to-transparent border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5"></div>
                  {/* Minimalist signal waves */}
                  <div className="absolute w-full h-full flex items-center justify-center">
                    <div className="w-[80%] h-[80%] border border-blue-500/20 rounded-xl transform rotate-12"></div>
                    <div className="absolute w-[60%] h-[60%] border border-blue-500/30 rounded-xl transform -rotate-6 animate-pulse"></div>
                  </div>
                  <svg className="w-16 h-16 text-blue-400 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                </div>
              </div>
            </div>

            {/* ITEM 3: Manual Control */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="font-heading text-3xl font-bold text-white">Manual Control</h3>
                <p className="text-slate-400 leading-relaxed font-light text-[15px]">
                  Kendali penuh di tangan Anda. Dukungan input dari <span className="text-cyan-400 font-semibold">keyboard maupun gamepad eksternal</span> untuk manuver observasi yang membutuhkan tingkat presisi tinggi di ruang sempit.
                </p>
                <div className="pt-2">
                  <span className="text-white font-bold text-sm tracking-wide flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Mekanisme Kerja
                  </span>
                  <p className="text-slate-400 text-sm font-light leading-relaxed border-l-2 border-white/10 pl-4 ml-2">
                    Input analog dari gamepad dibaca oleh browser melalui Gamepad API. Koordinat input difilter menggunakan sistem deadzone untuk mencegah drift tak disengaja. Algoritma TAM kemudian memetakan sumbu gerak ke sinyal PWM tiap motor.
                  </p>
                </div>
              </div>

              {/* Graphic 3 */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[320px] aspect-square bg-gradient-to-bl from-white/5 to-transparent border border-white/10 rounded-3xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-500/5"></div>
                  {/* Minimalist grid background */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <svg className="w-20 h-20 text-cyan-400 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-float-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default System;