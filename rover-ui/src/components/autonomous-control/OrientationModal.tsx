import React, { useState } from 'react';

// Orientasi yang tersedia — nama, sudut yaw ROS (derajat), simbol arah
export type OrientationDir = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

export interface OrientationOption {
  dir: OrientationDir;
  label: string;
  yawDeg: number; // sudut yaw ROS2: 0=North(+X), 90=West(+Y), -90=East(-Y), 180=South
  symbol: string;
}

export const ORIENTATIONS: OrientationOption[] = [
  { dir: 'N',  label: 'Maju (North)',      yawDeg:    0, symbol: '↑' },
  { dir: 'NE', label: 'Maju-Kanan (NE)',   yawDeg:  -45, symbol: '↗' },
  { dir: 'E',  label: 'Kanan (East)',      yawDeg:  -90, symbol: '→' },
  { dir: 'SE', label: 'Mundur-Kanan (SE)', yawDeg: -135, symbol: '↘' },
  { dir: 'S',  label: 'Mundur (South)',    yawDeg:  180, symbol: '↓' },
  { dir: 'SW', label: 'Mundur-Kiri (SW)',  yawDeg:  135, symbol: '↙' },
  { dir: 'W',  label: 'Kiri (West)',       yawDeg:   90, symbol: '←' },
  { dir: 'NW', label: 'Maju-Kiri (NW)',    yawDeg:   45, symbol: '↖' },
];

interface OrientationModalProps {
  waypointIndex: number;    // nomor waypoint (1-based)
  waypointX: number;
  waypointY: number;
  onConfirm: (opt: OrientationOption) => void;
  onSkip: () => void;       // lanjut tanpa rotate
  onStop: () => void;       // emergency stop misi
}

export const OrientationModal: React.FC<OrientationModalProps> = ({
  waypointIndex,
  waypointX,
  waypointY,
  onConfirm,
  onSkip,
  onStop,
}) => {
  const [selected, setSelected] = useState<OrientationOption | null>(null);

  // Layout kompas 3x3
  const compassLayout: (OrientationOption | null)[][] = [
    [
      ORIENTATIONS.find(o => o.dir === 'NW')!,
      ORIENTATIONS.find(o => o.dir === 'N')!,
      ORIENTATIONS.find(o => o.dir === 'NE')!,
    ],
    [
      ORIENTATIONS.find(o => o.dir === 'W')!,
      null, // tengah = ROV icon
      ORIENTATIONS.find(o => o.dir === 'E')!,
    ],
    [
      ORIENTATIONS.find(o => o.dir === 'SW')!,
      ORIENTATIONS.find(o => o.dir === 'S')!,
      ORIENTATIONS.find(o => o.dir === 'SE')!,
    ],
  ];

  return (
    // Overlay fullscreen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d1520] border border-blue-500/30 rounded-2xl p-6 w-[380px] shadow-2xl shadow-blue-500/10">

        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"/>
            <span className="text-[10px] font-bold uppercase text-yellow-400 tracking-widest">
              Menunggu Orientasi
            </span>
          </div>
          <h2 className="text-base font-black text-white">
            Waypoint {waypointIndex} — Pilih Arah Hadap
          </h2>
          <p className="text-[10px] font-mono text-slate-500 mt-1">
            X: {waypointX.toFixed(2)} | Y: {waypointY.toFixed(2)}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            ROV berhenti di titik ini. Pilih orientasi sebelum lanjut ke waypoint berikutnya.
          </p>
        </div>

        {/* Kompas 3x3 */}
        <div className="flex justify-center mb-5">
          <div className="grid grid-cols-3 gap-2">
            {compassLayout.map((row, ri) =>
              row.map((opt, ci) => {
                if (!opt) {
                  // Tengah — ikon ROV
                  return (
                    <div
                      key={`center-${ri}-${ci}`}
                      className="w-16 h-16 flex items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20"
                    >
                      <span className="text-2xl" style={{ fontSize: 24 }}>🛩️</span>
                    </div>
                  );
                }
                const isSelected = selected?.dir === opt.dir;
                return (
                  <button
                    key={opt.dir}
                    onClick={() => setSelected(opt)}
                    className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl border font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg leading-none mb-0.5">{opt.symbol}</span>
                    <span className="text-[9px] font-black">{opt.dir}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Label orientasi terpilih */}
        <div className="mb-4 h-7 flex items-center justify-center">
          {selected ? (
            <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1">
              <span className="text-sm">{selected.symbol}</span>
              <span className="text-[11px] font-bold text-blue-300">{selected.label}</span>
              <span className="text-[10px] font-mono text-blue-400">({selected.yawDeg}°)</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-600 italic">Pilih arah di kompas...</span>
          )}
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all"
          >
            ✓ Konfirmasi & Rotate ROV
          </button>
          <div className="flex gap-2">
            <button
              onClick={onSkip}
              className="flex-1 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] font-bold rounded-lg transition-all border border-white/5"
            >
              Lewati (Tanpa Rotate)
            </button>
            <button
              onClick={onStop}
              className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[10px] font-bold rounded-lg transition-all border border-red-500/20"
            >
              ⏹ Stop Misi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrientationModal;