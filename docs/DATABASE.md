# Database Schema

## User
| Field        | Type     | Keterangan                          |
|--------------|----------|--------------------------------------|
| id           | String   | UUID, primary key                    |
| name         | String   |                                       |
| email        | String   | Unique                               |
| password     | String   | Hasil hash bcrypt (bukan plain text)|
| role         | Enum     | SUPER_ADMIN, ADMIN, KETUA, ANGGOTA  |
| nis          | String?  | Nomor Induk Siswa, Unique (opsional) |
| kelas        | String?  | Kelas anggota, mis. "XII IPA 1" (opsional) |
| jenisKelamin | String?  | "L" atau "P" (opsional)              |
| noTelepon    | String?  | Nomor telepon (opsional)             |
| alamat       | String?  | Alamat (opsional)                    |
| divisiId     | String?  | FK ke Divisi (opsional)              |
| createdAt    | DateTime | Auto                                  |
| updatedAt    | DateTime | Auto                                  |

## Divisi
| Field     | Type     | Keterangan                 |
|-----------|----------|-----------------------------|
| id        | String   | UUID, primary key           |
| nama      | String   | Nama divisi, Unique         |
| deskripsi | String?  | Deskripsi divisi (opsional) |
| createdAt | DateTime | Auto                        |
| updatedAt | DateTime | Auto                        |

## Catatan Relasi (Sprint 5 — Divisi)
Relasi one-to-many: satu `User` maksimal tergabung dalam satu `Divisi` (lewat FK `User.divisiId`), satu `Divisi` boleh memiliki banyak `User`. Referential action di database: `onDelete: Restrict` — `Divisi` yang masih memiliki anggota tidak bisa dihapus (controller juga menolak lebih dulu dengan pesan jumlah anggota). Perubahan skema di-apply lewat `prisma db push` (tanpa migration file), konsisten dengan Sprint 4.

## Catatan Agregat (Sprint 3 — Dashboard)
Statistik dashboard (`GET /api/dashboard/stats`) adalah **query turunan** dari tabel `User` — tidak ada tabel/model baru yang ditambahkan. Field `anggotaPerRole`, `anggotaBaruBulanIni`, `anggotaTerbaru`, dan `pertumbuhanAnggota` dihitung saat runtime lewat agregasi Prisma (`count`, `groupBy`, `findMany` + filter tanggal).