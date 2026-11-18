# Study Buddy

Study Buddy adalah aplikasi web untuk membantu mahasiswa menemukan teman belajar berdasarkan kesamaan program studi, semester, mata kuliah, kelas, dan ketersediaan waktu. Aplikasi ini menggunakan Node.js (Express), SQLite sebagai database, dan WebSocket untuk komunikasi real-time.

## 1. Persiapan

Sebelum menjalankan aplikasi, pastikan sudah tersedia:

- Node.js versi LTS (18 atau lebih baru): https://nodejs.org
- Browser (Chrome atau browser lainnya).
- Folder project `study-buddy-app`.

### Instalasi

1. Ekstrak file project jika masih berbentuk ZIP.
2. Buka folder `study-buddy-app` melalui File Explorer.
3. Pastikan folder tersebut berisi `server.js` dan `package.json`.
4. Klik kolom alamat folder, ketik `powershell`, kemudian tekan Enter.
5. Jalankan perintah berikut untuk menginstal dependencies:

```bash
npm.cmd install
```

Tunggu hingga proses instalasi selesai. Peringatan `deprecated` atau informasi pembaruan npm dapat diabaikan selama tidak terjadi error.

**Catatan:** Gunakan `npm.cmd`, bukan `npm`, untuk menghindari masalah pemblokiran eksekusi script pada Windows PowerShell.

## 2. Menjalankan Aplikasi

Setiap kali ingin menggunakan aplikasi:

1. Buka PowerShell dari folder project.
2. Jalankan perintah:

```bash
npm.cmd start
```

3. Tunggu hingga server menampilkan pesan:

```text
Study Buddy berjalan di http://localhost:3000
```

4. Buka browser dan akses:

http://localhost:3000

**Penting:** Jangan tutup jendela PowerShell selama aplikasi digunakan karena jendela tersebut menjalankan server.

## 3. Panduan Demo Aplikasi

Untuk mencoba fitur matching dan komunikasi real-time, siapkan dua akun pengguna.

### Persiapan Dua Pengguna

- Pengguna A: buka aplikasi melalui jendela browser biasa.
- Pengguna B: buka aplikasi melalui jendela Incognito atau browser berbeda.

Kedua pengguna harus mengakses alamat aplikasi yang sama.

### Alur Demonstrasi

| Langkah | Pengguna A | Pengguna B |
|---|---|---|
| 1 | Daftar menggunakan nama, email kampus, dan kata sandi | Daftar menggunakan akun berbeda |
| 2 | Lengkapi profil (prodi, semester, bio, mata kuliah, jadwal, dan mode belajar) | Lengkapi profil dengan beberapa kesamaan data |
| 3 | Buka Cari Buddy dan kirim permintaan kepada B | Menerima notifikasi permintaan masuk |
| 4 | Menunggu konfirmasi | Buka Notifikasi dan klik Terima |
| 5 | Buka menu Diskusi dan kirim pesan | Membalas pesan secara real-time |
| 6 | Kirim berkas dan tentukan izin penyimpanan | Melihat berkas dan tombol simpan jika diizinkan |
| 7 | Kirim tautan dengan pengaturan izin | Mencoba menyimpan tautan sesuai izin |
| 8 | Klik Akhiri Diskusi dan konfirmasi | Menerima pemberitahuan diskusi berakhir |
| 9 | Buka Riwayat untuk melihat sesi | Buka Arsip Berkas untuk melihat item yang disimpan |

### Hal yang Perlu Ditunjukkan Saat Demo

- Proses pencarian dan pencocokan teman belajar.
- Sistem permintaan dan penerimaan matching.
- Chat real-time tanpa perlu memuat ulang halaman.
- Pengaturan izin penyimpanan berkas dan tautan oleh pengirim.
- Penerima hanya dapat menyimpan item yang diizinkan.
- Chat dan berkas sementara dihapus setelah diskusi berakhir, sedangkan arsip yang sudah disimpan tetap tersedia.
- Unduhan arsip hanya dilakukan ketika penerima menekan tombol Unduh.

**Tips navigasi:** Klik foto profil atau nama pengguna di bagian kiri bawah sidebar untuk membuka halaman profil. Tombol Keluar tersedia melalui menu Pengaturan.

## 4. Pengaturan Izin Penyimpanan

Sistem izin penyimpanan diterapkan di sisi server untuk mengatur akses penyimpanan berkas dan tautan.

Ketentuannya:

- Pengirim menentukan izin penyimpanan untuk setiap berkas dan tautan sebelum dikirim.
- Pengaturan default adalah tidak diizinkan.
- Endpoint `POST /api/save` menolak permintaan penyimpanan tanpa izin dengan respons HTTP 403.
- Pengirim tidak dapat menyimpan item miliknya sendiri.
- Arsip disimpan pada tabel `archive`, terpisah dari tabel sementara `tmp_msgs` dan `tmp_notes`.
- Ketika diskusi berakhir, data sementara dibersihkan, sedangkan arsip tetap dipertahankan.
- Unduhan arsip hanya dilakukan melalui tombol Unduh.

**Catatan keamanan:** Pengaturan tidak diizinkan memblokir fitur penyimpanan melalui aplikasi. Namun, penerima tetap dapat melihat item yang dibagikan sehingga aplikasi tidak dapat sepenuhnya mencegah tangkapan layar atau penggunaan alat pengembang browser.

## 5. Demo dengan Teman dalam Satu Jaringan Wi-Fi

Aplikasi juga dapat dicoba bersama teman yang menggunakan jaringan Wi-Fi yang sama.

1. Buka PowerShell baru.
2. Jalankan perintah:

```bash
ipconfig
```

