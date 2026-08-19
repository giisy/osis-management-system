import { z } from 'zod'

export const createAnggotaSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'KETUA', 'ANGGOTA']).optional(),
  nis: z
    .string()
    .regex(/^\d{6,}$/, 'NIS harus berupa angka minimal 6 digit')
    .optional(),
  kelas: z.string().min(1, 'Kelas tidak boleh kosong').optional(),
  jenisKelamin: z.enum(['L', 'P']).optional(),
  noTelepon: z.string().min(1, 'Nomor telepon tidak boleh kosong').optional(),
  alamat: z.string().min(1, 'Alamat tidak boleh kosong').optional(),
  divisiId: z.string().uuid('ID divisi tidak valid').nullable().optional(),
})

export const updateAnggotaSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  email: z.string().email('Email tidak valid').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'KETUA', 'ANGGOTA']).optional(),
  nis: z
    .string()
    .regex(/^\d{6,}$/, 'NIS harus berupa angka minimal 6 digit')
    .nullable()
    .optional(),
  kelas: z.string().min(1, 'Kelas tidak boleh kosong').nullable().optional(),
  jenisKelamin: z.enum(['L', 'P']).nullable().optional(),
  noTelepon: z.string().min(1, 'Nomor telepon tidak boleh kosong').nullable().optional(),
  alamat: z.string().min(1, 'Alamat tidak boleh kosong').nullable().optional(),
  divisiId: z.string().uuid('ID divisi tidak valid').nullable().optional(),
})

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(100)),
})
