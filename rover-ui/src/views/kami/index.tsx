import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Pastikan gambar rov-bg.jpg sudah kamu simpan di dalam folder src/assets/
// @ts-ignore
import rovBgImage from '../../assets/rov-bg.jpg';

// 1. Tentukan Struktur Data
interface Member {
  id: number;
  initials: string;
  name: string;
  uid: string;
  role: string;
  prodi: string;
  divisi: string;
  tanggung_jawab: string;
  tags: string[];
}

interface TeamProps {
  isDarkMode?: boolean;
}

// 2. Data Anggota Tim
const MEMBERS: Member[] = [
  {
    id: 1, initials: 'NS',
    name: 'Naufal Shiddiq',
    uid: '#TRN·001',
    role: 'PIC Battery',
    prodi: 'Teknologi Mekatronika',
    divisi: 'Hardware',
    tanggung_jawab: 'Person in charge sistem baterai ROV',
    tags: ['Battery System', 'Electronics', 'Design'],
  },
  {
    id: 2, initials: 'NZ',
    name: 'Nazhifa',
    uid: '#TRN·002',
    role: 'PIC Thruster',
    prodi: 'Teknologi Mekatronika',
    divisi: 'Hardware',
    tanggung_jawab: 'Person in charge sistem thruster ROV',
    tags: ['Thruster', 'Propulsion', 'Design'],
  },
  {
    id: 3, initials: 'MN',
    name: 'Mahendra Nur Pramudiansyah',
    uid: '#TRN·003',
    role: 'PIC Software Website',
    prodi: 'Teknologi Rekayasa Informatika Industri',
    divisi: 'Software',
    tanggung_jawab: 'Person in charge tim software & website ROV',
    tags: ['Web Dev', 'Software', 'UI/UX', 'Gazebo', 'ROS2'],
  },
  {
    id: 4, initials: 'HA',
    name: 'Hamiya Aisya Mardhiya',
    uid: '#TRN·004',
    role: 'Anggota Software Website',
    prodi: 'Teknologi Rekayasa Informatika Industri',
    divisi: 'Software',
    tanggung_jawab: 'Anggota tim software & website ROV',
    tags: ['Web Dev', 'Software', 'UI/UX'],
  },
  {
    id: 5, initials: 'NK',
    name: 'Naurah Kaltsum Azaria',
    uid: '#TRN·005',
    role: 'Anggota Software Website',
    prodi: 'Teknologi Rekayasa Informatika Industri',
    divisi: 'Software',
    tanggung_jawab: 'Anggota tim software & website ROV',
    tags: ['Web Dev', 'Software', 'UI/UX'],
  },
];

/* ─── Avatar Component ─── */
const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-800/80 to-blue-500/80 border-2 border-blue-400/40 flex items-center justify-center text-xl font-extrabold text-white font-mono shadow-[0_4px_12px_rgba(74,184,240,0.2)] flex-shrink-0">
    {initials}
  </div>
);

