export interface UserAccount {
  username: string;
  password: string;
  role: 'admin' | 'piket' | 'kepsek' | 'guru' | 'tendik';
  nama: string;
  dapatGantiPassword?: boolean;
}

export interface RekapRecord {
  id: string;
  timestamp: string;
  hari: string;
  tanggal: string; // format YYYY-MM-DD
  namaGuru: string; // nama pegawai (Kepsek / Guru / Tendik)
  rolePegawai?: 'kepsek' | 'guru' | 'tendik';
  statusKehadiran: 'Sakit' | 'Izin' | 'Tugas Dinas Luar' | 'Tugas Dinas' | 'Tanpa Keterangan';
  linkKehadiran: string;
  kelas: string;
  jamAwal: string;
  jamAkhir: string;
  mapel: string;
  bentukPenugasan: string;
  catatan: string;
}

export const MASTER_KELAS = [
  "7 - A", "7 - B", "7 - C", "7 - D", "7 - E", "7 - F", "7 - G", "7 - H", "7 - I", "7 - J", "7 - K",
  "8 - A", "8 - B", "8 - C", "8 - D", "8 - E", "8 - F", "8 - G", "8 - H", "8 - I", "8 - J", "8 - K",
  "9 - A", "9 - B", "9 - C", "9 - D", "9 - E", "9 - F", "9 - G", "9 - H", "9 - I", "9 - J", "9 - K"
];

export const MASTER_MAPEL = [
  "Pendidikan Agama Islam dan Budi Pekerti",
  "Pendidikan Pancasila",
  "Bahasa Indonesia",
  "Matematika",
  "Ilmu Pengetahuan Alam",
  "Ilmu Pengetahuan Sosial",
  "Bahasa Inggris",
  "Pendidikan Seni dan Prakarya",
  "Pendidikan Jasmani Olahraga dan Kesehatan",
  "Informatika",
  "Bahasa Sunda",
  "Bimbingan Konseling"
];

