import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  Activity, 
  Wifi, 
  CheckCircle2, 
  Navigation, 
  Radio, 
  Gamepad2,
  Compass,
  Server,
  Crosshair
} from 'lucide-react';

const System: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0b111a] min-h-screen text-slate-300 font-sans antialiased selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
      
      {/* NAVBAR: Bersih, hanya tombol Back, Judul, dan Launch GCS */}
      <nav className="border-b border-white/5 px-6 py-4 bg-[#060b19]/90 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between">
        
        {/* Kiri: Back Button & Judul */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">System Exploration</h1>
            <p className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest mt-0.5">
              Core Capabilities & Arch
            </p>
          </div>
        </div>

        {/* Kanan: Launch Button */}
        <button 
          onClick={() => navigate('/home')} 
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
        >
          Launch GCS
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pb-32">
        
        {/* HERO SECTION */}
        <div className="py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Bagian Kiri: Teks & Tombol */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-[44px] font-bold text-white leading-[1.2] tracking-tight">
              Eksplorasi Mendalam <br />
              <span className="text-blue-400">Arsitektur Xplore ROV</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Kinerja presisi di bawah air tidak terjadi secara kebetulan. 
              Sistem ini dibangun atas integrasi kontrol otonom, telemetri real-time, dan respon latensi rendah.
            </p>
            
            {/* Action Buttons: Sisa 1 Tombol Dokumentasi */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => navigate('/documentasi')}
                className="px-8 py-3.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
              >
                Dokumentasi
              </button>
            </div>
          </div>

          {/* Bagian Kanan: Overlapping Visuals */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] flex items-center justify-center">
            
            {/* Visual Box Belakang */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#0f172a] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden shadow-sm">
               <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <Wifi size={80} className="text-slate-700/50" />
            </div>

            {/* Visual Box Depan */}
            <div className="absolute left-8 bottom-4 w-56 h-56 bg-[#0f172a] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden shadow-2xl">
               <Activity size={80} className="text-blue-500/80" />
            </div>

            {/* Floating Card Atas */}
            <div className="absolute top-12 right-48 bg-[#1e293b] p-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white">System Status</p>
                <p className="text-[10px] text-slate-400">All diagnostics nominal</p>
              </div>
            </div>

            {/* Floating Card Bawah */}
            <div className="absolute bottom-16 left-0 bg-[#1e293b] p-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                <Radio size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white">Telemetri Link</p>
                <p className="text-[10px] text-slate-400">Koneksi stabil di 98%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CAPABILITIES SECTION (3 Kolom Berjajar) */}
        {/* ---------------------------------------------------- */}
        <div id="capabilities" className="py-16 border-y border-white/5 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            <div className="space-y-4 lg:pr-8 relative">
              <span className="text-5xl font-black text-slate-800/40 absolute -top-6 -left-2 z-0 pointer-events-none">01</span>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <Navigation size={18} className="text-blue-500" /> Autonomous Mode
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Dilengkapi algoritma <span className="font-semibold text-blue-300">path-planning</span> canggih. Operator menentukan titik misi, dan sistem mengkalkulasi rute paling efisien secara otomatis.
                </p>
              </div>
            </div>

            <div className="space-y-4 lg:px-8 md:border-l border-white/5 relative">
              <span className="text-5xl font-black text-slate-800/40 absolute -top-6 left-6 z-0 pointer-events-none">02</span>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <Radio size={18} className="text-blue-500" /> MAVLink Protocol
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tulang punggung komunikasi berlatensi rendah. Mengirimkan data telemetri real-time antara ROV di bawah air dan antarmuka web Ground Station.
                </p>
              </div>
            </div>

            <div className="space-y-4 lg:pl-8 md:border-l border-white/5 relative">
              <span className="text-5xl font-black text-slate-800/40 absolute -top-6 left-6 z-0 pointer-events-none">03</span>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <Gamepad2 size={18} className="text-blue-500" /> Manual Control
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Kendali penuh melalui input <span className="font-semibold text-blue-300">keyboard & gamepad</span> untuk manuver observasi yang membutuhkan tingkat presisi tinggi di ruang sempit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* DETAILED ARCHITECTURE SECTION (SCROLL ZIG-ZAG) */}
        {/* ---------------------------------------------------- */}
        <div id="architecture" className="pt-8">
          <div className="text-center mb-24">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Arsitektur Sistem Internal</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Membedah tiga pilar utama yang menjaga Xplore ROV tetap stabil, responsif, dan presisi di lingkungan bawah air yang dinamis.
            </p>
          </div>

          <div className="space-y-32">
            
            {/* SISTEM 1: Navigasi */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 aspect-square max-h-[350px] bg-gradient-to-br from-[#111827] to-[#0b111a] rounded-3xl border border-white/10 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 animate-[spin_60s_linear_infinite]"></div>
                <Compass size={100} strokeWidth={1} className="text-blue-400 relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
                  Pilar 01
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Navigasi Presisi & Estimasi State</h3>
                <div className="space-y-4 text-slate-400 leading-relaxed text-[15px]">
                  <p>
                    Sistem navigasi Xplore ROV menggunakan kontroler PID (<span className="italic text-slate-300">Proportional-Integral-Derivative</span>) berlapis untuk menjaga kestabilan posisi (<span className="italic text-slate-300">station keeping</span>) dan arah (<span className="italic text-slate-300">heading</span>) di tengah arus air.
                  </p>
                  <p>
                    Karena sinyal GPS tidak dapat menembus air, navigasi mengandalkan algoritma <span className="text-slate-200 font-semibold">Extended Kalman Filter (EKF)</span> untuk melakukan fusi data sensor. Sistem menggabungkan data orientasi dari IMU dan kecepatan translasi dari DVL (<span className="italic text-slate-300">Doppler Velocity Log</span>).
                  </p>
                  <p>
                    Hasil komputasi ini menghasilkan estimasi pergerakan spasial yang akurat, terintegrasi dengan penghindaran rintangan dinamis melalui input Ping Sonar.
                  </p>
                </div>
              </div>
            </div>

            {/* SISTEM 2: Telemetri */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 aspect-square max-h-[350px] bg-gradient-to-bl from-[#111827] to-[#0b111a] rounded-3xl border border-white/10 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-full h-1/2 border-y border-cyan-500/20 absolute top-1/4 animate-pulse"></div>
                <Server size={100} strokeWidth={1} className="text-cyan-400 relative z-10 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                  Pilar 02
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Aliran Telemetri & Jaringan</h3>
                <div className="space-y-4 text-slate-400 leading-relaxed text-[15px]">
                  <p>
                    Tulang punggung komunikasi antara wahana dan <span className="italic text-slate-300">Ground Control Station</span> menggunakan protokol MAVLink yang dioptimalkan untuk pengiriman data serial dengan latensi sangat rendah.
                  </p>
                  <p>
                    Pesan sensorik (kedalaman, suhu, baterai) dienkode menjadi paket byte ringan dan dikirim melalui koneksi <span className="text-slate-200 font-semibold">Tether UDP/TCP</span> dari *Companion Computer*.
                  </p>
                  <p>
                    Backend pada Ground Station bertindak sebagai jembatan *router*, menerjemahkan paket MAVLink menjadi aliran data WebSocket berkecepatan tinggi. Arsitektur ini merender perubahan data instrumentasi secara *real-time* di bawah ambang batas reaksi manusia (kurang dari 20ms).
                  </p>
                </div>
              </div>
            </div>

            {/* SISTEM 3: Kontrol */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full md:w-1/2 aspect-square max-h-[350px] bg-gradient-to-tr from-[#111827] to-[#0b111a] rounded-3xl border border-white/10 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute w-32 h-32 border border-emerald-500/30 rounded-full animate-ping"></div>
                <Crosshair size={100} strokeWidth={1} className="text-emerald-400 relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]" />
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  Pilar 03
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Pemetaan Kontrol & Kinematika</h3>
                <div className="space-y-4 text-slate-400 leading-relaxed text-[15px]">
                  <p>
                    Input manual dari operator dibaca langsung oleh *browser* melalui Gamepad API. Koordinat input analog difilter secara ketat menggunakan sistem <span className="italic text-slate-300">deadzone</span> dinamis untuk mencegah *drift* mekanis tak disengaja.
                  </p>
                  <p>
                    Pergerakan ROV membutuhkan perhitungan kompleks untuk bermanuver dalam <span className="text-slate-200 font-semibold">6-Degrees of Freedom (6-DOF)</span>: Surge, Sway, Heave, Roll, Pitch, dan Yaw.
                  </p>
                  <p>
                    Sistem mengandalkan kalkulasi <span className="text-slate-200 font-semibold">Thruster Allocation Matrix (TAM)</span> untuk menerjemahkan satu perintah gerakan joystick menjadi distribusi sinyal PWM yang terkalibrasi proporsional ke beberapa motor pendorong sekaligus.
                  </p>
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