import React, { useRef, useState, useEffect } from 'react';

interface MapPanelProps {
  goals: Array<{ id: number; rosX: number; rosY: number }>;
  activeGoalId: number | null;
  onMapClick: (rosX: number, rosY: number) => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ goals, activeGoalId, onMapClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const RESOLUTION = 0.05; // 1 pixel = 5cm

  useEffect(() => {
    const update = () => {
      if (mapRef.current) setSize({ w: mapRef.current.clientWidth, h: mapRef.current.clientHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Konversi Meter (ROS) ke Pixel (UI)
  const toUI = (rosX: number, rosY: number) => {
    if (size.w === 0) return { x: 0, y: 0 };
    return {
      x: (-rosY / RESOLUTION) + (size.w / 2),
      y: (-rosX / RESOLUTION) + (size.h / 2)
    };
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Balikkan koordinat ke Meter
    const rosX = (-(y - size.h / 2) * RESOLUTION);
    const rosY = (-(x - size.w / 2) * RESOLUTION);
    onMapClick(rosX, rosY);
  };

  return (
    <div ref={mapRef} onClick={handleClick} className="w-full h-full relative cursor-crosshair bg-[#0b0e14] rounded-xl border border-white/5 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px]"></div>
      
      {/* Garis Tengah Sumbu X & Y */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5"></div>
      <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/5"></div>

      {/* Gambar Pin Target */}
      {goals.map((g, idx) => (
        <div 
          key={g.id} 
          className="absolute -translate-x-1/2 -translate-y-full transition-all duration-300"
          style={{ left: toUI(g.rosX, g.rosY).x, top: toUI(g.rosX, g.rosY).y }}
        >
          <div className={`relative flex flex-col items-center ${activeGoalId === g.id ? 'animate-bounce' : ''}`}>
             <span className={`text-2xl ${activeGoalId === g.id ? 'drop-shadow-[0_0_10px_#3b82f6]' : ''}`}>📍</span>
             <span className="bg-blue-600 text-[8px] px-1 rounded font-bold">T{idx + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
};