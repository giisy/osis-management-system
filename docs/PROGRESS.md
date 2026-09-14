# Progress

## Sprint 1 — Setup Project ✅ (Selesai)
- Setup monorepo (apps/frontend, apps/backend)
- Frontend: Vite + React + TypeScript + Tailwind CSS
- Backend: Express + TypeScript
- Database: Prisma + PostgreSQL (Supabase), model User

## Sprint 2 — Authentication ✅ (Selesai)
- Backend: endpoint register, login, JWT generation
- Backend: middleware authenticate & authorize (role-based)
- Backend: endpoint /me (contoh endpoint terproteksi)
- Backend: CORS setup untuk komunikasi dengan frontend
- Frontend: form Login (React Hook Form + Zod)
- Frontend: axios instance dengan interceptor JWT
- Frontend: TanStack Query setup
- Frontend: React Router + Protected Route
- Frontend: custom hook useLogin, penyimpanan token di localStorage

## Sprint 3 — Dashboard ✅ (Selesai)
- Backend: endpoint `GET /api/dashboard/stats` (terproteksi `authenticate`)
- Backend: statistik `totalAnggota`, `anggotaPerRole`, `anggotaBaruBulanIni`, `anggotaTerbaru` (5 terbaru), `pertumbuhanAnggota` (6 bulan terakhir)
- Backend: agregasi via Prisma (`count`, `groupBy`, `findMany`) — tanpa perubahan skema
- Dokumentasi: `API.md` & `DATABASE.md` diperbarui

## Sprint 4 — CRUD Anggota ✅ (Selesai)
- Database: tambah field profil User (`nis`, `kelas`, `jenisKelamin`, `noTelepon`, `alamat`)
- Backend: `GET /api/anggota` (list + paginasi) — role ADMIN, KETUA
- Backend: `GET /api/anggota/:id` (detail) — role ADMIN, KETUA
- Backend: `POST /api/anggota` (create) — role SUPER_ADMIN, ADMIN
- Backend: `PUT /api/anggota/:id` (update) — role SUPER_ADMIN, ADMIN
- Backend: `DELETE /api/anggota/:id` (delete) — role SUPER_ADMIN, ADMIN
- Backend: validasi Zod (`anggotaSchema.ts`), cek unique email & NIS, password di-hash
- Backend: semua endpoint pakai `authenticate` + `authorize`
- Dokumentasi: `API.md` & `DATABASE.md` diperbarui

## Sprint 5 — Divisi ✅ (Selesai)
- Database: model `Divisi` (`nama` unique, `deskripsi` opsional) + field `divisiId` (nullable) di `User`, relasi one-to-many, `onDelete: Restrict`
- Backend: `GET /api/divisi` (list + jumlah anggota) — semua role yang login (authenticate)
- Backend: `GET /api/divisi/:id` (detail + daftar anggota) — semua role yang login (authenticate)
- Backend: `POST /api/divisi` (create) — role SUPER_ADMIN, ADMIN
- Backend: `PUT /api/divisi/:id` (update) — role SUPER_ADMIN, ADMIN
- Backend: `DELETE /api/divisi/:id` (delete, tolak `409` jika masih ada anggota) — role SUPER_ADMIN, ADMIN
- Backend: assign/pindah divisi anggota via `POST/PUT /api/anggota` (field `divisiId`, `null` = keluar divisi)
- Backend: validasi Zod (`divisiSchema.ts`), cek unique nama divisi, cek divisi exists saat assign anggota
- Dokumentasi: `API.md` & `DATABASE.md` diperbarui

## Sprint 6 — Agenda ✅ (Selesai)
- Database: model `Agenda` (`judul`, `deskripsi`/`lokasi` opsional, `waktuMulai` wajib, `waktuSelesai` opsional, `createdBy` FK ke User, `onDelete: Restrict`) — apply via `prisma db push`
- Backend: `GET /api/agenda` (list semua, urut `waktuMulai` asc) — semua role yang login (authenticate)
- Backend: `GET /api/agenda/upcoming?limit=5` (agenda terdekat untuk card dashboard, kegiatan yang sedang berjalan tetap masuk) — semua role yang login
- Backend: `GET /api/agenda/:id` (detail) — semua role yang login
- Backend: `POST /api/agenda` (create, `createdBy` otomatis dari token) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `PUT /api/agenda/:id` (update, validasi `waktuSelesai > waktuMulai` termasuk terhadap nilai lama) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `DELETE /api/agenda/:id` (delete) — role SUPER_ADMIN, ADMIN
- Backend: validasi Zod (`agendaSchema.ts`) — tanggal ISO via `z.coerce.date()`, tanggal masa lalu dibolehkan (arsip kegiatan)
- Dokumentasi: `API.md`, `DATABASE.md` & `PROGRESS.md` diperbarui

