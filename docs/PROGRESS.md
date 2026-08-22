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