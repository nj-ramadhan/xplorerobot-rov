import React, { useRef, useState, useEffect } from 'react';

interface MapPanelProps {
  goals: Array<{ id: number; rosX: number; rosY: number }>;
  activeGoalId: number | null;
  rovPos: { rosX: number; rosY: number; yaw: number };
  rovPath: Array<{ rosX: number; rosY: number }>;
  onMapClick: (rosX: number, rosY: number) => void;
}

// 1 pixel = RESOLUTION meter di Gazebo
const RESOLUTION = 0.05;

export const MapPanel: React.FC<MapPanelProps> = ({
  goals,
  activeGoalId,
  rovPos,
  rovPath,
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      if (mapRef.current) {
        setSize({ w: mapRef.current.clientWidth, h: mapRef.current.clientHeight });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, []);

  /**
   * Konversi koordinat ROS → pixel UI
   */
  const toUI = (rosX: number, rosY: number) => {
    if (size.w === 0) return { x: 0, y: 0 };
    return {
      x: size.w / 2 - rosY / RESOLUTION,
      y: size.h / 2 - rosX / RESOLUTION,
    };
  };

  /**
   * Klik pixel → koordinat ROS
   */
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const rosX = -(py - size.h / 2) * RESOLUTION;
    const rosY = -(px - size.w / 2) * RESOLUTION;

    onMapClick(rosX, rosY);
  };

  const pathPoints = rovPath
    .map(p => {
      const ui = toUI(p.rosX, p.rosY);
      return `${ui.x},${ui.y}`;
    })
    .join(' ');

  const rovUI = toUI(rovPos.rosX, rovPos.rosY);

  return (
    <div
      ref={mapRef}
      onClick={handleClick}
      className="w-full h-full relative cursor-crosshair select-none"
    >
      {/* Grid dots background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Crosshair tengah */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-white/5 pointer-events-none" />

      {/* Label sumbu */}
      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-white/20 font-mono">
        +X (North)
      </span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-white/20 font-mono rotate-90">
        −Y (East)
      </span>

      {/* SVG untuk trail */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {rovPath.length > 1 && (
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeOpacity="0.6"
          />
        )}
      </svg>

      {/* Goal pins */}
      {goals.map((g, idx) => {
        const ui = toUI(g.rosX, g.rosY);
        const isActive = activeGoalId === g.id;
        return (
          <div
            key={g.id}
            className="absolute z-20 pointer-events-none"
            style={{
              left: ui.x,
              top: ui.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className={`relative ${isActive ? 'animate-bounce' : ''}`}>
              <span className="text-2xl drop-shadow-[0_0_8px_#ef4444]">📍</span>
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white/50 shadow">
                {idx + 1}
              </span>
            </div>
          </div>
        );
      })}

      {/* ROV SVG Graphic — rotate sesuai yaw */}
      <div
        className="absolute z-50 pointer-events-none transition-all duration-200"
        style={{
          left: rovUI.x,
          top: rovUI.y,
          // SVG sudah didesain menghadap Utara (North), jadi tidak perlu -45 derajat lagi
          transform: `translate(-50%, -50%) rotate(${-rovPos.yaw}deg)`,
          filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.6))',
        }}
      >
        <svg 
          viewBox="0 0 40 40" 
          width="36" 
          height="36" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Thrusters (Baling-baling luar) */}
          <rect x="2" y="10" width="6" height="6" rx="1" fill="#1e293b"/>
          <rect x="32" y="10" width="6" height="6" rx="1" fill="#1e293b"/>
          <rect x="2" y="24" width="6" height="6" rx="1" fill="#1e293b"/>
          <rect x="32" y="24" width="6" height="6" rx="1" fill="#1e293b"/>
          
          {/* Buoyancy Foams (Pelampung Kuning Kiri-Kanan) */}
          <rect x="6" y="6" width="8" height="28" rx="3" fill="#38bdf8"/>
          <rect x="26" y="6" width="8" height="28" rx="3" fill="#38bdf8"/>
          
          {/* Main Enclosure (Bodi Utama Hitam/Abu-abu) */}
          <rect x="12" y="9" width="16" height="22" rx="4" fill="#334155"/>
          
          {/* Front Camera Dome (Kaca Kamera Depan) */}
          <path d="M14 9 Q20 2 26 9 Z" fill="#eab308" opacity="0.9"/>
          
          {/* Center detail (Kabel/Tether port) */}
          <circle cx="20" cy="20" r="3" fill="#0f172a"/>
          <circle cx="20" cy="20" r="1.5" fill="#f8fafc"/>
        </svg>
      </div>
    </div>
  );
};