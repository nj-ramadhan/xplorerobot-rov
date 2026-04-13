import React, { useRef, useState, useEffect } from 'react';

export interface PathGoal {
  id: number;
  rosX: number;
  rosY: number;
  yawDeg: number; // orientation set by dragging (0=North, -90=East, +90=West, 180=South)
}

interface PathMapPanelProps {
  pathGoals: PathGoal[];
  setPathGoals: React.Dispatch<React.SetStateAction<PathGoal[]>>;
  activeGoalId: number | null;
  rovPos: { rosX: number; rosY: number; yaw: number };
  rovPath: Array<{ rosX: number; rosY: number }>;
  disabled?: boolean;
}

const RESOLUTION = 0.05;

// ── Fix B: Naikkan threshold drag ──────────────────────────────────────────
// 8px terlalu kecil (hampir tidak terasa, mudah salah).
// 30px lebih intentional — user harus benar-benar drag untuk set orientasi.
const DRAG_ORIENTATION_THRESHOLD_PX = 30;

// Radius lingkaran panduan saat drag (visual feedback zona aman)
const DRAG_GUIDE_RADIUS = 30;

function yawToCompass(yaw: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(((yaw % 360) + 360) / 45) % 8];
}

function dragToYaw(dx: number, dy: number): number {
  const screenAngle = Math.atan2(dx, -dy) * (180 / Math.PI);
  return -screenAngle;
}

// ── Fix C: Tipe untuk pending confirmation ──────────────────────────────────
interface PendingGoal {
  rosX: number;
  rosY: number;
  yawDeg: number;
  uiX: number; // posisi pixel untuk menaruh card
  uiY: number;
}

