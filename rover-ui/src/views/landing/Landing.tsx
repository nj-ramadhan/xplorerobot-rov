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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const navHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative text-white overflow-x-hidden font-['Inter',sans-serif] antialiased selection:bg-cyan-500 selection:text-black min-h-screen">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Outfit:wght@400;700;900&display=swap');
        
        .font-heading { font-family: 'Outfit', sans-serif; }
        .font-mono { font-family: 'Fira Code', monospace; }
        
        .animate-gradient-x {
          background-size: 200% auto;
          transition: background-position 0.5s ease-out;
        }
        .animate-gradient-x:hover {
          background-position: right center;
        }
      `}</style>

      {/* =========================================
          BACKGROUND GLOBAL
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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-8 py-3 transform-gpu ${
          isScrolled ? 'bg-[#0b111a]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-transparent'
        }`}>
          <div className="container mx-auto max-w-7xl flex justify-between items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src={isScrolled ? logoXploreGif : logoXploreSimple} 
                alt="Xplore Robot" 
                className={`w-auto brightness-0 invert transition-all duration-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transform-gpu group-hover:scale-105 ${
                  isScrolled ? 'h-10 md:h-12' : 'h-8 md:h-10 animate-pulse'
                }`}
              />
            </div>
            <div className="hidden md:flex gap-6 text-[10px] font-mono uppercase tracking-[0.15em] font-semibold opacity-90 items-center">
              <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-cyan-400 cursor-pointer transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
              <span onClick={() => scrollToSection('about')} className="hover:text-cyan-400 cursor-pointer transition-colors relative group">
                About System
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
              
              <button onClick={() => navigate('/home')} className="ml-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all duration-300">
                Launch GCS
              </button>
            </div>
          </div>
        </nav>

        {/* =========================================
            1. HERO SECTION 
            ========================================= */}
        <div className="relative min-h-screen flex flex-col pt-16">
          <main className="container mx-auto max-w-7xl px-8 flex-1 flex flex-col md:flex-row items-center py-8">
            <div className="flex-1 text-center md:text-left z-20">
              <p className="font-mono text-[9px] mb-4 text-cyan-400 tracking-[0.2em] font-bold flex items-center justify-center md:justify-start gap-3">
                <span className="w-6 h-[2px] bg-cyan-400 inline-block shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                INDUSTRIAL INFORMATICS - TRIN
              </p>
              
              <h1 className="font-heading text-4xl md:text-6xl font-black leading-[1.05] mb-5 uppercase tracking-tight transition-transform duration-500 hover:translate-x-1 cursor-default">
                Start Exploring <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-200 drop-shadow-sm animate-gradient-x">
                  Infinite Depths
                </span>
              </h1>
              
              <p className="text-slate-300 max-w-sm mb-8 text-sm leading-relaxed font-light mx-auto md:mx-0 opacity-90 hover:opacity-100 transition-opacity duration-300">
                Initialize your underwater mission, monitor real-time telemetry, and control your vehicle through the abyss.
              </p>
              
              <button onClick={() => navigate('/home')} className="group relative px-6 py-3 bg-cyan-500 text-[#0b111a] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-cyan-400 hover:scale-105 active:scale-95 transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] overflow-hidden">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </div>

            <div className="flex-1 relative mt-12 md:mt-0 flex justify-center items-center">
              <div className="relative group p-4 rounded-xl">
                <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full group-hover:blur-[80px] group-hover:bg-cyan-400/30 transition-all duration-700 transform-gpu"></div>
                <img src={rovImage} alt="ROV Model" className="w-full max-w-xl animate-float z-10 relative drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform-gpu group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
            </div>
          </main>
        </div>

        {/* =========================================
            2. CORE FEATURES (LAYANAN SISTEM)
            ========================================= */}
        <div className="px-8 py-12 mt-4 relative z-20">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3 cursor-default group">
                <span className="text-cyan-400 text-2xl drop-shadow-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">👥</span>
                <h2 className="font-heading text-2xl md:text-3xl font-black text-white tracking-wide drop-shadow-sm group-hover:text-cyan-50 transition-colors">
                  Layanan Sistem
                </h2>
              </div>
              <div className="mt-3 md:mt-0 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors flex items-center gap-2 drop-shadow-sm uppercase tracking-widest group">
                Semua Layanan 
                <span className="text-base transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col group p-6 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-cyan-400 transition-colors drop-shadow-sm">Autonomous Mode</h3>
                  <div className="text-cyan-400 text-3xl opacity-90 drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">🎯</div>
                </div>
                <p className="text-slate-300/80 text-xs leading-relaxed mb-6 flex-grow group-hover:text-slate-200 transition-colors">
                  Layanan kendali cerdas yang melayani titik perhentian dan navigasi otomatis terprogram tanpa campur tangan manual operator.
                </p>
                <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-[#080d14] flex items-center justify-center group-hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:translate-x-1.5">
                    <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="flex flex-col group p-6 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-cyan-400 transition-colors drop-shadow-sm">MAVLink Protocol</h3>
                  <div className="text-cyan-400 text-3xl opacity-90 drop-shadow-md transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">🕹️</div>
                </div>
                <p className="text-slate-300/80 text-xs leading-relaxed mb-6 flex-grow group-hover:text-slate-200 transition-colors">
                  Layanan komunikasi dan transmisi data yang melayani pertukaran telemetri real-time antara Ground Station dan flight controller ROV.
                </p>
                <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-[#080d14] flex items-center justify-center group-hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:translate-x-1.5">
                    <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col group p-6 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-cyan-400 transition-colors drop-shadow-sm">Manual Control</h3>
                  <div className="text-cyan-400 text-3xl opacity-90 drop-shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">⌨️</div>
                </div>
                <p className="text-slate-300/80 text-xs leading-relaxed mb-6 flex-grow group-hover:text-slate-200 transition-colors">
                  Layanan kendali dasar yang melayani manuver dan stabilisasi kendaraan bawah air secara presisi langsung dari stasiun permukaan.
                </p>
                <div className="border-t border-white/10 pt-4 mt-auto flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-[#080d14] flex items-center justify-center group-hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:translate-x-1.5">
                    <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            3. ABOUT SECTION (Transparan, Menyatu dengan Background)
            ========================================= */}
        <div id="about" className="px-8 py-16 relative z-20">
          <div className="container mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 relative mt-12 md:mt-0 flex justify-center items-center">
              <div className="relative group p-4 rounded-xl cursor-pointer">
                <div className="absolute inset-0 bg-cyan-900/20 blur-[80px] rounded-full transform-gpu group-hover:bg-cyan-800/30 transition-colors duration-700"></div>
                <img src={underImage} alt="Detailed ROV View" className="w-full max-w-md relative z-10 drop-shadow-[0_10px_30px_rgba(34,211,238,0.15)] transform-gpu group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-700" />
              </div>
            </div>

            <div className="flex flex-col gap-5 max-w-lg group">
              <div className="border-l-[3px] border-cyan-400 pl-5 group-hover:border-cyan-300 transition-colors duration-300">
                <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.1] drop-shadow-md">
                  Discover<br />
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">The System</span>
                </h2>
                <p className="font-mono text-[9px] md:text-[10px] font-bold text-cyan-400/80 tracking-[0.2em] mt-3 uppercase">
                  // Web-Based Ground Control Station
                </p>
              </div>

              <p className="text-slate-200/90 leading-relaxed mt-2 text-sm drop-shadow-sm">
                <strong className="text-white font-bold tracking-wide">Explore Robot</strong> adalah pusat komando Ground Control Station (GCS) canggih berbasis web yang dirancang khusus untuk memonitor dan mengendalikan Remotely Operated Vehicle (ROV) Anda.
              </p>

              <p className="text-slate-300/90 leading-relaxed text-sm drop-shadow-sm">
                Membawa standar sistem sekelas BlueOS ke level berikutnya dengan pembaruan eksklusif dari tim kami. Rasakan kendali tanpa batas melalui integrasi protokol <strong className="text-cyan-400 font-semibold tracking-wide">MAVLink</strong>, fleksibilitas <strong className="text-cyan-400 font-semibold tracking-wide">Manual Controlling</strong> yang presisi, hingga kemampuan eksekusi misi <strong className="text-cyan-400 font-semibold tracking-wide">Autonomous</strong> yang cerdas.
              </p>

              <ul className="space-y-3 mt-4 text-xs font-mono text-slate-300 font-medium">
                <li className="flex items-center gap-3 hover:text-cyan-100 transition-colors cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                  <span>Architecture: Web-Based React UI</span>
                </li>
                <li className="flex items-center gap-3 hover:text-cyan-100 transition-colors cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                  <span>Protocol: MAVLink Communication</span>
                </li>
                <li className="flex items-center gap-3 hover:text-cyan-100 transition-colors cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                  <span>Capabilities: Manual & Autonomous Modes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* =========================================
            3.5. VIDEO SECTION (Transparan)
            ========================================= */}
        <div className="px-8 py-16 relative z-20">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-5 group">
              <div className="border-l-[3px] border-cyan-400 pl-5 group-hover:border-cyan-300 transition-colors duration-300">
                <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-[1.1] drop-shadow-md">
                  Precision<br />
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">In Motion</span>
                </h2>
                <p className="font-mono text-[9px] md:text-[10px] font-bold text-cyan-400/80 tracking-[0.2em] mt-3 uppercase">
                  // High-Performance Maneuverability
                </p>
              </div>

              <p className="text-slate-200/90 leading-relaxed mt-2 text-sm drop-shadow-sm">
                Desain hidrodinamis yang dioptimalkan memungkinkan ROV bergerak dengan kelincahan maksimal di bawah tekanan air, merespons setiap input kendali dengan instan.
              </p>
              <p className="text-slate-300/90 leading-relaxed text-sm drop-shadow-sm">
                Ditenagai oleh sistem propulsi mutakhir, kendaraan ini mampu melakukan manuver 6-DOF (Degrees of Freedom) dengan presisi tinggi. Hal ini menjamin kestabilan observasi visual dan akurasi sensor.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="px-4 py-2 rounded-xl bg-cyan-900/20 border border-cyan-500/20 backdrop-blur-sm hover:bg-cyan-900/40 transition-all duration-300 cursor-default">
                  <span className="font-heading block text-cyan-400 font-black text-xl leading-none mb-1">6 DOF</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Movement</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-cyan-900/20 border border-cyan-500/20 backdrop-blur-sm hover:bg-cyan-900/40 transition-all duration-300 cursor-default">
                  <span className="font-heading block text-cyan-400 font-black text-xl leading-none mb-1">High</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Stability</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative group">
              <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full transform-gpu group-hover:bg-cyan-400/20 transition-colors duration-700"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] group-hover:shadow-[0_15px_40px_rgba(34,211,238,0.15)] transition-shadow duration-700">
                <video 
                  src={rovVideo} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-auto object-cover opacity-90 scale-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b19] via-transparent to-transparent pointer-events-none opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            4. MORE ROV NEWS
            ========================================= */}
        <div className="px-8 py-16 relative overflow-hidden z-20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none transform-gpu"></div>

          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
              <div className="group cursor-default">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-[0.2em] drop-shadow-sm">
                    Latest Updates
                  </span>
                </div>
                <h2 className="font-heading text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  More ROV <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">News</span>
                </h2>
              </div>
              <div className="mt-5 md:mt-0 text-[10px] font-mono font-bold text-slate-300 hover:text-cyan-400 cursor-pointer transition-all uppercase tracking-widest border border-white/20 hover:border-cyan-400/60 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm hover:shadow-[0_0_10px_rgba(34,211,238,0.2)] group flex items-center gap-2">
                View All Articles <span className="text-xs transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rovNews.map((news) => (
                <div key={news.id} className="bg-[#0b111a]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 group cursor-pointer hover:border-cyan-500/40 hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col z-20 hover:-translate-y-1.5">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b111a] via-transparent to-transparent z-10 opacity-60 group-hover:opacity-20 transition-opacity duration-500"></div>
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover transform-gpu group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-cyan-400 text-[8px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md group-hover:border-cyan-400/40 transition-colors">
                      {news.category}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative">
                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="text-[9px] font-bold text-cyan-400/70 mb-3 font-mono tracking-widest uppercase">
                      {news.date}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-white mb-3 leading-[1.3] group-hover:text-cyan-300 transition-colors drop-shadow-sm">
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6 font-light">
                      {news.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold text-slate-300 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">
                      Read Article 
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            5. EXTENDED DESCRIPTION & TECH STACK (Transparan)
            ========================================= */}
        <div className="px-8 py-14 relative z-20">
          <div className="container mx-auto max-w-4xl">
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8 italic text-center md:text-left drop-shadow-sm">
              "Menggunakan basis frame BlueROV yang sudah teruji, kami mengembangkan sistem kontrol antarmuka yang fleksibel. Integrasi ini memungkinkan eksplorasi laut dalam menjadi lebih efisien, responsif, dan mudah diakses oleh peneliti maupun industri."
            </p>
            
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              <div className="text-center md:text-left border-l-[3px] border-cyan-500 pl-4">
                <h4 className="font-heading text-cyan-400 font-bold tracking-wide text-sm drop-shadow-sm mb-1">Tim Pengembang TRIN</h4>
                <p className="font-mono text-slate-500 text-[9px] uppercase tracking-widest font-bold">Politeknik Manufaktur Bandung</p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end items-center gap-5 md:gap-6 text-slate-400 font-bold text-xs">
                <div className="flex items-center gap-1.5 hover:text-[#61DAFB] transition-colors cursor-default drop-shadow-sm hover:scale-110 duration-300"><span className="text-lg">⚛️</span> React</div>
                <div className="flex items-center gap-1.5 hover:text-[#38B2AC] transition-colors cursor-default drop-shadow-sm hover:scale-110 duration-300"><span className="text-lg">🌊</span> Tailwind</div>
                <div className="flex items-center gap-1.5 hover:text-[#FFD859] transition-colors cursor-default drop-shadow-sm hover:scale-110 duration-300"><span className="text-lg">⚡</span> Vite</div>
                <div className="flex items-center gap-1.5 hover:text-[#68A063] transition-colors cursor-default drop-shadow-sm hover:scale-110 duration-300"><span className="text-lg">🟢</span> Node.js</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div className="px-8 pt-12 pb-20 relative z-20">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-gradient-to-br from-[#0b111a] to-[#06101f] border border-cyan-500/30 rounded-3xl p-10 text-center relative overflow-hidden group backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.4)] transform-gpu hover:border-cyan-400/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-500/10 to-cyan-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
              
              <h2 className="font-heading text-3xl md:text-4xl font-black text-white mb-3 relative z-10 drop-shadow-md">Ready to Dive?</h2>
              <p className="text-cyan-100/80 text-sm mb-6 relative z-10 max-w-md mx-auto drop-shadow-sm font-light">Access the full Ground Control Station and initialize your vehicle telemetry.</p>
              
              <button onClick={() => navigate('/home')} className="relative z-10 px-8 py-3.5 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-400 transition-all duration-300 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95">
                Launch Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-[#060b19] pt-10 pb-6 px-8 relative z-20">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3 text-white font-heading font-black tracking-tight text-lg drop-shadow-sm">
                <img 
                  src={logoXploreSimple} 
                  alt="Xplore Robot logo" 
                  className="h-5 md:h-6 w-auto brightness-0 invert opacity-90" 
                /> 
                EXPLOR ROBOT
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed max-w-sm font-light">
                Developed by Industrial Informatics Engineering (TRIN) students for advanced underwater vehicle control.
              </p>
            </div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center md:text-right flex flex-col justify-end h-full">
              <p className="selection:text-cyan-500 mb-1.5">© {new Date().getFullYear()} EXPLORE ROBOT. CREATE WITH FULL OF LOVE 🩵.</p>
              <p className="text-cyan-500/60">SYSTEM_STABLE_v1.0.4</p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Landing;