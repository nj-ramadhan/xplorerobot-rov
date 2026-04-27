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
    prodi: 'Teknologi Rekayasa Mekatronika',
    divisi: 'Hardware',
    tanggung_jawab: 'Person in charge sistem baterai ROV',
    tags: ['Battery System', 'Electronics', 'Design'],
  },
  {
    id: 2, initials: 'NZ',
    name: 'Nazhifa',
    uid: '#TRN·002',
    role: 'PIC Thruster',
    prodi: 'Teknologi Rekayasa Mekatronika',
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
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 border-2 border-blue-400/40 flex items-center justify-center text-xl font-extrabold text-white font-mono shadow-lg flex-shrink-0">
    {initials}
  </div>
);

/* ─── MemberCard Component (BUNGLON) ─── */
const MemberCard = ({ member, isDarkMode }: { member: Member, isDarkMode: boolean }) => {
  const cardBg = isDarkMode 
    ? 'bg-[#111827]/80 backdrop-blur-xl border-white/10 hover:bg-[#162848]/90 hover:border-blue-500/50 shadow-2xl' 
    : 'bg-white border-slate-200 hover:border-blue-400 shadow-xl';
  
  const titleColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';
  const valueColor = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  
  const boxBg = isDarkMode ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200 shadow-inner';
  const tagBg = isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700';

  return (
    <div className={`relative w-full sm:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-5 rounded-3xl p-6 md:p-8 transition-all duration-400 ease-out hover:-translate-y-2 cursor-pointer overflow-hidden border group ${cardBg}`}>
      
      {/* Background Glow Effect */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full transition-colors duration-500 blur-2xl pointer-events-none ${isDarkMode ? 'group-hover:bg-blue-500/20' : 'group-hover:bg-blue-400/20'}`} />

      {/* Header: Avatar + Info */}
      <div className="flex gap-5 items-center relative z-10">
        <div className="relative">
          <Avatar initials={member.initials} />
          {/* Status Indicator */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-[3px] animate-pulse ${isDarkMode ? 'border-[#111827]' : 'border-white'}`} />
        </div>
        
        <div className="flex-1">
          <div className="font-mono text-[10px] text-blue-500 font-bold tracking-widest mb-1.5 uppercase">
            {member.uid}
          </div>
          <div className={`text-xl font-black leading-tight mb-2 tracking-tight transition-colors duration-300 ${titleColor}`}>
            {member.name}
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-widest inline-block px-2.5 py-1 rounded-md transition-colors duration-300 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
            {member.role}
          </div>
        </div>
      </div>

      <div className={`h-[1px] w-full transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-r from-white/10 to-transparent' : 'bg-gradient-to-r from-slate-200 to-transparent'}`} />

      {/* Program Studi & Divisi */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div>
          <div className={`font-mono text-[9px] font-bold uppercase tracking-widest mb-1 transition-colors duration-300 ${labelColor}`}>Divisi</div>
          <div className={`text-sm font-bold transition-colors duration-300 ${valueColor}`}>{member.divisi}</div>
        </div>
        <div>
          <div className={`font-mono text-[9px] font-bold uppercase tracking-widest mb-1 transition-colors duration-300 ${labelColor}`}>Program Studi</div>
          <div className={`text-[11px] font-bold leading-snug transition-colors duration-300 ${valueColor}`}>{member.prodi}</div>
        </div>
      </div>

      {/* Tanggung Jawab Box */}
      <div className={`rounded-xl p-4 border relative z-10 transition-colors duration-300 flex-1 ${boxBg}`}>
        <div className={`font-mono text-[9px] font-bold uppercase tracking-widest mb-1.5 transition-colors duration-300 ${labelColor}`}>Tanggung Jawab</div>
        <div className={`text-xs font-medium leading-relaxed transition-colors duration-300 ${titleColor}`}>{member.tanggung_jawab}</div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto relative z-10">
        {member.tags.map((tag) => (
          <span key={tag} className={`font-mono text-[9px] font-bold px-3 py-1.5 rounded-lg border transition-colors duration-300 uppercase tracking-wider shadow-sm ${tagBg}`}>
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

  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const mutedColor = isDarkMode ? 'text-slate-500' : 'text-slate-500';

  return (
    <div className={`animate-in fade-in duration-500 pb-10 font-['Inter',sans-serif] ${textColor}`}>
      
      {/* ── TOMBOL KEMBALI ── */}
      <div className="mb-4 mt-2">
        <button 
          onClick={() => navigate('/home')}
          className={`flex items-center gap-2 transition-colors group ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <div className={`p-1.5 rounded-lg transition-all border ${isDarkMode ? 'bg-white/5 border-white/5 group-hover:bg-blue-500/20' : 'bg-white border-slate-200 shadow-sm group-hover:bg-blue-50'}`}>
            <ChevronLeft size={16} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-sm">Back to Dashboard</span>
        </button>
      </div>

      {/* ── HERO SECTION ── */}
      <div className={`relative overflow-hidden min-h-[50vh] md:min-h-[60vh] flex items-center rounded-3xl mb-10 border shadow-xl transition-colors duration-300 ${isDarkMode ? 'border-white/10 bg-[#060b19]' : 'border-slate-200 bg-white'}`}>
        <img src={rovBgImage} alt="ROV Underwater" className="absolute inset-0 w-full h-full object-cover object-center z-0" />
        
        {/* Gradient Overlay: Di light mode dibikin lebih transparan (via-white/50) biar robotnya nongol! */}
        <div className={`absolute inset-0 z-10 transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-[#060b19] via-[#060b19]/80 to-transparent' 
            : 'bg-gradient-to-r from-white/95 via-white/50 to-transparent'
        }`} />
        
        {/* Dot Pattern Overlay */}
        <div className={`absolute inset-0 z-10 [background-size:28px_28px] [mask-image:linear-gradient(to_right,black_40%,transparent_100%)] ${
          isDarkMode
            ? '[background-image:radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]'
            : '[background-image:radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)]'
        }`} />

        <div className="relative z-20 p-8 md:p-16 max-w-2xl">
          <div className="flex items-center gap-2.5 font-mono text-[10px] font-bold tracking-widest uppercase text-blue-500 mb-5">
            <span className="w-8 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            Industrial Informatics · TRIN
          </div>

          <h1 className={`text-4xl md:text-6xl font-black leading-tight tracking-tight mb-5 transition-colors duration-300 ${textColor}`}>
            Tim di Balik<br />
            <em className="not-italic text-blue-500">ROV</em> Kami
          </h1>

          <p className={`text-sm md:text-base font-medium leading-relaxed max-w-md mb-8 transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Sebuah tim yang terdiri dari individu berdedikasi dengan keahlian di bidang software, hardware, dan sistem navigasi bawah air — bersama membangun dan mengoperasikan ROV Polman Bandung.
          </p>

          <div className="flex gap-6 md:gap-12">
            {[['5', '+', 'Anggota'], ['3', '+', 'Bidang Keahlian'], ['1', '', 'Unit ROV']].map(([num, plus, lbl], i) => (
              <div key={lbl} className={i < 2 ? `border-r pr-6 md:pr-12 transition-colors duration-300 ${isDarkMode ? 'border-white/10' : 'border-slate-300'}` : ''}>
                <div className={`text-3xl md:text-4xl font-black leading-none tracking-tight transition-colors duration-300 ${textColor}`}>
                  {num}<span className="text-blue-500 drop-shadow-sm">{plus}</span>
                </div>
                <div className={`font-mono font-bold text-[9px] tracking-widest uppercase mt-3 transition-colors duration-300 ${mutedColor}`}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION HEADER ── */}
      <div className={`flex items-center justify-between pb-4 border-b mb-8 transition-colors duration-300 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
        <div className={`text-xl font-black tracking-widest uppercase transition-colors duration-300 ${textColor}`}>
          ANGGOTA <span className="text-blue-500">TIM</span>
        </div>
        <div className={`font-mono font-bold text-[9px] tracking-widest uppercase transition-colors duration-300 ${mutedColor}`}>
          ROV · POLMAN BANDUNG · 05 MEMBERS
        </div>
      </div>

      {/* ── BALANCED FLEX LAYOUT ── */}
      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto items-stretch">
        {MEMBERS.map((m) => (
          <MemberCard key={m.id} member={m} isDarkMode={isDarkMode} />
        ))}
      </div>
      
    </div>
  );
};

export default Team;