export const PathMapPanel: React.FC<PathMapPanelProps> = ({
  pathGoals, setPathGoals,
  activeGoalId, rovPos, rovPath,
  disabled,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  type DragState = {
    active: boolean;
    originPx: { x: number; y: number };
    originRos: { rosX: number; rosY: number };
    currentPx: { x: number; y: number };
    angleDeg: number;
  };
  const [dragState, setDragState] = useState<DragState | null>(null);

  // Fix C: State untuk waypoint yang menunggu konfirmasi user
  const [pendingGoal, setPendingGoal] = useState<PendingGoal | null>(null);

  useEffect(() => {
    const update = () => {
      if (mapRef.current) setSize({ w: mapRef.current.clientWidth, h: mapRef.current.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    if (mapRef.current) ro.observe(mapRef.current);
    return () => ro.disconnect();
  }, []);

  const toUI = (rosX: number, rosY: number) => {
    if (size.w === 0) return { x: 0, y: 0 };
    return {
      x: size.w / 2 - rosY / RESOLUTION,
      y: size.h / 2 - rosX / RESOLUTION,
    };
  };

  const pxToRos = (px: number, py: number) => ({
    rosX: -(py - size.h / 2) * RESOLUTION,
    rosY: -(px - size.w / 2) * RESOLUTION,
  });

  // ── Drag handlers ──────────────────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Jika ada pending goal yang belum dikonfirmasi, klik di luar card akan membatalkannya
    if (pendingGoal) {
      setPendingGoal(null);
      return;
    }
    if (disabled || !mapRef.current) return;
    e.preventDefault();
    const rect = mapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const ros = pxToRos(px, py);
    setDragState({
      active: true,
      originPx: { x: px, y: py },
      originRos: ros,
      currentPx: { x: px, y: py },
      angleDeg: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState?.active || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const dx = px - dragState.originPx.x;
    const dy = py - dragState.originPx.y;
    if (Math.hypot(dx, dy) < 3) return;
    setDragState(prev => prev ? {
      ...prev,
      currentPx: { x: px, y: py },
      angleDeg: dragToYaw(dx, dy),
    } : null);
  };

  const commitDrag = () => {
    if (!dragState?.active) return;
    const dx = dragState.currentPx.x - dragState.originPx.x;
    const dy = dragState.currentPx.y - dragState.originPx.y;
    const dist = Math.hypot(dx, dy);

    // Fix B: Gunakan threshold baru 30px (bukan 8px)
    const yawDeg = dist > DRAG_ORIENTATION_THRESHOLD_PX ? dragState.angleDeg : 0;

    // Fix C: Alih-alih langsung commit ke list, tampilkan pending confirmation card
    setPendingGoal({
      rosX: dragState.originRos.rosX,
      rosY: dragState.originRos.rosY,
      yawDeg,
      uiX: dragState.originPx.x,
      uiY: dragState.originPx.y,
    });
    setDragState(null);
  };

  // Fix C: Konfirmasi — tambahkan ke list
  const confirmPendingGoal = () => {
    if (!pendingGoal) return;
    const newGoal: PathGoal = {
      id: Date.now(),
      rosX: pendingGoal.rosX,
      rosY: pendingGoal.rosY,
      yawDeg: pendingGoal.yawDeg,
    };
    setPathGoals(prev => [...prev, newGoal]);
    setPendingGoal(null);
  };

  // Fix C: Batalkan waypoint pending
  const cancelPendingGoal = () => setPendingGoal(null);

  const handleMouseUp    = () => commitDrag();
  const handleMouseLeave = () => { if (dragState?.active) commitDrag(); };

  // ── Rendering ──────────────────────────────────────────────────────────────

  const rovUI = toUI(rovPos.rosX, rovPos.rosY);
  const rovPathPoints = rovPath.map(p => {
    const ui = toUI(p.rosX, p.rosY);
    return `${ui.x},${ui.y}`;
  }).join(' ');
  const wpPathPoints = pathGoals.map(g => {
    const ui = toUI(g.rosX, g.rosY);
    return `${ui.x},${ui.y}`;
  }).join(' ');

  const arrowEnd = (uiX: number, uiY: number, yawDeg: number, len: number) => {
    const rad = (-yawDeg) * Math.PI / 180;
    return {
      x: uiX + len * Math.sin(rad),
      y: uiY - len * Math.cos(rad),
    };
  };

  // Fix B: Hitung progress drag (0–1) untuk visual feedback
  const dragDist = dragState
    ? Math.hypot(
        dragState.currentPx.x - dragState.originPx.x,
        dragState.currentPx.y - dragState.originPx.y,
      )
    : 0;
  const dragProgress = Math.min(dragDist / DRAG_ORIENTATION_THRESHOLD_PX, 1);
  const orientationLocked = dragDist > DRAG_ORIENTATION_THRESHOLD_PX;

  return (
    <div
      ref={mapRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={`w-full h-full relative select-none ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
    >
      {/* Grid dots */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Crosshair */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 pointer-events-none" />
      <div className="absolute top-0 left-1/2 w-px h-full bg-white/5 pointer-events-none" />

      {/* Axis labels */}
      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-white/20 font-mono">+X (North)</span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-white/20 font-mono rotate-90">−Y (East)</span>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="pm-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#a78bfa" opacity="0.9"/>
          </marker>
          <marker id="pm-arrow-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#60a5fa"/>
          </marker>
          <marker id="pm-arrow-live" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#c4b5fd"/>
          </marker>
          <marker id="pm-arrow-live-locked" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80"/>
          </marker>
          {/* Pending goal arrow */}
          <marker id="pm-arrow-pending" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#facc15"/>
          </marker>
        </defs>

        {/* ROV trail */}
        {rovPath.length > 1 && (
          <polyline
            points={rovPathPoints}
            fill="none" stroke="#22c55e" strokeWidth="1.5"
            strokeDasharray="4 3" strokeOpacity="0.6"
          />
        )}

        {/* Orientation arrows for committed waypoints */}
        {pathGoals.map(g => {
          const ui = toUI(g.rosX, g.rosY);
          const isActive = activeGoalId === g.id;
          const end = arrowEnd(ui.x, ui.y, g.yawDeg, 30);
          return (
            <line key={`arr-${g.id}`}
              x1={ui.x} y1={ui.y} x2={end.x} y2={end.y}
              stroke={isActive ? '#60a5fa' : '#a78bfa'}
              strokeWidth="2"
              markerEnd={isActive ? 'url(#pm-arrow-active)' : 'url(#pm-arrow)'}
            />
          );
        })}

        {/* ── Fix C: Pending goal arrow preview ─────────────────────────── */}
        {pendingGoal && (() => {
          const end = arrowEnd(pendingGoal.uiX, pendingGoal.uiY, pendingGoal.yawDeg, 36);
          return (
            <line
              x1={pendingGoal.uiX} y1={pendingGoal.uiY}
              x2={end.x} y2={end.y}
              stroke="#facc15" strokeWidth="2"
              strokeDasharray="4 2"
              markerEnd="url(#pm-arrow-pending)"
            />
          );
        })()}

        {/* ── Fix B: Live drag preview dengan visual feedback threshold ─── */}
        {dragState?.active && (() => {
          const dx = dragState.currentPx.x - dragState.originPx.x;
          const dy = dragState.currentPx.y - dragState.originPx.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 3) return null;

          const arrowLen = Math.min(dist * 0.75, 65);
          const end = arrowEnd(dragState.originPx.x, dragState.originPx.y, dragState.angleDeg, arrowLen);

          // Warna berubah: abu saat belum locked, hijau saat sudah melewati threshold
          const arrowColor   = orientationLocked ? '#4ade80' : '#c4b5fd';
          const arrowMarker  = orientationLocked ? 'url(#pm-arrow-live-locked)' : 'url(#pm-arrow-live)';
          const ringColor    = orientationLocked ? '#4ade80' : '#8b5cf6';
          const ringOpacity  = orientationLocked ? '0.8' : '0.45';

          // Circumference lingkaran panduan untuk stroke-dasharray progress
          const circumference = 2 * Math.PI * DRAG_GUIDE_RADIUS;
          const dashFilled = dragProgress * circumference;

          return (
            <g>
              {/* Lingkaran latar (track) */}
              <circle
                cx={dragState.originPx.x} cy={dragState.originPx.y}
                r={DRAG_GUIDE_RADIUS}
                fill="none"
                stroke={ringColor}
                strokeWidth="1.5"
                strokeOpacity="0.15"
              />
              {/* Lingkaran progress — mengisi sesuai seberapa jauh drag */}
              <circle
                cx={dragState.originPx.x} cy={dragState.originPx.y}
                r={DRAG_GUIDE_RADIUS}
                fill="none"
                stroke={ringColor}
                strokeWidth="2"
                strokeOpacity={ringOpacity}
                strokeDasharray={`${dashFilled} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${dragState.originPx.x} ${dragState.originPx.y})`}
              />
              {/* Direction arrow */}
              <line
                x1={dragState.originPx.x} y1={dragState.originPx.y}
                x2={end.x} y2={end.y}
                stroke={arrowColor} strokeWidth="2.5"
                markerEnd={arrowMarker}
              />
              {/* Label arah + status lock */}
              <text
                x={dragState.originPx.x + 24} y={dragState.originPx.y - 14}
                fill={arrowColor} fontSize="9" fontFamily="monospace" opacity="0.95"
              >
                {orientationLocked
                  ? `✓ ${yawToCompass(dragState.angleDeg)} (${dragState.angleDeg.toFixed(0)}°)`
                  : `... ${yawToCompass(dragState.angleDeg)} (${dragState.angleDeg.toFixed(0)}°)`}
              </text>
              {/* Hint teks "tarik lebih jauh" jika belum locked */}
              {!orientationLocked && (
                <text
                  x={dragState.originPx.x + 24} y={dragState.originPx.y - 2}
                  fill="#94a3b8" fontSize="8" fontFamily="monospace" opacity="0.7"
                >
                  tarik lebih jauh untuk kunci arah
                </text>
              )}
            </g>
          );
        })()}
      </svg>

      {/* Committed waypoint pins */}
      {pathGoals.map((g, idx) => {
        const ui = toUI(g.rosX, g.rosY);
        const isActive = activeGoalId === g.id;
        return (
          <div key={g.id}
            className="absolute z-20 pointer-events-none"
            style={{ left: ui.x, top: ui.y, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-black text-[9px] transition-all ${
              isActive
                ? 'bg-blue-500 border-blue-300 text-white shadow-lg shadow-blue-500/50 scale-110'
                : 'bg-purple-600/80 border-purple-400 text-white'
            }`}>
              {idx + 1}
            </div>
          </div>
        );
      })}

      {/* Ghost pin while dragging */}
      {dragState?.active && (() => {
        return (
          <div
            className="absolute z-30 pointer-events-none"
            style={{ left: dragState.originPx.x, top: dragState.originPx.y, transform: 'translate(-50%, -50%)' }}
          >
            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-black text-[9px] transition-colors ${
              orientationLocked
                ? 'bg-green-500/80 border-green-300 text-white'
                : dragDist > 3
                  ? 'bg-purple-500/50 border-purple-400/60 text-purple-200'
                  : 'bg-purple-600/30 border-purple-400/40 text-purple-400'
            }`}>
              {pathGoals.length + 1}
            </div>
          </div>
        );
      })()}

      {/* ── Fix C: Pending confirmation card ─────────────────────────────────
           Muncul setelah mouse up, sebelum user konfirmasi.
           Posisi: di atas titik waypoint, offset ke kanan jika dekat tepi kiri.       */}
      {pendingGoal && (() => {
        const cardW = 192;
        const cardH = 96;
        const offsetX = pendingGoal.uiX + cardW + 16 > size.w ? -(cardW + 12) : 12;
        const offsetY = pendingGoal.uiY - cardH - 8 < 0 ? 12 : -(cardH + 8);

        return (
          <>
            {/* Pin ghost untuk pending */}
            <div
              className="absolute z-40 pointer-events-none"
              style={{ left: pendingGoal.uiX, top: pendingGoal.uiY, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-7 h-7 rounded-full border-2 bg-yellow-500/80 border-yellow-300 text-white flex items-center justify-center font-black text-[9px] animate-pulse">
                {pathGoals.length + 1}
              </div>
            </div>

            {/* Confirmation card */}
            <div
              className="absolute z-50"
              style={{
                left: pendingGoal.uiX + offsetX,
                top: pendingGoal.uiY + offsetY,
                width: cardW,
              }}
              onMouseDown={e => e.stopPropagation()} // supaya klik di card tidak trigger mousedown peta
            >
              <div className="bg-[#0d1a2e] border border-yellow-500/40 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Header */}
                <div className="px-3 pt-2.5 pb-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">Konfirmasi Waypoint</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">
                    X:{pendingGoal.rosX.toFixed(2)} Y:{pendingGoal.rosY.toFixed(2)}
                  </p>
                </div>

                {/* Orientasi info */}
                <div className="px-3 py-2 flex items-center gap-2">
                  <div className={`text-base leading-none ${pendingGoal.yawDeg === 0 ? 'opacity-40' : ''}`}>
                    {/* Arrow unicode sesuai arah */}
                    {(() => {
                      const compass = yawToCompass(pendingGoal.yawDeg);
                      const arrows: Record<string, string> = { N:'↑', NE:'↗', E:'→', SE:'↘', S:'↓', SW:'↙', W:'←', NW:'↖' };
                      return arrows[compass] ?? '↑';
                    })()}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-200">
                      {pendingGoal.yawDeg === 0 ? 'Default North' : `${yawToCompass(pendingGoal.yawDeg)} (${pendingGoal.yawDeg.toFixed(0)}°)`}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {pendingGoal.yawDeg === 0 ? 'drag lebih jauh untuk set arah' : 'orientasi dari drag'}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex border-t border-white/5">
                  <button
                    onClick={cancelPendingGoal}
                    className="flex-1 py-2 text-[10px] font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    ✕ Batal
                  </button>
                  <div className="w-px bg-white/5" />
                  <button
                    onClick={confirmPendingGoal}
                    className="flex-1 py-2 text-[10px] font-bold text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-colors"
                  >
                    ✓ Simpan
                  </button>
                </div>
              </div>

              {/* Connector garis dari card ke titik */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: offsetX > 0 ? -12 : cardW,
                  top: offsetY > 0 ? -12 : cardH + 8,
                  width: 14, height: 14, overflow: 'visible',
                }}
              >
                <circle cx="0" cy="0" r="3" fill="#eab308" opacity="0.8"/>
              </svg>
            </div>
          </>
        );
      })()}

      {/* ROV */}
      <div
        className="absolute z-50 pointer-events-none transition-all duration-200"
        style={{
          left: rovUI.x,
          top: rovUI.y,
          transform: `translate(-50%, -50%) rotate(${-rovPos.yaw}deg)`,
          filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.6))',
        }}
      >
        <svg viewBox="0 0 40 40" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect x="2"  y="10" width="6"  height="6" rx="1" fill="#1e293b"/>
          <rect x="32" y="10" width="6"  height="6" rx="1" fill="#1e293b"/>
          <rect x="2"  y="24" width="6"  height="6" rx="1" fill="#1e293b"/>
          <rect x="32" y="24" width="6"  height="6" rx="1" fill="#1e293b"/>
          <rect x="6"  y="6"  width="8"  height="28" rx="3" fill="#38bdf8"/>
          <rect x="26" y="6"  width="8"  height="28" rx="3" fill="#38bdf8"/>
          <rect x="12" y="9"  width="16" height="22" rx="4" fill="#334155"/>
          <path d="M14 9 Q20 2 26 9 Z" fill="#eab308" opacity="0.9"/>
          <circle cx="20" cy="20" r="3"   fill="#0f172a"/>
          <circle cx="20" cy="20" r="1.5" fill="#f8fafc"/>
        </svg>
      </div>

      {/* Help hint */}
      {!disabled && pathGoals.length === 0 && !dragState && !pendingGoal && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-[10px] text-purple-300 border border-purple-500/20 pointer-events-none text-center whitespace-nowrap">
          🖱️ <strong>Klik &amp; tahan</strong> → tarik jauh untuk orientasi → <strong>lepas</strong> → konfirmasi
        </div>
      )}
    </div>
  );
};