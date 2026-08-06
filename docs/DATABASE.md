# Database Schema

## User
| Field     | Type     | Keterangan                          |
|-----------|----------|--------------------------------------|
| id        | String   | UUID, primary key                    |
| name      | String   |                                       |
| email     | String   | Unique                               |
| password  | String   | Hasil hash bcrypt (bukan plain text)|
| role      | Enum     | SUPER_ADMIN, ADMIN, KETUA, ANGGOTA  |
| createdAt | DateTime | Auto                                  |
| updatedAt | DateTime | Auto                                  |

## Catatan Agregat (Sprint 3 — Dashboard)
Statistik dashboard (`GET /api/dashboard/stats`) adalah **query turunan** dari tabel `User` — tidak ada tabel/model baru yang ditambahkan. Field `anggotaPerRole`, `anggotaBaruBulanIni`, `anggotaTerbaru`, dan `pertumbuhanAnggota` dihitung saat runtime lewat agregasi Prisma (`count`, `groupBy`, `findMany` + filter tanggal).