export const INITIAL_USERS: UserAccount[] = [
  { username: "admin", password: "Admin@2026", role: "admin", nama: "Administrator", dapatGantiPassword: true },
  { username: "piket", password: "piket123", role: "piket", nama: "Petugas Piket", dapatGantiPassword: false },
  { username: "kepsek", password: "kepsek123", role: "kepsek", nama: "Dra. YETTY NURHAYATI, S.Pd., M.Pd.", dapatGantiPassword: false },
  { username: "guru01", password: "guru123", role: "guru", nama: "HENNY NUR'AINI, S.Pd.", dapatGantiPassword: false },
  { username: "guru02", password: "guru123", role: "guru", nama: "ELY RUSLIATI, M.Pd.", dapatGantiPassword: false },
  { username: "guru03", password: "guru123", role: "guru", nama: "SYALKAWI, S.Pd.", dapatGantiPassword: false },
  { username: "guru04", password: "guru123", role: "guru", nama: "Dra. LISMAWATI WERDIANA", dapatGantiPassword: false },
  { username: "guru05", password: "guru123", role: "guru", nama: "AIDAH MACHTUM, S.Ag.", dapatGantiPassword: false },
  { username: "guru06", password: "guru123", role: "guru", nama: "YETI SUMIATI, S.Pd.", dapatGantiPassword: false },
  { username: "guru07", password: "guru123", role: "guru", nama: "CUCUM HERYANI, S.Pd., M.M.", dapatGantiPassword: false },
  { username: "guru08", password: "guru123", role: "guru", nama: "EUIS NURHAYATI, S.Pd.", dapatGantiPassword: false },
  { username: "guru09", password: "guru123", role: "guru", nama: "ANI HARYANI, S.Pd.", dapatGantiPassword: false },
  { username: "guru10", password: "guru123", role: "guru", nama: "Dra. METI EKA MARZILIAH", dapatGantiPassword: false },
  { username: "guru11", password: "guru123", role: "guru", nama: "ANDRIJANI KUSUMAH, S.Pd.", dapatGantiPassword: false },
  { username: "guru12", password: "guru123", role: "guru", nama: "SANTI NOVIANTI, S.Pd.", dapatGantiPassword: false },
  { username: "guru13", password: "guru123", role: "guru", nama: "YUNI RAHMAWATI, S.Pd.", dapatGantiPassword: false },
  { username: "guru14", password: "guru123", role: "guru", nama: "NANAN ROHANI, S.IP.", dapatGantiPassword: false },
  { username: "guru15", password: "guru123", role: "guru", nama: "RD. YETTI SULAWATI, S.Pd.", dapatGantiPassword: false },
  { username: "guru16", password: "guru123", role: "guru", nama: "YOPI HENDRASUSILA, ST.", dapatGantiPassword: false },
  { username: "guru17", password: "guru123", role: "guru", nama: "APONG MARYATI, S.Pd.", dapatGantiPassword: false },
  { username: "guru18", password: "guru123", role: "guru", nama: "EVA SUPIANA, S.Pd.", dapatGantiPassword: false },
  { username: "guru19", password: "guru123", role: "guru", nama: "DENI MULYADI, S.Pd.", dapatGantiPassword: false },
  { username: "guru20", password: "guru123", role: "guru", nama: "LUCKY AL-VISYA KHAIRUNNISA, S.Psi.", dapatGantiPassword: false },
  { username: "guru21", password: "guru123", role: "guru", nama: "SARI KOMALASARI, S.Pd.", dapatGantiPassword: false },
  { username: "guru22", password: "guru123", role: "guru", nama: "WULANNITA ANDIKA, S.Pd.", dapatGantiPassword: false },
  { username: "guru23", password: "guru123", role: "guru", nama: "ASEP KOMARUDIN, S.Ag.", dapatGantiPassword: false },
  { username: "guru24", password: "guru123", role: "guru", nama: "WAWAT NURIYAWATI, S.Pd.", dapatGantiPassword: false },
  { username: "guru25", password: "guru123", role: "guru", nama: "TIA BUDI LESTARI, S.Pd.", dapatGantiPassword: false },
  { username: "guru26", password: "guru123", role: "guru", nama: "NITA SRI YUNITA, M.Pd.", dapatGantiPassword: false },
  { username: "guru27", password: "guru123", role: "guru", nama: "REYSA CHANDRAGITTA, S.Pd.", dapatGantiPassword: false },
  { username: "guru28", password: "guru123", role: "guru", nama: "HOLISOH, S.Ds.", dapatGantiPassword: false },
  { username: "guru29", password: "guru123", role: "guru", nama: "YOGI NIFI ZAMILI, S.Pd.", dapatGantiPassword: false },
  { username: "guru30", password: "guru123", role: "guru", nama: "SUHERMAN PERMANA, S.Pd.", dapatGantiPassword: false },
  { username: "guru31", password: "guru123", role: "guru", nama: "HENDRA GUNAWAN HARTONO, S.Pd.", dapatGantiPassword: false },
  { username: "guru32", password: "guru123", role: "guru", nama: "TENTI OKTAVIANI RIDHA, S.Pd.", dapatGantiPassword: false },
  { username: "guru33", password: "guru123", role: "guru", nama: "RIZZAL PEBRIANA MUSTOPA, S.Pd.I.", dapatGantiPassword: false },
  { username: "guru34", password: "guru123", role: "guru", nama: "FERMADI OKTAFIANA, S.Pd.", dapatGantiPassword: false },
  { username: "guru35", password: "guru123", role: "guru", nama: "EKA SARI MARLINA, S.Sn.", dapatGantiPassword: false },
  { username: "guru36", password: "guru123", role: "guru", nama: "MUHAMMAD AJI PRATAMA, S.Pd", dapatGantiPassword: false },
  { username: "guru37", password: "guru123", role: "guru", nama: "INDAH FITRIYANI HIDAYAT, S.Pd.", dapatGantiPassword: false },
  { username: "guru38", password: "guru123", role: "guru", nama: "DODI HERDIAN, S.S.", dapatGantiPassword: false },
  { username: "guru39", password: "guru123", role: "guru", nama: "AI MARLIANI, S.Pd.", dapatGantiPassword: false },
  { username: "guru40", password: "guru123", role: "guru", nama: "DEVI ROSITA, S.Sn.", dapatGantiPassword: false },
  { username: "guru41", password: "guru123", role: "guru", nama: "TUTI ISMAYANTI, S.Pd.", dapatGantiPassword: false },
  { username: "guru42", password: "guru123", role: "guru", nama: "FITRI INDAH MAULANI, S.Pd.", dapatGantiPassword: false },
  { username: "guru43", password: "guru123", role: "guru", nama: "WAWAT SETIAWATI, S.Ag.", dapatGantiPassword: false },
  { username: "guru44", password: "guru123", role: "guru", nama: "ASEP MUHAMMAD FIKRI MUQODAS, S.Pd.I.", dapatGantiPassword: false },
  { username: "guru45", password: "guru123", role: "guru", nama: "SRI SANTI, S.Pd.", dapatGantiPassword: false },
  { username: "guru46", password: "guru123", role: "guru", nama: "ANISA PITRI, S.Pd.", dapatGantiPassword: false },
  { username: "guru47", password: "guru123", role: "guru", nama: "DIAN FEBRIANI, SE.", dapatGantiPassword: false },
  { username: "guru48", password: "guru123", role: "guru", nama: "NENDEN ANDIYANI, S.Hum.", dapatGantiPassword: false },
  { username: "guru49", password: "guru123", role: "guru", nama: "LIA MULYANINGSIH, S.Pd.", dapatGantiPassword: false },
  { username: "guru50", password: "guru123", role: "guru", nama: "HISYAM ARYADHIGAMA, S.Pd.", dapatGantiPassword: false },
  { username: "guru51", password: "guru123", role: "guru", nama: "KHOIRUNNISA HAIFA ZAHRA, S.Sos.", dapatGantiPassword: false },
  { username: "guru52", password: "guru123", role: "guru", nama: "MOCH. DIAS ADIKUSUMA WIJAYA, S.T.", dapatGantiPassword: false },
  { username: "guru53", password: "guru123", role: "guru", nama: "MARWAH HUMAERAH, S.M.", dapatGantiPassword: false },
  { username: "guru54", password: "guru123", role: "guru", nama: "HAIZAR HARDIA REZA ZELMI, S.Pd.", dapatGantiPassword: false },
  { username: "guru55", password: "guru123", role: "guru", nama: "SITI NURMALA, S.Pd.", dapatGantiPassword: false },
  
  // TENAGA KEPENDIDIKAN (TENDIK - 11 Pegawai sesuai Sheet Users1.csv)
  { username: "tendik01", password: "tendik123", role: "tendik", nama: "DESYANA FEBBY, S.Pust.", dapatGantiPassword: false },
  { username: "tendik02", password: "tendik123", role: "tendik", nama: "KUSNADI", dapatGantiPassword: false },
  { username: "tendik03", password: "tendik123", role: "tendik", nama: "WIEDYA SAFITRIE, A.Ma.Pust", dapatGantiPassword: false },
  { username: "tendik04", password: "tendik123", role: "tendik", nama: "MOHAMAD MESYA SUBHAN DARDJAT", dapatGantiPassword: false },
  { username: "tendik05", password: "tendik@123", role: "tendik", nama: "AMIR SAEPULLOH, A.Md.", dapatGantiPassword: false },
  { username: "tendik06", password: "tendik123", role: "tendik", nama: "ARI ARIYANDI", dapatGantiPassword: false },
  { username: "tendik07", password: "tendik123", role: "tendik", nama: "AHMAD SAEPUL RISMANTO", dapatGantiPassword: false },
  { username: "tendik08", password: "tendik123", role: "tendik", nama: "ALEK SANDER CANDRA", dapatGantiPassword: false },
  { username: "tendik09", password: "tendik123", role: "tendik", nama: "MUHAMAD MESYA TAWAKALLILLAH", dapatGantiPassword: false },
  { username: "tendik10", password: "tendik123", role: "tendik", nama: "AGUS SANTANA", dapatGantiPassword: false },
  { username: "tendik11", password: "tendik123", role: "tendik", nama: "AGUS BUCHORI", dapatGantiPassword: false }
];

