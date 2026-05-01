import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { 
  Cpu, Info, DownloadCloud, RotateCcw, Zap, CheckCircle2, Loader2, 
  Waves, Car, Plane, Fan, ChevronDown, Shield, FlaskConical, Code, UploadCloud 
} from 'lucide-react';

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
  
  // --- STATE UNTUK CUSTOM DROPDOWN ---
  const [openDropdown, setOpenDropdown] = useState<'vehicle' | 'firmware' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- STATE UNTUK UI FEEDBACK ---
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  // Menutup dropdown kalau user klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==========================================
  // DATA OPTIONS UNTUK DROPDOWN
  // ==========================================
  const vehicleOptions = [
    { value: 'ArduSub', label: 'ArduSub (Submarine/ROV)', icon: Waves },
    { value: 'ArduRover', label: 'ArduRover (Ground/Surface)', icon: Car },
    { value: 'ArduCopter', label: 'ArduCopter (Multirotor)', icon: Fan },
    { value: 'ArduPlane', label: 'ArduPlane (Fixed Wing)', icon: Plane },
  ];

  const firmwareOptions = [
    { value: 'Stable', label: 'Stable (Recommended for operations)', icon: Shield },
    { value: 'Beta', label: 'Beta (Testing new features)', icon: FlaskConical },
    { value: 'Development', label: 'Development (Unstable / Master)', icon: Code },
    { value: 'Custom', label: 'Upload Custom File (.apj)', icon: UploadCloud },
  ];

  // ==========================================
  // LOGIKA TEMA & STYLING
  // ==========================================
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-950'; 
  const subTextColor = isDarkMode ? 'text-slate-300' : 'text-slate-700'; 
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-600'; 
  const valueColor = isDarkMode ? 'text-white' : 'text-slate-900'; 

  const cardBg = isDarkMode 
    ? 'bg-[#111827]/60 border-white/10 backdrop-blur-xl shadow-2xl hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
    : 'bg-white border-slate-200 shadow-xl hover:border-blue-400 hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)]'; 
    
  const infoBg = isDarkMode 
    ? 'bg-gradient-to-r from-blue-900/20 to-transparent border-blue-500/20 backdrop-blur-xl shadow-lg' 
    : 'bg-gradient-to-r from-blue-50 to-white border-blue-200 shadow-sm'; 
    
  const cardHeaderBg = isDarkMode 
    ? 'border-white/10 bg-white/5' 
    : 'border-slate-200 bg-slate-50'; 
    
  const innerBoxBg = isDarkMode 
    ? 'bg-black/40 border-white/10 hover:bg-black/60 hover:border-blue-500/30' 
    : 'bg-slate-100 border-slate-200 shadow-inner hover:bg-slate-50 hover:border-blue-300'; 

  const inputBg = isDarkMode
    ? 'bg-black/40 border-white/10 text-white hover:border-white/30'
    : 'bg-slate-50 border-slate-300 text-slate-900 hover:border-slate-400';

  const dropdownMenuBg = isDarkMode
    ? 'bg-[#1e293b] border-slate-700 shadow-2xl'
    : 'bg-white border-slate-200 shadow-xl';

  const dropdownItemHover = isDarkMode
    ? 'hover:bg-slate-800 text-slate-200'
    : 'hover:bg-slate-100 text-slate-700';

  // Fungsi Flashing
  const handleFlashFirmware = () => {
    setIsFlashing(true);
    setProgress(0);
    setStatusMessage('Initializing flashing sequence...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5; 
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
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

          setTimeout(() => setStatusMessage(''), 5000);
        }, 600);
      }
      
      setProgress(currentProgress);
      if (currentProgress < 30) setStatusMessage('Erasing old firmware...');
      else if (currentProgress < 80) setStatusMessage('Writing new firmware blocks...');
      else if (currentProgress < 100) setStatusMessage('Verifying checksum...');
    }, 400); 
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCustomFile(e.target.files[0]);
      setFirmwareType('Custom');
    }
  };

  const selectedVehicle = vehicleOptions.find(opt => opt.value === vehicleType);
  const selectedFirmware = firmwareOptions.find(opt => opt.value === firmwareType);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-2 font-['Inter',sans-serif] antialiased">
      <div className="max-w-6xl mx-auto w-full">

        {/* HEADER SECTION */}
        <div className="flex items-center gap-5 mb-8 group">
          <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
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
        <div className={`border rounded-2xl p-6 mb-10 w-full transition-all duration-300 ${infoBg}`}>
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
                <span className={`${isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-300'} px-2 py-0.5 rounded border font-black shadow-[0_0_10px_rgba(59,130,246,0.2)]`}>ArduPilot Supported</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">

          {/* KIRI: CURRENT STATUS */}
          <div className={`md:col-span-5 border rounded-3xl overflow-hidden transition-all duration-500 group relative ${cardBg}`}>
            <div className={`absolute -inset-10 bg-gradient-to-r from-blue-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
            
            <div className={`relative p-8 flex flex-col items-center border-b transition-colors duration-300 z-10 ${cardHeaderBg}`}>
               <div className={`p-4 rounded-full mb-3 group-hover:scale-110 transition-transform shadow-lg ${isDarkMode ? 'bg-emerald-500/10 shadow-emerald-500/20' : 'bg-emerald-100 shadow-emerald-500/20'}`}>
                  <CheckCircle2 className={`w-10 h-10 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
               </div>
               <h2 className={`font-heading text-2xl font-black tracking-tighter uppercase transition-colors duration-300 ${titleColor}`}>
                 Current Status
               </h2>
               <span className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full mt-2 transition-colors ${isDarkMode ? 'text-blue-300 bg-blue-500/20 border border-blue-500/30 group-hover:bg-blue-500/30' : 'text-blue-800 bg-blue-100 border border-blue-300 group-hover:bg-blue-200'}`}>
                 Active Profile
               </span>
            </div>

            <div className="relative p-6 space-y-4 z-10">
              <div className={`p-4 rounded-xl border transition-all duration-300 flex justify-between items-center ${innerBoxBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${labelColor}`}>Controller Board</span>
                <span className={`font-mono font-bold text-sm ${valueColor}`}>{currentStatus.board}</span>
              </div>
              <div className={`p-4 rounded-xl border transition-all duration-300 flex justify-between items-center ${innerBoxBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${labelColor}`}>Vehicle Type</span>
                <span className={`font-mono font-bold text-sm ${valueColor}`}>{currentStatus.vehicle}</span>
              </div>
              <div className={`p-4 rounded-xl border transition-all duration-300 flex justify-between items-center ${innerBoxBg}`}>
                <span className={`text-[10px] uppercase font-bold tracking-widest ${labelColor}`}>Firmware Version</span>
                <span className={`font-mono font-bold text-sm text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]`}>{currentStatus.version}</span>
              </div>
            </div>
          </div>

          {/* KANAN: UPDATE FIRMWARE */}
          {/* PERBAIKAN: Menghapus overflow-hidden di sini supaya dropdown tidak terpotong */}
          <div className={`md:col-span-7 border rounded-3xl transition-all duration-500 relative ${cardBg}`}>
            {/* PERBAIKAN: Menambahkan rounded-t-3xl agar sudut atas tetap melengkung rapi */}
            <div className={`relative p-6 md:p-8 border-b flex items-center gap-4 transition-colors duration-300 z-10 rounded-t-3xl ${cardHeaderBg}`}>
               <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                 <DownloadCloud className={`w-6 h-6 md:w-8 md:h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
               </div>
               <div>
                 <h2 className={`font-heading text-xl md:text-2xl font-black tracking-tighter uppercase ${titleColor}`}>
                   Firmware Update
                 </h2>
                 <p className={`text-[11px] font-bold tracking-widest uppercase ${labelColor}`}>Configure & Flash</p>
               </div>
            </div>

            <div className={`relative p-6 md:p-8 space-y-6 transition-opacity duration-300 z-10 ${isFlashing ? 'opacity-90' : ''}`} ref={dropdownRef}>
              
              {/* Custom Dropdown: Vehicle Type */}
              <div className="space-y-2 relative">
                <label className={`text-[10px] uppercase font-bold tracking-widest block ${labelColor}`}>
                  Select Vehicle Type
                </label>
                <div 
                  onClick={() => !isFlashing && setOpenDropdown(openDropdown === 'vehicle' ? null : 'vehicle')}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all font-medium text-sm select-none ${inputBg} ${isFlashing ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'} ${openDropdown === 'vehicle' ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {selectedVehicle && <selectedVehicle.icon size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
                    <span>{selectedVehicle?.label}</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'vehicle' ? 'rotate-180 text-blue-500' : 'opacity-50'}`} />
                </div>
                
                {openDropdown === 'vehicle' && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 ${dropdownMenuBg}`}>
                    {vehicleOptions.map((opt) => (
                      <div 
                        key={opt.value}
                        onClick={() => {
                          setVehicleType(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors text-sm font-medium ${dropdownItemHover} ${vehicleType === opt.value ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700') : ''}`}
                      >
                        <opt.icon size={18} className={vehicleType === opt.value ? 'opacity-100' : 'opacity-60'} />
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Dropdown: Firmware Build */}
              <div className="space-y-2 relative">
                <label className={`text-[10px] uppercase font-bold tracking-widest block ${labelColor}`}>
                  Firmware Build
                </label>
                <div 
                  onClick={() => !isFlashing && setOpenDropdown(openDropdown === 'firmware' ? null : 'firmware')}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all font-medium text-sm select-none ${inputBg} ${isFlashing ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'} ${openDropdown === 'firmware' ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {selectedFirmware && <selectedFirmware.icon size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
                    <span>{selectedFirmware?.label}</span>
                  </div>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'firmware' ? 'rotate-180 text-blue-500' : 'opacity-50'}`} />
                </div>

                {openDropdown === 'firmware' && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 shadow-2xl ${dropdownMenuBg}`}>
                    {firmwareOptions.map((opt) => (
                      <div 
                        key={opt.value}
                        onClick={() => {
                          setFirmwareType(opt.value);
                          setOpenDropdown(null);
                        }}
                        className={`p-4 flex items-center gap-3 cursor-pointer transition-colors text-sm font-medium ${dropdownItemHover} ${firmwareType === opt.value ? (isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700') : ''}`}
                      >
                        <opt.icon size={18} className={firmwareType === opt.value ? 'opacity-100' : 'opacity-60'} />
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input File untuk Custom Firmware */}
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
                    className={`w-full p-3 rounded-xl border transition-all outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${inputBg} ${isFlashing ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                  />
                </div>
              )}

              {/* Alert Status & Progress Bar */}
              {statusMessage && (
                <div className={`overflow-hidden rounded-xl border transition-all animate-in fade-in zoom-in-95 ${
                  statusMessage.includes('Successfully') 
                    ? (isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200')
                    : (isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200')
                }`}>
                  <div className={`p-4 flex items-center gap-3 font-medium text-sm ${
                    statusMessage.includes('Successfully') 
                      ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700')
                      : (isDarkMode ? 'text-blue-400' : 'text-blue-700')
                  }`}>
                    {isFlashing ? <Loader2 className="animate-spin w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                    <span className="truncate">{statusMessage}</span>
                    {isFlashing && <span className="ml-auto font-mono font-bold text-xs">{progress}%</span>}
                  </div>
                  
                  {isFlashing && (
                    <div className={`h-1.5 w-full ${isDarkMode ? 'bg-blue-950' : 'bg-blue-100'}`}>
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 border-t border-white/10 relative z-0">
                <button 
                  onClick={handleFlashFirmware} 
                  disabled={isFlashing}
                  className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 relative overflow-hidden ${
                    isFlashing 
                      ? (isDarkMode ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-500 cursor-not-allowed')
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                  }`}
                >
                  {isFlashing ? (
                    <>
                      <Loader2 size={16} className="animate-spin relative z-10" />
                      <span className="relative z-10">Writing Firmware...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Flash Firmware
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => alert('Restore Default Parameters feature triggered.')}
                  disabled={isFlashing}
                  className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold uppercase tracking-wider text-xs border transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white hover:border-slate-500' 
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700 hover:border-slate-400'
                  } ${isFlashing ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <RotateCcw size={16} className={isFlashing ? '' : 'hover:-rotate-90 transition-transform duration-300'} />
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