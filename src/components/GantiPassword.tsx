import React, { useState } from 'react';
import { UserAccount } from '../data/initialData';
import { KeyRound, ShieldAlert, CheckCircle2, Lock, Eye, EyeOff, User, Shield } from 'lucide-react';

interface GantiPasswordProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onUpdatePassword: (username: string, newPass: string) => void;
}

export const GantiPassword: React.FC<GantiPasswordProps> = ({
  currentUser,
  allUsers,
  onUpdatePassword
}) => {
  // Syarat 12: Khusus role ADMIN
  const isAdmin = currentUser.role.toLowerCase() === 'admin';

  const [selectedUsername, setSelectedUsername] = useState(allUsers[0]?.username || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ambil objek user terpilih
  const selectedUser = allUsers.find(u => u.username === selectedUsername) || allUsers[0];

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">Akses Ditolak</h3>
        <p className="text-xs text-slate-500 mt-1">
          Berdasarkan konfigurasi sheet Users, fitur Ganti Password <strong>Khusus Role ADMIN</strong> saja.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Harap masukkan password baru dan konfirmasi!');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('Password baru minimal 4 karakter!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password baru dan Konfirmasi Password tidak cocok!');
      return;
    }

    onUpdatePassword(selectedUsername, newPassword);
    setSuccessMsg(`Password untuk akun '${selectedUser.nama}' (${selectedUsername}) berhasil diperbarui!`);
    setNewPassword('');
    setConfirmPassword('');
  };

  const getRoleBadgeColor = (r: string) => {
    switch (r.toLowerCase()) {
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'kepsek': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'piket': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'guru': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'tendik': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7 max-w-xl mx-auto">
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manajemen Password Akun</h2>
          <p className="text-xs text-slate-500">
            Khusus hak akses Administrator untuk memperbarui password akun pegawai (sheet Users).
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Syarat 12: Fungsi memilih akun sesuai Nama masing-masing username */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Pilih Pegawai / Akun yang Ingin Diubah
          </label>
          <select
            value={selectedUsername}
            onChange={(e) => setSelectedUsername(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            required
          >
            {allUsers.map((u) => (
              <option key={u.username} value={u.username}>
                {u.nama} [{u.role.toUpperCase()}] ({u.username})
              </option>
            ))}
          </select>
        </div>

        {/* Syarat 12: Tampilkan juga Role dan Nama Lengkap dalam posisi Readonly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Nama Lengkap Pegawai (Readonly)
            </label>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 bg-white px-3 py-2 rounded-lg border border-slate-200">
              <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{selectedUser.nama}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Role Pegawai (Readonly)
            </label>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-white px-3 py-2 rounded-lg border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold border ${getRoleBadgeColor(selectedUser.role)}`}>
                {selectedUser.role}
              </span>
              <span className="text-slate-400 font-mono text-[11px] ml-auto">@{selectedUser.username}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 4 karakter"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-10 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              minLength={4}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Konfirmasi Password Baru
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang password baru"
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            minLength={4}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Simpan Perubahan Password</span>
          </button>
        </div>
      </form>
    </div>
  );
};
