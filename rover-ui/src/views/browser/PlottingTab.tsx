import React from 'react';

// Interface untuk menangkap saklar tema dari LogBrowser
interface PlottingTabProps {
  isDarkMode?: boolean;
}

const PlottingTab: React.FC<PlottingTabProps> = ({ isDarkMode = true }) => {
  
  // ==========================================
  // LOGIKA TEMA BUNGLON
  // ==========================================
  const mutedText = isDarkMode ? 'text-slate-500' : 'text-slate-400';
  const legendText = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  
  // Area Grafik Utama
  const graphContainer = isDarkMode 
    ? 'border-white/10 bg-black/20' 
    : 'border-slate-200 bg-white shadow-sm';
    
  // Sumbu Y Kiri & Kanan (Lebih lebar biar tulisan nggak kepotong)
  const axisBg = isDarkMode 
    ? 'border-white/10 bg-[#111827]/80' 
    : 'border-slate-200 bg-slate-50/90';
    
  const axisRedText = isDarkMode ? 'text-red-500/60' : 'text-red-500';
  const gridLine = isDarkMode ? 'border-white/5' : 'border-slate-100';
  
  // Timeline Bawah
  const timelineBorder = isDarkMode ? 'border-white/10' : 'border-slate-200';
  const timelineBg = isDarkMode ? 'bg-black/30' : 'bg-slate-50';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-['Inter',sans-serif]">
      
      <div className={`text-center text-sm mb-4 italic transition-colors duration-300 ${mutedText}`}>
        Click to enter Plot title
      </div>
      
      <div className="flex justify-center gap-6 mb-6">
        <div className={`flex items-center gap-2 text-sm font-mono font-bold transition-colors duration-300 ${legendText}`}>
          <div className="w-4 h-0.5 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div> ATT.Roll
        </div>
        <div className={`flex items-center gap-2 text-sm font-mono font-bold transition-colors duration-300 ${legendText}`}>
          <div className="w-4 h-0.5 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div> ATT.Pitch
        </div>
      </div>

      <div className={`flex-1 border relative flex items-end justify-center pb-8 rounded-xl transition-colors duration-300 overflow-hidden ${graphContainer}`}>
        
        {/* Y Axis Left - Diperlebar jadi w-16 (64px) */}
        <div className={`absolute left-0 top-0 bottom-0 w-16 border-r flex flex-col justify-between py-4 text-[9px] text-center z-10 font-bold transition-colors duration-300 backdrop-blur-sm ${axisBg} ${axisRedText}`}>
          
          {/* Tulisan diputar miring secara normal (-90 derajat), tanpa efek writing-vertical */}
          <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-bold tracking-widest uppercase text-[10px] transition-colors duration-300 ${mutedText}`}>
            ATT.Roll, ATT.Pitch
          </span>
          
          <span className="px-1">MANUAL</span>
        </div>
        
        {/* Y Axis Right - Diperlebar jadi w-16 (64px) */}
        <div className={`absolute right-0 top-0 bottom-0 w-16 border-l flex flex-col justify-between py-4 text-[9px] text-center z-10 font-bold transition-colors duration-300 backdrop-blur-sm ${axisBg} ${axisRedText}`}>
          <span className="px-1">STABILIZE</span>
          <span className="px-1">MANUAL</span>
        </div>

        {/* Grid Lines - Margin kiri-kanan disesuaikan dengan lebar w-16 (4rem) */}
        <div className="absolute inset-0 left-16 right-16 flex flex-col justify-between pointer-events-none py-8">
          {[...Array(6)].map((_,i) => (
            <div key={i} className={`border-b w-full h-0 transition-colors duration-300 ${gridLine}`}></div>
          ))}
        </div>

        {/* SVG Graph Dummy - Lebarnya disesuaikan (100% - 8rem untuk kiri & kanan) */}
        <svg className="absolute inset-0 left-16 right-16 w-[calc(100%-8rem)] h-full drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,50 L10,50 L12,20 L15,80 L20,30 L25,70 L30,45 L35,55 L40,50 L55,50 L60,10 L65,80 L70,40 L75,60 L80,50 L100,50" fill="none" stroke="#2563eb" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <path d="M0,60 L10,60 L12,30 L15,90 L20,40 L25,80 L30,55 L35,65 L40,60 L55,60 L60,20 L65,90 L70,50 L75,70 L80,60 L100,60" fill="none" stroke="#f97316" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      {/* Bottom Timeline Preview */}
      <div className={`h-16 mt-6 border relative rounded-xl overflow-hidden transition-colors duration-300 ${timelineBorder}`}>
        <svg className={`w-full h-full transition-colors duration-300 ${timelineBg}`} preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M10,50 L12,20 L15,80 L20,30 L25,70 L30,45" fill="none" stroke="#2563eb" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-y-0 left-[10%] right-[40%] bg-blue-500/10 border-x-2 border-blue-500 cursor-ew-resize"></div>
      </div>
      
      <div className={`text-center text-[10px] mt-3 font-bold tracking-widest transition-colors duration-300 ${mutedText}`}>
        TIME (BOOT) (MS)
      </div>
      
    </div>
  );
};

export default PlottingTab;