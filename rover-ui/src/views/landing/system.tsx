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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.2); border-radius: 4px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(34, 211, 238, 0.5); }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER / NAVBAR */}
      <nav className="relative z-20 border-b border-white/5 bg-[#060b19]/80 backdrop-blur-xl px-8 py-4">
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
      <main className="relative z-10 w-full flex flex-col items-center pb-32">
        
        {/* HERO SECTION */}
        <div className="container mx-auto max-w-7xl px-8 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Bagian Kiri: Teks */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-block border border-white/20 bg-white/5 text-slate-300 px-4 py-1.5 rounded-sm text-xs font-mono font-bold tracking-widest relative">
              <div className="absolute -top-1 -left-1 w-2 h-2 border border-cyan-400 bg-[#060b19] rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-cyan-400 bg-[#060b19] rounded-full"></div>
              HELLO THERE!
            </div>

            <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-white leading-tight">
              I'm <span className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-8">System Explorer,</span> <br/>
              ROV Core Architecture.
            </h1>

            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-lg">
              Eksplorasi mendalam mengenai arsitektur kontrol, navigasi otonom, dan sistem telemetri yang menggerakkan kinerja presisi Xplore ROV di bawah air.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button className="px-8 py-3.5 bg-cyan-500 text-[#060b19] rounded-full font-bold text-sm hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-3">
                View Architecture
                <span className="bg-white/30 rounded-full p-1"><svg className="w-4 h-4 text-[#060b19]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></span>
              </button>
              <button className="px-8 py-3.5 border border-white/20 text-white rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                Documentation
              </button>
            </div>
          </div>

          {/* Bagian Kanan: Visual/Grafis */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center h-[400px]">
            {/* Bentuk Abstrak Latar Belakang */}
            <div className="absolute w-[350px] h-[350px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[float_6s_ease-in-out_infinite]"></div>
            
            <div className="relative z-10 w-[300px] h-[300px] bg-[#0b111a] border border-white/10 rounded-full shadow-2xl flex items-center justify-center">
               <div className="text-center">
                 <div className="text-5xl mb-2">🌊</div>
                 <h3 className="font-heading font-bold text-xl text-white">Xplore ROV</h3>
                 <p className="text-cyan-400 font-mono text-xs">System Active</p>
               </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-10 right-10 bg-[#0b111a] border border-white/10 px-4 py-2 rounded-full shadow-xl z-20 flex items-center gap-2 animate-[float_4s_ease-in-out_infinite]">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               <span className="text-xs font-bold text-white font-mono">Telemetri</span>
            </div>
            <div className="absolute bottom-16 left-10 bg-[#0b111a] border border-white/10 px-4 py-2 rounded-full shadow-xl z-20 flex items-center gap-2 animate-[float_5s_ease-in-out_infinite]">
               <span className="text-xl">🕹️</span>
               <span className="text-xs font-bold text-white font-mono">Kontrol</span>
            </div>
          </div>
        </div>


        {/* ZIG-ZAG SERVICES SECTION (Replacing the 3 Cards) */}
        <div className="w-full bg-[#030712] border-t border-white/5 pt-24 pb-16 relative">
          
          <div className="container mx-auto max-w-6xl px-8">
            
            {/* Judul Seksi */}
            <div className="text-center mb-24">
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-4">
                Core <span className="text-cyan-400">Systems</span> We Provide
              </h2>
              <div className="flex justify-center mt-2">
                <svg width="150" height="15" viewBox="0 0 150 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 13C30 3 60 5 80 8C100 11 120 2 148 10" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* ITEM 1: Autonomous Mode (Teks Kiri, Gambar Kanan) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-32">
              
              {/* Teks Kiri */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="font-heading text-3xl font-bold text-white">Autonomous Mode</h3>
                <p className="text-slate-400 leading-relaxed font-light text-base">
                  Dilengkapi dengan algoritma <span className="text-cyan-400">path-planning</span> canggih. Operator dapat menentukan titik koordinat misi pada peta, dan sistem akan mengkalkulasi rute paling efisien secara otomatis.
                </p>
                <div className="bg-[#0b111a] border border-white/5 p-4 rounded-xl shadow-inner">
                  <strong className="text-white block mb-2 text-sm uppercase tracking-wider font-heading">Mekanisme Kerja:</strong>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Sistem menggunakan kontroler PID untuk menjaga kestabilan posisi. Navigasi mengandalkan fusi data sensor (IMU & DVL) untuk estimasi pergerakan presisi di area tanpa sinyal GPS, digabungkan dengan algoritma penghindaran rintangan dinamis.
                  </p>
                </div>
                <button className="mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2">
                  Learn More <span className="bg-white text-cyan-600 rounded-full p-0.5 ml-2"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></span>
                </button>
              </div>

              {/* Visual Kanan */}
              <div className="w-full lg:w-1/2 flex justify-center relative">
                {/* Decorative Sparkle */}
                <svg className="absolute top-0 left-10 w-8 h-8 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                {/* Decorative Squiggle */}
                <svg className="absolute bottom-4 right-10 w-16 h-16 text-blue-500 opacity-50" viewBox="0 0 200 200" fill="none"><path d="M20 100 Q 40 50 60 100 T 100 100 T 140 100 T 180 100" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/></svg>
                
                {/* Organic Blob Frame */}
                <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] bg-gradient-to-br from-[#0b111a] to-[#121b2b] border-4 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex items-center justify-center relative overflow-hidden" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}>
                  <div className="absolute inset-0 bg-cyan-500 opacity-10 mix-blend-overlay"></div>
                  <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-[float_4s_ease-in-out_infinite]">🎯</div>
                </div>
              </div>

            </div>


            {/* ITEM 2: MAVLink Protocol (Visual Kiri, Teks Kanan) */}
            <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-16 mb-32">
              
              {/* Teks Kanan */}
              <div className="w-full lg:w-1/2 space-y-6 text-left">
                <h3 className="font-heading text-3xl font-bold text-white">MAVLink Protocol</h3>
                <p className="text-slate-400 leading-relaxed font-light text-base">
                  Tulang punggung komunikasi sistem. Mengirimkan data telemetri (suhu, tekanan, kedalaman, status baterai) dengan <span className="text-blue-400">latensi sangat rendah</span> antara ROV dan antarmuka web.
                </p>
                <div className="bg-[#0b111a] border border-white/5 p-4 rounded-xl shadow-inner">
                  <strong className="text-white block mb-2 text-sm uppercase tracking-wider font-heading">Mekanisme Kerja:</strong>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Pesan dienkode menjadi paket byte ringan (serialization) dan dikirim melalui UDP/TCP. Backend GCS bertindak sebagai jembatan router, menerjemahkan paket serial menjadi aliran data WebSocket berkecepatan tinggi agar dirender real-time.
                  </p>
                </div>
                <button className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2">
                  Learn More <span className="bg-white text-blue-600 rounded-full p-0.5 ml-2"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></span>
                </button>
              </div>

              {/* Visual Kiri */}
              <div className="w-full lg:w-1/2 flex justify-center relative">
                {/* Decorative Sparkle */}
                <svg className="absolute bottom-10 left-4 w-10 h-10 text-blue-400 animate-pulse delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                
                {/* Organic Blob Frame */}
                <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] bg-gradient-to-bl from-[#0b111a] to-[#121b2b] border-4 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex items-center justify-center relative overflow-hidden" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                  <div className="absolute inset-0 bg-blue-500 opacity-10 mix-blend-overlay"></div>
                  <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-[float_5s_ease-in-out_infinite]">📡</div>
                </div>
              </div>

            </div>


            {/* ITEM 3: Manual Control (Teks Kiri, Gambar Kanan) */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-10">
              
              {/* Teks Kiri */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="font-heading text-3xl font-bold text-white">Manual Control</h3>
                <p className="text-slate-400 leading-relaxed font-light text-base">
                  Kendali penuh di tangan Anda. Dukungan input dari <span className="text-cyan-400">keyboard maupun gamepad eksternal</span> untuk manuver observasi yang membutuhkan tingkat presisi tinggi di ruang sempit.
                </p>
                <div className="bg-[#0b111a] border border-white/5 p-4 rounded-xl shadow-inner">
                  <strong className="text-white block mb-2 text-sm uppercase tracking-wider font-heading">Mekanisme Kerja:</strong>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Input analog dari gamepad dibaca oleh browser melalui Gamepad API. Koordinat input difilter menggunakan sistem deadzone untuk mencegah drift tak disengaja. Algoritma TAM kemudian memetakan sumbu gerak ke sinyal PWM tiap motor.
                  </p>
                </div>
                <button className="mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2">
                  Learn More <span className="bg-white text-cyan-600 rounded-full p-0.5 ml-2"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg></span>
                </button>
              </div>

              {/* Visual Kanan */}
              <div className="w-full lg:w-1/2 flex justify-center relative">
                {/* Decorative Sparkle */}
                <svg className="absolute top-10 right-4 w-6 h-6 text-cyan-400 animate-pulse delay-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                {/* Decorative Squiggle */}
                <svg className="absolute bottom-0 left-10 w-20 h-10 text-blue-500 opacity-40" viewBox="0 0 200 100" fill="none"><path d="M10 50 Q 30 10 50 50 T 90 50 T 130 50 T 170 50" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/></svg>

                {/* Organic Blob Frame */}
                <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] bg-gradient-to-tr from-[#0b111a] to-[#121b2b] border-4 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex items-center justify-center relative overflow-hidden" style={{ borderRadius: '50% 50% 30% 70% / 40% 60% 40% 60%' }}>
                  <div className="absolute inset-0 bg-cyan-500 opacity-10 mix-blend-overlay"></div>
                  <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-[float_4.5s_ease-in-out_infinite]">🕹️</div>
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