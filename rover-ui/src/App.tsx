import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import { Sidebar } from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Manual } from './views/manual';
import ManualROS2 from './views/manualros2';
import Autonomous from './views/autonomous';
import ParamsView from './views/params'; 
import MissionControl from './views/Mission';
import PingSonarView from './views/ping'; 
import LogBrowser from './views/browser'; 
import VideoStream from './views/video'; 

// Import Types
import { TelemetryData } from './types/telemetry';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const ws = useRef<WebSocket | null>(null);

  // State Terpusat (Global) untuk MAVLink
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0, heading: 0, voltage: 0.0, status: 'DISCONNECTED', mode: 'STABILIZE', pitch: 0, roll: 0
  });
  const [isArmed, setIsArmed] = useState(false);

  // KONEKSI WEBSOCKET TERPUSAT (Untuk MAVLink/FastAPI lama)
  // Biarkan saja ini jalan, tidak akan mengganggu ROS2. Nanti statusnya hanya 'DISCONNECTED'
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/telemetry');
    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ Berhasil terhubung ke WebSocket Backend MAVLink");
      setTelemetry(prev => ({ ...prev, status: 'CONNECTED' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ATTITUDE') {
        setTelemetry(prev => {
          let headingDegrees = data.yaw * (180 / Math.PI);
          if (headingDegrees < 0) headingDegrees += 360;
          return {
            ...prev,
            pitch: data.pitch,
            roll: data.roll,
            heading: Math.round(headingDegrees)
          };
        });
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
      <div className={`flex h-screen w-full overflow-hidden transition-colors duration-500 font-sans antialiased ${
        isDarkMode ? 'bg-[#0b111a] text-slate-200' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Sidebar tetap di kiri */}
        <Sidebar isDarkMode={isDarkMode} />

        <div className={`flex-1 flex flex-col h-full relative transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1e4e8c]' : 'bg-blue-500'
        }`}>
          
          {/* Background dots aksen untuk Ground Station */}
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
                <Route path="/" element={<Home />} />
                <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
                
                {/* Manual MAVLink Lama */}
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

                {/* Manual ROS2 Gazebo */}
                <Route path="/manualros2" element={
                  <div className="p-1 text-white">
                    <ManualROS2 />
                  </div>
                } />
                
                <Route path="/autonomous" element={
                  <div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">
                    <Autonomous />
                  </div>
                } />

                {/* Modul Tambahan dari Branch Remote */}
                <Route path="/params" element={<ParamsView />} /> 
                <Route path="/mission" element={<MissionControl />} /> 
                <Route path="/ping" element={<PingSonarView />} /> 
                <Route path="/browser" element={<LogBrowser />} /> 
                <Route path="/video" element={<VideoStream />} />

                {/* Placeholder untuk route setup */}
                <Route path="/setup" element={
                  <div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">
                    ⚙️ Kalibrasi Sensor & Motor
                  </div>
                } />

                {/* Redirect jika route tidak ditemukan */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>

          {/* Footer Identitas Kampus Polman Bandung */}
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