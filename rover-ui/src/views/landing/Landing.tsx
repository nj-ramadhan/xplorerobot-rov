import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import gambar
// @ts-ignore
import underImage from '../../assets/rov-under.png'; 
// @ts-ignore
import rovImage from '../../assets/rov-model.png'; 
// @ts-ignore
import bgImage from '../../assets/rov-bcg.jpg'; 

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0b111a] text-white overflow-x-hidden font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* =========================================
          0. NAVBAR
          ========================================= */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-10 py-5 ${
        isScrolled ? 'bg-[#0b111a]/90 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="text-lg font-bold tracking-tighter flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]"></div>
            EXPLOR ROBOT
          </div>
          <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-widest opacity-90 items-center">
            <span onClick={() => window.scrollTo(0, 0)} className="hover:text-cyan-400 cursor-pointer transition-colors">Home</span>
            <span onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-cyan-400 cursor-pointer transition-colors">About System</span>
            
            <button onClick={() => navigate('/home')} className="ml-4 px-4 py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full hover:bg-cyan-400 hover:text-black transition-all">
              Launch GCS
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================
          1. HERO SECTION 
          ========================================= */}
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col pt-20" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b111a]/95 via-[#0b111a]/70 to-[#1e4e8c]/40 z-0"></div>

        <main className="container mx-auto max-w-7xl px-10 flex-1 flex flex-col md:flex-row items-center relative z-10 py-10">
          <div className="flex-1 text-center md:text-left z-20">
            <p className="font-mono text-[10px] mb-4 text-cyan-400 tracking-widest flex items-center justify-center md:justify-start gap-2">
              <span className="w-6 h-[1px] bg-cyan-400 inline-block"></span>
              INDUSTRIAL INFORMATICS - TRIN
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 uppercase">
              Start Exploring <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 drop-shadow-sm">
                Infinite Depths
              </span>
            </h1>
            <p className="text-slate-300 max-w-sm mb-10 text-sm leading-relaxed font-light mx-auto md:mx-0">
              Initialize your underwater mission, monitor real-time telemetry, and control your vehicle through the abyss.
            </p>
            <button onClick={() => navigate('/home')} className="group relative px-8 py-4 bg-cyan-500 text-[#0b111a] font-bold uppercase text-[11px] tracking-[0.2em] hover:bg-cyan-400 hover:scale-105 transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              Get Started
            </button>
          </div>

          <div className="flex-1 relative mt-16 md:mt-0 flex justify-center items-center">
            <div className="relative group p-4 rounded-xl">
              <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] rounded-full group-hover:blur-[100px] transition-all duration-500"></div>
              <img src={rovImage} alt="ROV Model" className="w-full max-w-2xl animate-float z-10 relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </main>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0b111a] to-transparent pointer-events-none z-10"></div>
      </div>

      {/* =========================================
          2. ABOUT SECTION 
          ========================================= */}
      <div id="about" className="relative z-20 px-10 py-20 bg-[#0b111a] border-y border-white/5">
        <div className="container mx-auto max-w-7xl flex flex-col-reverse md:flex-row items-center gap-16">
          <div className="flex-1 relative mt-16 md:mt-0 flex justify-center items-center">
            <div className="relative group p-4 rounded-xl">
              <div className="absolute inset-0 bg-cyan-900/10 blur-[100px] rounded-full group-hover:bg-cyan-900/20 transition-all duration-500"></div>
              <img src={underImage} alt="Detailed ROV View" className="w-full max-w-lg relative z-10 drop-shadow-[0_10px_40px_rgba(6,182,212,0.1)] group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>

          {/* ================= BAGIAN TEKS KANAN ================= */}
          <div className="flex flex-col gap-6 max-w-xl">
            
            {/* Judul */}
            <div className="border-l-2 border-cyan-400 pl-5">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none">
                Discover<br />
                <span className="text-cyan-400">The System</span>
              </h2>
              <p className="text-[10px] md:text-xs font-mono text-slate-500 tracking-widest mt-3 uppercase">
                // Web-Based Ground Control Station
              </p>
            </div>

            {/* Paragraf 1 (Pembuka) */}
            <p className="text-slate-300 leading-relaxed mt-2 text-sm md:text-base">
              <strong className="text-white">Explore Robot</strong> adalah pusat komando Ground Control Station (GCS) canggih berbasis web yang dirancang khusus untuk memonitor dan mengendalikan Remotely Operated Vehicle (ROV) Anda.
            </p>

            {/* Paragraf 2 (Highlight Fitur Tim Kamu) */}
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Membawa standar sistem sekelas BlueOS ke level berikutnya dengan pembaruan eksklusif dari tim kami. Rasakan kendali tanpa batas melalui integrasi protokol <strong className="text-cyan-400">MAVLink</strong>, fleksibilitas <strong className="text-cyan-400">Manual Controlling</strong> yang presisi, hingga kemampuan eksekusi misi <strong className="text-cyan-400">Autonomous</strong> yang cerdas—semuanya didukung oleh telemetri <em>real-time</em> berlatensi rendah.
            </p>

            {/* List Fitur (Diperbarui) */}
            <ul className="space-y-3 mt-4 text-xs md:text-sm font-mono text-slate-400">
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
          3. SYSTEM CAPABILITIES (UPDATE: CONTROL FEATURES)
          ========================================= */}
      <div className="relative z-20 px-10 py-12 bg-[#080d14] border-b border-white/5">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12">
          
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-white mb-2 uppercase tracking-wide">
              Advanced <br className="hidden md:block" />
              <span className="text-cyan-400">Control Systems</span>
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Antarmuka kendali mutakhir yang memungkinkan operator menguasai kendaraan dengan berbagai metode navigasi.
            </p>
          </div>

          <div className="md:w-2/3 grid grid-cols-2 gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="text-cyan-400 text-2xl">🎯</div>
              <div>
                <h4 className="text-lg font-black text-white leading-none uppercase">Autonomous</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Smart Waypoint Navigation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-cyan-400 text-2xl">⌨️</div>
              <div>
                <h4 className="text-lg font-black text-white leading-none uppercase">Keyboard</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Responsive Manual Input</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-cyan-400 text-2xl">🕹️</div>
              <div>
                <h4 className="text-lg font-black text-white leading-none uppercase">MAVLink</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Direct Protocol Control</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-cyan-400 text-2xl">🛰️</div>
              <div>
                <h4 className="text-lg font-black text-white leading-none uppercase">Manual Mode</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Stabilized Flight Control</p>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* =========================================
          2.5. EXTRA INFORMATION (NEW)
          ========================================= */}
      <div className="relative z-20 px-10 py-20 bg-[#080d14] border-t border-white/5 relative overflow-hidden">
        {/* Ornamen Background biar nggak sepi */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4 border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Mission Objective
            </span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
            Bridging the <span className="text-cyan-400">Surface</span> and the Deep
          </h3>
          
          <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-6">
            [Ini teks paragraf random yang bisa kamu ganti nanti] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          
          <p className="text-slate-500 leading-relaxed text-sm md:text-base italic">
            "Sistem ini dibangun untuk memfasilitasi kebutuhan eksplorasi laut dalam dengan tingkat presisi yang tak tertandingi, memberikan akses data visual dan sensorik secara real-time ke stasiun permukaan."
          </p>
        </div>
      </div>

      {/* =========================================
          4. EXTENDED DESCRIPTION 
          ========================================= */}
      <div className="relative z-20 px-10 py-16 bg-[#0b111a]">
        <div className="container mx-auto max-w-4xl">
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-6 italic text-center md:text-left">
            "Menggunakan basis frame BlueROV yang sudah teruji, kami mengembangkan sistem kontrol antarmuka yang fleksibel. Integrasi ini memungkinkan eksplorasi laut dalam menjadi lebih efisien, responsif, dan mudah diakses oleh peneliti maupun industri."
          </p>
          
          <div className="mb-12 text-center md:text-left border-l border-cyan-500 pl-4">
            <h4 className="text-cyan-400 font-bold tracking-wide text-sm">Tim Pengembang TRIN</h4>
            <p className="text-slate-500 text-[10px]">Politeknik Manufaktur Bandung</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 md:gap-10 text-slate-500 font-bold text-sm opacity-60">
            <div className="flex items-center gap-2 hover:text-[#61DAFB] transition-colors"><span className="text-xl">⚛️</span> React</div>
            <div className="flex items-center gap-2 hover:text-[#38B2AC] transition-colors"><span className="text-xl">🌊</span> Tailwind</div>
            <div className="flex items-center gap-2 hover:text-[#FFD859] transition-colors"><span className="text-xl">⚡</span> Vite</div>
            <div className="flex items-center gap-2 hover:text-[#68A063] transition-colors"><span className="text-xl">🟢</span> Node.js</div>
            <div className="w-full md:w-auto md:ml-auto flex justify-center text-[10px] font-mono text-cyan-400 cursor-pointer hover:underline mt-4">
              Explore system details &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          5. CTA BANNER
          ========================================= */}
      <div className="relative z-20 px-10 pt-4 pb-20 bg-[#0b111a]">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 rounded-2xl p-10 text-center relative overflow-hidden group">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3 relative z-10">Ready to Dive?</h2>
            <p className="text-cyan-100/70 text-sm mb-6 relative z-10 max-w-md mx-auto">Access the full Ground Control Station and initialize your vehicle.</p>
            <button onClick={() => navigate('/home')} className="relative z-10 px-8 py-3 bg-cyan-500 text-black font-bold uppercase tracking-wider text-xs hover:bg-cyan-400 transition-colors rounded-md">
              Launch Dashboard
            </button>
          </div>
        </div>
      </div>
        

      {/* =========================================
          6. FOOTER
          ========================================= */}
      <footer className="relative z-20 border-t border-white/10 bg-[#060a0f] pt-12 pb-6 px-10">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="text-center md:text-left">
            <div className="text-lg font-black tracking-tighter flex items-center justify-center md:justify-start gap-2 mb-3 text-white">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div> EXPLOR ROBOT
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs font-light">
              Developed by Industrial Informatics Engineering (TRIN) students for advanced underwater vehicle control.
            </p>
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center md:text-right">
            <p className="selection:text-cyan-500">© {new Date().getFullYear()} EXPLORE ROBOT. CREATE WITH FULL OF LOVE 🩵.</p>
            <p className="mt-1">SYSTEM_STABLE_v1.0.4</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;