import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MonitorPlay, Terminal, Image as ImageIcon, 
  CheckCircle2, Settings, DownloadCloud, Box, Flag,
  Cpu, Activity, Navigation, mousePointer as Mouse, 
  Gamepad2, Layers, Map as MapIcon, Link as LinkIcon
} from 'lucide-react';

const Documentasi: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0b111a] min-h-screen text-slate-300 font-sans antialiased selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/5 px-6 py-4 bg-[#060b19]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Dokumentasi Sistem</h1>
            <p className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest mt-0.5">
              Knowledge Base & Guides
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/home')} 
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
        >
          Launch GCS
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-32">
        
        {/* HERO / INTRO */}
        <div className="py-16 text-center border-b border-white/5 mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Pusat <span className="text-blue-400">Pengetahuan</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Panduan lengkap operasional sistem Xplore ROV, mulai dari simulasi manual hingga navigasi otonom berbasis ROS 2.
          </p>

          {/* Quick Jump Menu */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Manual Sim', icon: Cpu, id: 'manual-doc' },
              { label: 'ROS 2 Sim', icon: Activity, id: 'ros2-doc' },
              { label: 'Autonomous', icon: Navigation, id: 'auto-doc' },
              { label: 'Install Roadmap', icon: Flag, id: 'roadmap-doc' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#111827] border border-white/5 rounded-full text-xs font-bold hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
              >
                <item.icon size={14} className="text-blue-400" /> {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: MANUAL SIMULATION (MAVLINK_CORE) */}
        {/* ========================================================= */}
        <section id="manual-doc" className="mb-32 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Cpu className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Manual Simulation Guide</h3>
              <p className="text-xs text-slate-500 font-mono">MAVLINK_CORE | ARDUSUB SITL</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-sm leading-relaxed">
                Mode ini menggunakan <span className="text-blue-400 font-semibold">ArduSub SITL (Software In The Loop)</span> untuk mensimulasikan kontrol wahana tanpa hardware fisik.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Gamepad2, title: 'Joystick Control', text: 'Gunakan Gamepad standar untuk mengontrol Surge, Sway, dan Heave.' },
                  { icon: Terminal, title: 'MAVProxy Link', text: 'Koneksi serial di-bridge melalui UDP port 14550.' },
                  { icon: Mouse, title: 'Stabilize Mode', text: 'Menjaga orientasi wahana tetap datar secara otomatis.' },
                ].map((feature, idx) => (
                  <li key={idx} className="flex gap-4 p-4 bg-[#111827] rounded-2xl border border-white/5">
                    <feature.icon className="text-blue-400 shrink-0" size={20} />
                    <div>
                      <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                      <p className="text-xs text-slate-400">{feature.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-square bg-[#0f172a] rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
               <div className="text-center p-8">
                 <ImageIcon className="text-slate-700 mx-auto mb-4" size={64} />
                 <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Screenshot SITL Interface</p>
               </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: ROS 2 SIMULATION (GAZEBO) */}
        {/* ========================================================= */}
        <section id="ros2-doc" className="mb-32 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">ROS 2 Simulation Guide</h3>
              <p className="text-xs text-slate-500 font-mono">ROS2_GAZEBO | HARMONIC</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center md:flex-row-reverse">
            <div className="md:order-2 space-y-6">
              <p className="text-sm leading-relaxed">
                Eksperimen kontrol thruster langsung dalam lingkungan fisik Gazebo menggunakan <span className="text-indigo-400 font-semibold">ROS 2 Jazzy</span>.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Layers, title: 'Thruster Matrix', text: 'Pemetaan gaya (Newton) langsung ke tiap motor simulasi.' },
                  { icon: Box, title: 'Gazebo Physics', text: 'Mensimulasikan gaya apung (buoyancy) dan drag air.' },
                  { icon: LinkIcon, title: 'Topic Bridge', text: 'Sinkronisasi data sensor antara Gazebo dan ROS 2.' },
                ].map((feature, idx) => (
                  <li key={idx} className="flex gap-4 p-4 bg-[#111827] rounded-2xl border border-white/5">
                    <feature.icon className="text-indigo-400 shrink-0" size={20} />
                    <div>
                      <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                      <p className="text-xs text-slate-400">{feature.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:order-1 aspect-square bg-[#0f172a] rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
               <div className="text-center p-8">
                 <ImageIcon className="text-slate-700 mx-auto mb-4" size={64} />
                 <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Screenshot Gazebo Environment</p>
               </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: AUTONOMOUS MODE */}
        {/* ========================================================= */}
        <section id="auto-doc" className="mb-32 scroll-mt-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Navigation className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Autonomous Mode Guide</h3>
              <p className="text-xs text-slate-500 font-mono">TACTICAL_NAV | POINT & GO</p>
            </div>
          </div>

          <div className="bg-[#111827] rounded-3xl border border-white/5 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <p className="text-sm leading-relaxed">
                  Navigasi otonom cerdas menggunakan <span className="text-cyan-400 font-semibold">Point & Go</span>. Tentukan target pada peta digital, dan sistem akan mengarahkan ROV secara presisi.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0b111a] rounded-xl border border-white/5">
                    <MapIcon className="text-cyan-400 mb-2" size={18} />
                    <h5 className="text-white text-xs font-bold mb-1">Waypoints Mission</h5>
                    <p className="text-[11px] text-slate-400">Antrian titik koordinat untuk misi observasi otomatis.</p>
                  </div>
                  <div className="p-4 bg-[#0b111a] rounded-xl border border-white/5">
                    <Crosshair className="text-cyan-400 mb-2" size={18} />
                    <h5 className="text-white text-xs font-bold mb-1">Precision Holding</h5>
                    <p className="text-[11px] text-slate-400">Menjaga posisi di satu titik target dengan fusi sensor EKF.</p>
                  </div>
                </div>
              </div>
              <div className="aspect-video lg:aspect-auto bg-[#0b111a] rounded-2xl border border-white/5 flex items-center justify-center">
                <ImageIcon className="text-slate-800" size={48} />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: ROADMAP INSTALASI (Tetap Pertahankan Snake Model) */}
        {/* ========================================================= */}
        <section id="roadmap-doc" className="scroll-mt-24">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-mono text-sm font-bold tracking-widest uppercase mb-3 block">Roadmap Pembelajaran</span>
            <h3 className="text-3xl md:text-4xl font-bold text-white">Setup Environment: ROS 2 & Gazebo</h3>
          </div>

          <div className="relative pl-8 md:pl-16 py-6 max-w-4xl mx-auto">
            <div className="absolute left-[29px] md:left-[61px] top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 via-cyan-400 to-emerald-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>

            {/* START */}
            <div className="relative mb-16 -ml-12 md:-ml-16">
              <span className="bg-[#facc15] text-[#422006] px-6 py-2 rounded-full font-black tracking-widest uppercase shadow-[0_0_20px_rgba(250,204,21,0.3)] relative z-10 flex items-center w-fit gap-2">
                <Flag size={16} /> START
              </span>
            </div>

            {/* LANGKAH 1 */}
            <div className="relative mb-16 group">
              <div className="absolute -left-[45px] md:-left-[53px] top-6 w-10 h-10 bg-[#060b19] border-4 border-blue-500 rounded-full z-10 flex items-center justify-center">
                <Settings size={16} className="text-blue-400" />
              </div>
              <div className="bg-[#111827] rounded-3xl border border-white/5 p-6 lg:p-8 ml-4 shadow-xl">
                <span className="text-blue-400 font-bold font-mono text-[10px] tracking-widest uppercase block mb-1">Langkah 1</span>
                <h4 className="text-xl font-bold text-white">Ubuntu Environment</h4>
                <p className="text-sm text-slate-400 mt-2 mb-4">Konfigurasi locale dan repositori Ubuntu 24.04.</p>
                <div className="bg-[#060b19] rounded-xl border border-white/5 p-4 font-mono text-xs text-emerald-400 whitespace-pre overflow-x-auto">
                  {"sudo apt update && sudo apt install locales\n"}
                  {"sudo locale-gen en_US en_US.UTF-8\n"}
                  {"sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8"}
                </div>
              </div>
            </div>

            {/* LANGKAH 2 */}
            <div className="relative mb-16 group">
              <div className="absolute -left-[45px] md:-left-[53px] top-6 w-10 h-10 bg-[#060b19] border-4 border-cyan-400 rounded-full z-10 flex items-center justify-center">
                <DownloadCloud size={16} className="text-cyan-400" />
              </div>
              <div className="bg-[#111827] rounded-3xl border border-white/5 p-6 lg:p-8 ml-4 shadow-xl">
                <span className="text-cyan-400 font-bold font-mono text-[10px] tracking-widest uppercase block mb-1">Langkah 2</span>
                <h4 className="text-xl font-bold text-white">ROS 2 Jazzy Core</h4>
                <p className="text-sm text-slate-400 mt-2 mb-4">Instalasi suite desktop ROS 2 Jazzy Jalisco.</p>
                <div className="bg-[#060b19] rounded-xl border border-white/5 p-4 font-mono text-xs text-emerald-400 whitespace-pre overflow-x-auto">
                  {"sudo apt update\n"}
                  {"sudo apt install ros-jazzy-desktop\n"}
                  {"source /opt/ros/jazzy/setup.bash"}
                </div>
              </div>
            </div>

            {/* LANGKAH 3 */}
            <div className="relative mb-16 group">
              <div className="absolute -left-[45px] md:-left-[53px] top-6 w-10 h-10 bg-[#060b19] border-4 border-emerald-500 rounded-full z-10 flex items-center justify-center">
                <Box size={16} className="text-emerald-400" />
              </div>
              <div className="bg-[#111827] rounded-3xl border border-white/5 p-6 lg:p-8 ml-4 shadow-xl">
                <span className="text-emerald-500 font-bold font-mono text-[10px] tracking-widest uppercase block mb-1">Langkah 3</span>
                <h4 className="text-xl font-bold text-white">Gazebo Harmonic</h4>
                <p className="text-sm text-slate-400 mt-2 mb-4">Instalasi simulator fisik dan jembatan ROS-GZ.</p>
                <div className="bg-[#060b19] rounded-xl border border-white/5 p-4 font-mono text-xs text-emerald-400 whitespace-pre overflow-x-auto">
                  {"sudo apt install ros-jazzy-ros-gz\n"}
                  {"# Test installation\n"}
                  {"gz sim"}
                </div>
              </div>
            </div>

            {/* FINISH */}
            <div className="relative mt-8">
              <div className="absolute -left-[45px] md:-left-[53px] top-6 w-10 h-10 bg-gradient-to-br from-[#facc15] to-[#ca8a04] rounded-full z-10 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-[#422006]" />
              </div>
              <div className="ml-4">
                <div className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-3xl border border-yellow-500/20 p-8">
                  <span className="bg-[#facc15] text-[#422006] px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase mb-4 inline-block">FINISH</span>
                  <h4 className="text-xl font-bold text-white">Setup Complete!</h4>
                  <p className="text-sm text-slate-400">Environment simulasi siap digunakan untuk pengembangan wahana Xplore ROV.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Documentasi;