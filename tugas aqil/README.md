# 🎓 Study Buddy - Platform Pencari Teman Belajar & Kolaborasi Interaktif

> **Tugas Web Project**: Study Buddy  
> **Konsep**: Temukan teman belajar yang tepat berdasarkan kriteria spesifik, masuk ke mode diskusi kolaboratif tanpa batas waktu, dan simpan seluruh riwayat belajar (chat, dokumen, foto, link, & catatan) secara otomatis.

---

## 📌 Gambaran Umum Konsep Proyek

Aplikasi **Study Buddy** dirancang untuk memecahkan kesulitan mahasiswa/pelajar dalam mencari partner belajar yang sefrekuensi. Setiap pengguna memiliki gaya belajar, mata pelajaran yang ingin didalami, serta ketersediaan waktu yang berbeda. Study Buddy menghadirkan solusi menyeluruh mulai dari pencocokan otomatis (*smart matchmaking*), notifikasi pop-up permintaan interaktif, ruang diskusi langsung tanpa batasan waktu, hingga pengarsipan otomatis seluruh aset belajar setelah sesi selesai.

---

## 🚀 Fitur & Implementasi Konsep (Sesuai Spesifikasi)

| No | Konsep Inti | Implementasi di Study Buddy |
|---|---|---|
| **1** | **Match Request** | Pengguna dapat mencari partner dengan memasukkan kriteria: mata pelajaran, materi/bab spesifik, waktu bertemu (jam & hari), mode belajar (online/offline), lokasi meetup (jika tatap muka), serta target level. Algoritma mencocokkan kesesuaian dan menampilkan skor persentase kecocokan (*Match Score*) beserta alasan kecocokan. |
| **2** | **Kriteria Diri (Create Criteria & Profile)** | Pengguna mengisi kriteria diri (mata pelajaran yang dikuasai, topik spesifik, hari kosong, lokasi favorit, gaya belajar) pada halaman *Create Criteria* dan dapat ditinjau/diedit langsung di *Profile Page*. Kriteria ini yang akan dideteksi oleh pengguna lain saat mencari match. |
| **3** | **Pop-up Accept/Reject Match Request** | Saat pengguna lain mengajak matching, muncul notifikasi dan modal pop-up interaktif. Menampilkan foto profil pemohon, jurusan, rating, pesan ajakan, match score (misal: 96% Match), dan detail kriteria. Pengguna dapat memilih **Terima (Accept)** atau **Tolak (Reject)**. Menerima request langsung membuka mode diskusi! |
| **4** | **Mode Diskusi Tanpa Batas Waktu** | Pengguna yang telah match masuk ke **Discussion Page** khusus. Sesi berjalan fleksibel tanpa batasan durasi dengan penghitung waktu belajar real-time, obrolan interaktif, editor catatan kolaboratif, checklist target belajar, dan Pomodoro focus timer. Sesi berjalan terus sampai salah satu pengguna mengklik tombol **"Akhiri Mode Diskusi"**. |
| **5** | **Otomatis Simpan Riwayat Setelah Diskusi Selesai** | Begitu mode diskusi diakhiri melalui konfirmasi, sistem secara otomatis mengemas dan mengarsipkan seluruh riwayat percakapan, berkas dokumen yang diunggah, tautan link referensi, foto/diagram materi, dan catatan bersama ke dalam database arsip riwayat belajar. |
| **6** | **Riwayat Match di Homepage & History Page** | Pengguna dapat melihat ringkasan sesi belajar dan riwayat match terakhir langsung di widget **Homepage**, lengkap dengan nama buddy, foto, durasi, topik, dan tombol untuk membuka detail arsip di **History Page**. |

---

## 📑 Struktur 9 Halaman Utama

