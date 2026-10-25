/**
 * =========================================================================
 * SISTEM INFORMASI ABSENSI GURU & PENUGASAN MULTI-KELAS
 * Database Spreadsheet: "Data Absensi Guru"
 * ID Spreadsheet: 18Xp4G_qHIt_V25OTuTmgnmhksim9je0GiqUsF6Nu8dk
 * ID Folder Drive: 1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP
 * 
 * Struktur Sheet:
 * 1. Sheet 'Rekap'     : Data Absensi harian guru (12 Kolom Resmi)
 * 2. Sheet 'DataGuru'  : Daftar nama guru pengampu
 * 3. Sheet 'DataKelas' : Daftar kelas yang tersedia (7-A s/d 9-K)
 * 4. Sheet 'Users'     : Manajemen akun login Admin & Petugas Piket
 * =========================================================================
 */

// KONFIGURASI SISTEM UTAMA
var SPREADSHEET_ID  = "18Xp4G_qHIt_V25OTuTmgnmhksim9je0GiqUsF6Nu8dk"; 
var SHEET_REKAP     = "Rekap";
var SHEET_GURU      = "DataGuru";
var SHEET_KELAS     = "DataKelas";
var SHEET_USERS     = "Users";
var DRIVE_FOLDER_ID = "1jaWTwjk7zZ0YHPQTZeJY1Ikl-jvmufHP";

/**
 * Endpoint Utama Web App
 * Menggunakan HtmlService Template agar dapat memuat file Stylesheet & JavaScript modular
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Sistem Absensi Guru & Rekapitulasi')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

/**
 * Helper function untuk meng-include file HTML/CSS/JS modular
 * Digunakan pada Index.html:
 * <?!= include('Stylesheet'); ?>
 * <?!= include('JavaScript'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mengambil Data Guru dan Data Kelas secara Dinamis dari Spreadsheet
 */
function getDaftarGuruDanKelas() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);

    // 1. Ambil Data Guru dari sheet 'DataGuru'
    var sheetGuru = ss.getSheetByName(SHEET_GURU);
    var dataGuruRaw = sheetGuru.getDataRange().getValues();
    var daftarGuru = [];
    for (var i = 1; i < dataGuruRaw.length; i++) {
      var nama = String(dataGuruRaw[i][0]).trim();
      if (nama) daftarGuru.push(nama);
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
      daftarKelas: daftarKelas
    };
  } catch (error) {
    Logger.log("Error getDaftarGuruDanKelas: " + error.message);
    return {
      success: false,
      message: "Gagal memuat data dari Spreadsheet: " + error.message,
      daftarGuru: [],
      daftarKelas: []
    };
  }
}

/**
 * Otomatisasi Pembuatan & Penataan Struktur 4 Sheet Jika Belum Ada
 */
