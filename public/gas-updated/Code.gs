/**
 * =========================================================================
 * SISTEM INFORMASI ABSENSI PEGAWAI (KEPSEK, GURU, TENDIK, PIKET, ADMIN)
 * SMP NEGERI 1 CIRANJANG
 * Database Spreadsheet: "Data Absensi Guru" (3 Sheet: Rekap, DataKelas, Users)
 * ID Spreadsheet: 18Xp4G_qHIt_V25OTuTmgnmhksim9je0GiqUsF6Nu8dk
 * ID Folder Drive: 1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP
 * 
 * Struktur 3 Sheet Resmi:
 * 1. Sheet 'Rekap'     : Data Absensi harian pegawai (12 Kolom Resmi)
 * 2. Sheet 'DataKelas' : Daftar kelas yang tersedia (7-A s/d 9-K)
 * 3. Sheet 'Users'     : Manajemen 5 kelompok akun (Admin, Piket, Kepsek, Guru, Tendik)
 * =========================================================================
 */

// KONFIGURASI SISTEM UTAMA
var SPREADSHEET_ID  = "18Xp4G_qHIt_V25OTuTmgnmhksim9je0GiqUsF6Nu8dk"; 
var SHEET_REKAP     = "Rekap";
var SHEET_KELAS     = "DataKelas";
var SHEET_USERS     = "Users";
var DRIVE_FOLDER_ID = "1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP";

/**
 * Endpoint Utama Web App
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Sistem Absensi Pegawai - SMPN 1 Ciranjang')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

/**
 * Helper function include modular HTML/CSS/JS
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mengambil Data Pegawai (dari Sheet 'Users' berdasarkan Role) dan Data Kelas dari Sheet 'DataKelas'
 * Menghindari data ganda: data guru tidak lagi dari sheet terpisah melainkan dari sheet Users dengan Role GURU
 */
function getDaftarPegawaiDanKelas() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);

    // 1. Ambil Data Pegawai dari sheet 'Users'
    var sheetUsers = ss.getSheetByName(SHEET_USERS);
    var dataUsersRaw = sheetUsers.getDataRange().getValues();

    var daftarGuru = [];
    var daftarKepsek = [];
    var daftarTendik = [];
    var semuaPegawai = [];

    for (var i = 1; i < dataUsersRaw.length; i++) {
      var username = String(dataUsersRaw[i][0]).trim();
      var role = String(dataUsersRaw[i][2]).trim().toUpperCase();
      var nama = String(dataUsersRaw[i][3]).trim();

      if (nama) {
        semuaPegawai.push({ username: username, role: role, nama: nama });

        if (role === "GURU") {
          daftarGuru.push(nama);
        } else if (role === "KEPSEK") {
          daftarKepsek.push(nama);
        } else if (role === "TENDIK") {
          daftarTendik.push(nama);
        }
      }
    }

    // 2. Ambil Data Kelas dari sheet 'DataKelas'
    var sheetKelas = ss.getSheetByName(SHEET_KELAS);
    var dataKelasRaw = sheetKelas.getDataRange().getValues();
    var daftarKelas = [];
    for (var j = 1; j < dataKelasRaw.length; j++) {
      var kelas = String(dataKelasRaw[j][0]).trim();
      if (kelas) daftarKelas.push(kelas);
    }

    return {
      success: true,
      daftarGuru: daftarGuru,
      daftarKepsek: daftarKepsek,
      daftarTendik: daftarTendik,
      semuaPegawai: semuaPegawai,
      daftarKelas: daftarKelas
    };
  } catch (error) {
    Logger.log("Error getDaftarPegawaiDanKelas: " + error.message);
    return {
      success: false,
      message: "Gagal memuat data dari Spreadsheet: " + error.message,
      daftarGuru: [],
      daftarKepsek: [],
      daftarTendik: [],
      semuaPegawai: [],
      daftarKelas: []
    };
  }
}

/**
 * Otomatisasi Pembuatan & Penataan Struktur 3 Sheet Jika Belum Ada
 */
