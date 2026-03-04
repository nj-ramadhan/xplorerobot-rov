import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import { Sidebar } from './layouts/Sidebar';
import { Navbar } from './layouts/Navbar';

// Import Views
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Manual } from './views/manual'; // Pastikan importnya benar
import Autonomous from './views/autonomous';

// Import Types
import { TelemetryData } from './types/telemetry';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const ws = useRef<WebSocket | null>(null);

  // State Terpusat (Global)
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0, heading: 0, voltage: 0.0, status: 'DISCONNECTED', mode: 'STABILIZE', pitch: 0, roll: 0
  });
  const [isArmed, setIsArmed] = useState(false);

  // KONEKSI WEBSOCKET TERPUSAT
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/telemetry');
    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ Berhasil terhubung ke WebSocket Backend");
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

    socket.onerror = (error) => console.error("❌ Error WebSocket:", error);
    socket.onclose = () => {
      console.log("🔌 Koneksi WebSocket terputus");
      setTelemetry(prev => ({ ...prev, status: 'DISCONNECTED' }));
      setIsArmed(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  // FUNGSI KONTROL TERPUSAT (Untuk dikirim ke halaman Manual)
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
        <Sidebar isDarkMode={isDarkMode} />
        <div className={`flex-1 flex flex-col h-full relative transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1e4e8c]' : 'bg-blue-500'
        }`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px] z-0"></div>

          <Navbar telemetry={telemetry} isDarkMode={isDarkMode} toggleMode={() => setIsDarkMode(!isDarkMode)} />

          <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/live" element={<Dashboard telemetry={telemetry} />} />
                
                {/* Halaman Manual sekarang menerima props */}
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
                
                <Route path="/autonomous" element={<div className="p-10 text-white bg-black/20 rounded-xl border border-white/5">{<Autonomous />}</div>} />
                {/* ... (Route lainnya dibiarkan sama) ... */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>

          <footer className={`... (Footer sama seperti sebelumnya) ...`}>
            <span className="tracking-widest uppercase">Politeknik Manufaktur Bandung - TRIN</span>
            <span className="font-bold">SYSTEM_STABLE_v1.0.4</span>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;