function inisialisasiSemuaSheet(ss) {
  // 1. Sheet 'Rekap' (12 Kolom Utama)
  var sheetRekap = ss.getSheetByName(SHEET_REKAP);
  if (!sheetRekap) {
    sheetRekap = ss.insertSheet(SHEET_REKAP);
    var headersRekap = [
      "Timestamp", "Hari", "Tanggal", "Nama Guru", 
      "Status Kehadiran", "Link Kehadiran", "Kelas", 
      "Jam Awal", "Jam Akhir", "Mata Pelajaran", 
      "Bentuk Penugasan", "Catatan"
    ];
    sheetRekap.appendRow(headersRekap);
    var headerRange = sheetRekap.getRange(1, 1, 1, headersRekap.length);
    headerRange.setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    sheetRekap.setFrozenRows(1);
  }

  // 2. Sheet 'DataGuru'
  var sheetGuru = ss.getSheetByName(SHEET_GURU);
  if (!sheetGuru) {
    sheetGuru = ss.insertSheet(SHEET_GURU);
    sheetGuru.appendRow(["Nama Guru"]);
    sheetGuru.getRange(1, 1).setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    sheetGuru.setFrozenRows(1);
    
    var masterGuru = [
      "Abdul Hamid, S.Pd", "Ade Irma, S.Pd", "Agus Setiawan, S.Pd", "Ahmad Fauzi, S.Pd.I",
      "Ai Siti Rohmah, S.Pd", "Ani Suryani, S.Pd", "Asep Saepuloh, M.Pd", "Budi Santoso, S.Kom",
      "Cecep Supriadi, S.Pd", "Dadang Hermawan, M.Pd", "Dewi Lestari, S.Pd", "Dian Anggraeni, S.Pd",
      "Drs. H. Maman Suratman", "Eka Nurmala, S.Pd", "Endang Kurnia, S.Pd", "Erna Wati, S.Pd",
      "Fajar Nugraha, S.T", "Fitri Handayani, S.Pd", "Gugun Gunawan, S.Pd", "H. Iwan Setiawan, M.Pd",
      "Hj. Nani Maryani, M.Pd", "Imas Masitoh, S.Pd", "Indra Permana, S.Pd", "Irma Rahmawati, S.Pd",
      "Lilis Karlina, S.Pd", "Mira Sartika, S.Pd", "Nanang Suherman, S.Pd", "Neneng Hasanah, S.Pd.I",
      "Nurul Hidayah, S.Pd", "Rahmat Hidayat, M.Pd", "Rina Marlina, S.Pd", "Rizal Firmansyah, S.Pd",
      "Siti Aminah, S.Pd", "Sri Wahyuni, S.Pd", "Tatang Sutisna, M.Pd", "Ujang Suhendar, S.Pd",
      "Vina Panduwinata, S.Pd", "Wahyu Hidayat, S.Pd", "Yayan Sofyan, M.Pd", "Yulianti, S.Pd"
    ];
    for (var g = 0; g < masterGuru.length; g++) {
      sheetGuru.appendRow([masterGuru[g]]);
    }
  }

  // 3. Sheet 'DataKelas'
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

  // 4. Sheet 'Users'
  var sheetUsers = ss.getSheetByName(SHEET_USERS);
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet(SHEET_USERS);
    sheetUsers.appendRow(["Username", "Password", "Role", "Nama"]);
    sheetUsers.getRange(1, 1, 1, 4).setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    sheetUsers.setFrozenRows(1);

    sheetUsers.appendRow(["kurikulum", "kurikulum2025", "admin", "Admin Kurikulum"]);
    sheetUsers.appendRow(["piket", "piket123", "piket", "Petugas Piket"]);
  }
}

/**
 * Autentikasi Login (Admin & Petugas Piket Saja)
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
      var dbRole = String(data[i][2]).trim().toLowerCase();
      var dbNama = String(data[i][3]).trim();

      if (dbUser === cleanUser && dbPass === cleanPass) {
        if (dbRole === "admin" || dbRole === "piket") {
          return {
            success: true,
            user: {
              username: dbUser,
              role: dbRole,
              nama: dbNama
            }
          };
        }
      }
    }

    return {
      success: false,
      message: "Username atau Password salah! (Hanya Admin dan Petugas Piket yang dapat login)"
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
 * Mengganti Password Akun (Khusus Hak Akses Admin)
 */