function inisialisasiSemuaSheet(ss) {
  // 1. Sheet 'Rekap' (12 Kolom Resmi - Header Kolom 4: 'Nama Pegawai')
  var sheetRekap = ss.getSheetByName(SHEET_REKAP);
  var headersRekap = [
    "Timestamp", "Hari", "Tanggal", "Nama Pegawai", 
    "Status Kehadiran", "Link Kehadiran", "Kelas", 
    "Jam Awal", "Jam Akhir", "Mata Pelajaran", 
    "Bentuk Penugasan", "Catatan"
  ];
  if (!sheetRekap) {
    sheetRekap = ss.insertSheet(SHEET_REKAP);
    sheetRekap.appendRow(headersRekap);
    var headerRange = sheetRekap.getRange(1, 1, 1, headersRekap.length);
    headerRange.setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    sheetRekap.setFrozenRows(1);
  } else {
    // Pastikan baris ke-1 kolom ke-4 menggunakan 'Nama Pegawai'
    try {
      var h4 = String(sheetRekap.getRange(1, 4).getValue()).trim();
      if (h4.toLowerCase() === "nama guru") {
        sheetRekap.getRange(1, 4).setValue("Nama Pegawai");
      }
    } catch (eH) {
      Logger.log("Warning update header: " + eH.message);
    }
  }

  // 2. Sheet 'DataKelas'
  var sheetKelas = ss.getSheetByName(SHEET_KELAS);
  if (!sheetKelas) {
    sheetKelas = ss.insertSheet(SHEET_KELAS);
    sheetKelas.appendRow(["Nama Kelas"]);
    sheetKelas.getRange(1, 1).setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    sheetKelas.setFrozenRows(1);

    var masterKelas = [
      "7 - A", "7 - B", "7 - C", "7 - D", "7 - E", "7 - F", "7 - G", "7 - H", "7 - I", "7 - J", "7 - K",
      "8 - A", "8 - B", "8 - C", "8 - D", "8 - E", "8 - F", "8 - G", "8 - H", "8 - I", "8 - J", "8 - K",
      "9 - A", "9 - B", "9 - C", "9 - D", "9 - E", "9 - F", "9 - G", "9 - H", "9 - I", "9 - J", "9 - K"
    ];
    for (var k = 0; k < masterKelas.length; k++) {
      sheetKelas.appendRow([masterKelas[k]]);
    }
  }

  // 3. Sheet 'Users' (Mendukung 5 Kelompok Pegawai)
  var sheetUsers = ss.getSheetByName(SHEET_USERS);
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet(SHEET_USERS);
    sheetUsers.appendRow(["Username", "Password", "Role", "Nama Lengkap", "Akses Fitur Ganti Password"]);
    sheetUsers.getRange(1, 1, 1, 5).setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    sheetUsers.setFrozenRows(1);

    sheetUsers.appendRow(["admin", "Admin@2026", "ADMIN", "Administrator", "Ya"]);
    sheetUsers.appendRow(["piket", "piket123", "PIKET", "Petugas Piket", "Tidak"]);
    sheetUsers.appendRow(["kepsek", "kepsek123", "KEPSEK", "Dra. YETTY NURHAYATI, S.Pd., M.Pd.", "Tidak"]);
    sheetUsers.appendRow(["guru01", "guru123", "GURU", "HENNY NUR'AINI, S.Pd.", "Tidak"]);
    sheetUsers.appendRow(["tendik01", "tendik123", "TENDIK", "DESYANA FEBBY, S.Pust.", "Tidak"]);
    sheetUsers.appendRow(["tendik02", "tendik123", "TENDIK", "KUSNADI", "Tidak"]);
    sheetUsers.appendRow(["tendik03", "tendik123", "TENDIK", "WIEDYA SAFITRIE, A.Ma.Pust", "Tidak"]);
    sheetUsers.appendRow(["tendik04", "tendik123", "TENDIK", "MOHAMAD MESYA SUBHAN DARDJAT", "Tidak"]);
    sheetUsers.appendRow(["tendik05", "tendik@123", "TENDIK", "AMIR SAEPULLOH, A.Md.", "Tidak"]);
    sheetUsers.appendRow(["tendik06", "tendik123", "TENDIK", "ARI ARIYANDI", "Tidak"]);
    sheetUsers.appendRow(["tendik07", "tendik123", "TENDIK", "AHMAD SAEPUL RISMANTO", "Tidak"]);
    sheetUsers.appendRow(["tendik08", "tendik123", "TENDIK", "ALEK SANDER CANDRA", "Tidak"]);
    sheetUsers.appendRow(["tendik09", "tendik123", "TENDIK", "MUHAMAD MESYA TAWAKALLILLAH", "Tidak"]);
    sheetUsers.appendRow(["tendik10", "tendik123", "TENDIK", "AGUS SANTANA", "Tidak"]);
    sheetUsers.appendRow(["tendik11", "tendik123", "TENDIK", "AGUS BUCHORI", "Tidak"]);
  }
}

