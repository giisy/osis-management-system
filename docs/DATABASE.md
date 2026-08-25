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
| agendaDibuat | Agenda[] | Relasi balik: agenda yang dibuat user |
| pengumumanDibuat | Pengumuman[] | Relasi balik: pengumuman yang dibuat user |
| absensi | Absensi[] | Relasi balik: riwayat absensi user |
| transaksiDibuat | Transaksi[] | Relasi balik: transaksi kas yang dicatat user |
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

## Agenda
| Field         | Type      | Keterangan                                          |
|---------------|-----------|------------------------------------------------------|
| id            | String    | UUID, primary key                                    |
| judul         | String    | Judul kegiatan                                       |
| deskripsi     | String?   | Deskripsi kegiatan (opsional)                        |
| lokasi        | String?   | Tempat kegiatan (opsional, bisa kosong jika online) |
| waktuMulai    | DateTime  | Tanggal + jam mulai (ISO 8601), wajib                |
| waktuSelesai  | DateTime? | Tanggal + jam selesai (opsional, harus > waktuMulai) |
| createdBy     | String    | FK ke User (pembuat agenda)                          |
| absensi       | Absensi[] | Relasi balik: daftar absensi kegiatan                |
| createdAt     | DateTime  | Auto                                                 |
| updatedAt     | DateTime  | Auto                                                 |

## Pengumuman
| Field     | Type     | Keterangan                          |
|-----------|----------|--------------------------------------|
| id        | String   | UUID, primary key                    |
| judul     | String   | Judul pengumuman (max 200 karakter)  |
| isi       | String   | Isi pengumuman (max 5000 karakter)   |
| createdBy | String   | FK ke User (pembuat pengumuman)      |
| createdAt | DateTime | Auto                                  |
| updatedAt | DateTime | Auto                                  |

## Absensi
| Field        | Type          | Keterangan                                           |
|--------------|---------------|------------------------------------------------------|
| id           | String        | UUID, primary key                                    |
| agendaId     | String        | FK ke Agenda (kegiatan yang diabsen)                 |
| userId       | String        | FK ke User (yang melakukan absensi)                  |
| status       | Enum          | HADIR, IZIN, ALFA (default HADIR)                    |
| waktuCheckIn | DateTime      | Waktu check-in / record dibuat (default now)         |
| createdAt    | DateTime      | Auto                                                 |
| updatedAt    | DateTime      | Auto                                                 |
| *(unique)*   | —             | `(agendaId, userId)` — cegah double check-in         |

## Transaksi
| Field      | Type     | Keterangan                                        |
|------------|----------|---------------------------------------------------|
| id         | String   | UUID, primary key                                 |
| jenis      | Enum     | PEMASUKAN, PENGELUARAN                            |
| jumlah     | Int      | Rupiah bulat (tanpa sen), selalu positif          |
| keterangan | String   | Deskripsi transaksi (max 200 karakter)            |
| tanggal    | DateTime | Tanggal transaksi (bukan tanggal mencatat)        |
| createdBy  | String   | FK ke User (pencatat transaksi)                   |
| createdAt  | DateTime | Auto                                              |
| updatedAt  | DateTime | Auto                                              |

## Catatan Relasi
### Sprint 9 — Kas (Transaksi)
Relasi one-to-many: satu `User` bisa mencatat banyak `Transaksi` (lewat FK `Transaksi.createdBy`, diisi otomatis dari token). Referential action: `onDelete: Restrict` — user yang masih memiliki catatan transaksi tidak bisa dihapus, konsisten dengan Agenda/Pengumuman/Absensi. `jumlah` disimpan sebagai `Int` rupiah bulat (bukan Float/Decimal): rupiah tidak memakai sen dalam praktik dan integer menghindari seluruh masalah pembulatan float. Perubahan skema di-apply lewat `prisma db push`, konsisten dengan Sprint 4-8.

### Sprint 8 — Absensi
Relasi many-to-one ke `Agenda` dan `User`: satu agenda punya banyak record absensi, satu user bisa punya absensi di banyak agenda. Unique constraint gabungan `(agendaId, userId)` di level database mencegah double check-in (controller menangkap error `P2002` → `409`). Referential action berbeda per relasi: `Cascade` untuk `Agenda` (absensi adalah data turunan — ikut terhapus saat agenda dihapus) dan `Restrict` untuk `User` (riwayat kehadiran ikut menjaga user tidak bisa dihapus). Perubahan skema di-apply lewat `prisma db push`, konsisten dengan Sprint 4-7.

### Sprint 7 — Pengumuman
Relasi one-to-many: satu `User` bisa membuat banyak `Pengumuman` (lewat FK `Pengumuman.createdBy`, diisi otomatis dari token). Referential action: `onDelete: Restrict`, konsisten dengan pola Agenda. Perubahan skema di-apply lewat `prisma db push`.

### Sprint 5 — Divisi
Relasi one-to-many: satu `User` maksimal tergabung dalam satu `Divisi` (lewat FK `User.divisiId`), satu `Divisi` boleh memiliki banyak `User`. Referential action di database: `onDelete: Restrict` — `Divisi` yang masih memiliki anggota tidak bisa dihapus (controller juga menolak lebih dulu dengan pesan jumlah anggota). Perubahan skema di-apply lewat `prisma db push` (tanpa migration file), konsisten dengan Sprint 4.

### Sprint 6 — Agenda
Relasi one-to-many: satu `User` bisa membuat banyak `Agenda` (lewat FK `Agenda.createdBy` yang diisi otomatis dari token saat create, tidak dari body). Referential action: `onDelete: Restrict` — `User` yang masih memiliki agenda tidak bisa dihapus, menjaga jejak pembuat agenda. Waktu disimpan sebagai satu `DateTime` per titik (bukan tanggal + jam terpisah); `waktuSelesai` opsional untuk kegiatan tanpa durasi jelas. Perubahan skema di-apply lewat `prisma db push`, konsisten dengan Sprint 4-5.

## Catatan Agregat (Sprint 3 — Dashboard)
Statistik dashboard (`GET /api/dashboard/stats`) adalah **query turunan** dari tabel `User` — tidak ada tabel/model baru yang ditambahkan. Field `anggotaPerRole`, `anggotaBaruBulanIni`, `anggotaTerbaru`, dan `pertumbuhanAnggota` dihitung saat runtime lewat agregasi Prisma (`count`, `groupBy`, `findMany` + filter tanggal).