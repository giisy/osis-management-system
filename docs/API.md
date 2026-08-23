# API Endpoints

## Authentication

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
- `403` — Role tidak diizinkan
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
- `403` — Role tidak diizinkan
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