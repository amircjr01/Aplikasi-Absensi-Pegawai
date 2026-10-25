import React, { useState, useMemo } from 'react';
import { UserAccount, RekapRecord, INITIAL_USERS } from '../data/initialData';
import {
  FileSpreadsheet, Printer, Filter, ExternalLink, FileText,
  Download, Award, Video, UserCheck, Shield, ChevronRight
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface RekapitulasiProps {
  currentUser: UserAccount;
  records: RekapRecord[];
}

export const Rekapitulasi: React.FC<RekapitulasiProps> = ({ currentUser, records }) => {
  const role = currentUser.role.toLowerCase();
  const isAdmin = role === 'admin';
  const isPiket = role === 'piket';
  const isEmployee = role === 'kepsek' || role === 'guru' || role === 'tendik';

  const todayStr = new Date().toISOString().split('T')[0];

  // Syarat 11: Kepsek, Guru, dan Tendik dapat melihat Harian, Mingguan, Bulanan
  // Syarat 9: Piket tetap hanya Harian
  const [filterTipe, setFilterTipe] = useState<'harian' | 'mingguan' | 'bulanan' | 'semua'>(
    isPiket ? 'harian' : 'harian'
  );
  const [filterTanggal, setFilterTanggal] = useState(todayStr);
  const [filterTglMulai, setFilterTglMulai] = useState(todayStr);
  const [filterTglSelesai, setFilterTglSelesai] = useState(todayStr);
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());

  // Active sub-table view (Semua, atau spesifik Tabel A/B/C)
  const [activeTableTab, setActiveTableTab] = useState<'all' | 'kepsek' | 'guru' | 'tendik'>('all');

  // Filter records based on role and date
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Syarat 11: Jika Kepsek, Guru, atau Tendik, hanya tampilkan data dirinya sendiri
      if (isEmployee) {
        const myName = currentUser.nama.toLowerCase();
        const recordName = r.namaGuru.toLowerCase();
        if (!recordName.includes(myName) && !myName.includes(recordName)) {
          return false;
        }
      }

      const activeTipe = isPiket ? 'harian' : filterTipe;

      if (activeTipe === 'harian') {
        return r.tanggal === filterTanggal;
      }
      if (activeTipe === 'mingguan') {
        return r.tanggal >= filterTglMulai && r.tanggal <= filterTglSelesai;
      }
      if (activeTipe === 'bulanan') {
        const d = new Date(r.tanggal);
        return (d.getMonth() + 1 === filterBulan) && (d.getFullYear() === filterTahun);
      }
      return true; // 'semua'
    });
  }, [records, role, isEmployee, currentUser.nama, isPiket, filterTipe, filterTanggal, filterTglMulai, filterTglSelesai, filterBulan, filterTahun]);

  // Helper untuk menentukan kategori pegawai dari record (Kepsek, Guru, Tendik)
  const getRecordCategory = (r: RekapRecord): 'kepsek' | 'guru' | 'tendik' => {
    if (r.rolePegawai) return r.rolePegawai;
    const userFound = INITIAL_USERS.find(u => u.nama.toLowerCase() === r.namaGuru.toLowerCase());
    if (userFound && (userFound.role === 'kepsek' || userFound.role === 'guru' || userFound.role === 'tendik')) {
      return userFound.role;
    }
    const namaLower = r.namaGuru.toLowerCase();
    if (namaLower.includes('yetty nurhayati') || namaLower.includes('kepsek')) {
      return 'kepsek';
    }
    if (r.kelas === '-' && r.mapel === '-') {
      return 'tendik';
    }
    return 'guru';
  };

  // Helper untuk membersihkan nama hari jika sudah ada di string tanggal
  const getCleanTanggalOnly = (tgl: string) => {
    if (!tgl) return '-';
    return tgl.replace(/^(Senin|Selasa|Rabu|Kamis|Jum['’]?at|Sabtu|Minggu)[,\s]+/gi, '').trim();
  };

  // Helper untuk format Hari / Tanggal agar TIDAK terjadi duplikasi hari ganda
  const formatHariTanggalClean = (hari: string, tgl: string) => {
    if (!hari && !tgl) return '-';
    const cleanTgl = getCleanTanggalOnly(tgl);
    const day = (hari || '').trim() || (tgl.match(/^(Senin|Selasa|Rabu|Kamis|Jum['’]?at|Sabtu|Minggu)/i)?.[0] ?? '');
    if (day && cleanTgl && cleanTgl !== '-') {
      return `${day}, ${cleanTgl}`;
    }
    return day || cleanTgl || '-';
  };

  // Syarat 7: Pisahkan data menjadi 3 kelompok:
  // a. Tabel A: Kepala Sekolah
  // b. Tabel B: Guru
  // c. Tabel C: Tenaga Kependidikan (Tendik)
  const recordsKepsek = useMemo(() => filteredRecords.filter(r => getRecordCategory(r) === 'kepsek'), [filteredRecords]);
  const recordsGuru = useMemo(() => filteredRecords.filter(r => getRecordCategory(r) === 'guru'), [filteredRecords]);
  const recordsTendik = useMemo(() => filteredRecords.filter(r => getRecordCategory(r) === 'tendik'), [filteredRecords]);

  // Statistik per kategori
  const hitungStatistik = (list: RekapRecord[]) => {
    const uniqueDays = new Set<string>();
    let sakit = 0, izin = 0, tugas = 0, alpa = 0;
    list.forEach(r => {
      const key = `${r.tanggal}___${r.namaGuru}`;
      if (!uniqueDays.has(key)) {
        uniqueDays.add(key);
        const st = r.statusKehadiran.toLowerCase();
        if (st.includes('sakit')) sakit++;
        else if (st.includes('izin')) izin++;
        else if (st.includes('tugas')) tugas++;
        else alpa++;
      }
    });
    return { total: uniqueDays.size, sakit, izin, tugas, alpa };
  };

  const statsTotal = useMemo(() => hitungStatistik(filteredRecords), [filteredRecords]);
  const statsKepsek = useMemo(() => hitungStatistik(recordsKepsek), [recordsKepsek]);
  const statsGuru = useMemo(() => hitungStatistik(recordsGuru), [recordsGuru]);
  const statsTendik = useMemo(() => hitungStatistik(recordsTendik), [recordsTendik]);

  // Grouping Guru Multi-Kelas
  const groupedGuru = useMemo(() => {
    const map = new Map<string, {
      namaGuru: string;
      statusKehadiran: string;
      tanggal: string;
      hari: string;
      linkKehadiran: string;
      catatan: string;
      items: {
        kelas: string;
        jamAwal: string;
        jamAkhir: string;
        mapel: string;
        penugasan: string;
      }[];
    }>();

    recordsGuru.forEach(r => {
      const key = `${r.tanggal}___${r.namaGuru}`;
      if (!map.has(key)) {
        map.set(key, {
          namaGuru: r.namaGuru,
          statusKehadiran: r.statusKehadiran,
          tanggal: r.tanggal,
          hari: r.hari,
          linkKehadiran: r.linkKehadiran,
          catatan: r.catatan,
          items: []
        });
      }
      map.get(key)!.items.push({
        kelas: r.kelas,
        jamAwal: r.jamAwal,
        jamAkhir: r.jamAkhir,
        mapel: r.mapel,
        penugasan: r.bentukPenugasan
      });
    });

    return Array.from(map.values());
  }, [recordsGuru]);

  // Summary per Guru (Mingguan/Bulanan)
  const teacherSummary = useMemo(() => {
    const map = new Map<string, {
      namaGuru: string;
      sakit: number;
      izin: number;
      tugas: number;
      alpa: number;
      totalHari: number;
      rincian: string[];
    }>();
    const seen = new Set<string>();

    recordsGuru.forEach(r => {
      const dayKey = `${r.tanggal}___${r.namaGuru}`;
      if (!map.has(r.namaGuru)) {
        map.set(r.namaGuru, {
          namaGuru: r.namaGuru,
          sakit: 0,
          izin: 0,
          tugas: 0,
          alpa: 0,
          totalHari: 0,
          rincian: []
        });
      }
      if (!seen.has(dayKey)) {
        seen.add(dayKey);
        const obj = map.get(r.namaGuru)!;
        obj.totalHari++;
        const st = r.statusKehadiran.toLowerCase();
        let label = 'Tanpa Ket.';
        if (st.includes('sakit')) { obj.sakit++; label = 'Sakit'; }
        else if (st.includes('izin')) { obj.izin++; label = 'Izin'; }
        else if (st.includes('tugas')) { obj.tugas++; label = 'Tugas Dinas'; }
        else { obj.alpa++; }
        obj.rincian.push(`${r.tanggal} (${label})`);
      }
    });

    return Array.from(map.values());
  }, [recordsGuru]);

  // Syarat 10: Hilangkan kolom waktu pada ekspor Excel
  const handleUnduhExcel = () => {
    if (filteredRecords.length === 0) {
      alert('Tidak ada data yang tersedia untuk diunduh.');
      return;
    }

    const rowsData = filteredRecords.map((r, idx) => ({
      'No': idx + 1,
      'Kategori': getRecordCategory(r).toUpperCase(),
      'Hari': r.hari,
      'Tanggal': r.tanggal,
      'Nama Pegawai': r.namaGuru,
      'Status Kehadiran': r.statusKehadiran,
      'Link Bukti Drive': r.linkKehadiran,
      'Kelas': r.kelas !== '-' ? r.kelas : '',
      'Jam Awal': r.jamAwal !== '-' ? r.jamAwal : '',
      'Jam Akhir': r.jamAkhir !== '-' ? r.jamAkhir : '',
      'Mata Pelajaran': r.mapel !== '-' ? r.mapel : '',
      'Bentuk Penugasan': r.bentukPenugasan !== '-' ? r.bentukPenugasan : '',
      'Catatan': r.catatan
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rowsData);

    ws['!cols'] = [
      { wch: 6 },  // No
      { wch: 12 }, // Kategori
      { wch: 10 }, // Hari
      { wch: 14 }, // Tanggal
      { wch: 28 }, // Nama Pegawai
      { wch: 18 }, // Status
      { wch: 35 }, // Link Drive
      { wch: 10 }, // Kelas
      { wch: 12 }, // Jam Awal
      { wch: 12 }, // Jam Akhir
      { wch: 28 }, // Mapel
      { wch: 38 }, // Tugas
      { wch: 30 }  // Catatan
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Pegawai');
    const filename = `Rekap_Absensi_Pegawai_${filterTipe}_${filterTanggal}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleCetakPDF = () => {
    setShowPdfModal(true);
  };

  const handlePrintDocument = () => {
    const docElem = document.getElementById('reportPrintContent');
    if (!docElem) return;

    const printWin = window.open('', '_blank', 'width=1100,height=850');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Laporan Rekapitulasi Absensi Pegawai - SMPN 1 Ciranjang</title>
        <style>
          @page { size: A4 landscape; margin: 10mm 12mm 15mm 12mm; }
          body { font-family: 'Times New Roman', Times, serif; color: #000; font-size: 9.5pt; margin: 0; padding: 0; }
          .kop { border-bottom: 3px double #000; padding-bottom: 6px; margin-bottom: 12px; text-align: center; }
          .kop h3 { margin: 0; font-size: 11pt; text-transform: uppercase; font-weight: normal; }
          .kop h2 { margin: 2px 0; font-size: 13pt; text-transform: uppercase; font-weight: bold; }
          .kop h1 { margin: 2px 0; font-size: 16pt; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5px; }
          .kop p { margin: 0; font-size: 8.5pt; font-style: italic; }
          .title-doc { text-align: center; margin-bottom: 12px; }
          .title-doc h2 { margin: 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline; }
          .meta-info { display: flex; justify-content: space-between; font-size: 9pt; margin-bottom: 10px; }
          h4.table-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; margin: 12px 0 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 8.5pt; }
          th, td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
          th { background-color: #eaeaea !important; -webkit-print-color-adjust: exact; text-align: center; font-weight: bold; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          .signatures { margin-top: 25px; display: flex; justify-content: space-between; font-size: 9.5pt; page-break-inside: avoid; }
          .sign-col { width: 40%; text-align: center; }
          .sign-space { height: 50px; }
          .doc-footer { margin-top: 25px; border-top: 1px solid #888; padding-top: 5px; font-size: 8pt; text-align: center; font-style: italic; color: #444; }
        </style>
      </head>
      <body>
        ${docElem.innerHTML}
        <script>
          window.onload = function() {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('sakit')) return 'bg-amber-100 text-amber-800 border-amber-300';
    if (s.includes('izin')) return 'bg-sky-100 text-sky-800 border-sky-300';
    if (s.includes('tugas')) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const isSummaryMode = filterTipe === 'mingguan' || filterTipe === 'bulanan';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">
        {/* Header Rekapitulasi */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                Rekapitulasi Absensi Pegawai
              </h2>
              {isEmployee && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Data Pribadi ({currentUser.nama.split(',')[0]})
                </span>
              )}
              {isPiket && (
                <span className="text-[11px] bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  Mode Piket (Harian)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEmployee
                ? 'Riwayat catatan absensi Anda yang tersimpan di sistem'
                : 'Laporan Rekapitulasi Terpisah: Tabel A (Kepsek), Tabel B (Guru), Tabel C (Tendik)'}
            </p>
          </div>

          {/* Syarat 11: Tombol Cetak PDF dan Unduh Excel HANYA untuk Admin & Piket.
              Kepsek, Guru, dan Tendik TIDAK memiliki tombol ini (hanya tampil di web). */}
          {!isEmployee && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCetakPDF}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Laporan (PDF)</span>
              </button>

              <button
                onClick={handleUnduhExcel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Excel (.xlsx)</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Jenis Periode Rekap</span>
              </label>
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value as any)}
                className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="harian">Laporan Harian</option>
                {/* Piket hanya harian. Admin, Kepsek, Guru, Tendik bisa mingguan dan bulanan */}
                {!isPiket && (
                  <>
                    <option value="mingguan">Laporan Mingguan (Rentang)</option>
                    <option value="bulanan">Laporan Bulanan</option>
                    <option value="semua">Semua Riwayat</option>
                  </>
                )}
              </select>
            </div>

            {filterTipe === 'harian' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Tanggal</label>
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {filterTipe === 'mingguan' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dari Tanggal</label>
                  <input
                    type="date"
                    value={filterTglMulai}
                    onChange={(e) => setFilterTglMulai(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={filterTglSelesai}
                    onChange={(e) => setFilterTglSelesai(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {filterTipe === 'bulanan' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bulan</label>
                  <select
                    value={filterBulan}
                    onChange={(e) => setFilterBulan(parseInt(e.target.value, 10))}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {[
                      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                    ].map((b, idx) => (
                      <option key={b} value={idx + 1}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={filterTahun}
                    onChange={(e) => setFilterTahun(parseInt(e.target.value, 10))}
                    className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="text-right">
              <span className="text-[11px] text-slate-500 block mb-1">Total Entri:</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-3 py-2 rounded-xl inline-block w-full text-center border border-blue-200">
                {filteredRecords.length} Catatan Absensi
              </span>
            </div>
          </div>
        </div>

        {/* Syarat 7: Tab Navigasi Pemisahan Tabel (Tabel A, B, C) */}
        {!isEmployee && (
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTableTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTableTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Semua Kategori</span>
              <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                {statsTotal.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTableTab('kepsek')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTableTab === 'kepsek'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tabel A: Kepala Sekolah</span>
              <span className="bg-purple-200/80 text-purple-900 px-1.5 py-0.2 rounded-full text-[10px]">
                {statsKepsek.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTableTab('guru')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTableTab === 'guru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Tabel B: Guru Pengampu</span>
              <span className="bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded-full text-[10px]">
                {statsGuru.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTableTab('tendik')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                activeTableTab === 'tendik'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Tabel C: Tenaga Kependidikan</span>
              <span className="bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
                {statsTendik.total}
              </span>
            </button>
          </div>
        )}

        {/* Ringkasan Statistik */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-600 block">Total Pegawai Absen</span>
            <span className="text-2xl font-black text-blue-700">{statsTotal.total}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Pegawai Tidak Hadir</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-600 block">Sakit</span>
            <span className="text-2xl font-black text-amber-600">{statsTotal.sakit}</span>
            <span className="text-[10px] text-amber-500 block mt-0.5">Surat Dokter</span>
          </div>

          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-600 block">Izin</span>
            <span className="text-2xl font-black text-sky-600">{statsTotal.izin}</span>
            <span className="text-[10px] text-sky-500 block mt-0.5">Keperluan Resmi</span>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-600 block">Tugas Dinas</span>
            <span className="text-2xl font-black text-purple-700">{statsTotal.tugas}</span>
            <span className="text-[10px] text-purple-500 block mt-0.5">Surat Tugas</span>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-slate-600 block">Tanpa Keterangan</span>
            <span className="text-2xl font-black text-rose-600">{statsTotal.alpa}</span>
            <span className="text-[10px] text-rose-400 block mt-0.5">Alpa</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABEL A: KEPALA SEKOLAH                                                  */}
        {/* Syarat 8: Hanya menampilkan kolom yang dientry (No, Hari/Tgl, Nama, Status, Bukti, Catatan) */}
        {/* Syarat 10: Hilangkan kolom Waktu                                         */}
        {/* ========================================================================= */}
        {(activeTableTab === 'all' || activeTableTab === 'kepsek') && (role !== 'guru' && role !== 'tendik') && (
          <div className="mb-8">
            <div className="flex items-center justify-between bg-purple-900 text-white px-4 py-2.5 rounded-t-xl">
              <span className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-300" />
                Tabel A: Rekapitulasi Ketidakhadiran Kepala Sekolah
              </span>
              <span className="text-xs bg-purple-700 px-2 py-0.5 rounded text-purple-100 font-semibold">
                {recordsKepsek.length} Catatan
              </span>
            </div>

            <div className="border-x border-b border-slate-200 rounded-b-xl overflow-x-auto bg-white">
              {recordsKepsek.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Tidak ada catatan ketidakhadiran Kepala Sekolah pada periode ini.</p>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-purple-50 text-purple-950 font-bold border-b border-purple-100">
                    <tr>
                      <th className="p-2.5 text-center w-10">#</th>
                      <th className="p-2.5 w-36">Hari / Tanggal</th>
                      <th className="p-2.5">Nama Kepala Sekolah</th>
                      <th className="p-2.5 w-32">Status</th>
                      <th className="p-2.5 text-center w-28">Bukti Drive</th>
                      <th className="p-2.5">Catatan Tambahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recordsKepsek.map((r, i) => (
                      <tr key={r.id} className="hover:bg-purple-50/30">
                        <td className="p-2.5 text-center font-mono text-slate-400">{i + 1}</td>
                        <td className="p-2.5 font-medium">{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                        <td className="p-2.5 font-bold text-purple-900">{r.namaGuru}</td>
                        <td className="p-2.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(r.statusKehadiran)}`}>
                            {r.statusKehadiran}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          {r.linkKehadiran && r.linkKehadiran !== '-' ? (
                            <a href={r.linkKehadiran} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold flex items-center justify-center gap-1">
                              <span>Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-600">{r.catatan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TABEL B: GURU PENGAMPU (Multi-Kelas)                                      */}
        {/* Syarat 10: Hilangkan kolom Waktu                                         */}
        {/* ========================================================================= */}
        {(activeTableTab === 'all' || activeTableTab === 'guru') && (role !== 'kepsek' && role !== 'tendik') && (
          <div className="mb-8">
            <div className="flex items-center justify-between bg-blue-900 text-white px-4 py-2.5 rounded-t-xl">
              <span className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-300" />
                Tabel B: Rekapitulasi Ketidakhadiran Guru Pengampu & Penugasan Kelas
              </span>
              <span className="text-xs bg-blue-700 px-2 py-0.5 rounded text-blue-100 font-semibold">
                {recordsGuru.length} Penugasan
              </span>
            </div>

            <div className="border-x border-b border-slate-200 rounded-b-xl overflow-x-auto bg-white">
              {recordsGuru.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Tidak ada catatan ketidakhadiran Guru pada periode ini.</p>
              ) : isSummaryMode ? (
                /* Mode Ringkasan Mingguan / Bulanan */
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-blue-50 text-blue-950 font-bold border-b border-blue-100">
                    <tr>
                      <th className="p-2.5 text-center w-10">#</th>
                      <th className="p-2.5">Nama Guru</th>
                      <th className="p-2.5 text-center w-20">Sakit</th>
                      <th className="p-2.5 text-center w-20">Izin</th>
                      <th className="p-2.5 text-center w-24">Tugas Dinas</th>
                      <th className="p-2.5 text-center w-24">Tanpa Ket.</th>
                      <th className="p-2.5 text-center w-24">Total Hari</th>
                      <th className="p-2.5">Rincian Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teacherSummary.map((g, idx) => (
                      <tr key={g.namaGuru} className="hover:bg-blue-50/30">
                        <td className="p-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-blue-900">{g.namaGuru}</td>
                        <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">{g.sakit}</span></td>
                        <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">{g.izin}</span></td>
                        <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">{g.tugas}</span></td>
                        <td className="p-2.5 text-center"><span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">{g.alpa}</span></td>
                        <td className="p-2.5 text-center font-bold text-slate-900">{g.totalHari} Hari</td>
                        <td className="p-2.5 text-slate-600 text-[11px]">{g.rincian.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Mode Harian Merged Table (TANPA KOLOM WAKTU per Syarat 10) */
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-blue-50 text-blue-950 font-bold border-b border-blue-100">
                    <tr>
                      <th className="p-2.5 text-center w-10">#</th>
                      <th className="p-2.5 w-32">Hari / Tanggal</th>
                      <th className="p-2.5 w-44">Nama Guru</th>
                      <th className="p-2.5 w-28">Status</th>
                      <th className="p-2.5 text-center w-24">Bukti Drive</th>
                      <th className="p-2.5 text-center w-16">Kelas</th>
                      <th className="p-2.5 w-24">Jam Ke-</th>
                      <th className="p-2.5 w-36">Mata Pelajaran</th>
                      <th className="p-2.5">Bentuk Penugasan</th>
                      <th className="p-2.5 w-32">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupedGuru.map((group, gIdx) => {
                      const rowSpan = group.items.length;
                      return group.items.map((item, itemIdx) => (
                        <tr key={`${group.tanggal}-${group.namaGuru}-${itemIdx}`} className="hover:bg-blue-50/30">
                          <td className="p-2 text-center font-mono text-slate-400 text-[11px]">{gIdx + 1}</td>
                          {itemIdx === 0 && (
                            <>
                              <td rowSpan={rowSpan} className="p-2 align-top border-r border-slate-100 font-medium">
                                <div>{group.hari}</div>
                                <div className="text-[11px] text-slate-500 font-mono">{getCleanTanggalOnly(group.tanggal)}</div>
                              </td>
                              <td rowSpan={rowSpan} className="p-2 align-top border-r border-slate-100 font-bold text-blue-900">
                                {group.namaGuru}
                              </td>
                              <td rowSpan={rowSpan} className="p-2 align-top border-r border-slate-100">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(group.statusKehadiran)}`}>
                                  {group.statusKehadiran}
                                </span>
                              </td>
                              <td rowSpan={rowSpan} className="p-2 align-top text-center border-r border-slate-100">
                                {group.linkKehadiran && group.linkKehadiran !== '-' ? (
                                  <a href={group.linkKehadiran} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold flex items-center justify-center gap-1">
                                    <span>Drive</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            </>
                          )}
                          <td className="p-2 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[11px]">
                              {item.kelas}
                            </span>
                          </td>
                          <td className="p-2 text-slate-600 text-[11px] whitespace-nowrap">
                            {item.jamAwal} s/d {item.jamAkhir}
                          </td>
                          <td className="p-2 font-medium text-slate-800">{item.mapel}</td>
                          <td className="p-2 text-slate-700">{item.penugasan || '-'}</td>
                          {itemIdx === 0 && (
                            <td rowSpan={rowSpan} className="p-2 align-top text-slate-500 text-[11px] border-l border-slate-100">
                              {group.catatan || '-'}
                            </td>
                          )}
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TABEL C: TENAGA KEPENDIDIKAN (TENDIK)                                    */}
        {/* Syarat 8: Hanya menampilkan kolom yang dientry (No, Hari/Tgl, Nama, Status, Bukti, Catatan) */}
        {/* Syarat 10: Hilangkan kolom Waktu                                         */}
        {/* ========================================================================= */}
        {(activeTableTab === 'all' || activeTableTab === 'tendik') && (role !== 'kepsek' && role !== 'guru') && (
          <div className="mb-4">
            <div className="flex items-center justify-between bg-amber-800 text-white px-4 py-2.5 rounded-t-xl">
              <span className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-300" />
                Tabel C: Rekapitulasi Ketidakhadiran Tenaga Kependidikan (Tendik)
              </span>
              <span className="text-xs bg-amber-700 px-2 py-0.5 rounded text-amber-100 font-semibold">
                {recordsTendik.length} Catatan
              </span>
            </div>

            <div className="border-x border-b border-slate-200 rounded-b-xl overflow-x-auto bg-white">
              {recordsTendik.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Tidak ada catatan ketidakhadiran Tenaga Kependidikan pada periode ini.</p>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-amber-50 text-amber-950 font-bold border-b border-amber-100">
                    <tr>
                      <th className="p-2.5 text-center w-10">#</th>
                      <th className="p-2.5 w-36">Hari / Tanggal</th>
                      <th className="p-2.5">Nama Tenaga Kependidikan (Tendik)</th>
                      <th className="p-2.5 w-32">Status</th>
                      <th className="p-2.5 text-center w-28">Bukti Drive</th>
                      <th className="p-2.5">Catatan Tambahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recordsTendik.map((r, i) => (
                      <tr key={r.id} className="hover:bg-amber-50/30">
                        <td className="p-2.5 text-center font-mono text-slate-400">{i + 1}</td>
                        <td className="p-2.5 font-medium">{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                        <td className="p-2.5 font-bold text-amber-900">{r.namaGuru}</td>
                        <td className="p-2.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(r.statusKehadiran)}`}>
                            {r.statusKehadiran}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          {r.linkKehadiran && r.linkKehadiran !== '-' ? (
                            <a href={r.linkKehadiran} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold flex items-center justify-center gap-1">
                              <span>Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-600">{r.catatan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* AREA CETAK PDF RESMI (@media print)                                       */}
      {/* Syarat 10: Hilangkan kolom Waktu pada Cetak Laporan PDF                   */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* AREA DOKUMEN CETAK RESMI (Digunakan untuk Print Popup & Fallback Browser)  */}
      {/* ========================================================================= */}
      <div id="reportPrintContent" className="hidden">
        {/* Kop Surat Resmi SMPN 1 Ciranjang */}
        <div className="kop">
          <h3>Pemerintah Daerah Kabupaten Cianjur</h3>
          <h2>Dinas Pendidikan Pemuda dan Olahraga</h2>
          <h1>SMP NEGERI 1 CIRANJANG</h1>
          <p>Jalan Raya Ciranjang No. 1, Ciranjang, Kabupaten Cianjur, Jawa Barat 43282</p>
        </div>

        <div className="title-doc">
          <h2>LAPORAN REKAPITULASI KETIDAKHADIRAN PEGAWAI</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '9pt', color: '#333' }}>
            Kepala Sekolah, Guru Pengampu, dan Tenaga Kependidikan
          </p>
        </div>

        <div className="meta-info">
          <div>
            <div><strong>Periode Rekap:</strong> {filterTipe.toUpperCase()} {filterTipe === 'harian' ? `(${filterTanggal})` : filterTipe === 'mingguan' ? `(${filterTglMulai} s/d ${filterTglSelesai})` : filterTipe === 'bulanan' ? `(Bulan ${filterBulan} / ${filterTahun})` : ''}</div>
            <div><strong>Penanggung Jawab:</strong> {currentUser.nama} [{currentUser.role.toUpperCase()}]</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</div>
            <div><strong>Total Catatan:</strong> {filteredRecords.length} Data</div>
          </div>
        </div>

        {/* Tabel A: Kepala Sekolah */}
        {recordsKepsek.length > 0 && (
          <div>
            <h4 className="table-title">A. Kepala Sekolah</h4>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>No</th>
                  <th style={{ width: '130px' }}>Hari, Tanggal</th>
                  <th>Nama Pegawai</th>
                  <th style={{ width: '110px' }}>Status Kehadiran</th>
                  <th>Catatan Tambahan</th>
                </tr>
              </thead>
              <tbody>
                {recordsKepsek.map((r, i) => (
                  <tr key={r.id}>
                    <td className="text-center">{i + 1}</td>
                    <td>{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                    <td className="font-bold">{r.namaGuru}</td>
                    <td className="text-center">{r.statusKehadiran}</td>
                    <td>{r.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabel B: Guru Pengampu (Multi-Kelas) - TANPA Bagian 'Item Total Entri' */}
        {recordsGuru.length > 0 && (
          <div>
            <h4 className="table-title">B. Guru Pengampu & Penugasan Kelas</h4>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>No</th>
                  <th style={{ width: '120px' }}>Hari, Tanggal</th>
                  <th>Nama Guru</th>
                  <th style={{ width: '90px' }}>Status</th>
                  <th style={{ width: '60px' }}>Kelas</th>
                  <th style={{ width: '70px' }}>Jam</th>
                  <th>Mata Pelajaran</th>
                  <th>Bentuk Penugasan</th>
                  <th style={{ width: '100px' }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {recordsGuru.map((r, i) => (
                  <tr key={r.id}>
                    <td className="text-center">{i + 1}</td>
                    <td>{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                    <td className="font-bold">{r.namaGuru}</td>
                    <td className="text-center">{r.statusKehadiran}</td>
                    <td className="text-center font-bold">{r.kelas}</td>
                    <td className="text-center">{r.jamAwal.replace('Jam Ke-', '')} - {r.jamAkhir.replace('Jam Ke-', '')}</td>
                    <td>{r.mapel}</td>
                    <td>{r.bentukPenugasan || '-'}</td>
                    <td>{r.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabel C: Tenaga Kependidikan */}
        {recordsTendik.length > 0 && (
          <div>
            <h4 className="table-title">C. Tenaga Kependidikan (Tendik)</h4>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>No</th>
                  <th style={{ width: '130px' }}>Hari, Tanggal</th>
                  <th>Nama Tenaga Kependidikan</th>
                  <th style={{ width: '110px' }}>Status Kehadiran</th>
                  <th>Catatan Tambahan</th>
                </tr>
              </thead>
              <tbody>
                {recordsTendik.map((r, i) => (
                  <tr key={r.id}>
                    <td className="text-center">{i + 1}</td>
                    <td>{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                    <td className="font-bold">{r.namaGuru}</td>
                    <td className="text-center">{r.statusKehadiran}</td>
                    <td>{r.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tanda Tangan Resmi */}
        <div className="signatures">
          <div className="sign-col">
            <div>Mengetahui,</div>
            <div className="font-bold">Kepala Sekolah</div>
            <div className="sign-space"></div>
            <div className="font-bold" style={{ textDecoration: 'underline' }}>Dra. YETTY NURHAYATI, S.Pd., M.Pd.</div>
            <div>NIP. 196709101994032006</div>
          </div>

          <div className="sign-col">
            <div>Ciranjang, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</div>
            <div className="font-bold">Petugas Penanggung Jawab,</div>
            <div className="sign-space"></div>
            <div className="font-bold" style={{ textDecoration: 'underline' }}>{currentUser.nama}</div>
            <div style={{ fontSize: '8pt', color: '#555' }}>[{currentUser.role.toUpperCase()}]</div>
          </div>
        </div>

        {/* Syarat 5: Catatan Kaki (Footer) Wajib */}
        <div className="doc-footer">
          Dokumen ini dihasilkan oleh Aplikasi Sistem Aplikasi Pegawai SMPN 1 Ciranjang pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} pukul {new Date().toLocaleTimeString('id-ID')} WIB
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL PRATINJAU DOKUMEN CETAK PDF RESMI                                    */}
      {/* ========================================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-300">
            {/* Modal Top Header */}
            <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base leading-tight">
                    Pratinjau Dokumen Cetak Laporan Absensi Pegawai
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Format resmi Kop SMPN 1 Ciranjang • Siap cetak atau simpan ke PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDocument}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
                  title="Buka dialog cetak atau Simpan sebagai PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF</span>
                </button>

                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Modal Body Preview Sheet */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
              <div className="bg-white p-6 sm:p-10 shadow-lg max-w-4xl w-full border border-slate-200 text-slate-900 font-serif text-xs leading-relaxed space-y-4">
                {/* Kop Surat */}
                <div className="border-b-4 border-double border-black pb-3 text-center">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-slate-800">PEMERINTAH DAERAH KABUPATEN CIANJUR</h4>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-slate-800">DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA</h4>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-widest text-black mt-1">SMP NEGERI 1 CIRANJANG</h2>
                  <p className="text-[10px] text-slate-600 italic">Jalan Raya Ciranjang No. 1, Ciranjang, Kabupaten Cianjur, Jawa Barat 43282</p>
                </div>

                <div className="text-center py-1">
                  <h3 className="font-bold text-sm uppercase underline text-slate-950">
                    LAPORAN REKAPITULASI KETIDAKHADIRAN PEGAWAI
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Kepala Sekolah, Guru Pengampu, dan Tenaga Kependidikan
                  </p>
                </div>

                <div className="flex justify-between items-center text-[11px] font-sans pb-2 border-b border-slate-200 text-slate-700">
                  <div>
                    <p><strong>Periode:</strong> {filterTipe.toUpperCase()} {filterTipe === 'harian' ? `(${filterTanggal})` : ''}</p>
                    <p><strong>Penanggung Jawab:</strong> {currentUser.nama} [{currentUser.role.toUpperCase()}]</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Tanggal Cetak:</strong> {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                    <p><strong>Jumlah Entri:</strong> {filteredRecords.length} Data</p>
                  </div>
                </div>

                {/* Tabel A Preview: Kepala Sekolah */}
                {recordsKepsek.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs uppercase text-slate-900 font-sans">A. Kepala Sekolah</h4>
                    <table className="w-full text-xs border border-black border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-black p-1.5 text-center w-8">No</th>
                          <th className="border border-black p-1.5 w-32">Hari, Tanggal</th>
                          <th className="border border-black p-1.5">Nama Pegawai</th>
                          <th className="border border-black p-1.5 w-28 text-center">Status</th>
                          <th className="border border-black p-1.5">Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordsKepsek.map((r, i) => (
                          <tr key={r.id}>
                            <td className="border border-black p-1.5 text-center">{i + 1}</td>
                            <td className="border border-black p-1.5">{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                            <td className="border border-black p-1.5 font-bold">{r.namaGuru}</td>
                            <td className="border border-black p-1.5 text-center">{r.statusKehadiran}</td>
                            <td className="border border-black p-1.5">{r.catatan || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tabel B Preview: Guru Pengampu */}
                {recordsGuru.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs uppercase text-slate-900 font-sans">B. Guru Pengampu & Penugasan Kelas</h4>
                    <table className="w-full text-xs border border-black border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-black p-1.5 text-center w-8">No</th>
                          <th className="border border-black p-1.5 w-28">Hari, Tanggal</th>
                          <th className="border border-black p-1.5">Nama Guru</th>
                          <th className="border border-black p-1.5 w-20 text-center">Status</th>
                          <th className="border border-black p-1.5 w-16 text-center">Kelas</th>
                          <th className="border border-black p-1.5 w-16 text-center">Jam</th>
                          <th className="border border-black p-1.5">Mapel</th>
                          <th className="border border-black p-1.5">Bentuk Penugasan</th>
                          <th className="border border-black p-1.5 w-28">Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordsGuru.map((r, i) => (
                          <tr key={r.id}>
                            <td className="border border-black p-1.5 text-center">{i + 1}</td>
                            <td className="border border-black p-1.5">{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                            <td className="border border-black p-1.5 font-bold">{r.namaGuru}</td>
                            <td className="border border-black p-1.5 text-center">{r.statusKehadiran}</td>
                            <td className="border border-black p-1.5 text-center font-bold">{r.kelas}</td>
                            <td className="border border-black p-1.5 text-center">{r.jamAwal.replace('Jam Ke-', '')}-{r.jamAkhir.replace('Jam Ke-', '')}</td>
                            <td className="border border-black p-1.5">{r.mapel}</td>
                            <td className="border border-black p-1.5">{r.bentukPenugasan || '-'}</td>
                            <td className="border border-black p-1.5">{r.catatan || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tabel C Preview: Tenaga Kependidikan */}
                {recordsTendik.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs uppercase text-slate-900 font-sans">C. Tenaga Kependidikan (Tendik)</h4>
                    <table className="w-full text-xs border border-black border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-black p-1.5 text-center w-8">No</th>
                          <th className="border border-black p-1.5 w-32">Hari, Tanggal</th>
                          <th className="border border-black p-1.5">Nama Tenaga Kependidikan</th>
                          <th className="border border-black p-1.5 w-28 text-center">Status</th>
                          <th className="border border-black p-1.5">Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordsTendik.map((r, i) => (
                          <tr key={r.id}>
                            <td className="border border-black p-1.5 text-center">{i + 1}</td>
                            <td className="border border-black p-1.5">{formatHariTanggalClean(r.hari, r.tanggal)}</td>
                            <td className="border border-black p-1.5 font-bold">{r.namaGuru}</td>
                            <td className="border border-black p-1.5 text-center">{r.statusKehadiran}</td>
                            <td className="border border-black p-1.5">{r.catatan || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tanda Tangan Preview */}
                <div className="pt-8 flex justify-between text-xs font-sans">
                  <div className="text-center w-48">
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala Sekolah</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">Dra. YETTY NURHAYATI, S.Pd., M.Pd.</p>
                    <p className="text-[10px]">NIP. 196709101994032006</p>
                  </div>

                  <div className="text-center w-48">
                    <p>Ciranjang, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                    <p className="font-bold">Petugas Penanggung Jawab,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{currentUser.nama}</p>
                    <p className="text-[10px] text-slate-500">[{currentUser.role.toUpperCase()}]</p>
                  </div>
                </div>

                {/* Footer Preview Wajib */}
                <div className="pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 italic font-sans">
                  Dokumen ini dihasilkan oleh Aplikasi Sistem Aplikasi Pegawai SMPN 1 Ciranjang pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} pukul {new Date().toLocaleTimeString('id-ID')} WIB
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
