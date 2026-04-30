import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TelemetryData } from '../types/telemetry';

interface TelemetryContextType {
  telemetry: TelemetryData;
  isArmed: boolean;
  toggleArm: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isArmed, setIsArmed] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    depth: 0.0, heading: 0, voltage: 0.0, status: 'DISCONNECTED', mode: 'STABILIZE', pitch: 0, roll: 0
  });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Jalankan WebSocket SEKALI SAJA di sini, akan hidup terus di semua halaman
    const socket = new WebSocket('ws://127.0.0.1:8001/ws/telemetry');
    ws.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ATTITUDE') {
        setTelemetry(prev => ({ ...prev, pitch: data.pitch, heading: Math.round(data.yaw * (180/Math.PI)) }));
      }
    };
    return () => socket.close();
  }, []);

  const toggleArm = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ action: isArmed ? "disarm" : "arm" }));
      setIsArmed(!isArmed);
    }
  };

  return (
    <TelemetryContext.Provider value={{ telemetry, isArmed, toggleArm, isDarkMode, setIsDarkMode }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) throw new Error("useTelemetry must be used within TelemetryProvider");
  return context;
};