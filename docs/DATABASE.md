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
| peminjaman | Peminjaman[] | Relasi balik: peminjaman oleh user |
| votingDibuat | VotingSession[] | Relasi balik: sesi voting yang dibuat user |
| suara | Suara[] | Relasi balik: suara yang diberikan user |
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

## Barang
| Field     | Type     | Keterangan                                        |
|-----------|----------|---------------------------------------------------|
| id        | String   | UUID, primary key                                 |
| nama      | String   | Nama barang, Unique                               |
| deskripsi | String?  | Deskripsi barang (opsional)                       |
| jumlah    | Int      | Jumlah total unit yang dimiliki                   |
| kondisi   | Enum     | BAIK, RUSAK_RINGAN, RUSAK_BERAT (default BAIK)    |
| createdAt | DateTime | Auto                                              |
| updatedAt | DateTime | Auto                                              |

## Peminjaman
| Field          | Type       | Keterangan                                        |
|----------------|------------|---------------------------------------------------|
| id             | String     | UUID, primary key                                 |
| barangId       | String     | FK ke Barang (barang yang dipinjam)               |
| userId         | String     | FK ke User (peminjam)                             |
| jumlah         | Int        | Jumlah unit yang dipinjam (selalu positif)        |
| keperluan      | String?    | Keperluan peminjaman (opsional)                   |
| tanggalPinjam  | DateTime   | Tanggal pinjam                                    |
| tanggalKembali | DateTime?  | `null` = belum kembali, diisi server saat return  |
| status         | Enum       | DIPINJAM, DIKEMBALIKAN (default DIPINJAM)         |
| createdAt      | DateTime   | Auto                                              |
| updatedAt      | DateTime   | Auto                                              |

## VotingSession
| Field      | Type     | Keterangan                                       |
|------------|----------|--------------------------------------------------|
| id         | String   | UUID, primary key                                |
| judul      | String   | Judul sesi voting                                |
| deskripsi  | String?  | Deskripsi (opsional)                             |
| status     | Enum     | TERBUKA, DITUTUP (default TERBUKA)               |
| ditutupPada| DateTime?| Diisi server saat ditutup, null = masih terbuka  |
| createdBy  | String   | FK ke User (pembuat sesi)                        |
| createdAt  | DateTime | Auto                                             |
| updatedAt  | DateTime | Auto                                             |

## Pilihan
| Field     | Type     | Keterangan                              |
|-----------|----------|------------------------------------------|
| id        | String   | UUID, primary key                        |
| sessionId | String   | FK ke VotingSession (Cascade)            |
| teks      | String   | Teks pilihan (max 100 karakter)          |
| urutan    | Int      | Urutan tampil (diisi dari indeks array)  |
| createdAt | DateTime | Auto                                     |
| updatedAt | DateTime | Auto                                     |

## Suara
| Field     | Type     | Keterangan                                          |
|-----------|----------|------------------------------------------------------|
| id        | String   | UUID, primary key                                    |
| sessionId | String   | FK ke VotingSession (Cascade)                        |
| userId    | String   | FK ke User (pemberi suara, Restrict)                 |
| pilihanId | String   | FK ke Pilihan (Cascade)                              |
| createdAt | DateTime | Auto                                                 |
| *(unique)*| —        | `(sessionId, userId)` — 1 user 1 suara per sesi      |

## Catatan Relasi
### Sprint 12 — Security Hardening
**Tidak ada perubahan skema** — seluruh perbaikan hasil audit keamanan berada di level aplikasi: rate limiting endpoint auth (`express-rate-limit`), pembatasan assignment role `SUPER_ADMIN` (validasi controller), stripping field PII pada `GET /api/divisi/:id` untuk role non-privilege, dan global error handler JSON. `prisma db push` tidak diperlukan; `schema.prisma` dan database tidak tersentuh.

### Sprint 11 — Voting
Tiga model berjenjang: `VotingSession` → `Pilihan` → `Suara` (semua turunannya `Cascade`, mengikuti pola Absensi: data turunan ikut terhapus bersama induk), plus `Suara.userId` → `User` dengan `Restrict`. Unique gabungan `(sessionId, userId)` menegakkan 1 orang 1 suara per sesi di level database (controller menangkap `P2002` → `409`, pola sama dengan double check-in). `Suara` menyimpan relasi user demi integritas anti-dobel, tetapi **tidak pernah diekspos** oleh API mana pun — hasil hanya berupa agregat jumlah per pilihan, dan itu pun hanya setelah status `DITUTUP`. Perubahan skema di-apply lewat `prisma db push`, konsisten dengan Sprint 4-10.

### Sprint 10 — Inventaris
Dua relasi di `Peminjaman`: many-to-one ke `Barang` (`onDelete: Cascade` — riwayat peminjaman adalah data turunan barang, ikut terhapus saat barang dihapus; controller tetap menolak `409` jika masih ada peminjaman aktif) dan ke `User` (`onDelete: Restrict`, konsisten pola lain). `tanggalKembali` tidak pernah diterima dari body — hanya diisi server oleh endpoint kembalikan, menjamin `tanggalKembali > tanggalPinjam`. Cek stok (`jumlah − Σ peminjaman aktif`) berjalan di level aplikasi dalam `prisma.$transaction` (bukan constraint DB): cukup akurat untuk skala OSIS tanpa kompleksitas trigger. Perubahan skema di-apply lewat `prisma db push`, konsisten dengan Sprint 4-9.

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