1. **Home Page (`view-home`)**:
   - **Hero Banner Interaktif**: Sambutan personal, status pencarian teman, dan tombol aksi cepat.
   - **Tombol Navigasi Menuju Seluruh Halaman**: Sesuai instruksi spesifik (*"berisi button menuju seluruh halaman yang ada"*), tersedia grid 8 kartu navigasi cepat menuju: Request Match, Create Criteria, Pop-up Match Request, Discussion Page, Profile Page, History Page, Setting Page, dan Logout.
   - **Widget Sesi Diskusi Aktif**: Menampilkan partner yang sedang belajar bersamamu saat ini dengan indikator live.
   - **Widget Permintaan Match Masuk**: Kartu respon cepat untuk menerima/menolak ajakan belajar.
   - **Widget Riwayat Match**: Menampilkan daftar sesi belajar terakhir yang telah tersimpan.

2. **Request Match (`view-request-match`)**:
   - Form pencarian kriteria: Pelajaran, Topik/Materi Khusus, Mode (Online/Offline/Keduanya), Waktu Bertemu, Lokasi Meetup, Tingkat Belajar.
   - Mesin pencocokan cerdas (*Matchmaking Engine*) yang menghitung skor kompatibilitas (0 - 100%) secara dinamis.
   - Kartu calon teman belajar lengkap dengan bio, almamater, rating, badge persentase cocok, dan tombol **"Kirim Match Request"**.

3. **Create Criteria (`view-create-criteria`)**:
   - Form pembuatan dan pembaruan kriteria diri:
     - Toggle status ketersediaan (*Open for Matching*).
     - Pilihan multi-select mata pelajaran yang dikuasai.
     - Topik materi spesifik yang sedang dipelajari.
     - Ketersediaan hari & jam (pagi, siang, sore, malam).
     - Preferensi pertemuan tatap muka (*offline meetup*) atau daring (*online*).
     - Gaya belajar (Visual, Praktik soal, Diskusi santai, Review teori).
     - Target / goals belajar.

4. **Pop-up Accept/Reject Match Request (`modalIncomingRequests`)**:
   - Modal pop-up dengan animasi soft-pulse dan alert audio.
   - Rincian lengkap calon buddy: Foto, nama, kampus, rating bintang, match score, alasan kecocokan, serta catatan pesan.
   - Tombol **"Terima & Mulai Diskusi"** (langsung membuka Ruang Diskusi) dan **"Tolak Permintaan"**.
   - Dilengkapi tombol **"Simulasi Request Masuk"** untuk memicu pop-up demo saat presentasi.

5. **Discussion Page (`view-discussion`)**:
   - **Header Sesi**: Indikator online teman belajar, mata pelajaran, topik, dan penghitung waktu belajar (*Timer counting up*) tanpa batas waktu.
   - **Panel Kiri - Live Chat Feed**: Percakapan real-time dengan dukungan kirim teks, dokumen PDF/Word, foto diagram materi, dan tautan link website dengan preview card. Teman belajar memberikan respon otomatis cerdas (*auto-reply simulation*).
   - **Panel Kanan - Kolaborasi Terpadu**:
     - *Catatan Bersama*: Editor teks/markdown kolaboratif yang tersimpan otomatis.
     - *Checklist Target*: Daftar to-do list materi yang ingin dituntaskan dalam sesi ini.
     - *Daftar Dokumen & Link*: Arsip file yang dibagikan dalam sesi.
     - *Pomodoro Timer*: Pengatur fokus 25 menit belajar / 5 menit rehat.
     - *Audio Ambience*: Suara latar penenang konsentrasi (Soft Rain / Cafe study) langsung lewat Web Audio API tanpa perlu file mp3 eksternal.
   - **Tombol "Akhiri Mode Diskusi"**: Mengeluarkan konfirmasi, input rating/ulasan buddy, dan memicu pengarsipan otomatis.

6. **Profile Page (`view-profile`)**:
   - Informasi pengguna: Foto profil, nama lengkap, program studi, almamater, bio singkat.
   - Badges reputasi (*Top Study Buddy*, *Web Dev Wizard*, *Fast Responder*, dll.).
   - Statistik belajar: Total jam belajar bersama, jumlah sesi selesai, rating rata-rata, ulasan positif.
   - Tampilan kriteria belajar aktif yang sedang digunakan sistem untuk dicari oleh pengguna lain.
   - Fitur ubah foto profil dan edit profil cepat.

