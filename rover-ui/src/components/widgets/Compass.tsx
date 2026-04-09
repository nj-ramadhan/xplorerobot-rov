import React from 'react';

interface CompassProps {
  heading: number;
}

export const Compass: React.FC<CompassProps> = ({ heading }) => {
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);

  return (
    <div className="rov-card p-5">
      <div className="label-xs mb-3">HEADING</div>
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 200 200" width="100%" height="100%">
            {/* Outer rings */}
            <circle cx="100" cy="100" r="95" fill="none" stroke="#1e3a5f" strokeWidth="2"/>
            <circle cx="100" cy="100" r="88" fill="#060d1a" stroke="#0a2040" strokeWidth="1"/>

            {/* Degree ticks */}
            {ticks.map(deg => {
              const rad = (deg - 90) * Math.PI / 180;
              const isMajor = deg % 30 === 0;
              const r1 = 88, r2 = isMajor ? 75 : 80;
              return (
                <line key={deg}
                  x1={100 + r1 * Math.cos(rad)} y1={100 + r1 * Math.sin(rad)}
                  x2={100 + r2 * Math.cos(rad)} y2={100 + r2 * Math.sin(rad)}
                  stroke={isMajor ? "#1e88e5" : "#1e3a5f"}
                  strokeWidth={isMajor ? 1.5 : 0.8}
                />
              );
            })}

            {/* Cardinal labels */}
            {dirs.map((d, i) => {
              const deg = i * 45;
              const rad = (deg - 90) * Math.PI / 180;
              const r = 68;
              const isMain = i % 2 === 0;
              return (
                <text key={d}
                  x={100 + r * Math.cos(rad)}
                  y={100 + r * Math.sin(rad)}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isMain ? "#60a5fa" : "#1e88e5"}
                  fontSize={isMain ? 10 : 7}
                  fontFamily="'Share Tech Mono', monospace"
                  fontWeight="bold"
                >{d}</text>
              );
            })}

            {/* Rotating needle */}
            <g transform={`rotate(${heading}, 100, 100)`}>
              <polygon points="100,25 96,100 104,100" fill="#ef4444"/>
              <polygon points="100,175 96,100 104,100" fill="#1e3a5f"/>
              <circle cx="100" cy="100" r="5" fill="#1e88e5"/>
            </g>

            {/* Heading value */}
            <text x="100" y="140" textAnchor="middle" fill="#60a5fa"
              fontSize="18" fontFamily="'Share Tech Mono', monospace" fontWeight="bold">
              {String(Math.round(heading)).padStart(3, "0")}°
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};