## Sprint 7 — Pengumuman ✅ (Selesai)
- Database: model `Pengumuman` (`judul`, `isi`, `createdBy` FK ke User, `onDelete: Restrict`) — apply via `prisma db push`
- Backend: `GET /api/pengumuman` (list, urut `createdAt` desc) — semua role yang login
- Backend: `GET /api/pengumuman/:id` (detail) — semua role yang login
- Backend: `POST /api/pengumuman` (create, `createdBy` otomatis dari token) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `PUT /api/pengumuman/:id` (update) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `DELETE /api/pengumuman/:id` (delete) — role SUPER_ADMIN, ADMIN
- Backend: validasi Zod (`pengumumanSchema.ts`)
- Dokumentasi: `API.md` & `DATABASE.md` diperbarui

## Sprint 8 — Absensi ✅ (Selesai)
- Database: model `Absensi` (`agendaId` FK ke Agenda `onDelete: Cascade`, `userId` FK ke User `onDelete: Restrict`, `status` enum HADIR/IZIN/ALFA default HADIR, `waktuCheckIn`) + unique gabungan `(agendaId, userId)` — apply via `prisma db push`
- Backend: `POST /api/absensi/:agendaId/checkin` (check-in diri sendiri, status HADIR, `userId` dari token, hanya bisa setelah `waktuMulai`, double check-in ditolak `409`) — semua role yang login
- Backend: `GET /api/absensi/saya` (riwayat kehadiran sendiri, urut `agenda.waktuMulai` desc) — semua role yang login
- Backend: `GET /api/absensi/agenda/:agendaId` (rekap 1 agenda: daftar absensi + hitungan per status via `groupBy`) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `POST /api/absensi/:agendaId/tandai` (tandai/koreksi manual via upsert, tanpa batasan waktu) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: validasi Zod (`absensiSchema.ts`) — `userId` UUID, `status` enum
- Dokumentasi: `API.md`, `DATABASE.md` & `PROGRESS.md` diperbarui

## Sprint 9 — Kas ✅ (Selesai)
- Database: model `Transaksi` + enum `JenisTransaksi` (PEMASUKAN/PENGELUARAN), `jumlah` `Int` rupiah bulat (hindari pembulatan float), `keterangan`, `tanggal`, `createdBy` FK ke User `onDelete: Restrict` — apply via `prisma db push`
- Backend: `GET /api/kas` (list paginasi + filter `jenis`, urut `tanggal` desc) — semua role yang login
- Backend: `GET /api/kas/laporan` (total pemasukan/pengeluaran via `aggregate _sum`, saldo, breakdown `perBulan` 12 bulan terakhir untuk grafik) — semua role yang login
- Backend: `GET /api/kas/:id` (detail) — semua role yang login
- Backend: `POST /api/kas` (create, `createdBy` otomatis dari token) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `PUT /api/kas/:id` (update) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `DELETE /api/kas/:id` (delete) — role SUPER_ADMIN, ADMIN
- Backend: validasi Zod (`kasSchema.ts`) — `jumlah` int positif max 2 miliar, `jenis` enum, `keterangan` 3-200 karakter, tanggal ISO (masa lalu boleh)
- Dokumentasi: `API.md`, `DATABASE.md` & `PROGRESS.md` diperbarui

## Sprint 10 — Inventaris ✅ (Selesai)
- Database: model `Barang` (`nama` unique, `jumlah`, `kondisi` enum BAIK/RUSAK_RINGAN/RUSAK_BERAT) + model `Peminjaman` (FK ke Barang `onDelete: Cascade` & User `onDelete: Restrict`, `jumlah`, `keperluan`, `tanggalPinjam`, `tanggalKembali` nullable, `status` enum DIPINJAM/DIKEMBALIKAN) — apply via `prisma db push`
- Backend: CRUD `Barang` di `/api/inventaris` — list dengan `jumlahDipinjam`/`stokTersedia`, detail + peminjaman aktif, create/update/delete role SUPER_ADMIN & ADMIN (delete ditolak `409` jika masih dipinjam)
- Backend: `POST /api/peminjaman` (catat peminjaman, `userId` dari token, override `userId` untuk S/A/K, cek stok dalam `$transaction`, barang RUSAK_BERAT ditolak, stok kurang → `409`) — semua role yang login
- Backend: `GET /api/peminjaman` (list aktif + riwayat, filter `status`) & `GET /api/peminjaman/:id` — semua role yang login
- Backend: `POST /api/peminjaman/:id/kembalikan` (status → DIKEMBALIKAN, `tanggalKembali` diisi server) — peminjam sendiri atau SUPER_ADMIN/ADMIN/KETUA
- Backend: validasi Zod (`inventarisSchema.ts`)
- Dokumentasi: `API.md`, `DATABASE.md` & `PROGRESS.md` diperbarui