/**
 * Autentikasi Login untuk 5 Kelompok Pegawai (Admin, Piket, Kepsek, Guru, Tendik)
 */
function loginPengguna(username, password) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);
    var sheetUsers = ss.getSheetByName(SHEET_USERS);
    var data = sheetUsers.getDataRange().getValues();

    var cleanUser = String(username).trim().toLowerCase();
    var cleanPass = String(password).trim();

    for (var i = 1; i < data.length; i++) {
      var dbUser = String(data[i][0]).trim().toLowerCase();
      var dbPass = String(data[i][1]).trim();
      var dbRole = String(data[i][2]).trim().toUpperCase();
      var dbNama = String(data[i][3]).trim();

      if (dbUser === cleanUser && dbPass === cleanPass) {
        return {
          success: true,
          user: {
            username: dbUser,
            role: dbRole.toLowerCase(),
            nama: dbNama
          }
        };
      }
    }

    return {
      success: false,
      message: "Username atau Password salah! Periksa kembali akun Anda pada sheet Users."
    };
  } catch (error) {
    Logger.log("Error loginPengguna: " + error.message);
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat login: " + error.message
    };
  }
}

/**
 * Mengganti Password Akun (Syarat 12: Khusus Hak Akses ADMIN Saja)
 */
function gantiPassword(currentUserRole, targetUsername, newPassword) {
  try {
    var role = String(currentUserRole).trim().toLowerCase();
    if (role !== "admin") {
      return {
        success: false,
        message: "Akses ditolak: Hanya akun Administrator yang berwenang mengganti password!"
      };
    }

    var cleanTarget = String(targetUsername).trim().toLowerCase();
    var cleanNewPass = String(newPassword).trim();

    if (!cleanNewPass || cleanNewPass.length < 4) {
      return {
        success: false,
        message: "Password baru minimal 4 karakter!"
      };
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);
    var sheetUsers = ss.getSheetByName(SHEET_USERS);
    var data = sheetUsers.getDataRange().getValues();
    var rowIndexFound = -1;

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toLowerCase() === cleanTarget) {
        rowIndexFound = i + 1;
        break;
      }
    }

    if (rowIndexFound !== -1) {
      sheetUsers.getRange(rowIndexFound, 2).setValue(cleanNewPass);
      return {
        success: true,
        message: "Password untuk akun '" + cleanTarget + "' berhasil diperbarui!"
      };
    } else {
      return {
        success: false,
        message: "Akun '" + cleanTarget + "' tidak ditemukan dalam sheet Users!"
      };
    }
  } catch (error) {
    Logger.log("Error gantiPassword: " + error.message);
    return {
      success: false,
      message: "Gagal mengganti password: " + error.message
    };
  }
}

/**
 * Menyimpan Data Absensi ke Sheet 'Rekap'
 * Mendukung Semua Role (Kepsek, Guru, Tendik, Admin, Piket)
 * Aman terhadap parameter undefined atau eksekusi pengujian langsung dari editor GAS
 */
