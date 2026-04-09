import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import gambar & video
// @ts-ignore
import underImage from '../../assets/rov-under.png'; 
// @ts-ignore
import rovImage from '../../assets/rov-model.png'; 
// @ts-ignore
import bgImage from '../../assets/rov-bcg.jpg'; 
// @ts-ignore
import rovVideo from '../../assets/rov-gif.mp4';
// @ts-ignore
import logoXploreSimple from '../../assets/logo_xplore_robot_simple.png'; 
// @ts-ignore
import logoXploreGif from '../../assets/Logo XploreRobot.gif'; 

// =========================================
// DATA DUMMY UNTUK BERITA ROV
// =========================================
const rovNews = [
  {
    id: 1,
    title: "Eksplorasi Palung Mariana: Penemuan Spesies Baru di Era Modern",
    excerpt: "Misi ROV terbaru berhasil merekam visual spesies laut dalam yang belum pernah teridentifikasi sebelumnya pada kedalaman 8.000 meter.",
    date: "12 Apr 2026",
    category: "Eksplorasi",
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Teknologi Thruster Generasi Baru Tingkatkan Efisiensi Baterai",
    excerpt: "Pengembangan motor propulsi bawah air kini memungkinkan ROV beroperasi 30% lebih lama berkat optimasi aliran hidrodinamis.",
    date: "05 Apr 2026",
    category: "Teknologi",
    image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Integrasi AI dalam Navigasi Autonomous Bawah Air",
    excerpt: "Sistem cerdas kini mampu menghindari rintangan karang secara otomatis menggunakan pemetaan sonar 3D real-time.",
    date: "28 Mar 2026",
    category: "Software",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop"
  }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // OPTIMASI 1: Scroll Event dengan Passive Listener biar gak bikin lag
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // OPTIMASI 2: Custom Smooth Scroll (Langsung eksekusi tanpa delay, hitung offset navbar)
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const navHeight = 80; // Tinggi navbar biar judul gak ketutup
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative text-white overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black min-h-screen">
      
      {/* =========================================
          BACKGROUND GLOBAL (Dioptimalkan dengan transform-gpu)
          ========================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" 
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b111a]/40 via-[#06101f]/70 to-[#02050a]/90 z-0"></div>
      </div>

      <div className="relative z-10">
        
        {/* =========================================
            0. NAVBAR
            ========================================= */}
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-10 py-4 transform-gpu ${
          isScrolled ? 'bg-[#0b111a]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-transparent'
        }`}>
          <div className="container mx-auto max-w-7xl flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={isScrolled ? logoXploreGif : logoXploreSimple} 
                alt="Xplore Robot" 
                className={`w-auto brightness-0 invert transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] transform-gpu ${
                  isScrolled ? 'h-14 md:h-16' : 'h-10 md:h-12 animate-pulse'
                }`}
              />
            </div>
            <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-widest opacity-90 items-center">
              <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 cursor-pointer transition-colors">Home</span>
              {/* TOMBOL ABOUT MENGGUNAKAN CUSTOM SCROLL */}
              <span onClick={() => scrollToSection('about')} className="hover:text-cyan-400 cursor-pointer transition-colors">About System</span>
              
              <button onClick={() => navigate('/home')} className="ml-4 px-4 py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full hover:bg-cyan-400 hover:text-black transition-all">
                Launch GCS
              </button>
            </div>
          </div>
        </nav>

        {/* =========================================
            1. HERO SECTION 
            ========================================= */}
        <div className="relative min-h-screen flex flex-col pt-20">
          <main className="container mx-auto max-w-7xl px-10 flex-1 flex flex-col md:flex-row items-center py-10">
            <div className="flex-1 text-center md:text-left z-20">
              <p className="font-mono text-[10px] mb-4 text-cyan-400 tracking-widest flex items-center justify-center md:justify-start gap-2">
                <span className="w-6 h-[1px] bg-cyan-400 inline-block"></span>
                INDUSTRIAL INFORMATICS - TRIN
              </p>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 uppercase">
                Start Exploring <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-sm">
                  Infinite Depths
                </span>
              </h1>
              <p className="text-slate-300 max-w-sm mb-10 text-sm leading-relaxed font-light mx-auto md:mx-0">
                Initialize your underwater mission, monitor real-time telemetry, and control your vehicle through the abyss.
              </p>
              <button onClick={() => navigate('/home')} className="group relative px-8 py-4 bg-cyan-500 text-[#0b111a] font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-cyan-400 hover:scale-105 transition-transform duration-300 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                Get Started
              </button>
            </div>

            <div className="flex-1 relative mt-16 md:mt-0 flex justify-center items-center">
              <div className="relative group p-4 rounded-xl">
                {/* OPTIMASI: Tambah transform-gpu pada blur berat */}
                <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full group-hover:blur-[100px] transition-all duration-500 transform-gpu"></div>
                <img src={rovImage} alt="ROV Model" className="w-full max-w-2xl animate-float z-10 relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </main>
        </div>

        {/* =========================================
            2. CORE FEATURES (LAYANAN SISTEM)
            ========================================= */}
        <div className="px-10 py-16 mt-10 relative z-20">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 text-3xl drop-shadow-md">👥</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide drop-shadow-sm">
                  Layanan Sistem
                </h2>
              </div>
              <div className="mt-4 md:mt-0 text-sm font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors flex items-center gap-2 drop-shadow-sm">
                Semua Layanan <span className="text-lg">&rarr;</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col group p-6 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors drop-shadow-sm">Autonomous Mode</h3>
                  <div className="text-cyan-400 text-4xl opacity-90 drop-shadow-md">🎯</div>
                </div>
                <p className="text-slate-300/80 text-sm leading-relaxed mb-6 flex-grow">
                  Layanan kendali cerdas yang melayani titik perhentian dan navigasi otomatis (waypoint) terprogram tanpa campur tangan manual operator.
                </p>
                <div className="border-t-2 border-white/10 pt-5 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-[#080d14] flex items-center justify-center hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col group p-6 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors drop-shadow-sm">MAVLink Protocol</h3>
                  <div className="text-cyan-400 text-4xl opacity-90 drop-shadow-md">🕹️</div>
                </div>
                <p className="text-slate-300/80 text-sm leading-relaxed mb-6 flex-grow">
                  Layanan komunikasi dan transmisi data yang melayani pertukaran telemetri real-time antara Ground Station dan flight controller ROV.
                </p>
                <div className="border-t-2 border-white/10 pt-5 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-[#080d14] flex items-center justify-center hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col group p-6 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors drop-shadow-sm">Manual Control</h3>
                  <div className="text-cyan-400 text-4xl opacity-90 drop-shadow-md">⌨️</div>
                </div>
                <p className="text-slate-300/80 text-sm leading-relaxed mb-6 flex-grow">
                  Layanan kendali dasar yang melayani manuver dan stabilisasi kendaraan bawah air secara presisi langsung dari stasiun permukaan.
                </p>
                <div className="border-t-2 border-white/10 pt-5 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-[#080d14] flex items-center justify-center hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            3. ABOUT SECTION 
            ========================================= */}
        <div id="about" className="px-10 py-20 bg-black/20 backdrop-blur-sm border-y border-white/5 relative z-20">
          <div className="container mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center gap-16">
            <div className="flex-1 relative mt-16 md:mt-0 flex justify-center items-center">
              <div className="relative group p-4 rounded-xl">
                <div className="absolute inset-0 bg-cyan-900/10 blur-[100px] rounded-full transform-gpu"></div>
                <img src={underImage} alt="Detailed ROV View" className="w-full max-w-lg relative z-10 drop-shadow-[0_10px_40px_rgba(6,182,212,0.15)] transform-gpu group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            <div className="flex flex-col gap-6 max-w-xl">
              <div className="border-l-2 border-cyan-400 pl-5">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
                  Discover<br />
                  <span className="text-cyan-400">The System</span>
                </h2>
                <p className="text-[10px] md:text-xs font-mono text-cyan-200/60 tracking-widest mt-3 uppercase">
                  // Web-Based Ground Control Station
                </p>
              </div>

              <p className="text-slate-200 leading-relaxed mt-2 text-sm md:text-base drop-shadow-sm">
                <strong className="text-white">Explore Robot</strong> adalah pusat komando Ground Control Station (GCS) canggih berbasis web yang dirancang khusus untuk memonitor dan mengendalikan Remotely Operated Vehicle (ROV) Anda.
              </p>

              <p className="text-slate-300 leading-relaxed text-sm md:text-base drop-shadow-sm">
                Membawa standar sistem sekelas BlueOS ke level berikutnya dengan pembaruan eksklusif dari tim kami. Rasakan kendali tanpa batas melalui integrasi protokol <strong className="text-cyan-400">MAVLink</strong>, fleksibilitas <strong className="text-cyan-400">Manual Controlling</strong> yang presisi, hingga kemampuan eksekusi misi <strong className="text-cyan-400">Autonomous</strong> yang cerdas—semuanya didukung oleh telemetri <em>real-time</em> berlatensi rendah.
              </p>

              <ul className="space-y-3 mt-4 text-xs md:text-sm font-mono text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <span>Architecture: Web-Based React UI</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <span>Protocol: MAVLink Communication</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <span>Capabilities: Manual & Autonomous Modes</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <span>Developer: Polman Bandung - TRIN</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* =========================================
            3.5. VIDEO SECTION
            ========================================= */}
        <div className="px-10 py-20 bg-black/10 backdrop-blur-sm border-y border-white/5 relative z-20">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 flex flex-col gap-6">
              <div className="border-l-2 border-cyan-400 pl-5">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">
                  Precision<br />
                  <span className="text-cyan-400">In Motion</span>
                </h2>
                <p className="text-[10px] md:text-xs font-mono text-cyan-200/60 tracking-widest mt-3 uppercase">
                  // High-Performance Maneuverability
                </p>
              </div>

              <p className="text-slate-200 leading-relaxed mt-2 text-sm md:text-base drop-shadow-sm">
                Desain hidrodinamis yang dioptimalkan memungkinkan ROV bergerak dengan kelincahan maksimal di bawah tekanan air, merespons setiap input kendali dengan instan.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base drop-shadow-sm">
                Ditenagai oleh sistem propulsi mutakhir, kendaraan ini mampu melakukan manuver 6-DOF (Degrees of Freedom) dengan presisi tinggi. Hal ini menjamin kestabilan observasi visual dan akurasi sensor, bahkan saat beroperasi di lingkungan perairan dalam yang ekstrem dan berarus deras.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="px-4 py-2 rounded-lg bg-cyan-900/30 border border-cyan-500/20 backdrop-blur-sm">
                  <span className="block text-cyan-400 font-bold text-lg leading-none">6 DOF</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">Movement</span>
                </div>
                <div className="px-4 py-2 rounded-lg bg-cyan-900/30 border border-cyan-500/20 backdrop-blur-sm">
                  <span className="block text-cyan-400 font-bold text-lg leading-none">High</span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">Stability</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-cyan-500/10 blur-[80px] rounded-full transform-gpu"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-[0_10px_40px_rgba(6,182,212,0.25)]">
                <video 
                  src={rovVideo} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-auto object-cover opacity-90 scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            4. MORE ROV NEWS
            ========================================= */}
        <div className="px-10 py-24 relative overflow-hidden z-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none transform-gpu"></div>

          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest drop-shadow-sm">
                    Latest Updates
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  More ROV <span className="text-cyan-400">News</span>
                </h2>
              </div>
              <div className="mt-4 md:mt-0 text-[11px] font-mono font-bold text-slate-300 hover:text-cyan-400 cursor-pointer transition-colors uppercase tracking-widest border border-white/20 hover:border-cyan-500/50 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm">
                View All Articles &rarr;
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rovNews.map((news) => (
                <div key={news.id} className="bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col z-20 overflow-hidden transform-gpu">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cyan-900/30 group-hover:bg-transparent transition-colors duration-500 z-10 transform-gpu"></div>
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover transform-gpu group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/20 text-cyan-400 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {news.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-[10px] text-cyan-200/60 mb-3 font-mono tracking-widest uppercase">
                      {news.date}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-cyan-400 transition-colors drop-shadow-sm">
                      {news.title}
                    </h3>
                    <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3 mb-6">
                      {news.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-bold text-cyan-100 group-hover:text-cyan-400 transition-colors">
                      Read Article 
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            5. EXTENDED DESCRIPTION & TECH STACK
            ========================================= */}
        <div className="px-10 py-16 bg-black/20 backdrop-blur-sm border-t border-white/5 relative z-20">
          <div className="container mx-auto max-w-4xl">
            <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed mb-6 italic text-center md:text-left drop-shadow-sm">
              "Menggunakan basis frame BlueROV yang sudah teruji, kami mengembangkan sistem kontrol antarmuka yang fleksibel. Integrasi ini memungkinkan eksplorasi laut dalam menjadi lebih efisien, responsif, dan mudah diakses oleh peneliti maupun industri."
            </p>
            
            <div className="mb-12 text-center md:text-left border-l-2 border-cyan-500 pl-4">
              <h4 className="text-cyan-400 font-bold tracking-wide text-sm drop-shadow-sm">Tim Pengembang TRIN</h4>
              <p className="text-slate-400 text-[10px]">Politeknik Manufaktur Bandung</p>
            </div>
          
          </div>
        </div>

        {/* =========================================
            6. CTA BANNER
            ========================================= */}
        <div className="px-10 pt-10 pb-20 relative z-20">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-10 text-center relative overflow-hidden group backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.3)] transform-gpu">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 relative z-10 drop-shadow-md">Ready to Dive?</h2>
              <p className="text-cyan-100/90 text-sm mb-6 relative z-10 max-w-md mx-auto drop-shadow-sm">Access the full Ground Control Station and initialize your vehicle.</p>
              <button onClick={() => navigate('/home')} className="relative z-10 px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-wider text-xs hover:bg-cyan-400 transition-transform duration-300 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105">
                Launch Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            7. FOOTER 
            ========================================= */}
        <footer className="border-t border-white/10 bg-black/60 backdrop-blur-lg pt-12 pb-6 px-10 relative z-20">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3 text-white font-bold tracking-tighter text-lg drop-shadow-sm">
                <img 
                  src={logoXploreSimple} 
                  alt="Xplore Robot logo" 
                  className="h-5 md:h-6 w-auto brightness-0 invert opacity-70" 
                /> 
                EXPLOR ROBOT
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs font-light">
                Developed by Industrial Informatics Engineering (TRIN) students for advanced underwater vehicle control.
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center md:text-right">
              <p className="selection:text-cyan-500">© {new Date().getFullYear()} EXPLORE ROBOT. CREATE WITH FULL OF LOVE 🩵.</p>
              <p className="mt-1 text-cyan-500/50">SYSTEM_STABLE_v1.0.4</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Landing;