function gantiPassword(currentUserRole, targetUsername, newPassword) {
  try {
    if (String(currentUserRole).trim().toLowerCase() !== "admin") {
      return {
        success: false,
        message: "Akses ditolak: Hanya akun Admin yang berwenang mengganti password!"
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
 * Menyimpan Data Absensi Multi-Kelas ke Sheet 'Rekap'
 */
function simpanPresensi(formData, fileData) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);
    var sheetRekap = ss.getSheetByName(SHEET_REKAP);

    // Upload file bukti ke Drive jika disertakan
    var linkBukti = "-";
    if (fileData && fileData.base64 && fileData.base64.trim() !== "") {
      linkBukti = prosesUploadFile(fileData, formData.namaGuru, formData.tanggal);
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    var totalBarisTersimpan = 0;

    if (formData.kelasItems && formData.kelasItems.length > 0) {
      for (var i = 0; i < formData.kelasItems.length; i++) {
        var item = formData.kelasItems[i];
        var rowData = [
          timestamp,
          formData.hari || "",
          formData.tanggal || "",
          formData.namaGuru || "",
          formData.statusKehadiran || "",
          linkBukti,
          item.kelas || "",
          item.jamAwal || "",
          item.jamAkhir || "",
          item.mapel || "",
          item.penugasan || "",
          formData.catatan || ""
        ];
        sheetRekap.appendRow(rowData);
        totalBarisTersimpan++;
      }
    } else {
      var singleRow = [
        timestamp,
        formData.hari || "",
        formData.tanggal || "",
        formData.namaGuru || "",
        formData.statusKehadiran || "",
        linkBukti,
        "-", "-", "-", "-", "-",
        formData.catatan || ""
      ];
      sheetRekap.appendRow(singleRow);
      totalBarisTersimpan++;
    }

    return {
      success: true,
      message: "Data Absensi berhasil dicatat ke sheet 'Rekap' (" + totalBarisTersimpan + " penugasan kelas).",
      linkDrive: linkBukti
    };
  } catch (error) {
    Logger.log("Error simpanPresensi: " + error.message);
    return {
      success: false,
      message: "Gagal menyimpan Absensi ke spreadsheet: " + error.message
    };
  }
}

/**
 * Mengunggah file bukti kehadiran ke Google Drive
 */
function prosesUploadFile(fileData, namaGuru, tanggal) {
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
    var safeGuru = String(namaGuru || "Guru").replace(/[^a-zA-Z0-9]/g, "_");
    var safeTgl = String(tanggal || "HariIni").replace(/[^a-zA-Z0-9]/g, "-");
    var ext = "jpg";
    if (fileData.filename && fileData.filename.lastIndexOf(".") !== -1) {
      ext = fileData.filename.substring(fileData.filename.lastIndexOf(".") + 1).toLowerCase();
    }
    var finalFilename = "Bukti_" + safeGuru + "_" + safeTgl + "_" + Utilities.formatDate(new Date(), "Asia/Jakarta", "HHmmss") + "." + ext;

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
 */
function getRekapData(filter) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    inisialisasiSemuaSheet(ss);
    var sheetRekap = ss.getSheetByName(SHEET_REKAP);
    var data = sheetRekap.getDataRange().getValues();

    if (data.length <= 1) {
      return {
        success: true,
        records: [],
        statistik: { total: 0, sakit: 0, izin: 0, tugas: 0, alpa: 0 }
      };
    }

    var records = [];
    var stats = { total: 0, sakit: 0, izin: 0, tugas: 0, alpa: 0 };
    var teacherDaysMap = {}; // Key: yyyy-mm-dd_namaGuru -> { guru, status, tanggalStr }
    var guruSummaryMap = {}; // Key: namaGuru -> { namaGuru, sakit: 0, izin: 0, tugas: 0, alpa: 0, totalHari: 0, dates: [] }

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var rawTimestamp = row[0];
      var rawHari = String(row[1] || "").trim();
      var tglStr = String(row[2]).trim();

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
        var namaGuru = String(row[3] || "-").trim();
        var status = String(row[4] || "").trim();
        var dateIsoKey = Utilities.formatDate(rowDate, "Asia/Jakarta", "yyyy-MM-dd");
        var cleanHariTanggal = formatHariTanggalIndonesia(rowDate, rawHari);
        var cleanWaktu = formatTimestampTanggalSaja(rawTimestamp, rowDate);

        var recordItem = {
          no: records.length + 1,
          timestamp: cleanWaktu,
          hari: cleanHariTanggal.split(",")[0] || rawHari,
          tanggal: cleanHariTanggal,
          rawDate: dateIsoKey,
          namaGuru: namaGuru,
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

        var teacherDayKey = dateIsoKey + "___" + namaGuru;
        if (!teacherDaysMap[teacherDayKey]) {
          teacherDaysMap[teacherDayKey] = {
            namaGuru: namaGuru,
            status: status,
            dateKey: dateIsoKey,
            displayDate: Utilities.formatDate(rowDate, "Asia/Jakarta", "dd/MM")
          };
        }

        if (!guruSummaryMap[namaGuru]) {
          guruSummaryMap[namaGuru] = {
            namaGuru: namaGuru,
            sakit: 0,
            izin: 0,
            tugas: 0,
            alpa: 0,
            totalHari: 0,
            dateDetails: []
          };
        }
      }
    }

    for (var tdKey in teacherDaysMap) {
      var item = teacherDaysMap[tdKey];
      stats.total++;
      var lowerStatus = item.status.toLowerCase();
      var guruSummary = guruSummaryMap[item.namaGuru];

      if (lowerStatus.indexOf("sakit") !== -1) {
        stats.sakit++;
        if (guruSummary) {
          guruSummary.sakit++;
          guruSummary.totalHari++;
          guruSummary.dateDetails.push(item.displayDate + " (Sakit)");
        }
      } else if (lowerStatus.indexOf("izin") !== -1) {
        stats.izin++;
        if (guruSummary) {
          guruSummary.izin++;
          guruSummary.totalHari++;
          guruSummary.dateDetails.push(item.displayDate + " (Izin)");
        }
      } else if (lowerStatus.indexOf("tugas") !== -1) {
        stats.tugas++;
        if (guruSummary) {
          guruSummary.tugas++;
          guruSummary.totalHari++;
          guruSummary.dateDetails.push(item.displayDate + " (Tugas Dinas)");
        }
      } else {
        stats.alpa++;
        if (guruSummary) {
          guruSummary.alpa++;
          guruSummary.totalHari++;
          guruSummary.dateDetails.push(item.displayDate + " (Tanpa Ket.)");
        }
      }
    }

    var rekapKetidakhadiranGuru = [];
    var noGuru = 1;
    for (var gName in guruSummaryMap) {
      var gObj = guruSummaryMap[gName];
      rekapKetidakhadiranGuru.push({
        no: noGuru++,
        namaGuru: gObj.namaGuru,
        sakit: gObj.sakit,
        izin: gObj.izin,
        tugas: gObj.tugas,
        alpa: gObj.alpa,
        totalHari: gObj.totalHari,
        keterangan: gObj.dateDetails.join(", ")
      });
    }

    return {
      success: true,
      records: records,
      rekapKetidakhadiranGuru: rekapKetidakhadiranGuru,
      statistik: stats
    };
  } catch (error) {
    Logger.log("Error getRekapData: " + error.message);
    return {
      success: false,
      message: "Gagal mengambil rekap: " + error.message,
      records: [],
      rekapKetidakhadiranGuru: [],
      statistik: { total: 0, sakit: 0, izin: 0, tugas: 0, alpa: 0 }
    };
  }
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
  if (fallbackTimestamp instanceof Date) {
    return fallbackTimestamp;
  }
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

function formatTimestampTanggalSaja(ts, fallbackDate) {
  if (ts instanceof Date) {
    return Utilities.formatDate(ts, "Asia/Jakarta", "dd/MM/yyyy");
  }
  var s = String(ts || "").trim();
  var match = s.match(/^(\d{1,2}\/\d{1,2}\/\d{4})/);
  if (match) return match[1];
  var matchIso = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (matchIso) {
    var parts = matchIso[1].split("-");
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }
  if (fallbackDate instanceof Date && !isNaN(fallbackDate.getTime())) {
    return Utilities.formatDate(fallbackDate, "Asia/Jakarta", "dd/MM/yyyy");
  }
  return s.split(" ")[0] || "-";
}

function formatHariTanggalIndonesia(d, rawHari) {
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return String(rawHari || "-");
  }
  var arrHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  var arrBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  var hari = (rawHari && rawHari.trim() && rawHari.trim() !== "-") ? rawHari.trim() : arrHari[d.getDay()];
  return hari + ", " + d.getDate() + " " + arrBulan[d.getMonth()] + " " + d.getFullYear();
}