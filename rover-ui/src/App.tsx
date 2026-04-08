import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Aset Gambar untuk Background Global
// @ts-ignore
import bgBannerDark from './assets/rov-latar-light.png';
// @ts-ignore
import bgBannerLight from './assets/rov-latar-light.png'; // Pastikan file ini ada kalau mau background terang

// Import Layouts
import { Sidebar } from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views
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

function AppContent() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
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

  // Simulasi data sensor
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

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 font-sans antialiased ${
      isDarkMode ? 'bg-[#060b19] text-slate-200' : 'bg-slate-50 text-slate-900'
    }`}>
      
      <Sidebar isDarkMode={isDarkMode} />

      <div className={`flex-1 flex flex-col h-full relative transition-colors duration-300 ${
        isDarkMode ? 'bg-[#060b19]' : 'bg-blue-50'
      }`}>
        
        {/* ==============================================
            BACKGROUND LAUT GLOBAL (Support Dark & Light)
            ============================================== */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none z-0"
          style={{ 
            backgroundImage: `url(${isDarkMode ? bgBannerDark : bgBannerLight})`,
            opacity: isDarkMode ? 0.4 : 0.6
          }}
        ></div>

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 z-0 pointer-events-none transition-all duration-700 bg-gradient-to-b ${
          isDarkMode ? 'from-transparent via-[#060b19]/80 to-[#060b19]' : 'from-white/30 via-white/70 to-[#f8fafc]'
        }`}></div>

        <Navbar 
          telemetry={telemetry} 
          isDarkMode={isDarkMode} 
          toggleMode={() => setIsDarkMode(!isDarkMode)} 
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <Routes>
              {/* Parsing isDarkMode ke halaman yang butuh efek bunglon */}
              <Route path="/home" element={<Home isDarkMode={isDarkMode} />} />
              <Route path="/simulation" element={<Simulation isDarkMode={isDarkMode} />} /> 
              
              <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
              <Route path="/params" element={<ParamsView />} /> 
              <Route path="/mission" element={<MissionControl />} /> 
              <Route path="/ping" element={<PingSonarView />} /> 
              <Route path="/browser" element={<LogBrowser />} /> 
              <Route path="/video" element={<VideoStream />} />
              <Route path="/kami" element={<Team />} /> 
              <Route path="/setup" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">⚙️ Kalibrasi Sensor & Motor</div>} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </main>

        <footer className={`h-6 px-6 flex items-center justify-between text-[9px] font-mono border-t z-10 ${
          isDarkMode ? 'bg-[#060b19]/90 border-white/10 text-slate-500' : 'bg-white/80 border-black/5 text-slate-600'
        }`}>
          <span className="tracking-widest uppercase">Politeknik Manufaktur Bandung - TRIN</span>
          <span className="font-bold">SYSTEM_STABLE_v1.0.4</span>
        </footer>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;