export const INITIAL_RECORDS: RekapRecord[] = [
  // 1. Data dari Sheet_Rekap.csv
  {
    id: "rec-csv-1",
    timestamp: "20/10/2026 0:38:46",
    hari: "Selasa",
    tanggal: "2026-10-20",
    namaGuru: "HENNY NUR'AINI, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "https://drive.google.com/file/d/1dSSNw8-A48uyKyX9Dko1VHmagiCWFTl3/view?usp=drivesdk",
    kelas: "7 - H",
    jamAwal: "Jam Ke-1",
    jamAkhir: "Jam Ke-2",
    mapel: "Matematika",
    bentukPenugasan: "Mengerjakan Tugas Bab 56",
    catatan: "Dikirim ke Grup WA Matematika Kelas 7"
  },
  {
    id: "rec-csv-2",
    timestamp: "20/10/2026 0:38:46",
    hari: "Selasa",
    tanggal: "2026-10-20",
    namaGuru: "HENNY NUR'AINI, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "https://drive.google.com/file/d/1dSSNw8-A48uyKyX9Dko1VHmagiCWFTl3/view?usp=drivesdk",
    kelas: "7 - D",
    jamAwal: "Jam Ke-3",
    jamAkhir: "Jam Ke-4",
    mapel: "Matematika",
    bentukPenugasan: "Mengerjakan Tugas Bab 56",
    catatan: "Dikirim ke Grup WA Matematika Kelas 7"
  },
  {
    id: "rec-csv-3",
    timestamp: "21/10/2026 23:50:30",
    hari: "Rabu",
    tanggal: "2026-10-21",
    namaGuru: "HENNY NUR'AINI, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "https://drive.google.com/file/d/1Qo10XXrm6ORV8-eeQwCgOrb7mq4sP04E/view?usp=drivesdk",
    kelas: "7 - E",
    jamAwal: "Jam Ke-1",
    jamAkhir: "Jam Ke-2",
    mapel: "Matematika",
    bentukPenugasan: "Mengerjakan Tugas Bab 56",
    catatan: "Dikirim ke Grup WA Matematika Kelas 7"
  },
  {
    id: "rec-csv-4",
    timestamp: "22/10/2026 20:53:21",
    hari: "Kamis",
    tanggal: "2026-10-22",
    namaGuru: "HENNY NUR'AINI, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Sakit",
    linkKehadiran: "https://drive.google.com/file/d/1bV7vtRKFQuMuQosUauzT-sdkLFB8gixj/view?usp=drivesdk",
    kelas: "7 - A",
    jamAwal: "Jam Ke-1",
    jamAkhir: "Jam Ke-3",
    mapel: "Matematika",
    bentukPenugasan: "Membaca Bab 3 Buku Paket hal 56-59 dan kerjakan latihan 1-5.",
    catatan: "Tugas dikumpulkan di Meja Guru ybs"
  },
  {
    id: "rec-csv-5",
    timestamp: "22/10/2026 20:55:58",
    hari: "Kamis",
    tanggal: "2026-10-22",
    namaGuru: "CUCUM HERYANI, S.Pd., M.M.",
    rolePegawai: "guru",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "https://drive.google.com/file/d/1gcZXpUfNyMWslLRqmqyZdvs5U4DIbnBJ/view?usp=drivesdk",
    kelas: "8 - D",
    jamAwal: "Jam Ke-1",
    jamAkhir: "Jam Ke-4",
    mapel: "Bahasa Indonesia",
    bentukPenugasan: "Meringkas materi teks deskripsi pada buku catatan tugas.",
    catatan: "Dikumpulkan di piket"
  },
  {
    id: "rec-csv-6",
    timestamp: "23/10/2026 9:54:43",
    hari: "Jumat",
    tanggal: "2026-10-23",
    namaGuru: "DENI MULYADI, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Izin",
    linkKehadiran: "https://drive.google.com/file/d/15g5K9ZS3cO3eH2oFsJwOdZJPav3RN3JG/view?usp=drivesdk",
    kelas: "9 - A",
    jamAwal: "Jam Ke-1",
    jamAkhir: "Jam Ke-2",
    mapel: "Bahasa Sunda",
    bentukPenugasan: "Mengerjakan LK Bab 1",
    catatan: "Surat Izin menyusul, Tugas Siswa dikumpulkan di Guru Piket"
  },
  {
    id: "rec-csv-7",
    timestamp: "23/10/2026 11:10:21",
    hari: "Jumat",
    tanggal: "2026-10-23",
    namaGuru: "RD. YETTI SULAWATI, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Sakit",
    linkKehadiran: "https://drive.google.com/file/d/1YQRXllMBt77rJugb9dI-QFs1tWvBtc9S/view?usp=drivesdk",
    kelas: "7 - H",
    jamAwal: "Jam Ke-1",
    jamAkhir: "Jam Ke-2",
    mapel: "Ilmu Pengetahuan Sosial",
    bentukPenugasan: "Mengerjakan LK Bab 4",
    catatan: "Surat sakit menyusul, tugas dikumpulkan di meja guru ybs"
  },
  {
    id: "rec-csv-8",
    timestamp: "23/10/2026 11:18:47",
    hari: "Jumat",
    tanggal: "2026-10-23",
    namaGuru: "WULANNITA ANDIKA, S.Pd.",
    rolePegawai: "guru",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "-",
    kelas: "7 - I",
    jamAwal: "Jam Ke-9",
    jamAkhir: "Jam Ke-9",
    mapel: "Pendidikan Jasmani Olahraga dan Kesehatan",
    bentukPenugasan: "Latihan fisik mandiri di rumah",
    catatan: "Mendampingi lomba O2SN tingkat Kabupaten"
  },

  // 2. Data Contoh Ketidakhadiran KEPSEK (Tabel A)
  {
    id: "rec-kepsek-1",
    timestamp: "23/10/2026 07:30:00",
    hari: "Jumat",
    tanggal: "2026-10-23",
    namaGuru: "Dra. YETTY NURHAYATI, S.Pd., M.Pd.",
    rolePegawai: "kepsek",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "https://drive.google.com/file/d/1dSSNw8-A48uyKyX9Dko1VHmagiCWFTl3/view",
    kelas: "-",
    jamAwal: "-",
    jamAkhir: "-",
    mapel: "-",
    bentukPenugasan: "-",
    catatan: "Rapat Koordinasi Kepala Sekolah Se-Kabupaten di Dinas Pendidikan"
  },

  // 3. Data Contoh Ketidakhadiran TENDIK (Tabel C)
  {
    id: "rec-tendik-1",
    timestamp: "23/10/2026 08:00:00",
    hari: "Jumat",
    tanggal: "2026-10-23",
    namaGuru: "ERNA NURLINA (Kepala TU)",
    rolePegawai: "tendik",
    statusKehadiran: "Sakit",
    linkKehadiran: "https://drive.google.com/file/d/1bV7vtRKFQuMuQosUauzT-sdkLFB8gixj/view",
    kelas: "-",
    jamAwal: "-",
    jamAkhir: "-",
    mapel: "-",
    bentukPenugasan: "-",
    catatan: "Surat istirahat dokter terlampir, koordinasi surat-menyurat via WA"
  },
  {
    id: "rec-tendik-2",
    timestamp: "22/10/2026 08:15:00",
    hari: "Kamis",
    tanggal: "2026-10-22",
    namaGuru: "SITI ROHMAH, S.Kom. (Pengelola IT)",
    rolePegawai: "tendik",
    statusKehadiran: "Tugas Dinas Luar",
    linkKehadiran: "-",
    kelas: "-",
    jamAwal: "-",
    jamAkhir: "-",
    mapel: "-",
    bentukPenugasan: "-",
    catatan: "Pelatihan Server ANBK tingkat Korwil"
  }
];