/* ─── MemberCard Component (BUNGLON) ─── */
const MemberCard = ({ member, isDarkMode }: { member: Member, isDarkMode: boolean }) => {
  // Logika Warna Bunglon
  const cardBg = isDarkMode 
    ? 'bg-[#0f172a]/65 border-blue-500/20 hover:bg-[#162848]/90 hover:border-blue-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(74,184,240,0.2)]' 
    : 'bg-white/70 border-slate-300 hover:bg-white/95 hover:border-blue-500 shadow-sm hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]';
  
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-800';
  const labelColor = isDarkMode ? 'text-slate-500' : 'text-slate-400';
  const valueColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const boxBg = isDarkMode ? 'bg-black/25 border-white/5' : 'bg-slate-100/50 border-slate-200';
  const tagBg = isDarkMode ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600';

  return (
    <div className={`relative w-full md:w-[340px] flex-grow max-w-[380px] backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4 transition-all duration-400 ease-out hover:-translate-y-1.5 cursor-pointer overflow-hidden border ${cardBg} group`}>
      
      {/* Background Glow Effect */}
      <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full transition-colors duration-400 ${isDarkMode ? 'group-hover:bg-blue-400/15' : 'group-hover:bg-blue-500/10'}`} />

      {/* Header: Avatar + Info */}
      <div className="flex gap-4 items-center relative z-10">
        <div className="relative">
          <Avatar initials={member.initials} />
          {/* Status Indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-[3px] animate-pulse ${isDarkMode ? 'border-[#0f172a]' : 'border-white'}`} />
        </div>
        
        <div className="flex-1">
          <div className="font-mono text-[10px] text-blue-400 tracking-wider mb-1">
            {member.uid}
          </div>
          <div className={`text-lg font-extrabold leading-tight mb-1 ${titleColor}`}>
            {member.name}
          </div>
          <div className={`text-xs font-semibold inline-block px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-blue-400/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            {member.role}
          </div>
        </div>
      </div>

      <div className={`h-[1px] w-full ${isDarkMode ? 'bg-gradient-to-r from-white/10 to-transparent' : 'bg-gradient-to-r from-slate-200 to-transparent'}`} />

      {/* Program Studi & Divisi */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div>
          <div className={`font-mono text-[9px] uppercase tracking-wider mb-0.5 ${labelColor}`}>Divisi</div>
          <div className={`text-[13px] font-semibold ${valueColor}`}>{member.divisi}</div>
        </div>
        <div>
          <div className={`font-mono text-[9px] uppercase tracking-wider mb-0.5 ${labelColor}`}>Program Studi</div>
          <div className={`text-xs font-medium leading-snug ${valueColor}`}>{member.prodi}</div>
        </div>
      </div>

      {/* Tanggung Jawab Box */}
      <div className={`rounded-xl p-3 border relative z-10 ${boxBg}`}>
        <div className={`font-mono text-[9px] uppercase tracking-wider mb-1 ${labelColor}`}>Tanggung Jawab</div>
        <div className={`text-[12.5px] leading-relaxed ${titleColor}`}>{member.tanggung_jawab}</div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-auto relative z-10">
        {member.tags.map((tag) => (
          <span key={tag} className={`font-mono text-[9.5px] px-2.5 py-1 rounded-md border ${tagBg}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Page Export ─── */
export const Team: React.FC<TeamProps> = ({ isDarkMode = true }) => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      
      {/* ── TOMBOL KEMBALI ── */}
      <div className="mb-4 mt-2">
        <button 
          onClick={() => navigate('/home')}
          className={`flex items-center gap-2 transition-colors group ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
        >
          <div className={`p-1.5 rounded-lg transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-blue-500/20' : 'bg-white/50 border-slate-200 group-hover:bg-blue-100'}`}>
            <ChevronLeft size={16} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-sm">Back to Dashboard</span>
        </button>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center rounded-3xl mb-8 border border-white/5 shadow-xl">
        <img src={rovBgImage} alt="ROV Underwater" className="absolute inset-0 w-full h-full object-cover object-center z-0" />
        
        {/* Gradient Overlay (Bunglon) */}
        <div className={`absolute inset-0 z-10 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-[#060b19] via-[#060b19]/80 to-transparent' 
            : 'bg-gradient-to-r from-blue-50 via-blue-50/90 to-transparent'
        }`} />
        
        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 z-10 [background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_right,black_40%,transparent_100%)]" />

        <div className="relative z-20 p-8 md:p-16 max-w-2xl">
          <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest uppercase text-blue-500 mb-5">
            <span className="w-7 h-0.5 bg-blue-500 rounded-full" />
            Industrial Informatics · TRIN
          </div>

          <h1 className={`text-4xl md:text-6xl font-black leading-tight tracking-tight mb-5 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Tim di Balik<br />
            <em className="not-italic text-blue-500">ROV</em> Kami
          </h1>

          <p className={`text-sm md:text-base leading-relaxed max-w-md mb-8 ${isDarkMode ? 'text-blue-100/70' : 'text-slate-600'}`}>
            Sebuah tim yang terdiri dari individu berdedikasi dengan keahlian di bidang software, hardware, dan sistem navigasi bawah air — bersama membangun dan mengoperasikan ROV Polman Bandung.
          </p>

          <div className="flex gap-6 md:gap-10">
            {[['5', '+', 'Anggota'], ['3', '+', 'Bidang Keahlian'], ['1', '', 'Unit ROV']].map(([num, plus, lbl], i) => (
              <div key={lbl} className={i < 2 ? `border-r pr-6 md:pr-10 ${isDarkMode ? 'border-white/10' : 'border-slate-300'}` : ''}>
                <div className={`text-3xl md:text-4xl font-extrabold leading-none tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {num}<span className="text-blue-500">{plus}</span>
                </div>
                <div className={`font-mono text-[9px] tracking-widest uppercase mt-2 ${isDarkMode ? 'text-blue-200/50' : 'text-slate-500'}`}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div className={`flex items-center justify-between pb-4 border-b mb-8 ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}>
        <div className={`text-lg font-extrabold tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          ANGGOTA <span className="text-blue-500">TIM</span>
        </div>
        <div className={`font-mono text-[9px] tracking-widest uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          ROV · POLMAN BANDUNG · 05 MEMBERS
        </div>
      </div>

      {/* ── NEW BALANCED GRID LAYOUT ── */}
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {MEMBERS.map((m) => (
          <MemberCard key={m.id} member={m} isDarkMode={isDarkMode} />
        ))}
      </div>
      
    </div>
  );
};

export default Team;