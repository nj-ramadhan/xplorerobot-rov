import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import Sidebar from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { TelemetryData } from './types/telemetry';
import Simulation from './views/simulation';
import VehicleSetup from './views/VehicleSetup/index';
import { SystemInformation } from './views/SystemInformation';
import BlueOSVersion from './views/BlueOSVersion';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDetailMode, setIsDetailMode] = useState(false);

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0,
    heading: 0,
    voltage: 14.8,
    status: 'CONNECTED',
    mode: 'STABILIZE',
    pitch: 0,
    roll: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        depth: +(12.5 + Math.random() * 0.4 - 0.2).toFixed(2),
        heading: (prev.heading + 1) % 360,
        voltage: +(14.5 + Math.random() * 0.6).toFixed(1),
        pitch: +(Math.random() * 4 - 2).toFixed(1),
        roll: +(Math.random() * 6 - 3).toFixed(1),
      }));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      {/* WRAPPER UTAMA: Menggunakan relative dan w-full agar base layer menutupi layar */}
      <div className="relative h-screen w-full overflow-hidden font-sans antialiased bg-[#0b111a]">

        {/* SIDEBAR: Akan melayang (fixed) di atas konten biru */}
        <Sidebar 
          isDarkMode={isDarkMode} 
          isDetailMode={isDetailMode} 
          setIsDetailMode={setIsDetailMode} 
        />
        
        {/* KONTEN AREA: 
            Menggunakan 'absolute inset-0' supaya background biru SELALU full layar.
            Transisi padding kiri (pl) hanya aktif jika isDetailMode OFF untuk memberi ruang ikon.
        */}
        <div className={`absolute inset-0 flex flex-col min-w-0 h-full transition-all duration-500 ${
          isDarkMode ? 'bg-[#1e4e8c]' : 'bg-blue-500'
        } ${!isDetailMode ? 'pl-20' : 'pl-0'}`}>
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px] z-0"></div>

          <Navbar 
            telemetry={telemetry} 
            isDarkMode={isDarkMode} 
            toggleMode={() => setIsDarkMode(!isDarkMode)} 
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 relative">
            <div className="w-full h-full">
              <Routes>
                <Route path="/" element={<Home onCardClick={() => setIsDetailMode(true)} />} />
                <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
                <Route path="/simulation" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">{<Simulation />}</div>} />
                <Route path="/params" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">📑 Konfigurasi Parameter Sistem</div>} />
                <Route path="/video" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">📹 Pengaturan Video Stream</div>} />
                <Route path="/setup" element={<VehicleSetup />} />
                <Route path="/system-info" element={<SystemInformation />} />
                <Route path="/blueos" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5"><BlueOSVersion /></div>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>

          <footer className={`h-6 px-6 flex items-center justify-between text-[9px] font-mono border-t z-20 ${
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