# API Endpoints

> **Format error tak terduga**: error yang tidak tertangani controller ditangkap global error handler — selalu JSON `{ "success": false, "message": "Terjadi kesalahan server" }` dengan status 500. Detail internal (stack trace, nama file, query) tidak pernah dikirim ke client saat `NODE_ENV=production`; detail lengkap hanya tercatat di log server (`console.error`).

## Authentication

> **Rate limiting**: endpoint publik auth dibatasi per IP — `POST /register` maksimal **5 request per 1 jam**, `POST /login` maksimal **5 percobaan gagal per 15 menit** (login sukses tidak dihitung). Melebihi batas → `429` dengan pesan JSON standar.

### POST /api/auth/register
Registrasi user baru.

**Body:**
```json
{
  "name": "string (min 3 karakter)",
  "email": "string (format email valid)",
  "password": "string (min 8 karakter)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `409` — Email sudah terdaftar
- `429` — Terlalu banyak permintaan registrasi (maks 5 per 1 jam per IP)

---

### POST /api/auth/login
Login user, menghasilkan JWT token.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "string (JWT, berlaku 7 hari)",
    "user": { "id": "...", "name": "...", "email": "...", "role": "..." }
  }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Email atau password salah
- `429` — Terlalu banyak percobaan login (maks 5 percobaan gagal per 15 menit per IP; login sukses tidak dihitung)

---

### GET /api/auth/me
Mengambil data user yang sedang login. **Butuh autentikasi.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response sukses (200):**
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "email": "...", "role": "..." }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

## Anggota (CRUD)

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List & Detail** (GET): butuh role `ADMIN` atau `KETUA`
> - **Create, Update, Delete** (POST/PUT/DELETE): butuh role `SUPER_ADMIN` atau `ADMIN`

### GET /api/anggota
List semua anggota (role `ANGGOTA`), dengan paginasi.

**Query params:**
| Param  | Default | Keterangan                     |
|--------|---------|-------------------------------|
| `page` | 1       | Nomor halaman (min 1)          |
| `limit`| 10      | Jumlah item per halaman (max 100) |

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "name": "...",
        "email": "...",
        "role": "ANGGOTA",
        "nis": "...",
        "kelas": "...",
        "jenisKelamin": "L",
        "noTelepon": "...",
        "alamat": "...",
        "divisi": { "id": "...", "nama": "..." },
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 35,
      "totalPages": 4
    }
  }
}
```

**Response gagal:**
- `400` — Validasi gagal (page/limit tidak valid)
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan

---

### GET /api/anggota/:id
Detail satu anggota berdasarkan ID.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "ANGGOTA",
    "nis": "...",
    "kelas": "...",
    "jenisKelamin": "L",
    "noTelepon": "...",
    "alamat": "...",
    "divisi": { "id": "...", "nama": "..." },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Anggota tidak ditemukan

---

### POST /api/anggota
Tambah anggota baru. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Body:**
```json
{
  "name": "string (min 3 karakter)",
  "email": "string (format email valid)",
  "password": "string (min 8 karakter)",
  "role": "ANGGOTA (opsional, default ANGGOTA)",
  "nis": "string (opsional, unique)",
  "kelas": "string (opsional)",
  "jenisKelamin": "L | P (opsional)",
  "noTelepon": "string (opsional)",
  "alamat": "string (opsional)",
  "divisiId": "string (opsional, UUID divisi — anggota langsung dimasukkan ke divisi)"
}
```

