import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Layouts
import { Sidebar } from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views
// Path disesuaikan karena Landing.tsx ada di dalam folder views/landing/
import Landing from './views/landing/Landing'; 
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import ParamsView from './views/params'; 
import MissionControl from './views/Mission';
import PingSonarView from './views/ping'; 
import LogBrowser from './views/browser';
import VideoStream from './views/video';
import Simulation from './views/simulation';
import { Team } from './views/kami'; 

// Import Types
import { TelemetryData } from './types/telemetry';

// Komponen Pembantu untuk mendeteksi lokasi URL saat ini
function AppContent() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Deteksi apakah user sedang berada di halaman utama (Landing Page)
  const isLandingPage = location.pathname === '/';

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0,
    heading: 0,
    voltage: 14.8,
    status: 'CONNECTED',
    mode: 'STABILIZE',
    pitch: 0,
    roll: 0
  });

  // Simulasi data sensor ROV
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

  // RENDER KHUSUS LANDING PAGE (Tanpa Sidebar & Navbar)
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Jika ada yang nyasar di mode landing, kembalikan ke / */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // RENDER LAYOUT DASHBOARD/GCS (Dengan Sidebar & Navbar)
  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 font-sans antialiased ${
      isDarkMode ? 'bg-[#0b111a] text-slate-200' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Sidebar Navigasi */}
      <Sidebar isDarkMode={isDarkMode} />

      <div className={`flex-1 flex flex-col h-full relative transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1e4e8c]' : 'bg-blue-500'
      }`}>
        
        {/* Background Aksen Ground Station */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px] z-0"></div>

        {/* Navbar Global */}
        <Navbar 
          telemetry={telemetry} 
          isDarkMode={isDarkMode} 
          toggleMode={() => setIsDarkMode(!isDarkMode)} 
        />

        {/* Area Konten Utama */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Route Utama dipindah ke /home karena / dipakai Landing */}
              <Route path="/home" element={<Home />} />
              <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
              <Route path="/simulation" element={<Simulation />} /> 
              <Route path="/params" element={<ParamsView />} /> 
              <Route path="/mission" element={<MissionControl />} /> 
              <Route path="/ping" element={<PingSonarView />} /> 
              <Route path="/browser" element={<LogBrowser />} /> 
              <Route path="/video" element={<VideoStream />} />
              <Route path="/kami" element={<Team />} /> 
              <Route path="/setup" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">⚙️ Kalibrasi Sensor & Motor</div>} />

              {/* Redirect jika route tidak ditemukan di dalam dashboard */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </main>

        {/* Footer Identitas Kampus */}
        <footer className={`h-6 px-6 flex items-center justify-between text-[9px] font-mono border-t z-10 ${
          isDarkMode ? 'bg-[#111827]/90 border-white/10 text-slate-500' : 'bg-white/80 border-black/5 text-slate-600'
        }`}>
          <span className="tracking-widest uppercase">Politeknik Manufaktur Bandung - TRIN</span>
          <span className="font-bold">SYSTEM_STABLE_v1.0.4</span>
        </footer>

      </div>
    </div>
  );
}

// Komponen Utama
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;