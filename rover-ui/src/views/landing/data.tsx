import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Pastikan path ini sudah benar sesuai struktur folder kamu
// @ts-ignore
import namdofImg from '../../assets/namdof.jpg'; 

const Data: React.FC = () => {
  const navigate = useNavigate();
  // State untuk mengontrol halaman (1 = 6-DOF, 2 = Kinematics)
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  return (
    <div className="relative text-white overflow-x-hidden font-sans antialiased min-h-screen bg-[#070913]">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&family=Quicksand:wght@500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .font-heading { font-family: 'Quicksand', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[800px] h-[600px] bg-[#3b41c5] opacity-20 blur-[150px] rounded-full"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-white/5 bg-[#0b111a]/80 backdrop-blur-xl px-8 xl:px-16 py-4 flex-shrink-0">
        <div className="w-full mx-auto flex justify-between items-center">
          
          {/* Kiri: Title & Back */}
          <div className="flex items-center gap-4 w-1/3">
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

          {/* Tengah: Navigation Switcher (Kembali ditambahkan) */}
          <div className="hidden md:flex justify-center w-1/3">
            <div className="bg-white/5 border border-white/10 rounded-full p-1 flex items-center backdrop-blur-md">
              <button 
                onClick={() => setCurrentPage(1)}
                className={`px-6 py-1.5 rounded-full font-heading text-xs font-bold transition-all duration-300 ${
                  currentPage === 1 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                6-DOF
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`px-6 py-1.5 rounded-full font-heading text-xs font-bold transition-all duration-300 ${
                  currentPage === 2 
                    ? 'bg-rose-400/20 text-rose-400 border border-rose-400/30 shadow-[0_0_10px_rgba(251,113,133,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                Kinematics
              </button>
            </div>
          </div>
          
          {/* Kanan: Launch Button */}
          <div className="flex justify-end w-1/3">
            <button onClick={() => navigate('/home')} className="px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 font-heading text-sm font-bold">
              Launch GCS
            </button>
          </div>

        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 w-full px-6 pt-16 pb-32 flex flex-col items-center">
        
        {/* PAGE 1: 6-DOF */}
        {currentPage === 1 && (
          <div className="animate-fade w-full flex flex-col items-center text-center">
            {/* HEADLINES */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight max-w-4xl leading-tight font-heading">
              6-DOF Maneuverability
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed font-light">
              Dalam dinamika kendaraan bawah air, Six Degrees of Freedom (6-DOF) merepresentasikan enam cara independen di mana ROV dapat bergerak di ruang tiga dimensi.
            </p>

            {/* HERO IMAGE CONTAINER (Tombol-tombol di atasnya sudah dihapus) */}
            <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-[#0b0e1a] aspect-video flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent z-10 pointer-events-none"></div>
              
              <img 
                src={namdofImg} 
                alt="3D Axis 6-DOF Diagram" 
                className="w-3/4 h-3/4 object-contain relative z-0 opacity-80"
              />

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 text-sm text-slate-200 cursor-default">
                <span className="w-5 h-5 rounded-full bg-[#5452F6] flex items-center justify-center">
                   <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                </span>
                Sumbu Koordinat 3D
              </div>
            </div>

            {/* LOWER SECTION (Translational & Rotational Details) */}
            <div className="mt-32 max-w-5xl w-full text-center">
              <div className="flex items-center justify-center gap-4 mb-4 opacity-70">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#5452F6]"></div>
                <span className="text-[#6c6af9] text-xs font-bold tracking-widest uppercase">Pergerakan ROV</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#5452F6]"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">Detail Translasi & Rotasi</h2>
              <p className="text-slate-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
                Penguasaan 6-DOF mutlak diperlukan dalam merancang sistem kendali dan algoritma telemetri agar ROV dapat bermanuver secara presisi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Translational Card */}
                <div className="bg-[#0e111d] border border-white/5 rounded-2xl p-10 hover:border-[#5452F6]/50 transition-colors shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-heading">
                        <span className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> Translational
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-mono mb-1.5 flex justify-between">Surge <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">Maju/Mundur</span></h4>
                            <p className="text-slate-400 text-sm font-light">Pergerakan dorongan utama di sepanjang sumbu longitudinal (X).</p>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div>
                            <h4 className="text-white font-mono mb-1.5 flex justify-between">Sway <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">Kanan/Kiri</span></h4>
                            <p className="text-slate-400 text-sm font-light">Pergerakan menyamping sejajar tanpa memutar heading (Y).</p>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div>
                            <h4 className="text-white font-mono mb-1.5 flex justify-between">Heave <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">Naik/Turun</span></h4>
                            <p className="text-slate-400 text-sm font-light">Pergerakan vertikal untuk mempertahankan kedalaman di kolom air (Z).</p>
                        </div>
                    </div>
                </div>

                {/* Rotational Card */}
                <div className="bg-[#0e111d] border border-white/5 rounded-2xl p-10 hover:border-[#5452F6]/50 transition-colors shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 font-heading">
                        <span className="w-3 h-3 bg-rose-400 rounded-full shadow-[0_0_8px_rgba(251,113,133,0.8)]"></span> Rotational
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-mono mb-1.5 flex justify-between">Roll <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">Miring Kiri/Kanan</span></h4>
                            <p className="text-slate-400 text-sm font-light">Rotasi memutar pada sumbu memanjang (X) yang distabilkan pasif.</p>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div>
                            <h4 className="text-white font-mono mb-1.5 flex justify-between">Pitch <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">Menunduk/Mendongak</span></h4>
                            <p className="text-slate-400 text-sm font-light">Rotasi menaikkan atau menurunkan bagian depan ROV (Y).</p>
                        </div>
                        <div className="w-full h-px bg-white/5"></div>
                        <div>
                            <h4 className="text-white font-mono mb-1.5 flex justify-between">Yaw <span className="text-slate-500 text-xs bg-white/5 px-2 py-0.5 rounded">Belok Kiri/Kanan</span></h4>
                            <p className="text-slate-400 text-sm font-light">Perubahan arah haluan yang dikontrol oleh sistem giroskop (Z).</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: KINEMATICS */}
        {currentPage === 2 && (
          <div className="animate-fade w-full max-w-5xl flex flex-col mt-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">Thruster Kinematics</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Matriks alokasi thruster digunakan untuk menerjemahkan perintah gaya 6-DOF menjadi sinyal kecepatan rotasi (PWM) spesifik untuk setiap motor propulsi.
              </p>
            </div>
            
            {/* WIDGET PLACEHOLDER */}
            <div className="w-full min-h-[400px] border border-dashed border-[#5452F6]/30 rounded-2xl bg-[#0b0e1a]/80 backdrop-blur-md flex flex-col items-center justify-center text-[#5452F6]/60 font-mono text-sm hover:bg-[#0e111d] transition-all duration-500 shadow-2xl">
              <svg className="w-16 h-16 mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              <div className="flex flex-col items-center gap-3">
                <span className="tracking-widest uppercase text-sm opacity-70 font-bold">Awaiting Kinematics Matrix</span>
                <span className="opacity-50">[ Widget Placeholder ]</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Data;