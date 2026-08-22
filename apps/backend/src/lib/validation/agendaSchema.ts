import { z } from 'zod'

export const createAgendaSchema = z
  .object({
    judul: z.string().min(3, 'Judul minimal 3 karakter'),
    deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').optional(),
    lokasi: z.string().min(1, 'Lokasi tidak boleh kosong').optional(),
    waktuMulai: z.coerce.date({ message: 'Waktu mulai tidak valid' }),
    waktuSelesai: z.coerce.date({ message: 'Waktu selesai tidak valid' }).optional(),
  })
  .refine((data) => !data.waktuSelesai || data.waktuSelesai > data.waktuMulai, {
    message: 'Waktu selesai harus setelah waktu mulai',
    path: ['waktuSelesai'],
  })

export const updateAgendaSchema = z
  .object({
    judul: z.string().min(3, 'Judul minimal 3 karakter').optional(),
    deskripsi: z.string().min(1, 'Deskripsi tidak boleh kosong').nullable().optional(),
    lokasi: z.string().min(1, 'Lokasi tidak boleh kosong').nullable().optional(),
    waktuMulai: z.coerce.date({ message: 'Waktu mulai tidak valid' }).optional(),
    waktuSelesai: z.coerce.date({ message: 'Waktu selesai tidak valid' }).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.waktuSelesai === undefined || data.waktuSelesai === null) return true
      if (data.waktuMulai !== undefined) return data.waktuSelesai > data.waktuMulai
      return true
    },
    {
      message: 'Waktu selesai harus setelah waktu mulai',
      path: ['waktuSelesai'],
    },
  )

export const upcomingQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 5))
    .pipe(z.number().int().min(1).max(50)),
})
