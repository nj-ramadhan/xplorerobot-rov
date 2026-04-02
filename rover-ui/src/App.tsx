import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import Sidebar from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views & Pages
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Manual } from './views/manual';

// ✅ IMPORT HASIL KERJA MAHEN
import ManualROS2 from './pages/manualros2'; 
import AutonomousROS2 from './pages/AutonomousROS2'; 

// ✅ IMPORT HASIL KERJA TIM
import ParamsView from './views/params'; 
import MissionControl from './views/Mission';
import PingSonarView from './views/ping'; 
import LogBrowser from './views/browser'; 
import VideoStream from './views/video'; 
import VehicleSetup from './views/VehicleSetup/index';

// ✅ IMPORT HASIL KERJA NAUU
import { SystemInformation } from './views/SystemInformation';
import BlueOSVersion from './views/BlueOSVersion';
import { Team }  from './views/kami'; 
import { TelemetryData } from './types/telemetry';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDetailMode, setIsDetailMode] = useState(false); // State baru dari Nauu untuk layout Sidebar
  const ws = useRef<WebSocket | null>(null);

  // State Terpusat (Global) untuk MAVLink
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0, heading: 0, voltage: 0.0, status: 'DISCONNECTED', mode: 'STABILIZE', pitch: 0, roll: 0
  });
  const [isArmed, setIsArmed] = useState(false);

  // KONEKSI WEBSOCKET MAVLINK (Dipertahankan menggunakan versi Mahen yang Asli)
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
          
          setTelemetry(prev => ({
            ...prev,
            pitch: data.pitch,
            roll: data.roll,
            heading: Math.round(headingDegrees)
          }));
        }
      } catch (err) {
        // Abaikan error
      }
    };

    socket.onerror = (error) => console.error("❌ Error WebSocket MAVLink:", error);
    socket.onclose = () => {
      console.log("🔌 Koneksi WebSocket MAVLink terputus");
      setTelemetry(prev => ({ ...prev, status: 'DISCONNECTED' }));
      setIsArmed(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  // FUNGSI KONTROL TERPUSAT (Untuk MAVLink)
  const toggleArm = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const action = isArmed ? "disarm" : "arm";
      ws.current.send(JSON.stringify({ action }));
      setIsArmed(!isArmed);
    }
  };

  const sendRC = (channels: Record<number, number>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: "rc", channels }));
    }
  };

  return (
    <Router>
      {/* WRAPPER UTAMA: Menggabungkan styling dark mode Mahen dengan base layer Nauu */}
      <div className={`relative h-screen w-full overflow-hidden font-sans antialiased transition-colors duration-500 ${
        isDarkMode ? 'bg-[#0b111a] text-slate-200' : 'bg-slate-50 text-slate-900'
      }`}>

        {/* SIDEBAR: Akan melayang (fixed) di atas konten biru (Update dari Nauu) */}
        <Sidebar 
          isDarkMode={isDarkMode} 
          isDetailMode={isDetailMode} 
          setIsDetailMode={setIsDetailMode} 
        />
        
        {/* KONTEN AREA: Transisi padding kiri (pl) hanya aktif jika isDetailMode OFF */}
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

          {/* Area Konten Utama */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 relative">
            <div className="w-full h-full max-w-7xl mx-auto">
              <Routes>
                {/* Rute Halaman Utama & Dashboard */}
                <Route path="/" element={<Home onCardClick={() => setIsDetailMode(true)} />} />
                <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
                
                {/* 🎮 RUTE SIMULASI & KONTROL */}
                <Route path="/manual" element={
                  <div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">
                    <Manual 
                      telemetry={telemetry} 
                      isArmed={isArmed} 
                      toggleArm={toggleArm} 
                      sendRC={sendRC} 
                    />
                  </div>
                } />
                <Route path="/manualros2" element={<div className="p-1 text-white"><ManualROS2 /></div>} />
                <Route path="/autonomous" element={<div className="p-1 text-white"><AutonomousROS2 /></div>} />

                {/* 🔧 RUTE PENGATURAN & SISTEM */}
                <Route path="/setup" element={<VehicleSetup />} />
                <Route path="/params" element={<ParamsView />} /> 
                <Route path="/mission" element={<MissionControl />} /> 
                <Route path="/ping" element={<PingSonarView />} /> 
                <Route path="/browser" element={<LogBrowser />} /> 
                <Route path="/video" element={<VideoStream />} />
                <Route path="/system-info" element={<SystemInformation />} />
                
                <Route path="/blueos" element={
                  <div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">
                    <BlueOSVersion />
                  </div>
                } />
                
                {/* ROUTE DOKUMENTASI TIM */}
                <Route path="/kami" element={<Team />} /> 

                {/* Redirect jika route tidak ditemukan */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>

          {/* Footer Identitas Kampus */}
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