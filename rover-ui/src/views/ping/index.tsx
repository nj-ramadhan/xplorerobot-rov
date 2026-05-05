import React, { useState } from 'react';
import { Radio, Eye, Settings2, Info, Activity, RefreshCw, CheckCircle } from 'lucide-react'; // Tambah RefreshCw & CheckCircle

interface PingSonarProps {
  isDarkMode?: boolean;
  onRefresh?: () => void; // Tambah prop onRefresh
}

// PERBAIKAN: Default diubah jadi true agar sinkron saat web pertama dibuka di Dashboad
const PingSonarView: React.FC<PingSonarProps> = ({ isDarkMode = true, onRefresh }) => {
  const [mavlinkEnabled, setMavlinkEnabled] = useState(true);
  
  // STATE UNTUK NOTIFIKASI SUKSES (KANAN BAWAH)
  const [showToast, setShowToast] = useState(false);

  // FUNGSI HANDLE REFRESH (NATIVE CONFIRM + CUSTOM TOAST SUKSES)
  const handleRefresh = () => {
    // 1. Munculin konfirmasi bawaan browser dari atas
    const isConfirmed = window.confirm("Apakah Anda yakin ingin me-refresh perangkat Ping Sonar?");
    
    // 2. Kalau di-klik "OK"
    if (isConfirmed) {
      if (onRefresh) onRefresh();
      
      // Munculin notifikasi toast di kanan bawah
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  // ==========================================
  // LOGIKA TEMA: OTOMATIS MENYESUAIKAN DARK/LIGHT MODE
  // ==========================================
  
  // Warna Teks
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-950'; 
  const subTextColor = isDarkMode ? 'text-slate-300' : 'text-slate-700'; 
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600'; 
  const valueColor = isDarkMode ? 'text-white' : 'text-slate-900'; 

  // ==========================================
  // LOGIKA LATAR BELAKANG (PERBAIKAN UTAMA)
  // ==========================================
  
  // 1. Kartu Utama (Ping1D & Ping360)
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-2xl' 
    : 'bg-white border-slate-200 shadow-xl'; 
    
  // 2. Kotak Info Biru di Atas
  const infoBg = isDarkMode 
    ? 'bg-[#111827]/40 border-white/5 backdrop-blur-xl shadow-lg' 
    : 'bg-blue-50 border-blue-200 shadow-sm'; 
    
  // 3. Bagian Header Kartu (Yang ada logo bulat)
  const cardHeaderBg = isDarkMode 
    ? 'border-white/10 bg-white/5' 
    : 'border-slate-200 bg-slate-50'; 
    
  // 4. Kotak Data Kecil (FW Version, ID)
  const innerBoxBg = isDarkMode 
    ? 'bg-black/40 border-white/10' 
    : 'bg-slate-100 border-slate-200 shadow-inner'; 
    
  // 5. Kotak Interaktif (System Port)
  const interactiveBoxBg = isDarkMode 
    ? 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/30 text-blue-400' 
    : 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700 shadow-sm';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2 font-['Inter',sans-serif] antialiased relative">
      <div className="max-w-6xl mx-auto w-full">

        {/* =========================================
            HEADER (DITAMBAH TOMBOL REFRESH)
            ========================================= */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Radio size={32} className="text-white" />
            </div>
            <div>
              <h1 className={`font-heading text-3xl md:text-4xl font-black tracking-tight uppercase transition-colors duration-300 ${titleColor}`}>
                Ping Sonar Devices
              </h1>
              <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Manage detected Ping family sonar devices
              </p>
            </div>
          </div>

          {/* Tombol Refresh */}
          <button 
            onClick={handleRefresh}
            className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
              isDarkMode 
                ? 'bg-[#111827]/70 border-white/10 text-slate-400 hover:text-white hover:border-white/30' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
            title="Refresh Sonar Devices"
          >
            <RefreshCw size={24} className={`transition-transform duration-500 ${showToast ? 'animate-spin text-blue-500' : 'hover:rotate-180'}`} />
          </button>
        </div>

        {/* INFO SECTION */}
        <div className={`border rounded-2xl p-6 mb-10 w-full transition-colors duration-300 ${infoBg}`}>
          <div className="flex gap-4">
            <div className={`p-2 rounded-lg h-fit border shrink-0 ${isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-200'}`}>
              <Info className={isDarkMode ? 'text-blue-400' : 'text-blue-700'} size={20} />
            </div>
            <div className="space-y-3">
              <p className={`text-sm leading-relaxed font-medium transition-colors duration-300 ${subTextColor}`}>
                The Ping Sonar Devices page shows any detected sonars from the Ping family,
                including ethernet-configured Ping360s visible on the local network.
              </p>
              <div className={`flex items-center flex-wrap gap-4 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors duration-300 ${labelColor}`}>
                <span>Based On: <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} underline cursor-pointer font-black`}>Ping Service</span></span>
                <span className="hidden sm:inline">|</span>
                <span>Port: 9110</span>
                <span className={`${isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-300'} px-2 py-0.5 rounded border font-black`}>New in 1.1</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">

          {/* CARD PING1D */}
          <div className={`border rounded-3xl overflow-hidden transition-all duration-300 group ${cardBg}`}>
            <div className={`p-8 flex flex-col items-center border-b transition-colors duration-300 ${cardHeaderBg}`}>
               <div className={`p-4 rounded-full mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Radio className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`} />
               </div>
               <h2 className={`font-heading text-2xl font-black tracking-tighter uppercase transition-colors duration-300 ${titleColor}`}>Ping1D</h2>
               <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full mt-2 animate-pulse ${isDarkMode ? 'text-emerald-400 bg-emerald-500/20 border border-emerald-500/30' : 'text-emerald-900 bg-emerald-100 border border-emerald-300'}`}>Connected</span>
            </div>

            <div className="p-6 space-y-4">
              <div className={`flex justify-between items-center text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${labelColor}`}>
                <span>Bridge</span> <span className={`font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>UDP 9090</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors duration-300 ${labelColor}`}>MAVLink Distances</span>
                <button
                  onClick={() => setMavlinkEnabled(!mavlinkEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${mavlinkEnabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-300')}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${mavlinkEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className={`p-3 rounded-xl border transition-colors duration-300 ${innerBoxBg}`}>
                  <p className={`text-[9px] uppercase font-bold mb-1 transition-colors duration-300 ${labelColor}`}>FW Version</p>
                  <p className={`font-mono font-bold transition-colors duration-300 ${valueColor}`}>3.29.0</p>
                </div>
                <div className={`p-3 rounded-xl border transition-colors duration-300 ${innerBoxBg}`}>
                  <p className={`text-[9px] uppercase font-bold mb-1 transition-colors duration-300 ${labelColor}`}>Device ID</p>
                  <p className={`font-mono font-bold transition-colors duration-300 ${valueColor}`}>1</p>
                </div>
              </div>

              <div className={`flex justify-between items-center p-4 rounded-2xl border transition-colors duration-300 ${interactiveBoxBg}`}>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-black tracking-tighter">System Port</span>
                  <span className={`font-mono text-xs font-bold transition-colors duration-300 ${valueColor}`}>/dev/ttyUSB0</span>
                </div>
                <Eye className="w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* CARD PING*/}
          <div className={`border rounded-3xl overflow-hidden transition-all duration-300 group ${cardBg}`}>
            <div className={`p-8 flex flex-col items-center border-b transition-colors duration-300 ${cardHeaderBg}`}>
               <div className={`p-4 rounded-full mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Settings2 className={`w-10 h-10 rotate-90 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`} />
               </div>
               <h2 className={`font-heading text-2xl font-black tracking-tighter uppercase transition-colors duration-300 ${titleColor}`}>Ping360</h2>
               <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full mt-2 italic border transition-colors duration-300 ${
                 isDarkMode ? 'text-slate-400 bg-white/10 border-white/10' : 'text-slate-600 bg-slate-100 border-slate-300'
               }`}>Scanning...</span>
            </div>
            <div className="p-6">
              <p className={`text-[10px] uppercase font-bold mb-2 tracking-widest transition-colors duration-300 ${labelColor}`}>Network Interface</p>
              <div className={`font-mono font-bold text-sm p-4 rounded-2xl border flex justify-between items-center transition-colors duration-300 ${interactiveBoxBg}`}>
                <span>192.168.2.4:12345</span>
                <Activity size={16} className="animate-pulse" />
              </div>
            </div>
          </div>

        </div>

        {/* ================= TOAST NOTIFIKASI SUKSES (BAWAH KANAN) ================= */}
        {showToast && (
          <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-8 fade-in duration-300 ${
            isDarkMode ? 'bg-[#111827] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <CheckCircle size={20} className="text-green-500" />
            <div className="flex flex-col">
              <span className="text-sm font-bold">Refresh Successful</span>
              <span className={`text-[10px] uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Sonar devices updated</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PingSonarView;