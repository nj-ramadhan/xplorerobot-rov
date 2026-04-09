import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import Aset Gambar untuk Background Global
// @ts-ignore
import bgBannerDark from './assets/rov-latar-light.png';
// @ts-ignore
import bgBannerLight from './assets/rov-latar-light.png'; 

import Sidebar from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views (Gabungan semua modul)
import Landing from './views/landing/Landing'; 
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Manual } from './views/manual';
import ManualROS2 from './pages/manualros2'; 
import AutonomousROS2 from './pages/AutonomousROS2'; 
import ParamsView from './views/params'; 
import MissionControl from './views/Mission';
import PingSonarView from './views/ping'; 
import LogBrowser from './views/browser'; 
import VideoStream from './views/video'; 
import VehicleSetup from './views/VehicleSetup/index';
import { SystemInformation } from './views/SystemInformation';
import BlueOSVersion from './views/BlueOSVersion';
import { Team } from './views/kami'; 

import { TelemetryData } from './types/telemetry';

function AppContent() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const isLandingPage = location.pathname === '/';

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0, heading: 0, voltage: 0.0, status: 'DISCONNECTED', mode: 'STABILIZE', pitch: 0, roll: 0
  });
  const [isArmed, setIsArmed] = useState(false);

  // Integrasi WebSocket MAVLink & Simulasi Sensor (Dipertahankan karena ini data aslinya)
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/telemetry');
    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ Berhasil terhubung ke WebSocket Backend MAVLink");
      setTelemetry(prev => ({ ...prev, status: 'CONNECTED' }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ATTITUDE') {
          let headingDegrees = data.yaw * (180 / Math.PI);
          if (headingDegrees < 0) headingDegrees += 360;
          setTelemetry(prev => ({ ...prev, pitch: data.pitch, roll: data.roll, heading: Math.round(headingDegrees) }));
        }
      } catch (err) {}
    };

    socket.onerror = (error) => console.error("❌ Error WebSocket MAVLink:", error);
    socket.onclose = () => {
      setTelemetry(prev => ({ ...prev, status: 'DISCONNECTED' }));
      setIsArmed(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) socket.close();
    };
  }, []);

  const toggleArm = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: isArmed ? "disarm" : "arm" }));
      setIsArmed(!isArmed);
    }
  };

  const sendRC = (channels: Record<number, number>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "rc", channels }));
    }
  };

  // RENDER KHUSUS LANDING PAGE (Tanpa Sidebar & Navbar)
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans antialiased transition-colors duration-500 ${
      isDarkMode ? 'bg-[#060b19] text-slate-200' : 'bg-slate-50 text-slate-900'
    }`}>

      {/* SIDEBAR LACI MELAYANG */}
      <Sidebar 
        isDarkMode={isDarkMode} 
        isDetailMode={isDetailMode} 
        setIsDetailMode={setIsDetailMode} 
      />
      
      {/* AREA KONTEN UTAMA - Animasi dorong dari sidebar (ml-24 / ml-0) */}
      <div className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ${
        isDarkMode ? 'bg-[#060b19]' : 'bg-blue-50'
      } ${!isDetailMode ? 'ml-24' : 'ml-0'}`}>
        
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

        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 relative">
          <div className="w-full h-full max-w-7xl mx-auto">
            <Routes>
              {/* Route Utama dashboard. Meneruskan isDarkMode dan onCardClick ke Home */}
              <Route path="/home" element={<Home isDarkMode={isDarkMode} onCardClick={() => setIsDetailMode(true)} />} />
              <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
              
              <Route path="/manual" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5"><Manual telemetry={telemetry} isArmed={isArmed} toggleArm={toggleArm} sendRC={sendRC} /></div>} />
              <Route path="/manualros2" element={<div className="p-1 text-white"><ManualROS2 /></div>} />
              <Route path="/autonomous" element={<div className="p-1 text-white h-full"><AutonomousROS2 /></div>} />
              <Route path="/setup" element={<VehicleSetup />} />
              <Route path="/params" element={<ParamsView />} /> 
              <Route path="/mission" element={<MissionControl />} /> 
              <Route path="/ping" element={<PingSonarView />} /> 
              <Route path="/browser" element={<LogBrowser />} /> 
              <Route path="/video" element={<VideoStream />} />
              <Route path="/system-info" element={<SystemInformation />} />
              <Route path="/blueos" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5"><BlueOSVersion /></div>} />
              <Route path="/kami" element={<Team />} /> 
              
              {/* Redirect jika route tidak ditemukan */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </main>

        {/* Footer Identitas Kampus */}
        <footer className={`h-6 px-6 flex items-center justify-between text-[9px] font-mono border-t z-20 ${
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