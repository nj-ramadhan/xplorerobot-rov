import React, { useState, ChangeEvent } from 'react';
import { Cpu, Info, DownloadCloud, RotateCcw, Zap, CheckCircle2 } from 'lucide-react';

interface FirmwareProps {
  isDarkMode?: boolean;
}

const AutopilotFirmware: React.FC<FirmwareProps> = ({ isDarkMode = true }) => {
  // --- STATE UNTUK CURRENT STATUS ---
  const [currentStatus, setCurrentStatus] = useState({
    board: 'Navigator',
    vehicle: 'ArduSub',
    version: '4.1.0 (Stable)'
  });

  // --- STATE UNTUK FORM UPDATE ---
  const [vehicleType, setVehicleType] = useState<string>('ArduSub');
  const [firmwareType, setFirmwareType] = useState<string>('Stable');
  const [customFile, setCustomFile] = useState<File | null>(null);
  
  // --- STATE UNTUK UI FEEDBACK ---
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // ==========================================
  // LOGIKA TEMA: OTOMATIS MENYESUAIKAN DARK/LIGHT MODE (Diambil dari PingSonarView)
  // ==========================================
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-950'; 
  const subTextColor = isDarkMode ? 'text-slate-300' : 'text-slate-700'; 
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600'; 
  const valueColor = isDarkMode ? 'text-white' : 'text-slate-900'; 

  const cardBg = isDarkMode 
    ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-2xl' 
    : 'bg-white border-slate-200 shadow-xl'; 
    
  const infoBg = isDarkMode 
    ? 'bg-[#111827]/40 border-white/5 backdrop-blur-xl shadow-lg' 
    : 'bg-blue-50 border-blue-200 shadow-sm'; 
    
  const cardHeaderBg = isDarkMode 
    ? 'border-white/10 bg-white/5' 
    : 'border-slate-200 bg-slate-50'; 
    
  const innerBoxBg = isDarkMode 
    ? 'bg-black/40 border-white/10' 
    : 'bg-slate-100 border-slate-200 shadow-inner'; 

  const inputBg = isDarkMode
    ? 'bg-black/40 border-white/10 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  // Fungsi Flashing
  const handleFlashFirmware = () => {
    setIsFlashing(true);
    setStatusMessage('Flashing in progress... Do not disconnect power.');

    setTimeout(() => {
      setIsFlashing(false);
      setStatusMessage(`Successfully flashed ${vehicleType} (${firmwareType})!`);
      
      setCurrentStatus({
        board: 'Navigator',
        vehicle: vehicleType,
        version: firmwareType === 'Custom' && customFile 
          ? `Custom (${customFile.name})` 
          : `Latest (${firmwareType})`
      });

      setTimeout(() => setStatusMessage(''), 4000);
    }, 3000); 
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCustomFile(e.target.files[0]);
      setFirmwareType('Custom');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2 font-['Inter',sans-serif] antialiased">
      <div className="max-w-6xl mx-auto w-full">

        {/* HEADER SECTION */}
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Cpu size={32} className="text-white" />
          </div>
          <div>
            <h1 className={`font-heading text-3xl md:text-4xl font-black tracking-tight uppercase transition-colors duration-300 ${titleColor}`}>
              Autopilot Firmware
            </h1>
            <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold transition-colors duration-300 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Manage Flight Controller Software
            </p>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className={`border rounded-2xl p-6 mb-10 w-full transition-colors duration-300 ${infoBg}`}>
          <div className="flex gap-4">
            <div className={`p-2 rounded-lg h-fit border shrink-0 ${isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-200'}`}>
              <Info className={isDarkMode ? 'text-blue-400' : 'text-blue-700'} size={20} />
            </div>
            <div className="space-y-3">
              <p className={`text-sm leading-relaxed font-medium transition-colors duration-300 ${subTextColor}`}>
                Update and manage the core firmware running on your vehicle's flight controller. 
                Ensure a stable power supply and network connection before initiating any flashing process to prevent hardware corruption.
              </p>
              <div className={`flex items-center flex-wrap gap-4 text-[10px] font-mono uppercase tracking-wider font-bold transition-colors duration-300 ${labelColor}`}>
                <span>Hardware: <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-black`}>Navigator Flight Board</span></span>
                <span className="hidden sm:inline">|</span>
                <span className={`${isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-300'} px-2 py-0.5 rounded border font-black`}>ArduPilot Supported</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">

          {/* KIRI: CURRENT STATUS (Lebar 5/12 kolom) */}
          <div className={`md:col-span-5 border rounded-3xl overflow-hidden transition-all duration-300 group ${cardBg}`}>
            <div className={`p-8 flex flex-col items-center border-b transition-colors duration-300 ${cardHeaderBg}`}>
               <div className={`p-4 rounded-full mb-3 group-hover:scale-110 transition-transform ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <CheckCircle2 className={`w-10 h-10 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
               </div>
               <h2 className={`font-heading text-2xl font-black tracking-tighter uppercase transition-colors duration-300 ${titleColor}`}>
                 Current Status
               </h2>
               <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full mt-2 ${isDarkMode ? 'text-blue-300 bg-blue-500/20 border border-blue-500/30' : 'text-blue-800 bg-blue-100 border border-blue-300'}`}>
                 Active Profile
               </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Data Board */}
              <div className={`p-4 rounded-xl border transition-colors duration-300 flex justify-between items-center ${innerBoxBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${labelColor}`}>Controller Board</span>
                <span className={`font-mono font-bold text-sm ${valueColor}`}>{currentStatus.board}</span>
              </div>
              
              {/* Data Vehicle */}
              <div className={`p-4 rounded-xl border transition-colors duration-300 flex justify-between items-center ${innerBoxBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${labelColor}`}>Vehicle Type</span>
                <span className={`font-mono font-bold text-sm ${valueColor}`}>{currentStatus.vehicle}</span>
              </div>

              {/* Data Version */}
              <div className={`p-4 rounded-xl border transition-colors duration-300 flex justify-between items-center ${innerBoxBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${labelColor}`}>Firmware Version</span>
                <span className={`font-mono font-bold text-sm text-emerald-500`}>{currentStatus.version}</span>
              </div>
            </div>
          </div>

          {/* KANAN: UPDATE FIRMWARE (Lebar 7/12 kolom) */}
          <div className={`md:col-span-7 border rounded-3xl overflow-hidden transition-all duration-300 ${cardBg}`}>
            <div className={`p-6 md:p-8 border-b flex items-center gap-4 transition-colors duration-300 ${cardHeaderBg}`}>
               <DownloadCloud className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
               <div>
                 <h2 className={`font-heading text-xl md:text-2xl font-black tracking-tighter uppercase ${titleColor}`}>
                   Firmware Update
                 </h2>
                 <p className={`text-[11px] font-bold tracking-widest uppercase ${labelColor}`}>Configure & Flash</p>
               </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              {/* Input: Vehicle Type */}
              <div className="space-y-2">
                <label className={`text-[10px] uppercase font-bold tracking-widest block ${labelColor}`}>
                  Select Vehicle Type
                </label>
                <select 
                  value={vehicleType} 
                  onChange={(e) => setVehicleType(e.target.value)}
                  disabled={isFlashing}
                  className={`w-full p-4 rounded-xl border appearance-none transition-colors outline-none font-medium text-sm ${inputBg} ${isFlashing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="ArduSub">🌊 ArduSub (Submarine/ROV)</option>
                  <option value="ArduRover">🚗 ArduRover (Ground/Surface)</option>
                  <option value="ArduCopter">🚁 ArduCopter (Multirotor)</option>
                  <option value="ArduPlane">✈️ ArduPlane (Fixed Wing)</option>
                </select>
              </div>

              {/* Input: Firmware Version */}
              <div className="space-y-2">
                <label className={`text-[10px] uppercase font-bold tracking-widest block ${labelColor}`}>
                  Firmware Build
                </label>
                <select 
                  value={firmwareType} 
                  onChange={(e) => setFirmwareType(e.target.value)}
                  disabled={isFlashing || (customFile !== null && firmwareType === 'Custom')}
                  className={`w-full p-4 rounded-xl border appearance-none transition-colors outline-none font-medium text-sm ${inputBg} ${isFlashing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="Stable">Stable (Recommended for operations)</option>
                  <option value="Beta">Beta (Testing new features)</option>
                  <option value="Development">Development (Unstable / Master)</option>
                  <option value="Custom">Upload Custom File (.apj)</option>
                </select>
              </div>

              {/* Input: Custom File (Only shows if Custom is selected) */}
              {firmwareType === 'Custom' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className={`text-[10px] uppercase font-bold tracking-widest block ${labelColor}`}>
                    Custom Firmware File
                  </label>
                  <input 
                    type="file" 
                    accept=".apj,.px4" 
                    onChange={handleFileChange}
                    disabled={isFlashing}
                    className={`w-full p-3 rounded-xl border transition-colors outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${inputBg}`}
                  />
                </div>
              )}

              {/* Alert Status */}
              {statusMessage && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 font-medium text-sm animate-in fade-in ${
                  statusMessage.includes('Successfully') 
                    ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700')
                    : (isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700')
                }`}>
                  {isFlashing ? <Zap className="animate-pulse w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  {statusMessage}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 border-t border-white/10">
                <button 
                  onClick={handleFlashFirmware} 
                  disabled={isFlashing}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 ${
                    isFlashing 
                      ? 'bg-slate-600 text-slate-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                  }`}
                >
                  <Zap size={16} className={isFlashing ? 'animate-pulse' : ''} />
                  {isFlashing ? 'Writing Firmware...' : 'Flash Firmware'}
                </button>
                
                <button 
                  onClick={() => alert('Restore Default Parameters feature triggered.')}
                  disabled={isFlashing}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white' 
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  } ${isFlashing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RotateCcw size={16} />
                  Restore Defaults
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AutopilotFirmware;