3. Cari bagian `IPv4 Address`, misalnya `192.168.1.5`.
4. Pastikan server Study Buddy masih berjalan.
5. Teman dapat membuka browser dan mengakses:

```text
http://192.168.1.5:3000
```

Ganti alamat IP dengan IPv4 Address komputer yang menjalankan server.

6. Jika Windows menampilkan peringatan Firewall, pilih **Allow access** untuk jaringan privat.

## 6. Struktur Project

Berikut struktur utama aplikasi:

| File | Fungsi |
|---|---|
| `server.js` | Backend aplikasi, API, database, dan WebSocket |
| `public/index.html` | Antarmuka pengguna (frontend) |
| `package.json` | Informasi project dan dependencies |
| `studybuddy.db` | Database SQLite yang dibuat otomatis saat aplikasi pertama kali dijalankan |

## 7. Variabel Lingkungan

Aplikasi mendukung beberapa variabel lingkungan berikut:

| Variabel | Fungsi | Default |
|---|---|---|
| `PORT` | Menentukan port server | `3000` |
| `DB_PATH` | Menentukan lokasi database | `./studybuddy.db` |
| `NODE_ENV` | Menentukan lingkungan aplikasi | Kosong |

Pada lingkungan production, `NODE_ENV` perlu diatur menjadi `production` agar cookie menggunakan atribut `Secure`.

## 8. Deployment Online

Aplikasi dapat di-deploy agar bisa diakses melalui internet tanpa harus menjalankan server secara manual di komputer sendiri.

Contoh deployment menggunakan Render:

1. Unggah seluruh folder project ke repository GitHub.
2. Buka Render dan buat Web Service baru dari repository tersebut.
3. Gunakan konfigurasi berikut:

   - Build Command: `npm install`
   - Start Command: `npm start`

4. Tambahkan environment variable:

```text
NODE_ENV=production
```

5. Konfigurasikan Persistent Disk, misalnya dengan mount path `/data`, kemudian tambahkan:

```text
DB_PATH=/data/studybuddy.db
```

6. Setelah deployment berhasil, buka URL aplikasi yang diberikan Render.

**Penting:**
- Persistent Disk diperlukan agar database tidak hilang ketika layanan mengalami restart atau deployment ulang. Fitur ini berbayar di Render.
- Railway (Volume) dan Fly.io (Volume) juga menyediakan alternatif penyimpanan persisten.
- Aplikasi harus dijalankan sebagai satu instance karena notifikasi real-time masih disimpan dalam memori proses.
- Perintah deployment menggunakan `npm` karena dijalankan pada lingkungan hosting, bukan Windows PowerShell.

## 9. Menghentikan dan Mengatur Ulang Aplikasi

### Menghentikan Server

Tekan `Ctrl + C` pada jendela PowerShell yang menjalankan server.

### Mengosongkan Database

Jika ingin memulai demo dari kondisi awal:

1. Hentikan server menggunakan `Ctrl + C`.
2. Hapus file `studybuddy.db` di folder project.
3. Jika tersedia, hapus juga file `studybuddy.db-wal` dan `studybuddy.db-shm`.
4. Jalankan kembali aplikasi:

```bash
npm.cmd start
```

Database kosong akan dibuat secara otomatis.

## 10. Masalah Umum (Troubleshooting)

| Masalah | Penyebab dan Solusi |
|---|---|
| `running scripts is disabled on this system` | Gunakan `npm.cmd` sebagai pengganti `npm`. |
| `EADDRINUSE` | Port 3000 sedang digunakan. Gunakan port lain melalui `$env:PORT=3001` lalu jalankan `npm.cmd start`. |
| `node is not recognized` | Node.js belum terpasang atau belum terdeteksi sistem. Instal Node.js dan buka ulang PowerShell. |
| Error `better-sqlite3` atau `node-gyp` saat instalasi | Pastikan menggunakan Node.js versi LTS, hapus folder `node_modules`, kemudian ulangi `npm.cmd install`. |
| Email ditolak saat pendaftaran | Gunakan email dengan akhiran `.ac.id` atau `.edu`. |
| Login dua akun saling menimpa | Gunakan jendela Incognito atau browser berbeda. |
| Teman tidak dapat membuka alamat IP | Pastikan menggunakan Wi-Fi yang sama, server masih berjalan, dan Firewall mengizinkan koneksi privat. |
| Fitur panggilan suara/video atau lokasi belum berfungsi | Fitur tersebut masih berupa placeholder dan belum diimplementasikan. |

## 11. Fitur yang Belum Tersedia

Beberapa fitur masih membutuhkan pengembangan lebih lanjut:

- **Panggilan suara/video dan berbagi lokasi:** Masih berupa tombol placeholder. Membutuhkan integrasi layanan WebRTC seperti LiveKit, Daily, atau Twilio serta TURN server.
- **Lupa kata sandi:** Masih berupa simulasi. Membutuhkan layanan email seperti Resend atau SendGrid untuk mengirim tautan reset.
- **Verifikasi email kampus:** Saat ini hanya memeriksa format email `.ac.id` atau `.edu`, belum melakukan verifikasi melalui email.
- **Foto profil:** Belum tersedia secara penuh.
- **Filter kelas dan ketersediaan:** Membutuhkan pengembangan lanjutan pada fitur Cari Buddy.
- **Pengikut, pengikuti, dan rating:** Belum tersedia secara penuh.
- **Penyimpanan berkas skala besar:** Saat ini berkas disimpan di database dengan batas maksimal 5 MB per berkas. Untuk skala lebih besar, disarankan menggunakan object storage seperti S3 atau R2.
- **Notifikasi saat browser tertutup:** Push notification dan notifikasi email belum diimplementasikan.

---

**Study Buddy**  
Aplikasi pencarian teman belajar mahasiswa berbasis web.