## Sprint 11 — Voting ✅ (Selesai)
- Database: model `VotingSession` + `Pilihan` + `Suara`, enum `StatusVoting` (TERBUKA/DITUTUP), unique `(sessionId, userId)` cegah vote dobel di level DB — apply via `prisma db push`
- Backend: CRUD sesi voting di `/api/voting` — create dengan 2-10 pilihan (validasi Zod + tolak duplikat), update judul/deskripsi kapan pun & replace pilihan hanya jika belum ada suara (`409`), delete role SUPER_ADMIN & ADMIN
- Backend: `POST /api/voting/:id/tutup` & `/buka` (kelola status sesi) — role SUPER_ADMIN, ADMIN, KETUA
- Backend: `POST /api/voting/:id/vote` (1 suara per user via unique constraint, cek sesi TERBUKA, cek pilihan milik sesi) — semua role yang login
- Backend: `GET /api/voting/:id/hasil` (jumlah per pilihan urut terbanyak, hanya saat DITUTUP) & `GET /api/voting` / `/:id` (detail dengan `sudahVoting` + totalSuara, rincian per pilihan hanya saat ditutup) — semua role yang login
- Keputusan desain: hasil terlihat hanya setelah ditutup (hindari efek bandwagon, turnout tetap terlihat); suara pseudonim di data (untuk anti-dobel) tapi anonim di API (tidak ada endpoint yang membocorkan pilihan per orang)
- Dokumentasi: `API.md`, `DATABASE.md` & `PROGRESS.md` diperbarui

## Sprint 12 — Security Hardening ✅ (Selesai)
- Audit keamanan menyeluruh backend (secrets & git history, authn/authz semua endpoint, validasi & injection, error handling, rate limiting, CORS, `npm audit`, password & data sensitif) — dilaporkan per severity sebelum eksekusi; hanya temuan HIGH yang diperbaiki sprint ini sesuai approval
- Backend: rate limiting auth via `express-rate-limit` (`rateLimit.ts`) — `POST /api/auth/login` maks 5 percobaan gagal/15 menit/IP (`skipSuccessfulRequests`), `POST /api/auth/register` maks 5 request/1 jam/IP; response `429` JSON format standar + header `RateLimit-*`
- Backend: `app.set('trust proxy', 1)` — wajib di balik proxy Vercel agar `req.ip` (kunci rate limit) terbaca dari `X-Forwarded-For`, bukan IP proxy yang sama untuk semua user
- Backend: guard privilege escalation di `anggotaController` — role `SUPER_ADMIN` hanya bisa diberikan oleh `SUPER_ADMIN` di `POST`/`PUT /api/anggota`; ADMIN yang mencoba → `403` (ADMIN tetap boleh assign ADMIN/KETUA/ANGGOTA)
- Backend: field PII anggota (`email`, `nis`, `jenisKelamin`, `noTelepon`, `alamat`) di `GET /api/divisi/:id` hanya dikirim ke SUPER_ADMIN/ADMIN/KETUA; role lain menerima daftar anggota tanpa field sensitif (setara gating `/api/anggota`)
- Backend: global error handler di `app.ts` — error tak terduka ditangkap Express 5 dan selalu di-return JSON `{success:false}` 500 generik saat `NODE_ENV=production`; detail error hanya ke log server via `console.error`; status 4xx milik body-parser (mis. JSON rusak → 400) tetap dipertahankan
- Verifikasi: `npm run build:local` bersih + smoke test runtime dengan database dummy (tidak menyentuh Supabase): login/register limiter benar menolak request ke-6 dengan 429, error terverifikasi kembali sebagai JSON (bukan HTML/stack)
- Dokumentasi: `API.md`, `DATABASE.md` & `PROGRESS.md` diperbarui