Catatan role: `ADMIN` boleh memberi role `ADMIN`, `KETUA`, atau `ANGGOTA`. Role **`SUPER_ADMIN` hanya boleh diberikan oleh user dengan role `SUPER_ADMIN`** — permintaan dari `ADMIN` yang mencoba memberi/mengubah role ke `SUPER_ADMIN` ditolak `403` (validasi di controller, bukan hanya frontend).

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Anggota berhasil ditambahkan",
  "data": { "id": "...", "name": "...", "email": "...", "role": "...", "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan (termasuk non-SUPER_ADMIN yang mencoba memberi role `SUPER_ADMIN`)
- `404` — Divisi tidak ditemukan (`divisiId` tidak valid)
- `409` — Email atau NIS sudah terdaftar

---

### PUT /api/anggota/:id
Edit data anggota. Semua field opsional. Password tidak bisa diubah lewat endpoint ini. Role `SUPER_ADMIN` atau `ADMIN` saja.

Assign/pindahkan anggota ke divisi dilakukan lewat field `divisiId`: isi dengan UUID divisi untuk memindahkan, isi `null` untuk mengeluarkan anggota dari divisinya.

**Body (semua opsional):**
```json
{
  "name": "string (min 3 karakter)",
  "email": "string (format email valid)",
  "role": "ANGGOTA",
  "nis": "string | null",
  "kelas": "string | null",
  "jenisKelamin": "L | P | null",
  "noTelepon": "string | null",
  "alamat": "string | null",
  "divisiId": "string | null"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Data anggota berhasil diperbarui",
  "data": { "id": "...", "name": "...", "email": "...", "role": "...", "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan (termasuk non-SUPER_ADMIN yang mencoba mengubah role menjadi `SUPER_ADMIN`)
- `404` — Anggota tidak ditemukan / divisi tidak ditemukan (`divisiId` tidak valid)
- `409` — Email atau NIS sudah digunakan

---

### DELETE /api/anggota/:id
Hapus anggota. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Anggota berhasil dihapus"
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Anggota tidak ditemukan

---

## Divisi (CRUD)

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List & Detail** (GET): semua role yang login
> - **Create, Update, Delete** (POST/PUT/DELETE): butuh role `SUPER_ADMIN` atau `ADMIN`

### GET /api/divisi
List semua divisi beserta jumlah anggotanya.

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "nama": "Divisi Humas",
      "deskripsi": "...",
      "jumlahAnggota": 12,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/divisi/:id
Detail satu divisi + daftar anggotanya (urut nama, tanpa `password`).

> **Pembatasan PII**: field sensitif anggota (`email`, `nis`, `jenisKelamin`, `noTelepon`, `alamat`) hanya disertakan untuk role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`. Role lain (mis. `ANGGOTA`) menerima item anggota tanpa field tersebut — hanya `id`, `name`, `role`, `kelas`, `createdAt`, `updatedAt`. Setara dengan gating `/api/anggota` yang ADMIN/KETUA-only.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "nama": "Divisi Humas",
    "deskripsi": "...",
    "createdAt": "...",
    "updatedAt": "...",
    "anggota": [
      {
        "id": "...",
        "name": "...",
        "email": "...",
        "role": "ANGGOTA",
        "nis": "...",
        "kelas": "...",
        "jenisKelamin": "L",
        "noTelepon": "...",
        "alamat": "...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Divisi tidak ditemukan

---

### POST /api/divisi
Tambah divisi baru. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Body:**
```json
{
  "nama": "string (min 3 karakter, unique)",
  "deskripsi": "string (opsional)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Divisi berhasil ditambahkan",
  "data": { "id": "...", "nama": "...", "deskripsi": "...", "createdAt": "...", "updatedAt": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `409` — Nama divisi sudah digunakan

---

### PUT /api/divisi/:id
Edit data divisi. Semua field opsional. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Body (semua opsional):**
```json
{
  "nama": "string (min 3 karakter, unique)",
  "deskripsi": "string | null"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Data divisi berhasil diperbarui",
  "data": { "id": "...", "nama": "...", "deskripsi": "...", "createdAt": "...", "updatedAt": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Divisi tidak ditemukan
- `409` — Nama divisi sudah digunakan oleh divisi lain

---

### DELETE /api/divisi/:id
Hapus divisi. Role `SUPER_ADMIN` atau `ADMIN` saja.

Divisi yang **masih memiliki anggota tidak bisa dihapus** (response `409` berisi jumlah anggotanya) — pindahkan anggotanya terlebih dahulu lewat `PUT /api/anggota/:id` (field `divisiId`).

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Divisi berhasil dihapus"
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Divisi tidak ditemukan
- `409` — Divisi masih memiliki anggota

---

## Dashboard

### GET /api/dashboard/stats
Mengambil statistik ringkasan untuk dashboard. **Butuh autentikasi.**

**Headers:**
```
Authorization: Bearer <token>
```

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "totalAnggota": 42,
    "anggotaPerRole": [
      { "role": "ADMIN", "jumlah": 3 },
      { "role": "ANGGOTA", "jumlah": 35 }
    ],
    "anggotaBaruBulanIni": 5,
    "anggotaTerbaru": [
      { "id": "...", "name": "...", "role": "ANGGOTA", "createdAt": "2026-08-01T..." }
    ],
    "pertumbuhanAnggota": [
      { "bulan": "Maret", "tahun": 2026, "jumlah": 4 }
    ]
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

## Agenda

Semua endpoint agenda butuh header `Authorization: Bearer <token>`.

### GET /api/agenda
Daftar semua agenda, urut berdasarkan `waktuMulai` ascending (terdekat dulu). Termasuk agenda yang sudah lewat. Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "judul": "Rapat Bulanan OSIS",
      "deskripsi": "...",
      "lokasi": "Aula Sekolah",
      "waktuMulai": "2026-08-25T08:00:00.000Z",
      "waktuSelesai": "2026-08-25T10:00:00.000Z",
      "creator": { "id": "...", "name": "..." },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/agenda/upcoming
Agenda terdekat untuk card dashboard — hanya agenda yang **belum selesai** (`waktuMulai >= now` atau `waktuSelesai >= now`, kegiatan yang sedang berjalan tetap masuk), urut `waktuMulai` asc. Semua role yang login.

**Query (opsional):**
- `limit` — jumlah maksimal agenda, default `5`, maksimal `50`

Contoh: `GET /api/agenda/upcoming?limit=3`

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "judul": "Rapat Bulanan OSIS",
      "deskripsi": "...",
      "lokasi": "Aula Sekolah",
      "waktuMulai": "2026-08-25T08:00:00.000Z",
      "waktuSelesai": "2026-08-25T10:00:00.000Z",
      "creator": { "id": "...", "name": "..." },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `400` — Validasi gagal (limit tidak valid)
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/agenda/:id
Detail satu agenda. Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "judul": "Rapat Bulanan OSIS",
    "deskripsi": "...",
    "lokasi": "Aula Sekolah",
    "waktuMulai": "2026-08-25T08:00:00.000Z",
    "waktuSelesai": "2026-08-25T10:00:00.000Z",
    "creator": { "id": "...", "name": "..." },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Agenda tidak ditemukan

---

### POST /api/agenda
Tambah agenda baru. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`. Field `createdBy` diisi otomatis dari token (user yang login), bukan dari body.

**Body:**
```json
{
  "judul": "string (min 3 karakter)",
  "deskripsi": "string (opsional)",
  "lokasi": "string (opsional)",
  "waktuMulai": "string tanggal ISO 8601 (wajib, boleh tanggal masa lalu)",
  "waktuSelesai": "string tanggal ISO 8601 (opsional, harus setelah waktuMulai)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Agenda berhasil ditambahkan",
  "data": { "id": "...", "judul": "...", "waktuMulai": "...", "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal (termasuk `waktuSelesai` yang lebih awal dari `waktuMulai`)
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan

---

### PUT /api/agenda/:id
Edit agenda. Semua field opsional. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Body (semua opsional):**
```json
{
  "judul": "string (min 3 karakter)",
  "deskripsi": "string | null",
  "lokasi": "string | null",
  "waktuMulai": "string tanggal ISO 8601",
  "waktuSelesai": "string | null (tanggal ISO 8601)"
}
```

Catatan: validasi `waktuSelesai > waktuMulai` juga dihitung terhadap nilai lama di database jika hanya salah satu yang dikirim.

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Data agenda berhasil diperbarui",
  "data": { "id": "...", "judul": "...", "waktuMulai": "...", "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Agenda tidak ditemukan

---

### DELETE /api/agenda/:id
Hapus agenda. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Agenda berhasil dihapus"
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Agenda tidak ditemukan


## Pengumuman (CRUD)

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List & Detail** (GET): semua role yang login
> - **Create, Update** (POST/PUT): butuh role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`
> - **Delete**: butuh role `SUPER_ADMIN` atau `ADMIN`

### GET /api/pengumuman
List semua pengumuman, urut `createdAt` descending (terbaru dulu).

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "judul": "Rapat Rutin",
      "isi": "...",
      "creator": { "id": "...", "name": "..." },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/pengumuman/:id
Detail satu pengumuman.

**Response sukses (200):**
```json
{
  "success": true,
  "data": { "id": "...", "judul": "...", "isi": "...", "creator": { "..." }, "createdAt": "...", "updatedAt": "..." }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Pengumuman tidak ditemukan

---

### POST /api/pengumuman
Tambah pengumuman baru. `createdBy` diisi otomatis dari token.

**Body:**
```json
{
  "judul": "string (min 3, max 200 karakter)",
  "isi": "string (min 10, max 5000 karakter)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Pengumuman berhasil ditambahkan",
  "data": { "id": "...", "judul": "...", "isi": "...", "creator": { "..." }, "createdAt": "...", "updatedAt": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan

---

### PUT /api/pengumuman/:id
Edit pengumuman. Semua field opsional.

**Body (semua opsional):**
```json
{
  "judul": "string (min 3, max 200 karakter)",
  "isi": "string (min 10, max 5000 karakter)"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Pengumuman berhasil diperbarui",
  "data": { "id": "...", "judul": "...", "isi": "...", "creator": { "..." }, "createdAt": "...", "updatedAt": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Pengumuman tidak ditemukan

---

### DELETE /api/pengumuman/:id
Hapus pengumuman. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Pengumuman berhasil dihapus"
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Pengumuman tidak ditemukan

---

## Absensi

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **Check-in & riwayat sendiri** (`POST /:agendaId/checkin`, `GET /saya`): semua role yang login
> - **Rekap per agenda & tandai manual** (`GET /agenda/:agendaId`, `POST /:agendaId/tandai`): butuh role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`

### POST /api/absensi/:agendaId/checkin
Check-in kehadiran diri sendiri untuk satu agenda. `userId` diambil dari token (bukan body), status otomatis `HADIR`, `waktuCheckIn` diisi waktu server. Semua role yang login.

Hanya bisa check-in **setelah agenda dimulai** (`waktuMulai <= sekarang` — agenda yang sedang berjalan atau sudah selesai tetap bisa). Satu user hanya bisa check-in sekali per agenda (ditolak `409`).

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Check-in berhasil",
  "data": {
    "id": "...",
    "status": "HADIR",
    "waktuCheckIn": "...",
    "agenda": { "id": "...", "judul": "...", "lokasi": "...", "waktuMulai": "...", "waktuSelesai": "..." },
    "createdAt": "..."
  }
}
```

**Response gagal:**
- `400` — Agenda belum dimulai (check-in belum dibuka)
- `401` — Token tidak ditemukan / tidak valid
- `404` — Agenda tidak ditemukan
- `409` — Sudah check-in untuk agenda ini

---

### GET /api/absensi/saya
Riwayat kehadiran user yang sedang login, urut berdasarkan `waktuMulai` agenda (terbaru dulu). Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "status": "HADIR",
      "waktuCheckIn": "...",
      "agenda": { "id": "...", "judul": "...", "lokasi": "...", "waktuMulai": "...", "waktuSelesai": "..." },
      "createdAt": "..."
    }
  ]
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/absensi/agenda/:agendaId
Rekap kehadiran satu agenda: daftar record absensi (urut `waktuCheckIn` asc) + hitungan per status. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`. Anggota tanpa record tidak muncul di daftar (belum absen).

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "agenda": { "id": "...", "judul": "...", "lokasi": "...", "waktuMulai": "...", "waktuSelesai": "..." },
    "rekap": { "hadir": 12, "izin": 2, "alfa": 1, "totalTercatat": 15 },
    "items": [
      {
        "id": "...",
        "user": { "id": "...", "name": "...", "role": "ANGGOTA", "kelas": "..." },
        "status": "HADIR",
        "waktuCheckIn": "...",
        "createdAt": "..."
      }
    ]
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Agenda tidak ditemukan

---

### POST /api/absensi/:agendaId/tandai
Tandai/koreksi kehadiran seorang user secara manual (mis. izin via WA, lupa check-in). Perilaku upsert: kalau user belum punya record di agenda itu, dibuat; kalau sudah, hanya statusnya yang diubah. Tanpa batasan waktu. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Body:**
```json
{
  "userId": "string (UUID user)",
  "status": "HADIR | IZIN | ALFA"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Kehadiran berhasil ditandai",
  "data": {
    "id": "...",
    "user": { "id": "...", "name": "...", "role": "...", "kelas": "..." },
    "status": "IZIN",
    "waktuCheckIn": "...",
    "createdAt": "..."
  }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Agenda atau user tidak ditemukan

---

## Kas (Transaksi & Laporan)

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List, Detail & Laporan** (GET): semua role yang login
> - **Create, Update** (POST/PUT): butuh role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`
> - **Delete**: butuh role `SUPER_ADMIN` atau `ADMIN`

### GET /api/kas
List transaksi kas dengan paginasi, urut `tanggal` desc (terbaru dulu).

**Query params:**
| Param   | Default       | Keterangan                                   |
|---------|---------------|----------------------------------------------|
| `page`  | 1             | Nomor halaman (min 1)                        |
| `limit` | 10            | Jumlah item per halaman (max 100)            |
| `jenis` | *(kosong)*    | Filter opsional: `PEMASUKAN` / `PENGELUARAN` |

Contoh: `GET /api/kas?page=2&limit=20&jenis=PENGELUARAN`

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "jenis": "PEMASUKAN",
        "jumlah": 50000,
        "keterangan": "Iuran anggota Agustus",
        "tanggal": "2026-08-10T00:00:00.000Z",
        "creator": { "id": "...", "name": "..." },
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 35, "totalPages": 4 }
  }
}
```

**Response gagal:**
- `400` — Validasi gagal (page/limit/jenis tidak valid)
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/kas/laporan
Ringkasan kas: total pemasukan, total pengeluaran, saldo saat ini, plus breakdown per bulan (12 bulan terakhir, untuk grafik). Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "totalPemasukan": 1500000,
    "totalPengeluaran": 700000,
    "saldo": 800000,
    "perBulan": [
      { "bulan": "Agustus", "tahun": 2026, "pemasukan": 500000, "pengeluaran": 200000 }
    ]
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/kas/:id
Detail satu transaksi. Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "jenis": "PENGELUARAN",
    "jumlah": 150000,
    "keterangan": "Pembelian spanduk",
    "tanggal": "2026-08-15T00:00:00.000Z",
    "creator": { "id": "...", "name": "..." },
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Transaksi tidak ditemukan

---

### POST /api/kas
Catat transaksi baru. `createdBy` diisi otomatis dari token. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Body:**
```json
{
  "jenis": "PEMASUKAN | PENGELUARAN",
  "jumlah": 50000,
  "keterangan": "string (min 3, max 200 karakter)",
  "tanggal": "string tanggal ISO 8601 (wajib, boleh tanggal masa lalu)"
}
```

Catatan: `jumlah` selalu positif (rupiah bulat, tanpa sen); arah transaksi ditentukan `jenis`, bukan tanda minus.

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Transaksi berhasil dicatat",
  "data": { "id": "...", "jenis": "...", "jumlah": 50000, "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan

---

### PUT /api/kas/:id
Edit transaksi. Semua field opsional. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Body (semua opsional):**
```json
{
  "jenis": "PEMASUKAN | PENGELUARAN",
  "jumlah": 50000,
  "keterangan": "string (min 3, max 200 karakter)",
  "tanggal": "string tanggal ISO 8601"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Data transaksi berhasil diperbarui",
  "data": { "id": "...", "jenis": "...", "jumlah": 50000, "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Transaksi tidak ditemukan

---

### DELETE /api/kas/:id
Hapus transaksi. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Transaksi berhasil dihapus"
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Transaksi tidak ditemukan

---

## Inventaris (Barang)

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List & Detail** (GET): semua role yang login
> - **Create, Update, Delete** (POST/PUT/DELETE): butuh role `SUPER_ADMIN` atau `ADMIN`

### GET /api/inventaris
List semua barang + `jumlahDipinjam` (total unit dalam peminjaman aktif) dan `stokTersedia` (`jumlah - jumlahDipinjam`), urut nama.

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "nama": "Proyektor",
      "deskripsi": "...",
      "jumlah": 2,
      "kondisi": "BAIK",
      "jumlahDipinjam": 1,
      "stokTersedia": 1,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/inventaris/:id
Detail satu barang + daftar peminjaman aktifnya. Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "nama": "Proyektor",
    "deskripsi": "...",
    "jumlah": 2,
    "kondisi": "BAIK",
    "jumlahDipinjam": 1,
    "stokTersedia": 1,
    "createdAt": "...",
    "updatedAt": "...",
    "peminjaman": [
      {
        "id": "...",
        "jumlah": 1,
        "keperluan": "Pentas seni",
        "tanggalPinjam": "...",
        "user": { "id": "...", "name": "...", "kelas": "..." }
      }
    ]
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Barang tidak ditemukan

---

### POST /api/inventaris
Tambah barang baru. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Body:**
```json
{
  "nama": "string (min 3 karakter, unique)",
  "deskripsi": "string (opsional)",
  "jumlah": 2,
  "kondisi": "BAIK | RUSAK_RINGAN | RUSAK_BERAT (opsional, default BAIK)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Barang berhasil ditambahkan",
  "data": { "id": "...", "nama": "...", "jumlah": 2, "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `409` — Nama barang sudah digunakan

---

### PUT /api/inventaris/:id
Edit barang. Semua field opsional. Role `SUPER_ADMIN` atau `ADMIN` saja.

**Body (semua opsional):**
```json
{
  "nama": "string (min 3 karakter, unique)",
  "deskripsi": "string | null",
  "jumlah": 2,
  "kondisi": "BAIK | RUSAK_RINGAN | RUSAK_BERAT"
}
```

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Data barang berhasil diperbarui",
  "data": { "id": "...", "nama": "...", "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Barang tidak ditemukan
- `409` — Nama barang sudah digunakan oleh barang lain

---

### DELETE /api/inventaris/:id
Hapus barang. Role `SUPER_ADMIN` atau `ADMIN` saja.

Barang yang **masih dipinjam** (ada peminjaman berstatus `DIPINJAM`) tidak bisa dihapus (response `409`) — tunggu dikembalikan. Riwayat peminjaman yang sudah selesai ikut terhapus bersama barang (cascade).

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Barang berhasil dihapus"
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Barang tidak ditemukan
- `409` — Barang masih dipinjam

---

## Peminjaman

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List, Detail, Create** (GET/POST): semua role yang login — anggota mencatat peminjaman untuk dirinya sendiri
> - **Kembalikan**: peminjam sendiri, atau role `SUPER_ADMIN`, `ADMIN`, `KETUA`

### GET /api/peminjaman
Daftar peminjaman (aktif + riwayat), urut `tanggalPinjam` desc. Semua role yang login.

**Query (opsional):**
- `status` — filter: `DIPINJAM` / `DIKEMBALIKAN` (tanpa filter = semua)

Contoh: `GET /api/peminjaman?status=DIPINJAM`

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "barang": { "id": "...", "nama": "Proyektor", "kondisi": "BAIK" },
      "user": { "id": "...", "name": "...", "kelas": "..." },
      "jumlah": 1,
      "keperluan": "Pentas seni",
      "tanggalPinjam": "...",
      "tanggalKembali": null,
      "status": "DIPINJAM",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `400` — Validasi gagal (status tidak valid)
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/peminjaman/:id
Detail satu peminjaman. Semua role yang login.

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Peminjaman tidak ditemukan

---

### POST /api/peminjaman
Catat peminjaman baru. `userId` (peminjam) diisi otomatis dari token; user dengan role `SUPER_ADMIN`, `ADMIN`, atau `KETUA` boleh mengisi `userId` di body untuk mencatatkan peminjaman orang lain. Semua role yang login.

Cek stok dilakukan dalam satu transaksi: `stokTersedia = jumlah barang − Σ jumlah peminjaman aktif`. Stok tidak cukup → `409`; barang `RUSAK_BERAT` tidak bisa dipinjam → `400`.

**Body:**
```json
{
  "barangId": "string (UUID barang)",
  "jumlah": 1,
  "keperluan": "string (opsional, min 3 max 200 karakter)",
  "tanggalPinjam": "string tanggal ISO 8601 (wajib, boleh masa depan)",
  "userId": "string (opsional, UUID — khusus SUPER_ADMIN/ADMIN/KETUA)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Peminjaman berhasil dicatat",
  "data": { "id": "...", "status": "DIPINJAM", "...": "..." }
}
```

**Response gagal:**
- `400` — Validasi gagal / barang rusak berat
- `401` — Token tidak ditemukan / tidak valid
- `404` — Barang atau user tidak ditemukan
- `409` — Stok tidak cukup (pesan menyertakan stok tersedia)

---

### POST /api/peminjaman/:id/kembalikan
Tandai peminjaman selesai: `status` → `DIKEMBALIKAN`, `tanggalKembali` diisi waktu server. Hanya peminjam sendiri atau role `SUPER_ADMIN`, `ADMIN`, `KETUA`.

Ditolak (`409`) jika sudah dikembalikan, dan (`400`) jika `tanggalPinjam` masih di masa depan (menjamin `tanggalKembali > tanggalPinjam`).

**Response sukses (200):**
```json
{
  "success": true,
  "message": "Peminjaman berhasil dikembalikan",
  "data": { "id": "...", "status": "DIKEMBALIKAN", "tanggalKembali": "...", "...": "..." }
}
```

**Response gagal:**
- `400` — Tanggal pinjam masih di masa depan
- `401` — Token tidak ditemukan / tidak valid
- `403` — Bukan peminjam dan bukan SUPER_ADMIN/ADMIN/KETUA
- `404` — Peminjaman tidak ditemukan
- `409` — Sudah dikembalikan

---

## Voting

> Semua endpoint butuh autentikasi (`Authorization: Bearer <token>`).
> - **List, Detail, Vote, Hasil** (GET/POST): semua role yang login
> - **Create, Update, Tutup, Buka** (POST/PUT): butuh role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`
> - **Delete**: butuh role `SUPER_ADMIN` atau `ADMIN`

Hasil per pilihan hanya terlihat **setelah voting ditutup** (menghindari efek mengikuti hasil awal); total suara (turnout) terlihat kapan pun. Suara bersifat anonim di API — tidak ada endpoint yang menampilkan siapa memilih apa.

### GET /api/voting
List semua sesi voting, urut terbaru dibuat. Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "judul": "Pemilihan Ketua OSIS 2026",
      "deskripsi": "...",
      "status": "TERBUKA",
      "ditutupPada": null,
      "creator": { "id": "...", "name": "..." },
      "jumlahPilihan": 3,
      "totalSuara": 17,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid

---

### GET /api/voting/:id
Detail sesi voting. Saat `TERBUKA`: daftar pilihan **tanpa** jumlah suara + flag `sudahVoting` untuk user yang login. Saat `DITUTUP`: tiap pilihan menyertakan `jumlah`. Semua role yang login.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "judul": "Pemilihan Ketua OSIS 2026",
    "deskripsi": "...",
    "status": "TERBUKA",
    "ditutupPada": null,
    "creator": { "id": "...", "name": "..." },
    "sudahVoting": false,
    "totalSuara": 17,
    "pilihan": [{ "id": "...", "teks": "Kandidat A", "urutan": 0 }],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `404` — Sesi voting tidak ditemukan

---

### POST /api/voting
Buat sesi voting baru (langsung berstatus `TERBUKA`). Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Body:**
```json
{
  "judul": "string (min 3, max 200 karakter)",
  "deskripsi": "string (opsional)",
  "pilihan": ["string (2-10 item, masing-masing 1-100 karakter, tanpa duplikat)"]
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Sesi voting berhasil dibuat",
  "data": {
    "id": "...",
    "judul": "...",
    "status": "TERBUKA",
    "pilihan": [{ "id": "...", "teks": "Kandidat A", "urutan": 0 }],
    "...": "..."
  }
}
```

**Response gagal:**
- `400` — Validasi gagal (termasuk pilihan < 2 atau duplikat)
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan

---

### PUT /api/voting/:id
Edit sesi: `judul`/`deskripsi` kapan pun; `pilihan` (replace semua) hanya jika belum ada suara masuk, selain itu `409`. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Body (semua opsional):**
```json
{
  "judul": "string (min 3, max 200 karakter)",
  "deskripsi": "string | null",
  "pilihan": ["string (2-10 item)"]
}
```

**Response gagal:**
- `400` — Validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Sesi voting tidak ditemukan
- `409` — Pilihan tidak bisa diubah karena sudah ada suara

---

### DELETE /api/voting/:id
Hapus sesi voting beserta seluruh pilihan dan suaranya (cascade). Role `SUPER_ADMIN` atau `ADMIN` saja.

**Response gagal:**
- `401` — Token tidak ditemukan / tidak valid
- `403` — Role tidak diizinkan
- `404` — Sesi voting tidak ditemukan

---

### POST /api/voting/:id/tutup
Tutup voting: `status` → `DITUTUP`, `ditutupPada` diisi waktu server. Setelah ini hasil bisa dilihat. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Response gagal:**
- `401` / `403` / `404`
- `409` — Voting ini sudah ditutup

---

### POST /api/voting/:id/buka
Buka kembali voting yang sudah ditutup. Role `SUPER_ADMIN`, `ADMIN`, atau `KETUA`.

**Response gagal:**
- `401` / `403` / `404`
- `409` — Voting ini masih terbuka

---

### POST /api/voting/:id/vote
Berikan satu suara. `userId` diambil dari token. Semua role yang login.

**Body:**
```json
{
  "pilihanId": "string (ID pilihan dalam sesi ini)"
}
```

**Response sukses (201):**
```json
{
  "success": true,
  "message": "Suara berhasil diberikan",
  "data": { "pilihanId": "...", "teks": "Kandidat A" }
}
```

**Response gagal:**
- `400` — Voting sudah ditutup / pilihan tidak valid untuk sesi ini / validasi gagal
- `401` — Token tidak ditemukan / tidak valid
- `404` — Sesi voting tidak ditemukan
- `409` — Kamu sudah memberikan suara untuk voting ini

---

### GET /api/voting/:id/hasil
Hasil akhir: jumlah suara per pilihan, urut jumlah terbanyak. Semua role yang login — hanya saat `DITUTUP`, selama `TERBUKA` ditolak `400`.

**Response sukses (200):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "judul": "Pemilihan Ketua OSIS 2026",
    "status": "DITUTUP",
    "ditutupPada": "...",
    "totalSuara": 25,
    "hasil": [
      { "id": "...", "teks": "Kandidat A", "urutan": 0, "jumlah": 15 },
      { "id": "...", "teks": "Kandidat B", "urutan": 1, "jumlah": 10 }
    ]
  }
}
```

**Response gagal:**
- `400` — Hasil belum bisa dilihat — voting masih terbuka
- `401` — Token tidak ditemukan / tidak valid
- `404` — Sesi voting tidak ditemukan