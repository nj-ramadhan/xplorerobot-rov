import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
import namdofImg from '../../assets/namdof.jpg'; 
// @ts-ignore
import thrustersImg from '../../assets/Thrusters.png'; 
// @ts-ignore
import kinematicImg from '../../assets/kinematic.png'; 
// @ts-ignore
import rovModelImg from '../../assets/rov-model.png'; 
// Gambar hero baru
// @ts-ignore
import rovImg from '../../assets/rov.png'; 
// Gambar-gambar baru untuk cardtemplate
// @ts-ignore
import matriksImg from '../../assets/matriks.png';
// @ts-ignore
import sumbuxImg from '../../assets/sumbux.png';
// @ts-ignore
import sumbuyImg from '../../assets/sumbuy.png';
// @ts-ignore
import sumbuzImg from '../../assets/sumbuz.png';

// --- WIDGET COMPONENTS ---
type MovementType = 'idle' | 'surge_fwd' | 'surge_bwd' | 'sway_right' | 'sway_left' | 'heave_up' | 'heave_down' | 'yaw_right' | 'yaw_left' | 'roll_right' | 'roll_left';

interface ThrusterState {
  t1: number; // 0 = mati, 1 = dorong (maju/hijau), -1 = tarik (mundur/merah)
  t2: number;
  t3: number;
  t4: number;
  t5: number;
  t6: number;
  description: string;
}

const getMovementState = (move: MovementType): ThrusterState => {
  switch (move) {
    case 'surge_fwd': return { t1: 1, t2: 1, t3: 1, t4: 1, t5: 0, t6: 0, description: "Surge Forward (Maju): T1, T2, T3, T4 mendorong air ke belakang." };
    case 'surge_bwd': return { t1: -1, t2: -1, t3: -1, t4: -1, t5: 0, t6: 0, description: "Surge Backward (Mundur): T1, T2, T3, T4 menarik air ke depan." };
    case 'sway_right': return { t1: 1, t2: -1, t3: -1, t4: 1, t5: 0, t6: 0, description: "Sway Right (Geser Kanan): T1 & T4 dorong, T2 & T3 tarik. Gaya maju/mundur batal." };
    case 'sway_left': return { t1: -1, t2: 1, t3: 1, t4: -1, t5: 0, t6: 0, description: "Sway Left (Geser Kiri): T2 & T3 dorong, T1 & T4 tarik. Gaya maju/mundur batal." };
    case 'heave_up': return { t1: 0, t2: 0, t3: 0, t4: 0, t5: 1, t6: 1, description: "Heave Up (Naik): T5 & T6 mendorong ke bawah untuk mengangkat ROV." };
    case 'heave_down': return { t1: 0, t2: 0, t3: 0, t4: 0, t5: -1, t6: -1, description: "Heave Down (Turun): T5 & T6 menarik ke atas untuk menekan ROV." };
    case 'yaw_right': return { t1: 1, t2: -1, t3: 1, t4: -1, t5: 0, t6: 0, description: "Yaw Right (Belok Kanan): T1 & T3 maju, T2 & T4 mundur. Menciptakan torsi searah jarum jam." };
    case 'yaw_left': return { t1: -1, t2: 1, t3: -1, t4: 1, t5: 0, t6: 0, description: "Yaw Left (Belok Kiri): T2 & T4 maju, T1 & T3 mundur. Menciptakan torsi berlawanan jarum jam." };
    case 'roll_right': return { t1: 0, t2: 0, t3: 0, t4: 0, t5: 1, t6: -1, description: "Roll Right (Miring Kanan): T5 dorong naik, T6 dorong turun." };
    case 'roll_left': return { t1: 0, t2: 0, t3: 0, t4: 0, t5: -1, t6: 1, description: "Roll Left (Miring Kiri): T5 dorong turun, T6 dorong naik." };
    default: return { t1: 0, t2: 0, t3: 0, t4: 0, t5: 0, t6: 0, description: "Idle (Diam): Menunggu perintah manuver." };
  }
};

const ThrusterArrow = ({ val, angle }: { val: number, angle: number }) => {
  if (val === 0) return null;
  const isPositive = val > 0;
  const color = isPositive ? 'text-cyan-400' : 'text-rose-500';
  const arrowRotation = isPositive ? angle : angle + 180; 

  return (
    <div className={`absolute top-1/2 left-1/2 w-12 h-1 -ml-6 -mt-0.5 ${color}`} style={{ transform: `rotate(${arrowRotation}deg)` }}>
      <div className="absolute right-[-4px] top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 border-current transform rotate-45"></div>
      <div className="w-full h-full bg-current rounded-full"></div>
    </div>
  );
};
// --- END WIDGET COMPONENTS ---

