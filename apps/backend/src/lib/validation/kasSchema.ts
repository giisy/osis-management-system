import { z } from 'zod'

export const kasQuerySchema = z.object({
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
  jenis: z.enum(['PEMASUKAN', 'PENGELUARAN']).optional(),
})

export const createTransaksiSchema = z.object({
  jenis: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  jumlah: z
    .number()
    .int('Jumlah harus berupa bilangan bulat')
    .min(1, 'Jumlah harus lebih dari 0')
    .max(2000000000, 'Jumlah terlalu besar'),
  keterangan: z
    .string()
    .min(3, 'Keterangan minimal 3 karakter')
    .max(200, 'Keterangan maksimal 200 karakter'),
  tanggal: z.coerce.date({ message: 'Tanggal tidak valid' }),
})

export const updateTransaksiSchema = z.object({
  jenis: z.enum(['PEMASUKAN', 'PENGELUARAN']).optional(),
  jumlah: z
    .number()
    .int('Jumlah harus berupa bilangan bulat')
    .min(1, 'Jumlah harus lebih dari 0')
    .max(2000000000, 'Jumlah terlalu besar')
    .optional(),
  keterangan: z
    .string()
    .min(3, 'Keterangan minimal 3 karakter')
    .max(200, 'Keterangan maksimal 200 karakter')
    .optional(),
  tanggal: z.coerce.date({ message: 'Tanggal tidak valid' }).optional(),
})
