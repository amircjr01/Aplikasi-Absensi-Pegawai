import React, { useState } from 'react';
import {
  BookOpen, Printer, Download, CheckCircle2, ShieldCheck, UserCheck,
  Award, Video, Users, KeyRound, ExternalLink, HelpCircle, FileText,
  ChevronRight, Sparkles, AlertCircle, ArrowRight
} from 'lucide-react';
import { UserAccount } from '../data/initialData';

interface PanduanAplikasiProps {
  currentUser: UserAccount;
}

export const PanduanAplikasi: React.FC<PanduanAplikasiProps> = ({ currentUser }) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'piket' | 'kepsek' | 'guru' | 'tendik'>('all');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handlePrintPanduan = () => {
    window.print();
  };

  const handlePrintViaWindow = () => {
    const printContent = document.getElementById('panduanPrintDocument');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      alert('Jendela cetak diblokir oleh peramban. Harap izinkan popup di peramban Anda.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Buku Panduan Pengguna - Sistem Absensi Pegawai SMPN 1 Ciranjang</title>
        <style>
          @page { size: A4 portrait; margin: 15mm 15mm 20mm 15mm; }
          body { font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.5; font-size: 11pt; padding: 0; margin: 0; }
          .kop { border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; text-align: center; }
          .kop h3 { margin: 0; font-size: 12pt; text-transform: uppercase; font-weight: normal; }
          .kop h2 { margin: 2px 0; font-size: 14pt; text-transform: uppercase; font-weight: bold; }
          .kop h1 { margin: 2px 0; font-size: 16pt; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; }
          .kop p { margin: 0; font-size: 9pt; font-style: italic; }
          h2.section-title { font-size: 13pt; border-bottom: 1.5px solid #000; padding-bottom: 4px; margin-top: 24px; text-transform: uppercase; }
          h3.sub-title { font-size: 11pt; margin-top: 14px; margin-bottom: 4px; color: #1e3a8a; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; font-size: 9.5pt; }
          th, td { border: 1px solid #000; padding: 6px 8px; vertical-align: top; }
          th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
          ol, ul { margin: 6px 0 12px 20px; padding: 0; font-size: 10.5pt; }
          li { margin-bottom: 4px; }
          .badge { display: inline-block; padding: 2px 6px; font-size: 8.5pt; font-weight: bold; border: 1px solid #444; border-radius: 3px; background: #eee; }
          .note-box { border-left: 3px solid #2563eb; background: #f8fafc; padding: 8px 12px; margin: 10px 0; font-size: 9.5pt; }
          .footer-note { margin-top: 30px; font-size: 9pt; text-align: center; border-top: 1px solid #ccc; padding-top: 8px; color: #555; }
          .page-break { page-break-before: always; }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Panduan */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-blue-700/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Dokumen Resmi & Panduan Pengoperasian</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Buku Panduan Penggunaan Sistem Absensi Pegawai
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/90 mt-1.5 leading-relaxed">
              Panduan lengkap tata cara penggunaan sistem bagi 5 kelompok pengguna: <strong>Administrator, Petugas Piket, Kepala Sekolah, Guru Pengampu, dan Tenaga Kependidikan (Tendik)</strong> di lingkungan SMP Negeri 1 Ciranjang.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handlePrintViaWindow}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition transform active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF Panduan</span>
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
            >
              <FileText className="w-4 h-4" />
              <span>Pratinjau Format Dokumen</span>
            </button>
          </div>
        </div>

        {/* Tab Filter Role Panduan */}
        <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-blue-200 shrink-0 mr-1">Tampilkan Panduan:</span>
          {[
            { id: 'all', label: 'Semua Kelompok (Lengkap)', icon: BookOpen },
            { id: 'admin', label: '1. Administrator (Admin)', icon: ShieldCheck },
            { id: 'piket', label: '2. Petugas Piket', icon: UserCheck },
            { id: 'kepsek', label: '3. Kepala Sekolah', icon: Award },
            { id: 'guru', label: '4. Guru Pengampu', icon: Video },
            { id: 'tendik', label: '5. Tenaga Kependidikan', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedRole === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-white text-blue-900 shadow font-bold'
                    : 'bg-white/10 text-blue-100 hover:bg-white/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matriks Ringkasan Hak Akses 5 Role */}
      {(selectedRole === 'all') && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Matriks Hak Akses & Pembagian Fitur 5 Kelompok Pegawai
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Tabel di bawah menjelaskan batasan hak akses dan ketersediaan fitur bagi setiap kelompok akun:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Kelompok Akun</th>
                  <th className="p-3 text-center">Hak Form Absensi</th>
                  <th className="p-3 text-center">Rincian Multi-Kelas</th>
                  <th className="p-3 text-center">Akses Rekapitulasi</th>
                  <th className="p-3 text-center">Cetak PDF & Excel</th>
                  <th className="p-3 text-center">Ganti Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>ADMIN</span>
                  </td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Semua Pegawai</span></td>
                  <td className="p-3 text-center">Dapat dipilih jika target Guru</td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">Penuh (A, B, C)</span></td>
                  <td className="p-3 text-center"><span className="text-emerald-600 font-bold">Ya (Aktif)</span></td>
                  <td className="p-3 text-center"><span className="text-emerald-600 font-bold">Ya (Semua User)</span></td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-slate-600" />
                    <span>PIKET</span>
                  </td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Semua Pegawai</span></td>
                  <td className="p-3 text-center">Dapat dipilih jika target Guru</td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">Harian Saja</span></td>
                  <td className="p-3 text-center"><span className="text-emerald-600 font-bold">Ya (Harian)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak</span></td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-purple-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>KEPSEK</span>
                  </td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">Data Pribadi</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak (Otomatis Disembunyikan)</span></td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">Mandiri (Tabel A)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak (Web Saja)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak</span></td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-emerald-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>GURU</span>
                  </td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Data Pribadi</span></td>
                  <td className="p-3 text-center"><span className="text-emerald-600 font-bold">Ya (Wajib Kelas & Mapel)</span></td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Mandiri (Tabel B)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak (Web Saja)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak</span></td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-amber-900 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>TENDIK</span>
                  </td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Data Pribadi</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak (Otomatis Disembunyikan)</span></td>
                  <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Mandiri (Tabel C)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak (Web Saja)</span></td>
                  <td className="p-3 text-center"><span className="text-slate-400">Tidak</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bagian 1: Panduan Role Admin */}
      {(selectedRole === 'all' || selectedRole === 'admin') && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Panduan Khusus Role Administrator (ADMIN)</h2>
              <p className="text-xs text-slate-500">Tanggung jawab pengawasan penuh, manajemen akun & password, serta rekapitulasi komprehensif.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                A. Mengganti & Reset Password Pengguna
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Buka tab <strong>"Ganti Password (Admin)"</strong>.</li>
                <li>Pilih nama akun pegawai pada menu dropdown <em>"Pilih Pegawai / Akun"</em>.</li>
                <li>Perhatikan kotak readonly: sistem akan menampilkan <strong>Nama Lengkap</strong> dan <strong>Role Pegawai</strong> yang dipilih secara otomatis untuk memastikan ketepatan sasaran.</li>
                <li>Ketikkan <strong>Password Baru</strong> (minimal 4 karakter) dan ketikkan ulang di kotak konfirmasi.</li>
                <li>Klik tombol <strong>"Simpan Password Baru"</strong>. Sistem akan langsung memperbarui password akun di sheet <code>Users</code>.</li>
              </ol>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                B. Input Absensi atas Nama Pegawai Lain
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Buka tab <strong>"Form Input Absensi"</strong>.</li>
                <li>Pada kotak <em>"Target Kategori Pegawai"</em>, pilih antara <strong>Guru Pengampu</strong>, <strong>Kepala Sekolah</strong>, atau <strong>Tenaga Kependidikan</strong>.</li>
                <li>Pilih nama pegawai bersangkutan dari daftar dropdown.</li>
                <li>Tentukan Status Kehadiran (Sakit, Izin, Tugas Dinas, Tanpa Keterangan).</li>
                <li>Jika memilih Guru: Isi kelas, jam ke-, mapel, dan tugas siswa. Jika Kepsek/Tendik: isian kelas otomatis disembunyikan.</li>
                <li>Klik <strong>"Simpan Data"</strong> (pesan WhatsApp otomatis terbuka ke nomor tujuan).</li>
              </ol>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 md:col-span-2">
              <h3 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                C. Rekapitulasi & Cetak Dokumen PDF Resmi
              </h3>
              <p className="text-slate-600">
                Admin dapat memilih filter <strong>Harian, Mingguan, Bulanan, atau Semua Riwayat</strong>.
                Pada tabel rekapitulasi, data disajikan terpisah:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Tabel A</strong>: Rekap Kepala Sekolah</li>
                <li><strong>Tabel B</strong>: Rekap Guru Pengampu (Multi-Kelas)</li>
                <li><strong>Tabel C</strong>: Rekap Tenaga Kependidikan (Tendik)</li>
              </ul>
              <div className="mt-2 p-2.5 bg-blue-50/80 rounded-lg text-blue-900 text-[11px]">
                <strong>Cara Cetak PDF:</strong> Klik tombol biru <strong>"Cetak Laporan (PDF)"</strong>. Jendela pratinjau dokumen dengan Kop Resmi SMPN 1 Ciranjang akan terbuka. Anda dapat langsung mencetak atau memilih "Simpan sebagai PDF". Bagian catatan kaki otomatis memuat teks resmi dan tanggal cetak.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bagian 2: Panduan Role Petugas Piket */}
      {(selectedRole === 'all' || selectedRole === 'piket') && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. Panduan Khusus Role Petugas Piket (PIKET)</h2>
              <p className="text-xs text-slate-500">Mencatat kehadiran harian guru dan pegawai yang berhalangan hadir pada jam kerja harian.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                A. Prosedur Input Piket Harian
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Masuk menggunakan akun <code>piket</code>.</li>
                <li>Pilih kategori pegawai yang berhalangan (Guru / Tendik / Kepsek).</li>
                <li>Pilih nama pegawai dari dropdown.</li>
                <li>Masukkan keterangan ketidakhadiran dan unggah surat bukti jika ada.</li>
                <li>Khusus untuk Guru: Masukkan kelas yang ditinggalkan, jam ke-, mapel, dan tugas yang harus dikerjakan siswa.</li>
                <li>Klik tombol <strong>"Simpan Data"</strong>. Notifikasi konfirmasi akan muncul di bagian bawah dan WhatsApp otomatis terbuka.</li>
              </ol>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                B. Rekapitulasi Harian & Cetak Laporan Piket
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Buka tab <strong>"Rekapitulasi Absensi (Harian)"</strong>.</li>
                <li>Pilih tanggal piket hari ini.</li>
                <li>Periksa catatan ketidakhadiran pada Tabel A (Kepsek), Tabel B (Guru), dan Tabel C (Tendik).</li>
                <li>Klik tombol <strong>"Cetak Laporan (PDF)"</strong> untuk mencetak rekap harian sebagai arsip meja piket dan laporan ke pimpinan.</li>
                <li>Petugas Piket juga dapat mengunduh berkas <code>.xlsx</code> untuk diarsipkan di komputer.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Bagian 3: Panduan Role Kepala Sekolah */}
      {(selectedRole === 'all' || selectedRole === 'kepsek') && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Panduan Khusus Role Kepala Sekolah (KEPSEK)</h2>
              <p className="text-xs text-slate-500">Mencatat ketidakhadiran dinas/sakit mandiri dan memantau riwayat presensi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                A. Pencatatan Ketidakhadiran Mandiri
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Login menggunakan akun <code>kepsek</code>.</li>
                <li>Nama Kepala Sekolah langsung terkunci otomatis pada form tanpa perlu memilih dropdown.</li>
                <li>Pilih status kehadiran: Sakit, Izin, atau Tugas Dinas Luar.</li>
                <li>Unggah dokumen pendukung (Surat Tugas / Surat Keterangan Dokter) jika ada.</li>
                <li>Tuliskan catatan tambahan (misal: "Menghadiri Rakor MKKS di Cianjur").</li>
                <li>Klik <strong>"Simpan Data"</strong>. Data langsung tersimpan di sheet <code>Rekap</code> dan terkirim ke WhatsApp sekolah.</li>
              </ol>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                B. Melihat Riwayat Presensi Mandiri
              </h3>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Buka tab <strong>"Rekapitulasi Absensi"</strong>.</li>
                <li>Kepala Sekolah dapat memilih filter rentang <strong>Harian, Mingguan, atau Bulanan</strong>.</li>
                <li>Hanya catatan milik Kepala Sekolah (Tabel A) yang akan ditampilkan untuk menjaga privasi.</li>
                <li>Tampilan pada web disajikan ringkas tanpa tombol cetak dokumen.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Bagian 4: Panduan Role Guru Pengampu */}
      {(selectedRole === 'all' || selectedRole === 'guru') && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">4. Panduan Khusus Role Guru Pengampu (GURU)</h2>
              <p className="text-xs text-slate-500">Mencatat absensi mandiri lengkap dengan rincian penugasan siswa per jam pelajaran.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/70 space-y-2">
              <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Langkah Mengisi Absensi & Penugasan Siswa Multi-Kelas:
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                <li>Masuk dengan username masing-masing (contoh: <code>guru01</code> s/d <code>guru55</code>).</li>
                <li>Nama Guru otomatis terisi pada form (tidak perlu memilih nama guru lain).</li>
                <li>Tentukan <strong>Tanggal</strong> dan <strong>Status Ketidakhadiran</strong>.</li>
                <li>Unggah bukti (opsional): foto surat sakit / tugas ke Google Drive.</li>
                <li>
                  <strong>Rincian Penugasan Kelas:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                    <li>Pilih <strong>Jumlah Kelas</strong> yang ditinggalkan (1 sampai 8 kelas).</li>
                    <li>Pada setiap baris kelas: pilih <strong>Kelas</strong> (contoh: 7 - A), <strong>Jam Ke-</strong>, dan <strong>Mata Pelajaran</strong>.</li>
                    <li>Tuliskan <strong>Bentuk Penugasan</strong> bagi siswa (contoh: "Mengerjakan LKS hal 45 No 1-10").</li>
                  </ul>
                </li>
                <li>Klik tombol <strong>"Simpan Data"</strong> di bagian bawah.</li>
                <li>Pesan WhatsApp otomatis tersusun dan terbuka di aplikasi WhatsApp untuk diteruskan ke petugas piket atau grup guru.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Bagian 5: Panduan Role Tenaga Kependidikan */}
      {(selectedRole === 'all' || selectedRole === 'tendik') && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">5. Panduan Khusus Role Tenaga Kependidikan (TENDIK)</h2>
              <p className="text-xs text-slate-500">Mencatat ketidakhadiran staf tata usaha/kependidikan secara mudah dan ringkas.</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/70 space-y-2">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Langkah Mengisi Absensi Tenaga Kependidikan:
              </h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                <li>Masuk dengan username tendik (contoh: <code>tendik01</code>).</li>
                <li>Nama Tendik otomatis terisi pada formulir.</li>
                <li>Formulir dirancang ringkas (kolom penugasan kelas otomatis ditiadakan karena Tendik tidak memiliki jam mengajar kelas).</li>
                <li>Pilih Status (Sakit, Izin, Tugas Dinas) dan masukkan file bukti atau catatan pekerjaan pengganti.</li>
                <li>Klik <strong>"Simpan Data"</strong>. Data tersimpan di sheet <code>Rekap</code> dengan nilai strip <code>(-)</code> pada kolom kelas dan mapel secara rapi.</li>
                <li>Tendik dapat memeriksa riwayat kehadiran mandiri di tab Rekapitulasi (Tabel C).</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tanya Jawab & Solusi Masalah (Troubleshooting) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Pertanyaan Sering Diajukan (FAQ) & Solusi Kendala
        </h2>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Q1: Mengapa jendela WhatsApp tidak terbuka otomatis setelah klik Simpan?</span>
            <p>Sebagian peramban (Chrome, Edge, Safari) mengaktifkan fitur <em>"Block Pop-ups"</em>. Cukup klik ikon gembok / popup di bilah alamat peramban dan pilih <em>"Always allow pop-ups"</em>, atau klik tombol <strong>"Kirim Pesan Lewat WhatsApp"</strong> manual yang berada tepat di sebelah kiri tombol Simpan.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Q2: Bagaimana jika terjadi kesalahan penulisan saat mengganti password?</span>
            <p>Hanya akun Administrator yang berhak mengganti password. Pada halaman Ganti Password, perhatikan kotak indikator <strong>Nama Lengkap</strong> dan <strong>Role Pegawai</strong> yang tampil sebelum menekan tombol simpan untuk memastikan akun yang diubah sudah benar.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Q3: Bagaimana cara mencetak laporan PDF agar rapi dan tidak terpotong?</span>
            <p>Pada dialog cetak browser (Ctrl+P), pastikan opsi <strong>Layout</strong> diset ke <strong>Landscape</strong>, ukuran kertas <strong>A4</strong>, dan centang opsi <strong>"Background graphics"</strong> agar warna badge dan kop surat tercetak jelas.</p>
          </div>
        </div>
      </div>

      {/* Hidden printable template used for printing via print window */}
      <div id="panduanPrintDocument" className="hidden">
        <div className="kop">
          <h3>Pemerintah Daerah Kabupaten Cianjur</h3>
          <h2>Dinas Pendidikan Pemuda dan Olahraga</h2>
          <h1>SMP NEGERI 1 CIRANJANG</h1>
          <p>Jalan Raya Ciranjang No. 1, Ciranjang, Kabupaten Cianjur, Jawa Barat 43282</p>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: '0', fontSize: '13pt', textDecoration: 'underline' }}>
            BUKU PANDUAN PENGGUNAAN SISTEM ABSENSI PEGAWAI
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '10pt', color: '#555' }}>
            Petunjuk Operasional Bagi Administrator, Petugas Piket, Kepala Sekolah, Guru, dan Tenaga Kependidikan
          </p>
        </div>

        <h2 className="section-title">1. Matriks Hak Akses & Pembagian Fitur</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Entri Absensi</th>
              <th>Penugasan Kelas</th>
              <th>Akses Rekapitulasi</th>
              <th>Cetak PDF / Excel</th>
              <th>Ganti Password</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ADMIN</strong></td>
              <td>Semua Pegawai</td>
              <td>Dapat Diisi</td>
              <td>Lengkap (A, B, C)</td>
              <td>Ya (Penuh)</td>
              <td>Ya (Semua User)</td>
            </tr>
            <tr>
              <td><strong>PIKET</strong></td>
              <td>Semua Pegawai</td>
              <td>Dapat Diisi</td>
              <td>Harian Saja</td>
              <td>Ya (Harian)</td>
              <td>Tidak</td>
            </tr>
            <tr>
              <td><strong>KEPSEK</strong></td>
              <td>Mandiri</td>
              <td>Tidak Ada</td>
              <td>Mandiri (Tabel A)</td>
              <td>Web Saja</td>
              <td>Tidak</td>
            </tr>
            <tr>
              <td><strong>GURU</strong></td>
              <td>Mandiri</td>
              <td>Wajib Diisi</td>
              <td>Mandiri (Tabel B)</td>
              <td>Web Saja</td>
              <td>Tidak</td>
            </tr>
            <tr>
              <td><strong>TENDIK</strong></td>
              <td>Mandiri</td>
              <td>Tidak Ada</td>
              <td>Mandiri (Tabel C)</td>
              <td>Web Saja</td>
              <td>Tidak</td>
            </tr>
          </tbody>
        </table>

        <h2 className="section-title">2. Panduan Operasional Administrator</h2>
        <ol>
          <li><strong>Manajemen Password:</strong> Pilih akun pegawai pada menu dropdown. Sistem menampilkan Nama Lengkap dan Role secara otomatis (readonly). Masukkan password baru minimal 4 karakter dan simpan.</li>
          <li><strong>Input Presensi:</strong> Pilih target kelompok (Guru, Kepsek, Tendik), pilih nama pegawai, tentukan status kehadiran, upload bukti jika ada, dan simpan.</li>
          <li><strong>Rekapitulasi:</strong> Akses filter Harian, Mingguan, Bulanan, dan Semua Riwayat. Cetak PDF resmi dengan format Kop Sekolah dan ekspor berkas Excel (.xlsx).</li>
        </ol>

        <h2 className="section-title">3. Panduan Operasional Petugas Piket</h2>
        <ol>
          <li>Login dengan akun <code>piket</code>.</li>
          <li>Catat pegawai yang berhalangan hadir pada hari tersebut. Untuk guru pengampu, wajib mengisi rincian kelas, mapel, dan tugas siswa.</li>
          <li>Akses Rekap Harian untuk mengecek rekapitulasi harian dan cetak laporan PDF sebagai arsip meja piket.</li>
        </ol>

        <h2 className="section-title">4. Panduan Operasional Kepala Sekolah & Tendik</h2>
        <ol>
          <li>Login menggunakan akun masing-masing. Nama pegawai terkunci otomatis.</li>
          <li>Formulir khusus Kepsek dan Tendik tidak memunculkan isian kelas sehingga pengisian sangat cepat dan ringkas.</li>
          <li>Lihat riwayat kehadiran mandiri di menu Rekapitulasi (tanpa fitur cetak laporan).</li>
        </ol>

        <h2 className="section-title">5. Panduan Operasional Guru Pengampu</h2>
        <ol>
          <li>Login dengan akun guru (<code>guru01</code> s/d <code>guru55</code>).</li>
          <li>Isi formulir presensi dan tentukan jumlah kelas yang ditinggalkan.</li>
          <li>Pilih kelas, jam ke-, mapel, dan tuliskan tugas siswa.</li>
          <li>Klik Simpan Data; notifikasi sukses muncul di bagian bawah dan WhatsApp otomatis terbuka.</li>
        </ol>

        <div className="footer-note">
          Dokumen Panduan ini dihasilkan oleh Aplikasi Sistem Absensi Pegawai SMPN 1 Ciranjang • Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </div>
      </div>

      {/* Modal Pratinjau Dokumen PDF Panduan */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">Pratinjau Dokumen Panduan Aplikasi (Format Cetak PDF)</h3>
                  <p className="text-[11px] text-slate-400">Layout standar cetak A4 dengan Kop Surat Resmi SMPN 1 Ciranjang</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintViaWindow}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Document Sheet */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
              <div className="bg-white p-8 sm:p-12 shadow-md max-w-3xl w-full border border-slate-200 text-slate-900 font-serif text-xs leading-relaxed space-y-4">
                {/* Kop Surat */}
                <div className="border-b-4 border-double border-black pb-3 text-center">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-slate-800">PEMERINTAH DAERAH KABUPATEN CIANJUR</h4>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-slate-800">DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA</h4>
                  <h2 className="text-base font-black uppercase tracking-widest text-black mt-1">SMP NEGERI 1 CIRANJANG</h2>
                  <p className="text-[10px] text-slate-600 italic">Jalan Raya Ciranjang No. 1, Ciranjang, Kabupaten Cianjur, Jawa Barat 43282</p>
                </div>

                <div className="text-center py-2">
                  <h3 className="font-bold text-sm uppercase underline">BUKU PANDUAN PENGGUNAAN SISTEM ABSENSI PEGAWAI</h3>
                  <p className="text-[11px] text-slate-500">Panduan Operasional 5 Kelompok Pegawai</p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-900 block mb-1">Ringkasan Hak Akses:</span>
                    <ul className="list-disc pl-5 space-y-0.5 text-slate-600 text-[11px]">
                      <li><strong>ADMIN</strong>: Akses penuh semua form, rekap A/B/C, ekspor Excel, cetak PDF resmi, dan ganti password semua pengguna.</li>
                      <li><strong>PIKET</strong>: Input presensi harian semua pegawai, penugasan guru, dan cetak Rekap Harian meja piket.</li>
                      <li><strong>KEPSEK</strong>: Presensi mandiri tanpa kolom kelas, melihat riwayat kehadiran pribadi (Tabel A).</li>
                      <li><strong>GURU</strong>: Presensi mandiri dengan pengisian multi-kelas dan penugasan siswa, pesan WhatsApp otomatis.</li>
                      <li><strong>TENDIK</strong>: Presensi mandiri ringkas tanpa kelas, melihat riwayat kehadiran pribadi (Tabel C).</li>
                    </ul>
                  </div>

                  <p className="text-[11px] text-slate-600">
                    Panduan operasional rinci telah disesuaikan dengan alur kerja di lingkungan SMP Negeri 1 Ciranjang.
                    Gunakan tombol <strong>"Cetak / Simpan PDF"</strong> di atas untuk menyimpan dokumen panduan ini dalam format PDF siap cetak.
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200 flex justify-between text-[11px] font-sans">
                  <div className="text-center w-48">
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala Sekolah</p>
                    <div className="h-14"></div>
                    <p className="font-bold underline">Dra. YETTY NURHAYATI, S.Pd., M.Pd.</p>
                    <p className="text-[10px]">NIP. 196709101994032006</p>
                  </div>

                  <div className="text-center w-48">
                    <p>Ciranjang, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    <p className="font-bold">Administrator Sistem</p>
                    <div className="h-14"></div>
                    <p className="font-bold underline">{currentUser.nama}</p>
                    <p className="text-[10px] text-slate-500">[{currentUser.role.toUpperCase()}]</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 italic font-sans">
                  Dokumen ini dihasilkan oleh Aplikasi Sistem Aplikasi Pegawai SMPN 1 Ciranjang • Dicetak pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
