import { z } from 'zod'

export const createBarangSchema = z.object({
  nama: z.string().min(3, 'Nama barang minimal 3 karakter'),
  deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').optional(),
  jumlah: z
    .number()
    .int('Jumlah harus berupa bilangan bulat')
    .min(1, 'Jumlah minimal 1')
    .max(100000, 'Jumlah terlalu besar'),
  kondisi: z.enum(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT']).optional(),
})

export const updateBarangSchema = z.object({
  nama: z.string().min(3, 'Nama barang minimal 3 karakter').optional(),
  deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').nullable().optional(),
  jumlah: z
    .number()
    .int('Jumlah harus berupa bilangan bulat')
    .min(1, 'Jumlah minimal 1')
    .max(100000, 'Jumlah terlalu besar')
    .optional(),
  kondisi: z.enum(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT']).optional(),
})

export const peminjamanQuerySchema = z.object({
  status: z.enum(['DIPINJAM', 'DIKEMBALIKAN']).optional(),
})

export const createPeminjamanSchema = z.object({
  barangId: z.string().min(1, 'ID barang wajib diisi'),
  jumlah: z
    .number()
    .int('Jumlah harus berupa bilangan bulat')
    .min(1, 'Jumlah pinjam minimal 1'),
  keperluan: z.string().min(3, 'Keperluan minimal 3 karakter').max(200, 'Keperluan maksimal 200 karakter').optional(),
  tanggalPinjam: z.coerce.date({ message: 'Tanggal pinjam tidak valid' }),
  userId: z.string().uuid('ID user tidak valid').optional(),
})
