import React, { useState } from 'react';
import {
  CODE_GS,
  INDEX_HTML,
  JAVASCRIPT_HTML,
  STYLESHEET_HTML,
  APPSSCRIPT_JSON
} from '../data/gasCodeStrings';
import {
  Code, Copy, Check, Download, FileText, CheckCircle2,
  Sparkles, ShieldCheck, MessageSquare, FileSpreadsheet,
  ExternalLink, Layers
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  extension: string;
  description: string;
  badge: string;
  code: string;
}

export const GasCodeViewer: React.FC = () => {
  const files: FileItem[] = [
    {
      id: 'codegs',
      name: 'Code.gs',
      extension: 'js',
      description: 'Kode Utama Server Apps Script: 5 Role (Admin, Piket, Kepsek, Guru, Tendik), 3 Sheet (Rekap, DataKelas, Users), hapus kolom Waktu, proteksi ganti password admin.',
      badge: 'Server Apps Script',
      code: CODE_GS
    },
    {
      id: 'indexhtml',
      name: 'Index.html',
      extension: 'html',
      description: 'Struktur HTML Utama: 3 Tabel Rekap Terpisah (Tabel A: Kepsek, B: Guru, C: Tendik), Form Dinamis, Notifikasi & Tombol WA di bawah berdampingan Simpan.',
      badge: 'HTML Template',
      code: INDEX_HTML
    },
    {
      id: 'javascripthtml',
      name: 'Javascript.html',
      extension: 'html',
      description: 'Script Client-Side: 5 Kelompok Pegawai, otomatis WhatsApp saat Simpan, pemisahan Tabel A/B/C, pembatasan rekap mandiri tanpa cetak/ekspor untuk Pegawai, SheetJS XLSX asli.',
      badge: 'Client Script',
      code: JAVASCRIPT_HTML
    },
    {
      id: 'stylesheethref',
      name: 'Stylesheet.html',
      extension: 'html',
      description: 'CSS Tema Biru Elegan & Cetak PDF: Struktur CSS dipertahankan, dilengkapi format Kop Resmi SMPN 1 Ciranjang.',
      badge: 'Modular CSS',
      code: STYLESHEET_HTML
    },
    {
      id: 'appsscriptjson',
      name: 'appsscript.json',
      extension: 'json',
      description: 'Manifest Google Apps Script: Konfigurasi timeZone Asia/Jakarta, akses Web App dan OAuth scopes.',
      badge: 'Manifest',
      code: APPSSCRIPT_JSON
    }
  ];

  const [activeFileId, setActiveFileId] = useState<string>('codegs');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lineCount = activeFile.code.split('\n').length;
  const byteCount = new Blob([activeFile.code]).size;

  return (
    <div className="space-y-6">
      {/* Overview Card: Perubahan & Peningkatan Fitur 14 Poin */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md border border-blue-700/50">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold">Ringkasan Pembaruan Script (Sistem Absensi Pegawai - 5 Role & 3 Sheet)</h2>
        </div>
        <p className="text-xs text-blue-200/90 leading-relaxed mb-4 max-w-4xl">
          Seluruh 5 file script di bawah telah diperbarui secara utuh sesuai dengan 14 poin kebutuhan revisi Anda:
          mendukung 5 kelompok pegawai (Admin, Piket, Kepsek, Guru, Tendik), 3 sheet referensi (Rekap, DataKelas, Users),
          tabel rekap terpisah (Tabel A, B, C), penghapusan kolom Waktu, notifikasi & tombol WA di posisi bawah.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">5 Kelompok Pegawai</span>
            <p className="text-blue-100/80 text-[11px]">
              Dukungan penuh: <strong>Admin, Piket, Kepsek, Guru, dan Tendik</strong>. Data guru & tendik dibaca langsung dari sheet Users.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">Form Khusus Kepsek & Tendik</span>
            <p className="text-blue-100/80 text-[11px]">
              Hanya menampilkan Hari, Tgl, Nama, Status Kehadiran, Bukti & Catatan. Kolom multi-kelas otomatis disembunyikan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">Rekap Terpisah A, B, C</span>
            <p className="text-blue-100/80 text-[11px]">
              Tabel A (Kepsek), Tabel B (Guru Pengampu), Tabel C (Tendik). Kolom Waktu dihapus sesuai permintaan.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">Posisi Notifikasi & Tombol WA</span>
            <p className="text-blue-100/80 text-[11px]">
              Banner notifikasi sukses berada di atas tombol aksi, dan tombol Kirim Pesan WhatsApp berada di sebelah kiri Simpan Data.
            </p>
          </div>
        </div>
      </div>

      {/* Main Code Viewer Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* File Tabs Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{file.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {file.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions for Active File */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(activeFile.code, activeFile.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
              title="Salin semua teks kode ke clipboard"
            >
              {copiedId === activeFile.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Seluruh Kode</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadFile(activeFile.name, activeFile.code)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition"
              title="Unduh file ke komputer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File</span>
            </button>
          </div>
        </div>

        {/* File Description Header */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="max-w-2xl">
            <span className="font-bold text-slate-800">{activeFile.name}: </span>
            <span>{activeFile.description}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span>{lineCount} baris</span>
            <span>•</span>
            <span>{(byteCount / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="relative">
          <pre className="p-4 sm:p-6 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed selection:bg-blue-600 selection:text-white">
            <code>{activeFile.code}</code>
          </pre>
        </div>

        {/* Bottom Bar with Deployment Instructions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Kode siap pakai. Seluruh dependensi HTML Service include() bekerja otomatis di Google Apps Script.</span>
          </div>

          <button
            onClick={() => handleCopyCode(activeFile.code, activeFile.id)}
            className="text-blue-600 hover:text-blue-800 font-bold underline text-xs"
          >
            {copiedId === activeFile.id ? 'Kode Berhasil Disalin!' : 'Klik untuk Salin Kode ' + activeFile.name}
          </button>
        </div>
      </div>

      {/* Panduan Pemasangan di Google Apps Script (Step-by-Step) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          Panduan Langkah demi Langkah Memperbarui Script di Google Apps Script
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Ikuti langkah mudah berikut untuk memperbarui proyek Google Apps Script Anda dengan kode terbaru di atas:
        </p>

        <ol className="space-y-3 text-xs text-slate-700">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong>Buka Editor Google Apps Script:</strong> Buka file Spreadsheet <em>"Data Absensi Guru"</em>, lalu klik menu <strong>Ekstensi &gt; Apps Script</strong>.
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong>Perbarui Code.gs:</strong> Buka file <code>Code.gs</code> di editor Apps Script, hapus seluruh isi lamanya, lalu salin dan tempelkan seluruh kode dari tab <strong>Code.gs</strong> di atas.
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong>Perbarui File HTML:</strong>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                <li>Buka file <code>Index.html</code>, timpa dengan isi kode tab <strong>Index.html</strong>.</li>
                <li>Buka file <code>Javascript.html</code>, timpa dengan isi kode tab <strong>Javascript.html</strong>.</li>
                <li>Buka file <code>Stylesheet.html</code>, timpa dengan isi kode tab <strong>Stylesheet.html</strong>.</li>
              </ul>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              4
            </span>
            <div>
              <strong>Deploy / Terapkan Versi Baru:</strong> Klik tombol biru <strong>Terapkan (Deploy) &gt; Kelola Penerapan &gt; Edit (ikon pensil) &gt; Versi: Versi Baru &gt; Terapkan</strong>.
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold inline-flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              5
            </span>
            <div>
              <strong>Selesai & Uji Coba:</strong> Buka URL Web App Anda dan coba login menggunakan akun <strong>admin</strong>, <strong>kepsek</strong>, <strong>piket</strong>, <strong>guru01</strong>, atau <strong>tendik01</strong>.
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
