# Study Buddy

Web untuk mencari teman belajar mahasiswa. Backend Node.js (Express) + database SQLite + chat real-time (WebSocket).

## Menjalankan di komputer sendiri

Butuh Node.js 18 atau lebih baru (https://nodejs.org).

```bash
npm install
npm start
```

Buka http://localhost:3000. Untuk mencoba match, daftar dua akun (email harus berakhiran `.ac.id` atau `.edu`, misalnya `ani@kampus.ac.id`). Buka satu akun di jendela biasa dan satu lagi di jendela incognito atau browser lain, karena sesi login disimpan di cookie.

## Struktur

- `server.js`: seluruh backend (API, database, WebSocket)
- `public/index.html`: antarmuka (satu berkas, tanpa build step)
- `studybuddy.db`: database, dibuat otomatis saat pertama jalan

## Variabel lingkungan

| Nama | Fungsi | Default |
|---|---|---|
| `PORT` | port server | 3000 |
| `DB_PATH` | lokasi berkas database | `./studybuddy.db` |
| `NODE_ENV` | isi `production` saat online (cookie jadi `Secure`) | kosong |

## Deploy online (contoh: Render)

1. Unggah folder ini ke repositori GitHub.
2. Di Render, buat **Web Service** dari repositori itu. Build command: `npm install`. Start command: `npm start`.
3. Tambahkan environment variable `NODE_ENV=production`.
4. **Penting:** tambahkan Persistent Disk (misalnya mount di `/data`) lalu set `DB_PATH=/data/studybuddy.db`. Tanpa disk, database ikut terhapus setiap kali layanan restart atau deploy ulang. Persistent disk di Render berbayar; Railway (Volume) dan Fly.io (Volume) juga bisa.
5. Buka alamat `https://nama-layanan.onrender.com`.

Layanan harus berjalan sebagai satu instance, karena notifikasi real-time disimpan di memori proses.

## Aturan izin simpan (dicek di server)

- Pengirim memilih izin untuk setiap berkas dan tautan sebelum terkirim. Default: tidak diizinkan.
- `POST /api/save` menolak (403) item yang tidak diizinkan, dan pengirim tidak bisa menyimpan item miliknya sendiri.
- Arsip ada di tabel `archive`, terpisah dari `tmp_msgs` dan `tmp_notes`. Saat diskusi berakhir, hanya tabel sementara yang dikosongkan.
- Unduhan arsip hanya terjadi lewat tombol Unduh.

Catatan: "Tidak diizinkan" memblokir fitur simpan di aplikasi. Penerima tetap bisa melihat item di ruang diskusi, jadi aplikasi tidak bisa mencegah tangkapan layar atau alat pengembang browser.

## Belum ada (perlu pekerjaan lanjutan)

- Panggilan suara/video dan berbagi lokasi: masih tombol placeholder. Butuh layanan WebRTC (mis. LiveKit, Daily, atau Twilio) dan TURN server.
- Lupa kata sandi: masih simulasi. Butuh layanan email (mis. Resend, SendGrid) untuk mengirim tautan reset.
- Verifikasi email kampus: saat ini hanya cek format `.ac.id` / `.edu`, belum kirim email konfirmasi.
- Foto profil, filter kelas/ketersediaan di Cari Buddy, pengikut/pengikuti, dan rating nyata.
- Penyimpanan berkas besar: berkas disimpan di database (maks. 5 MB per berkas). Untuk skala besar, pindahkan ke object storage (S3/R2).
- Notifikasi saat browser tertutup (push/email).