7. **History Page (`view-history`)**:
   - Halaman arsip komprehensif seluruh sesi belajar yang pernah dilakukan.
   - Pencarian riwayat berdasarkan nama teman belajar, mata pelajaran, atau kata kunci materi.
   - Modal detail arsip (*Full Transcript Viewer*): Membuka kembali seluruh obrolan chat lama, catatan bersama, dokumen yang pernah dibagikan (dengan opsi download), tautan link, dan foto.
   - Fitur **"Unduh Rangkuman (.txt)"** untuk mengekspor laporan sesi belajar.

8. **Setting Page (`view-settings`)**:
   - Pengaturan mode tampilan (*Dark Mode* / *Light Mode*).
   - Pengaturan suara notifikasi audio.
   - Pengaturan privasi pertemuan (*Izinkan Ajakan Meetup Offline*).
   - Tombol **"Reset Data Demo"** untuk mengembalikan data awal simulasi kapan saja.

9. **Login & Logout Page (`view-login` & Modal Logout)**:
   - Halaman autentikasi modern dengan input email/username dan kata sandi.
   - **1-Click Quick Demo Account Switcher**: Tombol cepat untuk login langsung sebagai berbagai persona mahasiswa:
     - **Aqil** (Teknik Informatika - UI)
     - **Sarah** (Sistem Informasi - UI)
     - **Dimas** (Teknik Komputer - ITB)
   - Dialog konfirmasi logout aman dari navbar atau dropdown menu.

---

## 💻 Cara Menjalankan Website

Aplikasi dapat dijalankan dengan **sangat mudah** melalui beberapa pilihan:

### Opsi 1: Klik Dua Kali `start.bat` (Paling Praktis untuk Windows)
1. Buka folder proyek `c:\Users\inkub\OneDrive\Desktop\tugas aqil`.
2. Klik dua kali file **`start.bat`**.
3. Browser default akan otomatis terbuka menampilkan aplikasi di alamat `http://localhost:3000`.

### Opsi 2: Buka Langsung `index.html` di Browser
1. Buka file **`index.html`** langsung dengan mengklik dua kali atau klik kanan -> *Open with Google Chrome / Microsoft Edge / Firefox*.
2. Seluruh fungsionalitas (SPA routing, pencarian match, pop-up request, diskusi chat, catatan, audio ambience, dan history arsip) berjalan 100% lancar karena menggunakan LocalStorage & Client-side Architecture.

### Opsi 3: Menjalankan Local Server via Terminal
Jalankan perintah berikut di PowerShell atau Command Prompt pada folder proyek:
```powershell
node server.js
```
Lalu buka browser di `http://localhost:3000`.

---

## 🛠️ Teknologi yang Digunakan
- **HTML5 Semantic & Responsive Architecture**
- **Tailwind CSS v3 (CDN)** + Custom CSS Design System
- **Vanilla JavaScript (ES6+)**:
  - `store.js`: Reactive state management & LocalStorage persistence
  - `matchmaking.js`: Compatibility score algorithm & criteria filtering
  - `discussion.js`: Collaborative room controller, Pomodoro, and Web Audio ambience generator
  - `mockData.js`: Realistic initial mock dataset (students, requests, sessions, badges)
  - `app.js`: SPA router, page views, and interactive modals
- **Web Audio API**: Menghasilkan suara ambience soft-rain dan nada notifikasi secara sintetis tanpa memerlukan asset mp3 eksternal.
- **Node.js Built-in HTTP Server (`server.js`)**: Server lokal tanpa ketergantungan paket npm pihak ketiga (*zero external dependencies*).

---

## 👨‍💻 Info Pengembang & Tugas
- **Nama Aplikasi**: Study Buddy
- **Target Pengguna**: Siswa dan Mahasiswa yang mencari teman belajar terpercaya
- **Folder Proyek**: `c:\Users\inkub\OneDrive\Desktop\tugas aqil`
