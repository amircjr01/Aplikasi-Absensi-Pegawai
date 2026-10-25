/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  RekapRecord,
  INITIAL_USERS,
  INITIAL_RECORDS
} from './data/initialData';
import { Header } from './components/Header';
import { FormAbsensi } from './components/FormAbsensi';
import { Rekapitulasi } from './components/Rekapitulasi';
import { GantiPassword } from './components/GantiPassword';
import { GasCodeViewer } from './components/GasCodeViewer';
import { PanduanAplikasi } from './components/PanduanAplikasi';
import {
  PenLine,
  TableProperties,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Award,
  Video,
  UserCheck,
  Users,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Persistence for users & records
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('absensi_pegawai_users_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [records, setRecords] = useState<RekapRecord[]>(() => {
    const saved = localStorage.getItem('absensi_pegawai_records_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_RECORDS;
      }
    }
    return INITIAL_RECORDS;
  });

  // Current session (defaults to Admin for instant exploring, easily switchable to any role)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = sessionStorage.getItem('absensi_pegawai_active_user_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Start with Administrator
  });

  // Active view: 'app' (interactive system) or 'code' (GAS complete files)
  const [activeViewMode, setActiveViewMode] = useState<'app' | 'code'>('app');

  // Active Tab inside App: 'form' | 'rekap' | 'password' | 'panduan'
  const [activeTab, setActiveTab] = useState<'form' | 'rekap' | 'password' | 'panduan'>('form');

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync to Storage
  useEffect(() => {
    localStorage.setItem('absensi_pegawai_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('absensi_pegawai_records_v3', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('absensi_pegawai_active_user_v3', JSON.stringify(currentUser));
      // Syarat 12: Fitur Ganti Password Khusus Role Admin
      if (currentUser.role.toLowerCase() !== 'admin' && activeTab === 'password') {
        setActiveTab('form');
      }
    } else {
      sessionStorage.removeItem('absensi_pegawai_active_user_v3');
    }
  }, [currentUser, activeTab]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    const userFound = users.find(
      u => u.username.toLowerCase() === cleanUser && u.password === cleanPass
    );

    if (userFound) {
      setCurrentUser(userFound);
      setLoginUsername('');
      setLoginPassword('');
      setActiveTab('form');
    } else {
      setLoginError('Username atau Password salah! Periksa kembali akun Anda pada sheet Users.');
    }
  };

  const handleQuickLogin = (role: 'admin' | 'piket' | 'kepsek' | 'guru' | 'tendik') => {
    const target = users.find(u => u.role.toLowerCase() === role);
    if (target) {
      setCurrentUser(target);
      setActiveTab('form');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchUser = (username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleSaveRecords = (newRecords: RekapRecord[]) => {
    setRecords(prev => [...newRecords, ...prev]);
  };

  const handleUpdatePassword = (targetUsername: string, newPass: string) => {
    setUsers(prev => prev.map(u => {
      if (u.username.toLowerCase() === targetUsername.toLowerCase()) {
        return { ...u, password: newPass };
      }
      return u;
    }));
  };

  const isAdmin = currentUser?.role.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        activeViewMode={activeViewMode}
        onChangeViewMode={setActiveViewMode}
        allUsers={users}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeViewMode === 'code' ? (
          <GasCodeViewer />
        ) : !currentUser ? (
          /* LOGIN VIEW */
          <div className="max-w-md mx-auto my-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-2xl p-2 shadow-md flex items-center justify-center border border-slate-100">
                  <img
                    src="https://uploads.onecompiler.io/44bcuuchx/44bcutd2a/Logo%20SMP.png"
                    alt="Logo Sekolah"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Sistem Absensi Pegawai</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  SMP Negeri 1 Ciranjang • 5 Kelompok Pegawai
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username Pegawai</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Contoh: admin, kepsek, piket, guru01, tendik01"
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                      className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem Absensi</span>
                </button>
              </form>

              {/* Quick Login Test Buttons for all 5 roles */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  Uji Coba 5 Kelompok User (1-Klik):
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold border border-blue-200 transition text-center flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('piket')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 transition text-center flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3 h-3 text-slate-600" />
                    <span>Piket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('kepsek')}
                    className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold border border-purple-200 transition text-center flex items-center justify-center gap-1"
                  >
                    <Award className="w-3 h-3 text-purple-600" />
                    <span>Kepsek</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('guru')}
                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition text-center flex items-center justify-center gap-1"
                  >
                    <Video className="w-3 h-3 text-emerald-600" />
                    <span>Guru</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('tendik')}
                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 transition text-center flex items-center justify-center gap-1 col-span-2"
                  >
                    <Users className="w-3 h-3 text-amber-600" />
                    <span>Tenaga Kependidikan (Tendik)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className="space-y-6">
            {/* Navigation Pills (Mobile friendly) */}
            <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto border border-slate-300/60 shadow-inner">
              {/* Tab 1: Form Input (Accessible by ALL 5 roles) */}
              <button
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'form'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <PenLine className="w-4 h-4" />
                <span>Form Input Absensi</span>
              </button>

              {/* Tab 2: Rekapitulasi (Syarat 11: Tersedia untuk SEMUA 5 ROLES: Admin, Piket, Kepsek, Guru, Tendik) */}
              <button
                onClick={() => setActiveTab('rekap')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'rekap'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <TableProperties className="w-4 h-4" />
                <span>
                  Rekapitulasi Absensi {currentUser.role === 'piket' ? '(Harian)' : ''}
                </span>
              </button>

              {/* Tab 3: Ganti Password (Syarat 12: KHUSUS ROLE ADMIN) */}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    activeTab === 'password'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Ganti Password (Admin)</span>
                </button>
              )}

              {/* Tab 4: Buku Panduan PDF (5 Role) */}
              <button
                onClick={() => setActiveTab('panduan')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  activeTab === 'panduan'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Buku Panduan PDF (5 Role)</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === 'form' && (
                <FormAbsensi
                  currentUser={currentUser}
                  allUsers={users}
                  onSaveRecord={handleSaveRecords}
                />
              )}

              {activeTab === 'rekap' && (
                <Rekapitulasi
                  currentUser={currentUser}
                  records={records}
                />
              )}

              {activeTab === 'password' && isAdmin && (
                <GantiPassword
                  currentUser={currentUser}
                  allUsers={users}
                  onUpdatePassword={handleUpdatePassword}
                />
              )}

              {activeTab === 'panduan' && (
                <PanduanAplikasi
                  currentUser={currentUser}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 text-center text-xs text-slate-500 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Copyright © Tim ICT SMP Negeri 1 Ciranjang • Sistem Absensi Pegawai</span>
          <span className="text-[11px] text-slate-400">
            Terintegrasi Google Sheets (Rekap, DataKelas, Users), Drive, dan WhatsApp
          </span>
        </div>
      </footer>
    </div>
  );
}
