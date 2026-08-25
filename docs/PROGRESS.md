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