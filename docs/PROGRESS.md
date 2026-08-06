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

## Sprint 4 — CRUD Anggota (Berikutnya)
- Belum dimulai