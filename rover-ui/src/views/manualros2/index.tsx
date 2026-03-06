import React, { useState, useEffect, useRef } from 'react';
import * as ROSLIB from 'roslib';

export const ManualROS2: React.FC = () => {
  // --- 1. STATE UNTUK TUTORIAL (DENGAN MEMORI SESSION) ---
  const [showTutorial, setShowTutorial] = useState(() => {
    return sessionStorage.getItem('ros2_tutorial_done') !== 'true';
  });
  
  const [checks, setChecks] = useState([false, false]); 
  const isAllChecked = checks.every(Boolean);

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const finishTutorial = () => {
    sessionStorage.setItem('ros2_tutorial_done', 'true');
    window.location.reload(); 
  };

  // --- 2. STATE KONEKSI & THRUSTERS ---
  const [connStatus, setConnStatus] = useState("Menunggu Koneksi... ⏳");
  const ros = useRef<ROSLIB.Ros | null>(null);

  const [thrusters, setThrusters] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const thrustersRef = useRef<number[]>([0, 0, 0, 0, 0, 0]);

  const thrusterInfo = [
    { name: "Thruster 1", desc: "Depan Kanan (Horizontal)" },
    { name: "Thruster 2", desc: "Depan Kiri (Horizontal)" },
    { name: "Thruster 3", desc: "Belakang Kanan (Horizontal)" },
    { name: "Thruster 4", desc: "Belakang Kiri (Horizontal)" },
    { name: "Thruster 5", desc: "Vertikal Kanan (Atas/Bawah)" },
    { name: "Thruster 6", desc: "Vertikal Kiri (Atas/Bawah)" }
  ];

  // --- 3. STATE UNTUK FITUR INPUT OTOMATIS ---
  // PERBAIKAN: value sekarang bertipe 'string | number' agar bisa menerima tanda "-"
  const [autoInputs, setAutoInputs] = useState<Array<{ id: number; value: string | number }>>([{ id: 0, value: "" }]);

  // --- 4. KONEKSI KE ROSBRIDGE ---
  useEffect(() => {
    ros.current = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

    ros.current.on('connection', () => setConnStatus("Terhubung ke ROS2 Gazebo 🟢"));
    ros.current.on('error', () => setConnStatus("Error Koneksi 🔴"));
    ros.current.on('close', () => setConnStatus("Terputus 🔴"));

    return () => { if (ros.current) ros.current.close(); };
  }, []);

  // --- 5. FUNGSI PUBLISH KE ROS2 ---
  const sendThrusterCommand = (thrusterIndex: number, thrustValue: number) => {
    if (!ros.current) return;
    const thrusterTopic = new ROSLIB.Topic({
      ros: ros.current,
      name: `/bluerov2/cmd_thruster${thrusterIndex + 1}`,
      messageType: 'std_msgs/msg/Float64' 
    });
    thrusterTopic.publish({ data: thrustValue } as any);
  };

  // --- 6. CONTROL LOOP (KIRIM DATA TERUS-MENERUS) ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (ros.current && ros.current.isConnected) {
        thrustersRef.current.forEach((val, index) => {
          sendThrusterCommand(index, val);
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // --- 7. HANDLER SLIDER ---
  const handleSliderChange = (index: number, val: number) => {
    const newThrusters = [...thrusters];
    newThrusters[index] = val;
    setThrusters(newThrusters);
    thrustersRef.current = newThrusters;
  };

  const resetAllThrusters = () => {
    const neutral = [0, 0, 0, 0, 0, 0];
    setThrusters(neutral);
    thrustersRef.current = neutral;
  };

  // --- 8. HANDLER INPUT OTOMATIS DINAMIS ---
  const addAutoInputRow = () => {
    setAutoInputs([...autoInputs, { id: 0, value: "" }]);
  };

  const removeAutoInputRow = (indexToRemove: number) => {
    if (autoInputs.length > 1) {
      setAutoInputs(autoInputs.filter((_, index) => index !== indexToRemove));
    }
  };

  // PERBAIKAN: val sekarang bertipe 'any' agar bisa menyimpan teks asli dari input
  const updateAutoInput = (index: number, field: 'id' | 'value', val: any) => {
    const newInputs = [...autoInputs];
    newInputs[index][field] = val;
    setAutoInputs(newInputs);
  };

  const applyAllAutoInputs = () => {
    const newThrusters = [...thrusters];
    
    autoInputs.forEach(input => {
      // PERBAIKAN: Kita ubah ke angka hanya saat tombol APPLY ditekan
      const parsedValue = parseFloat(input.value.toString());
      const finalValue = isNaN(parsedValue) ? 0 : parsedValue; // Kalau kosong/error, anggap 0
      
      const safeValue = Math.max(-50, Math.min(50, finalValue));
      newThrusters[input.id] = safeValue;
    });
    
    setThrusters(newThrusters);
    thrustersRef.current = newThrusters;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-8 text-white relative">
      
      {/* MODAL PRE-FLIGHT CHECKLIST */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0e11]/70 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] mx-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-xl">📋</span>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">ROS 2 Initialization</h2>
            </div>
            <p className="text-slate-400 text-sm mb-8 border-b border-[#30363d] pb-4">
              Jalankan perintah berikut di terminal Ubuntu/WSL kamu untuk memulai simulasi Gazebo dan membuka akses jembatan komunikasi WebSocket.
            </p>

            <div className="space-y-4 mb-8">
              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[0] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                <input type="checkbox" checked={checks[0]} onChange={() => handleCheck(0)} className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 bg-gray-700 cursor-pointer" />
                <div className="flex-1">
                  <h3 className={`font-bold ${checks[0] ? 'text-blue-400' : 'text-slate-200'}`}>1. Terminal 1 (Jalankan Gazebo Simulator)</h3>
                  <div className="bg-black/60 p-3 mt-2 rounded text-[11px] font-mono text-green-400 border border-white/5 leading-relaxed">
                    source /opt/ros/jazzy/setup.bash<br/>
                    cd ~/rov_ws<br/>
                    source install/setup.bash<br/>
                    ros2 launch bluerov2_description world_launch.py spawn:=True
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${checks[1] ? 'bg-blue-900/10 border-blue-500/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                <input type="checkbox" checked={checks[1]} onChange={() => handleCheck(1)} className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-gray-900 bg-gray-700 cursor-pointer" />
                <div className="flex-1">
                  <h3 className={`font-bold ${checks[1] ? 'text-blue-400' : 'text-slate-200'}`}>2. Terminal 2 (Jalankan ROSBridge Server)</h3>
                  <div className="bg-black/60 p-3 mt-2 rounded text-[11px] font-mono text-green-400 border border-white/5 leading-relaxed">
                    source /opt/ros/jazzy/setup.bash<br/>
                    ros2 launch rosbridge_server rosbridge_websocket_launch.xml
                  </div>
                </div>
              </label>
            </div>

            <button 
              onClick={finishTutorial}
              disabled={!isAllChecked}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                isAllChecked 
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer translate-y-0' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isAllChecked ? '🚀 Restart Halaman & Mulai Kontrol' : 'Selesaikan Checklist Untuk Memulai'}
            </button>
          </div>
        </div>
      )}

      {/* HEADER UTAMA */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="font-black text-xl text-blue-400 uppercase tracking-wider flex items-center gap-3">
            <span className="bg-blue-600/20 text-blue-400 p-2 rounded-lg">⚙️</span>
            Manual Override (Direct Thrusters)
          </h2>
          <p className="text-sm font-mono mt-2">{connStatus}</p>
        </div>
        <button 
          onClick={resetAllThrusters}
          className="bg-red-500/20 text-red-500 hover:bg-red-500/40 border border-red-500/50 px-6 py-2 rounded font-bold transition-all uppercase text-sm tracking-widest"
        >
          🛑 EMERGENCY STOP ALL
        </button>
      </div>

      {/* PANEL INPUT OTOMATIS (DINAMIS BERBARIS) */}
      <div className="bg-[#161b22] p-6 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.05)]">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span>⚡</span> Antrean Perintah Thruster
          </h3>
          <button 
            onClick={addAutoInputRow}
            className="text-[10px] bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1.5 rounded border border-blue-500/30 transition-all uppercase font-bold"
          >
            + Tambah Target
          </button>
        </div>

        <div className="space-y-3">
          {autoInputs.map((input, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-black/40 p-3 rounded-lg border border-white/5">
              
              {/* Dropdown Thruster */}
              <div className="flex-1 w-full">
                {index === 0 && <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">🎯 PILIH TARGET THRUSTER</label>}
                <select 
                  value={input.id} 
                  onChange={(e) => updateAutoInput(index, 'id', parseInt(e.target.value))}
                  className="w-full bg-[#111827] border border-white/10 rounded-md px-3 py-2 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  {thrusterInfo.map((info, idx) => (
                    <option key={idx} value={idx}>{info.name} - {info.desc}</option>
                  ))}
                </select>
              </div>
              
              {/* Input Nilai */}
              <div className="flex-1 w-full">
                {index === 0 && <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">⚡ NILAI THRUST (-50 S/D 50)</label>}
                {/* PERBAIKAN DI SINI: e.target.value langsung diserahkan tanpa parseFloat */}
                <input 
                  type="text" 
                  value={input.value} 
                  onChange={(e) => updateAutoInput(index, 'value', e.target.value)}
                  placeholder="Contoh: -25.5"
                  className="w-full bg-[#111827] border border-white/10 rounded-md px-3 py-2 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tombol Hapus Baris */}
              <div className={`flex items-center justify-center ${index === 0 ? 'mt-4' : ''}`}>
                <button 
                  onClick={() => removeAutoInputRow(index)}
                  disabled={autoInputs.length === 1}
                  className={`p-2 rounded-md transition-all ${autoInputs.length === 1 ? 'text-slate-700 cursor-not-allowed' : 'text-red-500 hover:bg-red-500/20 hover:border-red-500/50 border border-transparent'}`}
                  title="Hapus baris ini"
                >
                  🗑️
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* TOMBOL APPLY MASTER */}
        <div className="mt-5 flex justify-end border-t border-white/5 pt-4">
          <button 
            onClick={applyAllAutoInputs}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-12 rounded-lg transition-colors uppercase text-xs tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            APPLY OTOMATIS SEMUA
          </button>
        </div>
      </div>

      {/* THRUSTER CONTROL MATRIX (Slider) */}
      <div className="bg-[#111827] p-8 rounded-xl border border-white/5 shadow-2xl">
        <h3 className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs border-b border-white/5 pb-2">
          Direct Thruster Control Matrix
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {thrusters.map((value, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">
                      {thrusterInfo[index].name}
                    </label>
                    <span className="text-[9px] font-mono text-blue-500/70 uppercase">
                      {thrusterInfo[index].desc}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleSliderChange(index, 0)}
                    className="ml-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded px-1.5 py-0.5 text-[10px] transition-colors"
                  >
                    ↺
                  </button>
                </div>
                <div className="w-16 bg-black/60 border border-white/10 rounded px-2 py-1 text-xs font-mono text-center text-blue-400">
                  {value.toFixed(1)}
                </div>
              </div>
              <input 
                type="range" min="-50.0" max="50.0" step="0.5" 
                value={value} 
                onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
                onDoubleClick={() => handleSliderChange(index, 0)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManualROS2;