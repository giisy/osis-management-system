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