## Sprint 13 — Restrukturisasi Role 4 → 7 ✅ (Selesai)
- Database: enum `Role` 4 → 7 nilai (Sprint 13 = `SUPER_ADMIN, ADMIN, SEKRETARIS, BENDAHARA, KOORDINATOR_DIVISI, ANGGOTA, PEMBINA`; `KETUA` dihapus) — migrasi 3 fase dengan verifikasi tiap fase:
  - Fase A: `ADD VALUE` ×4 via `prisma db push` (additive, zero risk)
  - Fase B: data — KETUA → SUPER_ADMIN (0 baris, memang kosong) + promote ADMIN existing → SUPER_ADMIN (1 baris, mencegah deadlock hierarki H-2) via `prisma db execute`
  - Fase C: hapus `KETUA` via type rebuild `prisma db push --accept-data-loss` (Postgres tidak punya DROP VALUE; cast fail-safe terverifikasi)
- Backend: seluruh `authorize()` diperbarui sesuai matriks permission — anggota lihat (semua role kecuali ANGGOTA), agenda buat/edit (+SEKRETARIS, KOORDINATOR_DIVISI), pengumuman & voting buat/edit (+SEKRETARIS), absensi rekap (S/A/SEK/KOORD/PEMBINA, tanpa BENDAHARA), absensi tandai (S/A/SEK/KOORD, PEMBINA read-only), kas catat **BENDAHARA-only**, kas hapus **SUPER_ADMIN-only**
- Backend: perluasan guard H-2 — hanya SUPER_ADMIN boleh assign role SUPER_ADMIN **atau ADMIN**; role staf lain boleh oleh SUPER_ADMIN/ADMIN (create & update anggota)
- Backend: `peminjamanController` — override `userId` & kembalikan orang lain kini S/A saja (dulu S/A/KETUA); `divisiController` PII lihat semua role kecuali ANGGOTA
- Backend: enum role Zod `anggotaSchema.ts` disinkronkan (tanpa KETUA, +4 role baru)
- Keputusan ditunda ke sprint terpisah: scoping KOORDINATOR_DIVISI per-divisi, workflow approval PEMBINA, dan M-1 (authorize baca role fresh dari DB, bukan payload JWT — user yang di-promote wajib re-login; owner sudah re-login sebelum deploy)
- Verifikasi: grep nol `KETUA` di backend + `npm run build:local` bersih
- Frontend: role gating UI (permissions.ts, ProtectedRoute role-check, UnauthorizedPage) dikerjakan owner di commit terpisah (`2ca0bb8`)
- Dokumentasi: `API.md` (matriks permission lengkap + role baru per endpoint), `DATABASE.md` (enum baru + catatan migrasi), `PROGRESS.md`

## Sprint 14 — Penghapusan Fitur Voting ✅ (Selesai)
- Keputusan: fitur voting dihapus seluruhnya dari sistem (backend + database); data historis dibackup
- Pre-check (read-only): 2 VotingSession (keduanya DITUTUP), 6 Pilihan, 3 Suara di produksi; konfirmasi via `information_schema` bahwa tidak ada FK dari tabel lain ke cluster voting — aman di-drop
- Fase A: export seluruh data ke `backups/voting-export-2026-09-14.json` (folder baru, di-`.gitignore`, tidak ter-commit) — terverifikasi 2+6+3 record
- Fase B: hapus `votingRoutes.ts`, `votingController.ts`, `votingSchema.ts`; buang mount `/api/voting` dari `app.ts`; hapus model `VotingSession`/`Pilihan`/`Suara` + enum `StatusVoting` + 2 relasi balik User dari `schema.prisma`; `prisma generate` + `npm run build:local` bersih; grep nol referensi voting di backend
- Fase C (dieksekusi setelah deploy `ca67d40` terverifikasi live via GitHub commit status): `prisma db push --accept-data-loss` → `DROP TABLE` Suara/Pilihan/VotingSession + `DROP TYPE StatusVoting`. Verifikasi post-drop: tabel & enum voting hilang, 8 tabel lain utuh (Absensi, Agenda, Barang, Divisi, Peminjaman, Pengumuman, Transaksi, User), data user tidak tersentuh
- Urutan deploy Opsi 1 (zero-window): kode di-deploy dulu, baru drop tabel — mencegah kode live men-query tabel yang sudah hilang
- Frontend: pembersihan UI voting (3 pages, features/voting, routes, nav) dikerjakan owner
- Dokumentasi: `API.md` (section Voting & 3 baris matriks dihapus), `DATABASE.md` (3 model dihapus, entri Sprint 11 diganti catatan Sprint 14), `PROGRESS.md`