function simpanPresensi(formData, fileData) {
  try {
    // 1. Parsing jika dikirim sebagai JSON string
    if (typeof formData === "string") {
      try {
        formData = JSON.parse(formData);
      } catch (eParse) {
        Logger.log("Peringatan JSON.parse formData: " + eParse.message);
      }
    }
    if (typeof fileData === "string" && fileData.trim() !== "") {
      try {
        fileData = JSON.parse(fileData);
      } catch (eFileParse) {
        Logger.log("Peringatan JSON.parse fileData: " + eFileParse.message);
      }
    }

    // 2. Fallback jika formData kosong / undefined (misal tombol Run/Jalankan di editor Apps Script)
    if (!formData || typeof formData !== "object") {
      Logger.log("Peringatan: simpanPresensi dipanggil tanpa parameter formData. Menggunakan fallback objek pengujian.");
      formData = {
        namaPegawai: "Dra. YETTY NURHAYATI, S.Pd., M.Pd.",
        statusKehadiran: "Tugas Dinas Luar",
        tanggal: Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
        hari: "Senin",
        catatan: "Uji Coba Eksekusi Mandiri Editor Apps Script",
        isGuru: false,
        targetRole: "kepsek",
        kelasItems: []
      };
    }

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);
    var sheetRekap = ss.getSheetByName(SHEET_REKAP);

    // 3. Normalisasi field secara aman
    var namaPegawai = String(formData.namaPegawai || formData.namaGuru || formData.nama || "Pegawai").trim();
    var statusKehadiran = String(formData.statusKehadiran || "Sakit").trim();
    var tanggal = String(formData.tanggal || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd")).trim();
    
    // Syarat 2: Otomatisasi Hari dari Tanggal (contoh: 23 Oktober 2026 menghasilkan Jum'at)
    var hari = hitungHariDariTanggal(tanggal, formData.hari);
    var catatan = String(formData.catatan || "-").trim();
    var targetRole = String(formData.targetRole || formData.role || "").toLowerCase().trim();

    // Syarat 1: Validasi Role Pegawai dari Sheet 'Users' agar Tendik (seperti AMIR SAEPULLOH) 100% tepat
    var sheetUsers = ss.getSheetByName(SHEET_USERS);
    if (sheetUsers) {
      var uRows = sheetUsers.getDataRange().getValues();
      for (var u = 1; u < uRows.length; u++) {
        var uNama = String(uRows[u][3] || "").trim();
        if (uNama.toLowerCase() === namaPegawai.toLowerCase()) {
          targetRole = String(uRows[u][2] || "").trim().toLowerCase();
          break;
        }
      }
    }

    var kelasItems = Array.isArray(formData.kelasItems) ? formData.kelasItems : [];

    // Deteksi apakah entri adalah GURU:
    var isGuru = false;
    if (targetRole === "guru") {
      isGuru = true;
    } else if (targetRole === "kepsek" || targetRole === "tendik") {
      isGuru = false;
    } else if (formData.isGuru === true || formData.isGuru === "true") {
      isGuru = true;
    }

    // 4. Upload file bukti ke Drive jika disertakan
    var linkBukti = "-";
    var fileObj = fileData || formData.fileData || formData.fileBukti;
    if (fileObj && fileObj.base64 && String(fileObj.base64).trim() !== "") {
      linkBukti = prosesUploadFile(fileObj, namaPegawai, tanggal);
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    var totalBaris = 0;

    // 5. Simpan ke sheet 'Rekap'
    if (isGuru && kelasItems.length > 0) {
      for (var i = 0; i < kelasItems.length; i++) {
        var item = kelasItems[i] || {};
        var rowData = [
          timestamp,
          hari,
          tanggal,
          namaPegawai,
          statusKehadiran,
          linkBukti,
          String(item.kelas || "-"),
          String(item.jamAwal || "-"),
          String(item.jamAkhir || "-"),
          String(item.mapel || "-"),
          String(item.penugasan || "-"),
          catatan
        ];
        sheetRekap.appendRow(rowData);
        totalBaris++;
      }
    } else {
      // Untuk Kepsek atau Tendik (1 baris tanpa rincian kelas)
      var singleRow = [
        timestamp,
        hari,
        tanggal,
        namaPegawai,
        statusKehadiran,
        linkBukti,
        "-", "-", "-", "-", "-",
        catatan
      ];
      sheetRekap.appendRow(singleRow);
      totalBaris++;
    }

    // Paksa Spreadsheet untuk menyimpan data secara instan
    SpreadsheetApp.flush();

    return {
      success: true,
      message: "Data Absensi (" + (namaPegawai || "Pegawai") + ") berhasil dicatat ke sheet 'Rekap' (" + totalBaris + " entri).",
      linkDrive: linkBukti
    };
  } catch (error) {
    Logger.log("Error simpanPresensi: " + error.message);
    return {
      success: false,
      message: "Gagal menyimpan absensi: " + error.message
    };
  }
}

/**
 * Fungsi Pengujian Eksekusi Mandiri di Editor Apps Script
 * Pengguna dapat memilih fungsi ini di toolbar editor dan klik 'Jalankan / Run'
 */
function testSimpanPresensi() {
  var sampleKepsek = {
    namaPegawai: "Dra. YETTY NURHAYATI, S.Pd., M.Pd.",
    statusKehadiran: "Tugas Dinas Luar",
    tanggal: Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
    hari: "Senin",
    catatan: "Uji coba simpan presensi Kepsek dari editor GAS",
    isGuru: false,
    targetRole: "kepsek",
    kelasItems: []
  };
  var res = simpanPresensi(sampleKepsek, null);
  Logger.log("Hasil Uji Kepsek: " + JSON.stringify(res));

  var sampleTendik = {
    namaPegawai: "AMIR SAEPULLOH, A.Md.",
    statusKehadiran: "Sakit",
    tanggal: Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
    hari: "Senin",
    catatan: "Uji coba simpan presensi Tendik dari editor GAS",
    isGuru: false,
    targetRole: "tendik",
    kelasItems: []
  };
  var resTendik = simpanPresensi(sampleTendik, null);
  Logger.log("Hasil Uji Tendik: " + JSON.stringify(resTendik));

  var sampleGuru = {
    namaPegawai: "HENNY NUR'AINI, S.Pd.",
    statusKehadiran: "Sakit",
    tanggal: Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
    hari: "Senin",
    catatan: "Uji coba simpan presensi Guru dari editor GAS",
    isGuru: true,
    targetRole: "guru",
    kelasItems: [
      { kelas: "7 - A", jamAwal: "Jam Ke-1", jamAkhir: "Jam Ke-2", mapel: "Matematika", penugasan: "Mengerjakan LKS hal 25" }
    ]
  };
  var resGuru = simpanPresensi(sampleGuru, null);
  Logger.log("Hasil Uji Guru: " + JSON.stringify(resGuru));
}

/**
 * Mengunggah file bukti ke folder Google Drive
 */
function prosesUploadFile(fileData, namaPegawai, tanggal) {
  try {
    if (!fileData || typeof fileData !== "object" || !fileData.base64 || fileData.base64.trim() === "") {
      return "-";
    }

    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var rawBase64 = String(fileData.base64);
    var commaIndex = rawBase64.indexOf(",");
    if (commaIndex !== -1) {
      rawBase64 = rawBase64.substring(commaIndex + 1);
    }
    rawBase64 = rawBase64.replace(/\s/g, "");

    var decodedBytes = Utilities.base64Decode(rawBase64);
    var safeNama = String(namaPegawai || "Pegawai").replace(/[^a-zA-Z0-9]/g, "_");
    var safeTgl = String(tanggal || "HariIni").replace(/[^a-zA-Z0-9]/g, "-");
    var ext = "jpg";
    if (fileData.filename && fileData.filename.lastIndexOf(".") !== -1) {
      ext = fileData.filename.substring(fileData.filename.lastIndexOf(".") + 1).toLowerCase();
    }
    var finalFilename = "Bukti_" + safeNama + "_" + safeTgl + "_" + Utilities.formatDate(new Date(), "Asia/Jakarta", "HHmmss") + "." + ext;

    var blob = Utilities.newBlob(decodedBytes, fileData.mimeType || "application/octet-stream", finalFilename);
    var uploadedFile = folder.createFile(blob);
    
    try {
      uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (eShare) {
      Logger.log("Warning sharing file: " + eShare.message);
    }

    return uploadedFile.getUrl();
  } catch (error) {
    Logger.log("Error prosesUploadFile: " + error.message);
    return "Error Upload: " + error.message;
  }
}

/**
 * Mengambil Data Rekapitulasi dari Sheet 'Rekap'
 * Syarat 10: Hilangkan kolom Waktu
 * Syarat 11: Untuk Role Kepsek, Guru, dan Tendik hanya tampilkan data dirinya sendiri
 */
function getRekapData(filter, currentUser) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);
    var sheetRekap = ss.getSheetByName(SHEET_REKAP);
    var data = sheetRekap.getDataRange().getValues();

    if (data.length <= 1) {
      return {
        success: true,
        records: []
      };
    }

    var role = (currentUser && currentUser.role) ? String(currentUser.role).toLowerCase() : "admin";
    var namaUser = (currentUser && currentUser.nama) ? String(currentUser.nama).trim().toLowerCase() : "";

    // Petugas Piket dibatasi hanya harian
    if (role === "piket" && filter && filter.tipe !== "harian") {
      filter.tipe = "harian";
    }

    var isEmployee = (role === "kepsek" || role === "guru" || role === "tendik");
    var records = [];

    // Baca Sheet 'Users' untuk mencocokkan Role Resmi setiap Pegawai (Kepsek, Guru, Tendik)
    var sheetUsers = ss.getSheetByName(SHEET_USERS);
    var usersData = sheetUsers ? sheetUsers.getDataRange().getValues() : [];
    var userRoleMap = {};
    for (var u = 1; u < usersData.length; u++) {
      var uRole = String(usersData[u][2] || "").trim().toLowerCase();
      var uNama = String(usersData[u][3] || "").trim().toLowerCase();
      if (uNama) {
        userRoleMap[uNama] = uRole;
      }
    }

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawTimestamp = row[0];
      var rawHari = String(row[1] || "").trim();
      var tglStr = String(row[2]).trim();
      var namaPegawai = String(row[3] || "-").trim();

      // Syarat 11: Batasi data hanya untuk pegawai yang login
      if (isEmployee) {
        if (namaPegawai.toLowerCase() !== namaUser) {
          continue;
        }
      }

      var rowDate = parseTanggalKeDate(tglStr, rawTimestamp);
      var lolosFilter = true;

      if (filter && filter.tipe === "harian" && filter.tanggal) {
        var filterDate = new Date(filter.tanggal);
        lolosFilter = isSameDay(rowDate, filterDate);
      } else if (filter && filter.tipe === "mingguan" && filter.tglMulai && filter.tglSelesai) {
        var start = new Date(filter.tglMulai);
        start.setHours(0, 0, 0, 0);
        var end = new Date(filter.tglSelesai);
        end.setHours(23, 59, 59, 999);
        lolosFilter = (rowDate >= start && rowDate <= end);
      } else if (filter && filter.tipe === "bulanan" && filter.bulan && filter.tahun) {
        var fMonth = parseInt(filter.bulan, 10) - 1;
        var fYear = parseInt(filter.tahun, 10);
        lolosFilter = (rowDate.getMonth() === fMonth && rowDate.getFullYear() === fYear);
      }

      if (lolosFilter) {
        var status = String(row[4] || "").trim();
        var dateIsoKey = Utilities.formatDate(rowDate, "Asia/Jakarta", "yyyy-MM-dd");

        // Syarat 1: Menentukan Role Pegawai secara akurat dari Sheet Users
        var namaLower = namaPegawai.toLowerCase();
        var rolePegawai = userRoleMap[namaLower] || "";
        if (!rolePegawai) {
          if (namaLower.includes("yetty nurhayati") || namaLower.includes("kepsek")) {
            rolePegawai = "kepsek";
          } else if (String(row[6] || "").trim() === "-" && String(row[9] || "").trim() === "-") {
            rolePegawai = "tendik";
          } else {
            rolePegawai = "guru";
          }
        }

        // Syarat 2 & 3: Format Hari & Tanggal secara rapi TANPA DUPLIKASI HARI
        var arrHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
        var arrBulan = [
          "Januari", "Februari", "Maret", "April", "Mei", "Juni",
          "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        var cleanHari = (rawHari && rawHari.trim() && rawHari.trim() !== "-") ? rawHari.trim() : arrHari[rowDate.getDay()];
        var cleanTanggalHanya = rowDate.getDate() + " " + arrBulan[rowDate.getMonth()] + " " + rowDate.getFullYear();
        var fullHariTanggal = cleanHari + ", " + cleanTanggalHanya;

        // Syarat 10: Timestamp/Waktu tidak ditampilkan lagi
        var recordItem = {
          no: records.length + 1,
          hari: cleanHari,
          tanggal: cleanTanggalHanya, // Contoh: "25 Oktober 2026" (tanpa pengulangan hari)
          fullHariTanggal: fullHariTanggal, // Contoh: "Senin, 25 Oktober 2026"
          rawDate: dateIsoKey,
          namaPegawai: namaPegawai,
          rolePegawai: rolePegawai,
          statusKehadiran: status,
          linkKehadiran: String(row[5] || "-").trim(),
          kelas: String(row[6] || "-").trim(),
          jamAwal: String(row[7] || "-").trim(),
          jamAkhir: String(row[8] || "-").trim(),
          mapel: String(row[9] || "-").trim(),
          bentukPenugasan: String(row[10] || "-").trim(),
          catatan: String(row[11] || "-").trim()
        };
        records.push(recordItem);
      }
    }

    return {
      success: true,
      records: records
    };
  } catch (error) {
    Logger.log("Error getRekapData: " + error.message);
    return {
      success: false,
      message: "Gagal mengambil rekap: " + error.message,
      records: []
    };
  }
}

