import React, { useState, useEffect } from 'react';
import { UserAccount, RekapRecord, MASTER_KELAS, MASTER_MAPEL } from '../data/initialData';
import {
  FileText, Send, UploadCloud, CheckCircle2, AlertCircle, X,
  Trash2, MessageSquare, ExternalLink, Copy, Check, UserCheck, Shield
} from 'lucide-react';

interface FormAbsensiProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSaveRecord: (newRecords: RekapRecord[]) => void;
}

interface KelasRow {
  id: number;
  kelas: string;
  mapel: string;
  jamAwal: string;
  jamAkhir: string;
  penugasan: string;
}

export const FormAbsensi: React.FC<FormAbsensiProps> = ({ currentUser, allUsers, onSaveRecord }) => {
  const NO_WA_TUJUAN = "6285779156487";
  const todayStr = new Date().toISOString().split('T')[0];

  const getHariFromDate = (dateStr: string) => {
    if (!dateStr) return 'Senin';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
      return days[d.getDay()] || 'Senin';
    }
    const d = new Date(dateStr);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
    return days[d.getDay()] || 'Senin';
  };

  // Filter users by role from Sheet_Users
  const listGuruUsers = allUsers.filter(u => u.role.toLowerCase() === 'guru');
  const listKepsekUsers = allUsers.filter(u => u.role.toLowerCase() === 'kepsek');
  const listTendikUsers = allUsers.filter(u => u.role.toLowerCase() === 'tendik');

  const isAdminOrPiket = currentUser.role === 'admin' || currentUser.role === 'piket';

  // For Admin/Piket, select target category (Guru, Kepsek, Tendik)
  const [targetCategory, setTargetCategory] = useState<'kepsek' | 'guru' | 'tendik'>('guru');

  // Active role determining form layout (is it teacher with classes or staff without classes?)
  const effectiveRole: 'kepsek' | 'guru' | 'tendik' = isAdminOrPiket
    ? targetCategory
    : (currentUser.role as 'kepsek' | 'guru' | 'tendik');

  const [hari, setHari] = useState(getHariFromDate(todayStr));
  const [tanggal, setTanggal] = useState(todayStr);
  const [namaPegawai, setNamaPegawai] = useState('');
  const [statusKehadiran, setStatusKehadiran] = useState<'Sakit' | 'Izin' | 'Tugas Dinas Luar' | 'Tanpa Keterangan'>('Sakit');
  const [catatan, setCatatan] = useState('');
  const [fileBukti, setFileBukti] = useState<{ name: string; size: number; base64?: string } | null>(null);

  // Multi-Class rows (ONLY FOR GURU)
  const [jumlahKelas, setJumlahKelas] = useState(1);
  const [kelasRows, setKelasRows] = useState<KelasRow[]>([
    {
      id: 1,
      kelas: '7 - A',
      mapel: 'Matematika',
      jamAwal: 'Jam Ke-1',
      jamAkhir: 'Jam Ke-2',
      penugasan: ''
    }
  ]);

  // Alert and WA States
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [generatedWaUrl, setGeneratedWaUrl] = useState<string | null>(null);
  const [copiedWa, setCopiedWa] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup initial name based on role and login
  useEffect(() => {
    if (!isAdminOrPiket) {
      // Role Kepsek, Guru, Tendik: name is strictly locked to logged in user
      setNamaPegawai(currentUser.nama);
    } else {
      // Role Admin & Piket: select first name in current target category
      if (targetCategory === 'kepsek' && listKepsekUsers.length > 0) {
        setNamaPegawai(listKepsekUsers[0].nama);
      } else if (targetCategory === 'guru' && listGuruUsers.length > 0) {
        setNamaPegawai(listGuruUsers[0].nama);
      } else if (targetCategory === 'tendik' && listTendikUsers.length > 0) {
        setNamaPegawai(listTendikUsers[0].nama);
      }
    }
  }, [currentUser, targetCategory]);

  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTanggal(val);
    setHari(getHariFromDate(val));
  };

  const handleJumlahKelasChange = (count: number) => {
    setJumlahKelas(count);
    setKelasRows(prev => {
      const updated = [...prev];
      if (count > prev.length) {
        for (let i = prev.length + 1; i <= count; i++) {
          updated.push({
            id: i,
            kelas: MASTER_KELAS[i - 1] || '7 - A',
            mapel: MASTER_MAPEL[0],
            jamAwal: `Jam Ke-${i}`,
            jamAkhir: `Jam Ke-${i + 1}`,
            penugasan: ''
          });
        }
      } else if (count < prev.length) {
        return updated.slice(0, count);
      }
      return updated;
    });
  };

  const updateKelasRow = (id: number, field: keyof KelasRow, value: string) => {
    setKelasRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const removeKelasRow = (id: number) => {
    if (kelasRows.length <= 1) return;
    const filtered = kelasRows.filter(row => row.id !== id);
    setKelasRows(filtered);
    setJumlahKelas(filtered.length);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setSubmitError('Ukuran file melebihi 2 MB!');
      return;
    }

    setSubmitError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBukti({
        name: file.name,
        size: file.size,
        base64: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const susunPesanWhatsApp = (driveLink: string) => {
    const kategoriLabel = effectiveRole === 'kepsek'
      ? 'KEPALA SEKOLAH'
      : effectiveRole === 'tendik'
      ? 'TENAGA KEPENDIDIKAN (TENDIK)'
      : 'GURU';

    let pesan = `*PEMBERITAHUAN KETIDAKHADIRAN PEGAWAI*\n`;
    pesan += `*SMP NEGERI 1 CIRANJANG*\n\n`;
    pesan += `Kategori       : *${kategoriLabel}*\n`;
    pesan += `Hari / Tanggal : ${hari}, ${tanggal}\n`;
    pesan += `Nama Pegawai   : *${namaPegawai}*\n`;
    pesan += `Keterangan     : *${statusKehadiran}*\n`;

    if (driveLink && driveLink !== '-') {
      pesan += `Bukti Drive    : ${driveLink}\n`;
    }

    // Hanya cantumkan penugasan kelas jika pegawai adalah GURU
    if (effectiveRole === 'guru' && kelasRows.length > 0) {
      pesan += `\n*Rincian Penugasan Kelas:*\n`;
      kelasRows.forEach((item, idx) => {
        pesan += `\n${idx + 1}. Kelas: *${item.kelas}* (${item.jamAwal} - ${item.jamAkhir})\n`;
        pesan += `   Mapel: ${item.mapel}\n`;
        pesan += `   Tugas: ${item.penugasan.trim() || '-'}\n`;
      });
    }

    if (catatan.trim()) {
      pesan += `\nCatatan: ${catatan.trim()}\n`;
    }

    const pengirim = `${currentUser.nama} [${currentUser.role.toUpperCase()}]`;
    pesan += `\n_Dicatat melalui Sistem Absensi Pegawai oleh: ${pengirim}_`;

    return pesan;
  };

  const handleKirimWhatsAppManual = () => {
    if (!namaPegawai) {
      setSubmitError('Nama pegawai belum ditentukan.');
      return;
    }
    const linkDrive = fileBukti ? `https://drive.google.com/drive/folders/1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP?file=${encodeURIComponent(fileBukti.name)}` : '-';
    const rawMessage = susunPesanWhatsApp(linkDrive);
    const waUrl = `https://wa.me/${NO_WA_TUJUAN}?text=${encodeURIComponent(rawMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!namaPegawai) {
      setSubmitError('Pilih nama pegawai terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);

    const linkDrive = fileBukti
      ? `https://drive.google.com/drive/folders/1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP?file=${encodeURIComponent(fileBukti.name)}`
      : '-';

    const nowTimestamp = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    let newRecords: RekapRecord[] = [];

    // Jika GURU: simpan per kelas yang ditinggalkan
    if (effectiveRole === 'guru') {
      newRecords = kelasRows.map((item, idx) => ({
        id: `rec-${Date.now()}-${idx}`,
        timestamp: nowTimestamp,
        hari: hari,
        tanggal: tanggal,
        namaGuru: namaPegawai,
        rolePegawai: 'guru',
        statusKehadiran: statusKehadiran,
        linkKehadiran: linkDrive,
        kelas: item.kelas,
        jamAwal: item.jamAwal,
        jamAkhir: item.jamAkhir,
        mapel: item.mapel,
        bentukPenugasan: item.penugasan || '-',
        catatan: catatan || '-'
      }));
    } else {
      // Jika KEPSEK atau TENDIK: simpan 1 baris tanpa rincian kelas
      newRecords = [
        {
          id: `rec-${Date.now()}-0`,
          timestamp: nowTimestamp,
          hari: hari,
          tanggal: tanggal,
          namaGuru: namaPegawai,
          rolePegawai: effectiveRole,
          statusKehadiran: statusKehadiran,
          linkKehadiran: linkDrive,
          kelas: '-',
          jamAwal: '-',
          jamAkhir: '-',
          mapel: '-',
          bentukPenugasan: '-',
          catatan: catatan || '-'
        }
      ];
    }

    // Susun pesan WhatsApp dan buka secara otomatis
    const rawMessage = susunPesanWhatsApp(linkDrive);
    const waUrl = `https://wa.me/${NO_WA_TUJUAN}?text=${encodeURIComponent(rawMessage)}`;

    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      console.warn('Popup WhatsApp diblokir peramban:', err);
    }

    // Simpan ke database
    onSaveRecord(newRecords);

    setGeneratedWaUrl(waUrl);
    setSubmitSuccess(`Data absensi ${namaPegawai} (${effectiveRole.toUpperCase()}) berhasil disimpan! Pesan WhatsApp otomatis dikirimkan.`);
    setIsSubmitting(false);

    // Reset input
    setCatatan('');
    setFileBukti(null);
  };

  const getDropdownLabel = () => {
    if (effectiveRole === 'kepsek') return 'Nama Kepala Sekolah';
    if (effectiveRole === 'tendik') return 'Nama Tenaga Kependidikan (Tendik)';
    return 'Nama Guru Pengampu';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
      {/* Header Form */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Form Input Ketidakhadiran Pegawai
            </h2>
            <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
              {effectiveRole}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan ketidakhadiran {effectiveRole === 'guru' ? 'Guru & Penugasan Multi-Kelas' : effectiveRole === 'kepsek' ? 'Kepala Sekolah' : 'Tenaga Kependidikan (Tendik)'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">Pencatat:</span>
          <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200">
            {currentUser.nama} ({currentUser.role.toUpperCase()})
          </span>
        </div>
      </div>

      {/* Target Category Selector (Khusus Admin & Piket) */}
      {isAdminOrPiket && (
        <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800">Kategori Pegawai yang Dientry:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTargetCategory('guru')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetCategory === 'guru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Guru ({listGuruUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setTargetCategory('kepsek')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetCategory === 'kepsek'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Kepala Sekolah ({listKepsekUsers.length})
            </button>
            <button
              type="button"
              onClick={() => setTargetCategory('tendik')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                targetCategory === 'tendik'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tendik ({listTendikUsers.length})
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{submitError}</span>
          <button onClick={() => setSubmitError(null)} className="ml-auto text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Tanggal, Hari (Otomatis), Nama Pegawai, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              <span className="text-blue-600 font-bold">1.</span> Tanggal Ketidakhadiran
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={handleTanggalChange}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              <span className="text-blue-600 font-bold">2.</span> Hari (Otomatis)
            </label>
            <input
              type="text"
              value={hari}
              readOnly
              className="w-full text-xs sm:text-sm bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-xl px-3 py-2.5 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {getDropdownLabel()}
            </label>

            {/* Syarat 6: Bagi Role Kepsek, Guru dan Tendik hanya tampilkan Nama guru tersebut (hilangkan dropdown) */}
            {!isAdminOrPiket ? (
              <div className="w-full text-xs sm:text-sm bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 flex items-center justify-between">
                <span className="truncate">{currentUser.nama}</span>
                <span className="text-[10px] bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase shrink-0">
                  {currentUser.role}
                </span>
              </div>
            ) : (
              /* Syarat 3 & 5: Admin & Piket memilih dari dropdown sesuai kriteria Role di sheet Users */
              <select
                value={namaPegawai}
                onChange={(e) => setNamaPegawai(e.target.value)}
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                required
              >
                <option value="">-- Pilih {getDropdownLabel()} --</option>
                {effectiveRole === 'guru' &&
                  listGuruUsers.map((u) => (
                    <option key={u.username} value={u.nama}>
                      {u.nama}
                    </option>
                  ))}
                {effectiveRole === 'kepsek' &&
                  listKepsekUsers.map((u) => (
                    <option key={u.username} value={u.nama}>
                      {u.nama}
                    </option>
                  ))}
                {effectiveRole === 'tendik' &&
                  listTendikUsers.map((u) => (
                    <option key={u.username} value={u.nama}>
                      {u.nama}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status Ketidakhadiran</label>
            <select
              value={statusKehadiran}
              onChange={(e) => setStatusKehadiran(e.target.value as any)}
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
              required
            >
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
              <option value="Tugas Dinas Luar">Tugas Dinas Luar</option>
              <option value="Tanpa Keterangan">Tanpa Keterangan (Alpa)</option>
            </select>
          </div>
        </div>

        {/* Upload Bukti Ketidakhadiran */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>Upload Bukti Ketidakhadiran (JPG, JPEG, PDF - Maksimal 2 MB)</span>
          </label>

          {!fileBukti ? (
            <label className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 text-center bg-slate-50/70 hover:bg-blue-50/50 cursor-pointer transition flex flex-col items-center justify-center gap-1.5 block">
              <UploadCloud className="w-6 h-6 text-blue-500" />
              <span className="text-xs sm:text-sm font-semibold text-blue-700">
                Klik untuk memilih file bukti atau seret berkas ke sini
              </span>
              <span className="text-[11px] text-slate-400">
                Format: .jpg, .jpeg, .pdf (Otomatis tersimpan ke folder Google Drive)
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 border border-blue-200">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{fileBukti.name}</p>
                  <p className="text-[11px] text-slate-500">{(fileBukti.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFileBukti(null)}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-100 transition shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          )}
        </div>

        {/* Syarat 4: UNTUK GURU SAJA: Tampilkan Bagian Penugasan Multi-Kelas
            UNTUK KEPSEK & TENDIK: Bagian ini otomatis disembunyikan */}
        {effectiveRole === 'guru' && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Rincian Kelas yang Ditinggalkan & Tugas Siswa
                </h3>
                <span className="text-xs text-slate-400">({kelasRows.length} Kelas)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Jumlah Kelas:</span>
                <select
                  value={jumlahKelas}
                  onChange={(e) => handleJumlahKelasChange(parseInt(e.target.value, 10))}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-blue-700 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {kelasRows.map((row, index) => (
                <div
                  key={row.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white inline-flex items-center justify-center text-[10px]">
                        {index + 1}
                      </span>
                      Penugasan Kelas #{index + 1}
                    </span>

                    {kelasRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKelasRow(row.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kelas</label>
                      <select
                        value={row.kelas}
                        onChange={(e) => updateKelasRow(row.id, 'kelas', e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      >
                        {MASTER_KELAS.map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
                      <select
                        value={row.mapel}
                        onChange={(e) => updateKelasRow(row.id, 'mapel', e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      >
                        {MASTER_MAPEL.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jam Awal</label>
                      <select
                        value={row.jamAwal}
                        onChange={(e) => updateKelasRow(row.id, 'jamAwal', e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      >
                        {Array.from({ length: 10 }, (_, i) => `Jam Ke-${i + 1}`).map(j => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Jam Akhir</label>
                      <select
                        value={row.jamAkhir}
                        onChange={(e) => updateKelasRow(row.id, 'jamAkhir', e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      >
                        {Array.from({ length: 10 }, (_, i) => `Jam Ke-${i + 1}`).map(j => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Bentuk Penugasan Siswa
                    </label>
                    <textarea
                      rows={2}
                      value={row.penugasan}
                      onChange={(e) => updateKelasRow(row.id, 'penugasan', e.target.value)}
                      placeholder="Tuliskan materi, instruksi tugas di buku/LKS, atau penugasan Google Classroom..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catatan Tambahan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Catatan Tambahan
          </label>
          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Keterangan lain (misal: surat dokter menyusul, koordinasi via WA)"
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Syarat 13: Notifikasi Berhasil Disimpan DIPINDAHKAN KE BAWAH (di atas tombol Simpan & Kirim WA) */}
        {submitSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <p className="font-bold text-emerald-900">{submitSuccess}</p>
                <p className="text-emerald-700 text-xs mt-0.5">
                  Pemberitahuan telah otomatis diproses dan dikirimkan ke WhatsApp piket <strong>0857-7915-6487</strong>.
                </p>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(null)}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                  >
                    Tutup Notifikasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tombol Simpan Data Absensi */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Pemberitahuan otomatis terkirim via WhatsApp: <span className="font-mono font-bold text-emerald-700">0857-7915-6487</span> saat data disimpan.
          </div>

          <div className="ml-auto">
            {/* Tombol Simpan Data Absensi */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data Absensi'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