const Data: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [activeKineCard, setActiveKineCard] = useState<number>(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // State untuk Interactive Widget
  const [activeMove, setActiveMove] = useState<MovementType>('idle');
  const thrusterData = getMovementState(activeMove);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="relative text-white overflow-x-hidden font-sans antialiased min-h-screen bg-[#030914]">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        
        .font-heading { font-family: 'Montserrat', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.8); }
      `}</style>

      {/* BACKGROUND GLOW (Deep Ocean Theme) */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-[#00D2FF] opacity-[0.06] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#2563EB] opacity-[0.04] blur-[150px] rounded-full"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-20 border-b border-white/5 bg-[#030914]/80 backdrop-blur-xl px-8 xl:px-16 py-4 flex-shrink-0">
        <div className="w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 w-1/3">
            <button 
              onClick={() => navigate('/')} 
              className="w-10 h-10 rounded-full bg-[#0D1627] border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-slate-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <div>
              <h1 className="font-heading text-lg font-bold text-white tracking-wide">Engineering Data</h1>
              <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">Tech Specs & Kinematics</p>
            </div>
          </div>

          <div className="hidden md:flex justify-center w-1/3">
            <div className="bg-[#0D1627] border border-white/10 rounded-full p-1 flex items-center backdrop-blur-md">
              <button 
                onClick={() => setCurrentPage(1)}
                className={`px-6 py-1.5 rounded-full font-sans text-xs font-semibold transition-all duration-300 ${
                  currentPage === 1 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                6-DOF
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={`px-6 py-1.5 rounded-full font-sans text-xs font-semibold transition-all duration-300 ${
                  currentPage === 2 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                Kinematics
              </button>
            </div>
          </div>
          
          <div className="flex justify-end w-1/3">
            <button onClick={() => navigate('/home')} className="px-6 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] transition-all duration-300 font-sans text-sm font-semibold shadow-[0_0_15px_rgba(37,99,235,0.4)] tracking-wide">
              Launch GCS
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 w-full pt-12 pb-32 flex flex-col items-center">
        
        {/* ========================================= */}
        {/* PAGE 1: 6-DOF                             */}
        {/* ========================================= */}
        {currentPage === 1 && (
          <div className="animate-fade w-full flex flex-col items-center">
            
            {/* HERO SECTION - DJI MAVIC PRO STYLE */}
            <div className="w-full max-w-6xl mx-auto px-6 pt-10 pb-20 flex flex-col items-center relative">
               
               {/* Pre-title */}
               <div className="text-center mb-8 text-cyan-400 text-xs font-bold tracking-widest uppercase font-sans border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 rounded-sm">
                 XPLORE ROBOT TEAM
               </div>

               {/* Grid layout for 4 text blocks and center image */}
               <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-4 items-center relative z-10">
                 
                 {/* Left Text Blocks */}
                 <div className="flex flex-col gap-12 lg:gap-24 text-center lg:text-left order-2 lg:order-1">
                   <div>
                     <h3 className="text-xl font-bold text-white font-heading tracking-wide">Gerak Translasi</h3>
                     <p className="text-slate-400 text-sm font-sans mt-1">3 Sumbu Linear (X, Y, Z)</p>
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white font-heading tracking-wide">Momen Rotasi</h3>
                     <p className="text-slate-400 text-sm font-sans mt-1">3 Sumbu Angular (Φ, θ, Ψ)</p>
                   </div>
                 </div>

                 {/* Center Image */}
                 <div className="col-span-1 flex justify-center relative order-1 lg:order-2 py-8 lg:py-0">
                    <div className="absolute inset-0 bg-[#00D2FF] opacity-10 blur-[100px] rounded-full"></div>
                    <img 
                      src={rovImg} 
                      alt="ROV 6-DOF" 
                      className="w-full max-w-sm h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10 animate-float" 
                    />
                 </div>

                 {/* Right Text Blocks */}
                 <div className="flex flex-col gap-12 lg:gap-24 text-center lg:text-right order-3 lg:order-3">
                   <div>
                     <h3 className="text-xl font-bold text-white font-heading tracking-wide">Navigasi Presisi</h3>
                     <p className="text-slate-400 text-sm font-sans mt-1">Kontrol Penuh Bawah Air</p>
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white font-heading tracking-wide">Kestabilan Aktif</h3>
                     <p className="text-slate-400 text-sm font-sans mt-1">Matriks Alokasi Thruster</p>
                   </div>
                 </div>

               </div>

               {/* Title Below Image */}
               <div className="text-center mt-16 max-w-3xl relative z-10 flex flex-col items-center">
                 <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 tracking-tight">
                   "MENGENAL <span className="text-cyan-400">6-DOF</span> MANUVER."
                 </h1>
                 <p className="text-slate-400 text-sm md:text-base font-sans leading-relaxed mb-8 max-w-2xl">
                   Dalam dinamika kendaraan bawah air, Six Degrees of Freedom (6-DOF) merepresentasikan enam arah independen pergerakan ROV di ruang tiga dimensi untuk navigasi presisi menuju kedalaman tak terbatas.
                 </p>
                 <div className="flex justify-center gap-4">
                   <button onClick={() => setCurrentPage(2)} className="bg-[#2563EB] text-white font-bold px-8 py-3 rounded-md hover:bg-[#1D4ED8] transition-all text-sm tracking-wide shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                     Lihat Kinematika
                   </button>
                 </div>
               </div>
            </div>

            {/* SERVICES SECTION -> 2 CARDS LAYOUT (Translasi & Rotasi) */}
            <div className="w-full max-w-7xl px-6 lg:px-12 mt-16">
              <div className="flex flex-col items-start mb-10">
                 <div className="flex items-center gap-3 mb-2 text-cyan-400 font-bold text-sm tracking-wider uppercase">
                   <div className="w-6 h-[2px] bg-cyan-400"></div> KOMPONEN
                 </div>
                 <h2 className="text-4xl font-heading font-bold text-white flex items-center gap-3 uppercase">
                   Pergerakan <span className="text-slate-600 font-light">|</span> <span className="text-cyan-400">Translasi & Rotasi</span>
                 </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Card 1: Gerak Translasi */}
                 <div className="bg-[#0A111C] border border-white/5 p-8 lg:p-10 rounded-2xl shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full group">
                    <div className="w-14 h-14 bg-[#111C2E] rounded-xl flex items-center justify-center mb-8 text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-heading tracking-wide uppercase">Sumbu X, Y, Z</h3>
                    <p className="text-slate-400 text-[15px] leading-relaxed mb-10 font-light flex-grow font-sans">
                      Pergerakan linear ROV di sepanjang sumbu 3D tanpa memutar haluan. Meliputi dorongan maju/mundur (<strong className="text-white">Surge</strong> - Sumbu X), menyamping sejajar (<strong className="text-white">Sway</strong> - Sumbu Y), dan pergerakan vertikal murni (<strong className="text-white">Heave</strong> - Sumbu Z).
                    </p>
                    <button className="text-cyan-400 text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all w-fit mt-auto uppercase tracking-wide">
                      Detail Translasi <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                 </div>

                 {/* Card 2: Momen Rotasi */}
                 <div className="bg-[#0A111C] border border-white/5 p-8 lg:p-10 rounded-2xl shadow-xl hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full group">
                    <div className="w-14 h-14 bg-[#111C2E] rounded-xl flex items-center justify-center mb-8 text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-heading tracking-wide uppercase">Momen Rotasi</h3>
                    <p className="text-slate-400 text-[15px] leading-relaxed mb-10 font-light flex-grow font-sans">
                      Pergerakan memutar ROV pada pusat massanya. Meliputi gerakan memutar memanjang (<strong className="text-white">Roll</strong>), menunduk/mendongak (<strong className="text-white">Pitch</strong>), serta perubahan arah haluan ke kiri/kanan (<strong className="text-white">Yaw</strong>).
                    </p>
                    <button className="text-cyan-400 text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all w-fit mt-auto uppercase tracking-wide">
                      Detail Rotasi <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                 </div>
              </div>
            </div>

            {/* SEKSI: KENAPA 6-DOF PENTING? (RESTORED) */}
            <div className="w-full mt-32 bg-[#050B14] py-24 relative overflow-hidden shadow-inner z-10 border-t border-white/5">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full"></div>
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2563EB]/5 blur-[100px] rounded-full"></div>
               
               <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-20 relative z-10">
                 
                 <div className="w-full lg:w-1/2 relative flex justify-center">
                   <div className="w-80 h-80 sm:w-96 sm:h-96 bg-[#0A111C] border border-white/5 rounded-full flex items-center justify-center relative p-1 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                     <div className="w-full h-full bg-[#030914] rounded-full overflow-hidden flex items-center justify-center">
                        <img src={kinematicImg} alt="Kinematic Deep Dive" className="w-[85%] h-auto object-contain opacity-70 mix-blend-screen" />
                     </div>
                     
                     <div className="absolute top-10 left-[-20px] bg-cyan-400 text-[#030914] font-bold text-xs px-4 py-2 rounded-sm transform -rotate-3 shadow-lg">Surge (Maju)</div>
                     <div className="absolute top-32 left-[-40px] bg-[#1E3A8A] text-cyan-100 font-bold text-xs px-4 py-2 rounded-sm transform rotate-2 shadow-lg border border-cyan-500/20">Sway (Samping)</div>
                     <div className="absolute bottom-24 left-[-10px] bg-[#2563EB] text-white font-bold text-xs px-4 py-2 rounded-sm transform -rotate-2 shadow-lg">Heave (Naik/Turun)</div>
                     
                     <div className="absolute top-16 right-[-20px] bg-[#0D1627] text-cyan-400 font-bold text-xs px-4 py-2 rounded-sm transform rotate-3 shadow-lg border border-cyan-500/20">Roll (Guling)</div>
                     <div className="absolute top-40 right-[-40px] bg-cyan-500 text-[#030914] font-bold text-xs px-4 py-2 rounded-sm transform -rotate-2 shadow-lg">Pitch (Tunduk)</div>
                     <div className="absolute bottom-20 right-[-10px] bg-[#1E3A8A] text-cyan-100 font-bold text-xs px-4 py-2 rounded-sm transform rotate-2 shadow-lg border border-cyan-500/20">Yaw (Belok)</div>
                   </div>
                 </div>

                 <div className="w-full lg:w-1/2 space-y-8">
                   <div>
                     <div className="flex items-center gap-3 mb-3 text-slate-400 font-bold text-sm tracking-wider uppercase font-sans">
                       <div className="w-4 h-[2px] bg-cyan-400"></div> Detail Referensi
                     </div>
                     <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight uppercase">
                       Kenapa <span className="text-cyan-400">6-DOF</span> Penting?
                     </h2>
                     <p className="text-slate-300 font-light leading-relaxed text-base font-sans text-justify">
                       Penguasaan konsep 6-DOF mutlak diperlukan dalam merancang sistem kendali dan algoritma telemetri. Tanpa pemahaman ini, matriks alokasi thruster tidak dapat disusun dengan benar, yang berakibat ROV tidak bisa bermanuver stabil di bawah air.
                     </p>
                   </div>

                   <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/5">
                     <div>
                       <div className="text-3xl lg:text-4xl font-bold text-white mb-1 font-mono">3</div>
                       <div className="text-xs text-cyan-400 uppercase tracking-widest font-semibold font-sans">Arah Translasi</div>
                     </div>
                     <div>
                       <div className="text-3xl lg:text-4xl font-bold text-white mb-1 font-mono">3</div>
                       <div className="text-xs text-blue-400 uppercase tracking-widest font-semibold font-sans">Momen Rotasi</div>
                     </div>
                     <div>
                       <div className="text-3xl lg:text-4xl font-bold text-white mb-1 font-mono">6</div>
                       <div className="text-xs text-cyan-200 uppercase tracking-widest font-semibold font-sans">Total Sumbu</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            {/* PENDALAMAN 6-DOF (TAM & KELOMPOK THRUSTER) */}
            <div className="w-full bg-[#030914] py-24 relative overflow-hidden border-t border-white/5 shadow-2xl z-10">
              <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse"></div>
              <div className="absolute top-[60%] right-[15%] w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] animate-pulse delay-700"></div>
              <div className="absolute bottom-[30%] left-[20%] w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_#67e8f9] animate-pulse delay-300"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-900/10 via-[#030914] to-blue-900/10 pointer-events-none"></div>

              <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                
                <div className="inline-block bg-[#1E3A8A]/30 border border-[#2563EB]/50 text-cyan-400 font-bold px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-4 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                  Thruster Allocation Matrix (TAM)
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-16 tracking-tight uppercase">
                  Memahami 6 Derajat Kebebasan (DoF)
                </h2>

                {/* Grid Translasi & Rotasi List dan Cara Kerja TAM */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
                  {/* Left Column: Translasi & Rotasi Lists */}
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {/* Translasi */}
                      <div className="relative">
                        <div className="absolute -left-4 top-2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                        <h3 className="text-xl font-bold text-white mb-4 font-heading tracking-wide">Translasi (Gerak Lurus) :</h3>
                        <ul className="text-slate-400 text-sm font-sans space-y-3 leading-relaxed">
                          <li>• <strong className="text-cyan-400">Surge (X):</strong> Maju / Mundur</li>
                          <li>• <strong className="text-cyan-400">Sway (Y):</strong> Geser Kanan / Kiri</li>
                          <li>• <strong className="text-cyan-400">Heave (Z):</strong> Naik / Turun</li>
                        </ul>
                      </div>
                      
                      {/* Rotasi */}
                      <div className="relative">
                        <div className="absolute -left-4 top-2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
                        <h3 className="text-xl font-bold text-white mb-4 font-heading tracking-wide">Rotasi (Gerak Memutar) :</h3>
                        <ul className="text-slate-400 text-sm font-sans space-y-3 leading-relaxed">
                          <li>• <strong className="text-[#60A5FA]">Roll (Φ):</strong> Mengguling ke kanan / kiri</li>
                          <li>• <strong className="text-[#60A5FA]">Pitch (θ):</strong> Menunduk / Mendongak</li>
                          <li>• <strong className="text-[#60A5FA]">Yaw (Ψ):</strong> Menoleh ke kanan / kiri</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Cara Kerja TAM Explanation */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-white mb-6 font-heading tracking-wide border-b border-white/10 pb-4">Cara Kerja TAM</h3>
                    <div className="space-y-6 text-slate-400 text-sm font-sans leading-relaxed">
                      <p>
                        Di sinilah <strong className="text-white">Thruster Allocation Matrix (TAM)</strong> bekerja. TAM adalah jembatan yang menerjemahkan "gaya total yang diinginkan wahana" menjadi "gaya yang harus dikeluarkan oleh masing-masing motor".
                      </p>
                      <div className="bg-[#0A111C] border border-[#1E3A8A]/50 p-4 rounded-lg shadow-inner">
                        <p className="text-cyan-400 font-semibold mb-2">Misalnya, 4 thruster horizontalnya dipasang dengan sudut 45 derajat.</p>
                        <p className="mb-3">Jika ROV ini mendorong dengan gaya <span className="font-mono text-white">F</span>, gaya tersebut akan terpecah menjadi dua komponen vektor:</p>
                        <ul className="space-y-2 text-slate-300 font-mono text-xs bg-[#030914] p-3 rounded-md border border-white/5">
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> Gaya dorong ke depan (Sumbu X): F · cos(45°)</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full"></span> Gaya dorong ke samping (Sumbu Y): F · sin(45°)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PENJELASAN TAMBAHAN DARI USER (DI ATAS CARD PEMBAGIAN KELOMPOK) */}
                <div className="mb-12 space-y-6 text-slate-300 font-light leading-relaxed font-sans text-[15px]">
                  <p className="text-justify">
                    Meskipun secara teori terdapat enam derajat kebebasan, pada konfigurasi enam thruster standar biasanya tidak semua DOF dapat dikontrol secara aktif, khususnya gerakan roll (miring kiri-kanan). Hal ini disebabkan oleh keterbatasan distribusi thruster yang tidak memberikan momen langsung terhadap sumbu roll. Akibatnya, roll sering kali dikendalikan secara pasif melalui desain mekanik, seperti penempatan pusat massa yang lebih rendah dibandingkan pusat apung agar ROV tetap stabil di dalam air. Dengan kata lain, ROV dengan enam thruster umumnya mampu mengontrol lima DOF secara aktif, sementara satu DOF sisanya bergantung pada stabilitas alami sistem.
                  </p>
                  <p className="text-justify">
                    Dalam implementasi sistem kontrol, hubungan antara gaya yang dihasilkan thruster dan gerakan ROV biasanya dimodelkan dalam bentuk matriks alokasi (allocation matrix), yang memetakan kontribusi masing-masing thruster terhadap setiap DOF. Pendekatan ini memungkinkan penggunaan algoritma kontrol seperti PID untuk mengatur kecepatan dan stabilitas gerakan secara presisi. Namun, dalam praktiknya terdapat tantangan seperti coupling antar gerakan, di mana satu aksi thruster dapat memengaruhi lebih dari satu DOF, serta gangguan eksternal seperti arus laut yang dapat mengganggu kestabilan. Oleh karena itu, desain posisi thruster yang simetris, penggunaan sensor seperti IMU dan depth sensor, serta tuning kontrol yang baik menjadi kunci agar ROV dapat bergerak secara stabil, presisi, dan responsif di lingkungan bawah air yang dinamis.
                  </p>
                </div>

                {/* Bottom Box: Pembagian Kelompok Thruster */}
                <div className="bg-[#0A111C] border border-white/10 rounded-2xl p-8 lg:p-10 shadow-xl relative overflow-hidden group hover:border-[#2563EB]/50 transition-colors duration-500">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-400 to-[#2563EB]"></div>
                  <h3 className="text-2xl font-bold text-white mb-6 font-heading tracking-wide">Pembagian Kelompok Thruster</h3>
                  <p className="text-slate-400 text-sm font-sans mb-6">Dari diagram konfigurasi, kita bisa melihat 6 thruster dibagi menjadi dua kelompok utama:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-cyan-400 font-heading">Thruster Horizontal (Vectored)</h4>
                      <p className="text-slate-300 text-sm font-sans leading-relaxed">
                        <strong className="text-white">Nomor 1, 2, 3, dan 4.</strong> Posisinya menyudut (biasanya 45 derajat) terhadap sumbu ROV. Kelompok ini mengontrol pergerakan di bidang datar.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-[#60A5FA] font-heading">Thruster Vertikal</h4>
                      <p className="text-slate-300 text-sm font-sans leading-relaxed">
                        <strong className="text-white">Nomor 5 dan 6.</strong> Posisinya tegak lurus menghadap atas/bawah. Kelompok ini mengontrol pergerakan vertikal dan kemiringan samping.
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

          </div>
        )}

        {/* ========================================= */}
        {/* PAGE 2: KINEMATICS                        */}
        {/* ========================================= */}
        {currentPage === 2 && (
          <div className="animate-fade w-full max-w-7xl flex flex-col mt-4 items-center">
            
            <div className="text-center mb-10 w-full">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading uppercase tracking-wide">Thruster Kinematics</h2>
              <p className="text-base text-slate-400 max-w-2xl mx-auto font-light leading-relaxed font-sans">
                Pilih modul varian konfigurasi di bawah untuk melihat detail matriks alokasi dan mekanismenya pada ROV.
              </p>
            </div>

            {/* TAB SELECTORS: 4 CARDS DENGAN GAMBAR */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-12 px-6 lg:px-0 relative z-20">
              {/* Card 1 */}
              <div onClick={() => setActiveKineCard(1)} className={`cursor-pointer bg-[#0A111C] rounded-xl p-4 transition-all duration-300 group ${activeKineCard === 1 ? 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border border-white/10 hover:border-white/30'}`}>
                <div className="bg-[#111C2E] rounded-lg h-40 w-full flex items-center justify-center p-2 mb-4 overflow-hidden">
                  <img src={matriksImg} alt="Vektor & Matriks" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm md:text-base font-heading uppercase tracking-wider">Vektor & Matriks</h3>
                  <p className="text-slate-400 text-xs mt-1.5 font-sans">3 Konsep Dasar</p>
                </div>
              </div>

              {/* Card 2 */}
              <div onClick={() => setActiveKineCard(2)} className={`cursor-pointer bg-[#0A111C] rounded-xl p-4 transition-all duration-300 group ${activeKineCard === 2 ? 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border border-white/10 hover:border-white/30'}`}>
                <div className="bg-[#111C2E] rounded-lg h-40 w-full flex items-center justify-center p-2 mb-4 overflow-hidden">
                  <img src={sumbuxImg} alt="Sumbu X" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm md:text-base font-heading uppercase tracking-wider">Sumbu X</h3>
                  <p className="text-slate-400 text-xs mt-1.5 font-sans">Surge & Roll</p>
                </div>
              </div>

              {/* Card 3 */}
              <div onClick={() => setActiveKineCard(3)} className={`cursor-pointer bg-[#0A111C] rounded-xl p-4 transition-all duration-300 group ${activeKineCard === 3 ? 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border border-white/10 hover:border-white/30'}`}>
                <div className="bg-[#111C2E] rounded-lg h-40 w-full flex items-center justify-center p-2 mb-4 overflow-hidden">
                  <img src={sumbuyImg} alt="Sumbu Y" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm md:text-base font-heading uppercase tracking-wider">Sumbu Y</h3>
                  <p className="text-slate-400 text-xs mt-1.5 font-sans">Sway & Pitch</p>
                </div>
              </div>

              {/* Card 4 */}
              <div onClick={() => setActiveKineCard(4)} className={`cursor-pointer bg-[#0A111C] rounded-xl p-4 transition-all duration-300 group ${activeKineCard === 4 ? 'border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border border-white/10 hover:border-white/30'}`}>
                <div className="bg-[#111C2E] rounded-lg h-40 w-full flex items-center justify-center p-2 mb-4 overflow-hidden">
                  <img src={sumbuzImg} alt="Sumbu Z" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold text-sm md:text-base font-heading uppercase tracking-wider">Sumbu Z</h3>
                  <p className="text-slate-400 text-xs mt-1.5 font-sans">Heave & Yaw</p>
                </div>
              </div>
            </div>

            {/* DYNAMIC CONTENT AREA (FULL TEXT ONLY) */}
            <div className="w-full px-6 lg:px-0 relative z-10">
              <div className="w-full bg-[#0A111C] border border-[#1E3A8A]/30 rounded-2xl p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-12 min-h-[350px] flex items-center justify-center">
                
                {activeKineCard === 1 && (
                  <div className="animate-fade flex flex-col items-center w-full">
                    <div className="space-y-8 w-full max-w-4xl">
                      <div>
                        <h3 className="text-2xl font-bold text-cyan-400 mb-3 font-heading uppercase">Vektor Gaya (Tau / τ)</h3>
                        <p className="text-slate-300 font-light leading-relaxed mb-4 font-sans text-sm">Sistem navigasi mengirimkan instruksi gerakan yang diinginkan oleh ROV. Gaya dan momen yang bekerja pada <em>Center of Gravity</em> (CoG) didefinisikan dalam bentuk vektor τ dengan ukuran 6 × 1:</p>
                        <div className="bg-[#030914] border border-white/5 p-4 rounded-lg font-mono text-sm shadow-inner flex items-center gap-4">
                          <span className="text-cyan-400 text-xl font-bold ml-4">τ =</span>
                          <div className="flex flex-col border-l-2 border-r-2 border-white/10 px-4 py-2 space-y-1 text-slate-300 w-full text-xs">
                            <span>X (Surge - Maju)</span>
                            <span>Y (Sway - Samping)</span>
                            <span>Z (Heave - Vertikal)</span>
                            <span>K (Roll - Guling)</span>
                            <span>M (Pitch - Menunduk)</span>
                            <span>N (Yaw - Belok)</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-[#2563EB] mb-3 font-heading uppercase">Matriks Konfigurasi (T)</h3>
                        <p className="text-slate-300 font-light leading-relaxed mb-3 font-sans text-sm">Gaya dari motor digabungkan menggunakan <strong>Matriks Alokasi (T)</strong>.</p>
                        <div className="flex justify-center text-2xl font-mono text-white bg-[#030914] rounded-lg py-4 border border-white/5 w-full flex-col items-center">
                          <div className="mb-2"><span className="text-cyan-400">τ</span> <span className="mx-4">=</span> <span className="text-[#2563EB]">T</span> <span className="mx-4">×</span> <span className="text-slate-400">u</span></div>
                          <div className="text-xs text-slate-500 mt-2 border-t border-white/10 pt-2 w-full text-center">
                            * Dimana <strong>u</strong> adalah vektor gaya dari masing-masing thruster (u1 ... u6)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeKineCard === 2 && (
                  <div className="animate-fade flex flex-col items-center w-full">
                    <div className="space-y-6 w-full max-w-4xl">
                      <h3 className="text-3xl font-bold text-white mb-6 font-heading border-b border-white/10 pb-4 uppercase">1. Sumbu X (Surge & Roll)</h3>
                      
                      <div className="bg-[#030914] border border-white/5 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-cyan-400 font-mono font-bold text-lg">Surge (u)</span>
                          <span className="text-[10px] uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-sm">Maju/Mundur</span>
                        </div>
                        <p className="text-slate-300 font-light leading-relaxed text-sm font-sans mb-3">
                          Dikontrol oleh <strong className="text-white">Thruster 1, 2, 3, dan 4</strong>. Keempat thruster ini akan berputar bersamaan untuk menyemburkan air ke belakang (untuk maju) atau ke depan (untuk mundur).
                        </p>
                        <div className="mt-4 bg-[#111C2E]/50 border border-[#1E3A8A]/30 p-3 rounded-md font-mono text-xs text-slate-300">
                          <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">Persamaan Kinematika:</div>
                          <p>X = (u1 + u2 + u3 + u4) · cos(45°)</p>
                        </div>
                      </div>

                      <div className="bg-[#030914] border border-white/5 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#2563EB] font-mono font-bold text-lg">Roll (p)</span>
                          <span className="text-[10px] uppercase tracking-wider bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/50 px-3 py-1 rounded-sm">Miring Kanan/Kiri</span>
                        </div>
                        <p className="text-slate-300 font-light leading-relaxed text-sm font-sans mb-3">
                          Dikontrol oleh <strong className="text-white">Thruster 5 dan 6</strong> secara diferensial (berlawanan). Jika Thruster 5 mendorong ke atas dan Thruster 6 mendorong ke bawah, ROV akan miring/mengguling ke satu sisi.
                        </p>
                        <div className="mt-4 bg-[#111C2E]/50 border border-[#1E3A8A]/30 p-3 rounded-md font-mono text-xs text-slate-300">
                          <div className="text-[#2563EB] font-bold mb-1 flex items-center gap-2">Persamaan Kinematika:</div>
                          <p>K = (u5 - u6) · d_y</p>
                          <p className="text-[10px] text-slate-500 mt-1">*d_y = jarak thruster ke sumbu tengah Y</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeKineCard === 3 && (
                  <div className="animate-fade flex flex-col items-center w-full">
                    <div className="space-y-6 w-full max-w-4xl">
                      <h3 className="text-3xl font-bold text-white mb-6 font-heading border-b border-white/10 pb-4 uppercase">2. Sumbu Y (Sway & Pitch)</h3>
                      
                      <div className="bg-[#030914] border border-white/5 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-cyan-400 font-mono font-bold text-lg">Sway (v)</span>
                          <span className="text-[10px] uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-sm">Geser Kanan/Kiri</span>
                        </div>
                        <p className="text-slate-300 font-light leading-relaxed text-sm font-sans mb-3">
                          Dikontrol oleh <strong className="text-white">Thruster 1, 2, 3, dan 4</strong>. Karena posisinya menyudut (<em className="text-cyan-400">vectored</em>), jika Thruster 1 & 4 mendorong ke satu arah sementara Thruster 2 & 3 merespons untuk menyeimbangkan, ROV bisa bergeser ke samping tanpa harus berputar.
                        </p>
                        <div className="mt-4 bg-[#111C2E]/50 border border-[#1E3A8A]/30 p-3 rounded-md font-mono text-xs text-slate-300">
                          <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">Persamaan Kinematika:</div>
                          <p>Y = (-u1 + u2 + u3 - u4) · sin(45°)</p>
                        </div>
                      </div>

                      <div className="bg-[#030914] border border-white/5 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#2563EB] font-mono font-bold text-lg">Pitch (q)</span>
                          <span className="text-[10px] uppercase tracking-wider bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/50 px-3 py-1 rounded-sm">Tengadah/Nunduk</span>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-md p-4 relative overflow-hidden mt-2 mb-3">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400"></div>
                          <p className="text-sm text-slate-300 font-light leading-relaxed pl-2 font-sans">
                            <strong className="text-cyan-400 block mb-1">Perhatian khusus untuk simulasi:</strong>
                            ROV dengan konfigurasi ini bersifat <em className="text-white">underactuated</em> pada sumbu Pitch. Artinya, posisi Thruster 5 dan 6 yang persis di tengah sumbu X membuat mereka <strong className="text-white">tidak bisa</strong> menghasilkan gaya aktif untuk menundukkan atau menengadahkan ROV. Kestabilan Pitch didapatkan secara <em className="text-white">pasif</em>. Di parameter Gazebo, keseimbangan ini dicapai dengan memastikan titik <em className="text-white">Center of Buoyancy</em> (pusat gaya apung) diatur lebih tinggi daripada <em className="text-white">Center of Mass/Gravity</em> (titik berat).
                          </p>
                        </div>
                        <div className="mt-4 bg-[#111C2E]/50 border border-[#1E3A8A]/30 p-3 rounded-md font-mono text-xs text-slate-300">
                          <div className="text-[#2563EB] font-bold mb-1 flex items-center gap-2">Persamaan Kinematika:</div>
                          <p>M = 0 (Sumbu pasif, bergantung pada gaya apung & gravitasi)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeKineCard === 4 && (
                  <div className="animate-fade flex flex-col items-center w-full">
                    <div className="space-y-6 w-full max-w-4xl">
                      <h3 className="text-3xl font-bold text-white mb-6 font-heading border-b border-white/10 pb-4 uppercase">3. Sumbu Z (Heave & Yaw)</h3>
                      
                      <div className="bg-[#030914] border border-white/5 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-cyan-400 font-mono font-bold text-lg">Heave (w)</span>
                          <span className="text-[10px] uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-sm">Naik/Turun</span>
                        </div>
                        <p className="text-slate-300 font-light leading-relaxed text-sm font-sans mb-3">
                          Dikontrol oleh <strong className="text-white">Thruster 5 dan 6</strong>. Keduanya akan berputar searah bersamaan untuk mengangkat ROV ke permukaan atau menekannya ke dasar air.
                        </p>
                        <div className="mt-4 bg-[#111C2E]/50 border border-[#1E3A8A]/30 p-3 rounded-md font-mono text-xs text-slate-300">
                          <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2">Persamaan Kinematika:</div>
                          <p>Z = u5 + u6</p>
                        </div>
                      </div>

                      <div className="bg-[#030914] border border-white/5 rounded-lg p-6 shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[#2563EB] font-mono font-bold text-lg">Yaw (r)</span>
                          <span className="text-[10px] uppercase tracking-wider bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/50 px-3 py-1 rounded-sm">Belok Kanan/Kiri</span>
                        </div>
                        <p className="text-slate-300 font-light leading-relaxed text-sm font-sans mb-3">
                          Dikontrol oleh <strong className="text-white">Thruster 1, 2, 3, dan 4</strong>. Sistem akan menciptakan momen putar (torsi) pada sumbu Z. Misalnya, Thruster 1 & 3 mendorong maju, sedangkan Thruster 2 & 4 mendorong mundur, maka badan ROV akan berputar di tempat.
                        </p>
                        <div className="mt-4 bg-[#111C2E]/50 border border-[#1E3A8A]/30 p-3 rounded-md font-mono text-xs text-slate-300">
                          <div className="text-[#2563EB] font-bold mb-1 flex items-center gap-2">Persamaan Kinematika:</div>
                          <p>N = (-u1 + u2 - u3 + u4) · L</p>
                          <p className="text-[10px] text-slate-500 mt-1">*L = jarak lengan torsi thruster dari pusat massa</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SEKSI MEKANISME: 4 CARDS LAYOUT AROUND ROV */}
            <div className="w-full bg-[#050B14] py-20 border-y border-white/5 relative shadow-2xl z-20">
                
                {/* Header Text Tengah */}
                <div className="text-center w-full max-w-4xl mx-auto mb-16 px-6">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 uppercase tracking-wide">
                        Fitur Alokasi <br className="hidden md:block"/> Dirancang Untuk Presisi.
                    </h2>
                    <p className="text-slate-400 font-sans text-base max-w-2xl mx-auto leading-relaxed">
                        Sistem superposisi mendistribusikan tenaga secara cerdas. Ambil kendali atas dinamika, navigasi dengan percaya diri, dan stabilkan manuver dari GCS.
                    </p>
                </div>

                {/* Grid 3 Kolom: Card Kiri - ROV Tengah - Card Kanan */}
                <div className="relative w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-center px-6 lg:px-12">
                    
                    {/* Kolom Kiri: Sumbu X & Sumbu Z */}
                    <div className="flex flex-col gap-6 order-2 lg:order-1">
                        
                        {/* Card: Sumbu X */}
                        <div className="bg-[#0A111C] border border-white/5 p-6 rounded-xl shadow-lg hover:border-cyan-500/50 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#111C2E] flex items-center justify-center text-cyan-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white font-heading uppercase">1. SUMBU X</h3>
                                    <span className="text-slate-500 text-xs font-sans">(Surge & Roll)</span>
                                </div>
                            </div>
                            <div className="space-y-3 font-sans text-[13px] text-slate-400 font-light leading-relaxed">
                                <p><strong className="text-cyan-400">Surge (Maju/Mundur):</strong> T1, T2, T3, & T4 berputar bersamaan untuk dorongan maju/mundur.</p>
                                <p><strong className="text-cyan-400">Roll (Miring):</strong> T5 & T6 bekerja diferensial (berlawanan) untuk menggulingkan ROV.</p>
                            </div>
                        </div>

                        {/* Card: Sumbu Z */}
                        <div className="bg-[#0A111C] border border-white/5 p-6 rounded-xl shadow-lg hover:border-cyan-500/50 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#111C2E] flex items-center justify-center text-cyan-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white font-heading uppercase">3. SUMBU Z</h3>
                                    <span className="text-slate-500 text-xs font-sans">(Heave & Yaw)</span>
                                </div>
                            </div>
                            <div className="space-y-3 font-sans text-[13px] text-slate-400 font-light leading-relaxed">
                                <p><strong className="text-cyan-400">Heave (Naik/Turun):</strong> T5 & T6 berputar searah untuk mengangkat atau menekan ROV.</p>
                                <p><strong className="text-cyan-400">Yaw (Belok):</strong> T1, T2, T3, & T4 menciptakan torsi saat sisi berlawanan mendorong beda arah.</p>
                            </div>
                        </div>

                    </div>

                    {/* Kolom Tengah: ROV Image */}
                    <div className="order-1 lg:order-2 flex justify-center items-center relative z-10 py-6 lg:py-0">
                        <div className="absolute inset-0 bg-[#00D2FF] opacity-10 blur-[100px] rounded-full"></div>
                        <img 
                            src={rovModelImg} 
                            alt="ROV 3D Model" 
                            className="w-full max-w-sm lg:max-w-md xl:max-w-lg h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10 hover:scale-105 transition-transform duration-700" 
                        />
                    </div>

                    {/* Kolom Kanan: Sumbu Y & Superposisi */}
                    <div className="flex flex-col gap-6 order-3 lg:order-3">
                        
                        {/* Card: Sumbu Y */}
                        <div className="bg-[#0A111C] border border-white/5 p-6 rounded-xl shadow-lg hover:border-[#60A5FA]/50 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#111C2E] flex items-center justify-center text-[#60A5FA]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white font-heading uppercase">2. SUMBU Y</h3>
                                    <span className="text-slate-500 text-xs font-sans">(Sway & Pitch)</span>
                                </div>
                            </div>
                            <div className="space-y-3 font-sans text-[13px] text-slate-400 font-light leading-relaxed">
                                <p><strong className="text-[#60A5FA]">Sway (Geser):</strong> T1, T2, T3, & T4 bermanuver menyilang (vectored) untuk geser ke samping.</p>
                                <p><strong className="text-[#60A5FA]">Pitch (Tengadah):</strong> Kestabilan dicapai pasif (underactuated) dengan mengatur Center of Buoyancy di atas Center of Mass.</p>
                            </div>
                        </div>

                        {/* Card: Superposisi */}
                        <div className="bg-[#0A111C] border border-white/5 p-6 rounded-xl shadow-lg hover:border-[#60A5FA]/50 transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#111C2E] flex items-center justify-center text-[#60A5FA]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white font-heading uppercase">4. SUPERPOSISI</h3>
                                    <span className="text-slate-500 text-xs font-sans">(Gabungan)</span>
                                </div>
                            </div>
                            <div className="space-y-3 font-sans text-[13px] text-slate-400 font-light leading-relaxed">
                                <p><strong className="text-[#60A5FA]">Dorongan Seimbang:</strong> Gaya menyamping (Fy) saling membatalkan, menyisakan dorongan lurus (Fx).</p>
                                <p><strong className="text-[#60A5FA]">Manuver Pintar:</strong> Sistem otomatis menjumlahkan porsi tenaga (misal: maju + belok) secara proporsional.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* NEW SECTION: INTERACTIVE WIDGET */}
            <div className="w-full bg-[#030914] py-20 px-6 lg:px-12 relative z-10 border-t border-white/5 shadow-2xl">
              <div className="max-w-5xl mx-auto flex flex-col items-center">
                
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 uppercase tracking-wide">Interactive Thruster Matrix</h2>
                  <p className="text-slate-400 font-sans text-sm md:text-base">Klik tombol perintah di bawah untuk melihat simulasi visual arah dorongan thruster pada ROV.</p>
                </div>

                <div className="w-full bg-[#0A111C] border border-[#1E3A8A]/30 rounded-2xl p-8 flex flex-col items-center gap-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                  
                  {/* Status Text Display */}
                  <div className="bg-[#030914] border border-white/10 rounded-lg px-6 py-3 min-w-[300px] text-center shadow-inner">
                    <span className="text-cyan-400 font-mono text-sm">{thrusterData.description}</span>
                  </div>

                  {/* 2D Visualizer Area */}
                  <div className="relative w-64 h-80 bg-[#111C2E]/50 border border-[#1E3A8A]/50 rounded-xl flex items-center justify-center">
                    {/* Inner ROV Frame Box */}
                    <div className="w-24 h-48 border-2 border-slate-600 bg-[#030914] rounded-sm relative z-10 flex flex-col items-center justify-center gap-4">
                      {/* Vertical Thrusters (T5 & T6) */}
                      <div className="w-8 h-8 rounded-full border-2 border-slate-500 bg-[#0A111C] flex items-center justify-center relative">
                        <span className="text-[10px] text-slate-400 font-mono">T5</span>
                        <ThrusterArrow val={thrusterData.t5} angle={-90} /> {/* Up */}
                        {thrusterData.t5 < 0 && <ThrusterArrow val={thrusterData.t5 * -1} angle={90} />} {/* Down if negative (Heave down) */}
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-slate-500 bg-[#0A111C] flex items-center justify-center relative">
                        <span className="text-[10px] text-slate-400 font-mono">T6</span>
                        <ThrusterArrow val={thrusterData.t6} angle={-90} /> {/* Up */}
                        {thrusterData.t6 < 0 && <ThrusterArrow val={thrusterData.t6 * -1} angle={90} />} {/* Down if negative */}
                      </div>
                      {/* FRONT Direction Indicator */}
                      <div className="absolute -top-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Front</div>
                    </div>

                    {/* Vectored Thrusters T1 (Front Left) */}
                    <div className="absolute top-10 -left-6 w-10 h-10 rounded-md border-2 border-slate-600 bg-[#0A111C] transform rotate-45 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-mono transform -rotate-45">T1</span>
                      <ThrusterArrow val={thrusterData.t1} angle={-135} />
                    </div>
                    {/* Vectored Thrusters T2 (Front Right) */}
                    <div className="absolute top-10 -right-6 w-10 h-10 rounded-md border-2 border-slate-600 bg-[#0A111C] transform -rotate-45 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-mono transform rotate-45">T2</span>
                      <ThrusterArrow val={thrusterData.t2} angle={-45} />
                    </div>
                    {/* Vectored Thrusters T3 (Back Left) */}
                    <div className="absolute bottom-10 -left-6 w-10 h-10 rounded-md border-2 border-slate-600 bg-[#0A111C] transform -rotate-45 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-mono transform rotate-45">T3</span>
                      <ThrusterArrow val={thrusterData.t3} angle={135} />
                    </div>
                    {/* Vectored Thrusters T4 (Back Right) */}
                    <div className="absolute bottom-10 -right-6 w-10 h-10 rounded-md border-2 border-slate-600 bg-[#0A111C] transform rotate-45 flex items-center justify-center">
                      <span className="text-[10px] text-slate-400 font-mono transform -rotate-45">T4</span>
                      <ThrusterArrow val={thrusterData.t4} angle={45} />
                    </div>
                  </div>

                  {/* Control Buttons Grid */}
                  <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-3 relative z-20">
                    <button onMouseEnter={() => setActiveMove('surge_fwd')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Surge Forward</button>
                    <button onMouseEnter={() => setActiveMove('surge_bwd')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Surge Backward</button>
                    <button onMouseEnter={() => setActiveMove('sway_right')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Sway Right</button>
                    <button onMouseEnter={() => setActiveMove('sway_left')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-400 text-slate-300 hover:text-cyan-400 py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Sway Left</button>
                    
                    <button onMouseEnter={() => setActiveMove('yaw_right')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-blue-500/20 border border-white/5 hover:border-[#2563EB] text-slate-300 hover:text-[#60A5FA] py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Yaw Right</button>
                    <button onMouseEnter={() => setActiveMove('yaw_left')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-blue-500/20 border border-white/5 hover:border-[#2563EB] text-slate-300 hover:text-[#60A5FA] py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Yaw Left</button>
                    <button onMouseEnter={() => setActiveMove('heave_up')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-blue-500/20 border border-white/5 hover:border-[#2563EB] text-slate-300 hover:text-[#60A5FA] py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Heave Up</button>
                    <button onMouseEnter={() => setActiveMove('heave_down')} onMouseLeave={() => setActiveMove('idle')} className="bg-[#111C2E] hover:bg-blue-500/20 border border-white/5 hover:border-[#2563EB] text-slate-300 hover:text-[#60A5FA] py-2.5 rounded-lg text-xs font-bold font-sans uppercase transition-all">Heave Down</button>
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