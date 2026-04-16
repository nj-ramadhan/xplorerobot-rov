import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Pastikan path ini sudah benar sesuai struktur folder kamu
// @ts-ignore
import namdofImg from '../../assets/namdof.jpg'; 
// @ts-ignore
import thrustersImg from '../../assets/Thrusters.png'; 
// @ts-ignore
import kinematicImg from '../../assets/kinematic.png'; 

const Data: React.FC = () => {
  const navigate = useNavigate();
  // State untuk mengontrol halaman (1 = 6-DOF, 2 = Kinematics)
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  
  // Ref untuk slider/carousel
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menggeser slider menggunakan tombol (dinamis menyesuaikan lebar card)
  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth; // Geser sejauh 1 gambar penuh
      sliderRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

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
        
        /* Menyembunyikan scrollbar bawaan untuk slider horizontal */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Custom Scrollbar untuk text area sebelah kiri (Soft Rose/Pink aesthetic) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 113, 133, 0.4); /* Rose-400 transparan */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 113, 133, 0.8);
        }
      `}</style>

      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-10%] w-[800px] h-[600px] bg-[#3b41c5] opacity-20 blur-[150px] rounded-full"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-white/5 bg-[#0b111a]/80 backdrop-blur-xl px-8 xl:px-16 py-4 flex-shrink-0">
        <div className="w-full mx-auto flex justify-between items-center">
          
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight max-w-4xl leading-tight font-heading">
              6-DOF Maneuverability
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed font-light">
              Dalam dinamika kendaraan bawah air, Six Degrees of Freedom (6-DOF) merepresentasikan enam cara independen di mana ROV dapat bergerak di ruang tiga dimensi.
            </p>

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
          <div className="animate-fade w-full max-w-7xl flex flex-col mt-4">
            
            {/* HEADER UTAMA */}
            <div className="text-center mb-10 w-full">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">Thruster Kinematics</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Matriks alokasi thruster digunakan untuk menerjemahkan perintah gaya 6-DOF menjadi sinyal kecepatan rotasi (PWM) spesifik untuk setiap motor propulsi.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full items-start">
              
              {/* BAGIAN KIRI: CONTINUOUS TEXT (SCROLLABLE) - Ketinggian diperpendek (max-h-[600px]) */}
              <div className="lg:col-span-7 h-auto max-h-[600px] overflow-y-auto custom-scrollbar pr-6 relative">
                
                <div className="text-slate-300 font-light leading-relaxed space-y-8">
                  
                  {/* Bagian 1: Konsep Dasar */}
                  <section>
                    <h3 className="text-xl font-bold text-rose-400 mb-3 font-heading">1. Vektor Gaya (Tau / τ)</h3>
                    <p className="mb-4">
                      Sistem navigasi mengirimkan instruksi gerakan yang diinginkan oleh ROV. Gaya dan momen yang bekerja pada <em>Center of Gravity</em> (CoG) didefinisikan dalam bentuk vektor τ dengan ukuran 6 × 1 (karena ada 6 derajat kebebasan):
                    </p>
                    <div className="bg-[#0b0e1a] border border-white/5 p-4 rounded-xl font-mono text-sm shadow-inner flex items-center justify-center gap-4">
                      <span className="text-rose-400 text-xl font-bold">τ =</span>
                      <div className="flex flex-col items-center border-l-2 border-r-2 border-white/20 px-3 py-2 space-y-1 text-slate-300">
                        <span>X (Surge - Gaya Maju)</span>
                        <span>Y (Sway - Gaya Samping)</span>
                        <span>Z (Heave - Gaya Vertikal)</span>
                        <span>K (Roll - Momen Guling)</span>
                        <span>M (Pitch - Momen Menunduk)</span>
                        <span>N (Yaw - Momen Belok)</span>
                      </div>
                    </div>
                  </section>

                  {/* Bagian 2: Matriks Konfigurasi */}
                  <section>
                    <h3 className="text-xl font-bold text-cyan-400 mb-3 font-heading">2. Matriks Konfigurasi (T) & Gaya Thruster (u)</h3>
                    <p className="mb-3">
                      Masalah utamanya adalah ROV tidak memiliki motor tunggal untuk setiap arah. Gaya dari motor (contohnya 6 thruster) digabungkan menggunakan <strong>Matriks Alokasi (T)</strong>.
                    </p>
                    <p className="mb-4">
                      Vektor u berisi gaya dorong (<em>thrust</em>) masing-masing motor: <span className="font-mono bg-white/10 px-1 rounded text-emerald-400">u = [u1, u2, u3, u4, u5, u6]<sup>T</sup></span>. Hubungan antara gaya motor dan pergerakan ROV dinyatakan dalam persamaan linear:
                    </p>
                    <div className="flex justify-center text-2xl font-mono text-white bg-gradient-to-r from-transparent via-[#1a1f35] to-transparent py-4 my-2">
                      <span className="text-rose-400">τ</span>
                      <span className="mx-4">=</span>
                      <span className="text-cyan-400">T</span>
                      <span className="mx-4">×</span>
                      <span className="text-emerald-400">u</span>
                    </div>
                    <p className="mt-4 text-sm text-slate-400">
                      Nilai dalam matriks T didapatkan dari geometri letak thruster, meliputi sudut kemiringan (misal 45°) terhadap sumbu utama dan jarak lengannya dari CoG.
                    </p>
                  </section>

                  {/* Bagian 3: Inverse Kinematics */}
                  <section>
                    <h3 className="text-xl font-bold text-emerald-400 mb-3 font-heading">3. Menghitung PWM (Inverse Kinematics)</h3>
                    <p className="mb-3">
                      Dalam dunia nyata, <em>Ground Control Station</em> (GCS) atau <em>Flight Controller</em> memberikan nilai τ yang diinginkan, dan kita harus mencari nilai gaya motor (u) yang harus dikeluarkan. 
                    </p>
                    <p className="mb-4">
                      Karena matriks T tidak selalu berbentuk persegi (misal ROV punya 6 atau 8 thruster), kita tidak bisa memakai invers matriks biasa, melainkan menggunakan <strong>Moore-Penrose Pseudoinverse</strong> (T<sup>+</sup>):
                    </p>
                    <div className="bg-[#0b0e1a] border border-white/5 p-5 rounded-xl font-mono shadow-inner space-y-3">
                      <div className="text-center text-lg">
                        <span className="text-emerald-400">u</span> = 
                        <span className="text-cyan-400 mx-2">T<sup className="text-xs">+</sup></span> × 
                        <span className="text-rose-400 ml-2">τ</span>
                      </div>
                      <div className="w-full h-px bg-white/10 my-4"></div>
                      <div className="text-xs text-slate-500">
                        // 1. Dapatkan vektor target dari joystick (τ)<br/>
                        // 2. Kalikan dengan matriks pseudoinverse (T+)<br/>
                        // 3. Mapping hasil gaya (Newton) ke sinyal PWM (µs)<br/>
                      </div>
                      <div className="text-sm text-slate-300">
                        <span className="text-purple-400">const</span> <span className="text-blue-300">pwm_signals</span> = calculatePWM(T_pseudo, tau_target);
                      </div>
                    </div>
                  </section>

                </div>
                {/* Spacer untuk padding bawah scroll */}
                <div className="h-12"></div>
              </div>

              {/* BAGIAN KANAN: SINGLE CARD SLIDER */}
              <div className="lg:col-span-5 flex flex-col sticky top-0">
                
                {/* Single Big Slider Card */}
                <div className="bg-[#0b0e1a]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl relative pt-6 pb-6 flex flex-col hover:border-rose-400/30 transition-all duration-300 overflow-hidden h-[600px]">
                  
                  {/* Header Slider & Tombol Kontrol */}
                  <div className="flex justify-between items-center px-6 mb-4">
                    <span className="text-sm font-heading font-bold text-white tracking-wide">Galeri Visual</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => scrollSlider('left')}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-400/20 hover:text-rose-400 transition-colors text-slate-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                      </button>
                      <button 
                        onClick={() => scrollSlider('right')}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-rose-400/20 hover:text-rose-400 transition-colors text-slate-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                    </div>
                  </div>

                  {/* Container Slider (Snap width 100% per item) */}
                  <div 
                    ref={sliderRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 pb-2 no-scrollbar scroll-smooth h-full"
                  >
                    {/* Item Slider 1: Kinematic / Referensi Utama */}
                    <div className="snap-center shrink-0 w-full h-full bg-[#070913] rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent z-10 pointer-events-none opacity-40"></div>
                      <img src={kinematicImg} alt="Kinematic Main" className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 p-4 relative z-0" />
                      <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/90 shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></span>
                        Referensi Sumbu
                      </div>
                    </div>

                    {/* Item Slider 2: Thrusters View */}
                    <div className="snap-center shrink-0 w-full h-full bg-[#070913] rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent z-10 pointer-events-none opacity-40"></div>
                      <img src={thrustersImg} alt="Top View Thrusters" className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 p-4 relative z-0" />
                      <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/90 shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></span>
                        Top View
                      </div>
                    </div>

                    {/* Item Slider 3: NamDOF */}
                    <div className="snap-center shrink-0 w-full h-full bg-[#070913] rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent z-10 pointer-events-none opacity-40"></div>
                      <img src={namdofImg} alt="DOF Diagram" className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 p-4 relative z-0" />
                      <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-white/90 shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_5px_#fb7185]"></span>
                        Vektor Arah
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Data;