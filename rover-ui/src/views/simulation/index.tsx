import React, { useState, useEffect } from 'react';

export const Simulation: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resetComplete, setResetComplete] = useState(false);

  // Fungsi saat tombol restart diklik
  const handleResetClick = () => {
    if (isResetting || resetComplete) return;
    setIsResetting(true);
    setProgress(0);
  };

  // Fungsi untuk kembali ke tampilan awal
  const handleAcknowledge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResetComplete(false);
    setProgress(0);
  };

  // Efek simulasi loading bar untuk restart node
  useEffect(() => {
    if (isResetting) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = oldProgress + Math.floor(Math.random() * 20) + 10;
          if (newProgress >= 100) {
            clearInterval(timer);
            setIsResetting(false);
            setResetComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 400);

      return () => clearInterval(timer);
    }
  }, [isResetting]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Halaman */}
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="font-display font-black text-xl text-white uppercase tracking-wider flex items-center gap-3">
          <span className="bg-blue-600 p-2 rounded-lg text-xl shadow-[0_0_15px_rgba(37,99,235,0.5)]">🌊</span>
          Gazebo Simulation
        </h2>
        <p className="text-[11px] font-mono text-slate-400 mt-2 uppercase tracking-widest">
          SITL Environment & ROS 2 Node Manager
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel Kiri: Informasi Status Gazebo & ROS 2 */}
        <div className="bg-[#111827] p-6 rounded-xl border border-white/5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-4 border-b border-white/5 pb-2">Environment Status</h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ROS 2 Distro:</span>
                <span className="text-green-400 font-bold">Jazzy Jalisco</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Physics Engine:</span>
                <span className="text-white">Gazebo Harmonic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active World:</span>
                <span className="text-white">underwater_arena.world</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bridge Status:</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">CONNECTED</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-[10px] text-slate-600 font-mono border-t border-white/5 pt-2 flex justify-between">
            <span>Domain ID: 0</span>
            <span>Localhost (127.0.0.1)</span>
          </div>
        </div>

        {/* Panel Kanan: Area Kontrol Restart */}
        <div 
          onClick={handleResetClick}
          className={`relative bg-[#111827] p-6 rounded-xl border shadow-lg flex flex-col items-center justify-center text-center transition-all min-h-[220px] overflow-hidden ${
            isResetting || resetComplete 
              ? 'border-blue-500/50 cursor-default' 
              : 'border-dashed border-slate-600 hover:bg-white/5 hover:border-blue-500 cursor-pointer group'
          }`}
        >
          {/* STATE 1: Default (Siap Restart) */}
          {!isResetting && !resetComplete && (
            <div className="animate-in zoom-in duration-300">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors text-2xl mb-4 mx-auto shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                🔄
              </div>
              <h3 className="text-sm font-bold text-slate-200">Restart Simulation</h3>
              <p className="text-[10px] text-slate-500 mt-2 max-w-[200px] mx-auto">
                Click here to restart Gazebo physics and re-initialize ROS 2 nodes.
              </p>
            </div>
          )}

          {/* STATE 2: Sedang Restart (Loading Bar) */}
          {isResetting && (
            <div className="w-full max-w-[250px] animate-in fade-in duration-300">
              <div className="text-2xl mb-2 animate-spin w-8 h-8 mx-auto">⚙️</div>
              <h3 className="text-xs font-bold text-blue-400 mb-4 font-mono uppercase tracking-widest">
                Killing Nodes...
              </h3>
              
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-2 text-[10px] font-mono">
                <span className="text-slate-500">Respawning Robot</span>
                <span className="text-blue-400 font-bold">{progress}%</span>
              </div>
            </div>
          )}

          {/* STATE 3: Selesai Restart */}
          {resetComplete && (
            <div className="w-full animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 text-3xl mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                ✓
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Simulation Ready</h3>
              <p className="text-[10px] text-slate-400 font-mono mb-6">ROS 2 nodes successfully connected.</p>
              
              <button 
                onClick={handleAcknowledge}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition-colors border border-white/10 active:scale-95"
              >
                Continue
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Simulation;