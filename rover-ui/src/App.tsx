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
import System from './views/landing/system';
import Data from './views/landing/data';
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Manual } from './views/manual';
import ManualROS2 from './pages/manualros2';
import AutonomousROS2 from './pages/AutonomousROS2';
import ParamsView from './views/params';
import MissionControl from './views/Mission/MissionControl';
import PingSonarView from './views/ping';
import LogBrowser from './views/browser';
import VideoStream from './views/video';
import FirmwareView from './views/firmware/AutopilotFirmware';
import VehicleSetup from './views/VehicleSetup/index';
import { SystemInformation } from './views/SystemInformation';
import BlueOSVersion from './views/BlueOSVersion';
import { Team } from './views/kami';
import TerminalView from './views/TerminalView';

import { TelemetryData } from './types/telemetry';

// ─────────────────────────────────────────────────────────────
// Helper: wrapper komponen agar tetap mounted tapi tersembunyi
// saat path tidak aktif → state & WebSocket tidak hilang
// ─────────────────────────────────────────────────────────────
const PersistentPage: React.FC<{ activePath: string; matchPath: string; children: React.ReactNode }> = ({
  activePath,
  matchPath,
  children,
}) => {
  const isActive = activePath === matchPath;
  return (
    <div style={{ display: isActive ? 'block' : 'none' }} className="w-full h-full">
      {children}
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const isPublicPage =
    location.pathname === '/' ||
    location.pathname === '/system' ||
    location.pathname === '/data';

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0,
    heading: 0,
    voltage: 0.0,
    status: 'DISCONNECTED',
    mode: 'STABILIZE',
    pitch: 0,
    roll: 0,
  });
  const [isArmed, setIsArmed] = useState(false);

  // Integrasi WebSocket MAVLink
  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8001/ws/telemetry');
    ws.current = socket;

    socket.onopen = () => {
      console.log('✅ Berhasil terhubung ke WebSocket Backend MAVLink');
      setTelemetry(prev => ({ ...prev, status: 'CONNECTED' }));
    };

    socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ATTITUDE') {
          let headingDegrees = data.yaw * (180 / Math.PI);
          if (headingDegrees < 0) headingDegrees += 360;
          setTelemetry(prev => ({
            ...prev,
            pitch: data.pitch,
            roll: data.roll,
            heading: Math.round(headingDegrees),
          }));
        }
      } catch (err) {}
    };

    socket.onerror = error => console.error('❌ Error WebSocket MAVLink:', error);
    socket.onclose = () => {
      setTelemetry(prev => ({ ...prev, status: 'DISCONNECTED' }));
      setIsArmed(false);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
        socket.close();
    };
  }, []);

  const toggleArm = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: isArmed ? 'disarm' : 'arm' }));
      setIsArmed(!isArmed);
    }
  };

  const sendRC = (channels: Record<number, number>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: 'rc', channels }));
    }
  };

  // ── Halaman Publik (Landing, System, Data) ──
  // Tetap pakai Routes biasa karena halaman ini tidak butuh persistensi
  if (isPublicPage) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/system" element={<System />} />
        <Route path="/data" element={<Data />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  const path = location.pathname;

  // ── Render Dashboard ──
  return (
    <div
      className={`flex h-screen w-full overflow-hidden font-sans antialiased transition-colors duration-500 ${
        isDarkMode ? 'bg-[#060b19] text-slate-200' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Sidebar
        isDarkMode={isDarkMode}
        isDetailMode={isDetailMode}
        setIsDetailMode={setIsDetailMode}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 ${
          isDarkMode ? 'bg-[#060b19]' : 'bg-blue-50'
        } ${!isDetailMode ? 'ml-24' : 'ml-0'}`}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${isDarkMode ? bgBannerDark : bgBannerLight})`,
            opacity: isDarkMode ? 0.4 : 0.6,
          }}
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 z-0 pointer-events-none transition-all duration-700 bg-gradient-to-b ${
            isDarkMode
              ? 'from-transparent via-[#060b19]/80 to-[#060b19]'
              : 'from-white/30 via-white/70 to-[#f8fafc]'
          }`}
        />

        <Navbar
          telemetry={telemetry}
          isDarkMode={isDarkMode}
          toggleMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* ─────────────────────────────────────────────────────
            SEMUA HALAMAN PERSISTENT — tidak unmount saat navigasi
            Setiap halaman selalu ter-render, hanya disembunyikan
            via display:none saat tidak aktif.
        ───────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto z-10 relative">
          <div className="w-full h-full max-w-7xl mx-auto">

            {/* /home */}
            <PersistentPage activePath={path} matchPath="/home">
              <div className="p-6 md:p-8">
                <Home isDarkMode={isDarkMode} onCardClick={() => setIsDetailMode(true)} />
              </div>
            </PersistentPage>

            {/* /live */}
            <PersistentPage activePath={path} matchPath="/live">
              <div className="p-6 md:p-8">
                <Dashboard telemetry={telemetry} isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /manual */}
            <PersistentPage activePath={path} matchPath="/manual">
              <div className="p-6 md:p-8">
                <Manual
                  telemetry={telemetry}
                  isArmed={isArmed}
                  toggleArm={toggleArm}
                  sendRC={sendRC}
                  isDarkMode={isDarkMode}
                />
              </div>
            </PersistentPage>

            {/* /manualros2 */}
            <PersistentPage activePath={path} matchPath="/manualros2">
              <div className="p-6 md:p-8">
                <ManualROS2 isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /autonomous */}
            <PersistentPage activePath={path} matchPath="/autonomous">
              <div className="p-1 h-full">
                <AutonomousROS2 />
              </div>
            </PersistentPage>

            {/* /setup */}
            <PersistentPage activePath={path} matchPath="/setup">
              <div className="p-6 md:p-8">
                <VehicleSetup isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /params */}
            <PersistentPage activePath={path} matchPath="/params">
              <div className="p-6 md:p-8">
                <ParamsView isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /firmware */}
            <PersistentPage activePath={path} matchPath="/firmware">
              <div className="p-6 md:p-8">
                <FirmwareView isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /mission */}
            <PersistentPage activePath={path} matchPath="/mission">
              <div className="p-6 md:p-8">
                <MissionControl isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /ping */}
            <PersistentPage activePath={path} matchPath="/ping">
              <div className="p-6 md:p-8">
                <PingSonarView isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /browser */}
            <PersistentPage activePath={path} matchPath="/browser">
              <div className="p-6 md:p-8">
                <LogBrowser isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /video */}
            <PersistentPage activePath={path} matchPath="/video">
              <div className="p-6 md:p-8">
                <VideoStream isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /system-info */}
            <PersistentPage activePath={path} matchPath="/system-info">
              <div className="p-6 md:p-8">
                <SystemInformation isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /blueos */}
            <PersistentPage activePath={path} matchPath="/blueos">
              <div className="p-6 md:p-8">
                <BlueOSVersion isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /kami */}
            <PersistentPage activePath={path} matchPath="/kami">
              <div className="p-6 md:p-8">
                <Team isDarkMode={isDarkMode} />
              </div>
            </PersistentPage>

            {/* /terminal — persistent agar WebSocket tidak putus */}
            <PersistentPage activePath={path} matchPath="/terminal">
              <TerminalView isDarkMode={isDarkMode} />
            </PersistentPage>

          </div>

          {/* Fallback: redirect path yang tidak dikenal ke /home */}
          <Routes>
            <Route path="/home" element={null} />
            <Route path="/live" element={null} />
            <Route path="/manual" element={null} />
            <Route path="/manualros2" element={null} />
            <Route path="/autonomous" element={null} />
            <Route path="/setup" element={null} />
            <Route path="/params" element={null} />
            <Route path="/firmware" element={null} />
            <Route path="/mission" element={null} />
            <Route path="/ping" element={null} />
            <Route path="/browser" element={null} />
            <Route path="/video" element={null} />
            <Route path="/system-info" element={null} />
            <Route path="/blueos" element={null} />
            <Route path="/kami" element={null} />
            <Route path="/terminal" element={null} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>

        <footer
          className={`h-6 px-6 flex items-center justify-between text-[9px] font-mono border-t z-20 ${
            isDarkMode
              ? 'bg-[#060b19]/90 border-white/10 text-slate-500'
              : 'bg-white/80 border-black/5 text-slate-600'
          }`}
        >
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