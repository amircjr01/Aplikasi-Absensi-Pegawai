import React from 'react';
import { UserAccount } from '../data/initialData';
import { ShieldCheck, Award, UserCheck, Video, LogOut, Code, PlayCircle, Users, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  onSwitchUser: (username: string) => void;
  activeViewMode: 'app' | 'code';
  onChangeViewMode: (mode: 'app' | 'code') => void;
  allUsers: UserAccount[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  activeViewMode,
  onChangeViewMode,
  allUsers,
}) => {
  const getRoleBadge = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return {
          label: 'Admin',
          bg: 'bg-blue-600 text-white',
          icon: <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
        };
      case 'kepsek':
        return {
          label: 'Kepala Sekolah',
          bg: 'bg-purple-700 text-white',
          icon: <Award className="w-3.5 h-3.5 inline mr-1" />
        };
      case 'piket':
        return {
          label: 'Petugas Piket',
          bg: 'bg-slate-700 text-white',
          icon: <UserCheck className="w-3.5 h-3.5 inline mr-1" />
        };
      case 'guru':
        return {
          label: 'Guru Pengampu',
          bg: 'bg-emerald-600 text-white',
          icon: <Video className="w-3.5 h-3.5 inline mr-1" />
        };
      case 'tendik':
        return {
          label: 'Tenaga Kependidikan',
          bg: 'bg-amber-600 text-white',
          icon: <Users className="w-3.5 h-3.5 inline mr-1" />
        };
      default:
        return {
          label: 'Pegawai',
          bg: 'bg-slate-500 text-white',
          icon: null
        };
    }
  };

  const badgeInfo = getRoleBadge(currentUser?.role);

  // Representative demo users for each of the 5 roles
  const sampleAdmin = allUsers.find(u => u.role === 'admin') || allUsers[0];
  const samplePiket = allUsers.find(u => u.role === 'piket');
  const sampleKepsek = allUsers.find(u => u.role === 'kepsek');
  const sampleGuru = allUsers.find(u => u.role === 'guru');
  const sampleTendik = allUsers.find(u => u.role === 'tendik');

  const demoRoles = [
    { label: 'ADMIN', user: sampleAdmin, color: 'bg-blue-600' },
    { label: 'PIKET', user: samplePiket, color: 'bg-slate-600' },
    { label: 'KEPSEK', user: sampleKepsek, color: 'bg-purple-600' },
    { label: 'GURU', user: sampleGuru, color: 'bg-emerald-600' },
    { label: 'TENDIK', user: sampleTendik, color: 'bg-amber-600' }
  ].filter(d => d.user !== undefined);

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg sticky top-0 z-40">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-blue-600/30">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
            <img
              src="https://uploads.onecompiler.io/44bcuuchx/44bcutd2a/Logo%20SMP.png"
              alt="Logo SMP"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Sistem Absensi Pegawai
              </h1>
              <span className="text-[10px] bg-blue-500/40 text-blue-100 font-semibold px-2 py-0.5 rounded-full border border-blue-400/30">
                SMPN 1 Ciranjang
              </span>
            </div>
            <p className="text-xs text-blue-100/80 hidden sm:block">
              Pencatatan Absensi 5 Kelompok Pegawai (Kepsek, Guru, Tendik, Piket, Admin)
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Interactive App vs Code Repository */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-950/60 p-1 rounded-xl border border-blue-400/30 flex items-center shadow-inner">
            <button
              onClick={() => onChangeViewMode('app')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeViewMode === 'app'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Aplikasi & Simulasi</span>
            </button>
            <button
              onClick={() => onChangeViewMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeViewMode === 'code'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Kode GAS Lengkap (Utuh)</span>
            </button>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-blue-500/40">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold leading-tight truncate max-w-[170px]">
                  {currentUser.nama}
                </div>
                <span className={`inline-flex items-center text-[10px] px-2 py-0.5 rounded font-medium ${badgeInfo.bg}`}>
                  {badgeInfo.icon}
                  {badgeInfo.label}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Keluar dari akun"
                className="px-2.5 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-rose-500/80 hover:text-white text-blue-100 transition flex items-center gap-1 border border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick 5-Role Tester Bar */}
      {currentUser && (
        <div className="bg-blue-950/40 px-4 py-1.5 text-xs border-b border-blue-500/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-blue-200 font-medium">
            <span className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">Uji 5 Kelompok User:</span>
            <div className="flex items-center gap-1 flex-wrap">
              {demoRoles.map((d) => {
                if (!d.user) return null;
                const isActive = currentUser.username === d.user.username;
                return (
                  <button
                    key={d.label}
                    onClick={() => onSwitchUser(d.user!.username)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] transition flex items-center gap-1 ${
                      isActive
                        ? `${d.color} text-white font-bold ring-2 ring-white/60 shadow`
                        : 'bg-blue-900/60 text-blue-200 hover:bg-blue-800'
                    }`}
                    title={`Ganti sesi ke ${d.user.nama} (${d.label})`}
                  >
                    <span className="font-mono text-[9px] font-black">{d.label}</span>: {d.user.nama.split(',')[0].split('(')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 text-blue-300 text-[11px]">
            <a
              href="https://drive.google.com/drive/folders/1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white underline flex items-center gap-1"
            >
              <span>Folder Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
