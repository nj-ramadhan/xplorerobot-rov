import React, { useState } from 'react';
import { Wrench, RefreshCw, CheckCircle } from 'lucide-react'; // Tambah RefreshCw & CheckCircle
import Overview from './Overview';
import PwmOutputs from './PwmOutputs'; 
import Configure from './Configure';

interface VehicleSetupProps {
  isDarkMode?: boolean;
  onRefresh?: () => void; // Tambah prop onRefresh biar seragam
}

export default function VehicleSetup({ isDarkMode = true, onRefresh }: VehicleSetupProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // STATE UNTUK NOTIFIKASI SUKSES (KANAN BAWAH)
  const [showToast, setShowToast] = useState(false);

  // FUNGSI HANDLE REFRESH (NATIVE CONFIRM + CUSTOM TOAST SUKSES)
  const handleRefresh = () => {
    // 1. Munculin konfirmasi bawaan browser
    const isConfirmed = window.confirm("Apakah Anda yakin ingin me-refresh pengaturan kendaraan?");
    
    // 2. Kalau di-klik "OK"
    if (isConfirmed) {
      if (onRefresh) onRefresh();
      
      // Munculin notifikasi toast di kanan bawah
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'pwm', label: 'PWM OUTPUTS' },
    { id: 'configure', label: 'CONFIGURE' },
  ];

  // LOGIKA TEMA
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const accentColor = isDarkMode ? 'text-blue-400' : 'text-blue-600';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-slate-200';
  const mutedText = isDarkMode ? 'text-slate-500' : 'text-slate-500';

  return (
    <div className="animate-in fade-in duration-500 mt-2 font-['Inter',sans-serif] w-full max-w-7xl mx-auto pb-10 relative">
      
      {/* =========================================
          HEADER (DITAMBAH TOMBOL REFRESH)
          ========================================= */}
      <div className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Wrench size={32} className="text-white" />
          </div>
          <div>
            <h1 className={`font-heading text-3xl md:text-4xl font-black tracking-tight uppercase transition-colors duration-300 ${titleColor}`}>
              Vehicle Setup
            </h1>
            <p className={`font-mono text-xs mt-1 tracking-widest uppercase font-bold transition-colors duration-300 ${accentColor}`}>
              Sensor calibrations and motor tests
            </p>
          </div>
        </div>

        {/* Tombol Refresh (Pojok Kanan Atas) */}
        <button 
          onClick={handleRefresh}
          className={`p-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
            isDarkMode 
              ? 'bg-[#111827]/70 border-white/10 text-slate-400 hover:text-white hover:border-white/30' 
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
          title="Refresh Vehicle Setup"
        >
          <RefreshCw size={24} className={`transition-transform duration-500 ${showToast ? 'animate-spin text-blue-500' : 'hover:rotate-180'}`} />
        </button>
      </div>

      {/* TAB HEADER */}
      <div className={`flex space-x-8 border-b transition-colors duration-300 mb-8 ${borderColor}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 border-b-[3px] font-bold tracking-widest text-xs uppercase transition-all duration-300 ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-500' 
                : `border-transparent ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="mt-4 transition-colors duration-300">
        {activeTab === 'overview' && <Overview isDarkMode={isDarkMode} />}
        {activeTab === 'pwm' && <PwmOutputs isDarkMode={isDarkMode} />}
        {activeTab === 'configure' && <Configure isDarkMode={isDarkMode} />}
      </div>
      
      {/* ================= TOAST NOTIFIKASI SUKSES (BAWAH KANAN) ================= */}
      {showToast && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-8 fade-in duration-300 ${
          isDarkMode ? 'bg-[#111827] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <CheckCircle size={20} className="text-green-500" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Refresh Successful</span>
            <span className={`text-[10px] uppercase tracking-widest ${mutedText}`}>Vehicle setup updated</span>
          </div>
        </div>
      )}

    </div>
  );
}