/**
 * Menghitung Nama Hari Bahasa Indonesia dari format Tanggal YYYY-MM-DD
 */
function hitungHariDariTanggal(tglStr, fallbackHari) {
  if (tglStr) {
    var d = parseTanggalKeDate(tglStr, null);
    if (d instanceof Date && !isNaN(d.getTime())) {
      var arrHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
      return arrHari[d.getDay()];
    }
  }
  return fallbackHari || "Senin";
}

function parseTanggalKeDate(tglStr, fallbackTimestamp) {
  if (tglStr) {
    if (/^\d{4}-\d{2}-\d{2}/.test(tglStr)) {
      var p = tglStr.split("-");
      return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(tglStr)) {
      var p2 = tglStr.split("/");
      return new Date(parseInt(p2[2], 10), parseInt(p2[1], 10) - 1, parseInt(p2[0], 10));
    }
    var parsed = new Date(tglStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  if (fallbackTimestamp instanceof Date) return fallbackTimestamp;
  if (typeof fallbackTimestamp === "string" && fallbackTimestamp.trim() !== "") {
    var pTs = new Date(fallbackTimestamp);
    if (!isNaN(pTs.getTime())) return pTs;
  }
  return new Date();
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

function formatHariTanggalIndonesia(d, rawHari) {
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return String(rawHari || "-");
  }
  var arrHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
  var arrBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  var hari = (rawHari && rawHari.trim() && rawHari.trim() !== "-") ? rawHari.trim() : arrHari[d.getDay()];
  return hari + ", " + d.getDate() + " " + arrBulan[d.getMonth()] + " " + d.getFullYear();
}
