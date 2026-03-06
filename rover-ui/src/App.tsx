import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import { Sidebar } from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';

// Import Types
import { TelemetryData } from './types/telemetry';

// Import Views Simulation
import Simulation from './views/simulation';

import VehicleSetup from './views/VehicleSetup/index';

import { SystemInformation } from './views/SystemInformation';

import  BlueOSVersion  from './views/BlueOSVersion'; // Import halaman baru
function App() {
  // State untuk Mode Siang/Malam
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State untuk data telemetri ROV
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0,
    heading: 0,
    voltage: 14.8,
    status: 'CONNECTED',
    mode: 'STABILIZE',
    pitch: 0,
    roll: 0
  });

  // Efek simulasi data sensor agar dashboard terlihat hidup
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        // Simulasi kedalaman air (m)
        depth: +(12.5 + Math.random() * 0.4 - 0.2).toFixed(2),
        // Simulasi kompas/heading (0-359 derajat)
        heading: (prev.heading + 1) % 360,
        // Simulasi voltase baterai PDU ROV
        voltage: +(14.5 + Math.random() * 0.6).toFixed(1),
        // Simulasi kemiringan ROV (pitch & roll)
        pitch: +(Math.random() * 4 - 2).toFixed(1),
        roll: +(Math.random() * 6 - 3).toFixed(1),
      }));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    /**
     * Komponen <Router> HARUS membungkus seluruh elemen yang 
     * menggunakan fitur navigasi seperti NavLink atau useNavigate.
     */
    <Router>
      <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 font-sans antialiased ${
        isDarkMode ? 'bg-[#0b111a] text-slate-200' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* SIDEBAR: Berisi ikon navigasi utama */}
        <Sidebar isDarkMode={isDarkMode} />

        {/* MAIN AREA: Konten di sebelah kanan sidebar */}
        <div className={`flex-1 flex flex-col h-full relative transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1e4e8c]' : 'bg-blue-500'
        }`}>
          
          {/* Dekorasi Grid Pattern untuk estetika engineering */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px] z-0"></div>

          {/* NAVBAR: Judul proyek ROV Polman Bandung dan status sistem */}
          <Navbar 
            telemetry={telemetry} 
            isDarkMode={isDarkMode} 
            toggleMode={() => setIsDarkMode(!isDarkMode)} 
          />

          {/* DYNAMIC VIEWPORT: Area di mana "pintu" atau halaman berganti */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* Pintu 1: Menu Utama */}
                <Route path="/" element={<Home />} />

                {/* Pintu 2: Dashboard Telemetri & Video */}
                <Route path="/live" element={<Dashboard telemetry={telemetry} />} />

                {/* Placeholder untuk menu lainnya agar tidak kosong */}
                <Route path="/simulation" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">{<Simulation />}</div>} />
                <Route path="/params" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">📑 Konfigurasi Parameter Sistem</div>} />
                <Route path="/video" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">📹 Pengaturan Video Stream</div>} />
                <Route path="/setup" element={<VehicleSetup />} />
                {/* Fallback: Jika user mengetik alamat asal, lempar kembali ke Home */}
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/system-info" element={<SystemInformation />} />
                <Route path="/blueos" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5"><BlueOSVersion /></div>} />
              </Routes>
            </div>
          </main>

          {/* FOOTER: Informasi instansi dan versi sistem */}
          <footer className={`h-6 px-6 flex items-center justify-between text-[9px] font-mono border-t z-10 ${
            isDarkMode ? 'bg-[#111827]/90 border-white/10 text-slate-500' : 'bg-white/80 border-black/5 text-slate-600'
          }`}>
            <span className="tracking-widest uppercase">Politeknik Manufaktur Bandung - TRIN</span>
            <span className="font-bold">SYSTEM_STABLE_v1.0.4</span>
          </footer>

        </div>
      </div>
    </Router>
  );
}

export default App;